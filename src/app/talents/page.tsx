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
    "Sports (Football)",
    "Academics",
    "Robotics",
    "Leadership",
    "Entrepreneurship",
  ];

  const activeProfiles = profiles && profiles.length > 0 ? profiles : INITIAL_YOUTH_PROFILES;

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
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] bg-foundation-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#051836]/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-[#051836]/60 hover:text-[#005C27] transition flex items-center gap-1.5 text-xs font-semibold">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Homepage</span>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005C27]/10 border border-[#005C27]/20 text-[#005C27] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#005C27]" />
              <span>Child Dream Directory</span>
            </div>

            <h1 className="font-montserrat text-3xl sm:text-5xl font-black text-[#051836] tracking-tight">
              Empower Youth Dreams
            </h1>
            <p className="text-xs sm:text-sm text-[#051836]/70 max-w-2xl leading-relaxed">
              Explore verified child dream profiles across Technology, Music, Digital Art, Robotics, Sports, Academics, Leadership, and Entrepreneurship. Every profile is backed by 100% verified parental consent records.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-[#051836]/40 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, dream, category..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#051836]/15 rounded-xl text-xs text-[#051836] placeholder:text-[#051836]/40 focus:outline-none focus:border-[#005C27] transition shadow-xs"
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
                  ? "bg-[#005C27] text-white font-bold shadow-md"
                  : "bg-white text-[#051836]/70 border border-[#051836]/10 hover:border-[#005C27] hover:text-[#005C27]"
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
              className="bg-white rounded-3xl overflow-hidden border border-[#051836]/10 shadow-lg hover:shadow-2xl hover:border-[#005C27]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* 16:9 Cover Photo */}
                <div className="relative aspect-video w-full bg-[#051836] overflow-hidden">
                  <Image
                    src={profile.coverPhoto}
                    alt={profile.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 bg-[#005C27] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {profile.category}
                  </span>

                  <span className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Parental Consent Verified ✓
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-1.5">
                      <span>{profile.name}, {profile.age}</span>
                    </h3>
                    <span className="text-xs font-semibold text-[#051836]/60">
                      {profile.country_community || profile.location || "Kenya"}
                    </span>
                  </div>

                  {/* Child's Dream Highlight Box */}
                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 text-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#005C27]">
                      🌟 Child&apos;s Aspiration &amp; Dream
                    </div>
                    <p className="font-montserrat font-bold text-xs text-[#051836] line-clamp-2">
                      &quot;{profile.dream}&quot;
                    </p>
                  </div>

                  <p className="text-xs text-[#051836]/70 leading-relaxed line-clamp-2">
                    {profile.bio}
                  </p>

                  <div className="text-[11px] text-[#051836]/80 pt-1">
                    <strong className="text-[#005C27]">Grant Need:</strong> {profile.current_needs}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <Link
                  href={`/portfolio/${profile.id}`}
                  className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3.5 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Sponsor This Dream</span>
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
