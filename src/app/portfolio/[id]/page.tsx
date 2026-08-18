"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldCheck, 
  Lock, 
  Download, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Heart,
  Award,
  AlertCircle,
  Globe,
  FileText
} from "lucide-react";

export default function PortfolioDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { profiles } = useAuth();
  const router = useRouter();
  
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);

  const profile = profiles.find((p) => p.id === id) ?? profiles[0];
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] bg-foundation-pattern flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl border border-[#051836]/10 shadow-xl text-center space-y-4 max-w-md">
          <h1 className="font-montserrat text-2xl font-black">Sponsor Talent information is shared through orientation.</h1>
          <Link href="/book-a-call" className="inline-flex bg-[#005C27] text-white font-bold px-5 py-3 rounded-xl text-xs">Book Orientation Call</Link>
        </div>
      </div>
    );
  }

  const hasMediaConsent = profile.consentRecord?.mediaReleasePermission !== false;

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      router.push("/book-a-call");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] pb-20 bg-foundation-pattern">
      {/* Navigation Top Bar (Light Palette) */}
      <div className="bg-[#FDFCF9] border-b border-[#051836]/10 py-4 px-4 sm:px-6 lg:px-8 text-[#051836]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#051836]/80 hover:text-[#005C27] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Foundation Homepage</span>
          </Link>

          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Privacy-First Information
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Media Stage & Story */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-[#005C27] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {profile.category}
                  </span>
                  <span className="text-xs text-[#051836]/70 font-bold flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-[#005C27]" />
                    {profile.country_community || profile.location}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#005C27] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Status: Sponsor Talent
                </span>
              </div>

              <h1 className="font-montserrat text-3xl font-black text-[#051836]">
                Sponsor Talent Overview
              </h1>

              {/* Parental / Guardian Media Release Check */}
              {!hasMediaConsent ? (
                <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                  <Lock className="w-10 h-10 text-amber-600 mx-auto" />
                  <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                    Photo &amp; Video Media Unavailable
                  </h3>
                  <p className="text-xs text-[#051836]/80 max-w-md mx-auto leading-relaxed">
                    Public media is unavailable to protect privacy. Additional Sponsor Talent context is shared through a private orientation conversation.
                  </p>
                </div>
              ) : (
                /* Media Stage */
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#051836] border border-[#051836]/15 flex items-center justify-center">
                  <Image
                    src={profile.coverPhoto}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs font-mono text-[#F5AB00] font-bold uppercase tracking-wider mb-1">
                      Sponsor Talent Overview
                    </span>
                    <h3 className="font-montserrat font-bold text-xl text-white">
                      &quot;{profile.dream}&quot;
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Story, Current Situation, & Needs */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#051836]/10 shadow-xl space-y-6">
              <div>
                <h2 className="font-montserrat font-bold text-xl text-[#051836] mb-2">
                  Sponsor Talent Overview
                </h2>
                <p className="text-sm text-[#051836]/80 leading-relaxed">
                  {profile.current_situation || profile.bio}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#051836]/10">
                <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#051836]/10 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
                    Current Opportunity
                  </span>
                  <p className="text-xs text-[#051836]/90 font-medium">
                    {profile.progress || "Actively participating in local community youth labs."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#005C27]/5 border border-[#005C27]/20 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
                    Support Focus
                  </span>
                  <p className="text-xs text-[#051836]/90 font-bold">
                    {profile.current_needs}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-montserrat font-bold text-xs text-[#005C27] uppercase tracking-wider mb-2">
                  Core Skills &amp; Talents
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(profile.skills) && profile.skills.length ? profile.skills : ["Sponsor Talent"]).map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-[#051836] text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sponsor This Dream Action Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl sticky top-24 space-y-6">
              <div className="flex items-center gap-3 border-b border-[#051836]/10 pb-4">
                <div className="w-12 h-12 rounded-full bg-[#005C27] text-white flex items-center justify-center font-montserrat font-black text-lg">
                  {profile.name[0]}
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                    {profile.name}
                  </h3>
                  <span className="text-xs text-[#051836]/60 font-medium">
                    📍 {profile.country_community || profile.location}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#005C27]/10 border border-[#005C27]/30 text-xs space-y-2">
                <span className="font-bold text-[#005C27] block uppercase tracking-wider text-[11px]">
                  Privacy Summary
                </span>
                <p className="text-[#051836]/80 text-[11px] leading-relaxed">
                  Public information is limited to non-identifying Sponsor Talent context. Further details are discussed privately during orientation.
                </p>
              </div>

              <button
                onClick={() => setShowSponsorModal(true)}
                className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-black py-4 px-6 rounded-2xl shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Heart className="w-5 h-5 text-[#F5AB00] fill-[#F5AB00]" />
                <span>Discuss Sponsor Talent</span>
              </button>

              <Link
                href="/book-a-call"
                className="w-full bg-[#051836] text-white font-bold py-3 px-4 rounded-xl text-xs transition text-center flex items-center justify-center gap-2 block cursor-pointer"
              >
                <span>Book Orientation Call</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

          {/* Sponsor Talent Orientation Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 bg-[#051836]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-8 rounded-3xl shadow-2xl border border-[#051836]/10 relative font-inter space-y-6">
            <div>
              <h3 className="font-montserrat font-bold text-xl text-[#051836] mb-1">
                Discuss Sponsor Talent
              </h3>
              <p className="text-xs text-[#051836]/70">
                Support focus: <strong>{profile.current_needs}</strong>
              </p>
            </div>

            {sent ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center text-xs text-emerald-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-base text-[#051836]">Orientation interest received</p>
                <p>
                  Your interest has been noted. Please continue with a private orientation conversation before any next step.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#051836] uppercase tracking-wider mb-2">
                    Orientation Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how you would like to explore Sponsor Talent support..."
                    className="w-full p-3 bg-white border border-[#051836]/20 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSponsorModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#051836]/60 hover:text-[#051836]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#005C27] hover:bg-[#327B2F] text-white px-6 py-3 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-[#F5AB00] fill-[#F5AB00]" />
                    <span>Continue to Orientation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
