"use client";
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Lock, Headset } from "lucide-react";
import { SupportModal } from "./SupportModal";

export function Footer() {
  const pathname = usePathname();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Hide footer on Admin Dashboard routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer aria-label="Global Site Footer" className="bg-[#061D45] text-white mt-auto font-inter">
      {/* 1. Dedicated Safety First & Privacy Shield Banner */}
      <div className="border-b border-white/10 py-8 px-5 sm:px-8 lg:px-10">
        <div className="max-w-[92rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 rounded-[1.6rem] border border-white/12 bg-white/6 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#14B84A]/15 border border-[#14B84A]/30 text-[#A9F1C3] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-montserrat text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Privacy &amp; Information Safeguards</span>
                <span className="bg-[#14B84A]/15 text-[#A9F1C3] text-[10px] px-2 py-0.5 rounded-full font-semibold border border-[#14B84A]/25">Privacy First</span>
              </h4>
              <p className="text-xs text-white/65 mt-1 max-w-3xl leading-relaxed">
                Potential Without Limits International Foundation uses a privacy-first public-information approach. Individual details are discussed only through appropriate private orientation conversations.
              </p>
            </div>
          </div>
          <Link
            href="/support"
            className="shrink-0 bg-[#079432] hover:bg-[#14B84A] text-white text-[10px] uppercase tracking-[0.1em] font-bold px-5 py-3 rounded-full transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Headset className="w-4 h-4" />
            <span>Support Concierge</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="max-w-[92rem] mx-auto py-14 px-5 sm:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Column: Brand & Mission */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="mb-3">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <p className="font-inter text-xs text-white/55 max-w-sm leading-relaxed">
            Unlocking Potential. Transforming Lives.
          </p>
        </div>

        {/* Center Column: Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] uppercase tracking-[0.1em] text-white/60 font-bold">
          <Link href="/talents" className="hover:text-[#A9F1C3] transition-colors">
            Sponsor a Dream
          </Link>
          <span>&bull;</span>
          <Link href="/mission-vision" className="hover:text-[#A9F1C3] transition-colors">
            Mission &amp; Vision
          </Link>
          <span>&bull;</span>
          <Link href="/meet-the-team" className="hover:text-[#A9F1C3] transition-colors">
            Meet the Team
          </Link>
          <span>&bull;</span>
          <Link href="/security-standards" className="hover:text-[#A9F1C3] transition-colors">
            Security &amp; Consent
          </Link>
          <span>&bull;</span>
          <Link href="/privacy" className="hover:text-[#A9F1C3] transition-colors">
            Privacy
          </Link>
          <span>&bull;</span>
          <Link href="/terms" className="hover:text-[#A9F1C3] transition-colors">
            Terms
          </Link>
          <span>&bull;</span>
          <Link href="/faq" className="hover:text-[#A9F1C3] transition-colors">
            FAQ
          </Link>
          <span>&bull;</span>
          <Link href="/book-a-call" className="hover:text-[#A9F1C3] transition-colors">
            Book Orientation Call
          </Link>
          <span>&bull;</span>
          <Link href="/support" className="hover:text-[#A9F1C3] transition-colors">
            Support Concierge
          </Link>
        </div>

        {/* Right Column: Copyright & Discrete Admin Portal Link */}
        <div className="flex flex-col items-center md:items-end gap-2 text-xs text-white/45">
          <span>&copy; 2026 Potential Without Limits International Foundation (PWLIF). All rights reserved.</span>
          <Link
            href="/admin"
            className="text-white/60 hover:text-white text-[10px] uppercase tracking-[0.1em] font-bold flex items-center gap-1.5 transition-colors px-3 py-2 rounded-full bg-white/6 border border-white/12 hover:border-white/30"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A9F1C3]" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>

      {/* Support Modal Component */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </footer>
  );
}
