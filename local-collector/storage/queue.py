import sqlite3
import threading
import time

class SQLiteOutbox:
    def __init__(self, db_path="collector_queue.db"):
        self.db_path = db_path
        self._lock = threading.RLock()
        self._init_db()

    def _get_conn(self):
        return sqlite3.connect(self.db_path, check_same_thread=False)

    def _init_db(self):
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS outbox (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    payload_id TEXT UNIQUE,
                    sequence_num INTEGER,
                    envelope_json TEXT,
                    status TEXT DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    retries INTEGER DEFAULT 0,
                    last_retry_ts REAL DEFAULT 0
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS state (
                    key TEXT PRIMARY KEY,
                    value TEXT
                )
            """)
            # Initialize sequence counter if not exists
            cursor.execute("INSERT OR IGNORE INTO state (key, value) VALUES ('next_sequence', '1')")
            # Migrate column if older database exists
            try:
                cursor.execute("ALTER TABLE outbox ADD COLUMN last_retry_ts REAL DEFAULT 0")
            except Exception:
                pass
            conn.commit()

    def get_next_sequence(self) -> int:
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT value FROM state WHERE key = 'next_sequence'")
            row = cursor.fetchone()
            seq = int(row[0]) if row else 1
            cursor.execute("UPDATE state SET value = ? WHERE key = 'next_sequence'", (str(seq + 1),))
            conn.commit()
            return seq

    def enqueue(self, payload_id: str, sequence_num: int, envelope_json: str):
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO outbox (payload_id, sequence_num, envelope_json, status, retries, last_retry_ts)
                VALUES (?, ?, ?, 'pending', 0, 0)
            """, (payload_id, sequence_num, envelope_json))
            conn.commit()

    def get_pending(self, limit=50):
        """
        Retrieves pending records eligible for transmission based on exponential backoff:
        backoff = min(30.0, 1.5 ** retries) seconds
        """
        now = time.time()
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, payload_id, sequence_num, envelope_json, retries, last_retry_ts
                FROM outbox
                WHERE status = 'pending'
                ORDER BY sequence_num ASC
                LIMIT ?
            """, (limit * 2,))
            rows = cursor.fetchall()

            eligible = []
            for r in rows:
                item_id, payload_id, seq, env_json, retries, last_retry = r
                backoff_sec = min(30.0, (1.5 ** min(retries, 8))) if retries > 0 else 0
                if (now - (last_retry or 0)) >= backoff_sec:
                    eligible.append((item_id, payload_id, seq, env_json, retries))
                    if len(eligible) >= limit:
                        break
            return eligible

    def mark_acknowledged(self, payload_id: str):
        """
        Marks delivered and prunes old acknowledged records to maintain SQLite health.
        """
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE outbox SET status = 'acknowledged' WHERE payload_id = ?", (payload_id,))
            
            # Prune old acknowledged records, keeping only the latest 100 for verification
            cursor.execute("""
                DELETE FROM outbox 
                WHERE status = 'acknowledged' 
                  AND id NOT IN (
                      SELECT id FROM outbox 
                      WHERE status = 'acknowledged' 
                      ORDER BY id DESC LIMIT 100
                  )
            """)
            conn.commit()

    def increment_retry(self, item_id: int):
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE outbox 
                SET retries = retries + 1, last_retry_ts = ? 
                WHERE id = ?
            """, (time.time(), item_id))
            conn.commit()

    def get_queue_depth(self) -> int:
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM outbox WHERE status = 'pending'")
            row = cursor.fetchone()
            return row[0] if row else 0

    def get_all_records(self, limit=100):
        with self._lock, self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT payload_id, sequence_num, status, created_at, retries
                FROM outbox
                ORDER BY sequence_num DESC
                LIMIT ?
            """, (limit,))
            return cursor.fetchall()
