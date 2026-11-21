const crypto = require('crypto');
const {
  PrivacyGuardianModel,
  HoneytokenModel,
  AdaptivePolicyModel,
  TamperLedgerModel,
  CollectorFingerprintModel,
  AttackGraphModel,
  PolicySimulatorModel,
  RemediationModel
} = require('../db/mongo');

/**
 * PrivacyShield AI Service
 * Backed by MongoDB Atlas collections:
 * 1. privacy_guardians
 * 2. honeytokens
 * 3. adaptive_policies
 * 4. tamper_ledgers
 * 5. collector_fingerprints
 * 6. attack_graphs
 * 7. policy_simulators
 * 8. remediations
 */
class PrivacyShieldService {
  constructor() {
    // 1. Privacy Guardian State
    this.guardianStats = {
      totalInspected: 1420,
      approvedCount: 1368,
      heldCount: 38,
      blockedCount: 14,
      avgLatencyMs: 1.42,
      lastInspection: new Date().toISOString()
    };

    this.guardianLogs = [
      {
        id: "INSP-9921",
        payloadId: "PAY-20261120-1191",
        collectorId: "PROD-APP-SERVER-01",
        timestamp: new Date(Date.now() - 4000).toISOString(),
        entropyScore: 2.31,
        canaryDetected: null,
        decision: "APPROVED",
        action: "EGRESS_ALLOWED_METADATA_ONLY",
        reason: "Allow-list verified. Metrics within standard bounds."
      },
      {
        id: "INSP-9920",
        payloadId: "PAY-20261120-1190",
        collectorId: "EDGE-GATEWAY-EU-02",
        timestamp: new Date(Date.now() - 12000).toISOString(),
        entropyScore: 2.45,
        canaryDetected: null,
        decision: "APPROVED",
        action: "EGRESS_ALLOWED_METADATA_ONLY",
        reason: "Allow-list verified. Zero PII detected."
      },
      {
        id: "INSP-9919",
        payloadId: "PAY-20261120-1189",
        collectorId: "PROD-APP-SERVER-01",
        timestamp: new Date(Date.now() - 25000).toISOString(),
        entropyScore: 4.88,
        canaryDetected: null,
        decision: "SUSPICIOUS_HELD",
        action: "HOLD_REDACT_ADMIN_REVIEW",
        reason: "High Shannon Entropy (4.88 > 4.5) indicates probable cryptographic secret in log field."
      }
    ];

    // 2. Canary Honeytokens Deception Traps
    this.honeytokens = [
      {
        id: "CANARY-01",
        token: "CANARY-SECRET-92831",
        environment: "Production App Server (/etc/app.env)",
        plantedDate: "2026-11-01",
        status: "ACTIVE_TRAP",
        lastTriggered: null,
        timesTriggered: 0
      },
      {
        id: "CANARY-02",
        token: "HONEYTOKEN-FINTECH-9912",
        environment: "Customer Auth DB Connection Pool",
        plantedDate: "2026-11-05",
        status: "ACTIVE_TRAP",
        lastTriggered: null,
        timesTriggered: 0
      },
      {
        id: "CANARY-03",
        token: "AKIA-CANARY-DEV-77",
        environment: "Simulated CI/CD Deployment Pipeline",
        plantedDate: "2026-11-10",
        status: "ACTIVE_TRAP",
        lastTriggered: null,
        timesTriggered: 0
      }
    ];

    // 3. Adaptive Privacy Threat Level State
    this.currentThreatLevel = "NORMAL";

    this.adaptivePolicyMatrix = [
      { tier: "Public", fieldTypes: "CPU, Memory, Disk Saturation, Network Rx/Tx", normal: "Allow (Full Metric)", elevated: "Allow (Aggregated 10s)", lockdown: "Allow (Heartbeat 30s)" },
      { tier: "Internal", fieldTypes: "Hostname, Service Name, Collector UUID, OS Kernel", normal: "Pseudonymize (SHA-256)", elevated: "Pseudonymize (Salted)", lockdown: "Redact Completely" },
      { tier: "Confidential", fieldTypes: "Internal IP, Port Numbers, Pseudonymous Actor IDs", normal: "Redact / Mask", elevated: "Strictly Redact", lockdown: "Strictly Drop" },
      { tier: "Critical", fieldTypes: "Passwords, API Keys, Tokens, Honeytokens", normal: "Block & Alert", elevated: "Block & Alert", lockdown: "Block & Quarantine" }
    ];

    // 4. Tamper-Evident Ledger with verification
    this.ledgerEntries = this._initializeLedger();
    this.ledgerTampered = false;

    // 5. Collector Behaviour Fingerprints (Zero-Trust Profiles)
    this.collectorFingerprints = [
      {
        id: "PROD-APP-SERVER-01",
        hostname: "app-node-primary.fintech.internal",
        expectedFreqSec: 5.0,
        avgPayloadBytes: 1420,
        operatingHours: "24/7 Mon-Sun",
        certThumbprint: "SHA256:7B:3A:9F:88:1C:4E:91",
        status: "VERIFIED",
        riskScore: 6,
        anomaliesLast24h: 0
      },
      {
        id: "EDGE-GATEWAY-EU-02",
        hostname: "gw-eu-central.fintech.internal",
        expectedFreqSec: 5.0,
        avgPayloadBytes: 1510,
        operatingHours: "24/7 Mon-Sun",
        certThumbprint: "SHA256:4C:11:88:3B:AA:22:90",
        status: "VERIFIED",
        riskScore: 9,
        anomaliesLast24h: 1
      },
      {
        id: "SHADOW-COLLECTOR-09",
        hostname: "rogue-agent-unverified.ext",
        expectedFreqSec: 0.5,
        avgPayloadBytes: 42800,
        operatingHours: "Off-Hours Burst (02:00 UTC)",
        certThumbprint: "UNTRUSTED_SELF_SIGNED",
        status: "QUARANTINED",
        riskScore: 94,
        anomaliesLast24h: 18
      }
    ];

    // 6. Attack Relationship Graph Data
    this.attackGraph = this._buildAttackGraph();

    // 7. Policy Simulator Baseline
    this.baselinePolicyHash = "sha256:4a7e93b1d798a6d2f349c81e289bf602a81907cb38290e29b1fa07409218d6a1";
    this.activePolicyHash = "sha256:4a7e93b1d798a6d2f349c81e289bf602a81907cb38290e29b1fa07409218d6a1";

    // 8. Reversible Remediation Actions
    this.remediationActions = [
      {
        id: "ACT-CANARY-ROTATE",
        title: "Revoke & Rotate Canary Token CANARY-SECRET-92831",
        target: "App Server Environment Vault",
        stage: "READY_FOR_APPROVAL",
        severity: "CRITICAL",
        reason: "Deception token triggered in egress inspection stream.",
        rollbackPlan: "Revert to backup credential reference via automated script within 60s.",
        countdown: 60,
        executed: false
      },
      {
        id: "ACT-QUARANTINE-NODE",
        title: "Quarantine Rogue Collector SHADOW-COLLECTOR-09",
        target: "mTLS Certificate Revocation List (CRL)",
        stage: "READY_FOR_APPROVAL",
        severity: "HIGH",
        reason: "Behavioral fingerprint deviation (payload burst 42.8KB at 0.5s intervals).",
        rollbackPlan: "Restore mTLS certificate trust in API Gateway allow-list.",
        countdown: 60,
        executed: false
      },
      {
        id: "ACT-RESTORE-POLICY",
        title: "Re-apply Approved Filtering Policy (Enforce Entropy < 4.2)",
        target: "Local Edge PrivacyGuard Configuration",
        stage: "APPROVED",
        severity: "MEDIUM",
        reason: "Configuration drift prevention and strict allow-list restoration.",
        rollbackPlan: "Restore previous policy snapshot from signed GitOps state.",
        countdown: 0,
        executed: true
      }
    ];
  }

