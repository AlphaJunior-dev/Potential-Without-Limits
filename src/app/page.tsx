"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Play,
  Award,
  Heart,
  Globe,
  CheckCircle2,
  Lock,
  Layers,
  Quote
} from "lucide-react";

export default function HomePage() {
  const { profiles, foundationVideos, branding, userStatus } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const categories = [
    "All",
    "Technology",
    "Music",
    "Digital Art",
    "Robotics",
    "Sports",
    "Academics",
    "Leadership",
    "Entrepreneurship",
  ];

  const activeProfiles = profiles;
  const featuredProfiles = activeProfiles.slice(0, 3);
  const hasApprovedSponsorAccess = userStatus === "approved";

  const activeVideo = foundationVideos && foundationVideos.length > 0 ? foundationVideos[activeVideoIndex] : null;

  return (
    <div className="min-h-screen bg-[#FCFCFA] font-inter text-[#0B2E6B] bg-foundation-pattern overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#0B2E6B]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#079432]/10 border border-[#079432]/30 text-[#079432] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#F7B500]" />
              <span>{branding?.heroBadgeText || "Potential Without Limits International Foundation (PWLIF)"}</span>
            </div>

            <h1 className="font-montserrat text-4xl sm:text-6xl font-black text-[#0B2E6B] leading-[1.08] tracking-tight">
              {branding?.heroHeadline || "Transforming Youth Potential Into Purpose."}
            </h1>

            <p className="text-base sm:text-lg text-[#0B2E6B]/80 leading-relaxed font-normal">
              {branding?.heroSubheadline || "A privacy-first foundation that introduces sponsors to talent development conversations through a guided private orientation."}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/talents"
                className="bg-[#079432] text-white px-8 py-4 rounded-2xl font-montserrat font-extrabold text-sm hover:bg-[#14B84A] transition shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Heart className="w-5 h-5 text-[#F7B500] fill-[#F7B500]" />
                <span>{hasApprovedSponsorAccess ? "View full Sponsor Talent pipeline" : branding?.heroCtaText || "Explore Sponsor Talent"}</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/book-a-call"
                className="bg-[#0B2E6B] text-white border border-[#0B2E6B] hover:bg-[#082657] px-8 py-4 rounded-2xl font-montserrat font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{branding?.heroSecondaryCtaText || "Book Sponsor Orientation"}</span>
                <ArrowRight className="w-4 h-4 text-[#F7B500]" />
              </Link>
            </div>

            {/* Impact Metric Chips */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#0B2E6B]/10 text-xs">
              {(branding?.statsMetrics && branding.statsMetrics.length > 0 ? branding.statsMetrics : [
                { value: "Private", label: "Orientation-first" },
                { value: "Guided", label: "Partner process" },
                { value: "Respectful", label: "Information sharing" },
              ]).slice(0, 3).map((metric, idx) => (
                <div key={idx}>
                  <span className={`font-black text-2xl block ${idx === 0 ? "text-[#079432]" : idx === 1 ? "text-[#0B2E6B]" : "text-[#F7B500]"}`}>
                    {metric.value}
                  </span>
                  <span className="text-[#0B2E6B]/70 text-[11px]">{metric.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* HERO BANNER ARTWORK */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#0B2E6B]">
              {branding?.heroMediaType === "video" && branding?.heroVideoUrl ? (
                <video
                  src={branding.heroVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={branding?.heroImage || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"}
                  alt="PWLIF Youth Innovation Community"
                  fill
                  priority
                  className="object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E6B] via-[#0B2E6B]/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-mono font-bold text-[#F7B500] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> {branding?.heroCardLocation || "Sponsor Talent pathway"}
                </span>
                <h3 className="font-montserrat font-bold text-xl text-white">
                  {branding?.heroCardTitle || "A private introduction"}
                </h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">
                  {branding?.heroCardDescription || "Learn how the foundation approaches talent development, privacy, and sponsor orientation."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PROMINENT FOUNDATION INTRODUCTION VIDEO SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#079432]">
            {branding?.videoSectionBadge || "Humanitarian Spotlight"}
          </span>
          <h2 className="font-montserrat text-3xl sm:text-4xl font-black text-[#0B2E6B]">
            {branding?.videoSectionTitle || "Foundation Introduction & Impact"}
          </h2>
          <p className="text-xs sm:text-sm text-[#0B2E6B]/70 leading-relaxed">
            {branding?.videoSectionSubtitle || "Learn how Sponsor Talent conversations are introduced through a careful, privacy-first orientation."}
          </p>
        </div>

        <div className="bg-[#0B2E6B] text-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <div className="relative aspect-video w-full bg-[#082657]">
            {isPlayingVideo && activeVideo ? (
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                <Image
                  src={activeVideo?.thumbnail || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"}
                  alt={activeVideo?.title || "PWLIF Intro"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0B2E6B]/40 group-hover:bg-[#0B2E6B]/20 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#079432] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-white translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-[#0B2E6B]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#F7B500] font-bold uppercase tracking-wider">
                      {activeVideo?.category || "Foundation Story"} • {activeVideo?.duration || "3:45"}
                    </span>
                    <h3 className="font-montserrat font-bold text-base text-white">
                      {activeVideo?.title || "Potential Without Limits International Foundation Intro"}
                    </h3>
                  </div>
                  <span className="bg-[#079432] text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    Play Video
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. SPONSOR A DREAM SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 border-t border-[#0B2E6B]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between, gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079432] flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#F7B500] fill-[#F7B500]" /> {branding?.sponsorSectionBadge || "Sponsor Talent"}
            </span>
            <h2 className="font-montserrat text-3xl sm:text-4xl font-black text-[#0B2E6B]">
              {branding?.sponsorSectionTitle || "Explore Sponsor Talent"}
            </h2>
            <p className="text-xs sm:text-sm text-[#0B2E6B]/70 max-w-2xl">
              {hasApprovedSponsorAccess
                ? "Your approved sponsor account has access to the foundation’s complete safe Sponsor Talent pipeline."
                : branding?.sponsorSectionSubtitle || "Begin with a private orientation to understand the foundation's Sponsor Talent pathway."}
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#079432] text-white shadow-md"
                    : "bg-white text-[#0B2E6B] border border-[#0B2E6B]/15 hover:bg-[#079432]/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#0B2E6B]/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-[#0B2E6B]">
                  <Image
                    src={profile.coverPhoto}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-[#079432] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {profile.category}
                  </span>
                  <span className="absolute bottom-3 left-3 text-white text-xs font-bold font-mono">
                    📍 {profile.country_community || profile.location}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-montserrat font-bold text-xl text-[#0B2E6B]">
                      {profile.name}{profile.age ? `, ${profile.age}` : ""}
                    </h3>
                    <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Pilot overview
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-[#079432] block text-[11px] uppercase tracking-wider">Overview:</span>
                      <p className="text-[#0B2E6B]/90 font-medium italic">&quot;{profile.dream}&quot;</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#0B2E6B] block text-[11px] uppercase tracking-wider">Current Need:</span>
                      <p className="text-[#0B2E6B]/80">{profile.current_needs}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <Link
                  href={`/portfolio/${profile.id}`}
                  className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>Explore {profile.name}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. JOURNEY TO SUCCESS / FROM POTENTIAL TO PURPOSE */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#0B2E6B] text-white border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F7B500]">
              {branding?.pathwaySectionBadge || "Transformational Pathway"}
            </span>
            <h2 className="font-montserrat text-3xl sm:text-4xl font-black text-white">
              {branding?.pathwaySectionTitle || "From Potential to Purpose"}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {branding?.pathwaySectionSubtitle || "Our four-part approach guides private, responsible Sponsor Talent conversations from introduction to partnership."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(branding?.pathSteps && branding.pathSteps.length > 0 ? branding.pathSteps : [
              {
                stepNumber: "STEP 01",
                title: "Orientation",
                description: "Sponsors begin with a private conversation about the foundation's approach and current priorities.",
              },
              {
                stepNumber: "STEP 02",
                title: "Understanding",
                description: "The foundation shares appropriate, non-identifying Sponsor Talent context through the right channels.",
              },
              {
                stepNumber: "STEP 03",
                title: "Partnership",
                description: "Potential partners explore a responsible way to support the foundation's work.",
              },
              {
                stepNumber: "STEP 04",
                title: "Purpose",
                description: "The foundation keeps conversations grounded in dignity, privacy, and long-term opportunity.",
              },
            ]).map((p, idx) => (
              <div key={idx} className="bg-[#082657] p-6 rounded-3xl border border-white/10 space-y-3 relative">
                <span className="bg-[#079432] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {p.stepNumber || `Phase ${idx + 1}`}
                </span>
                <h3 className="font-montserrat font-bold text-lg text-white pt-1">
                  {p.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PARTNERSHIP & STEWARDSHIP SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#079432]">
            {branding?.transparencySectionBadge || "Partnership"}
          </span>
          <h2 className="font-montserrat text-3xl sm:text-4xl font-black text-[#0B2E6B]">
            {branding?.transparencySectionTitle || "Accountability & Stewardship"}
          </h2>
          <p className="text-xs sm:text-sm text-[#0B2E6B]/70 leading-relaxed">
            {branding?.transparencySectionSubtitle || "Learn about the foundation's values, partnership approach, and private orientation process."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#0B2E6B]/10 shadow-lg space-y-4 text-center max-w-2xl mx-auto">
          <span className="bg-[#079432]/10 text-[#079432] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#079432]/20">PRIVATE PARTNERSHIP PROCESS</span>
          <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">Financial reporting and online donations are not available here.</h3>
          <p className="text-xs text-[#0B2E6B]/70 leading-relaxed">PWLIF shares appropriate partnership information through private orientation conversations rather than public reports or online payment workflows.</p>
          <Link href="/book-a-call" className="inline-flex bg-[#0B2E6B] hover:bg-[#082657] text-white font-bold py-3 px-4 rounded-xl text-xs transition items-center justify-center gap-2 shadow-md cursor-pointer">
            <span>Request Sponsor Orientation</span>
            <ArrowRight className="w-4 h-4 text-[#F7B500]" />
          </Link>
        </div>

        {/* Foundation Engagement Hub Cards */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#0B2E6B]/10 shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-[#079432]/10 text-[#079432] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#079432]/20 uppercase">
                Foundation Mission
              </span>
              <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">
                Mission &amp; Vision
              </h3>
              <p className="text-xs text-[#0B2E6B]/70 leading-relaxed">
                Review PWLIF’s mission, guiding principles, and approach to careful community-informed partnership.
              </p>
            </div>
            <Link
              href="/mission-vision"
              className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md"
            >
              <span>Explore Mission &amp; Vision</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#0B2E6B]/10 shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-[#079432]/10 text-[#079432] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#079432]/20 uppercase">
                Community Contribution
              </span>
              <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">
                Explore Community Contribution
              </h3>
              <p className="text-xs text-[#0B2E6B]/70 leading-relaxed">
                Ask about appropriate ways to contribute expertise through a private orientation conversation.
              </p>
            </div>
            <Link
              href="/volunteer"
              className="w-full bg-[#0B2E6B] hover:bg-[#082657] text-white font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md"
            >
              <span>Join as Volunteer</span>
              <ArrowRight className="w-4 h-4 text-[#F7B500]" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#0B2E6B]/10 shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-[#079432]/10 text-[#079432] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#079432]/20 uppercase">
                Partnership Support
              </span>
              <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">
                Partnership &amp; Support
              </h3>
              <p className="text-xs text-[#0B2E6B]/70 leading-relaxed">
                Online financial contributions are not available. Learn how partnership conversations are handled instead.
              </p>
            </div>
            <Link
              href="/donate"
              className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md"
            >
              <span>Explore Partnership</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
