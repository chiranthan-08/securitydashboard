import React, { useState, useEffect } from 'react';
import InnovationNavHeader from '../../components/InnovationNavHeader';
import {
  ShieldAlert,
  Flame,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Eye,
  Zap,
  Info,
  Maximize2,
  Workflow
} from 'lucide-react';
import {
  fetchPrivacyShieldOverview,
  triggerEntropySecret,
  resetPrivacyShieldAll
} from '../../services/api';

export default function Feature1GuardianPage({ setActivePage }) {
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

  const handleSimulateEntropy = async () => {
    setActionLoading(true);
    try {
      const res = await triggerEntropySecret();
      setToast({
        type: 'warning',
        title: 'High-Entropy Secret Detected!',
        msg: `Entropy: ${res.guardianLog?.entropyScore?.toFixed(2)} bits. Decision: ${res.guardianLog?.decision} - Payload held locally.`
      });
      loadData();
    } catch (err) {
      setToast({ type: 'error', title: 'Error', msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const stats = data?.guardianStats || {
    totalInspected: 1420,
    approvedCount: 1368,
    heldCount: 38,
    blockedCount: 14,
    avgLatencyMs: 1.42
  };
  const logs = data?.recentInspections || [];

  return (
    <div className="space-y-6">
      {/* 1. Global Innovation Stepper Header */}
      <InnovationNavHeader activePage="feat_guardian" setActivePage={setActivePage} />

      {/* Toast Alert */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
          toast.type === 'error' ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' :
          toast.type === 'warning' ? 'bg-amber-950/80 border-amber-500/50 text-amber-200' :
          'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
        }`}>
          <div>
            <strong className="block font-bold">{toast.title}</strong>
            <span>{toast.msg}</span>
          </div>
          <button onClick={() => setToast(null)} className="px-2 py-1 rounded bg-black/40 hover:bg-black/60 font-bold ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Hero Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-black font-extrabold text-[10px] tracking-wider uppercase">
                FEATURE 1 &bull; HIGHLY RECOMMENDED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-bold text-[10px] border border-cyan-900">
                PRACTICAL PROTOTYPE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                TIER 1 LOCAL EDGE
              </span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <ShieldAlert className="h-7 w-7 text-cyan-400" />
              AI-Powered Privacy Firewall (AI Privacy Guardian)
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              An intelligent, pre-transmission guardian operating at Tier 1 edge that inspects outgoing payloads before they leave the customer's perimeter. It combines Deep Packet Inspection (DPI) with Shannon Entropy analysis to evaluate whether data is mathematically and contextually safe for SaaS ingestion.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSimulateEntropy}
              disabled={actionLoading}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              <span>Simulate High-Entropy Secret</span>
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
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
              ARCHITECTURE DESIGN BLUEPRINT &bull; FEATURE 1
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Workflow className="h-4 w-4 text-cyan-400" />
              Local DLP Gateway &amp; Pre-Transmission Firewall Architecture
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
            <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-900 shadow-2xl group">
              <img
                src="/architectures/feature1-firewall.jpg"
                alt="Feature 1 Architecture: DLP Gateway / Firewall"
                className="w-full object-contain max-h-[460px] bg-slate-950 transition-transform duration-300 group-hover:scale-[1.02] p-2"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="font-semibold text-cyan-300">
                  Architecture 1: AI Privacy Guardian &bull; Inspects outgoing data and blocks sensitive information
                </span>
                <span className="font-mono text-[10px] text-slate-400">Specification: Architecture Design</span>
              </div>
            </div>
          </div>

          {!imageZoom && (
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block">
                  FLOW ANALYSIS &bull; 4 STEPS
                </span>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <div>
                      <strong className="text-white block">Endpoint Telemetry Ingestion</strong>
                      <span className="text-slate-400 text-[11px]">Local processes and agents produce system metrics, application logs, and traces.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <div>
                      <strong className="text-white block">Deep Packet Inspection (DPI)</strong>
                      <span className="text-slate-400 text-[11px]">Payload stream evaluated with regex matching (credit cards, PII, keys) and Shannon entropy ($H \gt 4.5$).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <div>
                      <strong className="text-rose-300 block">Blocked Fork (Secret Detected)</strong>
                      <span className="text-slate-400 text-[11px]">Payload dropped immediately before transmission. Security alert raised to Admin Console.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                    <div>
                      <strong className="text-emerald-300 block">Allowed Fork (Sanitized Metadata)</strong>
                      <span className="text-slate-400 text-[11px]">Sanitized telemetry dispatched over TLS/mTLS to centralized SaaS platform.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision Engine Breakdown */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                  PRIVACY GUARDIAN DECISION MATRIX
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                    <span className="font-bold text-emerald-400 block">APPROVED</span>
                    <span className="text-slate-400 block mt-0.5">Send metadata to SaaS</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/40">
                    <span className="font-bold text-amber-400 block">SUSPICIOUS</span>
                    <span className="text-slate-400 block mt-0.5">Hold &amp; request review</span>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40">
                    <span className="font-bold text-rose-400 block">SENSITIVE</span>
                    <span className="text-slate-400 block mt-0.5">Halt &amp; alert incident</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. In-Depth Technical Information (The Problem, The Solution, Value for Judges) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5" /> What is the problem?
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your local collector filters sensitive information before sending data to SaaS. But what if:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>A new type of secret appears that your filtering rules don't recognize?</li>
            <li>Someone modifies the collector configuration?</li>
            <li>An application accidentally outputs private keys in stack traces?</li>
            <li>An attacker attempts to exfiltrate data through an approved connection?</li>
          </ul>
          <p className="text-xs text-slate-400 mt-2 italic">
            A static allow-list cannot catch every zero-day secret or unexpected condition.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Your New Feature: AI Privacy Guardian
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Build an <strong>AI Privacy Guardian</strong> between the local collector and the SaaS platform that inspects every outgoing payload before transmission:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>Collector collects raw telemetry locally.</li>
            <li>Data is filtered and sensitive patterns are detected via regex + entropy.</li>
            <li>AI evaluates Shannon entropy thresholds and suspicious entropy clustering.</li>
            <li>Deterministic security policy engine enforces the final pass/drop decision.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> What makes it interesting for Judges?
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Instead of simply filtering data, your platform continuously evaluates whether data is safe to leave the customer's perimeter:
          </p>
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
            <strong>Key Hackathon Advantage:</strong>
            <p>Uses deterministic security rules for the final gate: AI identifies anomalies and flags high entropy, but deterministic rules ensure zero unauthorized leakage.</p>
          </div>
        </div>
      </div>

      {/* 5. Live Interactive Inspection Table & Live KPIs */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
              LIVE TELEMETRY STREAM &bull; GUARDIAN INTERACTIVE ENGINE
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Eye className="h-4 w-4 text-cyan-400" />
              Real-Time Pre-Transmission Inspection Feed
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Updated every 3s
          </span>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Inspected</span>
            <p className="text-xl font-extrabold text-white font-mono mt-1">{stats.totalInspected}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-900/40">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Approved Metadata</span>
            <p className="text-xl font-extrabold text-emerald-400 font-mono mt-1">{stats.approvedCount}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-900/40">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Suspicious Held</span>
            <p className="text-xl font-extrabold text-amber-400 font-mono mt-1">{stats.heldCount}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-900/40">
            <span className="text-[10px] font-bold text-rose-400 uppercase">Critical Blocked</span>
            <p className="text-xl font-extrabold text-rose-400 font-mono mt-1">{stats.blockedCount}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-900/40">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">Decision Latency</span>
            <p className="text-xl font-extrabold text-cyan-300 font-mono mt-1">{stats.avgLatencyMs} ms</p>
          </div>
        </div>

        {/* Live Inspection Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Inspection ID</th>
                <th className="p-3">Payload ID</th>
                <th className="p-3">Source Collector</th>
                <th className="p-3">Shannon Entropy</th>
                <th className="p-3">Decision</th>
                <th className="p-3">Enforced Action</th>
                <th className="p-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {logs.slice(0, 7).map((log) => {
                const isBlocked = log.decision === 'CRITICAL_BLOCKED';
                const isHeld = log.decision === 'SUSPICIOUS_HELD';
                return (
                  <tr key={log.id} className={isBlocked ? 'bg-rose-950/20' : isHeld ? 'bg-amber-950/20' : 'hover:bg-slate-900/40'}>
                    <td className="p-3 font-bold text-slate-300">{log.id}</td>
                    <td className="p-3 text-cyan-400">{log.payloadId}</td>
                    <td className="p-3 text-slate-400">{log.collectorId}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-extrabold ${
                        log.entropyScore > 4.5 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {log.entropyScore?.toFixed(2)} bits
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                        isBlocked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                        isHeld ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {log.decision}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-sans text-xs">{log.action}</td>
                    <td className="p-3 text-slate-400 font-sans text-xs max-w-xs truncate" title={log.reason}>
                      {log.reason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
