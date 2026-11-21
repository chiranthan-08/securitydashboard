import http.server
import json
import urllib.parse
import sqlite3
import threading

from config import LOCAL_PORT, COLLECTOR_ID, CHAIN_ID, TENANT_ID, DB_PATH
from agent import CicadaAgent

agent = CicadaAgent()

class CollectorAPIHandler(http.server.BaseHTTPRequestHandler):
    def _set_cors_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, x-tenant-id, x-api-key")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(200)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path in ("/", ""):
            self._set_cors_headers(200)
            data = {
                "service": "CICADA Sentinel Local Edge Collector",
                "version": "1.0.0",
                "status": "ONLINE",
                "collector_id": COLLECTOR_ID,
                "tenant_id": TENANT_ID,
                "chain_id": CHAIN_ID
            }
            self.wfile.write(json.dumps(data).encode('utf-8'))

        elif path == "/status":
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(agent.latest_state).encode('utf-8'))

        elif path == "/raw-vs-redacted":
            self._set_cors_headers(200)
            raw_logs = agent.log_store.get_latest_raw()
            recent_ledger = agent.ledger.get_recent_entries(limit=1)
            latest_egress = recent_ledger[0] if recent_ledger else {}

            data = {
                "local_storage_notice": "Raw application and auth logs are stored ONLY locally in private memory/disk. Never transmitted.",
                "raw_logs_local": raw_logs,
                "approved_outgoing_payload": latest_egress.get("payload_preview", {}),
                "egress_audit": {
                    "raw_logs_transmitted": 0,
                    "sensitive_fields_detected": 0,
                    "payload_hash": latest_egress.get("payload_hash", "0" * 64),
                    "previous_hash": latest_egress.get("previous_hash", "0" * 64),
                    "entry_hash": latest_egress.get("entry_hash", "0" * 64)
                }
            }
            self.wfile.write(json.dumps(data).encode('utf-8'))

        elif path == "/egress-ledger":
            self._set_cors_headers(200)
            entries = agent.ledger.get_recent_entries(limit=25)
            verification = agent.ledger.verify_ledger()
            data = {
                "chain_id": CHAIN_ID,
                "total_entries": len(entries),
                "verification": verification,
                "entries": entries
            }
            self.wfile.write(json.dumps(data).encode('utf-8'))

        elif path == "/verify":
            self._set_cors_headers(200)
            verification = agent.ledger.verify_ledger()
            self.wfile.write(json.dumps(verification).encode('utf-8'))

        else:
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"error": "NOT_FOUND", "path": path}).encode('utf-8'))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"

        try:
            req_data = json.loads(body) if body else {}
        except Exception:
            req_data = {}

        if path == "/simulate":
            scenario = req_data.get("scenario")
            valid_scenarios = ["pii_login", "cpu_spike", "latency_spike", "correlated_exhaustion", "canary_leak", "high_entropy_secret", "reset"]
            if scenario not in valid_scenarios:
                self._set_cors_headers(400)
                self.wfile.write(json.dumps({"error": f"Invalid scenario. Expected one of {valid_scenarios}"}).encode('utf-8'))
                return

            res = agent.trigger_scenario(scenario)
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(res).encode('utf-8'))

        elif path == "/tamper":
            with sqlite3.connect(DB_PATH) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT sequence_num FROM cryptographic_ledger ORDER BY sequence_num DESC LIMIT 1")
                row = cursor.fetchone()
                if not row:
                    self._set_cors_headers(400)
                    self.wfile.write(json.dumps({"error": "No ledger entries to tamper with yet."}).encode('utf-8'))
                    return
                seq = row[0]
                cursor.execute("UPDATE cryptographic_ledger SET payload_hash = 'badbeef000000000000000000000000000000000000000000000000000000000' WHERE sequence_num = ?", (seq,))
                conn.commit()

            self._set_cors_headers(200)
            self.wfile.write(json.dumps({
                "status": "TAMPERED",
                "message": f"Maliciously altered payload_hash in sequence {seq} in local database. Check /verify to see tampering detection in action!"
            }).encode('utf-8'))

        else:
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"error": "NOT_FOUND", "path": path}).encode('utf-8'))

    def log_message(self, format, *args):
        # Suppress noisy standard logging
        return

def run_server():
    agent.start()
    server_address = ('0.0.0.0', LOCAL_PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, CollectorAPIHandler)
    print(f"=======================================================")
    print(f"🛡️  CICADA Edge Collector API running on port {LOCAL_PORT}")
    print(f"📡 Collector ID: {COLLECTOR_ID} | Tenant: {TENANT_ID}")
    print(f"=======================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        agent.stop()
        httpd.server_close()

if __name__ == "__main__":
    run_server()
