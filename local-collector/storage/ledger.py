import sqlite3
import hashlib
import json
import threading

GENESIS_PREV_HASH = "0" * 64

class CryptographicLedger:
    def __init__(self, db_path="collector_queue.db", chain_id="CHAIN-COL-001"):
        self.db_path = db_path
        self.chain_id = chain_id
        self._lock = threading.RLock()
        self._init_db()

    def _get_conn(self):
        return sqlite3.connect(self.db_path, check_same_thread=False)

    def _init_db(self):
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS cryptographic_ledger (
                    sequence_num INTEGER PRIMARY KEY,
                    payload_id TEXT,
                    chain_id TEXT,
                    payload_hash TEXT,
                    previous_hash TEXT,
                    entry_hash TEXT,
                    payload_preview TEXT,
                    timestamp_utc TEXT,
                    status TEXT DEFAULT 'RECORDED'
                )
            """)
            conn.commit()

    def get_latest_entry_hash(self) -> str:
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT entry_hash FROM cryptographic_ledger ORDER BY sequence_num DESC LIMIT 1")
            row = cursor.fetchone()
            return row[0] if row else GENESIS_PREV_HASH

    @staticmethod
    def compute_entry_hash(chain_id: str, sequence_num: int, previous_hash: str, payload_hash: str) -> str:
        # cicada-egress-v1\n<chain_id>\n<sequence_num>\n<previous_hash>\n<payload_hash>
        raw = f"cicada-egress-v1\n{chain_id}\n{sequence_num}\n{previous_hash}\n{payload_hash}"
        return hashlib.sha256(raw.encode('utf-8')).hexdigest()

    def record_entry(self, sequence_num: int, payload_id: str, payload_hash: str, payload_dict: dict, timestamp_utc: str) -> tuple[str, str]:
        with self._lock, self._get_conn() as conn:
            prev_hash = self.get_latest_entry_hash()
            entry_hash = self.compute_entry_hash(self.chain_id, sequence_num, prev_hash, payload_hash)
            preview = json.dumps(payload_dict)

            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO cryptographic_ledger 
                (sequence_num, payload_id, chain_id, payload_hash, previous_hash, entry_hash, payload_preview, timestamp_utc, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'RECORDED')
            """, (sequence_num, payload_id, self.chain_id, payload_hash, prev_hash, entry_hash, preview, timestamp_utc))
            conn.commit()
            return prev_hash, entry_hash

    def update_status(self, sequence_num: int, status: str):
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE cryptographic_ledger SET status = ? WHERE sequence_num = ?", (status, sequence_num))
            conn.commit()

    def get_recent_entries(self, limit=20):
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT sequence_num, payload_id, payload_hash, previous_hash, entry_hash, payload_preview, timestamp_utc, status
                FROM cryptographic_ledger
                ORDER BY sequence_num DESC
                LIMIT ?
            """, (limit,))
            rows = cursor.fetchall()
            return [
                {
                    "sequence_num": r[0],
                    "payload_id": r[1],
                    "payload_hash": r[2],
                    "previous_hash": r[3],
                    "entry_hash": r[4],
                    "payload_preview": json.loads(r[5]) if r[5] else {},
                    "timestamp_utc": r[6],
                    "status": r[7]
                }
                for r in rows
            ]

    def verify_ledger(self) -> dict:
        """
        Traverses and recomputes the entire hash chain from genesis to head.
        Proves tamper-evidence to auditors and judges.
        """
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT sequence_num, chain_id, payload_hash, previous_hash, entry_hash
                FROM cryptographic_ledger
                ORDER BY sequence_num ASC
            """)
            rows = cursor.fetchall()
            if not rows:
                return {"valid": True, "entries_checked": 0, "message": "Genesis state - no entries recorded"}

            expected_prev = GENESIS_PREV_HASH
            for row in rows:
                seq, cid, p_hash, prev_h, ent_h = row
                if prev_h != expected_prev:
                    return {
                        "valid": False,
                        "broken_sequence": seq,
                        "expected_prev": expected_prev,
                        "found_prev": prev_h,
                        "error": f"Hash chain broken at sequence {seq}: previous_hash does not match chain predecessor"
                    }
                computed_entry = self.compute_entry_hash(cid, seq, prev_h, p_hash)
                if computed_entry != ent_h:
                    return {
                        "valid": False,
                        "broken_sequence": seq,
                        "expected_entry_hash": computed_entry,
                        "found_entry_hash": ent_h,
                        "error": f"Tampering detected at sequence {seq}: entry_hash does not match SHA-256 computation"
                    }
                expected_prev = ent_h

            return {
                "valid": True,
                "entries_checked": len(rows),
                "head_entry_hash": expected_prev,
                "message": f"Ledger integrity verified: all {len(rows)} entries form a valid tamper-evident SHA-256 chain"
            }
