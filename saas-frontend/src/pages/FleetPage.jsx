import React from 'react';
import { Server, CheckCircle2, AlertTriangle, Clock, HardDrive, RefreshCw, Layers } from 'lucide-react';

export default function FleetPage({ collectors = [] }) {
  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>INFRASTRUCTURE</span>
            <span>/</span>
            <span className="text-purple-400">EDGE COLLECTOR FLEET</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Server className="h-6 w-6 text-purple-400" />
            Edge Collectors Fleet Inventory & SQLite Outbox
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Local edge agents executing psutil extraction, SQLite ring-buffer buffering, and strict allow-list sanitization.
          </p>
        </div>

        {/* Watchdog Status Pill */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Watchdog Timeout</span>
            <span className="text-xs font-bold text-cyan-400">15 Seconds</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Offline Resilience</span>
            <span className="text-xs font-bold text-emerald-400">SQLite Durable Buffer</span>
          </div>
        </div>
      </div>

      {/* Fleet Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Total Enrolled Nodes</span>
          <span className="text-2xl font-extrabold text-white mono-font">{collectors.length}</span>
          <span className="text-xs text-slate-400 block mt-1">Tier-1 Private Perimeter</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Online & Reporting</span>
          <span className="text-2xl font-extrabold text-emerald-400 mono-font">
            {collectors.filter(c => c.status === "ONLINE").length}
          </span>
          <span className="text-xs text-slate-400 block mt-1">Real-time Stream Connected</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Stale / Disconnected</span>
          <span className="text-2xl font-extrabold text-slate-400 mono-font">
            {collectors.filter(c => c.status === "STALE" || c.status === "OFFLINE").length}
          </span>
          <span className="text-xs text-slate-400 block mt-1">15s Stale Watchdog</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Local Edge Port</span>
          <span className="text-2xl font-extrabold text-cyan-400 mono-font">:8001</span>
          <span className="text-xs text-slate-400 block mt-1">FastAPI / HTTP Server</span>
        </div>
      </div>

      {/* Fleet Table */}
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
                <th className="py-3 px-3">SEQUENCE</th>
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
                      c.health_state === 'POOR' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      c.health_state === 'FAIR' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {c.health_state}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{c.sampling_mode}</td>
                  <td className="py-3 px-3 text-cyan-300 font-bold">#{c.sequence}</td>
                  <td className="py-3 px-3 text-slate-400">
                    {c.lastSeenAt ? new Date(c.lastSeenAt).toLocaleTimeString() : 'Just now'}
                  </td>
                </tr>
              ))}
              {collectors.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No collectors reporting yet. Ensure <code>python server.py</code> is running on port 8001.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
