"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { WlpLogo, WlpLogoMark } from "@/components/WlpLogo";
import { Target, Compass, ShieldCheck, ArrowRight, Award, Lock, Sparkles } from "lucide-react";

export default function MissionVisionPage() {
  const { missionVision } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] bg-foundation-pattern py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block mb-2">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits Foundation"
              className="h-16 w-auto mx-auto object-contain"
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005C27]/10 border border-[#005C27]/20 text-[#005C27] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#005C27]" />
            <span>Core Foundation &amp; Guiding Principles</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-[#051836]">
            Our Mission &amp; Vision
          </h1>
          <p className="font-inter text-base sm:text-lg text-[#051836]/70 max-w-2xl mx-auto leading-relaxed">
            Unlocking youth potential in underserved communities worldwide through direct grants, child dream sponsorship, and transparent humanitarian stewardship.
          </p>
        </div>

        {/* Mission & Vision Side-by-Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#051836]/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#005C27]" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20">
                  <Target className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#051836]/40">
                  Primary Directive
                </span>
              </div>

              <h2 className="font-montserrat text-2xl font-black text-[#051836] mb-4">
                Our Mission
              </h2>

              <p className="text-sm sm:text-base text-[#051836]/80 leading-relaxed font-medium">
                &quot;{missionVision?.mission}&quot;
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#051836]/10 text-xs text-[#051836]/50 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#005C27]" /> Verified Governance
              </span>
              <span>Updated {missionVision?.lastUpdated || "2026-08-01"}</span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-[#051836] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#051836]/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#F5AB00]" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-white/10 text-[#F5AB00] border border-white/15">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                  Long-Term Horizon
                </span>
              </div>

              <h2 className="font-montserrat text-2xl font-black text-white mb-4">
                Our Vision
              </h2>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium">
                &quot;{missionVision?.vision}&quot;
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-white/60 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#F5AB00]" /> Child Safety Standard
              </span>
              <span>Global Community Impact</span>
            </div>
          </div>
        </div>

        {/* Founder's Letter Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#005C27]/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 border-2 border-[#005C27]">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Founder"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
                A Message from the Executive Director
              </span>
              <h3 className="font-montserrat font-bold text-xl text-[#051836]">
                Letter from the Founder
              </h3>
              <p className="text-xs text-[#051836]/60">
                {missionVision?.foundersTitle || "Founder & Executive Director"}
              </p>
            </div>
          </div>

          <div className="prose prose-sm text-[#051836]/80 space-y-4 leading-relaxed font-serif italic border-t border-[#051836]/10 pt-6">
            &quot;{missionVision?.foundersNote}&quot;
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-montserrat text-xs font-bold uppercase tracking-widest text-[#005C27] mb-1">
              Humanitarian Pillars
            </h3>
            <h4 className="font-montserrat text-2xl sm:text-3xl font-black text-[#051836]">
              The Pillars of PWLIF Impact
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-inter">
            <div className="bg-white p-7 rounded-2xl border border-[#051836]/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#005C27]/10 text-[#005C27] flex items-center justify-center font-montserrat font-black text-xs border border-[#005C27]/20">
                  01
                </div>
                <Award className="w-4 h-4 text-[#005C27]" />
              </div>
              <h5 className="font-montserrat font-bold text-base text-[#051836]">
                100% Parent Consent &amp; Safety
              </h5>
              <p className="text-xs text-[#051836]/70 leading-relaxed">
                Ensuring absolute child protection and verified parental consent records for every child dream profile in our system.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[#051836]/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#005C27]/10 text-[#005C27] flex items-center justify-center font-montserrat font-black text-xs border border-[#005C27]/20">
                  02
                </div>
                <Award className="w-4 h-4 text-[#005C27]" />
              </div>
              <h5 className="font-montserrat font-bold text-base text-[#051836]">
                Direct Hardware &amp; Education Grants
              </h5>
              <p className="text-xs text-[#051836]/70 leading-relaxed">
                Transforming donor contributions into laptops, software licenses, tuition grants, and community learning center infrastructure.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[#051836]/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#005C27]/10 text-[#005C27] flex items-center justify-center font-montserrat font-black text-xs border border-[#005C27]/20">
                  03
                </div>
                <Award className="w-4 h-4 text-[#005C27]" />
              </div>
              <h5 className="font-montserrat font-bold text-base text-[#051836]">
                Transparent Impact Reporting
              </h5>
              <p className="text-xs text-[#051836]/70 leading-relaxed">
                Providing sponsors with verified quarterly updates on child milestone progress and financial grant allocation.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-[#051836] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl border border-[#005C27]/30 relative overflow-hidden">
          <h3 className="font-montserrat text-2xl sm:text-4xl font-black">
            Ready to Empower a Child&apos;s Bright Future?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            Schedule a 15-minute sponsor orientation call to explore child dream adoption or program sponsorship categories.
          </p>
          <div className="pt-2">
            <Link
              href="/book-a-call"
              className="bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3.5 px-8 rounded-xl transition shadow-lg inline-flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <span>Schedule Sponsor Orientation</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
