"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Heart, CheckCircle2, Users, FileCheck, Eye } from "lucide-react";

export default function SecurityStandardsPage() {
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
                Child Protection &amp; Safeguarding Standards
              </h1>
              <p className="text-xs text-[#051836]/60 mt-1">
                Potential Without Limits International Foundation (PWLIF) • Ethical Governance &amp; Privacy Protocol
              </p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-[#051836]/85 leading-relaxed font-inter">
            {/* Section 1: Informed Consent */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#005C27] font-montserrat font-bold text-base">
                <FileCheck className="w-5 h-5" />
                <h2>1. 100% Informed Parental &amp; Guardian Consent</h2>
              </div>
              <p className="text-xs text-[#051836]/80 leading-relaxed">
                Before any child or youth dreamer is featured on the PWLIF platform, our foundation officers conduct in-person community visits to secure written, informed consent from parents or legal guardians. Consent forms cover photograph/video publishing, academic progress sharing, and talent showcase permissions. Guardians retain the right to modify or withdraw media consent at any time.
              </p>
            </div>

            {/* Section 2: Child Dignity & Anti-Exploitation */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#005C27] font-montserrat font-bold text-base">
                <Eye className="w-5 h-5" />
                <h2>2. Child Dignity &amp; Anti-Exploitation Policy</h2>
              </div>
              <p className="text-xs text-[#051836]/80 leading-relaxed">
                PWLIF strictly prohibits "poverty pornography" or sensationalized portrayals of vulnerable children. All profile narratives highlight the child&apos;s inherent potential, talents, academic ambitions, and resilience. Children are depicted with dignity, respect, and agency, focusing on constructive pathways toward self-reliance.
              </p>
            </div>

            {/* Section 3: Privacy & Zero Unmonitored Contact */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#005C27] font-montserrat font-bold text-base">
                <Lock className="w-5 h-5" />
                <h2>3. Zero Direct Unmonitored Contact</h2>
              </div>
              <p className="text-xs text-[#051836]/80 leading-relaxed">
                To prevent grooming, exploitation, or privacy violations, sponsors are never permitted direct unmonitored communication with sponsored youth. All messages, grant proposals, and progress updates are routed through authorized PWLIF safeguarding officers. Last names, physical street addresses, and exact school locations are redacted from public view.
              </p>
            </div>

            {/* Section 4: Inclusive Safeguarding */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#005C27] font-montserrat font-bold text-base">
                <Users className="w-5 h-5" />
                <h2>4. Active Inclusion of Marginalized &amp; Vulnerable Youth</h2>
              </div>
              <p className="text-xs text-[#051836]/80 leading-relaxed">
                PWLIF actively enforces inclusive selection criteria to ensure equal access for young girls, children living with disabilities, refugees, displaced youth, and marginalized rural communities across East Africa, starting in Ethiopia. Special accommodation grants provide adaptive learning tools, assistive technology, and psychosocial counseling.
              </p>
            </div>

            {/* Section 5: Financial Stewardship & Auditability */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#005C27] font-montserrat font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <h2>5. Financial Transparency &amp; Grant Auditing</h2>
              </div>
              <p className="text-xs text-[#051836]/80 leading-relaxed">
                100% of direct sponsorship grants are disbursed through verified educational institutions, equipment suppliers, or community learning centers with itemized receipt tracking. Independent annual financial audits ensure full stewardship transparency for sponsors and partner foundations.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#051836]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#051836]/60">
            <span className="flex items-center gap-1.5 font-bold text-[#005C27]">
              <ShieldCheck className="w-4 h-4 text-[#005C27]" />
              Verified Safeguarding Framework • PWLIF Ethics Board
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
