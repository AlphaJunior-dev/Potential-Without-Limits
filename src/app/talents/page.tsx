"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Lock, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TalentPhoto } from "@/components/TalentPhoto";
import { PublicHero, SectionHeading } from "@/components/PublicStory";

const neutralOverview = "A carefully reviewed, non-identifying overview will appear here when PWLIF chooses to share more.";

export default function TalentsPage() {
  const { profiles, publicProfiles, userStatus, talentTags } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const hasApprovedSponsorAccess = userStatus === "approved";
  const visibleProfiles = hasApprovedSponsorAccess ? profiles : publicProfiles;
  const filteredTalent = useMemo(() => visibleProfiles.filter((profile) => {
    const query = searchQuery.trim().toLowerCase();
    const visibility = profile.publicVisibility;
    const canSee = (field: "summaryVisible" | "ageBandVisible" | "regionVisible" | "skillsVisible" | "storyVisible" | "aspirationVisible" | "supportPathwayVisible") => hasApprovedSponsorAccess || visibility?.[field] === true;
    const matchesCategory = selectedCategory === "All" || profile.category === selectedCategory || (canSee("skillsVisible") && profile.skills?.includes(selectedCategory));
    const matchesSearch = !query || [profile.name, profile.category, canSee("summaryVisible") ? profile.bio : "", canSee("ageBandVisible") ? profile.ageBand : "", canSee("regionVisible") ? profile.region : "", canSee("storyVisible") ? profile.story : "", canSee("aspirationVisible") ? profile.aspiration : "", canSee("supportPathwayVisible") ? profile.supportPathway : "", ...(canSee("skillsVisible") ? profile.skills || [] : [])].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  }), [hasApprovedSponsorAccess, searchQuery, selectedCategory, visibleProfiles]);

  return (
    <div className="bg-[#FCFCFA]">
      <PublicHero
        dark
        eyebrow="Sponsor Talent directory"
        title={hasApprovedSponsorAccess ? "The complete Sponsor Talent pipeline." : "Explore a careful introduction to potential."}
        intro={hasApprovedSponsorAccess ? "Your approved sponsor account can review the foundation’s safe private pipeline. Public visibility controls do not limit your approved private access." : "Explore only non-identifying Sponsor Talent information and cover photography that PWLIF administrators have selected for public display. Information may be edited or withdrawn at any time."}
        primaryAction={{ href: hasApprovedSponsorAccess ? "/sponsor/dashboard" : "/book-a-call", label: hasApprovedSponsorAccess ? "Open Partnership Desk" : "Begin sponsor orientation" }}
      >
        <div className="rounded-[1.75rem] border border-white/12 bg-white/7 p-6 text-white backdrop-blur-sm"><ShieldCheck className="h-7 w-7 text-[#A9F1C3]" /><p className="mt-8 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A9F1C3]">Access note</p><p className="mt-3 font-montserrat text-xl font-bold">{hasApprovedSponsorAccess ? "Approved sponsor view" : "Published public information only"}</p></div>
      </PublicHero>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 border-b border-[#0B2E6B]/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Find an overview" title="Potential, organised with care." intro="Use the filters to explore the published overview categories currently available." />
            <label className="relative block w-full max-w-md"><span className="sr-only">Search Sponsor Talent</span><Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#079432]" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search focus, category, or overview" className="w-full rounded-full border border-[#0B2E6B]/14 bg-white py-4 pl-12 pr-5 text-sm text-[#0B2E6B] outline-none transition placeholder:text-[#0B2E6B]/45 focus:border-[#079432]" /></label>
          </div>
          <div className="mt-7 flex gap-2 overflow-x-auto pb-2">{["All", ...talentTags.filter((tag) => tag.status === "active").map((tag) => tag.name)].map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={`shrink-0 rounded-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] transition ${selectedCategory === category ? "bg-[#0B2E6B] text-white" : "border border-[#0B2E6B]/12 bg-white text-[#0B2E6B]/68 hover:border-[#079432] hover:text-[#079432]"}`}>{category}</button>)}</div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filteredTalent.map((profile, index) => {
            const visibility = profile.publicVisibility;
            const canSee = (field: "photoVisible" | "summaryVisible" | "ageBandVisible" | "regionVisible" | "skillsVisible" | "storyVisible" | "aspirationVisible") => hasApprovedSponsorAccess || visibility?.[field] === true;
            const canSeePhoto = canSee("photoVisible") && Boolean(profile.coverPhoto && profile.coverPhoto !== "/pwlif-logo.png");
            const overview = (canSee("storyVisible") && profile.story) || (canSee("summaryVisible") && profile.bio) || neutralOverview;
            const hasVisibleMeta = (canSee("ageBandVisible") && Boolean(profile.ageBand)) || (canSee("regionVisible") && Boolean(profile.region));
            return <article key={profile.id} className="group overflow-hidden rounded-[1.75rem] border border-[#0B2E6B]/8 bg-white shadow-[0_14px_40px_rgba(11,46,107,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(11,46,107,0.14)]"><div className="relative aspect-[4/3] overflow-hidden bg-[#061D45]">{canSeePhoto ? <TalentPhoto src={profile.coverPhoto} alt="Sponsor Talent overview" fill className="object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_72%_22%,rgba(20,184,74,0.25),transparent_38%),linear-gradient(135deg,#061D45,#0B2E6B)] px-6 text-center"><div><Lock className="mx-auto h-6 w-6 text-[#A9F1C3]" /><p className="mt-3 text-xs font-semibold leading-5 text-white/75">Cover image not published</p></div></div>}<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061D45]/80 to-transparent p-5"><span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A9F1C3]">{String(index + 1).padStart(2, "0")} / {profile.category || "Sponsor Talent"}</span></div></div><div className="p-6"><div className="flex gap-4"><h2 className="font-montserrat text-2xl font-black tracking-[-0.035em] text-[#0B2E6B]">{profile.name || "Sponsor Talent"}</h2><span className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] text-[#079432]">{hasApprovedSponsorAccess ? "Private" : "Public"}</span></div>{hasVisibleMeta ? <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0B2E6B]/60">{canSee("ageBandVisible") && profile.ageBand ? <span>{profile.ageBand}</span> : null}{canSee("regionVisible") && profile.region ? <span>{profile.region}</span> : null}</div> : null}{canSee("skillsVisible") && profile.skills?.length ? <div className="mt-4 flex flex-wrap gap-1.5">{profile.skills.slice(0, 4).map((skill) => <span key={skill} className="rounded-full bg-[#079432]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#079432]">{skill}</span>)}</div> : null}<p className="mt-4 line-clamp-3 text-sm leading-6 text-[#0B2E6B]/66">{overview}</p>{canSee("aspirationVisible") && profile.aspiration ? <p className="mt-4 text-xs font-semibold leading-5 text-[#0B2E6B]/72"><span className="text-[#079432]">Heading toward: </span>{profile.aspiration}</p> : null}<Link href={hasApprovedSponsorAccess ? `/sponsor/talent/${profile.id}` : `/portfolio/${profile.id}`} className="mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#079432] hover:text-[#14B84A]">{hasApprovedSponsorAccess ? "View full private record" : "Open overview"} <ArrowUpRight className="h-4 w-4" /></Link></div></article>;
          })}</div>
          {filteredTalent.length === 0 && <div className="mt-12 rounded-[1.75rem] border border-dashed border-[#0B2E6B]/18 p-12 text-center"><p className="font-montserrat text-2xl font-bold text-[#0B2E6B]">No matching published overview yet.</p><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#0B2E6B]/65">Try a different search or category. PWLIF administrators control which non-identifying profiles appear here.</p></div>}
        </div>
      </section>
    </div>
  );
}