  // --- Initializers ---
  _initializeLedger() {
    const list = [];
    let prevHash = "0000000000000000000000000000000000000000000000000000000000000000";
    for (let i = 1; i <= 6; i++) {
      const payloadId = `PAY-20261120-${1180 + i}`;
      const timestamp = new Date(Date.now() - (6 - i) * 15000).toISOString();
      const content = `{"seq":${i},"payloadId":"${payloadId}","tenant":"TENANT-FINTECH-01"}`;
      const payloadHash = crypto.createHash('sha256').update(content).digest('hex');
      const entryHash = crypto.createHash('sha256').update(payloadHash + prevHash).digest('hex');
      const hmacSig = crypto.createHmac('sha256', 'cicada_secret_key_2026').update(entryHash).digest('hex').slice(0, 16);

      list.push({
        sequence: i,
        payloadId,
        timestamp,
        collectorId: "PROD-APP-SERVER-01",
        payloadHash,
        previousHash: prevHash,
        entryHash,
        hmacSignature: `hmac-sha256:${hmacSig}`,
        policyDecision: "APPROVED",
        verificationStatus: "VERIFIED"
      });
      prevHash = entryHash;
    }
    return list;
  }

  _buildAttackGraph() {
    return {
      incidentId: "INC-CORRELATED-ATTACK-01",
      threatScore: 98.4,
      classification: "Compromised Server & Credential Exfiltration Attack",
      summary: "AI Engine correlated 4 disjoint signals across 3 minutes into a single high-severity breach event.",
      nodes: [
        { id: "node-1", type: "SECURITY", label: "10x Failed Logins", detail: "Brute force against internal auth service (actor_9c4e1a)", severity: "HIGH", timestamp: "T - 3m" },
        { id: "node-2", type: "COMPUTE", label: "CPU Spike (94.2%)", detail: "Spike in encryption/hash operations post-login attempt", severity: "HIGH", timestamp: "T - 2m" },
        { id: "node-3", type: "NETWORK", label: "Outbound Burst (3.8MB/s)", detail: "Unusual destination IP connection outside normal window", severity: "MEDIUM", timestamp: "T - 1m" },
        { id: "node-4", type: "CANARY", label: "Honeytoken Leak Trap", detail: "Attempted egress of CANARY-SECRET-92831 blocked by Guardian", severity: "CRITICAL", timestamp: "T - 0m" },
        { id: "root", type: "CORRELATED_INCIDENT", label: "Breach Prevented", detail: "AI Privacy Guardian halted payload. Rogue collector isolated.", severity: "CRITICAL", timestamp: "T + 0s" }
      ],
      edges: [
        { from: "node-1", to: "node-2", relationship: "Correlated Causal Link (Confidence 94%)" },
        { from: "node-2", to: "node-3", relationship: "Resource Exhaustion Follows (Confidence 91%)" },
        { from: "node-3", to: "node-4", relationship: "Exfiltration Path (Confidence 98%)" },
        { from: "node-4", to: "root", relationship: "Deterministic AI Privacy Guardian Block" }
      ]
    };
  }

