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
                location: location || "Chicago, IL",
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
        location: location || "Remote",
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
        dream: "Mastering technical skills and community innovation.",
        current_situation: bio,
        progress: "Actively participating in local community youth labs.",
        current_needs: "Educational grant & laptop hardware",
        country_community: location || "Remote",
        consentRecord: {
          parentalConsent: true,
          mediaReleasePermission: true,
          signedDate: "2026-01-10",
          guardianName: "Parent/Guardian",
        },
      };
      setProfiles((prev) => [newTalent, ...prev]);
    }

    setFirstName("");
    setAge("");
    setBio("");
    setLocation("");
    setCoverPhoto("");
    setRawMediaUrl("");
  };

  const handleEdit = (p: YouthProfile) => {
    setEditingId(p.id);
    setFirstName(p.name);
    setAge(p.age.toString());
    setCategory(p.category);
    setLocation(p.location || "");
    setBio(p.bio);
    setCoverPhoto(p.coverPhoto);
    setRawMediaUrl(p.rawMediaUrl || "");
  };

  const handleDelete = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "active" ? "archived" : "active",
            }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-inter text-[#0A1128] pb-16">
      {/* Header */}
      <header className="bg-[#0A1128] text-white px-6 py-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white/60 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-montserrat font-bold text-lg tracking-wider">
              Talent Directory &amp; Dual-Media CMS
            </h1>
            <p className="text-xs text-white/60">
              Manage public 16:9 cover photos &amp; raw sponsor media pipelines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
            RBAC Role:
          </span>
          <select
            value={adminRole}
            onChange={(e) => setAdminRole(e.target.value as any)}
            className="bg-white/10 text-white text-xs font-bold py-1.5 px-3 rounded-md border border-white/20"
          >
            <option value="Super Admin" className="bg-[#0A1128]">Super Admin</option>
            <option value="Curator" className="bg-[#0A1128]">Talent Curator</option>
            <option value="Vetting Officer" className="bg-[#0A1128]">Vetting Officer</option>
          </select>
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Session
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-4 border-b border-[#0A1128]/10 pb-4 text-xs font-semibold uppercase tracking-wider">
          <Link href="/admin" className="text-[#0A1128]/60 hover:text-[#0A1128]">
            Control Center
          </Link>
          <span className="text-[#0A1128]/30">&gt;</span>
          <Link href="/admin/vetting" className="text-[#0A1128]/60 hover:text-[#0A1128]">
            Vetting Queue
          </Link>
          <span className="text-[#0A1128]/30">&gt;</span>
          <span className="text-[#F28482] font-bold">Talent Directory (CMS)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="bg-white p-6 rounded-2xl border border-[#0A1128]/5 shadow-xs h-fit space-y-4">
            <h2 className="font-montserrat font-bold text-base text-[#0A1128] border-b border-[#0A1128]/5 pb-3">
              {editingId ? "Edit Youth Record" : "Add Youth Record (CMS Entry)"}
            </h2>

            <form onSubmit={handleSaveTalent} className="space-y-4 text-xs font-inter">
              <div>
                <label className="block font-semibold text-[#0A1128]/80 uppercase tracking-wider mb-1">
                  First Name (Strict Privacy Policy)
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full p-2.5 bg-[#FAFAFA] border border-[#0A1128]/10 rounded-lg focus:outline-none focus:border-[#F28482]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0A1128]/80 uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    min={12}
                    max={25}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="18"
                    className="w-full p-2.5 bg-[#FAFAFA] border border-[#0A1128]/10 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0A1128]/80 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#FAFAFA] border border-[#0A1128]/10 rounded-lg"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Music">Music</option>
                    <option value="Digital Art">Digital Art</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Biotech">Biotech</option>
                    <option value="Creative Writing">Creative Writing</option>
                    <option value="Dance & Performance">Dance &amp; Performance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0A1128]/80 uppercase tracking-wider mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Chicago, IL"
                  className="w-full p-2.5 bg-[#FAFAFA] border border-[#0A1128]/10 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0A1128]/80 uppercase tracking-wider mb-1">
                  Bio &amp; Achievements
                </label>
                <textarea
                  rows={3}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Summarize key projects, skills, and sponsorship goals..."
                  className="w-full p-2.5 bg-[#FAFAFA] border border-[#0A1128]/10 rounded-lg"
                />
              </div>

              <div className="pt-2 border-t border-[#0A1128]/5 space-y-3">
                <span className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#0A1128]/70 block">
                  Media Asset Configuration
                </span>

                <div>
                  <label className="block font-semibold text-[#0A1128]/80 text-[11px] mb-1">
                    1. Public 16:9 Cover Photo (Gallery Preview)
                  </label>
                  <input
                    type="url"
                    value={coverPhoto}
                    onChange={(e) => setCoverPhoto(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full p-2.5 bg-[#FAFAFA] border border-[#0A1128]/10 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0A1128]/80 text-[11px] mb-1">
                    2. Full Raw Asset URL (Sponsor Player)
                  </label>
                  <input
                    type="url"
                    value={rawMediaUrl}
                    onChange={(e) => setRawMediaUrl(e.target.value)}
                    placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                    className="w-full p-2.5 bg-[#FAFAFA] border border-[#0A1128]/10 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#F28482] hover:brightness-105 text-white font-bold py-2.5 px-4 rounded-lg transition text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingId ? "Update Record" : "Publish Record"}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-3 py-2.5 text-xs text-[#0A1128]/60 hover:text-[#0A1128]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Directory Table Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#0A1128]/5 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#0A1128]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="font-montserrat font-bold text-lg text-[#0A1128]">
                Published Roster ({profiles.length})
              </h2>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#0A1128]/40 absolute left-3 top-3" />
                <input
                  type="text"
                  value={talentSearch}
                  onChange={(e) => setTalentSearch(e.target.value)}
                  placeholder="Search profiles..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FAFAFA] border border-[#0A1128]/10 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-[#0A1128]/5 text-[11px] font-bold uppercase tracking-wider text-[#0A1128]/60">
                    <th className="py-3 px-4">Talent</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Inquiries</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A1128]/5">
                  {filteredProfiles.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAFAFA]/60 transition">
                      <td className="py-3 px-4 font-bold text-[#0A1128] flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[#0A1128]/10">
                          <Image src={p.coverPhoto} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p>{p.name}, {p.age}</p>
                          <span className="text-[10px] text-[#0A1128]/50">{p.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#0A1128]/70">
                        {p.category}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#0A1128]">
                        {p.inquiriesCount}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            p.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : p.status === "sponsored"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(p.id)}
                            className="text-[11px] font-semibold text-[#0A1128]/60 hover:text-[#0A1128]"
                          >
                            {p.status === "active" ? "Archive" : "Publish"}
                          </button>
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-[#F28482] hover:text-[#0A1128] p-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
