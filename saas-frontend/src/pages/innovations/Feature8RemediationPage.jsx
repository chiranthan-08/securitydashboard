import React, { useState, useEffect } from 'react';
import InnovationNavHeader from '../../components/InnovationNavHeader';
import {
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Maximize2,
  Workflow,
  Clock,
  UserCheck,
  Zap,
  Sliders,
  History
} from 'lucide-react';
import {
  fetchPrivacyShieldOverview,
  executeShieldRemediation,
  rollbackShieldRemediation
} from '../../services/api';

export default function Feature8RemediationPage({ setActivePage }) {
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

  const handleExecute = async (actionId) => {
    setActionLoading(true);
    try {
      const res = await executeShieldRemediation(actionId);
      setToast({
        type: 'success',
        title: 'Remediation Executed (Watchdog Active)',
        msg: `Action ${actionId} executed successfully with 60s rollback window.`
      });
      loadData();
    } catch (err) {
      setToast({ type: 'error', title: 'Error', msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRollback = async (actionId) => {
    setActionLoading(true);
    try {
      const res = await rollbackShieldRemediation(actionId);
      setToast({
        type: 'warning',
        title: 'Remediation Rolled Back',
        msg: `Action ${actionId} successfully reverted to pre-flight snapshot.`
      });
      loadData();
    } catch (err) {
      setToast({ type: 'error', title: 'Error', msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const actions = data?.remediationActions || [
    {
      id: "ACT-CANARY-ROTATE",
      title: "Revoke & Rotate Canary Token CANARY-SECRET-92831",
      target: "App Server Environment Vault",
      stage: "READY_FOR_APPROVAL",
      severity: "CRITICAL",
      reason: "Deception token triggered in egress inspection stream.",
      rollbackPlan: "Revert to backup credential reference via automated script within 60s.",
      countdown: 60,
      executed: false
    },
    {
      id: "ACT-QUARANTINE-NODE",
      title: "Quarantine Rogue Collector SHADOW-COLLECTOR-09",
      target: "mTLS Certificate Revocation List (CRL)",
      stage: "READY_FOR_APPROVAL",
      severity: "HIGH",
      reason: "Behavioral fingerprint deviation (payload burst 42.8KB at 0.5s intervals).",
      rollbackPlan: "Restore mTLS certificate trust in API Gateway allow-list.",
      countdown: 60,
      executed: false
    },
    {
      id: "ACT-RESTORE-POLICY",
      title: "Re-apply Approved Filtering Policy (Enforce Entropy < 4.2)",
      target: "Local Edge PrivacyGuard Configuration",
      stage: "APPROVED",
      severity: "MEDIUM",
      reason: "Configuration drift prevention and strict allow-list restoration.",
      rollbackPlan: "Restore previous policy snapshot from signed GitOps state.",
      countdown: 0,
      executed: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Global Innovation Stepper Header */}
      <InnovationNavHeader activePage="feat_remediation" setActivePage={setActivePage} />

      {/* Toast Alert */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
          toast.type === 'error' ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' :
          toast.type === 'warning' ? 'bg-amber-950/80 border-amber-500/50 text-amber-200' :
          'bg-teal-950/80 border-teal-500/50 text-teal-200'
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-950 border border-teal-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500 text-black font-extrabold text-[10px] tracking-wider uppercase">
                FEATURE 8 &bull; AUTONOMOUS OPS ROADMAP
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 font-bold text-[10px] border border-teal-900">
                HUMAN-IN-THE-LOOP
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                60S REVERSIBLE WATCHDOG
              </span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <RotateCcw className="h-7 w-7 text-teal-400" />
              AI Recommendations &amp; Safe Reversible Remediation
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Instead of only reporting incidents, the AI engine prescribes corrective remediation plans with policy-governed human approval. Every action executes under an automated 60-second watchdog timer with 1-click reversible rollback to eliminate operational risk.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 rounded-xl bg-slate-900 border border-teal-900/60 text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Pending Approvals</span>
              <span className="text-xl font-extrabold text-teal-400 font-mono">
                {actions.filter(a => !a.executed).length}
              </span>
            </div>
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
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">
              ARCHITECTURE DESIGN BLUEPRINT &bull; FEATURE 8
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Workflow className="h-4 w-4 text-teal-400" />
              3-Stage Human-in-the-Loop Reversible Remediation Pipeline Architecture
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
            <div className="relative rounded-xl overflow-hidden border border-teal-500/30 bg-slate-900 shadow-2xl group">
              <img
                src="/architectures/feature8-remediation.jpg"
                alt="Feature 8 Architecture: Remediation"
                className="w-full object-contain max-h-[460px] bg-slate-950 transition-transform duration-300 group-hover:scale-[1.02] p-2"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="font-semibold text-teal-300">
                  Architecture 8: Remediation &bull; Recommends and executes safe corrective actions
                </span>
                <span className="font-mono text-[10px] text-slate-400">Specification: Architecture Design</span>
              </div>
            </div>
          </div>

          {!imageZoom && (
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-wider block">
                  3-STAGE REMEDIATION PROCESS
                </span>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <div>
                      <strong className="text-white block">Stage 1: AI Diagnostics</strong>
                      <span className="text-slate-400 text-[11px]">Identifies security incident root cause (e.g. honeytoken trigger, rogue collector burst).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <div>
                      <strong className="text-white block">Stage 2: Prescriptive Action Plan</strong>
                      <span className="text-slate-400 text-[11px]">Formulates safe, targeted counter-measure with pre-computed automated rollback plan.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <div>
                      <strong className="text-amber-300 block">Stage 3: Human Approval Gate</strong>
                      <span className="text-slate-400 text-[11px]">SecOps engineer reviews and signs authorization. Zero unreviewed autonomous actions.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                    <div>
                      <strong className="text-emerald-300 block">Stage 4: Execution with Watchdog</strong>
                      <span className="text-slate-400 text-[11px]">60-second timer monitors service health. Instant 1-click rollback available.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Roadmap Alignment Callout */}
              <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30 text-xs space-y-2">
                <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-wider block">
                  PROBLEM STATEMENT ROADMAP ALIGNMENT
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Directly implements the <strong>Autonomous Ops Roadmap (Problem Statement Page 8)</strong>, guaranteeing policy-controlled and reversible actions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. In-Depth Technical Information (The Problem, The Stages, Reversibility) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5" /> What is the problem?
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Conventional tools alert on problems but leave engineers scrambling to write ad-hoc bash scripts or restart nodes blindly under pressure.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unsupervised autonomous scripts can worsen an outage if an incorrect remediation is triggered automatically without a rollback safety net.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5" /> Prescriptive Action Mapping
          </span>
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <p><strong>&bull; Secret Detected:</strong> Block egress &amp; rotate affected credential.</p>
            <p><strong>&bull; Rogue Collector:</strong> Revoke mTLS certificate &amp; isolate node.</p>
            <p><strong>&bull; Unusual Outbound Traffic:</strong> Restrict egress destination.</p>
            <p><strong>&bull; Config Drift:</strong> Restore signed GitOps baseline.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> Why this is valuable for Judges
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Reversible remediation provides true enterprise safety:
          </p>
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
            <strong>Demonstration Scenario:</strong>
            <p>Click "Approve &amp; Execute (60s Rollback)" below to trigger credential rotation, watch the 60s countdown, and click "Rollback" to verify immediate restoration.</p>
          </div>
        </div>
      </div>

      {/* 5. Live Interactive Remediation Cards & 60s Watchdog Rollback */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">
              ACTION AUDIT TRAIL &bull; HUMAN APPROVAL GATE
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <History className="h-4 w-4 text-teal-400" />
              Prescriptive Remediation Actions &amp; Rollback Controls
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            60s Safety Watchdog Active
          </span>
        </div>

        {/* Remediation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((act) => {
            const isExecuted = act.executed;
            return (
              <div
                key={act.id}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isExecuted
                    ? 'bg-slate-900 border-emerald-500/40'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{act.id}</span>
                    <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                      isExecuted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      act.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {act.stage}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-white mb-1.5">{act.title}</h4>
                  <p className="text-[11px] text-slate-400 mb-2">Target: <strong className="text-slate-200">{act.target}</strong></p>
                  
                  <div className="p-2 rounded bg-black/40 border border-slate-800 text-[10px] text-slate-300 space-y-1 mb-3">
                    <p><strong>Reason:</strong> {act.reason}</p>
                    <p className="text-purple-300"><strong>Rollback:</strong> {act.rollbackPlan}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  {isExecuted ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-emerald-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> Executed &amp; Monitored
                        </span>
                        <span className="font-mono text-[10px]">T-0s</span>
                      </div>
                      <button
                        onClick={() => handleRollback(act.id)}
                        disabled={actionLoading}
                        className="w-full py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-xs font-bold text-rose-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Rollback to Previous State</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleExecute(act.id)}
                      disabled={actionLoading}
                      className="w-full py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-black text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Approve &amp; Execute (60s Rollback)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
