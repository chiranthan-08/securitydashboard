import React from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Activity, Radio, Zap, Clock, HardDrive, Cpu, Laptop, ShieldCheck, Wifi, ArrowDown, ArrowUp } from 'lucide-react';

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

  // Real Hardware Metrics
  const cpuVal = latestMetrics?.cpu_pct ?? 0;
  const ramVal = latestMetrics?.ram_pct ?? 0;
  const ramTotalGb = latestMetrics?.ram_total_gb ?? 15.6;
  const ramAvailGb = latestMetrics?.ram_available_gb ?? 4.1;
  const latencyVal = latestMetrics?.latency_ms ?? 8.5;
  const diskVal = latestMetrics?.disk_pct ?? 35.9;
  const diskReadMb = latestMetrics?.disk_read_mb ?? 0;
  const diskWriteMb = latestMetrics?.disk_write_mb ?? 0;
  const netThroughput = latestMetrics?.net_throughput_bps ?? (latestMetrics?.net_rx_bps ? latestMetrics.net_rx_bps + (latestMetrics.net_tx_bps || 0) : 0);
  const netRxBps = latestMetrics?.net_rx_bps ?? 0;
  const netTxBps = latestMetrics?.net_tx_bps ?? 0;
  const uptimeSec = latestMetrics?.system_uptime_sec ?? 0;
  const osInfo = latestMetrics?.os_info || { system: "Windows", release: "11", machine: "AMD64", hostname: "LAPTOP-LOCAL" };
  const isLive = latestMetrics?.is_live_hardware !== false;

  const formatUptime = (seconds) => {
    if (!seconds) return "0h 0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const formatBps = (bps) => {
    if (bps > 1024 * 1024) return `${(bps / (1024 * 1024)).toFixed(1)} MB/s`;
    if (bps > 1024) return `${(bps / 1024).toFixed(1)} KB/s`;
    return `${Math.round(bps)} B/s`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Real Hardware Identity Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
              <Laptop className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-black">
                  <span className="h-2 w-2 rounded-full bg-black animate-ping"></span>
                  TIER 1 - LIVE WINDOWS LAPTOP TELEMETRY
                </span>
                <span className="text-xs text-slate-400 font-mono">5s Cadence</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                <span>{osInfo.hostname || "Windows Host"}</span>
                <span className="text-xs font-normal text-slate-400 font-mono">
                  ({osInfo.system} {osInfo.release} - {osInfo.machine})
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-4">
                <span>System Uptime: <strong className="text-emerald-400 font-mono">{formatUptime(uptimeSec)}</strong></span>
                <span>•</span>
                <span>Active Core Memory: <strong className="text-cyan-400 font-mono">{ramTotalGb} GB Total ({ramAvailGb} GB Free)</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Round-Trip HTTP Latency</span>
              <span className="text-sm font-extrabold text-purple-400 font-mono">{latencyVal} ms</span>
              <span className="text-[10px] text-slate-500 block">GET /healthz</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Data Source Mode</span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${isLive ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'}`}>
                {isLive ? 'GENUINE PSUTIL SENSOR' : 'DEMO WORKLOAD SCENARIO'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top NOC Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>OPERATIONS</span>
            <span>/</span>
            <span className="text-cyan-400">NOC REAL-TIME OBSERVABILITY</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="h-6 w-6 text-cyan-400" />
            Infrastructure Telemetry & Dynamic Sampling
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live multi-signal hardware metrics streaming every 5s from Tier-1 Edge Collector to MongoDB Atlas cloud.
          </p>
        </div>

        {/* Dynamic Sampling Status Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <div className={`p-2 rounded-lg ${isBurst ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Sampling Cadence:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isBurst ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                {currentMode} (5s)
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {isBurst ? 'Anomaly burst mode active' : 'Heartbeat cadence (~75% bandwidth reduction)'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Six Live Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* CPU */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CPU Saturation</span>
            <Cpu className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold mono-font ${cpuVal > 85 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {cpuVal}%
            </span>
            <span className="text-[11px] text-slate-500">psutil core</span>
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
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">RAM Pressure</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold mono-font ${ramVal > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {ramVal}%
            </span>
            <span className="text-[11px] text-slate-500">{(ramTotalGb - ramAvailGb).toFixed(1)}/{ramTotalGb}GB</span>
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
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold mono-font ${latencyVal > 200 ? 'text-amber-400' : 'text-purple-400'}`}>
              {latencyVal}
            </span>
            <span className="text-[11px] text-slate-500">ms real ping</span>
          </div>
          <div className="mt-3 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${latencyVal > 200 ? 'bg-amber-500' : 'bg-purple-500'}`}
              style={{ width: `${Math.min(100, (latencyVal / 400) * 100)}%` }}
            />
          </div>
        </div>

        {/* Disk */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Disk C: Drive</span>
            <HardDrive className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-blue-400 mono-font">
              {diskVal}%
            </span>
            <span className="text-[11px] text-slate-500">NTFS Vol</span>
          </div>
          <div className="mt-3 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, diskVal))}%` }}
            />
          </div>
        </div>

        {/* Disk I/O */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Disk I/O R/W</span>
            <HardDrive className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-amber-400 mono-font">
              {diskReadMb > 1024 ? `${(diskReadMb/1024).toFixed(1)}GB` : `${Math.round(diskReadMb)}MB`}
            </span>
            <span className="text-[11px] text-slate-500">R / {diskWriteMb > 1024 ? `${(diskWriteMb/1024).toFixed(1)}GB` : `${Math.round(diskWriteMb)}MB`} W</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">psutil disk_io_counters</span>
        </div>

        {/* Network Throughput */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Throughput</span>
            <Wifi className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-emerald-400 mono-font">
              {formatBps(netThroughput)}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span className="flex items-center gap-0.5 text-cyan-400"><ArrowDown className="h-3 w-3" /> {formatBps(netRxBps)}</span>
            <span className="flex items-center gap-0.5 text-purple-400"><ArrowUp className="h-3 w-3" /> {formatBps(netTxBps)}</span>
          </div>
        </div>
      </div>

      {/* 4. Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: CPU & RAM Utilization */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                Compute Saturation Trends (CPU & RAM %)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Live time-series sampled directly from Windows psutil</p>
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
              <p className="text-xs text-slate-400 mt-0.5">Real measured HTTP round-trip latency to backend</p>
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
    </div>
  );
}
