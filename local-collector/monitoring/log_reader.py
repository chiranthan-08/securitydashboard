import collections
from datetime import datetime, timezone

class LocalLogStore:
    def __init__(self, maxlen=50):
        self.raw_logs = collections.deque(maxlen=maxlen)
        self.auth_failures_last_min = 0
        self.last_actor_id = "user_default_actor"
        self.attack_flag = False

    def add_raw_log(self, raw_entry: dict):
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        entry = {
            "timestamp": timestamp,
            "raw_text": raw_entry.get("message", ""),
            "fields": raw_entry
        }
        self.raw_logs.appendleft(entry)
        
        if raw_entry.get("event") == "auth_failure":
            self.auth_failures_last_min += 1
            self.last_actor_id = raw_entry.get("email") or raw_entry.get("ip") or "actor_anon"
            if self.auth_failures_last_min > 5:
                self.attack_flag = True

    def get_latest_raw(self):
        return list(self.raw_logs)[:10]

    def reset_security_stats(self):
        self.auth_failures_last_min = 0
        self.attack_flag = False
        self.last_actor_id = "actor_normal"