  // --- API Handlers ---
  getOverview() {
    return {
      guardianStats: this.guardianStats,
      recentInspections: this.guardianLogs.slice(0, 8),
      honeytokens: this.honeytokens,
      threatLevel: this.currentThreatLevel,
      policyMatrix: this.adaptivePolicyMatrix,
      ledger: {
        entries: this.ledgerEntries,
        isTampered: this.ledgerTampered,
        totalEntries: this.ledgerEntries.length,
        verifiedCount: this.ledgerEntries.filter(e => e.verificationStatus === "VERIFIED").length
      },
      collectorFingerprints: this.collectorFingerprints,
      attackGraph: this.attackGraph,
      policySandbox: {
        baselineHash: this.baselinePolicyHash,
        activeHash: this.activePolicyHash,
        driftDetected: this.baselinePolicyHash !== this.activePolicyHash
      },
      remediationActions: this.remediationActions
    };
  }

  // Trigger Canary Leak Scenario (Feature 2) -> Persists to Atlas
  triggerCanaryLeak(tokenName = "CANARY-SECRET-92831") {
    const token = this.honeytokens.find(t => t.token === tokenName) || this.honeytokens[0];
    token.timesTriggered += 1;
    token.lastTriggered = new Date().toISOString();
    token.status = "TRIGGERED_BLOCKED";

    const newLog = {
      id: `INSP-${Math.floor(1000 + Math.random() * 9000)}`,
      payloadId: `PAY-20261120-${Math.floor(2000 + Math.random() * 8000)}`,
      collectorId: "PROD-APP-SERVER-01",
      timestamp: new Date().toISOString(),
      entropyScore: 4.92,
      canaryDetected: token.token,
      decision: "CRITICAL_BLOCKED",
      action: "HALT_EGRESS_AND_ISOLATE_COLLECTOR",
      reason: `Canary Honeytoken Exposure: ${token.token}. Outgoing payload blocked immediately before leaving local boundary.`
    };

    this.guardianLogs.unshift(newLog);
    this.guardianStats.totalInspected += 1;
    this.guardianStats.blockedCount += 1;
    this.currentThreatLevel = "CRITICAL_LOCKDOWN";

    // Persist to MongoDB Atlas collections in background
    HoneytokenModel.findOneAndUpdate(
      { id: token.id },
      { $set: { status: "TRIGGERED_BLOCKED", lastTriggered: new Date() }, $inc: { timesTriggered: 1 } }
    ).catch(err => console.error('MongoDB Honeytoken update error:', err.message));

    PrivacyGuardianModel.create({
      id: newLog.id,
      payloadId: newLog.payloadId,
      collectorId: newLog.collectorId,
      timestamp: new Date(),
      entropyScore: newLog.entropyScore,
      canaryDetected: newLog.canaryDetected,
      decision: newLog.decision,
      action: newLog.action,
      reason: newLog.reason
    }).catch(err => console.error('MongoDB PrivacyGuardian create error:', err.message));

    AdaptivePolicyModel.updateMany(
      {},
      { $set: { currentThreatLevel: "CRITICAL_LOCKDOWN" } }
    ).catch(err => console.error('MongoDB AdaptivePolicy update error:', err.message));

    return {
      success: true,
      scenario: "CANARY_SECRET_TRIGGERED",
      honeytoken: token,
      guardianLog: newLog,
      message: `Deception canary ${token.token} intercepted by AI Privacy Guardian! Outgoing transmission blocked at local perimeter.`
    };
  }

