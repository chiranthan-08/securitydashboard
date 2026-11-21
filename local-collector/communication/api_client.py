import json
import base64
import requests
import logging

class SaaSClient:
    def __init__(self, backend_url: str, tenant_id: str, api_key: str):
        self.backend_url = backend_url.rstrip('/')
        self.tenant_id = tenant_id
        self.api_key = api_key
        self.is_connected = False
        self.last_ack_time = None

    def send_envelope(self, envelope: dict) -> tuple[bool, dict]:
        url = f"{self.backend_url}/api/v1/telemetry"
        headers = {
            "Content-Type": "application/json",
            "x-tenant-id": self.tenant_id,
            "x-api-key": self.api_key
        }
        try:
            resp = requests.post(url, json=envelope, headers=headers, timeout=3.0)
            if resp.status_code in (200, 201):
                self.is_connected = True
                return True, resp.json()
            else:
                self.is_connected = False
                return False, {"status_code": resp.status_code, "error": resp.text}
        except Exception as e:
            self.is_connected = False
            return False, {"error": str(e)}

    def check_health(self) -> bool:
        try:
            resp = requests.get(f"{self.backend_url}/healthz", timeout=1.5)
            self.is_connected = (resp.status_code == 200)
            return self.is_connected
        except Exception:
            self.is_connected = False
            return False
