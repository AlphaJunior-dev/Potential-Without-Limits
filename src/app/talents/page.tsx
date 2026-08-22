import Link from "next/link";
import { ArrowUpRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { PublicCtaBand, PublicHero, SectionHeading } from "@/components/PublicStory";

export default function TalentsPage() {
  return (
    <div className="bg-[#FCFCFA]">
      <PublicHero
        dark
        eyebrow="Sponsor Talent"
        title="Start with orientation, not a public profile."
        intro="PWLIF introduces prospective sponsors to its safeguarding-aware Talent approach through a private orientation conversation. Individual records and media are not part of the current public release."
        primaryAction={{ href: "/book-a-call", label: "Begin sponsor orientation" }}
      >
        <div className="rounded-[1.75rem] border border-white/12 bg-white/7 p-6 text-white backdrop-blur-sm"><ShieldCheck className="h-7 w-7 text-[#A9F1C3]" /><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A9F1C3]">Release note</p><p className="mt-3 font-montserrat text-xl font-bold">A privacy-first public introduction.</p></div>
      </PublicHero>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="How the public pathway works" title="A thoughtful conversation before a connection." intro="This launch keeps public information intentionally high-level while the Foundation completes its Talent media review process." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Share your context", "Tell PWLIF about your organisation, interest, and the type of support conversation you hope to have."],
              ["02", "Book orientation", "Complete the private orientation request and choose a suitable time for an introductory call."],
              ["03", "Proceed appropriately", "The Foundation will guide any next step through its safeguarding-aware private process."],
            ].map(([number, title, copy]) => <article key={number} className="rounded-[1.75rem] border border-[#0B2E6B]/10 bg-white p-7 shadow-[0_12px_30px_rgba(11,46,107,0.06)]"><span className="font-montserrat text-4xl font-black text-[#14B84A]">{number}</span><h2 className="mt-9 font-montserrat text-2xl font-black tracking-[-0.035em] text-[#0B2E6B]">{title}</h2><p className="mt-4 text-sm leading-7 text-[#0B2E6B]/68">{copy}</p></article>)}
          </div>
          <div className="mt-12 rounded-[1.75rem] border border-[#0B2E6B]/10 bg-[#EAF7EF] p-8 sm:flex sm:items-center sm:justify-between sm:gap-8"><div className="flex gap-4"><LockKeyhole className="mt-1 h-6 w-6 shrink-0 text-[#079432]" /><div><h2 className="font-montserrat text-2xl font-black tracking-[-0.035em] text-[#0B2E6B]">Sponsor Talent details are arranged privately.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#0B2E6B]/68">Individual records, photos, and video are not presented on this public launch page.</p></div></div><Link href="/book-a-call" className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full bg-[#079432] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#14B84A] sm:mt-0">Book orientation <ArrowUpRight className="h-4 w-4" /></Link></div>
        </div>
      </section>
      <PublicCtaBand eyebrow="The next conversation" title="Begin with a private orientation." intro="PWLIF will guide the appropriate next step after learning more about your organisation and interest." action={{ href: "/book-a-call", label: "Book Sponsor Orientation" }} />
    </div>
  );
}
