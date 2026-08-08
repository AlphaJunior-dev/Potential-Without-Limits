"use client";

import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Target, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Users, 
  Globe, 
  Download, 
  CheckCircle2,
  Building2,
  Heart,
  BookOpen
} from "lucide-react";

export default function StrategicPlanPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] bg-foundation-pattern py-16 px-4 sm:px-6 lg:px-8">
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

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005C27]/10 border border-[#005C27]/20 text-[#005C27] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F5AB00]" />
            <span>Official Institutional Document</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-[#051836]">
            Strategic Plan 2027–2032
          </h1>
          <p className="font-inter text-base sm:text-lg text-[#051836]/70 max-w-3xl mx-auto leading-relaxed">
            A 5-Year Roadmap for Empowering Vulnerable Children &amp; Youth Across Africa — Beginning in Ethiopia — Through Education, Talent Development, and Sustainable Opportunity.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a
              href="https://wlp-app.vercel.app/reports/PWLIF-Strategic-Plan-2027-2032.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-md flex items-center gap-2 text-xs uppercase tracking-wider"
            >
              <Download className="w-4 h-4 text-[#F5AB00]" />
              <span>Download Official Strategic Plan (PDF)</span>
            </a>
            <Link
              href="/mission-vision"
              className="bg-white text-[#051836] border border-[#051836]/15 hover:border-[#005C27] font-montserrat font-bold py-3.5 px-6 rounded-xl transition text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <span>Mission &amp; Core Values</span>
              <ArrowRight className="w-4 h-4 text-[#005C27]" />
            </Link>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#051836]/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-[#051836]/10 pb-4">
            <div className="p-3 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
                Institutional Overview
              </span>
              <h2 className="font-montserrat font-bold text-2xl text-[#051836]">
                Executive Summary
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#051836]/80 leading-relaxed">
            Potential Without Limits International Foundation (PWLIF) presents its Strategic Plan for 2027–2032, outlining a comprehensive pan-African initiative to unlock the latent potential of vulnerable children and young people. Operating with a primary initial focus in Ethiopia, PWLIF establishes a scalable framework to connect talent development with direct sponsorship, academic support, equipment grants, and psychosocial care.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#051836]/10 text-xs">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10">
              <span className="font-montserrat font-black text-2xl text-[#005C27] block">5 Years</span>
              <span className="text-[#051836]/70 font-semibold mt-0.5 block">Implementation Timeline (2027–2032)</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10">
              <span className="font-montserrat font-black text-2xl text-[#051836] block">Ethiopia &amp; Africa</span>
              <span className="text-[#051836]/70 font-semibold mt-0.5 block">Primary Geographical Horizon</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10">
              <span className="font-montserrat font-black text-2xl text-[#F5AB00] block">6 Objectives</span>
              <span className="text-[#051836]/70 font-semibold mt-0.5 block">Strategic Pillars of Growth</span>
            </div>
          </div>
        </div>

        {/* 6 Strategic Objectives */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
              Action Roadmap
            </span>
            <h2 className="font-montserrat text-2xl sm:text-4xl font-black text-[#051836]">
              Six Strategic Objectives
            </h2>
            <p className="text-xs sm:text-sm text-[#051836]/70 mt-2">
              Our core strategic priorities designed to drive systemic impact and child empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter">
            {[
              {
                num: "01",
                title: "Expand Access to Quality Education & Talent Development",
                desc: "Establish physical and digital Talent Development Centres across Ethiopian communities, equipping youth with STEM hardware, digital arts suites, robotics tools, musical instruments, and academic tuition grants.",
                icon: BookOpen,
              },
              {
                num: "02",
                title: "Comprehensive Psychosocial & Child Safeguarding Support",
                desc: "Implement holistic child health, counseling, and nutritional support while maintaining 100% verified parental/guardian consent shields and strict international minor protection standards.",
                icon: ShieldCheck,
              },
              {
                num: "03",
                title: "Sustainable Partnerships & Global Sponsorship Ecosystem",
                desc: "Scale the child dream sponsorship network by partnering with international foundations, corporate CSR programs, diaspora networks, and bilateral humanitarian alliances.",
                icon: Globe,
              },
              {
                num: "04",
                title: "Capacity Building, Mentorship & Digital Literacy",
                desc: "Launch structured mentorship programs pairing local and international experts with young innovators in coding, digital arts, leadership, sports, and entrepreneurship.",
                icon: Users,
              },
              {
                num: "05",
                title: "Organizational Growth & Transparent Stewardship",
                desc: "Maintain 100% audited financial traceability, publishing independent annual audits and direct grant deployment reports for public and sponsor verification.",
                icon: Award,
              },
              {
                num: "06",
                title: "Advocacy, Community Leadership & Youth Empowerment",
                desc: "Elevate youth voices on global platforms, advocate for child protection policies, and foster youth-led community projects that generate localized economic and social impact.",
                icon: Building2,
              },
            ].map((obj) => {
              const IconComp = obj.icon;
              return (
                <div
                  key={obj.num}
                  className="bg-white p-7 rounded-3xl border border-[#051836]/10 shadow-lg space-y-4 hover:border-[#005C27]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-2xl bg-[#005C27]/10 text-[#005C27] flex items-center justify-center font-montserrat font-black text-sm border border-[#005C27]/20">
                        {obj.num}
                      </span>
                      <IconComp className="w-5 h-5 text-[#005C27]" />
                    </div>
                    <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                      {obj.title}
                    </h3>
                    <p className="text-xs text-[#051836]/70 leading-relaxed">
                      {obj.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#051836]/5 text-[11px] font-semibold text-[#005C27] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved Strategic Objective
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organizational Structure */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#051836]/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-[#051836]/10 pb-4">
            <div className="p-3 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
                Governance &amp; Leadership
              </span>
              <h2 className="font-montserrat font-bold text-2xl text-[#051836]">
                Organizational Structure
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#051836]/80 leading-relaxed">
            PWLIF operates under a clear, accountable governance framework led by Founder &amp; President <strong>Rafiki Emmanuel</strong>, supported by an international Board of Directors, executive officers, program curators, and local community leaders.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 font-inter text-xs">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-2">
              <span className="font-montserrat font-bold text-sm text-[#051836] block">Board of Directors</span>
              <p className="text-[#051836]/70 text-[11px]">Independent governance, fiduciary oversight, and strategic direction.</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-2">
              <span className="font-montserrat font-bold text-sm text-[#005C27] block">President &amp; Founder</span>
              <p className="text-[#051836]/70 text-[11px]">Rafiki Emmanuel — Executive leadership and institutional vision.</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-2">
              <span className="font-montserrat font-bold text-sm text-[#051836] block">Program Directorate</span>
              <p className="text-[#051836]/70 text-[11px]">Education, talent development, and child safeguarding leads.</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 space-y-2">
              <span className="font-montserrat font-bold text-sm text-[#051836] block">Community Hubs</span>
              <p className="text-[#051836]/70 text-[11px]">Local Ethiopian field officers, mentors, and guardian liaisons.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#051836] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl border border-[#005C27]/30 relative overflow-hidden">
          <h3 className="font-montserrat text-2xl sm:text-4xl font-black">
            Partner With Us in Executing Strategic Plan 2027–2032
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
            Whether as a corporate sponsor, foundation partner, mentor, or donor, your involvement accelerates sustainable opportunity for children across Africa.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3.5 px-8 rounded-xl transition shadow-lg inline-flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#F5AB00] fill-[#F5AB00]" />
              <span>Become a Foundation Partner</span>
            </Link>

            <Link
              href="/volunteer"
              className="bg-white/10 hover:bg-white/20 text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition border border-white/20 inline-flex items-center gap-2 text-xs uppercase tracking-wider"
            >
              <span>Volunteer Opportunities</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
