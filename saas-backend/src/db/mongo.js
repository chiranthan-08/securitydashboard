const mongoose = require('mongoose');

let isConnected = false;
let clusterHost = "cluster0.ylwjczh.mongodb.net";
let dbName = "cicada_sentinel";

// ==================== CORE PLATFORM SCHEMAS ====================

// 1. Collector Fleet Schema
const collectorSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  collectorId: { type: String, required: true, index: true },
  chain_id: { type: String, default: "chain-edge-01" },
  sequence: { type: Number, default: 0 },
  health_state: { type: String, default: "EXCELLENT" },
  sampling_mode: { type: String, default: "HEARTBEAT" },
  metrics: mongoose.Schema.Types.Mixed,
  status: { type: String, default: "ONLINE" },
  version: { type: String, default: "1.0.0" },
  lastSeenAt: { type: Date, default: Date.now }
}, { collection: 'collectors', timestamps: true });
collectorSchema.index({ tenantId: 1, collectorId: 1 }, { unique: true });

// 2. Telemetry Records Schema (with 7-day TTL retention index)
const telemetrySchema = new mongoose.Schema({
  tenant_id: { type: String, required: true, index: true },
  source_id: { type: String, required: true, index: true },
  payload_id: { type: String, required: true, index: true },
  timestamp_utc: { type: String, required: true },
  receivedAt: { type: Date, default: Date.now, index: true, expires: 604800 },
  metrics: {
    cpu_pct: Number,
    ram_pct: Number,
    ram_total_gb: Number,
    ram_available_gb: Number,
    disk_pct: Number,
    disk_read_mb: Number,
    disk_write_mb: Number,
    net_bytes_sent: Number,
    net_bytes_recv: Number,
    net_rx_bps: Number,
    net_tx_bps: Number,
    net_throughput_bps: Number,
    latency_ms: Number,
    packet_loss_pct: Number,
    system_uptime_sec: Number,
    os_info: mongoose.Schema.Types.Mixed,
    collection_timestamp: String,
    is_live_hardware: Boolean
  },
  sampling_mode: { type: String, default: "HEARTBEAT" },
  health_state: { type: String, default: "EXCELLENT" },
  envelope_hashes: {
    payload_sha256: String,
    previous_entry_hash: String,
    entry_hash: String,
    hmac_signature: String
  },
  aiInference: {
    anomalyScore: Number,
    isAnomaly: Boolean,
    confidence: Number,
    xaiReason: String,
    primaryFactor: String,
    baselineDeviations: mongoose.Schema.Types.Mixed
  }
}, { collection: 'telemetry', timestamps: true });
telemetrySchema.index({ tenant_id: 1, source_id: 1, payload_id: 1 }, { unique: true });

// 3. Egress Proof Ledger Schema
const egressProofSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  collectorId: { type: String, required: true },
  sequence: { type: Number, required: true },
  payloadId: { type: String, required: true },
  payloadHash: { type: String, required: true },
  previousHash: { type: String, required: true },
  entryHash: { type: String, required: true },
  healthState: { type: String, default: "EXCELLENT" },
  samplingMode: { type: String, default: "HEARTBEAT" },
  metricsSummary: mongoose.Schema.Types.Mixed,
  piiRedactedCount: { type: Number, default: 0 },
  timestamp: { type: String, required: true },
  verified: { type: Boolean, default: true }
}, { timestamps: true });

// 4. Incident Management Schema
const incidentSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  id: { type: String, required: true, index: true },
  type: { type: String, required: true },
  severity: { type: String, required: true },
  status: { type: String, default: "ACTIVE" },
  title: { type: String, required: true },
  description: { type: String },
  evidence: mongoose.Schema.Types.Mixed,
  occurrences: { type: Number, default: 1 },
  firstSeenAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now },
  remediation: mongoose.Schema.Types.Mixed
}, { collection: 'incidents', timestamps: true });

