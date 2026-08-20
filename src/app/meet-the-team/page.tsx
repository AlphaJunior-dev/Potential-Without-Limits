"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Globe, Mail, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function MeetTheTeamPage() {
  const { teamMembers } = useAuth();

  return (
    <div className="min-h-screen bg-[#FCFCFA] font-inter text-[#0B2E6B] py-16 px-4 sm:px-6 lg:px-8 bg-foundation-pattern">
      <div className="max-w-6xl mx-auto space-y-16">
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
            <Sparkles className="w-4 h-4 text-[#F7B500]" />
            <span>Executive Leadership &amp; Advisory Council</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-[#0B2E6B]">
            Meet Our Leadership Team
          </h1>
          <p className="font-inter text-base sm:text-lg text-[#0B2E6B]/70 max-w-2xl mx-auto leading-relaxed">
            The dedicated team of youth advocates, educators, and community mentors driving Potential Without Limits International Foundation (PWLIF).
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#0B2E6B]/10 shadow-xl hover:shadow-2xl hover:border-[#079432]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {member.visibility?.showPhoto !== false ? (
                  <div className="relative aspect-square w-full bg-[#F8FAFC] overflow-hidden">
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-square w-full bg-[#079432]/5 flex items-center justify-center text-[#079432]/45">
                    <ShieldCheck className="w-12 h-12" aria-label="Leadership profile" />
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-xs font-bold text-[#079432] mt-0.5 uppercase tracking-wider">
                        {member.role}
                      </p>
                    )}
                  </div>

                  {member.bio && (
                    <p className="text-xs text-[#0B2E6B]/70 leading-relaxed line-clamp-5">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-[#0B2E6B]/10 pt-4">
                <span className="text-[10px] font-mono text-[#079432] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Leadership
                </span>

                <div className="flex items-center gap-2 text-[#0B2E6B]/40">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#079432] transition"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#079432]/20 text-center space-y-4 shadow-2xl">
          <h3 className="font-montserrat text-xl font-bold text-[#0B2E6B]">
            Interested in joining our Advisory Board or Mentor Network?
          </h3>
          <p className="text-xs text-[#0B2E6B]/70 max-w-xl mx-auto leading-relaxed">
            We are continuously expanding our institutional advisory network with educators, technical mentors, and corporate CSR partners.
          </p>
          <div className="pt-2">
            <Link
              href="/volunteer"
              className="bg-[#079432] hover:bg-[#14B84A] text-white border border-[#079432] px-6 py-3 rounded-xl text-xs font-bold transition inline-flex items-center gap-2 shadow-md cursor-pointer uppercase tracking-wider"
            >
              <span>Join Volunteer &amp; Advisory Network</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
