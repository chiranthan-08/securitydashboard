import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, RotateCcw, ShieldCheck, ChevronRight, Play } from 'lucide-react';
import { approveRemediation } from '../services/api';

export default function IncidentsPanel({ incidents = [], tenantId, onRemediateSuccess }) {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            AIOps Correlated Incidents & Safe Remediation
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-Signal Correlation Engine groups simultaneous threshold breaches into single actionable root causes.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800 text-xs text-cyan-200 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.map((incident) => {
          const isRemediating = incident.status === "REMEDIATING";
          const isResolved = incident.status === "RESOLVED";

          return (
            <div
              key={incident.id}
              className={`border rounded-xl p-5 transition-all ${
                isResolved
                  ? 'bg-slate-950/50 border-emerald-900/40'
                  : 'bg-slate-900/80 border-slate-800 shadow-lg'
              }`}
            >
              {/* Incident Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    incident.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {incident.severity}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{incident.title}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">ID: {incident.id} • Collector: {incident.collectorId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">AI Confidence</span>
                    <span className="text-xs font-bold text-cyan-400 mono-font">{incident.confidenceScore}%</span>
                  </div>
                </div>
              </div>

              {/* Signals Breakdown */}
              <div className="mt-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Multi-Signal Telemetry Evidence (60s Window):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {incident.signalsDetected?.map((sig, sIdx) => (
                    <div key={sIdx} className="bg-slate-950 border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
                      {sig}
                    </div>
                  ))}
                </div>
              </div>

              {/* Plain-English Root Cause Explanation */}
              <div className="mt-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                <span className="font-bold text-cyan-400 block mb-1">Explainable Root-Cause Analysis:</span>
                <p className="text-slate-300 leading-relaxed">{incident.rootCauseExplanation}</p>
              </div>

              {/* Safe Remediation & 60s Auto-Rollback Status */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Recommended Fix:</span>
                  <span className="text-xs text-white font-medium bg-slate-800 px-2 py-0.5 rounded">
                    {incident.recommendedAction}
                  </span>
                </div>

                {incident.status === "ACTIVE" && (
                  <button
                    onClick={() => handleApprove(incident.id)}
                    disabled={approvingId === incident.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all self-start sm:self-auto"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Approve Remediation Fix (Human-in-the-Loop)</span>
                  </button>
                )}

                {isRemediating && (
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                    <span>Monitoring Health for 60s (Auto-Rollback Active)...</span>
                  </div>
                )}

                {isResolved && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{incident.resolutionNote || "Resolved & Verified Stable"}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {incidents.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
            <CheckCircle2 className="h-8 w-8 text-emerald-400/50 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Zero Active Correlated Incidents</p>
            <p className="text-xs text-slate-500 mt-1">
              All infrastructure metrics within normal limits. Click "5. Multi-Signal Correlation" above to inject a cascade incident.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
