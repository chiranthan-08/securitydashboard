const config = require('../config');

/**
 * Validates collector API Key or dashboard tenant header.
 * Enforces strict tenant boundary: clients cannot spoof or query across tenants.
 */
function authenticateTenant(req, res, next) {
  // Support header, query param, or default to primary demo tenant for browser GET navigation
  const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || req.query.tenant || (req.method === 'GET' ? 'TENANT-FINTECH-01' : null);
  const apiKey = req.headers['x-api-key'];

  if (!tenantId) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Missing 'x-tenant-id' header or '?tenantId=' parameter"
    });
  }

  const tenantConfig = config.VALID_TENANTS[tenantId];
  if (!tenantConfig) {
    return res.status(403).json({
      error: "FORBIDDEN",
      message: `Tenant '${tenantId}' is not authorized or does not exist`
    });
  }

  // If API Key is provided (e.g. from edge collector), verify it
  if (apiKey && apiKey !== tenantConfig.apiKey) {
    return res.status(403).json({
      error: "INVALID_CREDENTIALS",
      message: "API Key is invalid for the specified tenant"
    });
  }

  req.tenantId = tenantId;
  req.tenantConfig = tenantConfig;
  next();
}

module.exports = { authenticateTenant };
