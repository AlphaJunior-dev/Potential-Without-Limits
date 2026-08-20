import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, ShieldCheck, Sparkles } from "lucide-react";
import { EditorialSplit, PublicCtaBand, PublicHero, SectionHeading } from "@/components/PublicStory";

export default function StoriesLearningPage() {
  return (
    <main className="overflow-x-hidden bg-[#FCFCFA] text-[#0B2E6B]">
      <PublicHero
        eyebrow="Stories & learning"
        title="Learning should deepen understanding, not expose a person."
        intro="PWLIF will share consent-aware reflections on mentorship, access, learning, and support only when they are appropriate for public context."
        primaryAction={{ href: "/our-pilot", label: "Explore Our Approach" }}
        secondaryAction={{ href: "/security-standards", label: "Read Our Safeguards" }}
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0B2E6B] p-8 text-white shadow-2xl"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,74,0.34),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(10,140,245,0.28),transparent_45%)]" /><div className="relative"><BookOpenCheck className="h-9 w-9 text-[#A9F1C3]" /><p className="mt-16 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9F1C3]">Learning with dignity</p><p className="mt-3 font-montserrat text-2xl font-black leading-tight">The person is always more important than the story.</p></div></div>
      </PublicHero>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="mx-auto max-w-7xl"><EditorialSplit number="01" eyebrow="The publishing principle" title="Context before conclusions." aside={<div className="relative z-10 flex h-full min-h-[300px] flex-col justify-end p-8 text-white"><ShieldCheck className="h-10 w-10 text-[#A9F1C3]" /><p className="mt-10 font-montserrat text-3xl font-black">Nothing shared here will identify or pressure a young person.</p></div>}><p>When PWLIF has a lesson that is suitable to share, it will describe the foundation’s approach and learning—not turn a young person’s circumstances into content.</p><Link href="/security-standards" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#079432] hover:text-[#14B84A]">How safeguarding shapes publication <ArrowUpRight className="h-4 w-4" /></Link></EditorialSplit></div></section>

      <section className="bg-[#061D45] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10"><div className="mx-auto max-w-7xl"><SectionHeading dark eyebrow="Coming when verified" title="No public learning notes have been published yet." intro="Future notes may cover mentoring practice, the orientation process, responsible partnership, and other foundation learning once authorised for release." /><div className="mt-12 grid gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 md:grid-cols-3">{[["Respect", "Keep people at the centre of every decision."],["Accuracy", "Share only information the foundation can stand behind."],["Consent", "Never assume that a person’s story is available to publish."]].map(([title, copy], index) => <div key={title} className="bg-[#061D45] p-8"><span className="font-montserrat text-5xl font-black text-[#14B84A]">0{index + 1}</span><h2 className="mt-10 font-montserrat text-2xl font-bold">{title}</h2><p className="mt-3 text-sm leading-7 text-white/65">{copy}</p></div>)}</div></div></section>

      <PublicCtaBand eyebrow="Understand the work" title="A thoughtful partnership starts with shared context." intro="Use PWLIF’s orientation pathway to discuss the work before seeking deeper involvement." action={{ href: "/book-a-call", label: "Book Orientation" }} />
    </main>
  );
}
