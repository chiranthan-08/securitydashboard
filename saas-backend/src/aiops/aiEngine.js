/**
 * CICADA Sentinel - Advanced AI Engine for Observability
 * 
 * Implements:
 * 1. Z-Score Anomaly Detection: Z = (x - mean) / std_dev
 * 2. EWMA (Exponentially Weighted Moving Average): baseline_t = alpha * x_t + (1 - alpha) * baseline_{t-1}
 * 3. Multi-Signal Correlation & Multi-Variate Anomaly Scoring (Isolation Forest style)
 * 4. Explainable AI (XAI) Attribution & Root Cause Analysis
 * 5. Warm-up state handling when samples are insufficient (< 5 samples)
 */

class AIOpsEngine {
  constructor(io) {
    this.io = io;
    this.alpha = 0.15; // EWMA smoothing factor
    this.minSamplesForInference = 5;
    this.maxHistory = 100;

    // Rolling telemetry history for statistical baselining
    this.history = {
      cpu: [],
      ram: [],
      latency: []
    };

    // EWMA state baselines
    this.ewma = {
      cpu: null,
      ram: null,
      latency: null
    };
  }

  /**
   * Updates EWMA and rolling window from genuine telemetry metrics
   */
  updateBaselines(metrics) {
    const updateMetric = (key, val) => {
      if (val === undefined || val === null || isNaN(val)) return;
      const num = Number(val);
      
      // Update EWMA
      if (this.ewma[key] === null) {
        this.ewma[key] = num;
      } else {
        this.ewma[key] = (this.alpha * num) + ((1.0 - this.alpha) * this.ewma[key]);
      }

      // Update rolling sample history
      this.history[key].push(num);
      if (this.history[key].length > this.maxHistory) {
        this.history[key].shift();
      }
    };

    updateMetric('cpu', metrics.cpu_pct);
    updateMetric('ram', metrics.ram_pct);
    updateMetric('latency', metrics.latency_ms);
  }

  /**
   * Computes dynamic mean and standard deviation for Z-Score calculation
   */
  getStats(key) {
    const arr = this.history[key] || [];
    if (arr.length < 2) {
      return { mean: this.ewma[key] || 30.0, std: 5.0, count: arr.length };
    }
    const mean = this.ewma[key] !== null 
      ? this.ewma[key] 
      : arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / arr.length;
    const std = Math.max(Math.sqrt(variance), 1.5); // minimum noise floor to prevent division by zero
    return { mean, std, count: arr.length };
  }

