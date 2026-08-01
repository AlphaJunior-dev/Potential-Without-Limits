"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { INITIAL_YOUTH_PROFILES } from "@/lib/data";
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function TalentsPage() {
  const { profiles } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Technology",
    "Music",
    "Digital Art",
    "Robotics",
    "Biotech",
    "Creative Writing",
  ];

  const activeProfiles = profiles && profiles.length > 0 ? profiles : INITIAL_YOUTH_PROFILES;

  const filteredTalent = activeProfiles.filter((profile) => {
    const matchesCategory =
      selectedCategory === "All" || profile.category === selectedCategory;
    const matchesSearch =
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profile.skills &&
        profile.skills.some((s: string) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050814] font-inter text-white bg-gallery-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-white/60 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Homepage</span>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121A36] border border-[#F28482]/30 text-[#F28482] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F28482]" />
              <span>Full Creator Exhibition Roster</span>
            </div>

            <h1 className="font-montserrat text-3xl sm:text-5xl font-black text-white tracking-tight">
              Youth Creator Directory
            </h1>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
              Explore verified youth talent in Technology, Digital Art, Sound Design, and Robotics. High-definition video reels and raw stems remain strictly unlocked for authenticated corporate sponsors.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, category, or skills..."
                className="w-full pl-10 pr-4 py-3 bg-[#121A36] border border-white/15 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#F28482] transition shadow-inner"
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
                  ? "bg-[#F28482] text-white font-bold shadow-md"
                  : "bg-[#121A36] text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
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
              className="bg-[#121A36] rounded-3xl overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#F28482]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* 16:9 Cover Photo */}
                <div className="relative aspect-video w-full bg-[#050814] overflow-hidden">
                  <Image
                    src={profile.coverPhoto}
                    alt={profile.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121A36] via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 bg-[#050814]/90 backdrop-blur-md text-[#F28482] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#F28482]/20">
                    {profile.category}
                  </span>

                  {profile.status === "sponsored" && (
                    <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Sponsored
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-montserrat font-bold text-xl text-white flex items-center gap-1.5">
                      <span>{profile.name}, {profile.age}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <span className="text-xs font-semibold text-white/50">
                      {profile.location || "USA"}
                    </span>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                    {profile.bio}
                  </p>

                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {profile.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="bg-[#050814] text-white/80 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <Link
                  href={`/portfolio/${profile.id}`}
                  className="w-full bg-[#050814] hover:bg-[#F28482] hover:text-white text-white border border-white/15 font-montserrat font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 group-hover:border-[#F28482] shadow-xs cursor-pointer"
                >
                  <span>Inspect Portfolio &amp; Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F28482] group-hover:text-white transition-colors" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
