"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FCFCFA] px-4 py-16 bg-foundation-pattern">
      <div className="bg-white max-w-lg w-full p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#0B2E6B]/10 text-center space-y-6">
        <Link href="/" className="inline-block mb-2">
          <img
            src="/pwlif-logo.png"
            alt="Potential Without Limits International Foundation"
            className="h-16 w-auto mx-auto object-contain"
          />
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-[#079432]/10 text-[#079432] border border-[#079432]/20 flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6 text-[#079432]" />
        </div>

        <h1 className="font-montserrat text-2xl font-black text-[#0B2E6B]">
          Orientation Call Required
        </h1>

        <p className="font-inter text-sm text-[#0B2E6B]/75 leading-relaxed max-w-md mx-auto">
          Sponsor access is considered only after an orientation call and manual approval. If approved, PWLIF sends a secure passwordless invitation by email.
        </p>

        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#0B2E6B]/10 text-xs text-[#0B2E6B]/70 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#079432] shrink-0" />
          <span>Manual approval and safeguarding review required</span>
        </div>

        <div className="pt-2">
          <Link
            href="/book-a-call"
            className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-xs"
          >
            <span>Book Your 15-Min Orientation Call</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>

        <div className="pt-2 border-t border-[#0B2E6B]/10 text-xs text-[#0B2E6B]/60">
          Already received a sponsor invitation?{" "}
          <Link href="/login" className="text-[#079432] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
