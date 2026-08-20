import Link from "next/link";
import { ArrowUpRight, CircleCheck, ShieldCheck } from "lucide-react";
import { PublicCtaBand, PublicHero } from "@/components/PublicStory";

const pathway = [
  ["01", "Share context", "Tell PWLIF about your organisation, work, and the kind of responsible support you would like to explore."],
  ["02", "Schedule orientation", "After the private form is saved, choose a Calendly time for an introductory conversation."],
  ["03", "Explore fit", "A founder-led conversation considers whether there is a responsible path to continue."],
];

export default function PartnershipPage() {
  return <div className="bg-[#FCFCFA]"><PublicHero dark eyebrow="Partnership approach" title="Conversation before commitment." intro="PWLIF treats early partnership as a careful process, not a public marketplace for children or outcomes." primaryAction={{ href: "/orientation", label: "Request orientation" }} />
    <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10"><div className="mx-auto max-w-7xl"><div className="grid gap-5 md:grid-cols-3">{pathway.map(([number, title, body]) => <article key={number} className="group rounded-[1.75rem] border border-[#0B2E6B]/10 bg-white p-7 shadow-[0_14px_40px_rgba(11,46,107,0.07)] transition hover:-translate-y-1 hover:border-[#079432]/35"><p className="font-montserrat text-5xl font-black tracking-[-0.07em] text-[#F7B500]">{number}</p><h2 className="mt-8 font-montserrat text-2xl font-black tracking-[-0.04em] text-[#0B2E6B]">{title}</h2><p className="mt-4 text-sm leading-7 text-[#0B2E6B]/70">{body}</p><CircleCheck className="mt-8 h-5 w-5 text-[#079432]" /></article>)}</div><div className="mt-16 grid gap-10 border-y border-[#0B2E6B]/10 py-14 lg:grid-cols-[0.7fr_1.3fr]"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">A clear boundary</p><div><h2 className="font-montserrat text-4xl font-black tracking-[-0.05em] text-[#0B2E6B]">What early partnership is not.</h2><p className="mt-5 max-w-3xl text-base leading-8 text-[#0B2E6B]/70">It is not a child-selection process, a sponsor credential system, a payment platform, or a promise of direct aid. Orientation exists to begin a respectful, safeguarding-aware conversation.</p></div></div></div></section><PublicCtaBand eyebrow="Start carefully" title="Explore the appropriate pathway." intro="Share your context privately before any deeper discussion." action={{ href: "/orientation", label: "Request orientation" }} /></div>;
}
