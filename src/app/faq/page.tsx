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
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] bg-foundation-pattern py-12 px-4 sm:px-6 lg:px-8">
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

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005C27]/10 border border-[#005C27]/20 text-[#005C27] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#005C27]" />
            <span>Foundation Guidance &amp; Knowledge</span>
          </div>

          <h1 className="font-montserrat text-3xl sm:text-5xl font-black tracking-tight text-[#051836]">
            Frequently Asked Questions
          </h1>
          <p className="font-inter text-base text-[#051836]/70 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about PWLIF&apos;s parental consent protocols, child dream sponsorship categories, and financial grant stewardship.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#005C27] text-white font-bold shadow-md"
                    : "bg-white text-[#051836]/70 border border-[#051836]/10 hover:border-[#005C27] hover:text-[#005C27]"
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
                className="bg-white rounded-2xl border border-[#051836]/10 overflow-hidden shadow-lg transition-all"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC] transition"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#005C27] shrink-0" />
                    <h3 className="font-montserrat font-bold text-base text-[#051836]">
                      {item.question}
                    </h3>
                  </div>

                  <div className="p-1.5 rounded-lg bg-[#F8FAFC] text-[#051836]/60 shrink-0 border border-[#051836]/10">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#051836]/5 text-xs text-[#051836]/80 leading-relaxed space-y-3 animate-fade-in">
                    <p>{item.answer}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-[#051836]/50 border-t border-[#051836]/5">
                      <span className="font-mono uppercase tracking-wider text-[#005C27] font-bold">
                        Category: {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#005C27]" /> PWLIF Protocol Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Footer Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#005C27]/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-montserrat font-bold text-lg text-[#051836]">
              Have additional questions for our foundation team?
            </h3>
            <p className="text-xs text-[#051836]/70 mt-1">
              Contact our Support Concierge or schedule a direct 15-minute sponsor orientation call.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/support"
              className="bg-[#F8FAFC] text-[#051836] border border-[#051836]/15 px-5 py-3 rounded-xl text-xs font-bold hover:border-[#005C27] hover:text-[#005C27] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Headset className="w-4 h-4 text-[#005C27]" />
              <span>Support Concierge</span>
            </Link>
            <Link
              href="/book-a-call"
              className="bg-[#005C27] hover:bg-[#327B2F] text-white px-5 py-3 rounded-xl text-xs font-montserrat font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
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