// 5. Alert History / Security Events Schema
const alertSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  id: { type: String, required: true },
  title: { type: String, required: true },
  severity: { type: String, required: true },
  collectorId: { type: String },
  timestamp: { type: Date, default: Date.now },
  details: mongoose.Schema.Types.Mixed
}, { collection: 'security_events', timestamps: true });


// ==================== 8 DEDICATED INNOVATION FEATURE SCHEMAS ====================

// Feature #1: AI Privacy Guardian (Collection: privacy_guardians)
const privacyGuardianSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  payloadId: { type: String, required: true },
  collectorId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  entropyScore: { type: Number, default: 0 },
  canaryDetected: { type: String, default: null },
  decision: { type: String, default: "APPROVED" }, // APPROVED, SUSPICIOUS_HELD, CRITICAL_BLOCKED
  action: { type: String, default: "EGRESS_ALLOWED_METADATA_ONLY" },
  reason: { type: String, required: true }
}, { collection: 'privacy_guardians', timestamps: true });

// Feature #2: Canary Honeytokens (Collection: honeytokens)
const honeytokenSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  token: { type: String, required: true, unique: true },
  environment: { type: String, required: true },
  plantedDate: { type: String, default: "2026-11-01" },
  status: { type: String, default: "ACTIVE_TRAP" }, // ACTIVE_TRAP, TRIGGERED_BLOCKED
  lastTriggered: { type: Date, default: null },
  timesTriggered: { type: Number, default: 0 }
}, { collection: 'honeytokens', timestamps: true });

// Feature #3: Adaptive Dynamic Privacy (Collection: adaptive_policies)
const adaptivePolicySchema = new mongoose.Schema({
  tier: { type: String, required: true, unique: true }, // Public, Internal, Confidential, Critical
  fieldTypes: { type: String, required: true },
  normal: { type: String, required: true },
  elevated: { type: String, required: true },
  lockdown: { type: String, required: true },
  currentThreatLevel: { type: String, default: "NORMAL" }
}, { collection: 'adaptive_policies', timestamps: true });

// Feature #4: Tamper-Evident Egress Ledger (Collection: tamper_ledgers)
const tamperLedgerSchema = new mongoose.Schema({
  sequence: { type: Number, required: true, unique: true, index: true },
  payloadId: { type: String, required: true },
  timestamp: { type: String, required: true },
  collectorId: { type: String, default: "PROD-APP-SERVER-01" },
  payloadHash: { type: String, required: true },
  previousHash: { type: String, required: true },
  entryHash: { type: String, required: true },
  hmacSignature: { type: String, required: true },
  policyDecision: { type: String, default: "APPROVED" },
  verificationStatus: { type: String, default: "VERIFIED" } // VERIFIED, TAMPER_DETECTED
}, { collection: 'tamper_ledgers', timestamps: true });

// Feature #5: Collector Fingerprinting (Collection: collector_fingerprints)
const collectorFingerprintSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  hostname: { type: String, required: true },
  expectedFreqSec: { type: Number, default: 5.0 },
  avgPayloadBytes: { type: Number, default: 1420 },
  operatingHours: { type: String, default: "24/7 Mon-Sun" },
  certThumbprint: { type: String, required: true },
  status: { type: String, default: "VERIFIED" }, // VERIFIED, QUARANTINED
  riskScore: { type: Number, default: 5 },
  anomaliesLast24h: { type: Number, default: 0 }
}, { collection: 'collector_fingerprints', timestamps: true });

// Feature #6: Attack Correlation Graph (Collection: attack_graphs)
const attackGraphSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true, index: true },
  threatScore: { type: Number, required: true },
  classification: { type: String, required: true },
  summary: { type: String, required: true },
  nodes: [{
    id: String,
    type: { type: String },
    label: String,
    detail: String,
    severity: String,
    timestamp: String
  }],
  edges: [{
    from: String,
    to: String,
    relationship: String
  }]
}, { collection: 'attack_graphs', timestamps: true });

