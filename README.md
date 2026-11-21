# CICADA SENTINEL 2026: End-to-End Secure AIOps Observability Platform

A two-tier zero-trust infrastructure monitoring and AIOps observability platform. A lightweight Python agent runs close to monitored systems inside private perimeters, extracts real system telemetry, performs local privacy filtering & regex/HMAC pseudonymization, and transmits **ONLY cryptographically verified, strict allow-listed metadata** to a central Node.js/Express SaaS engine for multi-signal anomaly correlation, explainable root-cause remediation, and tamper-evident SHA-256 egress proof.

---

## 🏛️ Architecture Overview

```
+-----------------------------------------------------------------------------------+
|               TIER 1: CUSTOMER PRIVATE ENVIRONMENT (Edge Agent)                   |
|                                                                                   |
|  [psutil System Telemetry] + [Auth/App Logs (Passwords, Emails, Raw IPs)]        |
|                                 │                                                 |
|                                 ▼                                                 |
|                [Privacy Guard: Regex & Salted HMAC]                               |
|                • Raw logs locked locally on edge disk                             |
|                • Pseudonymous Actor Token (actor_<hash>)                          |
|                                 │                                                 |
|                                 ▼                                                 |
|              [Edge AI & Dynamic Sampling Engine]                                  |
|              • Health state: EXCELLENT, GOOD, FAIR, POOR                          |
|              • Rolling Z-Score Anomaly Detector                                   |
|              • Dynamic Burst vs Heartbeat (~75% bandwidth reduction)             |
|                                 │                                                 |
|                                 ▼                                                 |
|              [Strict Allow-List & SHA-256 Egress Ledger]                          |
|              • Exact-byte envelope hashing                                        |
|              • Tamper-evident hash chain: prev_hash + payload_hash                |
|                                 │                                                 |
|                                 ▼                                                 |
|              [SQLite Ring Buffer & Offline Failover]                              |
|              • Persists unsent records during network outages                     |
|              • Idempotent replay upon reconnect (0 lost, 0 duplicates)            |
+--------------------------------─┬─────────────────────────────────────────────────+
                                  │ HTTPS / TLS (Approved Metadata ONLY)
                                  ▼
+-----------------------------------------------------------------------------------+
|                  TIER 2: CENTRAL SAAS CLOUD PLATFORM                              |
|                                                                                   |
|  [Node.js + Express + Socket.IO API (Port 5000)]                                  |
|  • Scoped API Key & Tenant Guard (TENANT-FINTECH-01 vs TENANT-HEALTH-02)          |
|  • Cryptographic Chain Verification & Exact-Byte Checksum                         |
|  • Deduplication by payload_id and sequence_num                                   |
|  • Stale Collector Watchdog (15s timeout downgrades silent nodes to POOR)         |
|  • Multi-Signal Correlation Engine (CPU + RAM + Latency -> 1 Incident)            |
|  • Human-in-the-Loop Safe Remediation with 60s Auto-Rollback Simulation           |
|                                                                                   |
|  [MongoDB Atlas Cloud Persistence (cluster0.ylwjczh.mongodb.net)]                 |
|  • Collections: telemetry, collectors, egressproofs, alerts, incidents            |
|  • 8 Dedicated Innovation Collections: privacy_guardians, honeytokens, etc.       |
|                                                                                   |
|  [React + Vite + Tailwind CSS Dark-Mode NOC/SOC Dashboard (Port 5173 / 5000)]     |
|  • Live Multi-Metric Telemetry Charts (Recharts)                                  |
|  • 8 Dedicated Self-Protecting Innovation Pages & Architectures                   |
|  • Live Egress Proof Inspector (Side-by-side Raw Local vs Approved Egress)        |
|  • Interactive Demo Control Bar for all 5 Hackathon Rubric Scenarios              |
+-----------------------------------------------------------------------------------+
```

---

## 🛡️ 8 Novel Innovation Features (Self-Protecting Privacy Engine)

1. **AI Privacy Guardian:** Pre-transmission egress firewall inspecting Shannon entropy ($H > 4.5$) and allow-lists before transmission.
2. **Canary Honeytokens:** Planted deception secrets (`CANARY-SECRET-92831`) triggering immediate collector quarantine upon leak attempt.
3. **Adaptive Dynamic Privacy:** 4-tier data classification adapting metadata transmission strictly based on current threat levels (`NORMAL`, `ELEVATED`, `CRITICAL_LOCKDOWN`).
4. **Tamper-Evident Egress Ledger:** Blockchain-like cryptographic SHA-256 hash chaining of all outgoing envelopes.
5. **Collector Behavioral Fingerprinting:** Drift detection monitoring payload sizes, intervals, and TLS certificate validity to flag rogue edge nodes.
6. **Attack Relationship Graph:** Correlates disjoint events into unified attack narratives with MITRE ATT&CK kill-chain mapping.
7. **Policy Simulator Sandbox:** Safely evaluates data leakage risk and bandwidth savings across historical telemetry before deploying privacy rule changes.
8. **Reversible Remediation Actions:** Human-in-the-loop corrective actions with automated 60-second rollback safety timers.

---

## 🚀 Quick Startup Guide (One-Click)

### Option A: Windows Batch Script
```powershell
.\start-all.bat
```

### Option B: Windows PowerShell Script
```powershell
.\start-all.ps1
```

### Option C: Manual Multi-Terminal Startup
1. **Terminal 1 - SaaS Backend:**
   ```powershell
   cd saas-backend
   npm install
   npm start
   ```
   *Runs on `http://localhost:5000`*

2. **Terminal 2 - Local Edge Collector:**
   ```powershell
   cd local-collector
   pip install -r requirements.txt
   python server.py
   ```
   *Runs on `http://localhost:8001`*

3. **Terminal 3 - SaaS Frontend NOC Dashboard:**
   ```powershell
   cd saas-frontend
   npm install
   npm run dev
   ```
   *Runs on `http://localhost:5173`*

Open **`http://localhost:5000`** (or `http://localhost:5173`) in your browser to view the live dashboard!

---

## 📄 Project Overview PDF
A complete, publication-ready two-page summary of the architecture, tools, mathematical models, and algorithms is available:
- File: [`CICADA_2026_Sentinel_Project_Overview.pdf`](./CICADA_2026_Sentinel_Project_Overview.pdf)

---

## Target Database Configuration
- **Cloud Database:** MongoDB Atlas Cluster (`cluster0.ylwjczh.mongodb.net`)
- **Database Name:** `cicada_sentinel`
- **Driver:** Mongoose v8/9 with automated baseline seeding
