import React from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Activity, Radio, Zap, Clock } from 'lucide-react';

export default function TelemetryCharts({ telemetry = [], latestMetrics = {} }) {
  // Format data for Recharts safely
  const safeTelemetry = Array.isArray(telemetry) ? telemetry : [];
  const formatToLocalTime = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    } catch {
      return isoString;
    }
  };

  const chartData = safeTelemetry.length > 0
    ? safeTelemetry.map((t, idx) => ({
        time: t.timestamp_utc ? formatToLocalTime(t.timestamp_utc) : (t.metrics?.local_time || `t-${idx}`),
        cpu: Number(t.metrics?.cpu_pct) || 0,
        ram: Number(t.metrics?.ram_pct) || 0,
        latency: Number(t.metrics?.latency_ms) || 0,
        samplingMode: t.sampling_mode || "HEARTBEAT"
      }))
    : [{ time: "00:00:00", cpu: 0, ram: 0, latency: 0, samplingMode: "HEARTBEAT" }];

  const currentMode = safeTelemetry.length > 0 ? safeTelemetry[safeTelemetry.length - 1]?.sampling_mode : "HEARTBEAT";
  const isBurst = currentMode === "ANOMALY_BURST" || currentMode === "HIGH_FREQ_BURST";

  return (
    <div className="space-y-4">
      {/* Sampling Mode Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isBurst ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dynamic Sampling Mode:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isBurst ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                {currentMode}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isBurst
                ? "Anomaly Trigger Active: Transmitting full diagnostic telemetry burst (every 2s) for deep root cause."
                : "Heartbeat Efficiency Mode: Transmitting compact summary (savings: ~75% cloud bandwidth & storage costs)."}
            </p>
          </div>
        </div>

        {/* Current Metrics Mini Ticker */}
        <div className="flex items-center gap-4 text-xs mono-font">
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400">CPU:</span>{" "}
            <span className={latestMetrics?.cpu_pct > 80 ? "text-rose-400 font-bold" : "text-cyan-400 font-bold"}>
              {latestMetrics?.cpu_pct || 0}%
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400">RAM:</span>{" "}
            <span className={latestMetrics?.ram_pct > 80 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {latestMetrics?.ram_pct || 0}%
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400">LATENCY:</span>{" "}
            <span className={latestMetrics?.latency_ms > 200 ? "text-amber-400 font-bold" : "text-purple-400 font-bold"}>
              {latestMetrics?.latency_ms || 0}ms
            </span>
          </div>
        </div>
      </div>

      {/* Two Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: CPU & RAM Utilization */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-cyan-400" />
              Compute Resources (CPU & Memory %)
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span> CPU %
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> RAM %
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1329", borderColor: "#1e293b", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#cpuGrad)" />
                <Area type="monotone" dataKey="ram" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#ramGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Network Latency */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-purple-400" />
              Network Latency & SLA Response (ms)
            </span>
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span> Latency ms
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 600]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1329", borderColor: "#1e293b", fontSize: 12 }}
                />
                <Line type="monotone" dataKey="latency" stroke="#a855f7" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
