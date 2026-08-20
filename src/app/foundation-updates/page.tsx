import Link from "next/link";
import { ArrowUpRight, BellRing, CheckCircle2, Clock3 } from "lucide-react";
import { PublicCtaBand, PublicHero, SectionHeading } from "@/components/PublicStory";

export default function FoundationUpdatesPage() {
  return (
    <main className="overflow-x-hidden bg-[#FCFCFA] text-[#0B2E6B]">
      <PublicHero
        dark
        eyebrow="News & updates"
        title="Foundation updates, shared with care."
        intro="This is PWLIF’s place for verified operational updates, programme notices, and announcements that the foundation has approved for public release."
        primaryAction={{ href: "/book-a-call", label: "Book Sponsor Orientation" }}
        secondaryAction={{ href: "/support", label: "Contact PWLIF" }}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/8 p-8 shadow-2xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#14B84A] text-white"><BellRing className="h-5 w-5" /></span>
          <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9F1C3]">Publication standard</p>
          <p className="mt-3 font-montserrat text-2xl font-black leading-tight text-white">Clear, current, and verified before it is shared.</p>
        </div>
      </PublicHero>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Current notices" title="No public updates have been published yet." intro="PWLIF will add updates here when there is information that is appropriate, accurate, and ready to share publicly." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["Foundation notices", "Operational announcements and public milestones, once approved."],
              ["Programme context", "High-level learning and approach updates that do not identify any young person."],
              ["Community information", "Time-sensitive public information only where the foundation can verify it."],
            ].map(([title, copy], index) => <article key={title} className="rounded-[1.7rem] border border-[#0B2E6B]/10 bg-white p-7 shadow-[0_14px_40px_rgba(11,46,107,0.06)]"><span className="font-montserrat text-4xl font-black text-[#14B84A]">0{index + 1}</span><h2 className="mt-9 font-montserrat text-2xl font-black tracking-[-0.04em]">{title}</h2><p className="mt-3 text-sm leading-7 text-[#0B2E6B]/70">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-y border-[#0B2E6B]/8 bg-[#F2F8F4] px-5 py-16 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center"><Clock3 className="h-9 w-9 text-[#079432]" /><p className="max-w-3xl text-sm leading-7 text-[#0B2E6B]/72">Updates are added only by authorised PWLIF administrators. This page will never use placeholder announcements, outcomes, or statistics to create the appearance of activity.</p></div></section>

      <PublicCtaBand eyebrow="Stay connected" title="Begin with the right conversation." intro="For Sponsor Talent, partnership, or orientation enquiries, PWLIF starts with a private, respectful introduction." action={{ href: "/book-a-call", label: "Book Orientation" }} />
    </main>
  );
}
