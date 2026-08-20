"use client";

import Link from "next/link";
import { ArrowUpRight, LockKeyhole, Play, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TalentPhoto } from "@/components/TalentPhoto";
import { EditorialSplit, PublicAction, PublicCtaBand, PublicHero, SectionHeading } from "@/components/PublicStory";

export default function HomePage() {
  const { profiles, foundationVideos, branding, userStatus } = useAuth();
  const featuredProfiles = profiles.slice(0, 3);
  const activeVideo = foundationVideos?.[0];
  const hasApprovedSponsorAccess = userStatus === "approved";

  return (
    <div className="overflow-x-hidden bg-[#FCFCFA] text-[#0B2E6B]">
      <PublicHero
        dark
        eyebrow={branding?.heroBadgeText || "Potential Without Limits International Foundation"}
        title={branding?.heroHeadline || "Potential moves when possibility has a pathway."}
        intro={branding?.heroSubheadline || "PWLIF creates careful, privacy-first conversations around learning, talent development, mentorship, and the people ready to support that journey."}
        primaryAction={{ href: "/talents", label: hasApprovedSponsorAccess ? "View Sponsor Talent Pipeline" : branding?.heroCtaText || "Explore Sponsor Talent" }}
        secondaryAction={{ href: "/book-a-call", label: branding?.heroSecondaryCtaText || "Book Sponsor Orientation" }}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/8 p-7 shadow-2xl backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,74,0.32),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(183,21,200,0.25),transparent_42%)]" />
          <div className="relative">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F7B500] text-[#061D45]"><Sparkles className="h-5 w-5" /></span>
            <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9F1C3]">PWLIF approach</p>
            <p className="mt-3 font-montserrat text-2xl font-bold leading-tight text-white">A considered introduction, not a public transaction.</p>
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/12 pt-5 text-[10px] font-bold uppercase tracking-[0.09em] text-white/60">
              <span>Listen</span><span>Orient</span><span>Connect</span>
            </div>
          </div>
        </div>
      </PublicHero>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <EditorialSplit
            number="01"
            eyebrow="The starting point"
            title="Every journey begins with a respectful conversation."
            aside={
              featuredProfiles[0]?.coverPhoto ? (
                <><TalentPhoto src={featuredProfiles[0].coverPhoto} alt="Sponsor Talent overview" fill className="object-cover" /><div className="absolute inset-x-0 bottom-0 z-10 p-7 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A9F1C3]">Sponsor Talent</p><p className="mt-2 font-montserrat text-2xl font-bold">Potential deserves a private, informed introduction.</p></div></>
              ) : (
                <div className="relative z-10 flex h-full min-h-[300px] items-end p-8"><div><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#14B84A] text-white"><ShieldCheck className="h-6 w-6" /></span><p className="mt-8 font-montserrat text-3xl font-black text-white">Possibility is not a profile.</p></div></div>
              )
            }
          >
            <p>PWLIF introduces supporters to the foundation’s talent-development approach before sharing additional context. Public information is deliberately non-identifying and may be updated or withdrawn at any time.</p>
            <div className="mt-8 flex flex-wrap gap-3"><PublicAction href="/mission-vision" label="How we work" /><Link href="/security-standards" className="inline-flex items-center gap-2 px-3 py-3 text-sm font-bold text-[#0B2E6B] hover:text-[#079432]">Our safeguards <ArrowUpRight className="h-4 w-4" /></Link></div>
          </EditorialSplit>
        </div>
      </section>

      <section className="border-y border-[#0B2E6B]/8 bg-[#F2F8F4] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Sponsor Talent" title="A glimpse of potential—shared with care." intro={hasApprovedSponsorAccess ? "Your approved sponsor account can explore the full private pipeline from the directory." : "These public overviews reflect only information PWLIF administrators have approved for public display."} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredProfiles.map((profile, index) => (
              <article key={profile.id} className="group overflow-hidden rounded-[1.8rem] bg-white shadow-[0_16px_48px_rgba(11,46,107,0.09)]">
                <div className="relative aspect-[4/3] bg-[#061D45]">
                  <TalentPhoto src={profile.coverPhoto} alt="Sponsor Talent overview" fill className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061D45]/85 to-transparent p-5"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A9F1C3]">0{index + 1} / {profile.category || "Sponsor Talent"}</span></div>
                </div>
                <div className="p-6"><h3 className="font-montserrat text-2xl font-black tracking-[-0.03em] text-[#0B2E6B]">{profile.name || "Sponsor Talent"}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-[#0B2E6B]/66">{profile.bio || profile.dream || "An approved non-identifying overview will appear here."}</p><Link href={`/portfolio/${profile.id}`} className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#079432] hover:text-[#14B84A]">Explore overview <ArrowUpRight className="h-4 w-4" /></Link></div>
              </article>
            ))}
          </div>
          {featuredProfiles.length === 0 && <div className="mt-10 rounded-[1.8rem] border border-dashed border-[#0B2E6B]/18 bg-white p-10 text-sm text-[#0B2E6B]/65">No public Sponsor Talent overviews are currently available. PWLIF administrators can publish safe, non-identifying profiles from the Admin Portal.</div>}
          <div className="mt-10"><PublicAction href="/talents" label={hasApprovedSponsorAccess ? "Open private Talent directory" : "View Sponsor Talent"} /></div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl"><EditorialSplit number="02" reverse eyebrow="Foundation introduction" title="An invitation to understand the work before taking part." aside={
          activeVideo ? <video src={activeVideo.videoUrl} controls className="relative z-10 h-full w-full object-cover" /> : <div className="relative z-10 flex h-full min-h-[300px] flex-col justify-end p-8"><span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"><Play className="h-5 w-5 fill-white" /></span><p className="mt-8 max-w-sm font-montserrat text-3xl font-black text-white">Foundation introduction footage will be shared here.</p><p className="mt-3 max-w-sm text-sm leading-6 text-white/70">No video is displayed until it is approved and attached by a PWLIF administrator.</p></div>
        }><p>{branding?.videoSectionSubtitle || "The orientation process helps supporters understand the foundation’s approach, privacy safeguards, and appropriate next steps."}</p><Link href="/book-a-call" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#079432] hover:text-[#14B84A]">Begin with orientation <ArrowUpRight className="h-4 w-4" /></Link></EditorialSplit></div>
      </section>

      <section className="bg-[#061D45] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl"><SectionHeading dark eyebrow="A careful pathway" title="From initial interest to an appropriate private connection." intro="PWLIF’s process remains considered at every stage." /><div className="mt-12 grid gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 md:grid-cols-3">{[["01", "Share your context", "Tell us briefly about the work you do and the kind of conversation you hope to have."],["02", "Book orientation", "Use the private intake and booking step to arrange an appropriate introductory call."],["03", "Proceed thoughtfully", "Access and deeper information are considered only after the orientation process."]].map(([number, title, copy]) => <div key={number} className="bg-[#061D45] p-8"><span className="font-montserrat text-5xl font-black text-[#14B84A]">{number}</span><h3 className="mt-10 font-montserrat text-2xl font-bold text-white">{title}</h3><p className="mt-4 text-sm leading-7 text-white/62">{copy}</p></div>)}</div></div>
      </section>

      <PublicCtaBand eyebrow="The next conversation" title="Explore what thoughtful support could make possible." intro="Start with a private orientation. PWLIF will guide the next appropriate step from there." action={{ href: "/book-a-call", label: "Book Sponsor Orientation" }} />
    </div>
  );
}
