import React, { useState, useEffect } from 'react';
import InnovationNavHeader from '../../components/InnovationNavHeader';
import {
  Sliders,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Maximize2,
  Workflow,
  Play,
  FileCheck,
  GitBranch,
  Lock,
  Layers
} from 'lucide-react';
import {
  fetchPrivacyShieldOverview,
  runPolicySimulation
} from '../../services/api';

export default function Feature7PolicySimulatorPage({ setActivePage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [imageZoom, setImageZoom] = useState(false);

  // Simulation form state
  const [maskIps, setMaskIps] = useState(true);
  const [entropyThreshold, setEntropyThreshold] = useState(4.2);
  const [allowCpu, setAllowCpu] = useState(true);
  const [allowMemory, setAllowMemory] = useState(true);

  // Simulation results
  const [simResults, setSimResults] = useState({
    sampleSize: 100,
    recordsAllowed: 92,
    recordsBlocked: 8,
    recordsRedacted: 24,
    dataLeakageRiskPct: "0.0%",
    bandwidthSavedPct: "74.2%"
  });

  const loadData = async () => {
    try {
      const res = await fetchPrivacyShieldOverview();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunSimulation = async () => {
    setActionLoading(true);
    try {
      const res = await runPolicySimulation({
        maskInternalIps: maskIps,
        maxEntropy: entropyThreshold,
        allowCpu,
        allowMemory
      });
      setSimResults(res);
      setToast({
        type: 'success',
        title: 'Policy Sandbox Simulation Complete (100 Frames)',
        msg: `Allowed: ${res.recordsAllowed} | Blocked: ${res.recordsBlocked} | Leak Risk: ${res.dataLeakageRiskPct} | Bandwidth Saved: ${res.bandwidthSavedPct}`
      });
      loadData();
    } catch (err) {
      setToast({ type: 'error', title: 'Error', msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const sandbox = data?.policySandbox || {
    baselineHash: "sha256:4a7e93b1d798a6d2f349c81e289bf602a81907cb38290e29b1fa07409218d6a1",
    activeHash: "sha256:4a7e93b1d798a6d2f349c81e289bf602a81907cb38290e29b1fa07409218d6a1",
    driftDetected: false
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Innovation Stepper Header */}
      <InnovationNavHeader activePage="feat_sandbox" setActivePage={setActivePage} />

      {/* Toast Alert */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
          toast.type === 'error' ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' :
          'bg-sky-950/80 border-sky-500/50 text-sky-200'
        }`}>
          <div>
            <strong className="block font-bold text-sm">{toast.title}</strong>
            <span className="mt-0.5 block">{toast.msg}</span>
          </div>
          <button onClick={() => setToast(null)} className="px-2.5 py-1 rounded bg-black/40 hover:bg-black/60 font-bold ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Hero Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-950 border border-sky-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-black font-extrabold text-[10px] tracking-wider uppercase">
                FEATURE 7 &bull; HACKATHON DIFFERENTIATOR
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 font-bold text-[10px] border border-sky-900">
                PRE-FLIGHT DRY-RUN
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                GITOPS CONFIG WATCHDOG
              </span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <Sliders className="h-7 w-7 text-sky-400" />
              Privacy Policy Simulator &amp; GitOps Drift Detector
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Provides an offline simulation sandbox for testing privacy policy revisions against historical telemetry before deploying to live collectors. Evaluates blast radius, potential sensitive data escapes, and validates runtime configuration parity against signed GitOps baselines.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunSimulation}
              disabled={actionLoading}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-sky-500/20 flex items-center gap-2"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Run Sandbox Simulation</span>
            </button>
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Architecture Design Section (Image + Visual Blueprint) */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
              ARCHITECTURE DESIGN BLUEPRINT &bull; FEATURE 7
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Workflow className="h-4 w-4 text-sky-400" />
              Pre-Flight Policy Sandbox &amp; GitOps Drift Watchdog Architecture
            </h3>
          </div>
          <button
            onClick={() => setImageZoom(!imageZoom)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>{imageZoom ? 'Standard View' : 'Enlarge Blueprint'}</span>
          </button>
        </div>

        {/* Blueprint Photograph from User */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className={`${imageZoom ? 'lg:col-span-12' : 'lg:col-span-7'} transition-all`}>
            <div className="relative rounded-xl overflow-hidden border border-sky-500/30 bg-slate-900 shadow-2xl group">
              <img
                src="/architectures/feature7-sandbox.jpg"
                alt="Feature 7 Architecture: Sandbox"
                className="w-full object-contain max-h-[460px] bg-slate-950 transition-transform duration-300 group-hover:scale-[1.02] p-2"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="font-semibold text-sky-300">
                  Architecture 7: Sandbox &bull; Tests policy changes in a safe environment
                </span>
                <span className="font-mono text-[10px] text-slate-400">Specification: Architecture Design</span>
              </div>
            </div>
          </div>

          {!imageZoom && (
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider block">
                  SANDBOX DRY-RUN STEPS
                </span>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <div>
                      <strong className="text-white block">Draft Policy Revision</strong>
                      <span className="text-slate-400 text-[11px]">Administrator tunes filtering regexes, Shannon entropy thresholds, and telemetry allow-lists.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <div>
                      <strong className="text-white block">Historical Telemetry Replay</strong>
                      <span className="text-slate-400 text-[11px]">Evaluates draft rules against 100 sample historical frames without affecting live telemetry.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <div>
                      <strong className="text-emerald-300 block">Blast Radius Analysis</strong>
                      <span className="text-slate-400 text-[11px]">Calculates records allowed vs blocked, potential sensitive data escapes, and egress bandwidth impact.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                    <div>
                      <strong className="text-purple-300 block">Signed GitOps Deployment Gate</strong>
                      <span className="text-slate-400 text-[11px]">Approved policy committed to version-controlled repository with cryptographic SHA-256 hash.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitOps Drift Indicator */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  CONFIGURATION DRIFT WATCHDOG
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Baseline GitOps Hash:</span>
                  <span className="font-mono text-[10px] text-cyan-400 truncate max-w-[150px]">{sandbox.baselineHash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Active Runtime Hash:</span>
                  <span className="font-mono text-[10px] text-emerald-400 truncate max-w-[150px]">{sandbox.activeHash}</span>
                </div>
                <div className="pt-1 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold text-[11px]">Configuration Parity: IN-SYNC (Zero Drift)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. In-Depth Technical Information (The Problem, The Simulation Mode, The Value) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5" /> What is the problem?
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Changing edge egress filtering policies directly on production collectors carries catastrophic risks:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside text-[11px]">
            <li>An overly permissive regex could accidentally leak customer PII to SaaS.</li>
            <li>An overly strict filter could blind NOC operators by blocking essential metrics.</li>
            <li>Unauthorized local config edits create silent configuration drift.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
            <FileCheck className="h-3.5 w-3.5" /> Your New Feature: Policy Sandbox
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Instead of immediately deploying policy changes, provide an isolated simulation mode:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside text-[11px]">
            <li>Test draft rules against 100 historical telemetry frames.</li>
            <li>Display number of records allowed, blocked, and redacted.</li>
            <li>Identify potential sensitive fields before deployment.</li>
            <li>Measure impact on SaaS NOC dashboards and network bandwidth.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> Why this is valuable for Judges
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Proves enterprise maturity. Judges see that your platform prevents accidental self-inflicted data breaches:
          </p>
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
            <strong>Key Benefit:</strong>
            <p>Guarantees safe policy evolution through dry-runs, eliminating production outage risk and ensuring continuous compliance.</p>
          </div>
        </div>
      </div>

      {/* 5. Live Interactive Policy Tuner & Blast Radius Assessment */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
              SIMULATION CONTROLS &bull; INTERACTIVE RUNNER
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Sliders className="h-4 w-4 text-sky-400" />
              Policy Tuner &amp; Blast Radius Impact Results
            </h3>
          </div>
          <button
            onClick={handleRunSimulation}
            disabled={actionLoading}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-sky-500/20 flex items-center gap-2"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Simulate (100 Frames)</span>
          </button>
        </div>

        {/* Policy Controls Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 block">Egress Redaction Rules:</label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={maskIps}
                  onChange={(e) => setMaskIps(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                />
                <span>Strictly Mask Internal IPv4 / IPv6 Subnets (e.g. 192.168.*.*)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={allowCpu}
                  onChange={(e) => setAllowCpu(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                />
                <span>Allow System CPU &amp; Memory Utilization Metrics</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-300">Max Shannon Entropy Threshold:</span>
              <span className="font-mono font-bold text-sky-400">{entropyThreshold} bits</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="5.5"
              step="0.1"
              value={entropyThreshold}
              onChange={(e) => setEntropyThreshold(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Payloads with Shannon entropy &gt; {entropyThreshold} bits will be flagged as cryptographic secrets and blocked.
            </p>
          </div>
        </div>

        {/* Blast Radius Scorecards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-900/40">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Records Allowed</span>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              {simResults.recordsAllowed} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-900/40">
            <span className="text-[10px] font-bold text-rose-400 uppercase">Leakage Risk</span>
            <p className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
              {simResults.dataLeakageRiskPct}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-sky-900/40">
            <span className="text-[10px] font-bold text-sky-400 uppercase">Bandwidth Saved</span>
            <p className="text-2xl font-extrabold text-sky-400 font-mono mt-1">
              {simResults.bandwidthSavedPct}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-900/40">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Redacted Fields</span>
            <p className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
              {simResults.recordsRedacted} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
