import React from 'react';
import { Server, CheckCircle2, AlertTriangle, Clock, HardDrive, RefreshCw, Layers, Laptop, ShieldCheck } from 'lucide-react';

export default function FleetPage({ collectors = [] }) {
  const laptopCollector = collectors.find(c => c.collectorId === "PROD-APP-SERVER-01") || collectors[0] || {};
  const metrics = laptopCollector.metrics || {};
  const osInfo = metrics.os_info || { system: "Windows", release: "11", machine: "AMD64", hostname: "LAPTOP-LOCAL" };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>INFRASTRUCTURE</span>
            <span>/</span>
            <span className="text-purple-400">EDGE COLLECTOR FLEET</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Server className="h-6 w-6 text-purple-400" />
            Edge Collectors Fleet Inventory & Two-Tier Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tier-1 local collectors extracting real-time hardware telemetry via psutil, SQLite outbox queuing, and HMAC signing.
          </p>
        </div>

        {/* Watchdog Status Pill */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Heartbeat Interval</span>
            <span className="text-xs font-bold text-cyan-400">5.0 Seconds</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Offline Resilience</span>
            <span className="text-xs font-bold text-emerald-400">SQLite Durable Outbox</span>
          </div>
        </div>
      </div>

      {/* 2. Live Laptop Node Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl">
              <Laptop className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500 text-black">
                  PRIMARY TIER-1 SENSOR NODE
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {osInfo.hostname || "Windows Laptop Host"} ({laptopCollector.collectorId || "PROD-APP-SERVER-01"})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Platform: {osInfo.system} {osInfo.release} | Architecture: {osInfo.machine} | Memory: {metrics.ram_total_gb || 15.6} GB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Local Edge Port</span>
              <span className="text-base font-extrabold text-cyan-400 font-mono">:8001</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">SQLite Outbox</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">Active Ring Buffer</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Fleet Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Total Enrolled Nodes</span>
          <span className="text-2xl font-extrabold text-white mono-font">{collectors.length}</span>
          <span className="text-xs text-slate-400 block mt-1">Tier-1 Edge Fleet</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Online & Reporting</span>
          <span className="text-2xl font-extrabold text-emerald-400 mono-font">
            {collectors.filter(c => c.status === "ONLINE").length}
          </span>
          <span className="text-xs text-slate-400 block mt-1">Real-time Stream Active</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">HMAC Authentication</span>
          <span className="text-2xl font-extrabold text-purple-400 mono-font">SHA-256</span>
          <span className="text-xs text-slate-400 block mt-1">Exact-byte Verified</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sampling Interval</span>
          <span className="text-2xl font-extrabold text-cyan-400 mono-font">5.0s</span>
          <span className="text-xs text-slate-400 block mt-1">Continuous psutil</span>
        </div>
      </div>

      {/* 4. Fleet Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" /> Active Edge Agent Instances
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">COLLECTOR ID</th>
                <th className="py-3 px-3">CHAIN ID</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3">HEALTH STATE</th>
                <th className="py-3 px-3">DYNAMIC MODE</th>
                <th className="py-3 px-3">CPU / RAM</th>
                <th className="py-3 px-3">LAST HEARTBEAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {collectors.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 text-cyan-400 font-bold">{c.collectorId}</td>
                  <td className="py-3 px-3 text-purple-400">{c.chain_id || 'CHAIN-COL-001'}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'ONLINE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      c.health_state === 'EXCELLENT' ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40' :
                      c.health_state === 'GOOD' ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/40' :
                      c.health_state === 'FAIR' ? 'text-amber-400 bg-amber-950/60 border border-amber-800/40' :
                      'text-rose-400 bg-rose-950/60 border border-rose-800/40'
                    }`}>
                      {c.health_state || 'EXCELLENT'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{c.sampling_mode || 'HEARTBEAT'}</td>
                  <td className="py-3 px-3 text-slate-300">
                    {c.metrics?.cpu_pct ?? 0}% / {c.metrics?.ram_pct ?? 0}%
                  </td>
                  <td className="py-3 px-3 text-slate-400">{c.lastSeenAt ? new Date(c.lastSeenAt).toLocaleTimeString() : 'Just now'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
