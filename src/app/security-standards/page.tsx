"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, ShieldCheck, Cpu } from "lucide-react";

export default function SecurityStandardsPage() {
  const { legalSecurity } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] py-12 px-4 sm:px-6 lg:px-8 bg-foundation-pattern">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#051836]/70 hover:text-[#005C27] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Foundation Homepage</span>
        </Link>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#051836]/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-[#051836]/10 pb-4">
            <div className="w-12 h-12 rounded-xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-[#051836]">
                Child Protection &amp; Data Security Standards
              </h1>
              <p className="text-xs text-[#051836]/60">
                Child Safety Audit &amp; Consent Verification • Last Updated: {legalSecurity?.lastUpdated || "2026-08-01"}
              </p>
            </div>
          </div>

          <div className="prose prose-sm text-[#051836]/80 space-y-4 whitespace-pre-wrap leading-relaxed font-inter">
            {legalSecurity?.securityStandardsContent}
          </div>

          <div className="pt-6 border-t border-[#051836]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#051836]/60">
            <span className="flex items-center gap-1.5 font-bold text-[#005C27]">
              <ShieldCheck className="w-4 h-4 text-[#005C27]" />
              Rigorous Child Safety &amp; 100% Parent Consent Verification
            </span>
            <Link href="/book-a-call" className="text-[#005C27] font-bold hover:underline">
              Schedule Sponsor Orientation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

