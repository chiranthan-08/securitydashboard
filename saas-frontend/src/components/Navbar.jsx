import React from 'react';
import { Shield, Server, Activity, Database, RefreshCw } from 'lucide-react';

export default function Navbar({ tenantId, setTenantId, isLive, onRefresh }) {
  const tenants = [
    { id: "TENANT-FINTECH-01", name: "Acme FinTech Corp (Production NOC)", tag: "PROD" },
    { id: "TENANT-HEALTH-02", name: "BioHealth Diagnostics (HIPAA Isolated)", tag: "STAGING" }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white">CICADA SENTINEL</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                AIOps 2026
              </span>
            </div>
            <p className="text-xs text-slate-400">Zero-Trust Privacy Guard • Cryptographic Egress Ledger • Multi-Signal Correlation</p>
          </div>
        </div>

        {/* Controls & Tenant Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tenant Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <span className="text-xs font-semibold text-slate-400 px-2">TENANT:</span>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="bg-slate-950 text-xs font-medium text-slate-200 border border-slate-800 rounded px-2.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id}>
                  [{t.tag}] {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* WebSocket Status Pill */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-slate-300 font-medium">
              {isLive ? 'WS Live Stream' : 'Connecting...'}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh All Telemetry"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
