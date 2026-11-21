import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, RotateCcw, ShieldCheck, Zap, Clock, ShieldAlert, FileText, CheckCircle } from 'lucide-react';
import { approveRemediation } from '../services/api';

export default function IncidentsPage({ incidents = [], tenantId, onRemediateSuccess }) {
  const [approvingId, setApprovingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleApprove = async (incidentId) => {
    setApprovingId(incidentId);
    try {
      const res = await approveRemediation(tenantId, incidentId);
      setFeedback(res.message);
      if (onRemediateSuccess) onRemediateSuccess();
    } catch (e) {
      setFeedback(`Remediation error: ${e.message}`);
    } finally {
      setApprovingId(null);
    }
  };

  const activeIncidents = incidents.filter(i => i.status === "ACTIVE" || i.status === "REMEDIATING");
  const resolvedIncidents = incidents.filter(i => i.status === "RESOLVED" || i.status === "ROLLED_BACK");

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>AIOPS INTELLIGENCE</span>
            <span>/</span>
            <span className="text-rose-400">CORRELATED INCIDENTS</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <AlertCircle className="h-6 w-6 text-rose-400" />
            AIOps Multi-Signal Correlation & Explainable Remediation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Groups simultaneous threshold breaches across CPU, RAM, and Latency into single actionable root causes.
          </p>
        </div>

        {/* Incidents Count Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Incidents</span>
            <span className="text-lg font-extrabold text-rose-400 mono-font">{activeIncidents.length} Clusters</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Auto-Rollback Guard</span>
            <span className="text-xs font-bold text-emerald-400">60s Watchdog Active</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800 text-xs text-cyan-200 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.map((incident) => {
          const isRemediating = incident.status === "REMEDIATING";
          const isResolved = incident.status === "RESOLVED";
          const isRolledBack = incident.status === "ROLLED_BACK";

          return (
            <div
              key={incident.id}
              className={`border rounded-2xl p-6 transition-all shadow-xl ${
                isResolved
                  ? 'bg-slate-950/60 border-emerald-900/40'
                  : isRolledBack
                  ? 'bg-slate-950/60 border-amber-900/40'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    incident.severity === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {incident.severity}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">{incident.title}</h3>
                    <span className="text-xs text-slate-500 font-mono">
                      ID: {incident.id} • Collector: {incident.collectorId}
                    </span>
                  </div>
                </div>

                {/* AI Confidence Gauge */}
                <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">AI Confidence Score</span>
                    <span className="text-sm font-bold text-cyan-400 mono-font">{incident.confidenceScore}%</span>
                  </div>
                  <div className="h-6 w-1 rounded-full bg-cyan-500"></div>
                </div>
              </div>

              {/* Multi-Signal Telemetry Signals Detected */}
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Correlated Telemetry Evidence (60s Window):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {incident.signalsDetected?.map((sig, sIdx) => (
                    <div key={sIdx} className="bg-slate-950 border border-slate-800/90 px-3.5 py-2.5 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explainable Root-Cause Analysis */}
              <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="font-bold text-cyan-400 block mb-1.5 flex items-center gap-1.5">
                  <FileText className="h-4 w-4" /> Explainable Root-Cause Diagnosis:
                </span>
                <p className="text-slate-300 leading-relaxed">{incident.rootCauseExplanation}</p>
              </div>

              {/* Safe Remediation & 60s Auto-Rollback Status */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">Recommended Action:</span>
                  <div className="text-xs text-white font-medium bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg inline-block">
                    {incident.recommendedAction}
                  </div>
                </div>

                {incident.status === "ACTIVE" && (
                  <button
                    onClick={() => handleApprove(incident.id)}
                    disabled={approvingId === incident.id}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Approve Remediation Fix (Human-in-the-Loop)</span>
                  </button>
                )}

                {isRemediating && (
                  <div className="flex items-center gap-2.5 text-xs text-amber-400 bg-amber-950/30 border border-amber-900/60 px-4 py-2 rounded-xl">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping"></span>
                    <span>Monitoring Health for 60s (Auto-Rollback Guard Active)...</span>
                  </div>
                )}

                {isResolved && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/60 px-4 py-2 rounded-xl">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{incident.resolutionNote || "Resolved & Verified Stable"}</span>
                  </div>
                )}

                {isRolledBack && (
                  <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-900/60 px-4 py-2 rounded-xl">
                    <AlertCircle className="h-4 w-4" />
                    <span>{incident.resolutionNote || "60s Rollback Executed"}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {incidents.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <CheckCircle2 className="h-10 w-10 text-emerald-400/50 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">Zero Active Correlated Incidents</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All infrastructure metrics within normal limits. Click <b>"5. Multi-Signal Correlation"</b> in the top demo bar to inject a resource exhaustion cascade.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
