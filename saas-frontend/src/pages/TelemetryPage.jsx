import React from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Activity, Radio, Zap, Clock, HardDrive, ArrowUpRight, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

export default function TelemetryPage({ telemetry = [], latestMetrics = {} }) {
  const safeTelemetry = Array.isArray(telemetry) ? telemetry : [];
  const chartData = safeTelemetry.length > 0
    ? safeTelemetry.map((t, idx) => ({
        time: t.timestamp_utc ? t.timestamp_utc.split('T')[1]?.replace('Z', '') : `t-${idx}`,
        cpu: Number(t.metrics?.cpu_pct) || 0,
        ram: Number(t.metrics?.ram_pct) || 0,
        latency: Number(t.metrics?.latency_ms) || 0,
        disk: Number(t.metrics?.disk_pct) || 36,
        samplingMode: t.sampling_mode || "HEARTBEAT"
      }))
    : [{ time: "00:00:00", cpu: 0, ram: 0, latency: 0, disk: 36, samplingMode: "HEARTBEAT" }];

  const currentMode = safeTelemetry.length > 0 ? safeTelemetry[safeTelemetry.length - 1]?.sampling_mode : "HEARTBEAT";
  const isBurst = currentMode === "ANOMALY_BURST" || currentMode === "HIGH_FREQ_BURST";

  const cpuVal = latestMetrics?.cpu_pct ?? 0;
  const ramVal = latestMetrics?.ram_pct ?? 0;
  const latencyVal = latestMetrics?.latency_ms ?? 0;
  const diskVal = latestMetrics?.disk_pct ?? 36;

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>OPERATIONS</span>
            <span>/</span>
            <span className="text-cyan-400">NOC LIVE TELEMETRY</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="h-6 w-6 text-cyan-400" />
            Infrastructure Telemetry & Dynamic Sampling
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-signal host metrics with rolling Z-score anomaly detection and adaptive cadence.
          </p>
        </div>

        {/* Dynamic Sampling Status Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <div className={`p-2 rounded-lg ${isBurst ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Sampling Policy:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isBurst ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                {currentMode}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {isBurst ? 'Bursting full diagnostics every 2s' : 'Heartbeat mode (~75% cloud bandwidth savings)'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CPU Utilization</span>
            <Cpu className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold mono-font ${cpuVal > 85 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {cpuVal}%
            </span>
            <span className="text-xs text-slate-500">of 8 Cores</span>
          </div>
          <div className="mt-3 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cpuVal > 85 ? 'bg-rose-500' : 'bg-cyan-500'}`}
              style={{ width: `${Math.min(100, Math.max(5, cpuVal))}%` }}
            />
          </div>
        </div>

        {/* RAM */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Memory Pressure</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold mono-font ${ramVal > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {ramVal}%
            </span>
            <span className="text-xs text-slate-500">Virtual Memory</span>
          </div>
          <div className="mt-3 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${ramVal > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, Math.max(5, ramVal))}%` }}
            />
          </div>
        </div>

        {/* Latency */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Service Latency</span>
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold mono-font ${latencyVal > 200 ? 'text-amber-400' : 'text-purple-400'}`}>
              {latencyVal}
            </span>
            <span className="text-xs text-slate-500">ms (SLA: &lt;80ms)</span>
          </div>
          <div className="mt-3 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${latencyVal > 200 ? 'bg-amber-500' : 'bg-purple-500'}`}
              style={{ width: `${Math.min(100, (latencyVal / 500) * 100)}%` }}
            />
          </div>
        </div>

        {/* Disk */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Storage Volume</span>
            <HardDrive className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-400 mono-font">
              {diskVal}%
            </span>
            <span className="text-xs text-slate-500">Root FS</span>
          </div>
          <div className="mt-3 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, diskVal))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Charts Section (Large, Spacious) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: CPU & RAM Utilization */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                Compute Saturation Trends (CPU & RAM %)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Rolling time-series sampled directly via psutil</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span> CPU %
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span> RAM %
              </span>
            </div>
          </div>

          <div className="w-full">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1329", borderColor: "#1e293b", fontSize: 12, borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#cpuGrad)" />
                <Area type="monotone" dataKey="ram" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#ramGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Network Latency */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                Network Latency & Response SLA (ms)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Threshold warning at &gt;200ms, critical breach at &gt;400ms</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-400"></span> Latency ms
            </div>
          </div>

          <div className="w-full">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 550]} stroke="#64748b" tick={{ fontSize: 10 }} unit="ms" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1329", borderColor: "#1e293b", fontSize: 12, borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="latency" stroke="#a855f7" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dynamic Sampling Efficiency Breakdown Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          Dynamic Sampling Protocol & Cost Reduction Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-400 font-bold block mb-1">NORMAL STATE (Heartbeat):</span>
            <p className="text-slate-300 leading-relaxed">
              When health is <b>EXCELLENT</b> or <b>GOOD</b>, transmits compact 1-line heartbeat summaries. Reduces cloud ingestion and egress bandwidth by up to <b>75%</b>.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-400 font-bold block mb-1">ANOMALY TRIGGER (Burst):</span>
            <p className="text-slate-300 leading-relaxed">
              When Z-score &gt; 2.5 or health drops to <b>FAIR / POOR</b>, switches to <b>ANOMALY_BURST</b> mode at 2s intervals with full diagnostic metadata.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-slate-400 font-bold block mb-1">HYSTERESIS & COOLDOWN:</span>
            <p className="text-slate-300 leading-relaxed">
              Requires 6 consecutive healthy samples and a 60s dwell period before returning to HEARTBEAT, preventing rapid flapping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
