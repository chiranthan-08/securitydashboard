const express = require('express');
const router = express.Router();
const store = require('../db/store');
const { verifyAndParseEnvelope } = require('../services/cryptoVerifier');
const benchmarkService = require('../services/benchmarkService');
const AIOpsEngine = require('../aiops/aiEngine');

const aiEngine = new AIOpsEngine();

module.exports = function(correlationEngine, io) {
  /**
   * POST /api/v1/telemetry
   * Collector Ingestion Endpoint
   */
  router.post('/telemetry', (req, res) => {
    const tenantId = req.tenantId;
    const envelope = req.body;

    // 1. Cryptographic Envelope Verification
    const verification = verifyAndParseEnvelope(envelope, tenantId);
    if (!verification.valid) {
      return res.status(400).json({
        error: "CRYPTOGRAPHIC_VERIFICATION_FAILED",
        detail: verification.error
      });
    }

    const payload = verification.payload;
    const collectorId = payload.source_id;
    const payloadId = payload.payload_id;

    // 2. Deduplication Check (Idempotent Retry)
    const existing = store.findTelemetryByEvent(tenantId, collectorId, payloadId);
    if (existing) {
      return res.status(200).json({
        status: "DUPLICATE_ACKNOWLEDGED",
        message: "Payload already durably recorded",
        sequence: envelope.sequence,
        payload_id: payloadId,
        received_at: existing.receivedAt
      });
    }

    // 3. Persist Telemetry
    const telemetryRecord = {
      ...payload,
      receivedAt: new Date().toISOString(),
      envelope_hashes: {
        payload_sha256: verification.payloadHash,
        previous_entry_hash: verification.previousHash,
        entry_hash: verification.entryHash
      }
    };
    store.addTelemetry(telemetryRecord);

    // 4. Update Collector State & Heartbeat
    store.upsertCollector({
      tenantId,
      collectorId,
      chain_id: envelope.chain_id,
      sequence: envelope.sequence,
      health_state: payload.health_state,
      sampling_mode: payload.sampling_mode,
      metrics: payload.metrics,
      status: "ONLINE",
      version: "1.0.0"
    });

    // 5. Store Cryptographic Egress Proof
    store.addEgressProof({
      tenantId,
      collectorId,
      sequence: envelope.sequence,
      payloadId: payload.payload_id,
      payloadHash: verification.payloadHash,
      previousHash: verification.previousHash,
      entryHash: verification.entryHash,
      healthState: payload.health_state,
      samplingMode: payload.sampling_mode,
      metricsSummary: payload.metrics,
      piiRedactedCount: payload.security_summary?.pii_redacted_count || 0,
      timestamp: payload.timestamp_utc,
      verified: true
    });

    // 5.5 Record Benchmark Latency
    benchmarkService.recordLatencySample(payload.timestamp_utc);

    // 5.6 Run Advanced AI Engine (XAI & Multi-Variate Anomaly Score)
    const aiInference = aiEngine.evaluateTelemetry(tenantId, telemetryRecord);
    telemetryRecord.aiInference = aiInference;

    // 6. Run AIOps Correlation
    if (correlationEngine) {
      correlationEngine.processTelemetry(tenantId, telemetryRecord);
    }

    // 7. Emit Real-Time Telemetry to connected frontend clients
    if (io) {
      io.to(tenantId).emit("telemetry_update", telemetryRecord);
    }

    // 8. Return Durable ACK
    return res.status(200).json({
      status: "ACKNOWLEDGED",
      sequence: envelope.sequence,
      payload_id: payloadId,
      entry_hash: verification.entryHash,
      received_at: new Date().toISOString()
    });
  });

  return router;
};
