const isBrowser = typeof window !== 'undefined';
const host = isBrowser ? window.location.hostname : 'localhost';
const isPort5000 = isBrowser && window.location.port === '5000';
const BACKEND_URL = isPort5000 ? window.location.origin : `http://${host}:5000`;
const LOCAL_COLLECTOR_URL = `http://${host}:8001`;

export async function fetchOverview(tenantId) {
  const res = await fetch(`${BACKEND_URL}/api/v1/dashboard/overview`, {
    headers: { "x-tenant-id": tenantId }
  });
  if (!res.ok) throw new Error("Failed to fetch overview");
  return res.json();
}

export async function fetchTelemetry(tenantId, limit = 40) {
  const res = await fetch(`${BACKEND_URL}/api/v1/telemetry?limit=${limit}`, {
    headers: { "x-tenant-id": tenantId }
  });
  if (!res.ok) throw new Error("Failed to fetch telemetry");
  return res.json();
}

export async function fetchIncidents(tenantId) {
  const res = await fetch(`${BACKEND_URL}/api/v1/incidents`, {
    headers: { "x-tenant-id": tenantId }
  });
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
}

export async function fetchAlerts(tenantId) {
  const res = await fetch(`${BACKEND_URL}/api/v1/alerts`, {
    headers: { "x-tenant-id": tenantId }
  });
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

export async function fetchEgressProof(tenantId) {
  const res = await fetch(`${BACKEND_URL}/api/v1/egress/proof`, {
    headers: { "x-tenant-id": tenantId }
  });
  if (!res.ok) throw new Error("Failed to fetch egress proof");
  return res.json();
}

export async function fetchCollectors(tenantId) {
  const res = await fetch(`${BACKEND_URL}/api/v1/collectors`, {
    headers: { "x-tenant-id": tenantId }
  });
  if (!res.ok) throw new Error("Failed to fetch collectors");
  return res.json();
}

export async function fetchBenchmarks(tenantId) {
  const res = await fetch(`${BACKEND_URL}/api/v1/benchmarks`, {
    headers: { "x-tenant-id": tenantId }
  });
  if (!res.ok) throw new Error("Failed to fetch benchmarks");
  return res.json();
}

export async function fetchAIInsights(tenantId) {
  const res = await fetch(`${BACKEND_URL}/api/v1/ai-insights`, {
    headers: { "x-tenant-id": tenantId }
  });
  if (!res.ok) throw new Error("Failed to fetch AI insights");
  return res.json();
}

export async function fetchRawVsRedacted() {
  const res = await fetch(`${LOCAL_COLLECTOR_URL}/raw-vs-redacted`);
  if (!res.ok) throw new Error("Failed to fetch local raw vs redacted");
  return res.json();
}

export async function fetchLocalStatus() {
  const res = await fetch(`${LOCAL_COLLECTOR_URL}/status`);
  if (!res.ok) throw new Error("Failed to fetch local status");
  return res.json();
}

export async function triggerSimulation(scenario) {
  const res = await fetch(`${BACKEND_URL}/api/v1/simulate/${scenario}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to trigger scenario");
  return res.json();
}

export async function approveRemediation(tenantId, incidentId) {
  const res = await fetch(`${BACKEND_URL}/api/v1/incidents/${incidentId}/remediate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-id": tenantId
    },
    body: JSON.stringify({ approver: "Lead SecOps Engineer" })
  });
  if (!res.ok) throw new Error("Failed to approve remediation");
  return res.json();
}

export async function triggerTamperTest() {
  const res = await fetch(`${LOCAL_COLLECTOR_URL}/tamper`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to simulate tamper");
  return res.json();
}

// --- PrivacyShield AI 8-Point Innovation APIs ---
export async function fetchPrivacyShieldOverview() {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/overview`);
  if (!res.ok) throw new Error("Failed to fetch PrivacyShield overview");
  return res.json();
}

export async function triggerCanaryLeak(token) {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/trigger-canary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });
  if (!res.ok) throw new Error("Failed to trigger canary leak");
  return res.json();
}

export async function triggerEntropySecret() {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/trigger-entropy`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to trigger entropy secret");
  return res.json();
}

export async function setAdaptiveThreatLevel(level) {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/threat-level`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ level })
  });
  if (!res.ok) throw new Error("Failed to update threat level");
  return res.json();
}

export async function tamperShieldLedger() {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/tamper-ledger`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to tamper shield ledger");
  return res.json();
}

export async function resetShieldLedger() {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/reset-ledger`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to reset shield ledger");
  return res.json();
}

export async function simulateRogueCollector() {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/simulate-rogue`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to simulate rogue collector");
  return res.json();
}

export async function runPolicySimulation(rules) {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/simulate-policy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rules)
  });
  if (!res.ok) throw new Error("Failed to run policy simulation");
  return res.json();
}

export async function executeShieldRemediation(actionId) {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/remediate/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actionId })
  });
  if (!res.ok) throw new Error("Failed to execute shield remediation");
  return res.json();
}

export async function rollbackShieldRemediation(actionId) {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/remediate/rollback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actionId })
  });
  if (!res.ok) throw new Error("Failed to rollback shield remediation");
  return res.json();
}

export async function resetPrivacyShieldAll() {
  const res = await fetch(`${BACKEND_URL}/api/v1/privacyshield/reset`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to reset PrivacyShield");
  return res.json();
}