import React, { useState } from 'react';
import { Play, Flame, ShieldAlert, Cpu, RotateCcw, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { triggerSimulation } from '../services/api';

export default function DemoControlBar({ onTriggerComplete }) {
  const [activeScenario, setActiveScenario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const scenarios = [
    {
      id: "pii_login",
      title: "1. PII & Egress Proof",
      badge: "Scenario 1",
      icon: ShieldAlert,
      color: "hover:border-purple-500/50 hover:bg-purple-950/20 text-purple-400"
    },
    {
      id: "cpu_spike",
      title: "2. Sudden CPU Spike (96%)",
      badge: "Scenario 2",
      icon: Cpu,
      color: "hover:border-amber-500/50 hover:bg-amber-950/20 text-amber-400"
    },
    {
      id: "latency_spike",
      title: "3. Latency Spike (485ms)",
      badge: "Scenario 3",
      icon: Flame,
      color: "hover:border-rose-500/50 hover:bg-rose-950/20 text-rose-400"
    },
    {
      id: "correlated_exhaustion",
      title: "5. Multi-Signal Cascade",
      badge: "Scenario 5",
      icon: Play,
      color: "hover:border-cyan-500/50 hover:bg-cyan-950/20 text-cyan-400"
    }
  ];

  const handleRun = async (scenarioId) => {
    setLoading(true);
    setActiveScenario(scenarioId);
    try {
      const res = await triggerSimulation(scenarioId);
      setNotice(res.message || `Executed scenario: ${scenarioId}`);
      if (onTriggerComplete) onTriggerComplete();
    } catch (err) {
      setNotice(`Trigger failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    setActiveScenario(null);
    try {
      const res = await triggerSimulation("reset");
      setNotice("System baseline restored to normal healthy operation.");
      if (onTriggerComplete) onTriggerComplete();
    } catch (err) {
      setNotice(`Reset failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
      {/* Top Header of Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Evaluation & Judging Scenario Triggers
            </span>
            <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">
              Deterministic injection for the 5 hackathon rubric scenarios
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Reset Baseline</span>
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Buttons */}
      {expanded && (
        <div className="p-3 bg-slate-950/40">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {scenarios.map((s) => {
              const Icon = s.icon;
              const isSelected = activeScenario === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleRun(s.id)}
                  disabled={loading}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${s.color} ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 ring-2 ring-cyan-500/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-950 shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">{s.badge}</span>
                    <span className="text-xs font-bold text-slate-200 block truncate">{s.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {notice && (
            <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="truncate">{notice}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
