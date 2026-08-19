"use client";

import React from "react";
import Link from "next/link";
import { 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  FileText,
  Gift
} from "lucide-react";

export default function DonatePage() {
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
            <Heart className="w-4 h-4 text-[#F5AB00] fill-[#F5AB00]" />
            <span>Partnership &amp; Support Conversations</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-[#051836]">
            Partnership &amp; Support
          </h1>
          <p className="font-inter text-base sm:text-lg text-[#051836]/70 max-w-3xl mx-auto leading-relaxed">
            PWLIF does not accept or process financial contributions through this website. Partnership conversations begin with a private orientation request.
          </p>
        </div>

        {/* Partnership Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-inter">
          {[
            {
              title: "Sponsor Talent Conversation",
              amount: "Orientation Required",
              desc: "Discuss Sponsor Talent opportunities, appropriate boundaries, and the orientation process before any partnership decision.",
              category: "Sponsor Talent",
              popular: true,
            },
            {
              title: "Learning & Mentorship Partnership",
              amount: "Private Discussion",
              desc: "Explore how learning, mentorship, and community-informed opportunities may be considered through the appropriate channels.",
              category: "Partnership",
              popular: false,
            },
            {
              title: "Foundation Introduction",
              amount: "By Orientation",
              desc: "Request an introduction to learn more about PWLIF’s approach and whether a future conversation is appropriate.",
              category: "Introduction",
              popular: false,
            },
          ].map((channel, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-7 border shadow-lg flex flex-col justify-between space-y-4 relative ${
                channel.popular ? "border-[#005C27] ring-2 ring-[#005C27]/20" : "border-[#051836]/10"
              }`}
            >
              {channel.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#005C27] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                  Most Popular Channel
                </span>
              )}

              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#005C27]">
                  {channel.category}
                </span>
                <h3 className="font-montserrat font-bold text-xl text-[#051836]">
                  {channel.title}
                </h3>
                <div className="font-montserrat font-black text-2xl text-[#005C27]">
                  {channel.amount}
                </div>
                <p className="text-xs text-[#051836]/70 leading-relaxed">
                  {channel.desc}
                </p>
              </div>

              <button
                disabled
                className="w-full font-bold py-3 px-4 rounded-xl text-xs text-center flex items-center justify-center gap-1.5 bg-[#F8FAFC] text-[#051836]/50 border border-[#051836]/15 cursor-not-allowed"
              >
                <Heart className="w-3.5 h-3.5 text-[#F5AB00] fill-[#F5AB00]" />
                <span>Orientation Required</span>
              </button>
            </div>
          ))}
        </div>

        {/* Corporate & Custom Donation Form */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#051836]/10 shadow-2xl space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b border-[#051836]/10 pb-4">
            <div className="p-3 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">Private Partnership Process</span>
              <h2 className="font-montserrat font-bold text-2xl text-[#051836]">
                Financial Contributions Are Not Available Online
              </h2>
            </div>
          </div>

          <div className="space-y-6 font-inter text-xs">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 text-xs text-[#051836]/70 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#005C27] shrink-0" />
              <p>Online donations, payment collection, tax receipts, and financial reporting are intentionally unavailable through this portal.</p>
            </div>
            <Link href="/book-a-call" className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-4 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer">
              <Heart className="w-4 h-4 text-[#F5AB00] fill-[#F5AB00]" />
              <span>Request Sponsor Orientation</span>
            </Link>
          </div>
        </div>

        {/* Partnership Information Box */}
        <div className="bg-white p-8 rounded-3xl border border-[#051836]/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
              Partnership Information
            </span>
            <h3 className="font-montserrat font-bold text-xl text-[#051836]">
              Information Is Shared Through Appropriate Private Conversations
            </h3>
            <p className="text-xs text-[#051836]/70 max-w-xl">
              Financial, tax, and transparency reports are not published on this website or through the sponsor portal.
            </p>
          </div>
          <Link
            href="/book-a-call"
            className="bg-[#051836] hover:bg-[#042554] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-md flex items-center gap-2 text-xs shrink-0"
          >
            <FileText className="w-4 h-4 text-[#F5AB00]" />
            <span>Request Orientation</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
