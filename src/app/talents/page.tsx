"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { TalentPhoto } from "@/components/TalentPhoto";
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function TalentsPage() {
  const { profiles, userStatus } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Technology",
    "Music",
    "Digital Art",
    "Sports (Football)",
    "Academics",
    "Robotics",
    "Leadership",
    "Entrepreneurship",
  ];

  const activeProfiles = profiles;
  const hasApprovedSponsorAccess = userStatus === "approved";

  const filteredTalent = activeProfiles.filter((profile) => {
    const matchesCategory =
      selectedCategory === "All" || profile.category === selectedCategory;
    const matchesSearch =
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.dream.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profile.skills &&
        profile.skills.some((s: string) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FCFCFA] font-inter text-[#0B2E6B] bg-foundation-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#0B2E6B]/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-[#0B2E6B]/60 hover:text-[#079432] transition flex items-center gap-1.5 text-xs font-semibold">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Homepage</span>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#079432]/10 border border-[#079432]/20 text-[#079432] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#079432]" />
              <span>Sponsor Talent Directory</span>
            </div>

            <h1 className="font-montserrat text-3xl sm:text-5xl font-black text-[#0B2E6B] tracking-tight">
              Explore Sponsor Talent
            </h1>
            <p className="text-xs sm:text-sm text-[#0B2E6B]/70 max-w-2xl leading-relaxed">
              {hasApprovedSponsorAccess
                ? "Your approved sponsor account can review the foundation’s complete safe Sponsor Talent pipeline. Public-page visibility controls do not limit this private directory."
                : "Explore the non-identifying Sponsor Talent information that PWLIF administrators have approved for public display. Information may be edited or withdrawn at any time."}
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-[#0B2E6B]/40 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, focus, category..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#0B2E6B]/15 rounded-xl text-xs text-[#0B2E6B] placeholder:text-[#0B2E6B]/40 focus:outline-none focus:border-[#079432] transition shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#079432] text-white font-bold shadow-md"
                  : "bg-white text-[#0B2E6B]/70 border border-[#0B2E6B]/10 hover:border-[#079432] hover:text-[#079432]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Talent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredTalent.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="bg-white rounded-3xl overflow-hidden border border-[#0B2E6B]/10 shadow-lg hover:shadow-2xl hover:border-[#079432]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* 16:9 Cover Photo */}
                <div className="relative aspect-video w-full bg-[#0B2E6B] overflow-hidden">
                  <TalentPhoto
                    src={profile.coverPhoto}
                    alt={profile.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 bg-[#079432] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {profile.category}
                  </span>

                  <span className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> {hasApprovedSponsorAccess ? "Approved sponsor access" : "Public overview"}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-montserrat font-bold text-xl text-[#0B2E6B] flex items-center gap-1.5">
                      <span>{profile.name}{profile.age ? `, ${profile.age}` : ""}</span>
                    </h3>
                    <span className="text-xs font-semibold text-[#0B2E6B]/60">
                      {profile.country_community || profile.location || "Kenya"}
                    </span>
                  </div>

                  {/* Child's Dream Highlight Box */}
                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#0B2E6B]/10 text-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#079432]">
                      🌟 Pilot overview
                    </div>
                    <p className="font-montserrat font-bold text-xs text-[#0B2E6B] line-clamp-2">
                      &quot;{profile.dream}&quot;
                    </p>
                  </div>

                  <p className="text-xs text-[#0B2E6B]/70 leading-relaxed line-clamp-2">
                    {profile.bio}
                  </p>

                  <div className="text-[11px] text-[#0B2E6B]/80 pt-1">
                    <strong className="text-[#079432]">Conversation:</strong> {profile.current_needs}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <Link
                  href={`/portfolio/${profile.id}`}
                  className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-bold py-3.5 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Explore overview</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
