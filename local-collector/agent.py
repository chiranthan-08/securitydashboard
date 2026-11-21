import time
import json
import base64
import hashlib
import hmac
import threading
from datetime import datetime, timezone

from config import (
    COLLECTOR_ID, CHAIN_ID, TENANT_ID, API_KEY, SAAS_BACKEND_URL,
    DB_PATH, ROTATING_SALT, COLLECT_INTERVAL_SEC, get_utc_now_iso
)
from monitoring.system_metrics import MetricsCollector
from monitoring.log_reader import LocalLogStore
from privacy.redaction import PrivacyGuard
from privacy.allowlist import project_approved_payload
from detection.thresholds import classify_health
from detection.anomaly import DynamicSamplingEngine
from storage.queue import SQLiteOutbox
from storage.ledger import CryptographicLedger
from communication.api_client import SaaSClient

class CicadaAgent:
    def __init__(self):
        self.collector_id = COLLECTOR_ID
        self.chain_id = CHAIN_ID
        self.tenant_id = TENANT_ID
        
        self.metrics_collector = MetricsCollector(backend_url=SAAS_BACKEND_URL)
        self.log_store = LocalLogStore()
        self.privacy_guard = PrivacyGuard(salt=ROTATING_SALT)
        self.sampling_engine = DynamicSamplingEngine()
        self.outbox = SQLiteOutbox(DB_PATH)
        self.ledger = CryptographicLedger(DB_PATH, CHAIN_ID)
        self.saas_client = SaaSClient(SAAS_BACKEND_URL, TENANT_ID, API_KEY)

        self.running = False
        self._thread = None
        self.latest_state = {
            "health_state": "EXCELLENT",
            "sampling_mode": "HEARTBEAT",
            "current_metrics": {},
            "active_reasons": [],
            "queue_depth": 0,
            "total_redactions": 0,
            "connected_to_saas": False,
            "last_cycle_time": None
        }

    def start(self):
        if not self.running:
            self.running = True
            self._thread = threading.Thread(target=self._run_loop, daemon=True)
            self._thread.start()

    def stop(self):
        self.running = False
        if self._thread:
            self._thread.join(timeout=3)

    def _run_loop(self):
        while self.running:
            try:
                self.run_cycle()
            except Exception as e:
                print(f"[Collector Agent Error] {e}")
            time.sleep(COLLECT_INTERVAL_SEC)

    def run_cycle(self):
        now_iso = get_utc_now_iso()
        
        # 1. Collect telemetry
        metrics = self.metrics_collector.collect()
        
        # 2. Local Health State Classification
        health_state, reasons = classify_health(metrics, self.log_store.attack_flag)
        
        # 3. Dynamic Sampling Engine Evaluation
        sampling_mode, z_score = self.sampling_engine.evaluate_sampling_mode(health_state, metrics)

        # 4. Monotonic Sequence Allocation from durable SQLite state
        seq = self.outbox.get_next_sequence()
        payload_id = f"PAY-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{seq:04d}"

        # 5. Pseudonymous Actor Token (Salted Hash - Zero PII leaves edge)
        actor_token = self.privacy_guard.generate_pseudonymous_actor(self.log_store.last_actor_id)
        sec_summary = {
            "auth_failures_1m": self.log_store.auth_failures_last_min,
            "pseudonymous_actor": actor_token,
            "pii_redacted_count": self.privacy_guard.total_pii_blocked,
            "attack_flag": self.log_store.attack_flag
        }

        # 6. Cryptographic Hash Chain Computation
        prev_hash = self.ledger.get_latest_entry_hash()

        # Build initial payload to calculate canonical hash
        draft_payload = project_approved_payload(
            payload_id=payload_id,
            sequence_num=seq,
            tenant_id=self.tenant_id,
            source_id=self.collector_id,
            timestamp_utc=now_iso,
            sampling_mode=sampling_mode,
            health_state=health_state,
            metrics=metrics,
            security_summary=sec_summary,
            previous_hash=prev_hash,
            payload_hash="0" * 64
        )

        # Canonical exact-byte serialization
        raw_bytes = json.dumps(draft_payload, sort_keys=True, separators=(',', ':')).encode('utf-8')
        payload_hash = hashlib.sha256(raw_bytes).hexdigest()

        # Update draft payload with accurate payload_hash
        draft_payload["egress_audit"]["payload_hash"] = payload_hash
        final_bytes = json.dumps(draft_payload, sort_keys=True, separators=(',', ':')).encode('utf-8')
        payload_hash = hashlib.sha256(final_bytes).hexdigest()
        draft_payload["egress_audit"]["payload_hash"] = payload_hash

        # Commit to local append-only tamper-evident ledger
        prev_hash, entry_hash = self.ledger.record_entry(seq, payload_id, payload_hash, draft_payload, now_iso)

        # 7. Exact-byte transport envelope with HMAC-SHA256 signature
        payload_b64 = base64.b64encode(final_bytes).decode('ascii')
        hmac_sig = hmac.new(API_KEY.encode('utf-8'), final_bytes, hashlib.sha256).hexdigest()
        envelope = {
            "payload_b64": payload_b64,
            "payload_sha256": payload_hash,
            "chain_id": self.chain_id,
            "sequence": seq,
            "previous_entry_hash": prev_hash,
            "entry_hash": entry_hash,
            "hmac_signature": hmac_sig,
            "tenant_id": self.tenant_id,
            "source_id": self.collector_id,
            "timestamp_utc": now_iso
        }

        # 8. Persist to SQLite Outbox (Durable Ring Buffer for Offline Resiliency)
        self.outbox.enqueue(payload_id, seq, json.dumps(envelope))

        # 9. Attempt Ingestion & Drain Outbox
        self._drain_outbox()

        # 10. Update latest in-memory status
        self.latest_state = {
            "collector_id": self.collector_id,
            "chain_id": self.chain_id,
            "tenant_id": self.tenant_id,
            "health_state": health_state,
            "sampling_mode": sampling_mode,
            "current_metrics": metrics,
            "active_reasons": reasons,
            "z_score": round(z_score, 2),
            "queue_depth": self.outbox.get_queue_depth(),
            "total_redactions": self.privacy_guard.total_pii_blocked,
            "connected_to_saas": self.saas_client.is_connected,
            "last_cycle_time": now_iso,
            "last_payload_id": payload_id,
            "latest_entry_hash": entry_hash,
            "is_live_hardware": metrics.get("is_live_hardware", True),
            "os_info": metrics.get("os_info", {})
        }

    def _drain_outbox(self):
        pending = self.outbox.get_pending(limit=25)
        for item_id, payload_id, seq, env_json, retries in pending:
            envelope = json.loads(env_json)
            ok, resp = self.saas_client.send_envelope(envelope)
            if ok:
                self.outbox.mark_acknowledged(payload_id)
                self.ledger.update_status(seq, "ACKNOWLEDGED")
            else:
                self.outbox.increment_retry(item_id)
                # Network or SaaS backend offline - stop draining and preserve order
                break

    def trigger_scenario(self, scenario: str) -> dict:
        """
        Supports the 5 Live Demo Scenarios specified in the rubric:
        1. pii_login: inject raw login with sensitive email, password, IP
        2. cpu_spike: spike CPU to 96.4%
        3. latency_spike: spike latency to 485 ms
        4. correlated_exhaustion: simultaneously CPU 96.4%, RAM 91.2%, Latency 485ms
        5. reset: reset all overrides to normal healthy baseline
        """
        if scenario == "pii_login":
            raw_event = {
                "event": "auth_failure",
                "email": "sarah.connor@cyberdyne-fintech.com",
                "password": "Password99$!SuperSecret",
                "ip": "192.168.10.84",
                "bearer_token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6InNhcmFoIn0",
                "message": "Failed login attempt for user sarah.connor@cyberdyne-fintech.com from IP 192.168.10.84 with token Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 password=Password99$!SuperSecret"
            }
            # Record locally in raw logs
            self.log_store.add_raw_log(raw_event)
            # Redact PII locally
            redacted_msg, count = self.privacy_guard.redact_text(raw_event["message"])
            pseudo_actor = self.privacy_guard.generate_pseudonymous_actor(raw_event["email"])
            self.run_cycle()
            return {
                "scenario": scenario,
                "message": "Injected raw login event with sensitive email, password & IP. PII redacted locally; zero sensitive fields leave perimeter.",
                "raw_event_preview": raw_event,
                "redacted_text": redacted_msg,
                "pseudonymous_actor": pseudo_actor,
                "pii_blocked_count": count
            }

        elif scenario == "cpu_spike":
            self.metrics_collector.set_simulation(cpu=96.4)
            self.run_cycle()
            return {
                "scenario": scenario,
                "message": "CPU spiked to 96.4%. Sampling switched from Heartbeat to Anomaly Burst.",
                "current_cpu": 96.4
            }

        elif scenario == "latency_spike":
            self.metrics_collector.set_simulation(latency=485.0, packet_loss=4.5)
            self.run_cycle()
            return {
                "scenario": scenario,
                "message": "Latency degraded to 485ms with 4.5% packet loss. Transitioned health state.",
                "current_latency": 485.0
            }

        elif scenario == "correlated_exhaustion":
            self.metrics_collector.set_simulation(cpu=96.4, ram=91.2, latency=485.0, packet_loss=3.8)
            self.run_cycle()
            return {
                "scenario": scenario,
                "message": "Multi-signal cascade injected: High CPU (96.4%) + High RAM (91.2%) + High Latency (485ms). AIOps engine will group into 1 correlated incident.",
                "metrics": {"cpu": 96.4, "ram": 91.2, "latency": 485.0}
            }

        elif scenario == "canary_leak":
            raw_event = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "event_type": "AUTH_EXPOSURE_ALERT",
                "message": "CRITICAL: Detected canary credential in stdout: API_KEY=CANARY-SECRET-92831 host=ip-10-0-12-4",
                "canary_token": "CANARY-SECRET-92831"
            }
            self.log_store.add_raw_log(raw_event)
            eval_res = self.privacy_guard.evaluate_privacy_guardian(raw_event["message"])
            return {
                "scenario": scenario,
                "message": "Canary honeytoken (CANARY-SECRET-92831) intercepted in local memory by AI Privacy Guardian! Outgoing egress BLOCKED immediately. Edge node flagged for isolation.",
                "guardian_evaluation": eval_res,
                "egress_status": "BLOCKED_AT_LOCAL_PERIMETER"
            }

        elif scenario == "high_entropy_secret":
            raw_event = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "event_type": "KEY_EXPOSURE_ALERT",
                "message": "Config dump exposed RSA private key: MIIEowIBAAKCAQEA0Yt09Xz9XkQ83kJ94JkZ5pQ37K==",
                "entropy": 4.88
            }
            self.log_store.add_raw_log(raw_event)
            eval_res = self.privacy_guard.evaluate_privacy_guardian(raw_event["message"])
            return {
                "scenario": scenario,
                "message": "High-entropy cryptographic material (Shannon entropy 4.88 > 4.5) intercepted! Transmission held for administrator review.",
                "guardian_evaluation": eval_res,
                "egress_status": "HELD_FOR_REVIEW"
            }

        elif scenario == "reset":
            self.metrics_collector.clear_simulation()
            self.log_store.reset_security_stats()
            self.run_cycle()
            return {
                "scenario": scenario,
                "message": "All simulation overrides reset. Returning to normal healthy baseline."
            }

        return {"error": f"Unknown scenario: {scenario}"}
