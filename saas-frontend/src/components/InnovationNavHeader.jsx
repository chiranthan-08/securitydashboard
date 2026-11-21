import React from 'react';
import {
  ShieldAlert,
  Flame,
  Layers,
  Link2,
  Cpu,
  GitFork,
  Sliders,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const INNOVATION_PAGES = [
  { id: "feat_guardian", num: 1, name: "AI Privacy Guardian", short: "1. Guardian", icon: ShieldAlert, color: "text-cyan-400", border: "border-cyan-500/40" },
  { id: "feat_canary", num: 2, name: "Canary Honeytokens", short: "2. Honeytokens", icon: Flame, color: "text-amber-400", border: "border-amber-500/40" },
  { id: "feat_adaptive", num: 3, name: "Adaptive Privacy", short: "3. Adaptive", icon: Layers, color: "text-purple-400", border: "border-purple-500/40" },
  { id: "feat_ledger", num: 4, name: "Tamper Egress Ledger", short: "4. Tamper Ledger", icon: Link2, color: "text-emerald-400", border: "border-emerald-500/40" },
  { id: "feat_fingerprint", num: 5, name: "Collector Fingerprinting", short: "5. Fingerprint", icon: Cpu, color: "text-blue-400", border: "border-blue-500/40" },
  { id: "feat_graph", num: 6, name: "Attack Correlation Graph", short: "6. Attack Graph", icon: GitFork, color: "text-rose-400", border: "border-rose-500/40" },
  { id: "feat_sandbox", num: 7, name: "Policy Simulator", short: "7. Sandbox", icon: Sliders, color: "text-sky-400", border: "border-sky-500/40" },
  { id: "feat_remediation", num: 8, name: "Reversible Remediation", short: "8. Remediation", icon: RotateCcw, color: "text-teal-400", border: "border-teal-500/40" },
];

export default function InnovationNavHeader({ activePage, setActivePage }) {
  const currentIndex = INNOVATION_PAGES.findIndex(p => p.id === activePage);
  const current = INNOVATION_PAGES[currentIndex] || INNOVATION_PAGES[0];

  const prevPage = currentIndex > 0 ? INNOVATION_PAGES[currentIndex - 1] : null;
  const nextPage = currentIndex < INNOVATION_PAGES.length - 1 ? INNOVATION_PAGES[currentIndex + 1] : null;

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6 backdrop-blur-md">
      {/* Top row: Header, current status & Prev/Next */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shrink-0">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                INNOVATION SUITE &bull; FEATURE {current.num} OF 8
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                Independent Innovation Page
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white mt-0.5 flex items-center gap-2">
              <current.icon className={`h-4 w-4 ${current.color}`} />
              {current.name}
            </h2>
          </div>
        </div>

        {/* Previous and Next Navigation Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {prevPage ? (
            <button
              onClick={() => setActivePage(prevPage.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title={`Go to Feature ${prevPage.num}: ${prevPage.name}`}
            >
              <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
              <span>Prev: #{prevPage.num}</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl border border-transparent text-xs text-slate-600 cursor-not-allowed select-none">
              Start
            </span>
          )}

          {nextPage ? (
            <button
              onClick={() => setActivePage(nextPage.id)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              title={`Go to Feature ${nextPage.num}: ${nextPage.name}`}
            >
              <span>Next: #{nextPage.num} {nextPage.short.replace(/^\d+\.\s*/, '')}</span>
              <ChevronRight className="h-3.5 w-3.5 text-black" />
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-500 cursor-not-allowed select-none">
              Last Feature
            </span>
          )}
        </div>
      </div>

      {/* 8-Feature Horizontal Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-3">
        {INNOVATION_PAGES.map((page) => {
          const isActive = page.id === activePage;
          const Icon = page.icon;
          return (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? `bg-slate-900 text-white ${page.border} ring-2 ring-emerald-500/30 shadow-lg`
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  #{page.num}
                </span>
                <Icon className={`h-3 w-3 ${isActive ? page.color : 'text-slate-500'}`} />
              </div>
              <span className="text-[11px] font-bold truncate leading-tight">
                {page.short.replace(/^\d+\.\s*/, '')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
