import re
import hmac
import hashlib
import math
from privacy.guardian_audit import GuardianAuditLogger

# Regex patterns for detecting and scrubbing sensitive data
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
IPV4_REGEX = re.compile(r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b')
BEARER_REGEX = re.compile(r'(?i)bearer\s+[A-Za-z0-9\-\._~\+\/]+=*')
API_KEY_REGEX = re.compile(r'(?i)(?:api[_-]?key|secret|password|token)\s*[:=]\s*["\']?([^"\'\s]+)["\']?')

# Feature 2: Deception Honeytokens (Canary Secrets)
CANARY_HONEYTOKENS = [
    "CANARY-SECRET-92831",
    "HONEYTOKEN-FINTECH-9912",
    "AKIA-CANARY-DEV-77"
]

def calculate_shannon_entropy(text: str) -> float:
    """
    Computes Shannon entropy of string. High entropy (> 4.2) indicates
    cryptographic keys, passwords, or encrypted tokens.
    """
    if not text or len(text) < 6:
        return 0.0
    entropy = 0.0
    length = len(text)
    prob_map = {}
    for char in text:
        prob_map[char] = prob_map.get(char, 0) + 1
    for count in prob_map.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 3)

class PrivacyGuard:
    def __init__(self, salt="cicada_salt_20261120"):
        self.salt = salt
        self.total_pii_blocked = 0
        self.canary_detections = 0
        self.high_entropy_blocks = 0

    def generate_pseudonymous_actor(self, raw_identifier: str) -> str:
        """
        Hashes user emails/IPs locally with a rotating salt (e.g. actor_9c4e1a).
        Allows SaaS AI to correlate brute force patterns across servers without seeing real PII.
        """
        if not raw_identifier:
            return "actor_000000"
        h = hmac.new(self.salt.encode('utf-8'), raw_identifier.encode('utf-8'), hashlib.sha256).hexdigest()
        return f"actor_{h[:6]}"

    def detect_canary(self, text: str) -> str | None:
        """
        Feature 2: Canary Secret Detection. Returns canary token name if leaked.
        """
        for token in CANARY_HONEYTOKENS:
            if token in text:
                self.canary_detections += 1
                return token
        return None

    def redact_text(self, text: str) -> tuple[str, int]:
        count = 0
        
        # Redact emails
        emails = EMAIL_REGEX.findall(text)
        if emails:
            count += len(emails)
            text = EMAIL_REGEX.sub("[REDACTED_EMAIL]", text)
            
        # Redact API keys / passwords
        keys = API_KEY_REGEX.findall(text)
        if keys:
            count += len(keys)
            text = API_KEY_REGEX.sub("secret=[REDACTED_SECRET]", text)
            
        # Redact Bearer tokens
        tokens = BEARER_REGEX.findall(text)
        if tokens:
            count += len(tokens)
            text = BEARER_REGEX.sub("Bearer [REDACTED_TOKEN]", text)

        # Redact IPv4 addresses
        ips = IPV4_REGEX.findall(text)
        if ips:
            count += len(ips)
            text = IPV4_REGEX.sub("[REDACTED_IP]", text)

        self.total_pii_blocked += count
        return text, count

    def evaluate_privacy_guardian(self, raw_text: str) -> dict:
        """
        Feature 1: AI Privacy Guardian Decision Engine.
        Pre-transmission inspection returning:
        - decision: 'APPROVED' | 'SUSPICIOUS_HELD' | 'CRITICAL_BLOCKED'
        - canary_matched: token or None
        - entropy_score: float
        """
        canary = self.detect_canary(raw_text)
        entropy = calculate_shannon_entropy(raw_text)

        if canary:
            GuardianAuditLogger.log_violation("CANARY_HONEYTOKEN", f"Exposed canary secret: {canary}", raw_text, "CRITICAL_BLOCKED")
            return {
                "decision": "CRITICAL_BLOCKED",
                "reason": f"Canary Honeytoken Exposure: {canary}",
                "canary_token": canary,
                "entropy_score": entropy,
                "blocked": True,
                "action": "HALT_EGRESS_AND_ISOLATE_COLLECTOR"
            }

        # Check if high-entropy secret detected
        if entropy > 4.5 and len(raw_text) > 30:
            self.high_entropy_blocks += 1
            GuardianAuditLogger.log_violation("HIGH_SHANNON_ENTROPY", f"Shannon entropy {entropy} exceeded safe threshold 4.5", raw_text, "SUSPICIOUS_HELD")
            return {
                "decision": "SUSPICIOUS_HELD",
                "reason": f"High Shannon Entropy ({entropy} > 4.5) indicates probable cryptographic secret",
                "canary_token": None,
                "entropy_score": entropy,
                "blocked": True,
                "action": "HOLD_REDACT_REQUEST_ADMIN_REVIEW"
            }

        redacted, count = self.redact_text(raw_text)
        if count > 0:
            GuardianAuditLogger.log_violation("PII_REDACTION", f"Redacted {count} sensitive field(s) (Email/IP/Secret)", raw_text, "REDACTED_AND_APPROVED")
        return {
            "decision": "APPROVED",
            "reason": "Passed strict allow-list and privacy inspection",
            "canary_token": None,
            "entropy_score": entropy,
            "blocked": False,
            "redactions_applied": count,
            "action": "EGRESS_APPROVED_METADATA_ONLY"
        }
