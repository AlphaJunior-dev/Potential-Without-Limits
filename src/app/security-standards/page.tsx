"use client";

import Link from "next/link";
import { CheckCircle2, Eye, FileCheck, Lock, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PublicCtaBand, PublicHero } from "@/components/PublicStory";

export default function SecurityStandardsPage() {
  const { legalSecurity } = useAuth();
  const principles = [
    ["01", "Controlled publication", legalSecurity.securityStandardsContent, FileCheck],
    ["02", "Respectful representation", "PWLIF does not publish sensationalized or unnecessary personal information. Sponsor Talent information is shared only when it is appropriate, respectful, and explicitly enabled through field-level publication controls.", Eye],
    ["03", "Zero direct unmonitored contact", "The public site does not expose direct contact channels, private addresses, or unnecessary identifying details. Sponsor access is considered only after orientation, manual approval, and a secure email-link invitation.", Lock],
    ["04", "Data minimisation", "PWLIF limits public information to the minimum appropriate Sponsor Talent details. Individual record visibility can be reviewed, edited, or withdrawn by authorised administrators at any time.", Users],
    ["05", "Appropriate information scope", "Financial contributions, tax receipts, and transparency reports are not provided through this website or sponsor portal. Appropriate partnership information is discussed through private, review-based conversations.", CheckCircle2],
  ];
  return <div className="bg-[#FCFCFA]"><PublicHero dark eyebrow="Safeguarding & privacy" title="Dignity shapes every public decision." intro="PWLIF publishes and shares information through a privacy-first, safeguarding-aware framework." primaryAction={{ href: "/book-a-call", label: "Book Sponsor Orientation" }} />
    <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10"><div className="mx-auto max-w-7xl"><div className="grid gap-x-16 gap-y-12 lg:grid-cols-[0.75fr_1.25fr]">{principles.map(([number, title, body, Icon]) => { const PrincipleIcon = Icon as typeof Lock; return <article key={number as string} className="contents"><div className="border-t border-[#0B2E6B]/12 pt-7"><p className="font-montserrat text-4xl font-black tracking-[-0.07em] text-[#F7B500]">{number as string}</p></div><div className="border-t border-[#0B2E6B]/12 pt-7"><PrincipleIcon className="h-6 w-6 text-[#079432]" /><h2 className="mt-5 font-montserrat text-3xl font-black tracking-[-0.04em] text-[#0B2E6B]">{title as string}</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-[#0B2E6B]/70">{body as string}</p></div></article>; })}</div><div className="mt-16 flex flex-col justify-between gap-6 rounded-[1.75rem] bg-[#EAF7EF] p-7 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><ShieldCheck className="h-7 w-7 shrink-0 text-[#079432]" /><p className="text-sm font-semibold text-[#0B2E6B]">Safeguarding &amp; Privacy Framework · PWLIF</p></div><Link href="/book-a-call" className="inline-flex items-center justify-center rounded-full border border-[#079432]/25 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#079432] hover:border-[#079432]">Schedule orientation</Link></div></div></section><PublicCtaBand eyebrow="Private conversations" title="The right details are shared in the right setting." intro="Begin with a safeguarding-aware orientation conversation." action={{ href: "/book-a-call", label: "Book orientation" }} /></div>;
}
