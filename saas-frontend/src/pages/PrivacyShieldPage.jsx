import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Cpu,
  Key,
  Flame,
  Radio,
  FileCheck2,
  Terminal,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  Layers,
  Sparkles,
  GitCompare,
  ArrowRight,
  Eye,
  Workflow,
  Server,
  Zap,
  Clock,
  Shield,
  CornerDownRight,
  RefreshCw
} from 'lucide-react';
import {
  fetchPrivacyShieldOverview,
  triggerCanaryLeak,
  triggerEntropySecret,
  setAdaptiveThreatLevel,
  tamperShieldLedger,
  resetShieldLedger,
  simulateRogueCollector,
  runPolicySimulation,
  executeShieldRemediation,
  rollbackShieldRemediation,
  resetPrivacyShieldAll
} from '../services/api';

export default function PrivacyShieldPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("hybrid"); // hybrid (both), architecture (blueprints only), interactive (simulators only)
  const [actionNotice, setActionNotice] = useState(null);
  const [simResults, setSimResults] = useState(null);
  const [simRules, setSimRules] = useState({ strip_internal_ips: true, max_entropy_threshold: 4.2 });
  const [expandedArchitectures, setExpandedArchitectures] = useState({
    f1: true,
    f2: true,
    f3: true,
    f4: true,
    f5: true,
    f6: true,
    f7: true,
    f8: true
  });

  const toggleArch = (key) => {
    setExpandedArchitectures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const loadData = async () => {
    try {
      const res = await fetchPrivacyShieldOverview();
      setData(res);
    } catch (err) {
      console.error("Failed to load PrivacyShield data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (msg, isError = false) => {
    setActionNotice({ msg, isError });
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleTriggerCanary = async (token) => {
    try {
      const res = await triggerCanaryLeak(token);
      showNotification(res.message);
      loadData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleTriggerEntropy = async () => {
    try {
      const res = await triggerEntropySecret();
      showNotification(res.message);
      loadData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleSetThreatLevel = async (level) => {
    try {
      await setAdaptiveThreatLevel(level);
      showNotification(`Adaptive Threat Level switched to: ${level}`);
      loadData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleTamperLedger = async () => {
    try {
      const res = await tamperShieldLedger();
      showNotification(res.message, true);
      loadData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleResetLedger = async () => {
    try {
      const res = await resetShieldLedger();
      showNotification(res.message);
      loadData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleSimulateRogue = async () => {
    try {
      const res = await simulateRogueCollector();
      showNotification(res.message);
      loadData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleRunPolicySim = async () => {
    try {
      const res = await runPolicySimulation(simRules);
      setSimResults(res);
      showNotification("Policy sandbox simulation completed successfully.");
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleExecuteRemediation = async (actionId) => {
    try {
      const res = await executeShieldRemediation(actionId);
      showNotification(res.message);
      loadData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleRollbackRemediation = async (actionId) => {
    try {
      const res = await rollbackShieldRemediation(actionId);
      showNotification(res.message);
      loadData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleResetAll = async () => {
    try {
      const res = await resetPrivacyShieldAll();
      showNotification(res.message);
      setSimResults(null);
      loadData();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <Activity className="h-6 w-6 animate-spin text-cyan-400 mr-2" />
        <span>Initializing PrivacyShield AI Innovation Hub...</span>
      </div>
    );
  }

  const {
    guardianStats,
    recentInspections,
    honeytokens,
    threatLevel,
    policyMatrix,
    ledger,
    collectorFingerprints,
    attackGraph,
    policySandbox,
    remediationActions
  } = data || {};

  const showArch = viewMode === "hybrid" || viewMode === "architecture";
  const showInter = viewMode === "hybrid" || viewMode === "interactive";

  return (
    <div className="space-y-6">
      {/* Flagship Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/60 border border-emerald-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Flagship Innovation Suite
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-bold">
                Self-Protecting AIOps
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                Zero-Trust Tier 1
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              PrivacyShield AI — Self-Protecting AIOps Platform
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Complete 8-Point Innovation Architecture: Each feature combines an intuitive visual system design blueprint
              with a live interactive testing engine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950/90 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode("hybrid")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  viewMode === "hybrid" ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hybrid View
              </button>
              <button
                onClick={() => setViewMode("architecture")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  viewMode === "architecture" ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Architecture Only
              </button>
              <button
                onClick={() => setViewMode("interactive")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  viewMode === "interactive" ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Simulators Only
              </button>
            </div>

            <button
              onClick={handleResetAll}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Reset all innovation scenarios to baseline"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              Reset Baselines
            </button>
          </div>
        </div>

        {/* Live Action Toast Banner */}
        {actionNotice && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
            actionNotice.isError ? 'bg-rose-950/80 border-rose-500 text-rose-200' : 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
          }`}>
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{actionNotice.msg}</span>
          </div>
        )}
      </div>

      {/* Innovation Quick-Filter Pills */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "all", label: "All 8 Features" },
          { id: "guardian", label: "1. AI Privacy Guardian" },
          { id: "canary", label: "2. Canary Honeytokens" },
          { id: "adaptive", label: "3. Adaptive Privacy" },
          { id: "ledger", label: "4. Tamper Egress Ledger" },
          { id: "fingerprint", label: "5. Collector Fingerprinting" },
          { id: "graph", label: "6. Attack Correlation Graph" },
          { id: "sandbox", label: "7. Policy Simulator" },
          { id: "remediation", label: "8. Reversible Remediation" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 1: AI PRIVACY GUARDIAN (PRE-TRANSMISSION FIREWALL)                */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "guardian") && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Feature 1: AI-Powered Privacy Firewall (Pre-Transmission Guardian)
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Tier 1 Local Edge
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-transmission inspection engine that continuously evaluates data safety before egress.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleArch('f1')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Workflow className="h-3.5 w-3.5 text-cyan-400" />
                {expandedArchitectures.f1 ? "Hide Design" : "View Design"}
              </button>
              {showInter && (
                <button
                  onClick={handleTriggerEntropy}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                >
                  <Play className="h-3 w-3" />
                  Simulate High-Entropy Secret Leak
                </button>
              )}
            </div>
          </div>

          {/* Simple Visual Architecture Diagram (Feature 1) */}
          {showArch && expandedArchitectures.f1 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5" /> Architecture Design 1: Local DLP Gateway & Pre-Transmission Firewall
                </span>
                <span className="text-[10px] text-slate-400 font-mono">DPI • Shannon Entropy • Deterministic Gate</span>
              </div>

              {/* Visual Node Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Step 1: Source</span>
                  <p className="text-xs font-bold text-white mt-1">Endpoint Data</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">App Logs & Telemetry</span>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center relative">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase block">Step 2: Deep Inspection</span>
                  <p className="text-xs font-bold text-cyan-200 mt-1">DLP Guardian Engine</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">DPI + Regex + Shannon Entropy</span>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-center">
                  <span className="text-[9px] font-bold text-rose-400 uppercase block">Fork A: Secret Detected</span>
                  <p className="text-xs font-bold text-rose-300 mt-1">Packet Dropped & Blocked</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Security Alert ➔ SecOps</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase block">Fork B: Verified Clean</span>
                  <p className="text-xs font-bold text-emerald-300 mt-1">Sanitized Egress Allowed</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Encrypted mTLS ➔ SaaS</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Live Engine (Feature 1) */}
          {showInter && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Inspected</span>
                  <p className="text-lg font-extrabold text-white font-mono mt-1">{guardianStats?.totalInspected}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-900/40">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Approved Metadata</span>
                  <p className="text-lg font-extrabold text-emerald-400 font-mono mt-1">{guardianStats?.approvedCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-900/40">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Suspicious Held</span>
                  <p className="text-lg font-extrabold text-amber-400 font-mono mt-1">{guardianStats?.heldCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-900/40">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Critical Blocked</span>
                  <p className="text-lg font-extrabold text-rose-400 font-mono mt-1">{guardianStats?.blockedCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Decision Latency</span>
                  <p className="text-lg font-extrabold text-cyan-400 font-mono mt-1">{guardianStats?.avgLatencyMs} ms</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Inspection ID</th>
                      <th className="p-3">Payload ID</th>
                      <th className="p-3">Entropy Score</th>
                      <th className="p-3">Decision</th>
                      <th className="p-3">Enforced Action</th>
                      <th className="p-3">Policy Audit Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {recentInspections?.map(insp => (
                      <tr key={insp.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3 text-cyan-400 font-bold">{insp.id}</td>
                        <td className="p-3 text-slate-300">{insp.payloadId}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            insp.entropyScore > 4.5 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {insp.entropyScore} bits
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            insp.decision === "APPROVED"
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : insp.decision === "SUSPICIOUS_HELD"
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}>
                            {insp.decision}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400">{insp.action}</td>
                        <td className="p-3 text-xs text-slate-300 font-sans max-w-xs truncate">{insp.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 2: CANARY SECRET DETECTION (HONEYTOKENS)                           */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "canary") && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Feature 2: Canary Secret Detection — Honeytoken Security
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                    Live Demo Ready
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Deception-based decoy credentials planted in configuration files to detect accidental or unauthorized leaks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleArch('f2')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Workflow className="h-3.5 w-3.5 text-amber-400" />
                {expandedArchitectures.f2 ? "Hide Design" : "View Design"}
              </button>
              {showInter && (
                <button
                  onClick={() => handleTriggerCanary("CANARY-SECRET-92831")}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-rose-600/20"
                >
                  <Flame className="h-3.5 w-3.5" />
                  🚨 Inject Canary Secret (Test Trap)
                </button>
              )}
            </div>
          </div>

          {/* Simple Visual Architecture Diagram (Feature 2) */}
          {showArch && expandedArchitectures.f2 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5" /> Architecture Design 2: Honeytoken Intrusion Detection & Decoy Trap
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Zero Privileges • Tripwire Interception</span>
              </div>

              {/* Visual Node Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Step 1: Deception Seed</span>
                  <p className="text-xs font-bold text-amber-300 mt-1">Planted Honeytokens</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">/etc/app.env, DB Connection Pool</span>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40 text-center">
                  <span className="text-[9px] font-bold text-amber-400 uppercase block">Step 2: Access Event</span>
                  <p className="text-xs font-bold text-white mt-1">Attacker / Logging Exposure</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Canary value read by process</span>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-center">
                  <span className="text-[9px] font-bold text-rose-400 uppercase block">Step 3: Perimeter Tripwire</span>
                  <p className="text-xs font-bold text-rose-300 mt-1">Tripwire Triggered!</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Egress Blocked at Boundary</span>
                </div>

                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 text-center">
                  <span className="text-[9px] font-bold text-purple-400 uppercase block">Step 4: Containment</span>
                  <p className="text-xs font-bold text-purple-200 mt-1">Node Isolation & Alert</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Source Node Flagged for Revocation</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Live Engine (Feature 2) */}
          {showInter && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {honeytokens?.map(token => {
                const isTriggered = token.status === "TRIGGERED_BLOCKED";
                return (
                  <div
                    key={token.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isTriggered
                        ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/50'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-extrabold text-amber-400">{token.token}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isTriggered
                          ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {token.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-1">{token.environment}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                      <span>Planted: {token.plantedDate}</span>
                      <span className="font-mono text-slate-400">Triggered: {token.timesTriggered}x</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 3: ADAPTIVE PRIVACY (DYNAMIC DATA PROTECTION)                     */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "adaptive") && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Feature 3: Adaptive Privacy — Dynamic 4-Tier Data Protection
                </h3>
                <p className="text-xs text-slate-400">
                  Egress policies adapt in real time to live threat levels (Normal ➔ Elevated ➔ Lockdown).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleArch('f3')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Workflow className="h-3.5 w-3.5 text-purple-400" />
                {expandedArchitectures.f3 ? "Hide Design" : "View Design"}
              </button>

              {showInter && (
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 px-2 uppercase">Threat Level:</span>
                  {["NORMAL", "ELEVATED", "CRITICAL_LOCKDOWN"].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => handleSetThreatLevel(lvl)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                        threatLevel === lvl
                          ? lvl === "NORMAL"
                            ? 'bg-emerald-500 text-black shadow-md'
                            : lvl === "ELEVATED"
                            ? 'bg-amber-500 text-black shadow-md'
                            : 'bg-rose-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Simple Visual Architecture Diagram (Feature 3) */}
          {showArch && expandedArchitectures.f3 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5" /> Architecture Design 3: Multi-Regulatory Adaptive Gateway & RBAC Pipeline
                </span>
                <span className="text-[10px] text-slate-400 font-mono">GDPR • HIPAA • PCI DSS • Dynamic Tiers</span>
              </div>

              {/* Visual Node Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Compliance Sources</span>
                  <p className="text-xs font-bold text-purple-300 mt-1">GDPR / HIPAA / PCI</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Enterprise Privacy Regimes</span>
                </div>

                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 text-center">
                  <span className="text-[9px] font-bold text-purple-400 uppercase block">Pre-Sanitization Lock</span>
                  <p className="text-xs font-bold text-white mt-1">Data Gateway & Masking</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">e***@*, **** 1234 Scrubbed</span>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase block">Adaptive Threat Engine</span>
                  <p className="text-xs font-bold text-cyan-200 mt-1">4-Tier Classification</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Public ➔ Critical Hierarchy</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase block">Enforcement</span>
                  <p className="text-xs font-bold text-emerald-300 mt-1">RBAC & Dynamic DLP</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Incident Mode Shuts Off Ports/IPs</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Live Engine (Feature 3) */}
          {showInter && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Sensitivity Tier</th>
                    <th className="p-3">Field Types</th>
                    <th className="p-3">Normal Mode</th>
                    <th className="p-3">Elevated Mode</th>
                    <th className="p-3">Critical Lockdown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {policyMatrix?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${
                          row.tier === "Public" ? 'bg-cyan-400' :
                          row.tier === "Internal" ? 'bg-blue-400' :
                          row.tier === "Confidential" ? 'bg-amber-400' : 'bg-rose-400'
                        }`} />
                        {row.tier}
                      </td>
                      <td className="p-3 text-slate-300 font-sans">{row.fieldTypes}</td>
                      <td className={`p-3 ${threatLevel === "NORMAL" ? 'font-bold text-emerald-400 bg-emerald-950/20' : 'text-slate-400'}`}>{row.normal}</td>
                      <td className={`p-3 ${threatLevel === "ELEVATED" ? 'font-bold text-amber-400 bg-amber-950/20' : 'text-slate-400'}`}>{row.elevated}</td>
                      <td className={`p-3 ${threatLevel === "CRITICAL_LOCKDOWN" ? 'font-bold text-rose-400 bg-rose-950/30' : 'text-slate-400'}`}>{row.lockdown}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 4: TAMPER-EVIDENT EGRESS LEDGER                                    */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "ledger") && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Feature 4: Cryptographic Tamper-Evident Egress Ledger
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    ledger?.isTampered
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {ledger?.isTampered ? 'HASH CHAIN BROKEN' : 'CHAIN INTACT & VERIFIED'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Every transmitted payload is cryptographically linked in an immutable SHA-256 hash chain with HMAC signatures.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleArch('f4')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Workflow className="h-3.5 w-3.5 text-emerald-400" />
                {expandedArchitectures.f4 ? "Hide Design" : "View Design"}
              </button>
              {showInter && (
                <>
                  <button
                    onClick={handleTamperLedger}
                    className="px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 border border-rose-700 text-rose-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Maliciously Alter 1 Byte
                  </button>
                  <button
                    onClick={handleResetLedger}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Restore & Verify Chain
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Simple Visual Architecture Diagram (Feature 4) */}
          {showArch && expandedArchitectures.f4 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5" /> Architecture Design 4: SHA-256 Blockchain Ledger with HMAC Verification
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Sequential Chaining • Retroactive Tamper Alarm</span>
              </div>

              {/* Visual Node Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Block #1 (Genesis)</span>
                  <p className="text-xs font-bold text-emerald-400 mt-1">PAY-001</p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Hash: 8a4f... ➔ Sig: hmac-9b</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center relative">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase block">Block #2 (Chained)</span>
                  <p className="text-xs font-bold text-emerald-300 mt-1">PAY-002</p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">PrevHash = Block #1</span>
                </div>

                <div className={`p-3 rounded-lg text-center ${
                  ledger?.isTampered ? 'bg-rose-950/60 border border-rose-500 animate-pulse' : 'bg-slate-900 border border-slate-800'
                }`}>
                  <span className={`text-[9px] font-bold uppercase block ${ledger?.isTampered ? 'text-rose-300' : 'text-slate-500'}`}>
                    Block #3 {ledger?.isTampered ? '(TAMPERED!)' : '(Chained)'}
                  </span>
                  <p className={`text-xs font-bold mt-1 ${ledger?.isTampered ? 'text-rose-400' : 'text-white'}`}>
                    {ledger?.isTampered ? 'Hash Mismatch Detected' : 'PAY-003'}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    {ledger?.isTampered ? 'Signature Invalidated' : 'Verified OK'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase block">SaaS Continuous Audit</span>
                  <p className="text-xs font-bold text-cyan-200 mt-1">Receipt Verifier</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Cryptographic Egress Proof</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Live Engine (Feature 4) */}
          {showInter && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Seq</th>
                    <th className="p-3">Payload ID</th>
                    <th className="p-3">SHA-256 Payload Hash</th>
                    <th className="p-3">Previous Hash</th>
                    <th className="p-3">HMAC Signature</th>
                    <th className="p-3">Chain Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {ledger?.entries?.map(entry => {
                    const isTampered = entry.verificationStatus !== "VERIFIED";
                    return (
                      <tr key={entry.sequence} className={isTampered ? 'bg-rose-950/30' : 'hover:bg-slate-900/40'}>
                        <td className="p-3 font-bold text-slate-400">#{entry.sequence}</td>
                        <td className="p-3 text-cyan-400">{entry.payloadId}</td>
                        <td className="p-3 text-slate-300 truncate max-w-[140px]" title={entry.payloadHash}>{entry.payloadHash}</td>
                        <td className="p-3 text-slate-500 truncate max-w-[140px]" title={entry.previousHash}>{entry.previousHash}</td>
                        <td className="p-3 text-emerald-400">{entry.hmacSignature}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isTampered
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}>
                            {entry.verificationStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 5: COLLECTOR BEHAVIOUR FINGERPRINTING                             */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "fingerprint") && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Feature 5: Behaviour-Based Collector Protection (Zero-Trust Fingerprinting)
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous device profiling monitoring transmission cadence, payload volume, and certificate validity.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleArch('f5')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Workflow className="h-3.5 w-3.5 text-blue-400" />
                {expandedArchitectures.f5 ? "Hide Design" : "View Design"}
              </button>
              {showInter && (
                <button
                  onClick={handleSimulateRogue}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                >
                  <Play className="h-3 w-3" />
                  Simulate Rogue Collector Traffic
                </button>
              )}
            </div>
          </div>

          {/* Simple Visual Architecture Diagram (Feature 5) */}
          {showArch && expandedArchitectures.f5 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5" /> Architecture Design 5: Zero-Trust Device Fingerprinting & Behavioral Baseline
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Cadence • Volume • mTLS CRL</span>
              </div>

              {/* Visual Node Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Collector Fleet</span>
                  <p className="text-xs font-bold text-white mt-1">100 Edge Nodes</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Micro-Agents Enrolled</span>
                </div>

                <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/40 text-center">
                  <span className="text-[9px] font-bold text-blue-400 uppercase block">Behavioral Profiler</span>
                  <p className="text-xs font-bold text-blue-200 mt-1">Baseline Metrics</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">5s Freq • ~1.5KB Size • mTLS</span>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-center">
                  <span className="text-[9px] font-bold text-amber-400 uppercase block">Risk Scoring Engine</span>
                  <p className="text-xs font-bold text-amber-200 mt-1">Deviation Detector</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Risk Score: 0 (Safe) ➔ 100 (Rogue)</span>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-center">
                  <span className="text-[9px] font-bold text-rose-400 uppercase block">Zero-Trust Response</span>
                  <p className="text-xs font-bold text-rose-300 mt-1">Automated Quarantine</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Cert Revoked & Dropped</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Live Engine (Feature 5) */}
          {showInter && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {collectorFingerprints?.map(col => {
                const isQuarantined = col.status === "QUARANTINED";
                return (
                  <div
                    key={col.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isQuarantined
                        ? 'bg-rose-950/30 border-rose-600'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-xs">{col.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isQuarantined
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {col.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mb-3">{col.hostname}</p>

                    <div className="space-y-1.5 text-[11px] text-slate-300 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expected Interval:</span>
                        <span>{col.expectedFreqSec}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Avg Egress Size:</span>
                        <span>{col.avgPayloadBytes} bytes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Certificate:</span>
                        <span className="truncate max-w-[120px]" title={col.certThumbprint}>{col.certThumbprint}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                        <span className="text-slate-500 font-sans font-bold">Risk Score:</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${
                          col.riskScore > 50 ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {col.riskScore} / 100
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 6: AI ATTACK RELATIONSHIP GRAPH                                   */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "graph") && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Feature 6: AI Attack Relationship Graph (Incident Storyboard)
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    Confidence 98.4%
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cisco XDR-style incident graph linking brute force, compute spikes, network anomalies, and canary traps into a single root attack.
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleArch('f6')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Workflow className="h-3.5 w-3.5 text-purple-400" />
              {expandedArchitectures.f6 ? "Hide Design" : "View Design"}
            </button>
          </div>

          {/* Simple Visual Architecture Diagram (Feature 6) */}
          {showArch && expandedArchitectures.f6 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5" /> Architecture Design 6: Cisco XDR-Style Multi-Signal Attack Storyboard
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Cross-Signal Graph • Causal Inference</span>
              </div>

              {/* Visual Node Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Signals 1 & 2</span>
                  <p className="text-xs font-bold text-white mt-1">Failed Auth + CPU Spike</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">10x Logins ➔ 94.2% Compute</span>
                </div>

                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 text-center">
                  <span className="text-[9px] font-bold text-purple-400 uppercase block">Signals 3 & 4</span>
                  <p className="text-xs font-bold text-purple-300 mt-1">Net Burst + Canary Leak</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">3.8MB/s Outbound ➔ Trap Fired</span>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase block">Causal Correlator</span>
                  <p className="text-xs font-bold text-cyan-200 mt-1">AI Graph Reasoning</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Fuses 4 Alerts ➔ 1 Incident</span>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-center">
                  <span className="text-[9px] font-bold text-rose-400 uppercase block">Actionable Outcome</span>
                  <p className="text-xs font-bold text-rose-300 mt-1">Breach Intercepted</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Root Incident + Targeted Fix</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Live Engine (Feature 6) */}
          {showInter && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase text-rose-400">Correlated Root Incident</span>
                  <p className="text-sm font-bold text-white">{attackGraph?.classification}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{attackGraph?.summary}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 font-bold block">Threat Index</span>
                  <span className="text-xl font-extrabold text-rose-400 font-mono">{attackGraph?.threatScore} / 100</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                {attackGraph?.nodes?.map(node => (
                  <div key={node.id} className="relative flex flex-col h-full">
                    <div className={`p-3 rounded-xl border flex-1 ${
                      node.id === "root"
                        ? 'bg-rose-950/60 border-rose-500 shadow-md'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-cyan-400">{node.timestamp}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          node.severity === "CRITICAL" ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                        }`}>
                          {node.severity}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white leading-tight">{node.label}</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">{node.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Causal Inference Chain:
                </span>
                {attackGraph?.edges?.map((edge, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <ArrowRight className="h-3 w-3 text-cyan-400" />
                    <span className="text-slate-300 font-bold">{edge.from} ➔ {edge.to}:</span>
                    <span className="text-cyan-400 text-[11px]">{edge.relationship}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 7: PRIVACY POLICY SIMULATOR & CONFIG DRIFT (NEW ARCHITECTURE)     */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "sandbox") && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Feature 7: Privacy Policy Sandbox & Configuration Drift Detector
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    New Architecture
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-flight policy sandbox with historical telemetry replay and cryptographic GitOps drift validation.
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleArch('f7')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Workflow className="h-3.5 w-3.5 text-cyan-400" />
              {expandedArchitectures.f7 ? "Hide Design" : "View Design"}
            </button>
          </div>

          {/* Simple Visual Architecture Diagram (Feature 7 - NEW DESIGN) */}
          {showArch && expandedArchitectures.f7 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5" /> Architecture Design 7: Pre-Flight Policy Sandbox & GitOps Drift Watchdog
                </span>
                <span className="text-[10px] text-slate-400 font-mono">100-Frame Replay • SHA-256 Manifest Parity</span>
              </div>

              {/* Visual Node Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Step 1: Policy Draft</span>
                  <p className="text-xs font-bold text-cyan-300 mt-1">SecOps Authoring</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Internal IP Masking + Entropy Sliders</span>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase block">Step 2: Simulation Sandbox</span>
                  <p className="text-xs font-bold text-white mt-1">Telemetry Replay Engine</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Dry-Run across 100 Historic Frames</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase block">Step 3: Predictive Proof</span>
                  <p className="text-xs font-bold text-emerald-300 mt-1">Leak Impact Analytics</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Zero Leak Risk • 34.2% Bandwidth Saved</span>
                </div>

                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 text-center">
                  <span className="text-[9px] font-bold text-purple-400 uppercase block">Step 4: Drift Integrity</span>
                  <p className="text-xs font-bold text-purple-200 mt-1">Signed GitOps Parity</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Runtime Hash == GitOps Baseline</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Live Engine (Feature 7) */}
          {showInter && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Policy Sandbox Controls</h4>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simRules.strip_internal_ips}
                      onChange={(e) => setSimRules(prev => ({ ...prev, strip_internal_ips: e.target.checked }))}
                      className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Strictly Mask Internal IPv4 / IPv6</span>
                      <span className="text-[10px] text-slate-500">Replaces all RFC-1918 IPs with pseudonymous tokens</span>
                    </div>
                  </label>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Max Shannon Entropy Threshold:</span>
                      <span className="font-mono text-cyan-400 font-bold">{simRules.max_entropy_threshold} bits</span>
                    </div>
                    <input
                      type="range"
                      min="3.0"
                      max="5.5"
                      step="0.1"
                      value={simRules.max_entropy_threshold}
                      onChange={(e) => setSimRules(prev => ({ ...prev, max_entropy_threshold: parseFloat(e.target.value) }))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={handleRunPolicySim}
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-cyan-600/20"
                  >
                    Run Sandbox Simulation (100 Sample Frames)
                  </button>
                </div>

                {simResults && (
                  <div className="p-3 bg-slate-900 rounded-lg border border-cyan-800/40 space-y-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">Simulation Impact Assessment:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="text-slate-400">Records Allowed: <span className="text-emerald-400 font-bold">{simResults.recordsAllowed}%</span></div>
                      <div className="text-slate-400">Records Blocked: <span className="text-rose-400 font-bold">{simResults.recordsBlocked}%</span></div>
                      <div className="text-slate-400">Leak Risk: <span className="text-cyan-400 font-bold">{simResults.dataLeakageRiskPct}%</span></div>
                      <div className="text-slate-400">Bandwidth Saved: <span className="text-amber-400 font-bold">{simResults.egressBandwidthSavedPct}%</span></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-cyan-400" />
                  Configuration Drift & Tamper Integrity
                </h4>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Approved GitOps Baseline Hash:</span>
                    <span className="text-[11px] font-mono text-slate-300 break-all">{policySandbox?.baselineHash}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Active Runtime Policy Hash:</span>
                    <span className="text-[11px] font-mono text-emerald-400 break-all">{policySandbox?.activeHash}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Zero Drift Detected: Runtime policy matches cryptographically signed GitOps manifest.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 8: AI RECOMMENDATIONS & REVERSIBLE REMEDIATION (NEW ARCHITECTURE) */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "remediation") && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Feature 8: AI Security Recommendations with Safe Reversible Remediation
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    New Architecture
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Detect ➔ Recommend ➔ Human Approval ➔ 60s Reversible Execution Watchdog.
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleArch('f8')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Workflow className="h-3.5 w-3.5 text-emerald-400" />
              {expandedArchitectures.f8 ? "Hide Design" : "View Design"}
            </button>
          </div>

          {/* Simple Visual Architecture Diagram (Feature 8 - NEW DESIGN) */}
          {showArch && expandedArchitectures.f8 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5" /> Architecture Design 8: 3-Stage Human-in-the-Loop Reversible Remediation Pipeline
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Stage 4 Autonomous Ops • 60s Watchdog</span>
              </div>

              {/* Visual Node Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Stage 1: AI Diagnostics</span>
                  <p className="text-xs font-bold text-emerald-300 mt-1">Breach Interception</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Identifies Root Problem</span>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase block">Stage 2: Prescriptive Plan</span>
                  <p className="text-xs font-bold text-white mt-1">Recommendation Engine</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Rotate Token • Quarantine Node</span>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-center">
                  <span className="text-[9px] font-bold text-amber-400 uppercase block">Stage 3: Approval Gate</span>
                  <p className="text-xs font-bold text-amber-200 mt-1">Human-in-the-Loop</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">SecOps 1-Click Explicit Sign-off</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase block">Stage 4: Safe Execution</span>
                  <p className="text-xs font-bold text-emerald-300 mt-1">60s Watchdog Timer</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Health Probes Active • Auto-Rollback</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Live Engine (Feature 8) */}
          {showInter && (
            <div className="space-y-3">
              {remediationActions?.map(action => (
                <div
                  key={action.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{action.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        action.severity === "CRITICAL" ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {action.severity}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">[{action.target}]</span>
                    </div>
                    <p className="text-xs text-slate-300">{action.reason}</p>
                    <p className="text-[11px] text-cyan-400 font-mono">Rollback Plan: {action.rollbackPlan}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!action.executed ? (
                      <button
                        onClick={() => handleExecuteRemediation(action.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                      >
                        Approve & Execute (60s Rollback)
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Remediation Active
                        </span>
                        <button
                          onClick={() => handleRollbackRemediation(action.id)}
                          className="px-3 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800/60 border border-amber-700 text-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Rollback Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
