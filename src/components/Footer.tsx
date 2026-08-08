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
    <footer aria-label="Global Site Footer" className="bg-[#FDFCF9] text-[#051836] border-t border-[#051836]/10 mt-auto font-inter">
      {/* 1. Dedicated Safety First & Privacy Shield Banner */}
      <div className="bg-[#F8FAFC] border-b border-[#051836]/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-[#051836]/10 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#005C27]/10 border border-[#005C27]/20 text-[#005C27] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-montserrat text-sm font-bold text-[#051836] uppercase tracking-wider flex items-center gap-2">
                <span>Child Protection &amp; Parental Consent Shield</span>
                <span className="bg-[#005C27]/10 text-[#005C27] text-[10px] px-2 py-0.5 rounded-full font-semibold border border-[#005C27]/20">100% Vetted</span>
              </h4>
              <p className="text-xs text-[#051836]/70 mt-1 max-w-3xl leading-relaxed">
                Potential Without Limits International Foundation operates under strict international child safety protocols. Every youth profile is published with verified parental/guardian consent records and strict privacy protections.
              </p>
            </div>
          </div>
          <Link
            href="/support"
            className="shrink-0 bg-[#005C27] hover:bg-[#327B2F] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Headset className="w-4 h-4" />
            <span>Support Concierge</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Column: Brand & Mission */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="mb-3">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <p className="font-inter text-xs text-[#051836]/60 max-w-sm leading-relaxed">
            Unlocking Potential. Transforming Lives.
          </p>
        </div>

        {/* Center Column: Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#051836]/70 font-medium">
          <Link href="/talents" className="hover:text-[#005C27] transition-colors">
            Sponsor a Dream
          </Link>
          <span>&bull;</span>
          <Link href="/mission-vision" className="hover:text-[#005C27] transition-colors">
            Mission &amp; Vision
          </Link>
          <span>&bull;</span>
          <Link href="/meet-the-team" className="hover:text-[#005C27] transition-colors">
            Meet the Team
          </Link>
          <span>&bull;</span>
          <Link href="/security-standards" className="hover:text-[#005C27] transition-colors">
            Security &amp; Consent
          </Link>
          <span>&bull;</span>
          <Link href="/faq" className="hover:text-[#005C27] transition-colors">
            FAQ
          </Link>
          <span>&bull;</span>
          <Link href="/book-a-call" className="hover:text-[#005C27] transition-colors">
            Book Orientation Call
          </Link>
          <span>&bull;</span>
          <Link href="/support" className="hover:text-[#005C27] transition-colors">
            Support Concierge
          </Link>
        </div>

        {/* Right Column: Copyright & Discrete Admin Portal Link */}
        <div className="flex flex-col items-center md:items-end gap-2 text-xs text-[#051836]/50">
          <span>&copy; 2026 Potential Without Limits International Foundation (PWLIF). All rights reserved.</span>
          <Link
            href="/admin"
            className="text-[#051836]/50 hover:text-[#051836] text-[11px] font-medium flex items-center gap-1.5 transition-colors px-3 py-1 rounded-lg bg-[#051836]/5 border border-[#051836]/10 hover:border-[#051836]/30"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#005C27]" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>

      {/* Support Modal Component */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </footer>
  );
}
