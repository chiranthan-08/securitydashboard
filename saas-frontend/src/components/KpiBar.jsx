import React from 'react';
import { Server, AlertTriangle, ShieldCheck, Activity, Lock } from 'lucide-react';

export default function KpiBar({ overview }) {
  const {
    totalCollectors = 1,
    activeCollectors = 1,
    activeIncidentsCount = 0,
    overallHealth = "EXCELLENT",
    totalPiiBlocked = 0
  } = overview || {};

  const getHealthBadge = (health) => {
    switch (health) {
      case "EXCELLENT":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          dot: "bg-emerald-400",
          label: "EXCELLENT (Optimal Baseline)"
        };
      case "GOOD":
        return {
          bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
          dot: "bg-cyan-400",
          label: "GOOD (Minor Deviation)"
        };
      case "FAIR":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          dot: "bg-amber-400",
          label: "FAIR (Degraded Thresholds)"
        };
      case "POOR":
      default:
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          dot: "bg-rose-400",
          label: "POOR (Critical / Anomaly Active)"
        };
    }
  };

  const healthStyle = getHealthBadge(overallHealth);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Fleet Health */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fleet Health State</span>
          <Activity className="h-4 w-4 text-slate-400" />
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-2 ${healthStyle.bg}`}>
            <span className={`h-2 w-2 rounded-full ${healthStyle.dot} animate-pulse`}></span>
            <span>{healthStyle.label}</span>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">15s stale watchdog active</p>
      </div>

      {/* 2. Active Collectors */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Edge Collectors</span>
          <Server className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white mono-font">{activeCollectors}</span>
          <span className="text-xs text-slate-400">/ {totalCollectors} Active</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">psutil local collection • port 8001</p>
      </div>

      {/* 3. AIOps Correlated Incidents */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Correlated Incidents</span>
          <AlertTriangle className={`h-4 w-4 ${activeIncidentsCount > 0 ? 'text-rose-400' : 'text-slate-400'}`} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-2xl font-bold mono-font ${activeIncidentsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {activeIncidentsCount}
          </span>
          <span className="text-xs text-slate-400">Active Clusters</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">Multi-signal 60s correlation window</p>
      </div>

      {/* 4. PII Records Blocked Locally */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PII Blocked at Edge</span>
          <Lock className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-400 mono-font">{totalPiiBlocked}</span>
          <span className="text-xs text-slate-400">Records Scrubbed</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>0 sensitive fields ever transmitted</span>
        </div>
      </div>
    </div>
  );
}