// Feature #7: Policy Simulator Sandbox (Collection: policy_simulators)
const policySimulatorSchema = new mongoose.Schema({
  simulationId: { type: String, required: true, unique: true, index: true },
  baselinePolicyHash: { type: String, required: true },
  activePolicyHash: { type: String, required: true },
  sampleSize: { type: Number, default: 100 },
  recordsAllowed: { type: Number, default: 92 },
  recordsBlocked: { type: Number, default: 8 },
  recordsRedacted: { type: Number, default: 24 },
  dataLeakageRiskPct: { type: Number, default: 0.08 },
  egressBandwidthSavedPct: { type: Number, default: 6.8 },
  summary: { type: String, required: true }
}, { collection: 'policy_simulators', timestamps: true });

// Feature #8: Reversible Remediation Actions (Collection: remediations)
const remediationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  target: { type: String, required: true },
  stage: { type: String, default: "READY_FOR_APPROVAL" }, // READY_FOR_APPROVAL, REMEDIATION_ACTIVE, APPROVED, ROLLED_BACK
  severity: { type: String, default: "HIGH" },
  reason: { type: String, required: true },
  rollbackPlan: { type: String, required: true },
  countdown: { type: Number, default: 60 },
  executed: { type: Boolean, default: false }
}, { collection: 'remediations', timestamps: true });

// ==================== COMPILE MONGOOSE MODELS ====================
const CollectorModel = mongoose.model('Collector', collectorSchema);
const TelemetryModel = mongoose.model('Telemetry', telemetrySchema);
const EgressProofModel = mongoose.model('EgressProof', egressProofSchema);
const IncidentModel = mongoose.model('Incident', incidentSchema);
const AlertModel = mongoose.model('Alert', alertSchema);

// 8 Innovation Models with Explicit MongoDB Atlas Collection Names
const PrivacyGuardianModel = mongoose.model('PrivacyGuardian', privacyGuardianSchema);
const HoneytokenModel = mongoose.model('Honeytoken', honeytokenSchema);
const AdaptivePolicyModel = mongoose.model('AdaptivePolicy', adaptivePolicySchema);
const TamperLedgerModel = mongoose.model('TamperLedger', tamperLedgerSchema);
const CollectorFingerprintModel = mongoose.model('CollectorFingerprint', collectorFingerprintSchema);
const AttackGraphModel = mongoose.model('AttackGraph', attackGraphSchema);
const PolicySimulatorModel = mongoose.model('PolicySimulator', policySimulatorSchema);
const RemediationModel = mongoose.model('Remediation', remediationSchema);

