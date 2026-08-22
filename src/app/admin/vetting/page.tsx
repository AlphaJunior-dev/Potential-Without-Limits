"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AdminMfaModal } from "@/components/AdminMfaModal";
import { 
  CheckCircle2, 
  ExternalLink, 
  Filter, 
  Building2, 
  ShieldCheck, 
  Clock, 
  XCircle,
  ArrowLeft
} from "lucide-react";

export default function AdminVettingPage() {
  const { 
    pendingSponsors, 
    approveSponsor, 
    rejectSponsor, 
    mfaVerified, 
    verifyMfa, 
    adminRole, 
    setAdminRole 
  } = useAuth();

  const [vettingStatusFilter, setVettingStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [logs, setLogs] = useState<Array<{ id: string; msg: string; time: string }>>([
    { id: "vlog-1", msg: "Hope for Tomorrow Foundation approved as Verified Partner", time: "2026-07-27 16:20" },
    { id: "vlog-2", msg: "Sunrise Education Trust approved as Verified Partner", time: "2026-07-26 11:05" },
  ]);

  if (!mfaVerified) {
    return <AdminMfaModal onVerify={verifyMfa} />;
  }

  const filteredSponsors = pendingSponsors.filter((s) => {
    if (vettingStatusFilter === "all") return true;
    return s.status === vettingStatusFilter;
  });

  return (
    <div className="min-h-screen bg-[#FCFCFA] font-inter text-[#0B2E6B] pb-16 bg-foundation-pattern">
      {/* Admin Top Header */}
      <header className="bg-white text-[#0B2E6B] px-6 py-4 border-b border-[#0B2E6B]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-[#0B2E6B]/60 hover:text-[#0B2E6B] transition">
            <ArrowLeft className="w-5 h-5 text-[#079432]" />
          </Link>
          <div className="flex items-center gap-3">
            <img src="/pwlif-logo.png" alt="PWLIF" className="h-8 w-auto object-contain" />
            <div>
              <h1 className="font-montserrat font-bold text-lg tracking-tight text-[#0B2E6B]">
                Sponsor Vetting &amp; Onboarding
              </h1>
              <p className="text-xs text-[#0B2E6B]/60">
                Review incoming orientation-call bookings, verify credentials, and provision sponsor accounts.
              </p>
            </div>
          </div>
        </div>

        {/* RBAC Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#0B2E6B]/60 uppercase tracking-wider">
            RBAC Role:
          </span>
          <select
            value={adminRole}
            onChange={(e) => setAdminRole(e.target.value as "Super Admin" | "Vetting Officer" | "Curator")}
            className="bg-[#F8FAFC] text-[#0B2E6B] text-xs font-bold py-1.5 px-3 rounded-md border border-[#0B2E6B]/15 focus:outline-none focus:border-[#079432]"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Vetting Officer">Vetting Officer</option>
            <option value="Curator">Talent Curator</option>
          </select>
          <span className="bg-[#079432]/10 text-[#079432] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#079432]/20 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#079432]" /> Verified Session
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-4 border-b border-[#0B2E6B]/10 pb-4 text-xs font-semibold uppercase tracking-wider">
          <Link href="/admin" className="text-[#0B2E6B]/60 hover:text-[#079432]">
            Admin Portal
          </Link>
          <span className="text-[#0B2E6B]/30">&gt;</span>
          <span className="text-[#079432] font-bold">Sponsor Vetting</span>
          <span className="text-[#0B2E6B]/30">&gt;</span>
          <Link href="/admin/talent" className="text-[#0B2E6B]/60 hover:text-[#079432]">
            Talent Directory
          </Link>
        </div>

        {/* Vetting Table Card */}
        <div className="bg-white rounded-2xl border border-[#0B2E6B]/10 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-[#0B2E6B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-montserrat font-bold text-lg text-[#0B2E6B] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#079432]" />
                <span>Foundation Sponsor Applications Queue</span>
              </h2>
              <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                Review sponsor background verification, LinkedIn profiles, and grant authorization status.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#0B2E6B]/40" />
              <select
                value={vettingStatusFilter}
                onChange={(e) => setVettingStatusFilter(e.target.value as "all" | "pending" | "approved" | "rejected")}
                className="bg-[#F8FAFC] border border-[#0B2E6B]/15 text-xs font-medium py-1.5 px-3 rounded-lg text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
              >
                <option value="pending">Pending Approval ({pendingSponsors.filter(s => s.status === 'pending').length})</option>
                <option value="approved">Approved Sponsors ({pendingSponsors.filter(s => s.status === 'approved').length})</option>
                <option value="rejected">Rejected</option>
                <option value="all">All Applications ({pendingSponsors.length})</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#0B2E6B]/10 text-[11px] font-bold uppercase tracking-wider text-[#0B2E6B]/60">
                  <th className="py-3 px-6">Representative &amp; Email</th>
                  <th className="py-3 px-6">Organization / Foundation</th>
                  <th className="py-3 px-6">Category &amp; Tier</th>
                  <th className="py-3 px-6">LinkedIn Verification</th>
                  <th className="py-3 px-6">Registration Date</th>
                  <th className="py-3 px-6 text-right">Approval Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B2E6B]/10 text-xs">
                {filteredSponsors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#0B2E6B]/50">
                      No sponsor applications matching current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSponsors.map((sponsor) => (
                    <tr key={sponsor.id} className="hover:bg-[#F8FAFC] transition">
                      <td className="py-4 px-6 font-bold text-[#0B2E6B]">
                        {sponsor.name}
                        <div className="text-[11px] font-mono text-[#0B2E6B]/60 font-normal">{sponsor.email}</div>
                      </td>
                      <td className="py-4 px-6 text-[#0B2E6B]/80 font-semibold">
                        {sponsor.company || "Independent Sponsor"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="bg-[#079432]/10 text-[#079432] text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit">
                            {sponsor.sponsorCategory || "Child Sponsor"}
                          </span>
                          <span className="bg-[#F7B500]/15 text-[#0B2E6B] text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit">
                            {sponsor.membershipTier || "Gold Tier"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={sponsor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#079432] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          LinkedIn Profile <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-4 px-6 text-[#0B2E6B]/50 font-mono text-[11px]">
                        {sponsor.createdAt}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {sponsor.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  await approveSponsor(sponsor.id);
                                  setLogs([{ id: "vlog-" + Date.now(), msg: `${sponsor.name} approved`, time: new Date().toLocaleTimeString() }, ...logs]);
                                } catch {
                                  setLogs([{ id: "vlog-" + Date.now(), msg: `Failed to approve ${sponsor.name} — check connection`, time: new Date().toLocaleTimeString() }, ...logs]);
                                }
                              }}
                              className="bg-[#079432] hover:bg-[#14B84A] text-white px-3.5 py-1.5 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Provision Sponsor Account
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await rejectSponsor(sponsor.id);
                                } catch {
                                  setLogs([{ id: "vlog-" + Date.now(), msg: `Failed to reject ${sponsor.name} — check connection`, time: new Date().toLocaleTimeString() }, ...logs]);
                                }
                              }}
                              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-red-200"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        ) : sponsor.status === "approved" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#079432] bg-[#079432]/10 px-2.5 py-1 rounded-full border border-[#079432]/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active &amp; Approved
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#0B2E6B]/40 italic">Application Rejected</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Box */}
        <div className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-xs space-y-4">
          <h3 className="font-montserrat font-bold text-sm text-[#0B2E6B]">
            Sponsor Vetting Activity Log
          </h3>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#0B2E6B]/10 text-xs flex justify-between text-[#0B2E6B]">
                <span>✓ {log.msg}</span>
                <span className="text-[10px] text-[#0B2E6B]/50 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