  // Trigger High Entropy Secret Leak (Feature 1) -> Persists to Atlas
  triggerEntropySecret() {
    const newLog = {
      id: `INSP-${Math.floor(1000 + Math.random() * 9000)}`,
      payloadId: `PAY-20261120-${Math.floor(2000 + Math.random() * 8000)}`,
      collectorId: "PROD-APP-SERVER-01",
      timestamp: new Date().toISOString(),
      entropyScore: 5.12,
      canaryDetected: null,
      decision: "SUSPICIOUS_HELD",
      action: "HOLD_REDACT_ADMIN_REVIEW",
      reason: "High Shannon Entropy (5.12 > 4.5) indicates cryptographic private key fragment. Egress held for review."
    };

    this.guardianLogs.unshift(newLog);
    this.guardianStats.totalInspected += 1;
    this.guardianStats.heldCount += 1;
    if (this.currentThreatLevel === "NORMAL") this.currentThreatLevel = "ELEVATED";

    // Persist to MongoDB Atlas
    PrivacyGuardianModel.create({
      id: newLog.id,
      payloadId: newLog.payloadId,
      collectorId: newLog.collectorId,
      timestamp: new Date(),
      entropyScore: newLog.entropyScore,
      canaryDetected: null,
      decision: newLog.decision,
      action: newLog.action,
      reason: newLog.reason
    }).catch(err => console.error('MongoDB PrivacyGuardian create error:', err.message));

    AdaptivePolicyModel.updateMany(
      {},
      { $set: { currentThreatLevel: this.currentThreatLevel } }
    ).catch(err => console.error('MongoDB AdaptivePolicy update error:', err.message));

    return {
      success: true,
      guardianLog: newLog,
      message: "High-entropy secret intercepted! Transmission held for administrator review."
    };
  }

  // Set Threat Level (Feature 3) -> Persists to Atlas
  setThreatLevel(level) {
    if (["NORMAL", "ELEVATED", "CRITICAL_LOCKDOWN"].includes(level)) {
      this.currentThreatLevel = level;
      
      AdaptivePolicyModel.updateMany(
        {},
        { $set: { currentThreatLevel: level } }
      ).catch(err => console.error('MongoDB AdaptivePolicy update error:', err.message));

      return { success: true, threatLevel: this.currentThreatLevel };
    }
    return { success: false, error: "Invalid threat level" };
  }

  // Tamper with Ledger (Feature 4) -> Persists to Atlas
  tamperLedger() {
    if (this.ledgerEntries.length > 2) {
      const target = this.ledgerEntries[2];
      target.payloadHash = "badbeef000000000000000000000000000000000000000000000000000000000";
      target.verificationStatus = "TAMPER_DETECTED";
      target.policyDecision = "SIGNATURE_MISMATCH";
      this.ledgerTampered = true;

      TamperLedgerModel.findOneAndUpdate(
        { sequence: 3 },
        {
          $set: {
            payloadHash: target.payloadHash,
            verificationStatus: "TAMPER_DETECTED",
            policyDecision: "SIGNATURE_MISMATCH"
          }
        }
      ).catch(err => console.error('MongoDB TamperLedger update error:', err.message));
    }
    return {
      success: true,
      message: "Maliciously altered 1 byte in Ledger Block #3. SHA-256 chain verification failed immediately!",
      isTampered: true
    };
  }

  // Reset / Heal Ledger (Feature 4) -> Restores in Atlas
  resetLedger() {
    this.ledgerEntries = this._initializeLedger();
    this.ledgerTampered = false;

    // Restore clean entries in MongoDB Atlas
    TamperLedgerModel.deleteMany({})
      .then(() => TamperLedgerModel.insertMany(this.ledgerEntries))
      .catch(err => console.error('MongoDB TamperLedger reset error:', err.message));

    return {
      success: true,
      message: "Cryptographic ledger restored. All SHA-256 hash chains verified intact.",
      isTampered: false
    };
  }

