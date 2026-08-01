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
    { id: "vlog-1", msg: "Sophia Martinez approved as Verified Partner", time: "2026-07-27 16:20" },
    { id: "vlog-2", msg: "David Chen approved as Verified Partner", time: "2026-07-26 11:05" },
  ]);

  if (!mfaVerified) {
    return <AdminMfaModal onVerify={verifyMfa} />;
  }

  const filteredSponsors = pendingSponsors.filter((s) => {
    if (vettingStatusFilter === "all") return true;
    return s.status === vettingStatusFilter;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-inter text-[#0A1128] pb-16">
      {/* Admin Top Header */}
      <header className="bg-[#0A1128] text-white px-6 py-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white/60 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-montserrat font-bold text-lg tracking-wider">
              Sponsor Vetting &amp; Approvals
            </h1>
            <p className="text-xs text-white/60">
              Review corporate LinkedIn registrations &amp; grant portfolio access
            </p>
          </div>
        </div>

        {/* RBAC Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
            RBAC Role:
          </span>
          <select
            value={adminRole}
            onChange={(e) => setAdminRole(e.target.value as any)}
            className="bg-white/10 text-white text-xs font-bold py-1.5 px-3 rounded-md border border-white/20"
          >
            <option value="Super Admin" className="bg-[#0A1128]">Super Admin</option>
            <option value="Vetting Officer" className="bg-[#0A1128]">Vetting Officer</option>
            <option value="Curator" className="bg-[#0A1128]">Talent Curator</option>
          </select>
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Session
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-4 border-b border-[#0A1128]/10 pb-4 text-xs font-semibold uppercase tracking-wider">
          <Link href="/admin" className="text-[#0A1128]/60 hover:text-[#0A1128]">
            Control Center
          </Link>
          <span className="text-[#0A1128]/30">&gt;</span>
          <span className="text-[#F28482] font-bold">Vetting Queue</span>
          <span className="text-[#0A1128]/30">&gt;</span>
          <Link href="/admin/talent" className="text-[#0A1128]/60 hover:text-[#0A1128]">
            Talent CMS
          </Link>
        </div>

        {/* Vetting Table Card */}
        <div className="bg-white rounded-2xl border border-[#0A1128]/5 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#0A1128]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-montserrat font-bold text-lg text-[#0A1128] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#F28482]" />
                <span>Pending Corporate Sponsor Applications</span>
              </h2>
              <p className="text-xs text-[#0A1128]/60 mt-0.5">
                Verify mandatory LinkedIn credentials prior to granting raw media unlock rights.
              </p>
            </div>

            {/* Filter Selector */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#0A1128]/40" />
              <select
                value={vettingStatusFilter}
                onChange={(e) => setVettingStatusFilter(e.target.value as any)}
                className="bg-[#FAFAFA] border border-[#0A1128]/10 text-xs font-medium py-1.5 px-3 rounded-lg text-[#0A1128]"
              >
                <option value="pending">Pending Queue Only ({pendingSponsors.filter(s => s.status === "pending").length})</option>
                <option value="approved">Approved Partners ({pendingSponsors.filter(s => s.status === "approved").length})</option>
                <option value="rejected">Rejected</option>
                <option value="all">All Submissions</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#0A1128]/5 text-[11px] font-bold uppercase tracking-wider text-[#0A1128]/60">
                  <th className="py-3.5 px-6">Applicant Name</th>
                  <th className="py-3.5 px-6">Corporate Email</th>
                  <th className="py-3.5 px-6">LinkedIn Verification</th>
                  <th className="py-3.5 px-6">Registration Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A1128]/5 text-xs">
                {filteredSponsors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#0A1128]/50">
                      No sponsor applications matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSponsors.map((sponsor) => (
                    <tr key={sponsor.id} className="hover:bg-[#FAFAFA]/60 transition">
                      <td className="py-4 px-6 font-bold text-[#0A1128]">
                        {sponsor.name}
                      </td>
                      <td className="py-4 px-6 text-[#0A1128]/70">
                        {sponsor.email}
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={sponsor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#F28482] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <span>{sponsor.linkedin}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                      <td className="py-4 px-6 text-[#0A1128]/50">
                        {sponsor.createdAt}
                      </td>
                      <td className="py-4 px-6">
                        {sponsor.status === "approved" ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Approved
                          </span>
                        ) : sponsor.status === "rejected" ? (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {sponsor.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                approveSponsor(sponsor.id);
                                setLogs((prev) => [
                                  {
                                    id: "vlog-" + Date.now(),
                                    msg: `Approved ${sponsor.name} (${sponsor.email})`,
                                    time: new Date().toISOString().replace("T", " ").split(".")[0],
                                  },
                                  ...prev,
                                ]);
                              }}
                              className="bg-[#F28482] hover:brightness-105 text-white px-3.5 py-1.5 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify &amp; Approve</span>
                            </button>
                            <button
                              onClick={() => rejectSponsor(sponsor.id)}
                              className="text-red-600 hover:text-red-800 font-semibold px-2 py-1 text-xs cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#0A1128]/40 italic">
                            Action Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Log History */}
        <div className="bg-white p-6 rounded-2xl border border-[#0A1128]/5 shadow-xs space-y-4">
          <h3 className="font-montserrat font-bold text-sm text-[#0A1128]">
            Vetting Action Audit Log
          </h3>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="p-3 rounded-lg bg-[#FAFAFA] border border-[#0A1128]/5 text-xs flex justify-between">
                <span>{log.msg}</span>
                <span className="text-[10px] text-[#0A1128]/40 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
