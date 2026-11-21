"""
Strict Allow-List Gate:
Constructs a brand new Python dict containing ONLY permitted fields according to the schema.
Unknown fields, raw logs, emails, passwords, and arbitrary inputs are completely discarded.
"""

def project_approved_payload(
    payload_id: str,
    sequence_num: int,
    tenant_id: str,
    source_id: str,
    timestamp_utc: str,
    sampling_mode: str,
    health_state: str,
    metrics: dict,
    security_summary: dict,
    previous_hash: str,
    payload_hash: str
) -> dict:
    # Strictly filtered metrics object
    safe_metrics = {
        "cpu_pct": float(metrics.get("cpu_pct", 0.0)),
        "ram_pct": float(metrics.get("ram_pct", 0.0)),
        "disk_pct": float(metrics.get("disk_pct", 0.0)),
        "latency_ms": float(metrics.get("latency_ms", 0.0)),
        "packet_loss_pct": float(metrics.get("packet_loss_pct", 0.0)),
        "net_rx_bps": float(metrics.get("net_rx_bps", 0.0)),
        "net_tx_bps": float(metrics.get("net_tx_bps", 0.0))
    }

    # Strictly filtered security summary
    safe_sec = {
        "auth_failures_1m": int(security_summary.get("auth_failures_1m", 0)),
        "pseudonymous_actor": str(security_summary.get("pseudonymous_actor", "actor_000000")),
        "pii_redacted_count": int(security_summary.get("pii_redacted_count", 0))
    }
    if "attack_flag" in security_summary:
        safe_sec["attack_flag"] = bool(security_summary["attack_flag"])

    # Strictly filtered egress audit
    safe_audit = {
        "raw_logs_transmitted": 0,
        "sensitive_fields_detected": 0,
        "previous_hash": str(previous_hash),
        "payload_hash": str(payload_hash)
    }

    # Return only approved schema structure
    return {
        "payload_id": payload_id,
        "sequence_num": sequence_num,
        "tenant_id": tenant_id,
        "source_id": source_id,
        "timestamp_utc": timestamp_utc,
        "sampling_mode": sampling_mode,
        "health_state": health_state,
        "metrics": safe_metrics,
        "security_summary": safe_sec,
        "egress_audit": safe_audit
    }
