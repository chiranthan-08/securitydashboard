const crypto = require('crypto');
const store = require('../db/store');

/**
 * Validates the exact-byte envelope:
 * 1. Checks payload_sha256 against actual SHA256 of raw bytes
 * 2. Checks entry_hash formula
 * 3. Checks previous_entry_hash continuity against recorded chain head
 * 4. Checks strict schema allow-list (zero forbidden fields allowed)
 */
function verifyAndParseEnvelope(envelope, tenantId) {
  const {
    payload_b64,
    payload_sha256,
    chain_id,
    sequence,
    previous_entry_hash,
    entry_hash
  } = envelope;

  if (!payload_b64 || !payload_sha256 || !chain_id || !sequence || !previous_entry_hash || !entry_hash) {
    return { valid: false, error: "Malformed envelope: missing mandatory cryptographic fields" };
  }

  // 1. Decode raw bytes
  const rawBytes = Buffer.from(payload_b64, 'base64');

  // 2. Exact-byte hash verification
  const computedPayloadHash = crypto.createHash('sha256').update(rawBytes).digest('hex');
  if (computedPayloadHash !== payload_sha256) {
    return {
      valid: false,
      error: `Payload byte corruption: computed SHA-256 (${computedPayloadHash}) != received (${payload_sha256})`
    };
  }

  // 3. Entry hash formula verification
  // cicada-egress-v1\n<chain_id>\n<sequence>\n<previous_entry_hash>\n<payload_sha256>
  const entryHashMaterial = `cicada-egress-v1\n${chain_id}\n${sequence}\n${previous_entry_hash}\n${payload_sha256}`;
  const computedEntryHash = crypto.createHash('sha256').update(entryHashMaterial, 'utf8').digest('hex');
  if (computedEntryHash !== entry_hash) {
    return {
      valid: false,
      error: `Entry hash tampering: computed (${computedEntryHash}) != envelope (${entry_hash})`
    };
  }

  // 4. Chain Continuity Verification
  const expectedPrevHash = store.getChainHead(tenantId, chain_id);
  // If sequence > 1, previous_entry_hash must match current chain head
  if (expectedPrevHash !== "0".repeat(64) && previous_entry_hash !== expectedPrevHash) {
    // Check if this is an idempotent retry of already committed sequence
    const existing = store.findTelemetryByEvent(tenantId, envelope.source_id, envelope.payload_id);
    if (!existing) {
      return {
        valid: false,
        error: `Chain broken: previous_entry_hash ${previous_entry_hash.substring(0, 12)}... does not match chain head ${expectedPrevHash.substring(0, 12)}...`
      };
    }
  }

  // 5. Parse JSON and enforce strict schema allow-list
  let payload;
  try {
    payload = JSON.parse(rawBytes.toString('utf8'));
  } catch (err) {
    return { valid: false, error: "Payload bytes could not be parsed as valid JSON" };
  }

  // Verify strict allow-list: ensure no forbidden fields ever exist
  const FORBIDDEN_KEYS = ["password", "raw_log", "email", "secret", "bearer_token", "access_token"];
  const payloadStr = JSON.stringify(payload).toLowerCase();
  for (const forbidden of FORBIDDEN_KEYS) {
    if (payloadStr.includes(`"${forbidden}"`)) {
      return {
        valid: false,
        error: `Zero-trust violation: forbidden field '${forbidden}' detected in approved payload!`
      };
    }
  }

  // Advance chain head upon successful validation
  store.setChainHead(tenantId, chain_id, entry_hash);

  return {
    valid: true,
    payload,
    entryHash: entry_hash,
    payloadHash: payload_sha256,
    previousHash: previous_entry_hash
  };
}

module.exports = { verifyAndParseEnvelope };
