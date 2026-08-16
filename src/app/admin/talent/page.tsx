"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { INITIAL_YOUTH_PROFILES, YouthProfile } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { AdminMfaModal } from "@/components/AdminMfaModal";
import { 
  Sparkles, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  ArrowLeft,
  UploadCloud,
  CheckCircle2
} from "lucide-react";

export default function AdminTalentPage() {
  const { mfaVerified, verifyMfa, adminRole, setAdminRole } = useAuth();

  const [profiles, setProfiles] = useState<YouthProfile[]>(INITIAL_YOUTH_PROFILES);
  const [talentSearch, setTalentSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Form State
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("Technology");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [rawMediaUrl, setRawMediaUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!mfaVerified) {
    return <AdminMfaModal onVerify={verifyMfa} />;
  }

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(talentSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(talentSearch.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveTalent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !age || !bio) return;

    if (editingId) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: firstName,
                age: Number(age),
                category,
                location: location || "Addis Ababa, Ethiopia",
                bio,
                coverPhoto: coverPhoto || p.coverPhoto,
                rawMediaUrl: rawMediaUrl || p.rawMediaUrl,
              }
            : p
        )
      );
      setEditingId(null);
    } else {
      const newTalent: YouthProfile = {
        id: "t-" + Date.now(),
        name: firstName,
        age: Number(age),
        category,
        location: location || "Addis Ababa, Ethiopia",
        bio,
        coverPhoto:
          coverPhoto ||
          "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
        rawMediaUrl:
          rawMediaUrl ||
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        status: "active",
        inquiriesCount: 0,
        skills: [category, "Creative Innovation"],
        dream: "Mastering skills and community innovation.",
        current_situation: bio,
        progress: "Actively participating in local community youth labs.",
        current_needs: "Educational grant & equipment support",
        country_community: location || "Addis Ababa, Ethiopia",
        consentRecord: {
          parentalConsent: true,
          mediaReleasePermission: true,
          signedDate: "2026-01-10",
          guardianName: "Parent/Guardian",
        },
      };
      setProfiles([newTalent, ...profiles]);
    }
    setFirstName("");
    setAge("");
    setCategory("Technology");
    setLocation("");
    setBio("");
    setCoverPhoto("");
    setRawMediaUrl("");
  };

  const handleEditClick = (p: YouthProfile) => {
    setEditingId(p.id);
    setFirstName(p.name);
    setAge(p.age.toString());
    setCategory(p.category);
    setLocation(p.location || "");
    setBio(p.bio);
    setCoverPhoto(p.coverPhoto);
    setRawMediaUrl(p.rawMediaUrl || "");
  };

  const handleDeleteClick = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  const handleToggleHomepageFeature = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              featuredOnHomepage: !p.featuredOnHomepage,
            }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] pb-16 bg-foundation-pattern">
      {/* Header */}
      <header className="bg-white text-[#051836] px-6 py-4 border-b border-[#051836]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-[#051836]/60 hover:text-[#051836] transition">
            <ArrowLeft className="w-5 h-5 text-[#005C27]" />
          </Link>
          <div className="flex items-center gap-3">
            <img src="/pwlif-logo.png" alt="PWLIF" className="h-8 w-auto object-contain" />
            <div>
              <h1 className="font-montserrat font-bold text-lg tracking-tight text-[#051836]">
                Talent Directory &amp; CMS
              </h1>
              <p className="text-xs text-[#051836]/60">
                Manage public child dream profiles, media pipelines, and homepage spotlights.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#051836]/60 uppercase tracking-wider">
            RBAC Role:
          </span>
          <select
            value={adminRole}
            onChange={(e) => setAdminRole(e.target.value as "Super Admin" | "Vetting Officer" | "Curator")}
            className="bg-[#F8FAFC] text-[#051836] text-xs font-bold py-1.5 px-3 rounded-md border border-[#051836]/15 focus:outline-none focus:border-[#005C27]"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Curator">Talent Curator</option>
            <option value="Vetting Officer">Vetting Officer</option>
          </select>
          <span className="bg-[#005C27]/10 text-[#005C27] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#005C27]/20 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#005C27]" /> Verified Session
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-4 border-b border-[#051836]/10 pb-4 text-xs font-semibold uppercase tracking-wider">
          <Link href="/admin" className="text-[#051836]/60 hover:text-[#005C27]">
            Admin Portal
          </Link>
          <span className="text-[#051836]/30">&gt;</span>
          <Link href="/admin/vetting" className="text-[#051836]/60 hover:text-[#005C27]">
            Sponsor Onboarding
          </Link>
          <span className="text-[#051836]/30">&gt;</span>
          <span className="text-[#005C27] font-bold">Talent Directory</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="bg-white p-6 rounded-2xl border border-[#051836]/10 shadow-lg h-fit space-y-4">
            <h2 className="font-montserrat font-bold text-base text-[#051836] border-b border-[#051836]/10 pb-3">
              {editingId ? "Edit Child Profile" : "Add Child Profile (CMS Entry)"}
            </h2>

            <form onSubmit={handleSaveTalent} className="space-y-4 text-xs font-inter">
              <div>
                <label className="block font-semibold text-[#051836]/80 uppercase tracking-wider mb-1">
                  First Name (Child Privacy Standard)
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Dawit"
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-lg focus:outline-none focus:border-[#005C27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#051836]/80 uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-lg focus:outline-none focus:border-[#005C27]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#051836]/80 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-lg focus:outline-none focus:border-[#005C27]"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Music">Music</option>
                    <option value="Digital Art">Digital Art</option>
                    <option value="Sports (Football)">Sports (Football)</option>
                    <option value="Academics">Academics</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#051836]/80 uppercase tracking-wider mb-1">
                  Location / Community
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Addis Ababa, Ethiopia"
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-lg focus:outline-none focus:border-[#005C27]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#051836]/80 uppercase tracking-wider mb-1">
                  Bio / Talent Summary
                </label>
                <textarea
                  rows={3}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summarize the child's gift, ambition, and background..."
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-lg focus:outline-none focus:border-[#005C27]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#051836]/80 uppercase tracking-wider mb-1">
                  Cover Photo Image URL
                </label>
                <input
                  type="url"
                  value={coverPhoto}
                  onChange={(e) => setCoverPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-lg focus:outline-none focus:border-[#005C27]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#051836]/80 uppercase tracking-wider mb-1">
                  Video Reel Stream URL
                </label>
                <input
                  type="url"
                  value={rawMediaUrl}
                  onChange={(e) => setRawMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-lg focus:outline-none focus:border-[#005C27]"
                />
              </div>

              <div className="pt-2 border-t border-[#051836]/10 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#005C27] hover:bg-[#327B2F] text-white font-bold py-2.5 px-4 rounded-lg transition text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F5AB00]" />
                  <span>{editingId ? "Update Profile" : "Save Child Profile"}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFirstName("");
                      setAge("");
                      setBio("");
                    }}
                    className="px-3 py-2.5 rounded-lg bg-[#F8FAFC] text-[#051836] text-xs border border-[#051836]/15"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Profiles Grid List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#051836]/10 shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#051836]/40 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={talentSearch}
                  onChange={(e) => setTalentSearch(e.target.value)}
                  placeholder="Search child directory..."
                  className="w-full pl-9 pr-4 py-1.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-lg text-xs text-[#051836] focus:outline-none focus:border-[#005C27]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#F8FAFC] border border-[#051836]/15 text-xs text-[#051836] rounded-lg p-1.5 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="Digital Art">Digital Art</option>
                <option value="Sports (Football)">Sports (Football)</option>
                <option value="Academics">Academics</option>
                <option value="Robotics">Robotics</option>
                <option value="Leadership">Leadership</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProfiles.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 border border-[#051836]/10 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl relative overflow-hidden bg-[#F8FAFC] shrink-0 border border-[#051836]/10">
                      <Image src={p.coverPhoto} alt={p.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-bold text-sm text-[#051836]">
                        {p.name}, {p.age}
                      </h3>
                      <span className="text-[10px] text-[#005C27] font-bold block">
                        {p.category} • {p.country_community || p.location}
                      </span>
                      <p className="text-[11px] text-[#051836]/70 line-clamp-2 mt-1">{p.bio}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#051836]/10">
                    <button
                      type="button"
                      onClick={() => handleToggleHomepageFeature(p.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        p.featuredOnHomepage
                          ? "bg-[#005C27]/10 text-[#005C27] border-[#005C27]/30"
                          : "bg-[#F8FAFC] text-[#051836]/50 border-[#051836]/10 hover:text-[#051836]"
                      }`}
                    >
                      {p.featuredOnHomepage ? "★ Featured on Homepage" : "+ Feature on Homepage"}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-1.5 bg-[#F8FAFC] hover:bg-[#051836]/10 text-[#051836] rounded-lg text-xs border border-[#051836]/10"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(p.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs border border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
