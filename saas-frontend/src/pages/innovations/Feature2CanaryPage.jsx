import React, { useState, useEffect } from 'react';
import InnovationNavHeader from '../../components/InnovationNavHeader';
import {
  Flame,
  ShieldAlert,
  AlertOctagon,
  CheckCircle,
  XCircle,
  RefreshCw,
  Maximize2,
  Workflow,
  Radio,
  Lock,
  Zap
} from 'lucide-react';
import {
  fetchPrivacyShieldOverview,
  triggerCanaryLeak
} from '../../services/api';

export default function Feature2CanaryPage({ setActivePage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [imageZoom, setImageZoom] = useState(false);

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
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInjectCanary = async (token = "CANARY-SECRET-92831") => {
    setActionLoading(true);
    try {
      const res = await triggerCanaryLeak(token);
      setToast({
        type: 'danger',
        title: '🚨 Honeytoken Perimeter Tripwire Triggered!',
        msg: `Detected token: ${token}. Outgoing payload blocked immediately before leaving local boundary. Source collector isolated.`
      });
      loadData();
    } catch (err) {
      setToast({ type: 'error', title: 'Error', msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const honeytokens = data?.honeytokens || [
    { id: "CANARY-01", token: "CANARY-SECRET-92831", location: "Local Environment App Secret Vault", status: "ACTIVE", lastTriggered: null },
    { id: "CANARY-02", token: "HONEYTOKEN-FINTECH-9912", location: "Simulated Database Connection String", status: "ACTIVE", lastTriggered: null }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Global Innovation Stepper Header */}
      <InnovationNavHeader activePage="feat_canary" setActivePage={setActivePage} />

      {/* Toast Alert */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
          toast.type === 'error' ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' :
          toast.type === 'danger' ? 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-xl shadow-rose-950/50' :
          'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] tracking-wider uppercase">
                FEATURE 2 &bull; DECEPTION SECURITY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold text-[10px] border border-amber-900">
                LIVE DEMO READY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                ZERO-TRUST TRIPWIRE
              </span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <Flame className="h-7 w-7 text-amber-400" />
              Canary Secret Detection (Honeytoken Intrusion Decoys)
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Deception-based cybersecurity technique: Fake credentials and honeytokens planted in memory and configuration files act as silent perimeter tripwires. If an attacker or compromised process attempts to exfiltrate them, egress is blocked with zero false positives.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleInjectCanary("CANARY-SECRET-92831")}
              disabled={actionLoading}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <AlertOctagon className="h-4 w-4" />
              <span>🚨 Inject Canary Secret (Test Trap)</span>
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
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              ARCHITECTURE DESIGN BLUEPRINT &bull; FEATURE 2
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Workflow className="h-4 w-4 text-amber-400" />
              Honeytoken Intrusion Detection &amp; Decoy Trap Architecture
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
            <div className="relative rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900 shadow-2xl group">
              <img
                src="/architectures/feature2-canary.jpg"
                alt="Feature 2 Architecture: Honeytoken Intrusion Detection"
                className="w-full object-contain max-h-[460px] bg-slate-950 transition-transform duration-300 group-hover:scale-[1.02] p-2"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="font-semibold text-amber-300">
                  Architecture 2: Honeytokens &bull; Detects fake secrets and prevents data leaks
                </span>
                <span className="font-mono text-[10px] text-slate-400">Specification: Architecture Design</span>
              </div>
            </div>
          </div>

          {!imageZoom && (
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                  CANARY DEFENSE WORKFLOW
                </span>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <div>
                      <strong className="text-white block">Plant Synthetic Decoy Secret</strong>
                      <span className="text-slate-400 text-[11px]">Honeytoken generated (e.g. <code>CANARY-SECRET-92831</code>) and placed in mock config. No legitimate process uses it.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <div>
                      <strong className="text-white block">Adversary Access / Exfiltration</strong>
                      <span className="text-slate-400 text-[11px]">Attacker reads local env or app accidentally dumps stack trace containing the fake secret into telemetry outbox.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <div>
                      <strong className="text-rose-300 block">Perimeter Tripwire Triggered</strong>
                      <span className="text-slate-400 text-[11px]">Egress pipeline recognizes canary token. Immediate drop before transmission leaves boundary.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                    <div>
                      <strong className="text-purple-300 block">Out-of-Band Containment &amp; Isolation</strong>
                      <span className="text-slate-400 text-[11px]">Source collector identified. Security incident dispatched out-of-band to SecOps.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Demonstration Callout */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-2">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                  HACKATHON JUDGING DEMO TIP
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Injecting a canary secret into the live feed produces a <strong>100% deterministic security alert</strong> with zero false positives. Judges love this because traditional tools only look for known regexes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. In-Depth Technical Information (The Problem, The Idea, Why Useful) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5" /> What is the idea?
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Create fake credentials, fake API keys, or fake confidential identifiers and place them in a controlled test environment.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>These are called <strong>honeytokens</strong> or canary secrets.</li>
            <li>They are not real credentials and cannot access actual systems.</li>
            <li>Any appearance of a honeytoken indicates an active breach or severe misconfiguration.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
            <AlertOctagon className="h-3.5 w-3.5" /> Concrete Example Scenario
          </span>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300">
            API_KEY = CANARY-SECRET-92831
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            An attacker or an accidental logging process attempts to expose it. Your system detects this canary value and immediately:
          </p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>Blocks the outgoing payload before transmission.</li>
            <li>Generates a critical security alert.</li>
            <li>Identifies and isolates the affected collector.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> Why is this useful for Judges?
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Traditional security systems search for known secret patterns. Your system can additionally detect the appearance or use of a specially planted secret, even if the exact exposure path is unknown.
          </p>
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
            <strong>Live Judging Proof:</strong>
            <p>Click the button above during judging to inject <code>CANARY-SECRET-92831</code> and show instant zero-trust containment.</p>
          </div>
        </div>
      </div>

      {/* 5. Live Interactive Honeytoken Inventory & Tripwire Status */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              DECEPTION TRAP CONTROLS &bull; LIVE HONEYTOKEN INVENTORY
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Lock className="h-4 w-4 text-amber-400" />
              Active Honeytoken Decoys &amp; Containment State
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {honeytokens.length} Decoys Active
          </span>
        </div>

        {/* Honeytoken Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {honeytokens.map((ht) => {
            const isTriggered = ht.status === "TRIGGERED_BLOCKED";
            return (
              <div
                key={ht.id}
                className={`p-4 rounded-xl border transition-all ${
                  isTriggered
                    ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{ht.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] tracking-wider ${
                    isTriggered ? 'bg-rose-500 text-black animate-pulse' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {ht.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 font-mono text-xs font-bold text-amber-300 break-all mb-2">
                  {ht.token}
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Location: <strong className="text-slate-300">{ht.location}</strong></span>
                </div>

                {isTriggered && (
                  <div className="mt-3 p-2 rounded bg-rose-950/60 border border-rose-800/60 text-[11px] text-rose-200">
                    <strong>TRIPWIRE ALERT:</strong> Egress blocked locally at {ht.lastTriggered ? new Date(ht.lastTriggered).toLocaleTimeString() : 'Just now'}. Outgoing payload halted before leaving customer boundary.
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleInjectCanary(ht.token)}
                    disabled={actionLoading}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    <span>Test Leak Trigger</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
