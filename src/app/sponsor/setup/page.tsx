"use client";

import Link from "next/link";

export default function SponsorSetupPage() {
  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#061D45] px-5 py-16">
      <div className="pwlif-motion-field" aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-white p-8 text-center shadow-2xl sm:p-10">
        <Link href="/" className="mb-4 inline-block"><img src="/pwlif-logo.png" alt="Potential Without Limits International Foundation" className="h-16 w-auto object-contain" /></Link>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">One-time sponsor invitation</p>
        <h1 className="font-montserrat text-3xl font-black tracking-[-0.04em] text-[#0B2E6B]">Set up your password from your invitation</h1>
        <p className="mt-4 font-inter text-sm leading-relaxed text-[#0B2E6B]/75">For security, password setup is completed on Firebase’s secure password page opened by your current PWLIF invitation email. After you choose a password, you will return to Sponsor Login.</p>
        <p className="mt-4 font-inter text-xs leading-relaxed text-[#0B2E6B]/60">This page cannot create a password when opened directly because it does not receive or store invitation codes.</p>
        <Link href="/login" className="mt-7 inline-flex rounded-xl bg-[#079432] px-5 py-3 font-montserrat text-xs font-extrabold text-white shadow-lg transition hover:bg-[#14B84A]">Go to Sponsor Login</Link>
      </div>
    </div>
  );
}
