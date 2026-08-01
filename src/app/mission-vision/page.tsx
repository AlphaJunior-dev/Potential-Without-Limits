"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { WlpLogo, WlpLogoMark } from "@/components/WlpLogo";
import { Target, Compass, ShieldCheck, ArrowRight, Award, Lock } from "lucide-react";

export default function MissionVisionPage() {
  const { missionVision } = useAuth();

  return (
    <div className="min-h-screen bg-[#050814] font-inter bg-gallery-pattern text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121A36] border border-[#F28482]/30 text-[#F28482] text-xs font-semibold uppercase tracking-wider">
            <WlpLogoMark className="w-4 h-4" />
            <span>Core Foundation &amp; Guiding Principles</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-white">
            Our Mission &amp; Vision
          </h1>
          <p className="font-inter text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Spotlighting hidden potential and building unlimited futures through high-security corporate sponsorship.
          </p>
        </div>

        {/* Mission & Vision Side-by-Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-[#121A36] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#F28482]" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-[#F28482]/10 text-[#F28482] border border-[#F28482]/20">
                  <Target className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Primary Directive
                </span>
              </div>

              <h2 className="font-montserrat text-2xl font-black text-white mb-4">
                Our Mission
              </h2>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium">
                &quot;{missionVision?.mission}&quot;
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-white/50 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Governance
              </span>
              <span>Updated {missionVision?.lastUpdated || "2026-08-01"}</span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-[#121A36] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-white/10 text-emerald-400 border border-white/15">
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
                <Lock className="w-4 h-4 text-emerald-400" /> Dual-Sided Security Standard
              </span>
              <span>Global Reach</span>
            </div>
          </div>
        </div>

        {/* Founder's Letter Card */}
        <div className="bg-[#121A36] p-8 sm:p-10 rounded-3xl border border-[#F28482]/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 border-2 border-[#F28482]">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Founder"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F28482]">
                A Message from the Executive Office
              </span>
              <h3 className="font-montserrat font-bold text-xl text-white">
                Letter from the Founder
              </h3>
              <p className="text-xs text-white/60">
                {missionVision?.foundersTitle || "Founder & Executive Director"}
              </p>
            </div>
          </div>

          <div className="prose prose-invert prose-sm text-white/80 space-y-4 leading-relaxed font-serif italic border-t border-white/10 pt-6">
            &quot;{missionVision?.foundersNote}&quot;
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-montserrat text-xs font-bold uppercase tracking-widest text-[#F28482] mb-1">
              Operational Imperatives
            </h3>
            <h4 className="font-montserrat text-2xl sm:text-3xl font-black text-white">
              The Pillars of WLP Impact
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121A36] p-7 rounded-2xl border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#050814] text-[#F28482] flex items-center justify-center font-montserrat font-black text-xs border border-[#F28482]/30">
                  01
                </div>
                <Award className="w-4 h-4 text-[#F28482]" />
              </div>
              <h5 className="font-montserrat font-bold text-base text-white">
                Zero-Trust Privacy Shield
              </h5>
              <p className="text-xs text-white/70 leading-relaxed">
                Ensuring 100% data safety for youth creators through institutional vetting and restricted media access.
              </p>
            </div>

            <div className="bg-[#121A36] p-7 rounded-2xl border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#050814] text-[#F28482] flex items-center justify-center font-montserrat font-black text-xs border border-[#F28482]/30">
                  02
                </div>
                <Award className="w-4 h-4 text-[#F28482]" />
              </div>
              <h5 className="font-montserrat font-bold text-base text-white">
                Direct Equipment Grants
              </h5>
              <p className="text-xs text-white/70 leading-relaxed">
                Converting corporate sponsorships directly into high-performance workstations, cameras, and software.
              </p>
            </div>

            <div className="bg-[#121A36] p-7 rounded-2xl border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#050814] text-[#F28482] flex items-center justify-center font-montserrat font-black text-xs border border-[#F28482]/30">
                  03
                </div>
                <Award className="w-4 h-4 text-[#F28482]" />
              </div>
              <h5 className="font-montserrat font-bold text-base text-white">
                Verified Mentorship
              </h5>
              <p className="text-xs text-white/70 leading-relaxed">
                Connecting promising youth with corporate leaders for structured, monitored professional guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-[#121A36] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl border border-[#F28482]/30 relative overflow-hidden">
          <h3 className="font-montserrat text-2xl sm:text-4xl font-black">
            Ready to Champion Extraordinary Youth Talent?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            Schedule a 15-minute admissions vetting call to join our corporate sponsor network.
          </p>
          <div className="pt-2">
            <Link
              href="/book-a-call"
              className="bg-[#F28482] text-white font-extrabold py-3.5 px-8 rounded-xl hover:brightness-105 transition shadow-md inline-flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <span>Schedule Vetting Call</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
