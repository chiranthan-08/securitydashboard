import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DemoControlBar from './components/DemoControlBar';

// Core Pages
import TelemetryPage from './pages/TelemetryPage';
import AIEnginePage from './pages/AIEnginePage';
import EgressProofPage from './pages/EgressProofPage';
import IncidentsPage from './pages/IncidentsPage';
import BenchmarksPage from './pages/BenchmarksPage';
import FleetPage from './pages/FleetPage';
import PrivacyPage from './pages/PrivacyPage';
import PrivacyShieldPage from './pages/PrivacyShieldPage';

// 8 Dedicated Innovation Feature Pages
import Feature1GuardianPage from './pages/innovations/Feature1GuardianPage';
import Feature2CanaryPage from './pages/innovations/Feature2CanaryPage';
import Feature3AdaptivePage from './pages/innovations/Feature3AdaptivePage';
import Feature4LedgerPage from './pages/innovations/Feature4LedgerPage';
import Feature5FingerprintPage from './pages/innovations/Feature5FingerprintPage';
import Feature6AttackGraphPage from './pages/innovations/Feature6AttackGraphPage';
import Feature7PolicySimulatorPage from './pages/innovations/Feature7PolicySimulatorPage';
import Feature8RemediationPage from './pages/innovations/Feature8RemediationPage';

import {
  fetchOverview,
  fetchTelemetry,
  fetchIncidents,
  fetchAlerts,
  fetchEgressProof,
  fetchCollectors
} from './services/api';
import { switchSocketTenant } from './services/socket';
import { RefreshCw, Sparkles, Shield } from 'lucide-react';

const VALID_PAGES = [
  "feat_guardian",
  "feat_canary",
  "feat_adaptive",
  "feat_ledger",
  "feat_fingerprint",
  "feat_graph",
  "feat_sandbox",
  "feat_remediation",
  "privacyshield",
  "telemetry",
  "ai_engine",
  "egress",
  "incidents",
  "benchmarks",
  "fleet",
  "privacy"
];

function getInitialPage() {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.replace('/', '').toLowerCase();
    const hash = window.location.hash.replace('#', '').replace('/', '').toLowerCase();
    const search = new URLSearchParams(window.location.search).get('page');
    const cand = path || hash || search;
    if (cand && VALID_PAGES.includes(cand)) {
      return cand;
    }
  }
  return "feat_guardian";
}

