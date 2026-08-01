"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowLeft, HelpCircle } from "lucide-react";
import { WlpLogo } from "@/components/WlpLogo";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-wlp-alabaster p-4 md:p-8 font-inter">
      {/* Top Security Portal Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 border-b border-wlp-navy/5">
        <div className="flex items-center gap-3">
          <Link href="/">
            <WlpLogo showText={false} className="h-8 w-auto" />
          </Link>
          <span className="text-wlp-navy/30 font-light">|</span>
          <span className="text-xs font-montserrat font-bold tracking-widest text-wlp-navy/60 uppercase">
            Security Portal
          </span>
        </div>
        <button
          className="text-wlp-navy/40 hover:text-wlp-navy transition"
          title="Contact Support"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      {/* Main Waiting Room Card Container */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="bg-wlp-white max-w-lg w-full rounded-2xl shadow-md p-10 text-center border border-wlp-navy/5 relative overflow-hidden">
          {/* Top Subtle Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-wlp-coral via-wlp-navy to-wlp-coral" />

          {/* Visual: Lock Icon */}
          <div className="w-20 h-20 rounded-full bg-wlp-alabaster flex items-center justify-center mx-auto mb-6 shadow-xs border border-wlp-navy/5">
            <Lock className="w-10 h-10 text-wlp-navy" />
          </div>

          {/* H1 Headline */}
          <h1 className="font-montserrat text-2xl text-wlp-navy font-bold mb-4">
            Account Pending Verification
          </h1>

          {/* Body Description */}
          <p className="font-inter text-wlp-navy/70 leading-relaxed mb-6 text-sm md:text-base">
            To protect the privacy and security of our youth, all sponsor accounts require manual review. You will receive an email once our team has verified your credentials.
          </p>

          {/* Review In Progress Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full text-xs font-semibold tracking-wider text-stone-600 mb-8 border border-stone-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>REVIEW IN PROGRESS</span>
          </div>

          {/* Action Links */}
          <div className="space-y-3">
            <Link
              href="/book-a-call"
              className="w-full bg-wlp-navy text-wlp-white font-bold py-3 px-6 rounded-xl hover:bg-black transition shadow-sm flex items-center justify-center gap-2 text-xs"
            >
              <span>Schedule Vetting Call with Founder</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-inter text-wlp-navy hover:text-wlp-coral text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Exhibition Grid</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Footer Note */}
      <footer className="max-w-7xl w-full mx-auto py-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between text-xs text-wlp-navy/50 gap-2 border-t border-wlp-navy/5">
        <div>&copy; 2026 Without Limits Potential. Secure Environment.</div>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-wlp-navy transition">Privacy Policy</Link>
          <Link href="#" className="hover:text-wlp-navy transition">Terms of Service</Link>
          <Link href="#" className="hover:text-wlp-navy transition">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
