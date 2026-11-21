import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertCircle,
  Server,
  Lock,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  Brain,
  Gauge,
  ShieldAlert,
  Flame,
  Link2,
  Cpu,
  GitFork,
  Sliders,
  RotateCcw,
  ChevronDown
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, incidentsCount, collectorsCount, tenantId, setTenantId, isLive }) {
  const [innovationsOpen, setInnovationsOpen] = useState(true);

  const innovationItems = [
    { id: "feat_guardian", num: "1", name: "AI Privacy Guardian", icon: ShieldAlert, color: "text-cyan-400" },
    { id: "feat_canary", num: "2", name: "Canary Honeytokens", icon: Flame, color: "text-amber-400" },
    { id: "feat_adaptive", num: "3", name: "Adaptive Privacy", icon: Layers, color: "text-purple-400" },
    { id: "feat_ledger", num: "4", name: "Tamper Egress Ledger", icon: Link2, color: "text-emerald-400" },
    { id: "feat_fingerprint", num: "5", name: "Collector Fingerprinting", icon: Cpu, color: "text-blue-400" },
    { id: "feat_graph", num: "6", name: "Attack Correlation Graph", icon: GitFork, color: "text-rose-400" },
    { id: "feat_sandbox", num: "7", name: "Policy Simulator", icon: Sliders, color: "text-sky-400" },
    { id: "feat_remediation", num: "8", name: "Reversible Remediation", icon: RotateCcw, color: "text-teal-400" },
  ];

  const coreItems = [
    {
      id: "telemetry",
      name: "NOC Telemetry",
      subtitle: "Live Multi-Metric Charts",
      icon: Activity,
      color: "text-cyan-400",
      activeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
    },
    {
      id: "ai_engine",
      name: "AIOps & AI Engine",
      subtitle: "Multivariate XAI & Roadmap",
      icon: Brain,
      badge: "AI Driven",
      color: "text-purple-400",
      activeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
    },
    {
      id: "egress",
      name: "Egress Proof",
      subtitle: "Zero-Trust Ledger Diff",
      icon: ShieldCheck,
      badge: "Differentiator",
      color: "text-emerald-400",
      activeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    },
    {
      id: "incidents",
      name: "AIOps Incidents",
      subtitle: "Explainable Remediation",
      icon: AlertCircle,
      count: incidentsCount,
      color: "text-rose-400",
      activeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
    },
    {
      id: "benchmarks",
      name: "Live Benchmarks",
      subtitle: "Page 3 Latency Targets",
      icon: Gauge,
      badge: "SLA Targets",
      color: "text-cyan-400",
      activeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
    },
    {
      id: "fleet",
      name: "Collector Fleet",
      subtitle: "psutil Edge Inventory",
      icon: Server,
      count: collectorsCount,
      color: "text-blue-400",
      activeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    },
    {
      id: "privacy",
      name: "Privacy & Compliance",
      subtitle: "GDPR / HIPAA / DPDP",
      icon: Lock,
      color: "text-amber-400",
      activeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
    }
  ];

  return (
    <aside className="w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 select-none overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider text-white">CICADA</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Zero-Trust AIOps Platform</p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="px-3 pt-3 pb-1">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Stream Status:</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </span>
              <span className={`text-[11px] font-bold ${isLive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isLive ? 'LIVE WS' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>

        {/* MongoDB Atlas Status Pill */}
        <div className="px-3 pb-1">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Database:</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-emerald-400 font-mono">
                Atlas Cluster0
              </span>
            </div>
          </div>
        </div>

        {/* 1. Section: 8 Dedicated Innovation Pages */}
        <div className="p-2.5 pb-1">
          <button
            onClick={() => setInnovationsOpen(!innovationsOpen)}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-950/60 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              8 Innovation Pages
            </span>
            {innovationsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>

          {innovationsOpen && (
            <div className="mt-1 space-y-0.5">
              {innovationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm font-bold'
                        : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-extrabold ${
                        isActive ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                      }`}>
                        #{item.num}
                      </span>
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? item.color : 'text-slate-500'}`} />
                      <span className="text-[11px] truncate">{item.name}</span>
                    </div>
                    {isActive && <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Section: Core Operations Views */}
        <nav className="p-2.5 pt-1 space-y-1">
          <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Core NOC Views
          </span>
          {coreItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between py-1.5 px-2 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? item.activeBg + ' shadow-md'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-slate-950/80' : 'bg-slate-900'}`}>
                    <Icon className={`h-3.5 w-3.5 ${isActive ? item.color : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">{item.name}</span>
                    <span className="text-[9px] text-slate-500 block">{item.subtitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {item.badge}
                    </span>
                  )}
                  {item.count > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-mono">
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tenant Context Box in Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Active Tenant Scope
        </span>
        <select
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="TENANT-FINTECH-01">[PROD] Acme FinTech</option>
          <option value="TENANT-HEALTH-02">[STAGE] BioHealth (HIPAA)</option>
        </select>
        <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
          <Lock className="h-3 w-3 text-emerald-400 shrink-0" />
          <span>Strict DB Tenant Isolation</span>
        </p>
      </div>
    </aside>
  );
}
