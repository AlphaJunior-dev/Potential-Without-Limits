"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { WlpLogo, WlpLogoMark } from "@/components/WlpLogo";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowRight,
  Headset,
} from "lucide-react";

export default function FaqPage() {
  const { faqItems } = useAuth();
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id || "faq-1");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Security & Privacy", "Sponsors", "Talent Admissions", "General"];

  const filteredItems = faqItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#050814] font-inter bg-gallery-pattern text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121A36] border border-[#F28482]/30 text-[#F28482] text-xs font-semibold uppercase tracking-wider">
            <WlpLogoMark className="w-4 h-4" />
            <span>Institutional Knowledge &amp; Guidance</span>
          </div>

          <h1 className="font-montserrat text-3xl sm:text-5xl font-black tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="font-inter text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about WLP&apos;s youth privacy shield, corporate admissions vetting, and hardware grant deployment.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#F28482] text-white font-bold shadow-md"
                    : "bg-[#121A36] text-white/70 border border-white/10 hover:border-[#F28482]/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-[#121A36] rounded-2xl border border-white/10 overflow-hidden shadow-xl transition-all"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#F28482] shrink-0" />
                    <h3 className="font-montserrat font-bold text-base text-white">
                      {item.question}
                    </h3>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#050814] text-white/60 shrink-0 border border-white/10">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 text-xs text-white/80 leading-relaxed space-y-3 animate-fade-in">
                    <p>{item.answer}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-white/40 border-t border-white/5">
                      <span className="font-mono uppercase tracking-wider text-[#F28482]/80 font-bold">
                        Category: {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> WLP Protocol Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Footer Card */}
        <div className="bg-[#121A36] rounded-3xl p-8 border border-[#F28482]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-montserrat font-bold text-lg text-white">
              Have additional questions for our admissions team?
            </h3>
            <p className="text-xs text-white/70 mt-1">
              Contact our Support Concierge or schedule a direct 15-minute corporate vetting call.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/support"
              className="bg-[#050814] text-white border border-white/15 px-5 py-3 rounded-xl text-xs font-bold hover:border-[#F28482] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Headset className="w-4 h-4 text-[#F28482]" />
              <span>Support Concierge</span>
            </Link>
            <Link
              href="/book-a-call"
              className="bg-[#F28482] text-white px-5 py-3 rounded-xl text-xs font-extrabold hover:brightness-105 transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>Book Vetting Call</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