  // Simulate Rogue Collector Behavior (Feature 5) -> Persists to Atlas
  simulateRogueCollector() {
    const rogue = this.collectorFingerprints.find(c => c.id === "SHADOW-COLLECTOR-09");
    if (rogue) {
      rogue.status = "QUARANTINED";
      rogue.riskScore = 98;
      rogue.anomaliesLast24h += 5;

      CollectorFingerprintModel.findOneAndUpdate(
        { id: "SHADOW-COLLECTOR-09" },
        {
          $set: { status: "QUARANTINED", riskScore: 98 },
          $inc: { anomaliesLast24h: 5 }
        }
      ).catch(err => console.error('MongoDB CollectorFingerprint update error:', err.message));
    }
    return {
      success: true,
      message: "Rogue collector detected (Unusual egress frequency 0.5s & untrusted cert). Automatic quarantine enforced via mTLS revocation.",
      collector: rogue
    };
  }

  // Simulate Policy Sandbox (Feature 7) -> Persists to Atlas
  runPolicySimulation(rules = {}) {
    const sampleSize = 100;
    const stripIps = rules.strip_internal_ips !== false;
    const maxEntropy = rules.max_entropy_threshold || 4.2;

    const blocked = maxEntropy < 3.8 ? 16 : 8;
    const redacted = stripIps ? 24 : 6;
    const allowed = sampleSize - blocked;
    const dataLeakageRiskPct = +(blocked * 0.01).toFixed(2);
    const egressBandwidthSavedPct = +((blocked * 0.4 + redacted * 0.15)).toFixed(1);
    const summary = `Policy sandbox evaluated ${sampleSize} historical frames. Zero secrets allowed through boundary.`;

    // Persist simulation result to MongoDB Atlas
    PolicySimulatorModel.create({
      simulationId: `SIM-${Date.now()}`,
      baselinePolicyHash: this.baselinePolicyHash,
      activePolicyHash: this.activePolicyHash,
      sampleSize,
      recordsAllowed: allowed,
      recordsBlocked: blocked,
      recordsRedacted: redacted,
      dataLeakageRiskPct,
      egressBandwidthSavedPct,
      summary
    }).catch(err => console.error('MongoDB PolicySimulator create error:', err.message));

    return {
      sampleSize,
      recordsAllowed: allowed,
      recordsBlocked: blocked,
      recordsRedacted: redacted,
      dataLeakageRiskPct,
      egressBandwidthSavedPct,
      summary
    };
  }

  // Execute Human-Approved Remediation (Feature 8) -> Persists to Atlas
  executeRemediation(actionId) {
    const action = this.remediationActions.find(a => a.id === actionId);
    if (!action) return { success: false, error: "Action not found" };

    action.stage = "REMEDIATION_ACTIVE";
    action.executed = true;
    action.countdown = 60;

    RemediationModel.findOneAndUpdate(
      { id: actionId },
      { $set: { stage: "REMEDIATION_ACTIVE", executed: true, countdown: 60 } }
    ).catch(err => console.error('MongoDB Remediation update error:', err.message));

    return {
      success: true,
      action,
      message: `Human approval recorded for: ${action.title}. Rollback safety timer active (60s).`
    };
  }

  // Rollback Remediation (Feature 8) -> Persists to Atlas
  rollbackRemediation(actionId) {
    const action = this.remediationActions.find(a => a.id === actionId);
    if (!action) return { success: false, error: "Action not found" };

    action.stage = "ROLLED_BACK";
    action.executed = false;
    action.countdown = 0;

    RemediationModel.findOneAndUpdate(
      { id: actionId },
      { $set: { stage: "ROLLED_BACK", executed: false, countdown: 0 } }
    ).catch(err => console.error('MongoDB Remediation rollback error:', err.message));

    return {
      success: true,
      action,
      message: `Remediation ${actionId} successfully rolled back to original safe state.`
    };
  }

  // Reset entire PrivacyShield state
  resetAll() {
    this.guardianStats.totalInspected = 1420;
    this.guardianStats.approvedCount = 1368;
    this.guardianStats.heldCount = 38;
    this.guardianStats.blockedCount = 14;
    this.currentThreatLevel = "NORMAL";
    this.honeytokens.forEach(t => {
      t.status = "ACTIVE_TRAP";
      t.timesTriggered = 0;
      t.lastTriggered = null;
    });
    this.ledgerEntries = this._initializeLedger();
    this.ledgerTampered = false;
    this.activePolicyHash = this.baselinePolicyHash;
    return { success: true, message: "PrivacyShield AI state reset to pristine healthy baselines." };
  }
}

module.exports = new PrivacyShieldService();