  /**
   * Main AI Inference Engine: Evaluates incoming telemetry
   */
  evaluateTelemetry(tenantId, record) {
    const metrics = record.metrics || {};
    const cpu = Number(metrics.cpu_pct) || 0;
    const ram = Number(metrics.ram_pct) || 0;
    const latency = Number(metrics.latency_ms) || 0;
    const sec = record.security_summary || {};

    // 1. Ingest into EWMA baselines
    this.updateBaselines(metrics);

    const cpuStats = this.getStats('cpu');
    const ramStats = this.getStats('ram');
    const latStats = this.getStats('latency');
    const totalSamples = Math.min(cpuStats.count, ramStats.count, latStats.count);

    // 2. Check for Warm-Up State
    if (totalSamples < this.minSamplesForInference) {
      return {
        status: "WARM_UP",
        warmupProgress: `${totalSamples}/${this.minSamplesForInference} samples`,
        isAnomaly: false,
        anomalyScore: Math.min(25, Math.round((cpu * 0.1) + (ram * 0.1))),
        confidence: 0.50,
        primaryFactor: "Baseline Calibrating",
        xaiReason: `AI Engine warming up: calibrated ${totalSamples} of ${this.minSamplesForInference} required samples. Establishing dynamic EWMA baselines.`,
        baselines: {
          cpuExpected: Math.round(cpuStats.mean),
          ramExpected: Math.round(ramStats.mean),
          latencyExpected: Math.round(latStats.mean)
        },
        featureAttribution: [
          { feature: "CPU Baselines", weight: 33, value: `${cpu}%` },
          { feature: "Memory Baselines", weight: 33, value: `${ram}%` },
          { feature: "Latency Baselines", weight: 34, value: `${latency}ms` }
        ],
        reasoningPath: [
          `Step 1 [Calibration]: Establishing initial Gaussian distribution for host ${record.source_id || "edge-node"}.`,
          `Step 2 [EWMA Tracking]: Dynamic EWMA baseline initialized (CPU: ${Math.round(cpuStats.mean)}%, RAM: ${Math.round(ramStats.mean)}%, Latency: ${Math.round(latStats.mean)}ms).`
        ]
      };
    }

    // 3. Compute Statistical Z-Scores
    const cpuZ = (cpu - cpuStats.mean) / cpuStats.std;
    const ramZ = (ram - ramStats.mean) / ramStats.std;
    const latZ = (latency - latStats.mean) / latStats.std;

    // 4. Multi-Signal Correlation & Isolation Forest Composite Score
    const absCpuZ = Math.max(0, cpuZ);
    const absRamZ = Math.max(0, ramZ);
    const absLatZ = Math.max(0, latZ);

    // Baseline weighted distance
    let rawScore = (absCpuZ * 18.0) + (absRamZ * 14.0) + (absLatZ * 16.0);

    // Non-linear amplification if multi-signal cascade is detected (CPU + Latency simultaneously breached)
    let isMultiSignalCascade = (absCpuZ > 2.0 && absLatZ > 2.0) || (absCpuZ > 2.0 && absRamZ > 1.8);
    if (isMultiSignalCascade) {
      rawScore *= 1.45; // Cross-metric correlation multiplier
    }

    // Direct threshold safeguards
    if (cpu > 90 || latency > 350) {
      rawScore = Math.max(rawScore, 85);
    } else if (cpu > 75 || latency > 180) {
      rawScore = Math.max(rawScore, 65);
    }

    const anomalyScore = Math.min(99, Math.max(10, Math.round(rawScore)));
    const isAnomaly = anomalyScore >= 68 || cpuZ > 2.8 || latZ > 3.0 || isMultiSignalCascade;

    // 5. Explainable AI (XAI) Attribution Breakdown
    const totalDeviation = absCpuZ + absRamZ + absLatZ || 1.0;
    const cpuWeight = Math.round((absCpuZ / totalDeviation) * 100);
    const ramWeight = Math.round((absRamZ / totalDeviation) * 100);
    const latWeight = Math.max(0, 100 - (cpuWeight + ramWeight));

    const featureAttribution = [
      { feature: "CPU Saturation", weight: cpuWeight, value: `${cpu}%`, zScore: +cpuZ.toFixed(2) },
      { feature: "Network Latency", weight: latWeight, value: `${latency}ms`, zScore: +latZ.toFixed(2) },
      { feature: "Memory Pressure", weight: ramWeight, value: `${ram}%`, zScore: +ramZ.toFixed(2) }
    ].sort((a, b) => b.weight - a.weight);

    const primaryFactor = featureAttribution[0].feature;

    // 6. Generate Contextual Root Cause & Recommended Action
    let xaiReason = "All infrastructure telemetry signals operating within expected Gaussian distributions (±2.0σ).";
    let recommendedAction = "No operational action needed. Maintain baseline continuous telemetry.";
    let confidence = 0.95;

    if (isMultiSignalCascade) {
      xaiReason = `Multi-Signal Cascade Anomaly: Co-occurring CPU saturation (${cpu}%, Z=+${cpuZ.toFixed(1)}) and latency degradation (${latency}ms, Z=+${latZ.toFixed(1)}) indicate upstream worker starvation.`;
      recommendedAction = "Scale service worker pool +3 replicas and cycle deadlocked worker thread pool.";
      confidence = 0.98;
    } else if (cpuZ > 2.5 || cpu > 85) {
      xaiReason = `Severe CPU Surge: CPU utilization (${cpu}%) breached baseline (${Math.round(cpuStats.mean)}% ± ${Math.round(cpuStats.std)}%) with Z-score of +${cpuZ.toFixed(1)}.`;
      recommendedAction = "Isolate CPU-intensive background tasks or assign elevated cgroup throttling.";
      confidence = 0.94;
    } else if (latZ > 2.5 || latency > 200) {
      xaiReason = `Latency SLA Degradation: Measured round-trip response time (${latency}ms) breached baseline (${Math.round(latStats.mean)}ms) with Z-score of +${latZ.toFixed(1)}.`;
      recommendedAction = "Reroute ingress traffic to regional secondary cluster and check TCP keep-alive queue.";
      confidence = 0.92;
    } else if (ramZ > 2.5 || ram > 85) {
      xaiReason = `Memory Pressure Elevation: Resident memory (${ram}%) breached baseline (${Math.round(ramStats.mean)}%) with Z-score of +${ramZ.toFixed(1)}.`;
      recommendedAction = "Trigger garbage collection and inspect for heap allocation retention.";
      confidence = 0.91;
    }

    // 7. Reasoning Path
    const reasoningPath = [
      `Step 1 [Statistical Ingestion]: Ingested real telemetry record #${record.sequence_num || 1}. EWMA mean: CPU ${Math.round(cpuStats.mean)}%, RAM ${Math.round(ramStats.mean)}%, Latency ${Math.round(latStats.mean)}ms.`,
      `Step 2 [Z-Score Calculation]: Deviation Z-Scores: CPU Z=${cpuZ > 0 ? '+' : ''}${cpuZ.toFixed(2)}, RAM Z=${ramZ > 0 ? '+' : ''}${ramZ.toFixed(2)}, Latency Z=${latZ > 0 ? '+' : ''}${latZ.toFixed(2)}.`,
      `Step 3 [Correlation Engine]: Composite Anomaly Score: ${anomalyScore}/100. Primary driver: ${primaryFactor} (${featureAttribution[0].weight}% contribution).`,
      `Step 4 [AIOps Recommendation]: ${recommendedAction}`
    ];

    return {
      status: isAnomaly ? "ANOMALY_DETECTED" : "HEALTHY",
      anomalyScore,
      isAnomaly,
      confidence,
      primaryFactor,
      xaiReason,
      recommendedAction,
      baselines: {
        cpuExpected: Math.round(cpuStats.mean),
        ramExpected: Math.round(ramStats.mean),
        latencyExpected: Math.round(latStats.mean),
        cpuStd: +cpuStats.std.toFixed(1),
        latStd: +latStats.std.toFixed(1)
      },
      zScores: {
        cpu: +cpuZ.toFixed(2),
        ram: +ramZ.toFixed(2),
        latency: +latZ.toFixed(2)
      },
      featureAttribution,
      reasoningPath
    };
  }
}

module.exports = AIOpsEngine;
