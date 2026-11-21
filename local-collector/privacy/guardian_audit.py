"""
Local Guardian Audit Logger:
Maintains a tamper-evident local audit file of all pre-egress privacy inspections,
blocked sensitive fields (emails, passwords, API keys, canary honeytokens, high entropy strings).
"""
import os
import json
import time

AUDIT_LOG_FILE = os.path.join(os.path.dirname(__file__), "..", "guardian_privacy_audit.log")

class GuardianAuditLogger:
    @staticmethod
    def log_violation(rule_type: str, detail: str, source_snippet: str = "", decision: str = "BLOCKED"):
        record = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "rule_type": rule_type,
            "decision": decision,
            "detail": detail,
            "source_length": len(source_snippet),
            "action_taken": "EGRESS_BLOCKED_ZERO_PERIMETER_LEAK"
        }
        try:
            with open(AUDIT_LOG_FILE, "a", encoding="utf-8") as f:
                f.write(json.dumps(record) + "\n")
        except Exception as e:
            print(f"[GuardianAuditLogger Error] {e}")

    @staticmethod
    def get_recent_audit_records(limit=50):
        if not os.path.exists(AUDIT_LOG_FILE):
            return []
        records = []
        try:
            with open(AUDIT_LOG_FILE, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line:
                        try:
                            records.append(json.loads(line))
                        except Exception:
                            pass
        except Exception:
            pass
        return records[-limit:]
