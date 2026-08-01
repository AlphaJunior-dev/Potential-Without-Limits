"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { WlpLogo, WlpLogoMark } from "@/components/WlpLogo";
import { Globe, Mail, ShieldCheck, ArrowRight } from "lucide-react";

export default function MeetTheTeamPage() {
  const { teamMembers } = useAuth();

  return (
    <div className="min-h-screen bg-[#050814] font-inter bg-gallery-pattern text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121A36] border border-[#F28482]/30 text-[#F28482] text-xs font-semibold uppercase tracking-wider">
            <WlpLogoMark className="w-4 h-4" />
            <span>Executive Leadership &amp; Board</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-white">
            Meet the Executive Team
          </h1>
          <p className="font-inter text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            The dedicated team of youth advocates, security auditors, and industry veterans driving Without Limits Potential.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-[#121A36] rounded-3xl overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#F28482]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-square w-full bg-[#050814] overflow-hidden">
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121A36] via-transparent to-transparent" />
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="font-montserrat font-bold text-lg text-white">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-[#F28482] mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed line-clamp-4">
                    {member.bio}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Staff
                </span>

                <div className="flex items-center gap-2 text-white/40">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F28482] transition"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {member.twitterUrl && (
                    <a
                      href={member.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F28482] transition"
                      aria-label={`Twitter ${member.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Banner */}
        <div className="bg-[#121A36] rounded-3xl p-8 sm:p-10 border border-white/10 text-center space-y-4 shadow-2xl">
          <h3 className="font-montserrat text-xl font-bold text-white">
            Interested in joining our Advisory Board or Mentor Network?
          </h3>
          <p className="text-xs text-white/70 max-w-xl mx-auto leading-relaxed">
            We are always expanding our institutional advisory network with leading engineers, artists, and corporate partners.
          </p>
          <div className="pt-2">
            <Link
              href="/support"
              className="bg-[#F28482] text-white border border-[#F28482] px-6 py-3 rounded-xl text-xs font-bold hover:brightness-105 transition inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>Contact Executive Office</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
