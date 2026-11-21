import React, { useState, useEffect } from 'react';
import InnovationNavHeader from '../../components/InnovationNavHeader';
import {
  Cpu,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Maximize2,
  Workflow,
  Server,
  Activity,
  Lock,
  Zap,
  Radio
} from 'lucide-react';
import {
  fetchPrivacyShieldOverview,
  simulateRogueCollector
} from '../../services/api';

export default function Feature5FingerprintPage({ setActivePage }) {
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

  const handleSimulateRogue = async () => {
    setActionLoading(true);
    try {
      const res = await simulateRogueCollector();
      setToast({
        type: 'danger',
        title: 'Rogue Collector Detected & Auto-Quarantined!',
        msg: res.message || 'Shadow collector triggered risk score spike (94/100). mTLS certificate revoked.'
      });
      loadData();
    } catch (err) {
      setToast({ type: 'error', title: 'Error', msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const collectors = data?.collectorFingerprints || [
    { id: "PROD-APP-SERVER-01", status: "ENROLLED", expectedCadence: "5s", avgPayloadKb: 1.4, riskScore: 4, anomaliesLast24h: 0 },
    { id: "EDGE-GATEWAY-EU-02", status: "ENROLLED", expectedCadence: "5s", avgPayloadKb: 1.2, riskScore: 8, anomaliesLast24h: 1 },
    { id: "SHADOW-COLLECTOR-09", status: "QUARANTINED", expectedCadence: "0.5s (BURST)", avgPayloadKb: 42.8, riskScore: 94, anomaliesLast24h: 18 }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Global Innovation Stepper Header */}
      <InnovationNavHeader activePage="feat_fingerprint" setActivePage={setActivePage} />

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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 border border-blue-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500 text-black font-extrabold text-[10px] tracking-wider uppercase">
                FEATURE 5 &bull; ZERO-TRUST PROTECTION
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-300 font-bold text-[10px] border border-blue-900">
                BEHAVIORAL BASELINE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                mTLS AUTO-QUARANTINE
              </span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <Cpu className="h-7 w-7 text-blue-400" />
              Behaviour-Based Collector Protection (Zero-Trust Fingerprinting)
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Continuous behavioural fingerprinting of edge collectors. Rather than blindly trusting certificates, the engine monitors transmission intervals, egress frame sizes, and host system health. Rogue or compromised collectors are automatically quarantined via mTLS CRL revocation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSimulateRogue}
              disabled={actionLoading}
              className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              <span>Simulate Rogue Collector Traffic</span>
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
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
              ARCHITECTURE DESIGN BLUEPRINT &bull; FEATURE 5
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Workflow className="h-4 w-4 text-blue-400" />
              Zero-Trust Device Fingerprinting &amp; Behavioral Baseline Architecture
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
            <div className="relative rounded-xl overflow-hidden border border-blue-500/30 bg-slate-900 shadow-2xl group">
              <img
                src="/architectures/feature5-fingerprint.jpg"
                alt="Feature 5 Architecture: Micro-Agent Device Fingerprinting"
                className="w-full object-contain max-h-[460px] bg-slate-950 transition-transform duration-300 group-hover:scale-[1.02] p-2"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="font-semibold text-blue-300">
                  Architecture 5: Collector Fingerprint &bull; Monitors collector behaviour and detects anomalies
                </span>
                <span className="font-mono text-[10px] text-slate-400">Specification: Architecture Design</span>
              </div>
            </div>
          </div>

          {!imageZoom && (
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider block">
                  DEVICE FINGERPRINTING ENGINE
                </span>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <div>
                      <strong className="text-white block">Host Telemetry &amp; System Runtime</strong>
                      <span className="text-slate-400 text-[11px]">Monitors collector CPU (utilization curve), RAM, power, and process health via <code>psutil</code>.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <div>
                      <strong className="text-white block">Cadence &amp; Payload Profiler</strong>
                      <span className="text-slate-400 text-[11px]">Normal profile: 5.0s interval, ~1.5KB payload. Sudden bursts trigger immediate anomaly flags.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <div>
                      <strong className="text-rose-300 block">Dynamic Risk Scoring Engine</strong>
                      <span className="text-slate-400 text-[11px]">Scored 0–100. Any score exceeding threshold (&gt;80) flags the collector as compromised or rogue.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                    <div>
                      <strong className="text-purple-300 block">Automated mTLS Quarantine</strong>
                      <span className="text-slate-400 text-[11px]">Node revoked from Gateway trust list. Ingestion immediately refused.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs space-y-2">
                <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider block">
                  ZERO-TRUST ADVANTAGE
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Stolen credentials cannot bypass behavioural profiling. Even with valid keys, an adversary's anomalous egress frequency triggers automated quarantine.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. In-Depth Technical Information (The Problem, The Solution, Value for Judges) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> What is the problem?
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Conventional two-tier platforms authenticate collectors once at handshake using TLS client certificates.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            If a collector host is compromised, or an attacker duplicates certificates to spawn a rogue shadow collector, the SaaS ingestion endpoint accepts the malicious payloads without suspicion.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5" /> Your New Feature: Continuous Fingerprinting
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Build continuous behavioural profiling that measures:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside text-[11px]">
            <li>Transmission cadence (5.0s baseline).</li>
            <li>Payload payload distribution (1.2–1.8KB).</li>
            <li>Operating time windows &amp; process memory.</li>
            <li>Z-score deviation on burst frequency.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> Why this is valuable for Judges
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Provides true <strong>Zero-Trust architecture</strong> beyond initial authentication:
          </p>
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
            <strong>Demonstration Scenario:</strong>
            <p>Click "Simulate Rogue Collector Traffic" to show <code>SHADOW-COLLECTOR-09</code> bursting 42KB payloads, immediately spiking risk to 94 and getting quarantined.</p>
          </div>
        </div>
      </div>

      {/* 5. Live Interactive Collector Fleet Fingerprint Cards */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
              FLEET BEHAVIOR MONITOR &bull; LIVE FINGERPRINT CARDS
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Server className="h-4 w-4 text-blue-400" />
              Active Collector Fleet Fingerprint Profiles
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {collectors.length} Edge Nodes Monitored
          </span>
        </div>

        {/* Collector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collectors.map((col) => {
            const isQuarantined = col.status === 'QUARANTINED';
            return (
              <div
                key={col.id}
                className={`p-4 rounded-xl border transition-all ${
                  isQuarantined
                    ? 'bg-rose-950/25 border-rose-500/60 shadow-lg shadow-rose-950/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-white">{col.id}</span>
                  <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] tracking-wider ${
                    isQuarantined
                      ? 'bg-rose-500 text-black animate-pulse'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {col.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Expected Cadence:</span>
                    <strong className="text-slate-200 font-mono">{col.expectedCadence}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Avg Egress Size:</span>
                    <strong className="text-slate-200 font-mono">{col.avgPayloadKb} KB</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Anomalies (24h):</span>
                    <strong className={col.anomaliesLast24h > 5 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {col.anomaliesLast24h}
                    </strong>
                  </div>

                  {/* Risk Score Meter */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-semibold">Risk Score:</span>
                      <span className={`font-mono font-bold ${
                        col.riskScore > 80 ? 'text-rose-400' :
                        col.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {col.riskScore} / 100
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          col.riskScore > 80 ? 'bg-rose-500' :
                          col.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${col.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {isQuarantined && (
                  <div className="mt-3 p-2 rounded bg-rose-950/60 border border-rose-800/60 text-[11px] text-rose-200">
                    <strong>QUARANTINE ENFORCED:</strong> Ingestion stream blocked via CRL. Collector isolated from central telemetry hub.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
