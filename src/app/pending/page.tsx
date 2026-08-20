"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowLeft, HelpCircle } from "lucide-react";
import { WlpLogo } from "@/components/WlpLogo";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FCFCFA] p-4 md:p-8 font-inter bg-foundation-pattern">
      {/* Top Security Portal Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 border-b border-[#0B2E6B]/10">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <span className="text-[#0B2E6B]/30 font-light">|</span>
          <span className="text-xs font-montserrat font-bold tracking-widest text-[#0B2E6B]/60 uppercase">
            Sponsor Verification Hub
          </span>
        </div>
        <Link
          href="/support"
          className="text-[#0B2E6B]/60 hover:text-[#079432] transition"
          title="Contact Support Concierge"
        >
          <HelpCircle className="w-5 h-5" />
        </Link>
      </header>

      {/* Main Waiting Room Card Container */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-10 text-center border border-[#0B2E6B]/10 relative overflow-hidden">
          {/* Top Subtle Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#079432] via-[#F7B500] to-[#079432]" />

          {/* Visual: Lock Icon */}
          <div className="w-20 h-20 rounded-full bg-[#079432]/10 flex items-center justify-center mx-auto mb-6 shadow-xs border border-[#079432]/20">
            <Lock className="w-10 h-10 text-[#079432]" />
          </div>

          {/* H1 Headline */}
          <h1 className="font-montserrat text-2xl text-[#0B2E6B] font-black mb-3">
            Sponsor Profile Under Verification
          </h1>

          {/* Body Description */}
          <p className="font-inter text-[#0B2E6B]/70 leading-relaxed mb-6 text-xs md:text-sm">
            To uphold careful safeguarding and partnership review, sponsor access is granted only after an orientation call and manual approval. If approved, PWLIF will send a secure passwordless sign-in invitation to your email address.
          </p>

          {/* Review In Progress Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-xs font-bold tracking-wider text-[#079432] mb-8 border border-[#079432]/20">
            <span className="w-2 h-2 rounded-full bg-[#079432] animate-pulse" />
            <span>VERIFICATION IN PROGRESS</span>
          </div>

          {/* Action Links */}
          <div className="space-y-3">
            <Link
              href="/book-a-call"
              className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-xs"
            >
              <span>Schedule Sponsor Orientation</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-inter text-[#0B2E6B] hover:text-[#079432] text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Foundation Homepage</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Footer Note */}
      <footer className="max-w-7xl w-full mx-auto py-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between text-xs text-[#0B2E6B]/60 gap-2 border-t border-[#0B2E6B]/10">
        <div>&copy; 2026 Potential Without Limits International Foundation (PWLIF). All rights reserved.</div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-[#079432] transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#079432] transition">Terms of Service</Link>
          <Link href="/support" className="hover:text-[#079432] transition">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
