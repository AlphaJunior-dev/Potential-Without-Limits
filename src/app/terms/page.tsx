"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  const { legalSecurity } = useAuth();

  return (
    <div className="min-h-screen bg-[#050814] font-inter text-white py-12 px-4 sm:px-6 lg:px-8 bg-gallery-pattern">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-[#F28482] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exhibition Grid</span>
        </Link>

        <div className="bg-[#121A36] p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#050814] text-[#F28482] border border-[#F28482]/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-white">
                Terms of Service &amp; Corporate Platform Use
              </h1>
              <p className="text-xs text-white/60">
                Institutional Governance • Last Updated: {legalSecurity?.lastUpdated || "2026-08-01"}
              </p>
            </div>
          </div>

          <div className="prose prose-invert prose-sm text-white/80 space-y-4 whitespace-pre-wrap leading-relaxed">
            {legalSecurity?.termsContent}
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Legal Framework
            </span>
            <Link href="/book-a-call" className="text-[#F28482] font-bold hover:underline">
              Book a Corporate Vetting Call →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
