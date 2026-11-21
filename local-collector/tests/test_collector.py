import unittest
import os
import sys
import tempfile
import json
import hashlib

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from privacy.redaction import PrivacyGuard
from privacy.allowlist import project_approved_payload
from detection.thresholds import classify_health
from detection.anomaly import DynamicSamplingEngine
from storage.ledger import CryptographicLedger, GENESIS_PREV_HASH
from storage.queue import SQLiteOutbox

class TestCicadaCollector(unittest.TestCase):
    def setUp(self):
        self.temp_db = tempfile.NamedTemporaryFile(delete=False, suffix=".db")
        self.db_path = self.temp_db.name
        self.temp_db.close()

    def tearDown(self):
        try:
            if os.path.exists(self.db_path):
                os.remove(self.db_path)
        except Exception:
            pass

    def test_privacy_redaction_and_pseudonymization(self):
        guard = PrivacyGuard(salt="test_salt_123")
        sensitive_raw = (
            "User alice.smith@bankcorp.com failed login with password=SecretPassword123! "
            "from IP 10.14.22.99 using Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
        )
        redacted_text, count = guard.redact_text(sensitive_raw)
        
        self.assertNotIn("alice.smith@bankcorp.com", redacted_text)
        self.assertNotIn("SecretPassword123!", redacted_text)
        self.assertNotIn("10.14.22.99", redacted_text)
        self.assertIn("[REDACTED_EMAIL]", redacted_text)
        self.assertIn("[REDACTED_IP]", redacted_text)
        self.assertGreater(count, 0)

        # Pseudonymous actor token must be deterministic for same salt, but hide real email
        actor1 = guard.generate_pseudonymous_actor("alice.smith@bankcorp.com")
        actor2 = guard.generate_pseudonymous_actor("alice.smith@bankcorp.com")
        self.assertEqual(actor1, actor2)
        self.assertTrue(actor1.startswith("actor_"))
        self.assertNotIn("alice", actor1)

    def test_strict_allowlist_projection(self):
        # Even if raw input dictionary contains sensitive keys or arbitrary fields,
        # project_approved_payload must completely discard them!
        raw_dirty_input = {
            "payload_id": "PAY-20261120-0001",
            "sequence_num": 1,
            "tenant_id": "TENANT-FINTECH-01",
            "source_id": "PROD-APP-SERVER-01",
            "timestamp_utc": "2026-11-20T10:00:00Z",
            "sampling_mode": "HEARTBEAT",
            "health_state": "EXCELLENT",
            "metrics": {
                "cpu_pct": 24.5,
                "ram_pct": 42.1,
                "disk_pct": 35.0,
                "latency_ms": 32.0,
                "secret_server_token": "LEAKED_KEY_SHOULD_BE_DROPPED"  # Bad field!
            },
            "security_summary": {
                "auth_failures_1m": 0,
                "pseudonymous_actor": "actor_7a1b9c",
                "pii_redacted_count": 0,
                "raw_password": "PlaintextPassword123"  # Bad field!
            },
            "previous_hash": "0" * 64,
            "payload_hash": "a" * 64
        }

        approved = project_approved_payload(
            payload_id=raw_dirty_input["payload_id"],
            sequence_num=raw_dirty_input["sequence_num"],
            tenant_id=raw_dirty_input["tenant_id"],
            source_id=raw_dirty_input["source_id"],
            timestamp_utc=raw_dirty_input["timestamp_utc"],
            sampling_mode=raw_dirty_input["sampling_mode"],
            health_state=raw_dirty_input["health_state"],
            metrics=raw_dirty_input["metrics"],
            security_summary=raw_dirty_input["security_summary"],
            previous_hash=raw_dirty_input["previous_hash"],
            payload_hash=raw_dirty_input["payload_hash"]
        )

        self.assertNotIn("secret_server_token", approved["metrics"])
        self.assertNotIn("raw_password", approved["security_summary"])
        self.assertEqual(approved["egress_audit"]["raw_logs_transmitted"], 0)
        self.assertEqual(approved["egress_audit"]["sensitive_fields_detected"], 0)

    def test_health_classification_and_dynamic_sampling(self):
        # Healthy metrics -> EXCELLENT -> HEARTBEAT
        healthy_metrics = {"cpu_pct": 32.0, "ram_pct": 45.0, "latency_ms": 35.0}
        health, _ = classify_health(healthy_metrics)
        self.assertEqual(health, "EXCELLENT")

        sampler = DynamicSamplingEngine()
        mode, _ = sampler.evaluate_sampling_mode(health, healthy_metrics)
        self.assertEqual(mode, "HEARTBEAT")

        # Critical CPU Spike -> POOR -> ANOMALY_BURST
        spiked_metrics = {"cpu_pct": 96.4, "ram_pct": 50.0, "latency_ms": 35.0}
        health, reasons = classify_health(spiked_metrics)
        self.assertEqual(health, "POOR")
        self.assertTrue(any("Critical CPU" in r for r in reasons))

        mode, _ = sampler.evaluate_sampling_mode(health, spiked_metrics)
        self.assertEqual(mode, "ANOMALY_BURST")

    def test_cryptographic_ledger_and_tamper_detection(self):
        ledger = CryptographicLedger(db_path=self.db_path, chain_id="CHAIN-TEST-001")
        
        # Add 3 sequential entries
        prev_h = GENESIS_PREV_HASH
        for seq in range(1, 4):
            payload_data = {"test_seq": seq}
            p_hash = hashlib.sha256(json.dumps(payload_data).encode('utf-8')).hexdigest()
            prev_recorded, entry_h = ledger.record_entry(seq, f"PAY-{seq}", p_hash, payload_data, "2026-11-20T10:00:00Z")
            self.assertEqual(prev_recorded, prev_h)
            prev_h = entry_h

        # Verification must pass
        verify_result = ledger.verify_ledger()
        self.assertTrue(verify_result["valid"])
        self.assertEqual(verify_result["entries_checked"], 3)

        # Now simulate tampering with entry sequence 2
        import sqlite3
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE cryptographic_ledger SET payload_hash = 'tampered_hash_value' WHERE sequence_num = 2")
            conn.commit()

        # Verification must now fail and report sequence 2!
        tampered_result = ledger.verify_ledger()
        self.assertFalse(tampered_result["valid"])
        self.assertEqual(tampered_result["broken_sequence"], 2)

    def test_sqlite_outbox_queue_resilience(self):
        outbox = SQLiteOutbox(db_path=self.db_path)
        seq1 = outbox.get_next_sequence()
        seq2 = outbox.get_next_sequence()
        self.assertEqual(seq1, 1)
        self.assertEqual(seq2, 2)

        outbox.enqueue("PAY-001", 1, json.dumps({"test": 1}))
        outbox.enqueue("PAY-002", 2, json.dumps({"test": 2}))

        self.assertEqual(outbox.get_queue_depth(), 2)
        
        pending = outbox.get_pending()
        self.assertEqual(len(pending), 2)
        self.assertEqual(pending[0][1], "PAY-001")

        # Acknowledge first
        outbox.mark_acknowledged("PAY-001")
        self.assertEqual(outbox.get_queue_depth(), 1)

if __name__ == '__main__':
    unittest.main()
