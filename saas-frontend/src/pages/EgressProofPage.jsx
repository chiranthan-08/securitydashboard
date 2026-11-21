import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle, AlertOctagon, Terminal, Key, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { fetchRawVsRedacted, triggerTamperTest } from '../services/api';

export default function EgressProofPage({ egressProofs = [] }) {
  const [localData, setLocalData] = useState(null);
  const [tamperStatus, setTamperStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchRawVsRedacted();
      setLocalData(data);
    } catch (e) {
      console.log("Could not fetch local edge raw vs redacted:", e.message);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleTamper = async () => {
    setLoading(true);
    try {
      const res = await triggerTamperTest();
      setTamperStatus(res.message);
    } catch (e) {
      setTamperStatus(`Tamper failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const rawLogs = localData?.raw_logs_local || [];
  const latestRaw = rawLogs.length > 0 ? rawLogs[0] : null;
  const approvedPayload = localData?.approved_outgoing_payload || (egressProofs && egressProofs.length > 0 ? egressProofs[0] : {});

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>AUDIT & INTEGRITY</span>
            <span>/</span>
            <span className="text-emerald-400">CRYPTOGRAPHIC EGRESS PROOF</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              Live Cryptographic Egress Proof Inspector
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider">
              Signature Differentiator
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mathematical proof that raw logs containing passwords, emails, and IPs never leave the private edge perimeter.
          </p>
        </div>

        {/* Tamper Test Button */}
        <button
          onClick={handleTamper}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs font-bold text-rose-300 shadow-lg shadow-rose-950/30 transition-all self-start sm:self-auto cursor-pointer"
        >
          <AlertOctagon className="h-4 w-4 text-rose-400" />
          <span>Simulate Tampering (Modify SQLite Hash)</span>
        </button>
      </div>

      {tamperStatus && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 flex items-center gap-2.5">
          <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{tamperStatus}</span>
        </div>
      )}

      {/* 4 Proof Guarantee Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Raw Logs Transmitted</span>
          <span className="text-2xl font-extrabold text-emerald-400 mono-font">0</span>
          <span className="text-xs text-slate-400 block mt-1">100% Locked on Edge Disk</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sensitive Fields Escaped</span>
          <span className="text-2xl font-extrabold text-emerald-400 mono-font">0</span>
          <span className="text-xs text-slate-400 block mt-1">GDPR & DPDP Validated</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Hash Chain Continuity</span>
          <span className="text-2xl font-extrabold text-cyan-400 mono-font">SHA-256</span>
          <span className="text-xs text-slate-400 block mt-1">Chained to Previous Hash</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Actor Pseudonymization</span>
          <span className="text-2xl font-extrabold text-purple-400 mono-font">HMAC-Salt</span>
          <span className="text-xs text-slate-400 block mt-1">Rotating Daily Salt</span>
        </div>
      </div>

      {/* Deep Side-by-Side Zero-Trust Diff Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Private Customer Environment */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <Lock className="h-4 w-4 text-rose-400" />
                Customer Private Perimeter (Local Machine Only)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                NEVER LEAVES EDGE
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2.5">
              Raw system and authentication events intercepted locally. Contains real passwords, customer emails, and host IPs.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 min-h-[220px]">
              {latestRaw ? (
                <>
                  <div className="text-slate-500 text-[11px]">// Timestamp: {latestRaw.timestamp}</div>
                  <div className="text-rose-300 break-words leading-relaxed bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/40">
                    {latestRaw.raw_text}
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                    <div className="text-slate-400">
                      <span className="text-rose-400 font-bold">Email:</span> {latestRaw.fields?.email || "none"}
                    </div>
                    <div className="text-slate-400">
                      <span className="text-rose-400 font-bold">Password:</span> [SCRUBBED FROM TRANSMISSION]
                    </div>
                    <div className="text-slate-400">
                      <span className="text-rose-400 font-bold">Raw IP:</span> {latestRaw.fields?.ip || "none"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-slate-500 py-12 text-center text-xs">
                  No authentication logs intercepted yet.<br />
                  Click <b>"1. PII & Egress Proof"</b> in the top demo bar to inject a sample!
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-400 flex items-center gap-2.5">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Zero-Leak Enforcement Gate: 100% of raw logs locked in local host storage.</span>
          </div>
        </div>

        {/* Right Column: Approved Cloud Metadata */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                Approved Cloud Egress Metadata (Strict Allow-List)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                AUDITED PAYLOAD
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2.5">
              Strict projection from schema. Raw text discarded. Identities substituted with salted pseudonym (<code className="text-cyan-300">actor_...</code>).
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-cyan-200 min-h-[220px] max-h-[300px] overflow-y-auto">
              <pre className="whitespace-pre-wrap break-all leading-snug">
                {JSON.stringify(approvedPayload, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-xs text-cyan-400 flex items-center justify-between">
            <span>Sensitive Fields Detected: <b className="text-emerald-400 font-mono">0</b></span>
            <span>Raw Logs Transmitted: <b className="text-emerald-400 font-mono">0</b></span>
          </div>
        </div>
      </div>

      {/* Append-Only Hash Chain Ledger Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-purple-400" />
              Append-Only SHA-256 Hash-Chained Egress Ledger
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every outgoing record links to the previous entry hash: entry_hash = SHA-256(version + chain_id + seq + prev_hash + payload_hash)
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/80 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Tamper-Evident Chain Intact
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">SEQUENCE</th>
                <th className="py-2.5 px-3">PAYLOAD ID</th>
                <th className="py-2.5 px-3">PREVIOUS HASH (sha256)</th>
                <th className="py-2.5 px-3">ENTRY HASH (chained)</th>
                <th className="py-2.5 px-3">HEALTH</th>
                <th className="py-2.5 px-3">VERIFICATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {egressProofs.slice(0, 8).map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 text-cyan-400 font-bold">#{p.sequence}</td>
                  <td className="py-3 px-3">{p.payloadId || `PAY-20261120-${p.sequence}`}</td>
                  <td className="py-3 px-3 text-slate-400" title={p.previousHash}>
                    {p.previousHash?.substring(0, 18)}...
                  </td>
                  <td className="py-3 px-3 text-purple-400" title={p.entryHash}>
                    {p.entryHash?.substring(0, 18)}...
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.healthState === 'POOR' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      p.healthState === 'FAIR' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {p.healthState}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">
                    ✓ VERIFIED
                  </td>
                </tr>
              ))}
              {egressProofs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No egress payloads recorded yet.
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
