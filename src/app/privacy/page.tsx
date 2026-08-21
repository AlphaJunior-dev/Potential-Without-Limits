"use client";

import Link from "next/link";
import { ArrowUpRight, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PublicHero } from "@/components/PublicStory";

export default function PrivacyPage() {
  const { legalSecurity } = useAuth();
  return <div className="bg-[#FCFCFA]"><PublicHero dark eyebrow="Privacy & youth protection" title="Privacy is part of the foundation’s practice." intro="PWLIF’s information boundaries are designed to reduce unnecessary exposure and protect dignity." primaryAction={{ href: "/security-standards", label: "View security standards" }} />
    <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10"><article className="mx-auto max-w-4xl rounded-[2rem] border border-[#0B2E6B]/10 bg-white p-7 shadow-[0_20px_60px_rgba(11,46,107,0.08)] sm:p-12"><div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#0B2E6B]/10 pb-8"><div className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF7EF]"><Lock className="h-5 w-5 text-[#079432]" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#079432]">Institutional policy</p><h1 className="mt-2 font-montserrat text-3xl font-black tracking-[-0.04em] text-[#0B2E6B]">Privacy Shield Policy &amp; Youth Protection</h1></div></div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#0B2E6B]/48">Updated {legalSecurity?.lastUpdated || "2026-08-01"}</p></div><div className="mt-9 whitespace-pre-wrap text-sm leading-8 text-[#0B2E6B]/72">{legalSecurity?.privacyContent || "PWLIF has not yet published a privacy policy. Please contact the foundation for current privacy information."}</div><div className="mt-10 flex flex-col justify-between gap-4 border-t border-[#0B2E6B]/10 pt-7 sm:flex-row sm:items-center"><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#079432]"><ShieldCheck className="h-4 w-4" />Institutional privacy policy</span><Link href="/security-standards" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0B2E6B] hover:text-[#079432]">Inspect security standards <ArrowUpRight className="h-4 w-4" /></Link></div></article></section></div>;
}
