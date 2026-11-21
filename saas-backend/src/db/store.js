/**
 * High-performance, Tenant-Isolated Hybrid Store
 * Combines sub-millisecond in-memory caching with asynchronous durable persistence
 * to MongoDB Atlas (cluster0.ylwjczh.mongodb.net / cicada_sentinel).
 */

const {
  CollectorModel,
  TelemetryModel,
  EgressProofModel,
  IncidentModel,
  AlertModel
} = require('./mongo');

class TenantStore {
  constructor() {
    this.collectors = [];
    this.telemetry = [];
    this.alerts = [];
    this.incidents = [];
    this.egressLedger = [];
    this.auditLogs = [];
    this.chainHeads = new Map(); // key: `${tenantId}:${chainId}` -> head_entry_hash
  }

  // --- Collectors ---
  upsertCollector(collector) {
    const idx = this.collectors.findIndex(
      c => c.tenantId === collector.tenantId && c.collectorId === collector.collectorId
    );
    collector.lastSeenAt = new Date().toISOString();
    if (idx >= 0) {
      this.collectors[idx] = { ...this.collectors[idx], ...collector };
    } else {
      this.collectors.push(collector);
    }

    // Persist to MongoDB Atlas asynchronously
    CollectorModel.findOneAndUpdate(
      { tenantId: collector.tenantId, collectorId: collector.collectorId },
      {
        $set: {
          chain_id: collector.chain_id || "chain-edge-01",
          sequence: collector.sequence || 0,
          health_state: collector.health_state || "EXCELLENT",
          sampling_mode: collector.sampling_mode || "HEARTBEAT",
          metrics: collector.metrics || {},
          status: collector.status || "ONLINE",
          version: collector.version || "1.0.0",
          lastSeenAt: new Date()
        }
      },
      { upsert: true, returnDocument: 'after' }
    ).catch(err => console.error(`⚠️ MongoDB Atlas Collector sync warning:`, err.message));
  }

  getCollectors(tenantId) {
    return this.collectors.filter(c => c.tenantId === tenantId);
  }

  // --- Telemetry ---
  addTelemetry(record) {
    this.telemetry.unshift(record);
    if (this.telemetry.length > 2000) {
      this.telemetry.pop();
    }

    // Persist to MongoDB Atlas asynchronously
    TelemetryModel.create({
      tenant_id: record.tenant_id,
      source_id: record.source_id,
      payload_id: record.payload_id,
      timestamp_utc: record.timestamp_utc || new Date().toISOString(),
      receivedAt: record.receivedAt ? new Date(record.receivedAt) : new Date(),
      metrics: record.metrics,
      sampling_mode: record.sampling_mode,
      health_state: record.health_state,
      envelope_hashes: record.envelope_hashes,
      aiInference: record.aiInference
    }).catch(err => {
      // Ignore duplicate key error in Atlas if already recorded
      if (err.code !== 11000) {
        console.error(`⚠️ MongoDB Atlas Telemetry sync warning:`, err.message);
      }
    });
  }

  getTelemetry(tenantId, limit = 50) {
    return this.telemetry
      .filter(t => t.tenant_id === tenantId)
      .slice(0, limit)
      .reverse(); // chronological for charts
  }

  findTelemetryByEvent(tenantId, collectorId, payloadId) {
    return this.telemetry.find(
      t => t.tenant_id === tenantId && t.source_id === collectorId && t.payload_id === payloadId
    );
  }

  // --- Egress Ledger & Chain Head ---
  getChainHead(tenantId, chainId) {
    const key = `${tenantId}:${chainId}`;
    return this.chainHeads.get(key) || "0".repeat(64);
  }

  setChainHead(tenantId, chainId, entryHash) {
    const key = `${tenantId}:${chainId}`;
    this.chainHeads.set(key, entryHash);
  }

