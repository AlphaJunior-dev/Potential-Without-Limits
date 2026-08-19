"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Heart, CheckCircle2, Users, FileCheck, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#051836]/10 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 border-b border-[#051836]/10 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-[#051836]">
                Safeguarding &amp; Privacy Standards
              </h1>
              <p className="text-xs text-[#051836]/60 mt-1">
                Potential Without Limits International Foundation (PWLIF) • Ethical Governance &amp; Privacy Protocol
              </p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-[#051836]/85 leading-relaxed font-inter">
            {/* Section 1: Controlled publication */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#005C27] font-montserrat font-bold text-base">
                <FileCheck className="w-5 h-5" />
                <h2>1. Controlled Publication</h2>
              </div>
              <p className="text-xs text-[#051836]/80 leading-relaxed">
                {legalSecurity.securityStandardsContent}
              </p>
            </div>

            {/* Section 2: Respectful representation */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#005C27] font-montserrat font-bold text-base">
                <Eye className="w-5 h-5" />
                <h2>2. Respectful Representation</h2>
              </div>
              <p className="text-xs text-[#051836]/80 leading-relaxed">
                PWLIF does not publish sensationalized or unnecessary personal information. Sponsor Talent information is shared only when it is appropriate, respectful, and explicitly enabled through the field-level publication controls.
              </p>
            </div>

            {/* Section 3: Privacy and controlled contact */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#005C27] font-montserrat font-bold text-base">
                <Lock className="w-5 h-5" />
                <h2>3. Zero Direct Unmonitored Contact</h2>
              </div>
              <p className="text-xs text-[#051836]/80 leading-relaxed">
                The public site does not expose direct contact channels, private addresses, or unnecessary identifying details. Sponsor access is considered only after an orientation call, manual approval, and a secure email-link invitation.
              </p>
            </div>

            {/* Section 4: Data minimisation */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#005C27] font-montserrat font-bold text-base">
                <Users className="w-5 h-5" />
                <h2>4. Data Minimisation</h2>
              </div>
              <p className="text-xs text-[#051836]/80 leading-relaxed">
                PWLIF limits public information to the minimum appropriate Sponsor Talent details. Individual record visibility can be reviewed, edited, or withdrawn by authorised administrators at any time.
              </p>
            </div>

            {/* Section 5: Appropriate information scope */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#005C27] font-montserrat font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <h2>5. Appropriate Information Scope</h2>
              </div>
              <p className="text-xs text-[#051836]/80 leading-relaxed">
                Financial contributions, tax receipts, and transparency reports are not provided through this website or sponsor portal. Appropriate partnership information is discussed through private, review-based conversations.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#051836]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#051836]/60">
            <span className="flex items-center gap-1.5 font-bold text-[#005C27]">
              <ShieldCheck className="w-4 h-4 text-[#005C27]" />
              Safeguarding &amp; Privacy Framework • PWLIF
            </span>
            <Link href="/book-a-call" className="text-[#005C27] font-bold hover:underline">
              Schedule Sponsor Orientation Call →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
