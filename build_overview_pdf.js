const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imagePath = "C:/Users/chira/.gemini/antigravity/brain/f058fa34-b031-40b1-95b1-1cea5060d15d/.user_uploaded/media_1795212272907_e87fb176.jpg";
let base64Image = "";
if (fs.existsSync(imagePath)) {
  const imgData = fs.readFileSync(imagePath);
  base64Image = `data:image/jpeg;base64,${imgData.toString('base64')}`;
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CICADA 2026 Sentinel - Project Overview & Tech Stack</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 12mm 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.45;
      font-size: 11.5px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-break {
      page-break-after: always;
    }
    .avoid-break {
      page-break-inside: avoid;
    }

    /* Header Styles */
    .header {
      background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
      color: #ffffff;
      padding: 18px 22px;
      border-radius: 8px;
      margin-bottom: 14px;
      border-bottom: 3px solid #06b6d4;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .header h1 {
      font-size: 21px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .header h1 span {
      background: #0284c7;
      color: #fff;
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 700;
    }
    .header-sub {
      font-size: 13px;
      color: #94a3b8;
      font-weight: 500;
    }
    .badges {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .badge {
      font-size: 9.5px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-cyan { background: #083344; color: #38bdf8; border: 1px solid #0284c7; }
    .badge-emerald { background: #064e3b; color: #34d399; border: 1px solid #059669; }
    .badge-purple { background: #3b0764; color: #c084fc; border: 1px solid #7c3aed; }
    .badge-amber { background: #451a03; color: #fbbf24; border: 1px solid #d97706; }

    /* Section Headings */
    h2 {
      font-size: 14.5px;
      color: #0f172a;
      border-left: 4px solid #0284c7;
      padding-left: 8px;
      margin: 14px 0 8px 0;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    h3 {
      font-size: 12px;
      color: #334155;
      margin: 8px 0 4px 0;
      font-weight: 700;
    }

    /* Executive Callout Box */
    .callout {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #059669;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 12px;
    }
    .callout strong {
      color: #0f172a;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 12px 0;
      font-size: 10.5px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 6px 8px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 9.5px;
      letter-spacing: 0.3px;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    .code-pill {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      background: #e2e8f0;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 9.5px;
      color: #0f172a;
    }

    /* Steps Grid */
    .steps-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin: 8px 0 12px 0;
    }
    .step-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      background: #ffffff;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .step-num {
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #0284c7;
      color: #fff;
      text-align: center;
      line-height: 18px;
      font-size: 10px;
      font-weight: 800;
      margin-right: 5px;
    }
    .step-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 11.5px;
      margin-bottom: 3px;
    }
    .step-desc {
      color: #475569;
      font-size: 10.5px;
      line-height: 1.35;
    }

    /* Math Formula Box */
    .math-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 6px;
    }
    .math-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .math-name {
      font-weight: 700;
      color: #0f172a;
      font-size: 11px;
    }
    .math-badge {
      font-size: 8.5px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }
    .formula {
      font-family: "SFMono-Regular", Consolas, monospace;
      color: #047857;
      font-weight: 700;
      background: #ecfdf5;
      padding: 3px 6px;
      border-radius: 4px;
      display: inline-block;
      margin: 2px 0 4px 0;
      font-size: 10.5px;
    }

    /* Grid for Features */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 7px;
      margin-top: 6px;
    }
    .feat-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 7px 9px;
      background: #ffffff;
    }
    .feat-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 3px;
    }
    .feat-num {
      background: #0f172a;
      color: #ffffff;
      font-size: 9px;
      font-weight: 800;
      width: 16px;
      height: 16px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .feat-name {
      font-weight: 700;
      font-size: 11px;
      color: #0f172a;
    }
    .feat-desc {
      font-size: 10px;
      color: #475569;
      line-height: 1.3;
    }

    /* Image Display */
    .infographic-wrapper {
      text-align: center;
      margin: 10px 0;
      padding: 6px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }
    .infographic-img {
      max-width: 100%;
      height: auto;
      max-height: 290px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }

    /* Footer */
    .doc-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 14px;
      display: flex;
      justify-content: space-between;
      color: #64748b;
      font-size: 9.5px;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="header">
    <div class="header-top">
      <h1>CICADA 2026 Sentinel <span>HACKATHON EDITION</span></h1>
      <span style="font-size: 11px; color: #38bdf8; font-weight: 600;">Evaluation Reference Guide</span>
    </div>
    <div class="header-sub">
      End-to-End Secure Zero-Trust AIOps Observability & Self-Protecting Cloud Platform
    </div>
    <div class="badges">
      <span class="badge badge-cyan">Two-Tier Architecture</span>
      <span class="badge badge-emerald">AI-Driven Engine</span>
      <span class="badge badge-purple">Zero-Trust Privacy</span>
      <span class="badge badge-amber">MongoDB Atlas Cloud</span>
    </div>
  </div>

  <div class="callout">
    <strong>Executive Project Summary:</strong> CICADA 2026 Sentinel solves the fundamental paradox of cloud observability: <em>how to monitor distributed infrastructure performance and detect complex security anomalies without leaking sensitive credentials, PII, or confidential telemetry outside the local environment.</em>
    By decoupling the edge collection tier from the cloud SaaS tier, raw logs remain strictly local, while an AI Privacy Guardian and cryptographic tamper-evident ledger guarantee only mathematically proven, sanitized telemetry reaches the cloud dashboard.
  </div>

  <h2>1. How It Works (End-to-End Workflow in 6 Short Steps)</h2>
  <div class="steps-container">
    <div class="step-box">
      <div class="step-title"><span class="step-num">1</span> Edge Telemetry Collection</div>
      <div class="step-desc">The lightweight local Python collector gathers real-time hardware telemetry (CPU, RAM, Disk, Latency, Network Tx/Rx) directly via native <code>psutil</code> APIs without external agents.</div>
    </div>
    <div class="step-box">
      <div class="step-title"><span class="step-num">2</span> Local Zero-Trust Sanitization</div>
      <div class="step-desc">Raw logs are strictly retained locally. Outgoing payloads pass through strict regex allow-listing, GDPR/HIPAA PII redaction, and Canary Honeytoken deception filters.</div>
    </div>
    <div class="step-box">
      <div class="step-title"><span class="step-num">3</span> Cryptographic Envelope Signing</div>
      <div class="step-desc">The filtered payload is hashed with SHA-256, chained to the previous ledger block, signed with tenant HMAC credentials, and buffered in an SQLite outbox.</div>
    </div>
    <div class="step-box">
      <div class="step-title"><span class="step-num">4</span> TLS Ingestion & Deduplication</div>
      <div class="step-desc">The SaaS backend verifies HMAC signatures, verifies sequence monotonic increments, rejects duplicate payloads (idempotency), and confirms cryptographic chain continuity.</div>
    </div>
    <div class="step-box">
      <div class="step-title"><span class="step-num">5</span> Cloud Persistence & Streaming</div>
      <div class="step-desc">Telemetry records, egress proofs, and incidents are durably saved to <strong>MongoDB Atlas</strong> while streaming sub-millisecond updates to the NOC dashboard via WebSockets.</div>
    </div>
    <div class="step-box">
      <div class="step-title"><span class="step-num">6</span> AIOps Correlation & Remediation</div>
      <div class="step-desc">The AI Engine evaluates multivariate Z-scores, projects MITRE ATT&CK kill chains, computes feature attributions (XAI), and provides reversible 1-click remediation.</div>
    </div>
  </div>

  <h2>2. Tools & Technologies Stack Overview</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 18%;">Layer / Tier</th>
        <th style="width: 25%;">Technology & Framework</th>
        <th style="width: 20%;">Key Libraries</th>
        <th>Exact Role & Architectural Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Frontend</strong></td>
        <td>React 18 + Vite 5</td>
        <td>Tailwind CSS, Lucide, Recharts</td>
        <td>Enterprise Cyberpunk NOC Dashboard, real-time charts, 8 innovation interactive consoles, tenant switcher.</td>
      </tr>
      <tr>
        <td><strong>Backend API</strong></td>
        <td>Node.js (v24) + Express.js</td>
        <td>Socket.IO, crypto, dotenv, uuid</td>
        <td>RESTful Ingestion API, HMAC signature verifier, AIOps correlation engine, stale collector watchdog.</td>
      </tr>
      <tr>
        <td><strong>Cloud Database</strong></td>
        <td>MongoDB Atlas (Cloud Cluster0)</td>
        <td>Mongoose v8/9</td>
        <td>Durable persistence for telemetry, fleet collectors, tamper-evident egress proofs, incidents, and audit logs.</td>
      </tr>
      <tr>
        <td><strong>Edge Database</strong></td>
        <td>SQLite Local Outbox</td>
        <td>sqlite3 (WAL Mode)</td>
        <td>Guarantees zero data loss during network partitions; queues envelopes with exponential backoff retry.</td>
      </tr>
      <tr>
        <td><strong>Local Collector</strong></td>
        <td>Python 3.10+ Daemon</td>
        <td>psutil, requests, hashlib, hmac</td>
        <td>Samples OS telemetry, calculates Shannon Entropy, enforces honeytoken traps, generates SHA-256 chain blocks.</td>
      </tr>
      <tr>
        <td><strong>Real-Time Sync</strong></td>
        <td>WebSockets (Socket.IO)</td>
        <td>socket.io, socket.io-client</td>
        <td>Sub-millisecond bidirectional pub/sub room isolation by tenant ID (<code>TENANT-FINTECH-01</code>, <code>TENANT-HEALTH-02</code>).</td>
      </tr>
    </tbody>
  </table>

  <div class="doc-footer">
    <span>CICADA 2026 Sentinel • Two-Tier Zero-Trust AIOps Observability</span>
    <span>Page 1 of 2</span>
  </div>

  <div class="page-break"></div>

  <!-- ==================== PAGE 2 ==================== -->
  <h2>3. Core Algorithms & Mathematical Engines</h2>
  
  <div class="math-card">
    <div class="math-card-header">
      <span class="math-name">1. Multivariate Z-Score Anomaly Detection</span>
      <span class="math-badge">Performance AI</span>
    </div>
    <div class="formula">Z = (x - &mu;) / &sigma;</div>
    <p style="font-size: 10px; color: #475569;">
      Calculates standardized deviation for CPU, RAM, Disk, Latency against a moving baseline window (N=30). Telemetry with composite |Z| &gt; 2.5 triggers immediate anomaly detection.
    </p>
  </div>

  <div class="math-card">
    <div class="math-card-header">
      <span class="math-name">2. Dynamic Sampling with Hysteresis & Bandwidth Reduction</span>
      <span class="math-badge">Cost & Egress Optimization</span>
    </div>
    <p style="font-size: 10px; color: #475569;">
      <strong>Heartbeat Mode:</strong> Transmits 1-line compact status under healthy conditions, slashing bandwidth by <strong>75%</strong>.<br>
      <strong>Anomaly Burst Mode:</strong> Automatically escalates to 2s high-frequency diagnostic bursts when health drops to FAIR/POOR. Requires 6 consecutive healthy samples before returning to Heartbeat to prevent alert flapping.
    </p>
  </div>

  <div class="math-card">
    <div class="math-card-header">
      <span class="math-name">3. Shannon Entropy Secret Detection</span>
      <span class="math-badge">Privacy Guardian</span>
    </div>
    <div class="formula">H(X) = - &sum; P(x_i) &times; log2(P(x_i))</div>
    <p style="font-size: 10px; color: #475569;">
      Scans outbound telemetry strings for cryptographic randomness. Strings with H &gt; 4.5 indicate high-entropy API keys, private keys, or passwords, triggering pre-egress quarantine.
    </p>
  </div>

  <div class="math-card">
    <div class="math-card-header">
      <span class="math-name">4. Cryptographic Hash-Chained Tamper-Evident Ledger</span>
      <span class="math-badge">Zero-Trust Integrity</span>
    </div>
    <div class="formula">EntryHash_k = SHA-256(EntryHash_{k-1} || PayloadHash_k || Sequence_k || Timestamp_k)</div>
    <p style="font-size: 10px; color: #475569;">
      Links each egress envelope in a blockchain-like immutable chain. If an attacker modifies or injects telemetry, the hash breaks instantly, alerting the operator with cryptographic proof.
    </p>
  </div>

  <h2>4. The 8 Self-Protecting Innovation Features</h2>
  ${base64Image ? `
  <div class="infographic-wrapper">
    <img src="${base64Image}" class="infographic-img" alt="8 Innovation Architectures Overview">
  </div>
  ` : ''}

  <div class="features-grid">
    <div class="feat-card">
      <div class="feat-header">
        <span class="feat-num">1</span>
        <span class="feat-name">AI Privacy Guardian</span>
      </div>
      <div class="feat-desc">Pre-transmission firewall evaluating payload entropy and allow-lists before egress.</div>
    </div>
    <div class="feat-card">
      <div class="feat-header">
        <span class="feat-num">2</span>
        <span class="feat-name">Canary Honeytokens</span>
      </div>
      <div class="feat-desc">Planted deception secrets (<code>CANARY-SECRET-92831</code>) that trigger instant quarantine when touched.</div>
    </div>
    <div class="feat-card">
      <div class="feat-header">
        <span class="feat-num">3</span>
        <span class="feat-name">Adaptive Dynamic Privacy</span>
      </div>
      <div class="feat-desc">4-tier sensitivity matrix (Public/Internal/Confidential/Critical) adapting to threat levels.</div>
    </div>
    <div class="feat-card">
      <div class="feat-header">
        <span class="feat-num">4</span>
        <span class="feat-name">Tamper Egress Ledger</span>
      </div>
      <div class="feat-desc">Immutable SHA-256 chained audit proofs ensuring payload integrity during transit.</div>
    </div>
    <div class="feat-card">
      <div class="feat-header">
        <span class="feat-num">5</span>
        <span class="feat-name">Collector Fingerprinting</span>
      </div>
      <div class="feat-desc">Monitors edge behavioral drift (volume, frequency, size) to detect compromised collectors.</div>
    </div>
    <div class="feat-card">
      <div class="feat-header">
        <span class="feat-num">6</span>
        <span class="feat-name">Attack Correlation Graph</span>
      </div>
      <div class="feat-desc">Correlates multi-collector events into unified attack narratives with MITRE ATT&CK mapping.</div>
    </div>
    <div class="feat-card">
      <div class="feat-header">
        <span class="feat-num">7</span>
        <span class="feat-name">Policy Simulator Sandbox</span>
      </div>
      <div class="feat-desc">Simulates impact of privacy rule adjustments on historical telemetry before live deployment.</div>
    </div>
    <div class="feat-card">
      <div class="feat-header">
        <span class="feat-num">8</span>
        <span class="feat-name">Reversible Remediation</span>
      </div>
      <div class="feat-desc">AI-recommended safe actions with 60-second automatic rollback and human verification.</div>
    </div>
  </div>

  <h2>5. Key API Endpoints & Multi-Tenant Separation</h2>
  <table>
    <thead>
      <tr>
        <th>Endpoint</th>
        <th>Method</th>
        <th>Auth / Scope</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>/api/v1/telemetry</code></td>
        <td><span class="code-pill">POST</span></td>
        <td>HMAC SHA-256 + Tenant Key</td>
        <td>Ingestion endpoint with duplicate deduplication & chain verification.</td>
      </tr>
      <tr>
        <td><code>/api/v1/dashboard/overview</code></td>
        <td><span class="code-pill">GET</span></td>
        <td>Tenant Scoped API Key</td>
        <td>Returns fleet health, live metrics, Atlas DB status, and blocked PII count.</td>
      </tr>
      <tr>
        <td><code>/api/v1/egress/proof</code></td>
        <td><span class="code-pill">GET</span></td>
        <td>Tenant Scoped API Key</td>
        <td>Delivers verifiable SHA-256 tamper-evident egress ledger blocks.</td>
      </tr>
      <tr>
        <td><code>/api/v1/privacyshield/*</code></td>
        <td><span class="code-pill">POST</span></td>
        <td>Operator Console</td>
        <td>Controls simulations: Canary leaks, threat levels, ledger tamper, sandbox tests.</td>
      </tr>
      <tr>
        <td><code>/healthz</code></td>
        <td><span class="code-pill">GET</span></td>
        <td>Public Liveness Probe</td>
        <td>Returns cloud health, MongoDB Atlas cluster host, and readiness status.</td>
      </tr>
    </tbody>
  </table>

  <div class="doc-footer">
    <span>CICADA 2026 Sentinel • Two-Tier Zero-Trust AIOps Observability</span>
    <span>Page 2 of 2</span>
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, 'overview_document.html');
const pdfFilePath = path.join(__dirname, 'CICADA_2026_Sentinel_Project_Overview.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log(`Generated HTML at: ${htmlFilePath}`);

const edgeExecutable = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
console.log(`Printing PDF via Edge headless...`);

try {
  execSync(`"${edgeExecutable}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFilePath}" "${htmlFilePath}"`, {
    stdio: 'inherit'
  });
  
  if (fs.existsSync(pdfFilePath)) {
    const stats = fs.statSync(pdfFilePath);
    console.log(`=======================================================`);
    console.log(` SUCCESS: PDF Generated Successfully!`);
    console.log(` Path: ${pdfFilePath}`);
    console.log(` Size: ${(stats.size / 1024).toFixed(1)} KB`);
    console.log(`=======================================================`);
  } else {
    console.error(' PDF file not found after conversion.');
  }
} catch (err) {
  console.error(' Error generating PDF:', err.message);
}
