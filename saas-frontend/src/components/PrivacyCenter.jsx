import React from 'react';
import { Shield, Lock, FileCheck, CheckCircle2, ShieldCheck, Database, Key } from 'lucide-react';

export default function PrivacyCenter() {
  const allowedFields = [
    { field: "payload_id", type: "string", rule: "Formatted UUID/timestamp sequence identifier" },
    { field: "sequence_num", type: "integer", rule: "Monotonic strictly increasing counter" },
    { field: "tenant_id", type: "string", rule: "Cryptographically bound tenant identifier" },
    { field: "source_id", type: "string", rule: "Pseudonymous edge collector identifier" },
    { field: "timestamp_utc", type: "ISO-8601", rule: "UTC event timestamp without local host timezone leaks" },
    { field: "sampling_mode", type: "enum", rule: "HEARTBEAT | STANDARD_SUMMARY | HIGH_FREQ_BURST | ANOMALY_BURST" },
    { field: "health_state", type: "enum", rule: "EXCELLENT | GOOD | FAIR | POOR" },
    { field: "metrics", type: "object", rule: "Bounded numerical values: CPU%, RAM%, Disk%, Latency (ms)" },
    { field: "security_summary", type: "object", rule: "Hashed actor pseudonym (HMAC-SHA256) & failure counts ONLY" },
    { field: "egress_audit", type: "object", rule: "SHA-256 payload & previous chain hashes. raw_logs_transmitted: 0" }
  ];

  const blockedItems = [
    { name: "Customer & Employee Emails", status: "BLOCKED AT EDGE", method: "Regex regex_email filter -> dropped" },
    { name: "Raw Passwords & Credentials", status: "BLOCKED AT EDGE", method: "Key pattern matching -> [REDACTED_SECRET]" },
    { name: "API Keys & Bearer Tokens", status: "BLOCKED AT EDGE", method: "Authorization header scrubbing -> dropped" },
    { name: "Raw Source / Destination IPs", status: "BLOCKED AT EDGE", method: "Substituted with pseudonymous HMAC token" },
    { name: "Application Free-form Log Bodies", status: "LOCKED LOCALLY", method: "Zero raw log transmission policy" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Zero-Trust Privacy Guard & Compliance Center
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict recursive allow-listing, regex redaction, and salted actor pseudonymization enforced inside the customer boundary.
            </p>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">GDPR Art. 32 Ready</span>
              <span className="text-[10px] text-slate-400">Zero PII transmission to cloud</span>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">HIPAA Compliant</span>
              <span className="text-[10px] text-slate-400">ePHI scrubbed before network serialization</span>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">DPDP Act 2023</span>
              <span className="text-[10px] text-slate-400">Cryptographically verifiable zero-leak proof</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Blocked Categories */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Lock className="h-4 w-4 text-rose-400" />
            Guaranteed Blocked / Scrubbed Data Fields
          </span>
          <div className="space-y-2">
            {blockedItems.map((b, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="text-white font-medium block">{b.name}</span>
                  <span className="text-[10px] text-slate-400">{b.method}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strict Allow-list Schema */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <FileCheck className="h-4 w-4 text-cyan-400" />
            Strict Outgoing Schema Allow-List (Contracts)
          </span>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {allowedFields.map((f, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-bold">{f.field}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{f.type}</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">{f.rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
