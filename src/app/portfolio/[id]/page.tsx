import Link from "next/link";
import { ArrowUpRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { PublicCtaBand, PublicHero } from "@/components/PublicStory";

export default function PortfolioDetailPage() {
  return <div className="bg-[#FCFCFA] text-[#0B2E6B]">
    <PublicHero dark eyebrow="Sponsor Talent" title="Private conversations are the right next step." intro="Individual Sponsor Talent profiles and media are not part of this public launch. PWLIF will guide an appropriate next step after orientation." primaryAction={{ href: "/book-a-call", label: "Book sponsor orientation" }}>
      <div className="rounded-[1.75rem] border border-white/12 bg-white/7 p-6 text-white backdrop-blur-sm"><LockKeyhole className="h-7 w-7 text-[#A9F1C3]" /><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A9F1C3]">Public release</p><p className="mt-3 font-montserrat text-xl font-bold">Individual details are shared privately.</p></div>
    </PublicHero>
    <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10"><div className="mx-auto max-w-5xl rounded-[2rem] border border-[#0B2E6B]/10 bg-white p-8 shadow-[0_16px_42px_rgba(11,46,107,0.08)] sm:p-12"><ShieldCheck className="h-8 w-8 text-[#079432]" /><h1 className="mt-8 font-montserrat text-4xl font-black tracking-[-0.045em] text-[#0B2E6B]">Sponsor Talent discussions begin with orientation.</h1><p className="mt-6 max-w-3xl text-base leading-8 text-[#0B2E6B]/70">To protect personal information and ensure every conversation is appropriate, this direct profile link does not display a public Talent record in the limited launch.</p><div className="mt-9 flex flex-wrap gap-4"><Link href="/book-a-call" className="inline-flex items-center gap-2 rounded-full bg-[#079432] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#14B84A]">Book orientation <ArrowUpRight className="h-4 w-4" /></Link><Link href="/talents" className="inline-flex items-center gap-2 rounded-full border border-[#0B2E6B]/14 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#0B2E6B] transition hover:border-[#079432] hover:text-[#079432]">Sponsor Talent approach</Link></div></div></section>
    <PublicCtaBand eyebrow="The next conversation" title="Start with a private orientation." intro="PWLIF will guide the appropriate next step after learning more about your organisation and interest." action={{ href: "/book-a-call", label: "Book Sponsor Orientation" }} />
  </div>;
}
