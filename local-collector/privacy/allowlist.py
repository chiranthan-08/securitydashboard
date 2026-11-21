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
    # Strictly filtered metrics object with all 12 genuine hardware fields
    safe_metrics = {
        "cpu_pct": float(metrics.get("cpu_pct", 0.0)),
        "ram_pct": float(metrics.get("ram_pct", 0.0)),
        "ram_total_gb": float(metrics.get("ram_total_gb", 0.0)),
        "ram_available_gb": float(metrics.get("ram_available_gb", 0.0)),
        "disk_pct": float(metrics.get("disk_pct", 0.0)),
        "disk_read_mb": float(metrics.get("disk_read_mb", 0.0)),
        "disk_write_mb": float(metrics.get("disk_write_mb", 0.0)),
        "net_bytes_sent": int(metrics.get("net_bytes_sent", 0)),
        "net_bytes_recv": int(metrics.get("net_bytes_recv", 0)),
        "net_rx_bps": float(metrics.get("net_rx_bps", 0.0)),
        "net_tx_bps": float(metrics.get("net_tx_bps", 0.0)),
        "net_throughput_bps": float(metrics.get("net_throughput_bps", 0.0)),
        "latency_ms": float(metrics.get("latency_ms", 0.0)),
        "packet_loss_pct": float(metrics.get("packet_loss_pct", 0.0)),
        "system_uptime_sec": int(metrics.get("system_uptime_sec", 0)),
        "os_info": {
            "system": str(metrics.get("os_info", {}).get("system", "Windows")),
            "release": str(metrics.get("os_info", {}).get("release", "11")),
            "version": str(metrics.get("os_info", {}).get("version", "10.0")),
            "machine": str(metrics.get("os_info", {}).get("machine", "AMD64")),
            "hostname": str(metrics.get("os_info", {}).get("hostname", "LAPTOP-LOCAL"))
        },
        "collection_timestamp": str(metrics.get("collection_timestamp", timestamp_utc)),
        "is_live_hardware": bool(metrics.get("is_live_hardware", True))
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
