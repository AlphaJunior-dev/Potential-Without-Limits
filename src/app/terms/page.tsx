"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  const { legalSecurity } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] py-12 px-4 sm:px-6 lg:px-8 bg-foundation-pattern">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#051836]/70 hover:text-[#005C27] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#051836]/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-[#051836]/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-[#051836]">
                Terms of Service &amp; Platform Governance
              </h1>
              <p className="text-xs text-[#051836]/60">
                Institutional Governance • Last Updated: {legalSecurity?.lastUpdated || "2026-08-01"}
              </p>
            </div>
          </div>

          <div className="prose prose-sm text-[#051836]/80 space-y-4 whitespace-pre-wrap leading-relaxed">
            {legalSecurity?.termsContent}
          </div>

          <div className="pt-6 border-t border-[#051836]/10 flex items-center justify-between text-xs text-[#051836]/60">
            <span className="flex items-center gap-1 font-semibold text-[#005C27]">
              <ShieldCheck className="w-4 h-4 text-[#005C27]" />
              Verified Legal Framework
            </span>
            <Link href="/support" className="text-[#005C27] font-bold hover:underline">
              Contact Support Concierge →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