// ==================== SEED BASELINE DATA FOR ALL 8 FEATURES ====================
async function seedInitialAtlasData() {
  try {
    const defaultTenant = "TENANT-FINTECH-01";

    // 1. Core Fleet & Telemetry
    const collectorCount = await CollectorModel.countDocuments();
    if (collectorCount === 0) {
      console.log('🌱 Seeding initial baseline telemetry & fleet into MongoDB Atlas...');
      await CollectorModel.create({
        tenantId: defaultTenant,
        collectorId: "collector-edge-01",
        chain_id: "chain-edge-01",
        sequence: 1,
        health_state: "EXCELLENT",
        sampling_mode: "HEARTBEAT",
        metrics: { cpu_pct: 18.4, ram_pct: 42.1, disk_pct: 35.8, latency_ms: 12.5 },
        status: "ONLINE",
        version: "1.0.0",
        lastSeenAt: new Date()
      });
    }

    // Feature #1: AI Privacy Guardian Seeder
    const guardianCount = await PrivacyGuardianModel.countDocuments();
    if (guardianCount === 0) {
      console.log('🌱 Seeding Feature #1 (AI Privacy Guardian) into MongoDB Atlas collection [privacy_guardians]...');
      await PrivacyGuardianModel.insertMany([
        {
          id: "INSP-9921",
          payloadId: "PAY-20261120-1191",
          collectorId: "PROD-APP-SERVER-01",
          timestamp: new Date(Date.now() - 4000),
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
          timestamp: new Date(Date.now() - 12000),
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
          timestamp: new Date(Date.now() - 25000),
          entropyScore: 4.88,
          canaryDetected: null,
          decision: "SUSPICIOUS_HELD",
          action: "HOLD_REDACT_ADMIN_REVIEW",
          reason: "High Shannon Entropy (4.88 > 4.5) indicates probable cryptographic secret in log field."
        }
      ]);
    }

    // Feature #2: Canary Honeytokens Seeder
    const honeytokenCount = await HoneytokenModel.countDocuments();
    if (honeytokenCount === 0) {
      console.log('🌱 Seeding Feature #2 (Honeytokens) into MongoDB Atlas collection [honeytokens]...');
      await HoneytokenModel.insertMany([
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
      ]);
    }

    // Feature #3: Adaptive Dynamic Privacy Seeder
    const policyCount = await AdaptivePolicyModel.countDocuments();
    if (policyCount === 0) {
      console.log('🌱 Seeding Feature #3 (Adaptive Privacy) into MongoDB Atlas collection [adaptive_policies]...');
      await AdaptivePolicyModel.insertMany([
        {
          tier: "Public",
          fieldTypes: "CPU, Memory, Disk Saturation, Network Rx/Tx",
          normal: "Allow (Full Metric)",
          elevated: "Allow (Aggregated 10s)",
          lockdown: "Allow (Heartbeat 30s)",
          currentThreatLevel: "NORMAL"
        },
        {
          tier: "Internal",
          fieldTypes: "Hostname, Service Name, Collector UUID, OS Kernel",
          normal: "Pseudonymize (SHA-256)",
          elevated: "Pseudonymize (Salted)",
          lockdown: "Redact Completely",
          currentThreatLevel: "NORMAL"
        },
        {
          tier: "Confidential",
          fieldTypes: "Internal IP, Port Numbers, Pseudonymous Actor IDs",
          normal: "Redact / Mask",
          elevated: "Strictly Redact",
          lockdown: "Strictly Drop",
          currentThreatLevel: "NORMAL"
        },
        {
          tier: "Critical",
          fieldTypes: "Passwords, API Keys, Tokens, Honeytokens",
          normal: "Block & Alert",
          elevated: "Block & Alert",
          lockdown: "Block & Quarantine",
          currentThreatLevel: "NORMAL"
        }
      ]);
    }

    // Feature #4: Tamper-Evident Ledger Seeder
    const ledgerCount = await TamperLedgerModel.countDocuments();
    if (ledgerCount === 0) {
      console.log('🌱 Seeding Feature #4 (Tamper Egress Ledger) into MongoDB Atlas collection [tamper_ledgers]...');
      const crypto = require('crypto');
      const ledgerSeeds = [];
      let prevHash = "0000000000000000000000000000000000000000000000000000000000000000";
      for (let i = 1; i <= 6; i++) {
        const payloadId = `PAY-20261120-${1180 + i}`;
        const timestamp = new Date(Date.now() - (6 - i) * 15000).toISOString();
        const content = `{"seq":${i},"payloadId":"${payloadId}","tenant":"TENANT-FINTECH-01"}`;
        const payloadHash = crypto.createHash('sha256').update(content).digest('hex');
        const entryHash = crypto.createHash('sha256').update(payloadHash + prevHash).digest('hex');
        const hmacSig = crypto.createHmac('sha256', 'cicada_secret_key_2026').update(entryHash).digest('hex').slice(0, 16);

        ledgerSeeds.push({
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
      await TamperLedgerModel.insertMany(ledgerSeeds);
    }

    // Feature #5: Collector Fingerprints Seeder
    const fingerprintCount = await CollectorFingerprintModel.countDocuments();
    if (fingerprintCount === 0) {
      console.log('🌱 Seeding Feature #5 (Collector Fingerprints) into MongoDB Atlas collection [collector_fingerprints]...');
      await CollectorFingerprintModel.insertMany([
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
      ]);
    }

    // Feature #6: Attack Correlation Graph Seeder
    const graphCount = await AttackGraphModel.countDocuments();
    if (graphCount === 0) {
      console.log('🌱 Seeding Feature #6 (Attack Graph) into MongoDB Atlas collection [attack_graphs]...');
      await AttackGraphModel.create({
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
      });
    }

    // Feature #7: Policy Simulator Sandbox Seeder
    const simCount = await PolicySimulatorModel.countDocuments();
    if (simCount === 0) {
      console.log('🌱 Seeding Feature #7 (Policy Simulator) into MongoDB Atlas collection [policy_simulators]...');
      await PolicySimulatorModel.create({
        simulationId: "SIM-BASELINE-01",
        baselinePolicyHash: "sha256:4a7e93b1d798a6d2f349c81e289bf602a81907cb38290e29b1fa07409218d6a1",
        activePolicyHash: "sha256:4a7e93b1d798a6d2f349c81e289bf602a81907cb38290e29b1fa07409218d6a1",
        sampleSize: 100,
        recordsAllowed: 92,
        recordsBlocked: 8,
        recordsRedacted: 24,
        dataLeakageRiskPct: 0.08,
        egressBandwidthSavedPct: 6.8,
        summary: "Policy sandbox baseline evaluated 100 historical telemetry frames. Zero secrets allowed through boundary."
      });
    }

    // Feature #8: Reversible Remediation Actions Seeder
    const remediationCount = await RemediationModel.countDocuments();
    if (remediationCount === 0) {
      console.log('🌱 Seeding Feature #8 (Remediations) into MongoDB Atlas collection [remediations]...');
      await RemediationModel.insertMany([
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
      ]);
    }

    console.log('✅ ALL 8 Innovation features verified and seeded in MongoDB Atlas collections!');
  } catch (err) {
    console.error('⚠️ Notice during Atlas baseline seed:', err.message);
  }
}

// ==================== CONNECT FUNCTION ====================
async function connectMongo(customUri) {
  const uri = customUri || process.env.MONGODB_URI || "mongodb+srv://sangeethachintu6_db_user:yhXbgO5NMNPpz1go@cluster0.ylwjczh.mongodb.net/cicada_sentinel?retryWrites=true&w=majority&compressors=zlib";
  
  try {
    console.log(`Connecting to MongoDB Atlas Cluster: cluster0.ylwjczh.mongodb.net...`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      family: 4
    });

    isConnected = true;
    dbName = mongoose.connection.name || "cicada_sentinel";
    clusterHost = mongoose.connection.host || "cluster0.ylwjczh.mongodb.net";
    
    console.log(`=======================================================`);
    console.log(`🟢 MongoDB Atlas Connected Successfully!`);
    console.log(`   Host:     ${clusterHost}`);
    console.log(`   Database: ${dbName}`);
    console.log(`=======================================================`);

    // Seed baseline documents for all collections
    await seedInitialAtlasData();

    return true;
  } catch (err) {
    console.error(`🔴 MongoDB Atlas Connection Warning:`, err.message);
    isConnected = false;
    return false;
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('⚠️ MongoDB Atlas connection lost. Retrying in background...');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('🟢 MongoDB Atlas connection restored.');
});

function getMongoStatus() {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: clusterHost,
    dbName: dbName,
    statusText: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED"
  };
}

module.exports = {
  connectMongo,
  getMongoStatus,
  CollectorModel,
  TelemetryModel,
  EgressProofModel,
  IncidentModel,
  AlertModel,
  PrivacyGuardianModel,
  HoneytokenModel,
  AdaptivePolicyModel,
  TamperLedgerModel,
  CollectorFingerprintModel,
  AttackGraphModel,
  PolicySimulatorModel,
  RemediationModel
};
