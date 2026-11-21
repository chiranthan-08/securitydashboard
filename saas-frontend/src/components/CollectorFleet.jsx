import React from 'react';
import { Server, CheckCircle2, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export default function CollectorFleet({ collectors = [] }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Server className="h-5 w-5 text-cyan-400" />
            Edge Collectors Fleet Inventory
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            All distributed customer edge nodes reporting through strict allow-listed cryptographic channels.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 px-3">COLLECTOR ID</th>
              <th className="py-2.5 px-3">CHAIN ID</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">HEALTH STATE</th>
              <th className="py-2.5 px-3">SAMPLING MODE</th>
              <th className="py-2.5 px-3">SEQUENCE</th>
              <th className="py-2.5 px-3">LAST SEEN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {collectors.map((c, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30">
                <td className="py-3 px-3 text-cyan-400 font-bold">{c.collectorId}</td>
                <td className="py-3 px-3 text-purple-400">{c.chain_id || 'CHAIN-COL-001'}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    c.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.health_state === 'POOR' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    c.health_state === 'FAIR' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {c.health_state}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-300">{c.sampling_mode}</td>
                <td className="py-3 px-3 text-cyan-300 font-bold">#{c.sequence}</td>
                <td className="py-3 px-3 text-slate-400">{c.lastSeenAt ? new Date(c.lastSeenAt).toLocaleTimeString() : 'Just now'}</td>
              </tr>
            ))}
            {collectors.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">
                  No collectors detected. Start the Python local collector agent on port 8001.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