  addEgressProof(entry) {
    this.egressLedger.unshift(entry);
    if (this.egressLedger.length > 500) {
      this.egressLedger.pop();
    }

    // Persist to MongoDB Atlas asynchronously
    EgressProofModel.create({
      tenantId: entry.tenantId,
      collectorId: entry.collectorId,
      sequence: entry.sequence,
      payloadId: entry.payloadId,
      payloadHash: entry.payloadHash,
      previousHash: entry.previousHash,
      entryHash: entry.entryHash,
      healthState: entry.healthState,
      samplingMode: entry.samplingMode,
      metricsSummary: entry.metricsSummary,
      piiRedactedCount: entry.piiRedactedCount || 0,
      timestamp: entry.timestamp || new Date().toISOString(),
      verified: entry.verified !== false
    }).catch(err => console.error(`⚠️ MongoDB Atlas EgressProof sync warning:`, err.message));
  }

  getEgressProofs(tenantId, limit = 20) {
    return this.egressLedger
      .filter(e => e.tenantId === tenantId)
      .slice(0, limit);
  }

  // --- Alerts & Incidents ---
  addAlert(alert) {
    this.alerts.unshift(alert);
    if (this.alerts.length > 200) {
      this.alerts.pop();
    }

    // Persist to MongoDB Atlas asynchronously
    AlertModel.create({
      tenantId: alert.tenantId,
      id: alert.id || `ALT-${Date.now()}`,
      title: alert.title || alert.type || "System Alert",
      severity: alert.severity || "MEDIUM",
      collectorId: alert.collectorId || alert.source_id,
      timestamp: alert.timestamp ? new Date(alert.timestamp) : new Date(),
      details: alert
    }).catch(err => console.error(`⚠️ MongoDB Atlas Alert sync warning:`, err.message));
  }

  getAlerts(tenantId, limit = 50) {
    return this.alerts
      .filter(a => a.tenantId === tenantId)
      .slice(0, limit);
  }

  addIncident(incident) {
    const existing = this.incidents.find(
      i => i.tenantId === incident.tenantId && i.type === incident.type && i.status === "ACTIVE"
    );
    if (existing) {
      existing.lastSeenAt = new Date().toISOString();
      existing.occurrences = (existing.occurrences || 1) + 1;
      existing.evidence = incident.evidence;

      IncidentModel.findOneAndUpdate(
        { tenantId: existing.tenantId, id: existing.id },
        {
          $set: {
            lastSeenAt: new Date(),
            occurrences: existing.occurrences,
            evidence: existing.evidence
          }
        }
      ).catch(err => console.error(`⚠️ MongoDB Atlas Incident update warning:`, err.message));

      return existing;
    }

    this.incidents.unshift(incident);

    // Persist to MongoDB Atlas asynchronously
    IncidentModel.create({
      tenantId: incident.tenantId,
      id: incident.id,
      type: incident.type,
      severity: incident.severity,
      status: incident.status || "ACTIVE",
      title: incident.title,
      description: incident.description,
      evidence: incident.evidence,
      occurrences: incident.occurrences || 1,
      firstSeenAt: incident.firstSeenAt ? new Date(incident.firstSeenAt) : new Date(),
      lastSeenAt: incident.lastSeenAt ? new Date(incident.lastSeenAt) : new Date(),
      remediation: incident.remediation
    }).catch(err => console.error(`⚠️ MongoDB Atlas Incident sync warning:`, err.message));

    return incident;
  }

  getIncidents(tenantId) {
    return this.incidents.filter(i => i.tenantId === tenantId);
  }

  updateIncident(tenantId, incidentId, updates) {
    const inc = this.incidents.find(i => i.tenantId === tenantId && i.id === incidentId);
    if (inc) {
      Object.assign(inc, updates);
      
      IncidentModel.findOneAndUpdate(
        { tenantId, id: incidentId },
        { $set: updates }
      ).catch(err => console.error(`⚠️ MongoDB Atlas Incident update warning:`, err.message));

      return inc;
    }
    return null;
  }

  // --- Audit Trail ---
  addAudit(log) {
    log.timestamp = new Date().toISOString();
    this.auditLogs.unshift(log);
  }

  getAudits(tenantId, limit = 50) {
    return this.auditLogs
      .filter(a => a.tenantId === tenantId)
      .slice(0, limit);
  }
}

const store = new TenantStore();
module.exports = store;
