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

  const categories = ["All", "Security & Privacy", "Sponsors", "Child Protection", "General"];

  const filteredItems = faqItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#FCFCFA] font-inter text-[#0B2E6B] bg-foundation-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
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
            <HelpCircle className="w-3.5 h-3.5 text-[#079432]" />
            <span>Foundation Guidance &amp; Knowledge</span>
          </div>

          <h1 className="font-montserrat text-3xl sm:text-5xl font-black tracking-tight text-[#0B2E6B]">
            Frequently Asked Questions
          </h1>
          <p className="font-inter text-base text-[#0B2E6B]/70 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about PWLIF&apos;s privacy-first Sponsor Talent process, orientation pathway, and community partnership approach.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#079432] text-white font-bold shadow-md"
                    : "bg-white text-[#0B2E6B]/70 border border-[#0B2E6B]/10 hover:border-[#079432] hover:text-[#079432]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion list */}
        <div className="space-y-4 font-inter text-xs">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#0B2E6B]/10 overflow-hidden shadow-lg transition-all"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC] transition"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#079432] shrink-0" />
                    <h3 className="font-montserrat font-bold text-base text-[#0B2E6B]">
                      {item.question}
                    </h3>
                  </div>

                  <div className="p-1.5 rounded-lg bg-[#F8FAFC] text-[#0B2E6B]/60 shrink-0 border border-[#0B2E6B]/10">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#0B2E6B]/5 text-xs text-[#0B2E6B]/80 leading-relaxed space-y-3 animate-fade-in">
                    <p>{item.answer}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-[#0B2E6B]/50 border-t border-[#0B2E6B]/5">
                      <span className="font-mono uppercase tracking-wider text-[#079432] font-bold">
                        Category: {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#079432]" /> PWLIF Guidance
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Footer Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#079432]/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">
              Have additional questions for our foundation team?
            </h3>
            <p className="text-xs text-[#0B2E6B]/70 mt-1">
              Contact our Support Concierge or schedule a direct 15-minute sponsor orientation call.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/support"
              className="bg-[#F8FAFC] text-[#0B2E6B] border border-[#0B2E6B]/15 px-5 py-3 rounded-xl text-xs font-bold hover:border-[#079432] hover:text-[#079432] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Headset className="w-4 h-4 text-[#079432]" />
              <span>Support Concierge</span>
            </Link>
            <Link
              href="/book-a-call"
              className="bg-[#079432] hover:bg-[#14B84A] text-white px-5 py-3 rounded-xl text-xs font-montserrat font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>Schedule Orientation</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
