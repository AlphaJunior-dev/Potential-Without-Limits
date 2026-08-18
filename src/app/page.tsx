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
  FileText,
  Heart,
  Globe,
  CheckCircle2,
  Lock,
  Layers,
  Quote
} from "lucide-react";

export default function HomePage() {
  const { profiles, foundationVideos, transparencyReports, branding } = useAuth();
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

  const activeVideo = foundationVideos && foundationVideos.length > 0 ? foundationVideos[activeVideoIndex] : null;

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] bg-foundation-pattern overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#051836]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005C27]/10 border border-[#005C27]/30 text-[#005C27] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#F5AB00]" />
              <span>{branding?.heroBadgeText || "Potential Without Limits International Foundation (PWLIF)"}</span>
            </div>

            <h1 className="font-montserrat text-4xl sm:text-6xl font-black text-[#051836] leading-[1.08] tracking-tight">
              {branding?.heroHeadline || "Transforming Youth Potential Into Purpose."}
            </h1>

            <p className="text-base sm:text-lg text-[#051836]/80 leading-relaxed font-normal">
              {branding?.heroSubheadline || "A humanitarian foundation connecting sponsors with young dreamers and innovators across Africa — beginning in Ethiopia — through direct educational grants, talent development, and 100% transparent stewardship."}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/talents"
                className="bg-[#005C27] text-white px-8 py-4 rounded-2xl font-montserrat font-extrabold text-sm hover:bg-[#327B2F] transition shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Heart className="w-5 h-5 text-[#F5AB00] fill-[#F5AB00]" />
                <span>{branding?.heroCtaText || "Sponsor a Child's Dream"}</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/book-a-call"
                className="bg-[#051836] text-white border border-[#051836] hover:bg-[#042554] px-8 py-4 rounded-2xl font-montserrat font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{branding?.heroSecondaryCtaText || "Book Sponsor Orientation"}</span>
                <ArrowRight className="w-4 h-4 text-[#F5AB00]" />
              </Link>
            </div>

            {/* Impact Metric Chips */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#051836]/10 text-xs">
              {(branding?.statsMetrics && branding.statsMetrics.length > 0 ? branding.statsMetrics : [
                { value: "340+", label: "Youth Sponsored" },
                { value: "24", label: "Global Communities" },
                { value: "100%", label: "Direct Grant Audit" },
              ]).slice(0, 3).map((metric, idx) => (
                <div key={idx}>
                  <span className={`font-black text-2xl block ${idx === 0 ? "text-[#005C27]" : idx === 1 ? "text-[#051836]" : "text-[#F5AB00]"}`}>
                    {metric.value}
                  </span>
                  <span className="text-[#051836]/70 text-[11px]">{metric.label}</span>
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
            <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#051836]">
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

              <div className="absolute inset-0 bg-gradient-to-t from-[#051836] via-[#051836]/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-mono font-bold text-[#F5AB00] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> {branding?.heroCardLocation || "Mathare Youth Tech Lab • Nairobi, Kenya"}
                </span>
                <h3 className="font-montserrat font-bold text-xl text-white">
                  {branding?.heroCardTitle || "Engineering Hope & Assistive Tech"}
                </h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">
                  {branding?.heroCardDescription || "Direct sponsorship equipped Sarah with high-precision soldering gear to build Swahili AI screen readers for 50 blind students."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PROMINENT FOUNDATION INTRODUCTION VIDEO SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
            {branding?.videoSectionBadge || "Humanitarian Spotlight"}
          </span>
          <h2 className="font-montserrat text-3xl sm:text-4xl font-black text-[#051836]">
            {branding?.videoSectionTitle || "Foundation Introduction & Impact"}
          </h2>
          <p className="text-xs sm:text-sm text-[#051836]/70 leading-relaxed">
            {branding?.videoSectionSubtitle || "Watch how our direct child sponsorship model bridges resources with unseen talent around the world."}
          </p>
        </div>

        <div className="bg-[#051836] text-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <div className="relative aspect-video w-full bg-[#042554]">
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
                <div className="absolute inset-0 bg-[#051836]/40 group-hover:bg-[#051836]/20 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#005C27] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-white translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-[#051836]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#F5AB00] font-bold uppercase tracking-wider">
                      {activeVideo?.category || "Foundation Story"} • {activeVideo?.duration || "3:45"}
                    </span>
                    <h3 className="font-montserrat font-bold text-base text-white">
                      {activeVideo?.title || "Potential Without Limits International Foundation Intro"}
                    </h3>
                  </div>
                  <span className="bg-[#005C27] text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    Play Video
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. SPONSOR A DREAM SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 border-t border-[#051836]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between, gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005C27] flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#F5AB00] fill-[#F5AB00]" /> {branding?.sponsorSectionBadge || "Direct Child Sponsorship"}
            </span>
            <h2 className="font-montserrat text-3xl sm:text-4xl font-black text-[#051836]">
              {branding?.sponsorSectionTitle || "Sponsor a Child's Dream"}
            </h2>
            <p className="text-xs sm:text-sm text-[#051836]/70 max-w-2xl">
              {branding?.sponsorSectionSubtitle || "Each child profile features an active dream, current situation, and specific equipment or tuition needs."}
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#005C27] text-white shadow-md"
                    : "bg-white text-[#051836] border border-[#051836]/15 hover:bg-[#005C27]/10"
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
              className="bg-white rounded-3xl overflow-hidden border border-[#051836]/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-[#051836]">
                  <Image
                    src={profile.coverPhoto}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-[#005C27] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {profile.category}
                  </span>
                  <span className="absolute bottom-3 left-3 text-white text-xs font-bold font-mono">
                    📍 {profile.country_community || profile.location}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-montserrat font-bold text-xl text-[#051836]">
                      {profile.name}{profile.age ? `, ${profile.age}` : ""}
                    </h3>
                    <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Pilot overview
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-[#005C27] block text-[11px] uppercase tracking-wider">Overview:</span>
                      <p className="text-[#051836]/90 font-medium italic">&quot;{profile.dream}&quot;</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#051836] block text-[11px] uppercase tracking-wider">Current Need:</span>
                      <p className="text-[#051836]/80">{profile.current_needs}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <Link
                  href={`/portfolio/${profile.id}`}
                  className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md cursor-pointer"
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
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#051836] text-white border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5AB00]">
              {branding?.pathwaySectionBadge || "Transformational Pathway"}
            </span>
            <h2 className="font-montserrat text-3xl sm:text-4xl font-black text-white">
              {branding?.pathwaySectionTitle || "From Potential to Purpose"}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {branding?.pathwaySectionSubtitle || "Our structured 4-phase journey transforms talent through direct equipment grants and parental consent verification."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(branding?.pathSteps && branding.pathSteps.length > 0 ? branding.pathSteps : [
              {
                stepNumber: "STEP 01",
                title: "Identification & Consent",
                description: "Local community leaders identify unseen talent; parental consent and guardian safety verification logged.",
              },
              {
                stepNumber: "STEP 02",
                title: "Direct Dream Adoption",
                description: "Foundation sponsors adopt specific child dreams, allocating targeted equipment or tuition grants.",
              },
              {
                stepNumber: "STEP 03",
                title: "Equipment & Lab Deployment",
                description: "100% audited hardware, musical instruments, or lab components delivered to the youth innovator.",
              },
              {
                stepNumber: "STEP 04",
                title: "Community Purpose",
                description: "The child deploys their solution or art to lift their school, village, or local conservatory.",
              },
            ]).map((p, idx) => (
              <div key={idx} className="bg-[#042554] p-6 rounded-3xl border border-white/10 space-y-3 relative">
                <span className="bg-[#005C27] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
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

      {/* 5. TRANSPARENCY & FINANCIAL STEWARDSHIP SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
            {branding?.transparencySectionBadge || "Accountability & Stewardship"}
          </span>
          <h2 className="font-montserrat text-3xl sm:text-4xl font-black text-[#051836]">
            {branding?.transparencySectionTitle || "Institutional Transparency"}
          </h2>
          <p className="text-xs sm:text-sm text-[#051836]/70 leading-relaxed">
            {branding?.transparencySectionSubtitle || "PWLIF publishes independent financial audits and annual grant distribution reports for public inspection."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {transparencyReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-lg space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-[#005C27]/10 text-[#005C27] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#005C27]/20">
                    {report.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#051836]/60">
                    Audit Date: {report.auditDate}
                  </span>
                </div>
                <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                  {report.title}
                </h3>
                <div className="flex items-center gap-6 text-xs text-[#051836]/80 pt-2 border-t border-[#051836]/10">
                  <div>
                    <span className="text-[10px] text-[#051836]/50 block uppercase">Total Grant Funds</span>
                    <span className="font-mono font-bold text-base text-[#005C27]">{report.totalFunded}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#051836]/50 block uppercase">Children Impacted</span>
                    <span className="font-mono font-bold text-base text-[#051836]">{report.childrenImpacted} Youth</span>
                  </div>
                </div>
              </div>

              <a
                href={report.reportPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#051836] hover:bg-[#042554] text-white font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#F5AB00]" />
                <span>Inspect Financial Report (PDF)</span>
              </a>
            </div>
          ))}
        </div>

        {/* Foundation Engagement Hub Cards */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-[#005C27]/10 text-[#005C27] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#005C27]/20 uppercase">
                Foundation Mission
              </span>
              <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                Mission &amp; Vision
              </h3>
              <p className="text-xs text-[#051836]/70 leading-relaxed">
                Review our core humanitarian mission, strategic pillars, and vision for youth innovation across Africa.
              </p>
            </div>
            <Link
              href="/mission-vision"
              className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md"
            >
              <span>Explore Mission &amp; Vision</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-[#005C27]/10 text-[#005C27] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#005C27]/20 uppercase">
                Youth Mentorship
              </span>
              <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                Volunteer &amp; Become a Mentor
              </h3>
              <p className="text-xs text-[#051836]/70 leading-relaxed">
                Share your expertise as an educator, technical mentor, or community volunteer at our Talent Development Centres.
              </p>
            </div>
            <Link
              href="/volunteer"
              className="w-full bg-[#051836] hover:bg-[#042554] text-white font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md"
            >
              <span>Join as Volunteer</span>
              <ArrowRight className="w-4 h-4 text-[#F5AB00]" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-[#005C27]/10 text-[#005C27] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#005C27]/20 uppercase">
                Financial Support
              </span>
              <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                Ways to Donate &amp; Partner
              </h3>
              <p className="text-xs text-[#051836]/70 leading-relaxed">
                Explore one-time contributions, monthly giving, corporate CSR matching, and community lab sponsorships.
              </p>
            </div>
            <Link
              href="/donate"
              className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md"
            >
              <span>Support Our Programs</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
