const store = require('../db/store');
const config = require('../config');

/**
 * Stale Collector Watchdog:
 * Checks active collectors every 3 seconds.
 * If no heartbeat received within 15 seconds, automatically downgrades health to POOR
 * and notifies the dashboard.
 */
class StaleCollectorWatchdog {
  constructor(io) {
    this.io = io;
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.checkCollectors();
    }, 3000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  checkCollectors() {
    const now = Date.now();
    for (const collector of store.collectors) {
      const lastSeen = new Date(collector.lastSeenAt || 0).getTime();
      const elapsed = now - lastSeen;

      if (elapsed > config.WATCHDOG_TIMEOUT_MS) {
        if (collector.status !== "STALE" && collector.status !== "OFFLINE") {
          collector.status = "STALE";
          collector.health_state = "POOR";
          
          const incident = {
            id: `INC-STALE-${collector.collectorId}-${Date.now()}`,
            tenantId: collector.tenantId,
            collectorId: collector.collectorId,
            type: "COLLECTOR_HEARTBEAT_TIMEOUT",
            title: "Silent Edge Collector Watchdog Triggered",
            severity: "HIGH",
            status: "ACTIVE",
            confidenceScore: 99,
            rootCauseExplanation: `Collector '${collector.collectorId}' missed heartbeat for ${Math.round(elapsed / 1000)}s (> 15s limit). Status downgraded to POOR per watchdog policy.`,
            signalsDetected: [`Last seen ${Math.round(elapsed / 1000)}s ago`],
            recommendedAction: "Inspect edge network connectivity or restart collector daemon service",
            suggestedFixId: "FIX_RESTART_COLLECTOR",
            createdAt: new Date().toISOString(),
            lastSeenAt: new Date().toISOString()
          };
          
          store.addIncident(incident);
          if (this.io) {
            this.io.to(collector.tenantId).emit("collector_status", collector);
            this.io.to(collector.tenantId).emit("incident_created", incident);
          }
        }
      }
    }
  }
}

module.exports = StaleCollectorWatchdog;
