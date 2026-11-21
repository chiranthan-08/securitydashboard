import os
from datetime import datetime, timezone

COLLECTOR_ID = os.getenv("CICADA_COLLECTOR_ID", "PROD-APP-SERVER-01")
CHAIN_ID = os.getenv("CICADA_CHAIN_ID", "CHAIN-COL-001")
TENANT_ID = os.getenv("CICADA_TENANT_ID", "TENANT-FINTECH-01")
API_KEY = os.getenv("CICADA_API_KEY", "sec_demo_api_key_88f91")
SAAS_BACKEND_URL = os.getenv("CICADA_SAAS_URL", "http://localhost:5000")
LOCAL_PORT = int(os.getenv("CICADA_LOCAL_PORT", "8001"))
DB_PATH = os.getenv("CICADA_DB_PATH", "collector_queue.db")
ROTATING_SALT = os.getenv("CICADA_SALT", "cicada_salt_20261120")

# Collection interval: Every 5 seconds (Phase 2 requirement)
COLLECT_INTERVAL_SEC = float(os.getenv("CICADA_COLLECT_INTERVAL", "5.0"))
HEARTBEAT_INTERVAL_SEC = 15.0

# Thresholds
CPU_EXCELLENT_MAX = 50.0
CPU_GOOD_MAX = 75.0
CPU_FAIR_MAX = 85.0
CPU_POOR_THRESHOLD = 90.0

RAM_EXCELLENT_MAX = 60.0
RAM_GOOD_MAX = 75.0
RAM_FAIR_MAX = 85.0
RAM_POOR_THRESHOLD = 90.0

LATENCY_EXCELLENT_MAX = 80.0
LATENCY_GOOD_MAX = 150.0
LATENCY_FAIR_MAX = 200.0
LATENCY_POOR_THRESHOLD = 400.0

def get_utc_now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
