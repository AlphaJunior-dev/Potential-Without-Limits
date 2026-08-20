"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Target, Compass, ShieldCheck, Heart, Sparkles, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function MissionVisionPage() {
  const { missionVision } = useAuth();
  const values = [
    { name: "Hope", desc: "Encouraging belief in a future where potential can be recognised and supported." },
    { name: "Integrity", desc: "Upholding the highest moral and ethical standards in all actions." },
    { name: "Compassion", desc: "Approaching young people, families, and partners with care and empathy." },
    { name: "Excellence", desc: "Striving for thoughtful, high-quality foundation work and partnerships." },
    { name: "Accountability", desc: "Taking responsibility for decisions, communications, and entrusted work." },
    { name: "Innovation", desc: "Embracing creative technology and modern learning tools." },
    { name: "Inclusion", desc: "Valuing opportunity, participation, and belonging across diverse communities." },
    { name: "Respect", desc: "Honouring the dignity, rights, and voice of every young person." },
    { name: "Empowerment", desc: "Supporting young people to develop confidence, skills, and agency." },
    { name: "Stewardship", desc: "Approaching foundation decisions and partnerships with care and integrity." },
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFA] font-inter text-[#0B2E6B] bg-foundation-pattern py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block mb-2">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto mx-auto object-contain"
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#079432]/10 border border-[#079432]/20 text-[#079432] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#079432]" />
            <span>Humanitarian Foundation Identity</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-[#0B2E6B]">
            Our Mission &amp; Vision
          </h1>
          <p className="font-inter text-base sm:text-lg text-[#0B2E6B]/70 max-w-3xl mx-auto leading-relaxed">
            Supporting young people to explore and develop their potential through learning, mentorship, talent development, and responsible partnerships.
          </p>
        </div>

        {/* Mission & Vision Side-by-Side Grid (Light Palette) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#0B2E6B]/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#079432]" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-[#079432]/10 text-[#079432] border border-[#079432]/20">
                  <Target className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0B2E6B]/40">
                  Core Mission Statement
                </span>
              </div>

              <h2 className="font-montserrat text-2xl font-black text-[#0B2E6B] mb-4">
                Our Mission
              </h2>

              <p className="text-sm sm:text-base text-[#0B2E6B]/80 leading-relaxed font-medium">
                &quot;{missionVision.mission}&quot;
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#0B2E6B]/10 text-xs text-[#0B2E6B]/50 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#079432]" /> Responsible Foundation Practice
              </span>
              <span>Safeguarding-Aware Approach</span>
            </div>
          </div>

          {/* Vision Card (Light Palette) */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#0B2E6B]/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#079432]" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-[#079432]/10 text-[#079432] border border-[#079432]/20">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0B2E6B]/40">
                  Long-Term Vision
                </span>
              </div>

              <h2 className="font-montserrat text-2xl font-black text-[#0B2E6B] mb-4">
                Our Vision
              </h2>

              <p className="text-sm sm:text-base text-[#0B2E6B]/80 leading-relaxed font-medium">
                &quot;{missionVision.vision}&quot;
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#0B2E6B]/10 text-xs text-[#0B2E6B]/50 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#079432]" /> Long-Term Perspective
              </span>
              <span>Potential Without Limits</span>
            </div>
          </div>
        </div>

        {/* Founder's Statement Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#079432]/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 border-2 border-[#079432]">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                alt="Rafiki Emmanuel, Founder & President"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#079432]">
                A Message from the Founder &amp; President
              </span>
              <h3 className="font-montserrat font-bold text-xl text-[#0B2E6B]">
                {missionVision.foundersTitle}
              </h3>
              <p className="text-xs text-[#0B2E6B]/60">
                Foundation message
              </p>
            </div>
          </div>

          <div className="prose prose-sm text-[#0B2E6B]/80 space-y-4 leading-relaxed font-serif italic border-t border-[#0B2E6B]/10 pt-6 text-sm sm:text-base">
            &quot;{missionVision.foundersNote}&quot;
          </div>
        </div>

        {/* 10 Core Values Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-montserrat text-xs font-bold uppercase tracking-widest text-[#079432] mb-1">
              Foundational Principles
            </h3>
            <h4 className="font-montserrat text-2xl sm:text-3xl font-black text-[#0B2E6B]">
              Our 10 Core Values
            </h4>
            <p className="text-xs sm:text-sm text-[#0B2E6B]/70 mt-2">
              The core principles guiding PWLIF’s programme development, communication, and partnership work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-inter">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-lg space-y-3 hover:border-[#079432]/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-[#079432]/10 text-[#079432] flex items-center justify-center font-montserrat font-black text-xs border border-[#079432]/20">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <Award className="w-4 h-4 text-[#079432]" />
                </div>
                <h5 className="font-montserrat font-bold text-base text-[#0B2E6B]">
                  {v.name}
                </h5>
                <p className="text-xs text-[#0B2E6B]/70 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-[#0B2E6B] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl border border-[#079432]/30 relative overflow-hidden">
          <h3 className="font-montserrat text-2xl sm:text-4xl font-black">
            Ready to Explore a Potential-Focused Partnership?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            Begin with a private orientation conversation to learn how PWLIF approaches Sponsor Talent, learning, mentorship, and partnership opportunities.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/talents"
              className="bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-bold py-3.5 px-8 rounded-xl transition shadow-lg inline-flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#F7B500] fill-[#F7B500]" />
              <span>Explore Sponsor Talent</span>
            </Link>

            <Link
              href="/volunteer"
              className="bg-white/10 hover:bg-white/20 text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition border border-white/20 inline-flex items-center gap-2 text-xs uppercase tracking-wider"
            >
              <span>Become a Volunteer</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
