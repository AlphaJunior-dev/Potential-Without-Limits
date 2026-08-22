"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#061D45] px-5 py-16">
      <div className="pwlif-motion-field" aria-hidden="true" />
      <div className="relative bg-white max-w-lg w-full p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white/20 text-center space-y-6">
        <Link href="/" className="inline-block mb-2">
          <img src="/pwlif-logo.png" alt="Potential Without Limits International Foundation" className="h-16 w-auto mx-auto object-contain" />
        </Link>
        <div className="w-12 h-12 rounded-2xl bg-[#079432]/10 text-[#079432] border border-[#079432]/20 flex items-center justify-center mx-auto"><Calendar className="w-6 h-6 text-[#079432]" /></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Private sponsor pathway</p>
        <h1 className="font-montserrat text-3xl font-black tracking-[-0.04em] text-[#0B2E6B]">Orientation Call Required</h1>
        <p className="font-inter text-sm text-[#0B2E6B]/75 leading-relaxed max-w-md mx-auto">Sponsor access is considered only after an orientation call and manual approval. If approved, PWLIF sends a secure email for you to choose a password.</p>
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#0B2E6B]/10 text-xs text-[#0B2E6B]/70 flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4 text-[#079432] shrink-0" /><span>Manual approval and safeguarding review required</span></div>
        <div className="pt-2"><Link href="/book-a-call" className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-xs"><span>Book Your 15-Min Orientation Call</span><ArrowRight className="w-4 h-4 text-white" /></Link></div>
        <div className="pt-2 border-t border-[#0B2E6B]/10 text-xs text-[#0B2E6B]/60">Already received a sponsor invitation? <Link href="/login" className="text-[#079432] font-bold hover:underline">Sign In Here</Link></div>
      </div>
    </div>
  );
}
