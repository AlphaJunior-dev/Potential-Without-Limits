import Link from "next/link";
import { ArrowUpRight, Clock3, Construction } from "lucide-react";
import { PublicHero } from "@/components/PublicStory";

type ComingSoonPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ComingSoonPage({ eyebrow, title, description }: ComingSoonPageProps) {
  return (
    <main className="overflow-x-hidden bg-[#FCFCFA] text-[#0B2E6B]">
      <PublicHero
        dark
        eyebrow={eyebrow}
        title={title}
        intro={description}
        primaryAction={{ href: "/support", label: "Contact PWLIF" }}
        secondaryAction={{ href: "/mission-vision", label: "Our Mission" }}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/8 p-7 shadow-2xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#14B84A] text-white">
            <Construction className="h-5 w-5" />
          </span>
          <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9F1C3]">Coming soon</p>
          <p className="mt-3 font-montserrat text-2xl font-black leading-tight text-white">This space is being prepared with Foundation leadership.</p>
        </div>
      </PublicHero>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto grid max-w-5xl gap-7 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="rounded-[1.8rem] bg-[#F2F8F4] p-8 sm:p-10">
            <Clock3 className="h-8 w-8 text-[#079432]" />
            <p className="mt-8 font-montserrat text-3xl font-black tracking-[-0.045em] text-[#0B2E6B]">Under construction</p>
            <p className="mt-4 text-sm leading-7 text-[#0B2E6B]/72">PWLIF is confirming what is accurate and appropriate to share before this page is published.</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#079432]">Public information standard</p>
            <h2 className="mt-4 font-montserrat text-4xl font-black tracking-[-0.05em] text-[#0B2E6B]">No placeholder stories, media, or announcements.</h2>
            <p className="mt-5 text-sm leading-8 text-[#0B2E6B]/72">We would rather show an honest progress marker than publish unreviewed information. Please check back after the Foundation has approved this page’s content.</p>
            <Link href="/support" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0B2E6B] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5">
              Send an enquiry <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
