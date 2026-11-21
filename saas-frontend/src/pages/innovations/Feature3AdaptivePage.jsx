import React, { useState, useEffect } from 'react';
import InnovationNavHeader from '../../components/InnovationNavHeader';
import {
  Layers,
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Maximize2,
  Workflow,
  Lock,
  Zap,
  Sliders
} from 'lucide-react';
import {
  fetchPrivacyShieldOverview,
  setAdaptiveThreatLevel
} from '../../services/api';

export default function Feature3AdaptivePage({ setActivePage }) {
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

  const handleSetThreatLevel = async (lvl) => {
    setActionLoading(true);
    try {
      await setAdaptiveThreatLevel(lvl);
      setToast({
        type: 'success',
        title: `Adaptive Threat Level Updated: ${lvl}`,
        msg: `Dynamic privacy filters shifted to ${lvl} mode. Edge egress redaction policy updated in real time.`
      });
      loadData();
    } catch (err) {
      setToast({ type: 'error', title: 'Error', msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const currentLevel = data?.adaptivePrivacy?.currentThreatLevel || "NORMAL";
  const matrix = data?.adaptivePrivacy?.classifications || [
    { classification: "Public", example: "CPU & Memory Utilization Percentages", normalAction: "Allow", elevatedAction: "Allow", criticalAction: "Allow (Coarse)" },
    { classification: "Internal", example: "Hostnames & Service Identifiers (e.g. auth-svc-01)", normalAction: "Pseudonymize", elevatedAction: "Anonymize Hash", criticalAction: "Strip Completely" },
    { classification: "Confidential", example: "Internal IP Addresses & Active User Session IDs", normalAction: "Mask (Subnet /24)", elevatedAction: "Full Redaction", criticalAction: "Block / Drop" },
    { classification: "Critical", example: "Passwords, Bearer Tokens, API Credentials", normalAction: "Block Immediately", elevatedAction: "Block & Quarantine", criticalAction: "Block & Halt Egress" }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Global Innovation Stepper Header */}
      <InnovationNavHeader activePage="feat_adaptive" setActivePage={setActivePage} />

      {/* Toast Alert */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
          toast.type === 'error' ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' :
          'bg-purple-950/80 border-purple-500/50 text-purple-200'
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500 text-black font-extrabold text-[10px] tracking-wider uppercase">
                FEATURE 3 &bull; DYNAMIC PRIVACY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 font-bold text-[10px] border border-purple-900">
                MULTI-REGULATORY GATEWAY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                4-TIER SENSITIVITY
              </span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <Layers className="h-7 w-7 text-purple-400" />
              Adaptive Privacy (Dynamic 4-Tier Data Protection)
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Instead of treating all metadata equally or relying on static rules, the platform introduces dynamic sensitivity classification across 4 data tiers. When operational threat levels escalate, the system dynamically tightens data sharing behaviour to prevent data exfiltration.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-400">Current Mode:</span>
            <span className={`px-3 py-1.5 rounded-xl font-extrabold text-xs tracking-wider border ${
              currentLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500' :
              currentLevel === 'ELEVATED' ? 'bg-amber-500/20 text-amber-300 border-amber-500' :
              'bg-emerald-500/20 text-emerald-300 border-emerald-500'
            }`}>
              {currentLevel}
            </span>
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
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
              ARCHITECTURE DESIGN BLUEPRINT &bull; FEATURE 3
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Workflow className="h-4 w-4 text-purple-400" />
              Multi-Regulatory Adaptive Gateway &amp; RBAC Pipeline Architecture
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
            <div className="relative rounded-xl overflow-hidden border border-purple-500/30 bg-slate-900 shadow-2xl group">
              <img
                src="/architectures/feature3-adaptive.jpg"
                alt="Feature 3 Architecture: Multi-Regulatory Adaptive Gateway"
                className="w-full object-contain max-h-[460px] bg-slate-950 transition-transform duration-300 group-hover:scale-[1.02] p-2"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="font-semibold text-purple-300">
                  Architecture 3: Adaptive Privacy &bull; Dynamically classifies and applies privacy policies
                </span>
                <span className="font-mono text-[10px] text-slate-400">Specification: Architecture Design</span>
              </div>
            </div>
          </div>

          {!imageZoom && (
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider block">
                  REGULATORY PIPELINE FLOW
                </span>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <div>
                      <strong className="text-white block">Multi-Regulatory Compliance Framework</strong>
                      <span className="text-slate-400 text-[11px]">Compliance policies ingested: GDPR, HIPAA, PCI DSS, and NIST guidelines.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <div>
                      <strong className="text-white block">Pre-Sanitization Gateway</strong>
                      <span className="text-slate-400 text-[11px]">Incoming payload undergoes deterministic masking (emails <code>e***@*</code>, account #s <code>**** 1234</code>).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <div>
                      <strong className="text-white block">AI Model Analysis &amp; DLP Engine</strong>
                      <span className="text-slate-400 text-[11px]">Machine learning evaluates risk context and feeds into DLP inspection rules.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                    <div>
                      <strong className="text-white block">Role-Based Access Control (RBAC)</strong>
                      <span className="text-slate-400 text-[11px]">Scoped delivery based on tenant role permissions, strictly preserving zero-trust boundary.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Threat State Indicator */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-2">
                <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider block">
                  ADAPTIVE POLICY SWITCHER
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  During an active security incident, nonessential outbound telemetry is dynamically curtailed at the source, preventing potential exfiltration.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. In-Depth Technical Information (The 4 Categories & Dynamic Policy) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" /> 4-Tier Dynamic Sensitivity
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Instead of treating all metadata equally, information is classified into 4 distinct categories:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5">
            <li><strong className="text-emerald-400">Public:</strong> CPU/RAM metrics &rarr; Always Allow.</li>
            <li><strong className="text-cyan-400">Internal:</strong> Service IDs &rarr; Pseudonymize.</li>
            <li><strong className="text-amber-400">Confidential:</strong> Internal IPs &rarr; Redact / aggregate.</li>
            <li><strong className="text-rose-400">Critical:</strong> Passwords, API keys &rarr; Deterministic Block.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5" /> Dynamic Threat-Level Adaptation
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            The platform dynamically alters data-sharing behaviour based on active risk:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 text-[11px]">
            <li><strong>Normal Operation:</strong> Send aggregated metrics with standard pseudonymization.</li>
            <li><strong>Suspicious Activity:</strong> Automatically restrict additional metadata and strip internal IPs.</li>
            <li><strong>Critical Incident:</strong> Stop nonessential outbound data completely.</li>
            <li><strong>Recovery:</strong> Restore normal transmission after authorized review.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> Technical Implementation &amp; Tier 1 Gate
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Crucial architecture requirement: <strong>Classification happens locally, and the final data-transfer decision is enforced locally.</strong>
          </p>
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
            <strong>Key Features:</strong>
            <p>Regex &amp; pattern detection, Entropy secret detection, Local data classification, Dynamic policy engine, AI risk assessment.</p>
          </div>
        </div>
      </div>

      {/* 5. Live Interactive Threat Level Switcher & Policy Enforcement Matrix */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
              INTERACTIVE SIMULATOR &bull; ADAPTIVE POLICY ENGINE
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Sliders className="h-4 w-4 text-purple-400" />
              Dynamic Threat Level Switcher &amp; Policy Matrix
            </h3>
          </div>

          {/* 3-Way Threat Level Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['NORMAL', 'ELEVATED', 'CRITICAL'].map((lvl) => {
              const isSelected = currentLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => handleSetThreatLevel(lvl)}
                  disabled={actionLoading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    isSelected
                      ? lvl === 'CRITICAL' ? 'bg-rose-500 text-black shadow-md' :
                        lvl === 'ELEVATED' ? 'bg-amber-500 text-black shadow-md' :
                        'bg-emerald-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Tier Policy Enforcement Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Data Classification</th>
                <th className="p-3">Telemetry Example</th>
                <th className="p-3">Normal Action</th>
                <th className="p-3">Elevated Action</th>
                <th className="p-3">Critical Lockdown Action</th>
                <th className="p-3">Active Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {matrix.map((row, idx) => {
                const activeAction = currentLevel === 'CRITICAL' ? row.criticalAction :
                                     currentLevel === 'ELEVATED' ? row.elevatedAction : row.normalAction;
                return (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="p-3 font-extrabold text-white">
                      <span className={`px-2 py-0.5 rounded ${
                        row.classification === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        row.classification === 'Confidential' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        row.classification === 'Internal' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {row.classification}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-sans text-xs">{row.example}</td>
                    <td className={`p-3 ${currentLevel === 'NORMAL' ? 'font-bold text-emerald-400' : 'text-slate-500'}`}>{row.normalAction}</td>
                    <td className={`p-3 ${currentLevel === 'ELEVATED' ? 'font-bold text-amber-400' : 'text-slate-500'}`}>{row.elevatedAction}</td>
                    <td className={`p-3 ${currentLevel === 'CRITICAL' ? 'font-bold text-rose-400' : 'text-slate-500'}`}>{row.criticalAction}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full font-extrabold text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {activeAction}
                      </span>
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
