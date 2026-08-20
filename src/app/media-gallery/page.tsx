import Link from "next/link";
import { Camera, Film, Images, LockKeyhole } from "lucide-react";
import { PublicCtaBand, PublicHero, SectionHeading } from "@/components/PublicStory";

export default function MediaGalleryPage() {
  return (
    <main className="overflow-x-hidden bg-[#FCFCFA] text-[#0B2E6B]">
      <PublicHero
        dark
        eyebrow="Media gallery"
        title="Images and film, published with permission."
        intro="This gallery is reserved for approved PWLIF media. The foundation does not publish identifiable imagery or video without the appropriate review and permissions."
        primaryAction={{ href: "/security-standards", label: "Media Safeguards" }}
        secondaryAction={{ href: "/support", label: "Media Enquiry" }}
      >
        <div className="relative grid min-h-[260px] grid-cols-2 gap-3 overflow-hidden rounded-[2rem] border border-white/15 bg-white/8 p-4 shadow-2xl"><div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4"><Camera className="h-7 w-7 text-[#A9F1C3]" /><p className="mt-20 text-[10px] font-bold uppercase tracking-[0.15em] text-white/65">Photography</p></div><div className="mt-9 rounded-[1.25rem] border border-white/10 bg-[#14B84A]/20 p-4"><Film className="h-7 w-7 text-[#F7B500]" /><p className="mt-20 text-[10px] font-bold uppercase tracking-[0.15em] text-white/65">Film</p></div></div>
      </PublicHero>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Approved media" title="No public gallery items are available yet." intro="When PWLIF publishes approved media, it will appear here with the appropriate context. This page does not display demo images or unverified material." /><div className="mt-12 grid gap-5 md:grid-cols-3">{[["Photography", "Only foundation-approved imagery with clear public-use permission."],["Foundation film", "Only video that has been reviewed and released for public viewing."],["Talent media", "Only non-identifying media where the administrator has enabled public visibility."]].map(([title, copy], index) => <article key={title} className="relative min-h-[260px] overflow-hidden rounded-[1.8rem] bg-[#0B2E6B] p-7 text-white"><span className="absolute -right-3 -top-7 font-montserrat text-9xl font-black text-white/5">0{index + 1}</span><LockKeyhole className="relative h-6 w-6 text-[#A9F1C3]" /><h2 className="relative mt-20 font-montserrat text-2xl font-black">{title}</h2><p className="relative mt-3 text-sm leading-7 text-white/65">{copy}</p></article>)}</div></div></section>

      <section className="border-y border-[#0B2E6B]/8 bg-[#F2F8F4] px-5 py-16 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl items-start gap-4"><Images className="mt-1 h-8 w-8 shrink-0 text-[#079432]" /><p className="text-sm leading-7 text-[#0B2E6B]/72">If you are looking for an official image, film, or media permission, contact PWLIF first. Materials are not made public merely because they exist.</p></div></section>

      <PublicCtaBand eyebrow="Media and privacy" title="Protection comes before publication." intro="Read the foundation’s safeguarding standards or contact PWLIF with a media-related enquiry." action={{ href: "/security-standards", label: "Read Safeguards" }} />
    </main>
  );
}
