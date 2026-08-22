"use client";

import { Compass, Heart, Target } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { EditorialSplit, PublicCtaBand, PublicHero, SectionHeading } from "@/components/PublicStory";

const values = [
  ["Hope", "Encouraging belief in a future where potential can be recognised and supported."],
  ["Integrity", "Upholding the highest moral and ethical standards in all actions."],
  ["Compassion", "Approaching young people, families, and partners with care and empathy."],
  ["Excellence", "Striving for thoughtful, high-quality foundation work and partnerships."],
  ["Accountability", "Taking responsibility for decisions, communications, and entrusted work."],
  ["Innovation", "Embracing creative technology and modern learning tools."],
  ["Inclusion", "Valuing opportunity, participation, and belonging across diverse communities."],
  ["Respect", "Honouring the dignity, rights, and voice of every young person."],
  ["Empowerment", "Supporting young people to develop confidence, skills, and agency."],
  ["Stewardship", "Approaching foundation decisions and partnerships with care and integrity."],
];

export default function MissionVisionPage() {
  const { missionVision } = useAuth();
  return <div className="bg-[#FCFCFA]">
    <PublicHero dark eyebrow="Foundation identity" title="Potential is the beginning. Purpose is the direction." intro="PWLIF supports young people to explore and develop their potential through learning, mentorship, talent development, and responsible partnerships." primaryAction={{ href: "/book-a-call", label: "Book sponsor orientation" }} />
    <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="mx-auto max-w-7xl"><div className="grid gap-6 lg:grid-cols-2"><article className="rounded-[2rem] bg-[#0B2E6B] p-8 text-white sm:p-10"><Target className="h-9 w-9 text-[#A9F1C3]" /><p className="mt-12 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A9F1C3]">Our mission</p><p className="mt-5 font-montserrat text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">“{missionVision.mission}”</p></article><article className="rounded-[2rem] bg-[#EAF7EF] p-8 sm:p-10"><Compass className="h-9 w-9 text-[#079432]" /><p className="mt-12 text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Our vision</p><p className="mt-5 font-montserrat text-3xl font-black leading-tight tracking-[-0.04em] text-[#0B2E6B] sm:text-4xl">“{missionVision.vision}”</p></article></div></div></section>
    <section className="border-y border-[#0B2E6B]/8 bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="mx-auto max-w-7xl"><EditorialSplit number="01" eyebrow="A founding perspective" title={missionVision.foundersTitle || "A foundation built around possibility."} aside={<div className="relative z-10 flex h-full min-h-[320px] items-end p-8"><div><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F7B500] text-[#061D45]"><Heart className="h-5 w-5 fill-current" /></span><p className="mt-8 font-montserrat text-3xl font-black text-white">Potential comes alive when it is met with care.</p></div></div>}><p className="font-montserrat text-xl font-medium leading-9 text-[#0B2E6B]">“{missionVision.foundersNote}”</p><p className="mt-6 text-xs font-bold uppercase tracking-[0.13em] text-[#079432]">Foundation message</p></EditorialSplit></div></section>
    <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Foundational principles" title="The values that hold the work together." intro="These are the principles guiding PWLIF’s programme development, communication, and partnership work." /><div className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] border border-[#0B2E6B]/10 bg-[#0B2E6B]/10 sm:grid-cols-2 lg:grid-cols-5">{values.map(([name, description], index) => <article key={name} className="min-h-56 bg-white p-6"><span className="font-montserrat text-3xl font-black text-[#14B84A]">{String(index + 1).padStart(2, "0")}</span><h2 className="mt-9 font-montserrat text-xl font-black tracking-[-0.03em] text-[#0B2E6B]">{name}</h2><p className="mt-3 text-xs leading-6 text-[#0B2E6B]/64">{description}</p></article>)}</div></div></section>
    <PublicCtaBand eyebrow="Next step" title="Learn about the foundation before making a commitment." intro="A private orientation is the appropriate starting point for Sponsor Talent and partnership conversations." action={{ href: "/book-a-call", label: "Book Sponsor Orientation" }} />
  </div>;
}
