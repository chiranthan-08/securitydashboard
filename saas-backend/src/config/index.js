require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "cicada_demo_jwt_secret_998811",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://sangeethachintu6_db_user:yhXbgO5NMNPpz1go@cluster0.ylwjczh.mongodb.net/cicada_sentinel?retryWrites=true&w=majority&compressors=zlib",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "cicada_sentinel",
  WATCHDOG_TIMEOUT_MS: 15000, // 15 seconds stale timeout
  REMEDIATION_MONITOR_WINDOW_MS: 60000, // 60s rollback monitor
  VALID_TENANTS: {
    "TENANT-FINTECH-01": {
      name: "Acme FinTech Corp (Production)",
      apiKey: "sec_demo_api_key_88f91",
      plan: "ENTERPRISE",
      tier: "ZERO_TRUST"
    },
    "TENANT-HEALTH-02": {
      name: "BioHealth Diagnostics (Isolated Staging)",
      apiKey: "sec_demo_health_key_44a12",
      plan: "ENTERPRISE_HIPAA",
      tier: "ZERO_TRUST"
    }
  }
};
