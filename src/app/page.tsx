"use client";

import Link from "next/link";
import { ArrowUpRight, Lock, MessageCircleHeart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TalentPhoto } from "@/components/TalentPhoto";
import { EditorialSplit, PublicAction, PublicCtaBand, SectionHeading } from "@/components/PublicStory";

export default function HomePage() {
  const { profiles, publicProfiles, branding, userStatus } = useAuth();
  const hasApprovedSponsorAccess = userStatus === "approved";
  const featuredProfiles = (hasApprovedSponsorAccess ? profiles : publicProfiles).slice(0, 3);

  return (
    <div className="overflow-x-hidden bg-[#FCFCFA] text-[#0B2E6B]">
      <section className="bg-[#FCFCFA] px-3 pb-4 pt-3 sm:px-5 sm:pb-6 lg:px-8" aria-label="PWLIF hero">
        <div className="relative mx-auto flex min-h-[38rem] max-w-[92rem] items-center justify-center overflow-hidden rounded-[1.75rem] bg-[#061D45] px-6 py-20 text-center shadow-[0_26px_72px_rgba(6,29,69,0.18)] sm:min-h-[42rem] sm:rounded-[2.25rem] sm:px-10 lg:min-h-[calc(100vh-7rem)] lg:px-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/manus-storage/pwlif-community-learning-hero_1f04debf.jpg')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,45,0.86)_0%,rgba(6,29,69,0.7)_36%,rgba(6,29,69,0.56)_64%,rgba(4,15,35,0.88)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,17,39,0.38)_0%,transparent_35%,rgba(3,17,39,0.72)_100%)]" aria-hidden="true" />
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D7F6E2] sm:text-[11px]">
              <span className="h-px w-7 bg-[#A9F1C3]" />
              {branding?.heroBadgeText || "Potential Without Limits International Foundation"}
              <span className="h-px w-7 bg-[#A9F1C3]" />
            </p>
            <h1 className="pwlif-hero-display mt-7 max-w-4xl text-5xl font-black leading-[0.97] tracking-[-0.055em] text-white drop-shadow-[0_5px_18px_rgba(0,0,0,0.35)] sm:mt-8 sm:text-6xl md:text-7xl lg:text-[5.7rem]">
              {branding?.heroHeadline || "Potential moves when possibility has a pathway."}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
              {branding?.heroSubheadline || "PWLIF creates careful, privacy-first conversations around learning, talent development, mentorship, and the people ready to support that journey."}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={hasApprovedSponsorAccess ? "/sponsor/dashboard" : "/talents"} className="inline-flex min-w-56 items-center justify-center gap-2 rounded-xl bg-[#14B84A] px-6 py-4 text-sm font-bold text-[#061D45] shadow-[0_10px_0_rgba(1,42,25,0.75)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#A9F1C3] active:translate-y-0 active:scale-[0.98]">
                {hasApprovedSponsorAccess ? "View Sponsor Talent Pipeline" : branding?.heroCtaText || "Explore Sponsor Talent"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={hasApprovedSponsorAccess ? "/sponsor/dashboard" : "/book-a-call"} className="inline-flex min-w-56 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/8 px-6 py-4 text-sm font-bold text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#A9F1C3] hover:bg-white/16 active:translate-y-0 active:scale-[0.98]">
                {hasApprovedSponsorAccess ? "Open Partnership Desk" : branding?.heroSecondaryCtaText || "Book Sponsor Orientation"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 hidden w-[min(90%,50rem)] -translate-x-1/2 items-center justify-between border-t border-white/20 pt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-white/60 sm:flex" aria-hidden="true">
            <span>Listen with care</span><span className="h-px flex-1 bg-white/18 mx-5" /><span>Open appropriate pathways</span><span className="h-px flex-1 bg-white/18 mx-5" /><span>Grow potential</span>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <EditorialSplit
            number="01"
            eyebrow="The starting point"
            title="Every journey begins with a respectful conversation."
            aside={<div className="relative z-10 flex h-full min-h-[300px] flex-col justify-between overflow-hidden p-8"><div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border border-[#14B84A]/50" /><div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full border border-[#0A8CF5]/40" /><div className="relative"><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#14B84A] text-white"><MessageCircleHeart className="h-6 w-6" /></span><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A9F1C3]">The PWLIF starting point</p><p className="mt-3 max-w-sm font-montserrat text-3xl font-black leading-tight text-white">A respectful conversation, before any introduction.</p></div><div className="relative flex items-center gap-3 border-t border-white/15 pt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/65"><span>Listen</span><span className="h-px flex-1 bg-white/15" /><span>Orient</span><span className="h-px flex-1 bg-white/15" /><span>Connect</span></div></div>}
          >
            <p>PWLIF introduces supporters to the foundation’s talent-development approach before sharing additional context. Public information is deliberately non-identifying and may be updated or withdrawn at any time.</p>
            <div className="mt-8 flex flex-wrap gap-3"><PublicAction href="/mission-vision" label="How we work" /><Link href="/security-standards" className="inline-flex items-center gap-2 px-3 py-3 text-sm font-bold text-[#0B2E6B] hover:text-[#079432]">Our safeguards <ArrowUpRight className="h-4 w-4" /></Link></div>
          </EditorialSplit>
        </div>
      </section>

      <section className="border-y border-[#0B2E6B]/8 bg-[#F2F8F4] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Sponsor Talent" title="A glimpse of potential—shared with care." intro={hasApprovedSponsorAccess ? "Your approved sponsor account can explore the full private pipeline from the directory." : "These public overviews show only the information PWLIF administrators have explicitly approved for public display."} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredProfiles.map((profile, index) => {
              const visibility = profile.publicVisibility;
              const canSee = (field: "photoVisible" | "summaryVisible" | "storyVisible") => hasApprovedSponsorAccess || visibility?.[field] === true;
              const canSeePhoto = canSee("photoVisible") && Boolean(profile.coverPhoto && profile.coverPhoto !== "/pwlif-logo.png");
              const overview = (canSee("storyVisible") && profile.story) || (canSee("summaryVisible") && profile.bio) || "A carefully reviewed, non-identifying overview will appear here when PWLIF chooses to share more.";
              return <article key={profile.id} className="group overflow-hidden rounded-[1.8rem] bg-white shadow-[0_16px_48px_rgba(11,46,107,0.09)]">
                <div className="relative aspect-[4/3] bg-[#061D45]">
                  {canSeePhoto ? <TalentPhoto src={profile.coverPhoto} alt="Sponsor Talent overview" fill className="object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_72%_22%,rgba(20,184,74,0.25),transparent_38%),linear-gradient(135deg,#061D45,#0B2E6B)]"><div className="text-center"><Lock className="mx-auto h-6 w-6 text-[#A9F1C3]" /><p className="mt-3 text-xs font-semibold text-white/75">Cover image not published</p></div></div>}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061D45]/85 to-transparent p-5"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A9F1C3]">{String(index + 1).padStart(2, "0")} / {profile.category || "Sponsor Talent"}</span></div>
                </div>
                <div className="p-6"><h3 className="font-montserrat text-2xl font-black tracking-[-0.03em] text-[#0B2E6B]">{profile.name || "Sponsor Talent"}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-[#0B2E6B]/66">{overview}</p><Link href={hasApprovedSponsorAccess ? `/sponsor/talent/${profile.id}` : `/portfolio/${profile.id}`} className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#079432] hover:text-[#14B84A]">{hasApprovedSponsorAccess ? "Open private record" : "Explore overview"} <ArrowUpRight className="h-4 w-4" /></Link></div>
              </article>
            })}
          </div>
          {featuredProfiles.length === 0 && <div className="mt-10 rounded-[1.8rem] border border-dashed border-[#0B2E6B]/18 bg-white p-10 text-sm text-[#0B2E6B]/65">No public Sponsor Talent overviews are currently available. PWLIF administrators can publish safe, non-identifying profiles from the Admin Portal.</div>}
          <div className="mt-10"><PublicAction href={hasApprovedSponsorAccess ? "/sponsor/dashboard" : "/talents"} label={hasApprovedSponsorAccess ? "Open private Talent directory" : "View Sponsor Talent"} /></div>
        </div>
      </section>

      <section className="bg-[#061D45] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl"><SectionHeading dark eyebrow="A careful pathway" title="From initial interest to an appropriate private connection." intro="PWLIF’s process remains considered at every stage." /><div className="mt-12 grid gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 md:grid-cols-3">{(hasApprovedSponsorAccess ? [["01", "Review the pipeline", "Your approved account provides private access to the Foundation’s full Sponsor Talent records."], ["02", "Message the Foundation", "Use the Partnership Desk for a record-specific question or a wider partnership conversation."], ["03", "Coordinate thoughtfully", "The Foundation will guide any appropriate private next steps."]] : [["01", "Explore published overviews", "Review the approved Sponsor Talent introductions and the support paths the Foundation has chosen to share publicly."], ["02", "Book orientation", "Use the private intake and booking step to arrange an appropriate introductory call."], ["03", "Proceed thoughtfully", "The Foundation will guide appropriate next steps after learning more about your interest."]]).map(([number, title, copy]) => <div key={number} className="bg-[#061D45] p-8"><span className="font-montserrat text-5xl font-black text-[#14B84A]">{number}</span><h3 className="mt-10 font-montserrat text-2xl font-bold text-white">{title}</h3><p className="mt-4 text-sm leading-7 text-white/62">{copy}</p></div>)}</div></div>
      </section>

      <PublicCtaBand eyebrow="The next conversation" title="Explore what thoughtful support could make possible." intro={hasApprovedSponsorAccess ? "Your private Partnership Desk is ready for record questions and Foundation coordination." : "Review the published overviews, then begin a private orientation when you are ready to discuss an appropriate next step."} action={hasApprovedSponsorAccess ? { href: "/sponsor/dashboard", label: "Open Partnership Desk" } : { href: "/book-a-call", label: "Book Sponsor Orientation" }} />
    </div>
  );
}
