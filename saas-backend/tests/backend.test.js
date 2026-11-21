const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const store = require('../src/db/store');
const { verifyAndParseEnvelope } = require('../src/services/cryptoVerifier');
const AIOpsCorrelationEngine = require('../src/aiops/correlationEngine');

test('SaaS Backend - Cryptographic verification & allow-list tests', async (t) => {
  const tenantId = "TENANT-FINTECH-01";
  const chainId = "CHAIN-TEST-001";
  const sequence = 1;
  const previousHash = "0".repeat(64);

  // 1. Build valid payload
  const validPayload = {
    payload_id: "PAY-20261120-0001",
    sequence_num: 1,
    tenant_id: tenantId,
    source_id: "PROD-APP-SERVER-01",
    timestamp_utc: "2026-11-20T10:00:00Z",
    sampling_mode: "HEARTBEAT",
    health_state: "EXCELLENT",
    metrics: { cpu_pct: 35.0, ram_pct: 42.0, disk_pct: 50.0, latency_ms: 30.0 },
    security_summary: { auth_failures_1m: 0, pseudonymous_actor: "actor_9c4e1a", pii_redacted_count: 0 },
    egress_audit: { raw_logs_transmitted: 0, sensitive_fields_detected: 0, previous_hash: previousHash, payload_hash: "" }
  };

  const rawBytes = Buffer.from(JSON.stringify(validPayload));
  const payloadSha256 = crypto.createHash('sha256').update(rawBytes).digest('hex');
  const entryHashMaterial = `cicada-egress-v1\n${chainId}\n${sequence}\n${previousHash}\n${payloadSha256}`;
  const entryHash = crypto.createHash('sha256').update(entryHashMaterial, 'utf8').digest('hex');

  const envelope = {
    payload_b64: rawBytes.toString('base64'),
    payload_sha256: payloadSha256,
    chain_id: chainId,
    sequence: sequence,
    previous_entry_hash: previousHash,
    entry_hash: entryHash
  };

  // Test 1: Valid envelope verification
  const result = verifyAndParseEnvelope(envelope, tenantId);
  assert.equal(result.valid, true, "Valid envelope should pass verification");
  assert.equal(result.payloadHash, payloadSha256);
  assert.equal(store.getChainHead(tenantId, chainId), entryHash);

  // Test 2: Tampered payload bytes
  const tamperedEnvelope = {
    ...envelope,
    payload_b64: Buffer.from(JSON.stringify({ ...validPayload, metrics: { cpu_pct: 99.9 } })).toString('base64')
  };
  const tamperedResult = verifyAndParseEnvelope(tamperedEnvelope, tenantId);
  assert.equal(tamperedResult.valid, false, "Tampered payload bytes should fail");
  assert.match(tamperedResult.error, /Payload byte corruption/);

  // Test 3: Forbidden secret key in payload
  const forbiddenChainId = "CHAIN-TEST-FORBIDDEN";
  const secretPayload = { ...validPayload, password: "ShouldNeverBeInPayload!" };
  const secretBytes = Buffer.from(JSON.stringify(secretPayload));
  const secretSha = crypto.createHash('sha256').update(secretBytes).digest('hex');
  const secretEntryHash = crypto.createHash('sha256').update(`cicada-egress-v1\n${forbiddenChainId}\n${sequence}\n${previousHash}\n${secretSha}`, 'utf8').digest('hex');
  const secretEnvelope = {
    payload_b64: secretBytes.toString('base64'),
    payload_sha256: secretSha,
    chain_id: forbiddenChainId,
    sequence: sequence,
    previous_entry_hash: previousHash,
    entry_hash: secretEntryHash
  };
  const secretResult = verifyAndParseEnvelope(secretEnvelope, tenantId);
  assert.equal(secretResult.valid, false, "Payload containing forbidden password must be rejected");
  assert.match(secretResult.error, /Zero-trust violation/);
});

test('SaaS Backend - AIOps Multi-Signal Correlation', async (t) => {
  const engine = new AIOpsCorrelationEngine(null);
  const tenantId = "TENANT-FINTECH-01";

  const highExhaustionTelemetry = {
    payload_id: "PAY-20261120-0099",
    source_id: "PROD-APP-SERVER-01",
    metrics: {
      cpu_pct: 96.4,
      ram_pct: 91.2,
      latency_ms: 485.0
    },
    security_summary: {
      auth_failures_1m: 1,
      pseudonymous_actor: "actor_123456",
      pii_redacted_count: 0
    }
  };

  const incident = engine.processTelemetry(tenantId, highExhaustionTelemetry);
  assert.ok(incident, "Should generate an incident");
  assert.equal(incident.type, "CORRELATED_RESOURCE_EXHAUSTION");
  assert.equal(incident.severity, "CRITICAL");
  assert.equal(incident.confidenceScore, 96);
  assert.match(incident.rootCauseExplanation, /Simultaneous CPU saturation/);
});
