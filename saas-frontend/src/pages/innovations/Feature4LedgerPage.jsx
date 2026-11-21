import React, { useState, useEffect } from 'react';
import InnovationNavHeader from '../../components/InnovationNavHeader';
import {
  Link2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Maximize2,
  Workflow,
  Lock,
  Cpu,
  Key
} from 'lucide-react';
import {
  fetchPrivacyShieldOverview,
  tamperShieldLedger,
  resetShieldLedger
} from '../../services/api';

export default function Feature4LedgerPage({ setActivePage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [imageZoom, setImageZoom] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetchPrivacyShieldOverview();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTamper = async () => {
    setActionLoading(true);
    try {
      const res = await tamperShieldLedger();
      setToast({
        type: 'danger',
        title: 'Tamper Simulation Executed!',
        msg: res.message || '1 byte maliciously altered in block #3. SHA-256 hash mismatch detected.'
      });
      loadData();
    } catch (err) {
      setToast({ type: 'error', title: 'Error', msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetLedger = async () => {
    setActionLoading(true);
    try {
      const res = await resetShieldLedger();
      setToast({
        type: 'success',
        title: 'Cryptographic Chain Healed!',
        msg: res.message || 'All SHA-256 hash chains verified intact.'
      });
      loadData();
    } catch (err) {
      setToast({ type: 'error', title: 'Error', msg: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const isTampered = data?.tamperLedger?.tamperedDetected || false;
  const blocks = data?.tamperLedger?.blocks || [];

  return (
    <div className="space-y-6">
      {/* 1. Global Innovation Stepper Header */}
      <InnovationNavHeader activePage="feat_ledger" setActivePage={setActivePage} />

      {/* Toast Alert */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
          toast.type === 'error' ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' :
          toast.type === 'danger' ? 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-xl shadow-rose-950/50' :
          'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
        }`}>
          <div>
            <strong className="block font-bold text-sm">{toast.title}</strong>
            <span className="mt-0.5 block">{toast.msg}</span>
          </div>
          <button onClick={() => setToast(null)} className="px-2.5 py-1 rounded bg-black/40 hover:bg-black/60 font-bold ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Hero Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold text-[10px] tracking-wider uppercase">
                FEATURE 4 &bull; CRYPTOGRAPHIC PROOF
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-300 font-bold text-[10px] border border-emerald-900">
                SHA-256 HASH CHAINING
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                HMAC SIGNED AUDIT
              </span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <Link2 className="h-7 w-7 text-emerald-400" />
              Cryptographic Tamper-Evident Egress Ledger
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Every approved transmission generates a unique payload hash chained to preceding transactions using SHA-256 and signed with HMAC. If an attacker, rogue collector, or insider modifies a payload in transit or alters the audit history, the chain breaks immediately.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTamper}
              disabled={actionLoading || isTampered}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-rose-600/20 disabled:opacity-50"
            >
              Maliciously Alter 1 Byte
            </button>
            <button
              onClick={handleResetLedger}
              disabled={actionLoading || !isTampered}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              Restore &amp; Verify Chain
            </button>
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Architecture Design Section (Image + Visual Blueprint) */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
              ARCHITECTURE DESIGN BLUEPRINT &bull; FEATURE 4
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Workflow className="h-4 w-4 text-emerald-400" />
              SHA-256 Blockchain Ledger with HMAC Verification Architecture
            </h3>
          </div>
          <button
            onClick={() => setImageZoom(!imageZoom)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>{imageZoom ? 'Standard View' : 'Enlarge Blueprint'}</span>
          </button>
        </div>

        {/* Blueprint Photograph from User */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className={`${imageZoom ? 'lg:col-span-12' : 'lg:col-span-7'} transition-all`}>
            <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-900 shadow-2xl group">
              <img
                src="/architectures/feature4-ledger.jpg"
                alt="Feature 4 Architecture: Tamper-Evident Egress Ledger"
                className="w-full object-contain max-h-[460px] bg-slate-950 transition-transform duration-300 group-hover:scale-[1.02] p-2"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="font-semibold text-emerald-300">
                  Architecture 4: Tamper-Evident Ledger &bull; Records every transmission with cryptographic proof
                </span>
                <span className="font-mono text-[10px] text-slate-400">Specification: Architecture Design</span>
              </div>
            </div>
          </div>

          {!imageZoom && (
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                  CRYPTOGRAPHIC CHAINING MECHANISM
                </span>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <div>
                      <strong className="text-white block">Payload Normalization &amp; Hashing</strong>
                      <span className="text-slate-400 text-[11px]">Approved telemetry serialized to deterministic JSON. SHA-256 digest generated: <code>H(Payload)</code>.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <div>
                      <strong className="text-white block">Hash Chaining to Preceding Block</strong>
                      <span className="text-slate-400 text-[11px]">Block #N includes <code>Previous_Hash</code> from Block #N-1, creating an immutable cryptographic chain.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <div>
                      <strong className="text-white block">HMAC Collector Signature</strong>
                      <span className="text-slate-400 text-[11px]">Collector signs block with local HMAC private secret. Sent out-of-band to SaaS.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                    <div>
                      <strong className="text-white block">SaaS Receipt Verification</strong>
                      <span className="text-slate-400 text-[11px]">Centralized SaaS platform recalculates hash and validates chain sequence. Zero possibility of silent tampering.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
                isTampered
                  ? 'bg-rose-950/30 border-rose-500/60 text-rose-300'
                  : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              }`}>
                {isTampered ? (
                  <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0 animate-bounce" />
                ) : (
                  <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
                )}
                <div>
                  <strong className="block font-bold">
                    {isTampered ? 'CRITICAL TAMPER DETECTED: HASH CHAIN BROKEN' : 'CRYPTOGRAPHIC CHAIN INTACT & VERIFIED'}
                  </strong>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {isTampered
                      ? 'Hash mismatch at Block #3. Signature verification failed!'
                      : 'All payload hashes match preceding block cryptographic signatures.'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. In-Depth Technical Information (The Problem, The Proposed Improvement, Why Valuable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> Existing Approach
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Most observability tools offer a simple <em>Egress Proof Panel</em> that displays payloads about to be transmitted.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            However, a plain JSON viewer lacks tamper-resistance: an attacker with local root access can modify logs after transmission or alter audit trails undetected.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5" /> Your Proposed Improvement
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Create a cryptographically verifiable ledger of every approved transmission:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside text-[11px]">
            <li>Generate unique payload ID for each egress frame.</li>
            <li>Calculate cryptographic hash using SHA-256.</li>
            <li>Sign hash using HMAC-based authentication secret.</li>
            <li>Chain successive blocks: <code>Hash(Current + Prev_Hash)</code>.</li>
            <li>Verify payload at SaaS receiving end.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> Why this is valuable for Judges
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            If an insider or adversary modifies even a single byte of telemetry or tries to delete audit records, the verification process flags a <strong>Signature / Hash Mismatch</strong>.
          </p>
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
            <strong>Live Judging Proof:</strong>
            <p>Click "Maliciously Alter 1 Byte" to break block #3 live in front of the judges, then restore it with 1 click.</p>
          </div>
        </div>
      </div>

      {/* 5. Live Interactive SHA-256 Blockchain Ledger Table */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
              BLOCKCHAIN AUDIT TRAIL &bull; LIVE LEDGER
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Link2 className="h-4 w-4 text-emerald-400" />
              Cryptographic Chained Blocks &amp; Verification Status
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {blocks.length} Blocks Chained
          </span>
        </div>

        {/* Chained Blocks Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Block #</th>
                <th className="p-3">Payload ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Previous SHA-256 Hash</th>
                <th className="p-3">Current SHA-256 Hash</th>
                <th className="p-3">Cryptographic Status</th>
                <th className="p-3">Policy Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {blocks.map((b) => {
                const isBad = b.verification === "TAMPERED_MISMATCH";
                return (
                  <tr key={b.blockNum} className={isBad ? 'bg-rose-950/30' : 'hover:bg-slate-900/40'}>
                    <td className="p-3 font-extrabold text-white">#{b.blockNum}</td>
                    <td className="p-3 text-cyan-400 font-bold">{b.payloadId}</td>
                    <td className="p-3 text-slate-400 text-xs">{new Date(b.timestamp).toLocaleTimeString()}</td>
                    <td className="p-3 text-slate-400 truncate max-w-xs" title={b.prevHash}>{b.prevHash}</td>
                    <td className="p-3 text-emerald-300 font-bold truncate max-w-xs" title={b.currHash}>{b.currHash}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                        isBad ? 'bg-rose-500 text-black animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {b.verification}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                        {b.policyDecision}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
