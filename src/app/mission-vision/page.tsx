"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Target, Compass, ShieldCheck, Heart, Sparkles, Award } from "lucide-react";

export default function MissionVisionPage() {
  const values = [
    { name: "Hope", desc: "Instilling optimism and belief in a brighter future for every child." },
    { name: "Integrity", desc: "Upholding the highest moral and ethical standards in all actions." },
    { name: "Compassion", desc: "Demonstrating deep empathy and care for vulnerable youth." },
    { name: "Excellence", desc: "Striving for quality and distinction in programs and stewardship." },
    { name: "Accountability", desc: "Taking full responsibility for outcomes and grant utilization." },
    { name: "Innovation", desc: "Embracing creative technology and modern learning tools." },
    { name: "Inclusion", desc: "Ensuring equal opportunities for youth of all backgrounds." },
    { name: "Respect", desc: "Honoring the dignity, rights, and voice of every child." },
    { name: "Empowerment", desc: "Equipping youth with confidence and self-reliance skills." },
    { name: "Transparency", desc: "Maintaining open, audited, and honest institutional operations." },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] bg-foundation-pattern py-16 px-4 sm:px-6 lg:px-8">
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

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005C27]/10 border border-[#005C27]/20 text-[#005C27] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#005C27]" />
            <span>Humanitarian Foundation Identity</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-[#051836]">
            Our Mission &amp; Vision
          </h1>
          <p className="font-inter text-base sm:text-lg text-[#051836]/70 max-w-3xl mx-auto leading-relaxed">
            Empowering vulnerable children and young people across Africa through education, talent development, mentorship, and transparent humanitarian stewardship.
          </p>
        </div>

        {/* Mission & Vision Side-by-Side Grid (Light Palette) */}
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
                  Core Mission Statement
                </span>
              </div>

              <h2 className="font-montserrat text-2xl font-black text-[#051836] mb-4">
                Our Mission
              </h2>

              <p className="text-sm sm:text-base text-[#051836]/80 leading-relaxed font-medium">
                &quot;To identify, nurture, and empower vulnerable children and young people — including orphans, street children, and youth from conflict-affected and marginalized communities — by providing access to education, skills development, mentorship, and resources that unlock their full potential.&quot;
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#051836]/10 text-xs text-[#051836]/50 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#005C27]" /> Verified Governance
              </span>
              <span>Child Safety Shield Protocol</span>
            </div>
          </div>

          {/* Vision Card (Light Palette) */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#051836]/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#005C27]" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#051836]/40">
                  Long-Term Vision
                </span>
              </div>

              <h2 className="font-montserrat text-2xl font-black text-[#051836] mb-4">
                Our Vision
              </h2>

              <p className="text-sm sm:text-base text-[#051836]/80 leading-relaxed font-medium">
                &quot;A world where every child and young person, regardless of background or circumstance, has the opportunity to discover and develop their unique potential and contribute meaningfully to society.&quot;
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#051836]/10 text-xs text-[#051836]/50 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#005C27]" /> Global Outreach
              </span>
              <span>Pan-African &amp; Global Scope</span>
            </div>
          </div>
        </div>

        {/* Founder's Statement Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#005C27]/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 border-2 border-[#005C27]">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                alt="Rafiki Emmanuel, Founder & President"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
                A Message from the Founder &amp; President
              </span>
              <h3 className="font-montserrat font-bold text-xl text-[#051836]">
                Rafiki Emmanuel
              </h3>
              <p className="text-xs text-[#051836]/60">
                Founder &amp; President, Potential Without Limits International Foundation (PWLIF)
              </p>
            </div>
          </div>

          <div className="prose prose-sm text-[#051836]/80 space-y-4 leading-relaxed font-serif italic border-t border-[#051836]/10 pt-6 text-sm sm:text-base">
            &quot;Potential Without Limits International Foundation was born from a simple but powerful belief: every child has unique potential waiting to be discovered. No child should be defined by poverty, homelessness, conflict, or limited opportunities. Through education, mentorship, talent development, and compassionate partnerships, we aim to unlock that potential and create pathways toward dignity, hope, and lasting success. Together with our supporters, volunteers, and partners, we are building a future where potential truly has no limits.&quot;
          </div>
        </div>

        {/* 10 Core Values Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-montserrat text-xs font-bold uppercase tracking-widest text-[#005C27] mb-1">
              Foundational Principles
            </h3>
            <h4 className="font-montserrat text-2xl sm:text-3xl font-black text-[#051836]">
              Our 10 Core Values
            </h4>
            <p className="text-xs sm:text-sm text-[#051836]/70 mt-2">
              The core principles guiding every program, grant, and community intervention across PWLIF.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-inter">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#051836]/10 shadow-lg space-y-3 hover:border-[#005C27]/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-[#005C27]/10 text-[#005C27] flex items-center justify-center font-montserrat font-black text-xs border border-[#005C27]/20">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <Award className="w-4 h-4 text-[#005C27]" />
                </div>
                <h5 className="font-montserrat font-bold text-base text-[#051836]">
                  {v.name}
                </h5>
                <p className="text-xs text-[#051836]/70 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-[#051836] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl border border-[#005C27]/30 relative overflow-hidden">
          <h3 className="font-montserrat text-2xl sm:text-4xl font-black">
            Ready to Empower a Child&apos;s Bright Future?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            Join PWLIF as a sponsor, mentor, or donor to build sustainable pathways of opportunity for vulnerable children.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/talents"
              className="bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3.5 px-8 rounded-xl transition shadow-lg inline-flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#F5AB00] fill-[#F5AB00]" />
              <span>Sponsor a Child&apos;s Dream</span>
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
