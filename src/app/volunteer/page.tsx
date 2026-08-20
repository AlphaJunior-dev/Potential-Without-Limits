"use client";

import React from "react";
import Link from "next/link";
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Send, 
  BookOpen, 
  Code, 
  Award, 
  Globe, 
  ShieldCheck,
  UserCheck,
  ArrowRight
} from "lucide-react";

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-[#FCFCFA] font-inter text-[#0B2E6B] bg-foundation-pattern py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block mb-2">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto mx-auto object-contain"
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#079432]/10 border border-[#079432]/20 text-[#079432] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F7B500]" />
            <span>Community &amp; Global Mentorship Hub</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-[#0B2E6B]">
            Become a Volunteer or Mentor
          </h1>
          <p className="font-inter text-base sm:text-lg text-[#0B2E6B]/70 max-w-3xl mx-auto leading-relaxed">
            Explore appropriate ways to share relevant expertise through PWLIF’s private, review-based partnership process.
          </p>
        </div>

        {/* 4 Volunteer Tracks */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079432]">
              Impact Opportunities
            </span>
            <h2 className="font-montserrat text-2xl sm:text-3xl font-black text-[#0B2E6B]">
              Volunteer &amp; Mentorship Tracks
            </h2>
            <p className="text-xs sm:text-sm text-[#0B2E6B]/70 mt-2">
              Volunteer and mentorship arrangements are considered privately when an appropriate opportunity is available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter">
            {[
              {
                title: "Academic & STEM Tutor",
                desc: "Share subject-matter expertise where a privately reviewed community-learning opportunity is available.",
                icon: BookOpen,
                badge: "Remote or On-site",
              },
              {
                title: "Technical Mentor (Coding & Digital Arts)",
                desc: "Offer technical perspective relevant to carefully scoped learning and creative-development activities.",
                icon: Code,
                badge: "Technical Expert",
              },
              {
                title: "Community Youth Coordinator",
                desc: "Support appropriate community activities through coordination that is reviewed by the foundation team.",
                icon: Users,
                badge: "Community Field Lead",
              },
              {
                title: "Safeguarding & Wellbeing Specialist",
                desc: "Provide safeguarding-aware perspective for approved initiatives when requested by the foundation team.",
                icon: ShieldCheck,
                badge: "Safeguarding Specialist",
              },
            ].map((t, idx) => {
              const IconComp = t.icon;
              return (
                <div key={idx} className="bg-white p-7 rounded-3xl border border-[#0B2E6B]/10 shadow-lg space-y-4 hover:border-[#079432]/40 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-[#079432]/10 text-[#079432] border border-[#079432]/20">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="bg-[#079432]/10 text-[#079432] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#079432]/20">
                        {t.badge}
                      </span>
                    </div>

                    <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">
                      {t.title}
                    </h3>
                    <p className="text-xs text-[#0B2E6B]/70 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Volunteer Application Form Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#0B2E6B]/10 shadow-2xl space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b border-[#0B2E6B]/10 pb-4">
            <div className="p-3 rounded-2xl bg-[#079432]/10 text-[#079432] border border-[#079432]/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#079432]">
                Join Our Network
              </span>
              <h2 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">
                Volunteer Interest
              </h2>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#0B2E6B]/10 p-6 rounded-2xl space-y-3 text-center">
            <ShieldCheck className="w-10 h-10 text-[#079432] mx-auto" />
            <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">Volunteer applications are not collected through this site.</h3>
            <p className="text-xs leading-relaxed max-w-md mx-auto text-[#0B2E6B]/70">PWLIF does not accept volunteer applications or collect volunteer contact details in this portal. Use the foundation contact page only for a general enquiry.</p>
            <Link href="/support" className="inline-flex items-center gap-2 text-xs font-bold text-[#079432] hover:underline">
              Contact the foundation office
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