export default function App() {
  const [tenantId, setTenantId] = useState("TENANT-FINTECH-01");
  const [activePage, setActivePage] = useState(getInitialPage);

  const navigateToPage = (page) => {
    setActivePage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page;
    }
  };

  const [overview, setOverview] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [egressProofs, setEgressProofs] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [isLive, setIsLive] = useState(false);

  // Load all tenant-scoped data
  const loadTenantData = useCallback(async () => {
    try {
      const [ov, tel, inc, al, eg, col] = await Promise.all([
        fetchOverview(tenantId).catch(() => null),
        fetchTelemetry(tenantId, 30).catch(() => []),
        fetchIncidents(tenantId).catch(() => []),
        fetchAlerts(tenantId).catch(() => []),
        fetchEgressProof(tenantId).catch(() => ({ proofs: [] })),
        fetchCollectors(tenantId).catch(() => [])
      ]);

      if (ov) setOverview(ov);
      if (tel) setTelemetry(tel);
      if (inc) setIncidents(inc);
      if (al) setAlerts(al);
      if (eg?.proofs) setEgressProofs(eg.proofs);
      if (col) setCollectors(col);
    } catch (err) {
      console.log("Error loading dashboard data:", err);
    }
  }, [tenantId]);

  // Handle Tenant Switching & WebSocket connection
  useEffect(() => {
    loadTenantData();
    const socket = switchSocketTenant(tenantId);

    const onConnect = () => setIsLive(true);
    const onDisconnect = () => setIsLive(false);

    const onTelemetry = (record) => {
      if (!record) return;
      setTelemetry((prev) => [...prev.slice(-29), record]);
      setOverview((prev) => prev ? {
        ...prev,
        latestMetrics: record.metrics || prev.latestMetrics,
        overallHealth: record.health_state || prev.overallHealth
      } : null);
    };

    const onIncident = (newInc) => {
      if (!newInc) return;
      setIncidents((prev) => {
        const filtered = prev.filter(i => i.id !== newInc.id);
        return [newInc, ...filtered];
      });
      loadTenantData();
    };

    const onRemediationUpdate = () => {
      loadTenantData();
    };

    if (socket) {
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("telemetry_update", onTelemetry);
      socket.on("incident_created", onIncident);
      socket.on("remediation_started", onRemediationUpdate);
      socket.on("remediation_resolved", onRemediationUpdate);
      setIsLive(socket.connected);
    }

    // Fallback polling interval every 2.5s for seamless real-time updates
    const pollInterval = setInterval(loadTenantData, 2500);

    return () => {
      if (socket) {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("telemetry_update", onTelemetry);
        socket.off("incident_created", onIncident);
        socket.off("remediation_started", onRemediationUpdate);
        socket.off("remediation_resolved", onRemediationUpdate);
      }
      clearInterval(pollInterval);
    };
  }, [tenantId, loadTenantData]);

  const activeIncidentsCount = incidents.filter(i => i.status === "ACTIVE").length;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={navigateToPage}
        incidentsCount={activeIncidentsCount}
        collectorsCount={collectors.length}
        tenantId={tenantId}
        setTenantId={setTenantId}
        isLive={isLive}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar with Quick Nav Switcher */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-slate-400">ORGANIZATION:</span>
            <span className="text-xs font-extrabold text-white bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
              {overview?.tenantName || tenantId}
            </span>
          </div>

          {/* Top Quick Page Navigation Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {/* Quick 8-Feature Dropdown or Hub Pill */}
            <button
              onClick={() => navigateToPage("feat_guardian")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                activePage.startsWith("feat_")
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md font-extrabold'
                  : 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>8 Innovations Pages</span>
            </button>

            {[
              { id: "telemetry", name: "📊 NOC Telemetry" },
              { id: "ai_engine", name: "🧠 AIOps Engine" },
              { id: "egress", name: "🛡️ Egress Proof" },
              { id: "incidents", name: "🚨 Incidents", badge: activeIncidentsCount > 0 ? activeIncidentsCount : null },
              { id: "benchmarks", name: "⏱️ Benchmarks" },
              { id: "fleet", name: "🖥️ Fleet" },
              { id: "privacy", name: "🔒 Privacy" }
            ].map(tab => {
              const isActive = activePage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigateToPage(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-md font-extrabold'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.name}</span>
                  {tab.badge && !isActive && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500 text-white font-extrabold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadTenantData}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh Current Telemetry"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Sticky/Pinned Interactive Demo Control Bar */}
          <DemoControlBar onTriggerComplete={loadTenantData} />

          {/* 8 Dedicated Innovation Pages */}
          {activePage === "feat_guardian" && (
            <Feature1GuardianPage setActivePage={navigateToPage} />
          )}

          {activePage === "feat_canary" && (
            <Feature2CanaryPage setActivePage={navigateToPage} />
          )}

          {activePage === "feat_adaptive" && (
            <Feature3AdaptivePage setActivePage={navigateToPage} />
          )}

          {activePage === "feat_ledger" && (
            <Feature4LedgerPage setActivePage={navigateToPage} />
          )}

          {activePage === "feat_fingerprint" && (
            <Feature5FingerprintPage setActivePage={navigateToPage} />
          )}

          {activePage === "feat_graph" && (
            <Feature6AttackGraphPage setActivePage={navigateToPage} />
          )}

          {activePage === "feat_sandbox" && (
            <Feature7PolicySimulatorPage setActivePage={navigateToPage} />
          )}

          {activePage === "feat_remediation" && (
            <Feature8RemediationPage setActivePage={navigateToPage} />
          )}

          {/* Unified Hub (Fallback/Reference) */}
          {activePage === "privacyshield" && (
            <PrivacyShieldPage />
          )}

          {/* Core NOC Pages */}
          {activePage === "telemetry" && (
            <TelemetryPage
              telemetry={telemetry}
              latestMetrics={overview?.latestMetrics}
            />
          )}

          {activePage === "ai_engine" && (
            <AIEnginePage
              tenantId={tenantId}
            />
          )}

          {activePage === "egress" && (
            <EgressProofPage
              egressProofs={egressProofs}
            />
          )}

          {activePage === "incidents" && (
            <IncidentsPage
              incidents={incidents}
              tenantId={tenantId}
              onRemediateSuccess={loadTenantData}
            />
          )}

          {activePage === "benchmarks" && (
            <BenchmarksPage
              tenantId={tenantId}
            />
          )}

          {activePage === "fleet" && (
            <FleetPage
              collectors={collectors}
            />
          )}

          {activePage === "privacy" && (
            <PrivacyPage />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/60 py-4 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CICADA 2026 Sentinel • Two-Tier Zero-Trust AIOps Observability Architecture</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px]">
                SHA-256 Chained • Strict Allow-List • SQLite Outbox •
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-mono text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                MongoDB Atlas Connected
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
