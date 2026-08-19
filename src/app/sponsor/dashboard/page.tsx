"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { YouthProfile } from "@/lib/data";
import { 
  ShieldCheck, 
  Clock, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  MessageSquare,
  Building2,
  Mail,
  User,
  Bell,
  Edit3,
  Lock,
  Filter,
  Check,
  Award,
  Layers,
  Phone,
  Download,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export default function SponsorDashboardPage() {
  const { user, userStatus, pendingSponsors, profiles } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<
    "overview" | "exhibition" | "partnerships" | "security" | "certificates" | "alerts"
  >("overview");

  // Find active sponsor or fallback
  const sponsorMatch = pendingSponsors.find(
    (s) => s.email.toLowerCase() === (user?.email || "sponsor@wlp.org").toLowerCase()
  ) || pendingSponsors[0];

  // Feed Filter
  const [feedCategory, setFeedCategory] = useState<string>("All");

  const availableCategories = ["All", "Technology", "Robotics", "Digital Art", "Music", "Sports", "Academics", "Leadership", "Entrepreneurship", "Biotech", "Creative Writing"];

  const activeProfiles = profiles;

  useEffect(() => {
    if (userStatus === "logged_out" || userStatus === "pending") router.replace("/login");
  }, [router, userStatus]);

  if (userStatus === "logged_out" || userStatus === "pending") return null;

  const filteredFeed = activeProfiles.filter((p) => {
    if (feedCategory === "All") return p.status === "active" || p.status === "sponsored";
    return p.category === feedCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] pb-16 bg-foundation-pattern relative">
      {/* Top Banner Header */}
      <div className="bg-white text-[#051836] py-8 px-4 sm:px-6 lg:px-8 border-b border-[#051836]/10 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link href="/">
                <img
                  src="/pwlif-logo.png"
                  alt="PWLIF"
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <div className="h-5 w-px bg-[#051836]/20" />
              <h1 className="font-montserrat font-black text-2xl sm:text-3xl text-[#051836]">
                My Sponsorship Hub
              </h1>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="bg-[#F5AB00] text-[#051836] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Tier: {sponsorMatch?.membershipTier || "Gold"}
              </span>
              <span className="bg-[#005C27] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Category: {sponsorMatch?.sponsorCategory || "Sponsor Partner"}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#051836]/80">
              Welcome back, <strong>{sponsorMatch?.name || "Approved Sponsor"}</strong> ({sponsorMatch?.company || "PWLIF Partner"}). Your passwordless sponsor access is active for approved Sponsor Talent and partnership information.
            </p>
          </div>

          <Link
            href="/"
            className="self-start md:self-auto bg-[#005C27] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs hover:bg-[#327B2F] transition shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Foundation Homepage</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* 7 Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#051836]/10 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-[#005C27] text-[#005C27]"
                : "border-transparent text-[#051836]/60 hover:text-[#051836]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("exhibition")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "exhibition"
                ? "border-[#005C27] text-[#005C27]"
                : "border-transparent text-[#051836]/60 hover:text-[#051836]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Sponsor Talent</span>
          </button>

          <button
            onClick={() => setActiveTab("partnerships")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "partnerships"
                ? "border-[#005C27] text-[#005C27]"
                : "border-transparent text-[#051836]/60 hover:text-[#051836]"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Partnership Desk</span>
          </button>



          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "security"
                ? "border-[#005C27] text-[#005C27]"
                : "border-transparent text-[#051836]/60 hover:text-[#051836]"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Account &amp; Access</span>
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "certificates"
                ? "border-[#005C27] text-[#005C27]"
                : "border-transparent text-[#051836]/60 hover:text-[#051836]"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Partnership Documents</span>
          </button>

          <button
            onClick={() => setActiveTab("alerts")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "alerts"
                ? "border-[#005C27] text-[#005C27]"
                : "border-transparent text-[#051836]/60 hover:text-[#051836]"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[#051836]">
            {/* Account Info Box */}
            <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#051836]/10 pb-4">
                <h2 className="font-montserrat font-bold text-lg text-[#051836] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#005C27]" />
                  <span>Verified Organization</span>
                </h2>
                <button
                  onClick={() => setActiveTab("security")}
                  className="text-xs font-semibold text-[#005C27] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#051836]/50 font-semibold uppercase tracking-wider block mb-1">
                    Organization Name
                  </span>
                  <p className="font-bold text-[#051836] text-sm flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#051836]/40" />
                    {sponsorMatch?.company || "PWLIF Partner"}
                  </p>
                </div>

                <div>
                  <span className="text-[#051836]/50 font-semibold uppercase tracking-wider block mb-1">
                    Sponsor Representative
                  </span>
                  <p className="font-bold text-[#051836] text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#051836]/40" />
                    {sponsorMatch?.name || "Approved Sponsor"}
                  </p>
                </div>

                <div>
                  <span className="text-[#051836]/50 font-semibold uppercase tracking-wider block mb-1">
                    Sponsorship Category &amp; Tier
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#005C27]/10 text-[#005C27] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#005C27]/20">
                      {sponsorMatch?.sponsorCategory || "Sponsor Partner"}
                    </span>
                    <span className="bg-[#F5AB00]/15 text-[#051836] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#051836]/20">
                      {sponsorMatch?.membershipTier || "Gold Tier"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[#051836]/50 font-semibold uppercase tracking-wider block mb-1">
                    Verified Email Address
                  </span>
                  <p className="font-bold text-[#051836] text-sm flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#051836]/40" />
                    {sponsorMatch?.email || user?.email || "Approved sponsor email"}
                  </p>
                </div>

                <div>
                  <span className="text-[#051836]/50 font-semibold uppercase tracking-wider block mb-1">
                    Focus Track Interests
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(sponsorMatch?.interests || ["Technology", "Robotics"]).map((int: string) => (
                      <span
                        key={int}
                        className="bg-[#F8FAFC] text-[#051836] font-semibold px-2.5 py-1 rounded-md border border-[#051836]/10 text-[11px]"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl">
                <h2 className="font-montserrat font-bold text-lg text-[#051836] flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#005C27]" />
                  <span>Sponsorship Overview</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10">
                    <span className="text-3xl font-black text-[#005C27] font-montserrat">
                      Private
                    </span>
                    <p className="text-xs text-[#051836]/60 font-semibold mt-1">
                      Partnership planning
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10">
                    <span className="text-3xl font-black text-[#005C27] font-montserrat">
                      Sponsor Talent
                    </span>
                    <p className="text-xs text-[#051836]/60 font-semibold mt-1">
                      Published records only
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10">
                    <span className="text-3xl font-black text-[#F5AB00] font-montserrat">
                      Guided
                    </span>
                    <p className="text-xs text-[#051836]/60 font-semibold mt-1">
                      Orientation-led access
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("exhibition")}
                    className="bg-[#005C27] hover:bg-[#327B2F] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>View Sponsor Talent</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                  <button
                    disabled
                    className="bg-[#F8FAFC] text-[#051836]/50 border border-[#051836]/15 px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 text-[#005C27]" />
                    <span>Documents unavailable</span>
                  </button>
                </div>
              </div>

              {/* Security & Governance Status Box */}
              <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl space-y-3">
                <h3 className="font-montserrat font-bold text-sm text-[#051836] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#005C27]" />
                  <span>Access &amp; Safeguarding Status</span>
                </h3>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-[#005C27]/20 text-xs text-[#051836] space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-[#005C27]">
                    <CheckCircle2 className="w-4 h-4 text-[#005C27]" /> Sponsor Access Active
                  </p>
                  <p className="text-[#051836]/70 leading-relaxed">
                    Your account was approved after an orientation call. PWLIF shares sensitive partnership details through appropriate private channels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPONSOR TALENT */}
        {activeTab === "exhibition" && (
          <div className="space-y-6 text-[#051836]">
            <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#005C27]" />
                  <span>Sponsor Talent Directory</span>
                </h2>
                <p className="text-xs text-[#051836]/70 mt-0.5">
                  Review the Sponsor Talent records that PWLIF has chosen to publish for partnership discovery.
                </p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                <Filter className="w-4 h-4 text-[#051836]/40 shrink-0" />
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFeedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                      feedCategory === cat
                        ? "bg-[#005C27] text-white font-bold"
                        : "bg-[#F8FAFC] text-[#051836]/70 border border-[#051836]/10 hover:border-[#005C27]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredFeed.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#051836]/10 shadow-lg hover:border-[#005C27]/40 transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-[#051836] border border-[#051836]/10">
                      <Image
                        src={profile.coverPhoto}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute top-2 left-2 bg-[#005C27] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {profile.category}
                      </span>
                      <span className="absolute bottom-2 right-2 bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Published profile
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                        Sponsor Talent Profile
                      </h3>
                      <span className="text-xs font-semibold text-[#051836]/50">
                        {profile.country_community || profile.location}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#051836]/10 text-xs mb-3 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#005C27]">
                        Sponsor Talent
                      </span>
                      <p className="text-[11px] text-[#051836]/80 pt-1">
                        <strong>Focus area:</strong> {profile.category}
                      </p>
                    </div>

                    <p className="text-xs text-[#051836]/70 line-clamp-2 mb-4 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#051836]/10">
                    <Link
                      href={`/portfolio/${profile.id}`}
                      className="w-full bg-[#F8FAFC] hover:bg-[#005C27] hover:text-white text-[#051836] font-bold py-2.5 px-3 rounded-xl text-xs transition text-center block border border-[#051836]/15"
                    >
                      View Sponsor Talent Details
                    </Link>
                    <Link
                      href="/book-a-call"
                      className="w-full bg-[#005C27]/10 hover:bg-[#005C27] hover:text-white text-[#005C27] font-extrabold py-2.5 px-3 rounded-xl text-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer border border-[#005C27]/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Discuss a Partnership</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PARTNERSHIP DESK */}
        {activeTab === "partnerships" && (
          <div className="bg-white rounded-3xl border border-[#051836]/10 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 text-[#051836]">
            <div>
              <h2 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#005C27]" />
                <span>Partnership Coordination</span>
              </h2>
              <p className="text-xs text-[#051836]/70 mt-1">
                Individual sponsorship assignments are not displayed in this dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter">
              <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#051836]/10 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-montserrat font-bold text-base text-[#051836]">Private partnership coordination</h4>
                  <p className="text-xs text-[#051836]/60 mt-1">PWLIF coordinates any next steps after a private conversation and appropriate safeguarding review.</p>
                </div>
                <Link href="/book-a-call" className="text-[#005C27] font-bold hover:underline flex items-center gap-1 text-xs">
                  <MessageSquare className="w-3.5 h-3.5" /> Book a partnership call
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACCOUNT & ACCESS */}
        {activeTab === "security" && (
          <div className="bg-white rounded-3xl border border-[#051836]/10 shadow-xl p-6 sm:p-8 space-y-8 max-w-3xl mx-auto text-[#051836]">
            <div className="border-b border-[#051836]/10 pb-4">
              <h2 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#005C27]" />
                <span>Account &amp; Access Settings</span>
              </h2>
              <p className="text-xs text-[#051836]/70 mt-1">
                PWLIF uses passwordless email-link access for approved sponsors.
              </p>
            </div>

            <div className="space-y-4 text-xs font-inter">
              <h3 className="font-montserrat font-bold text-sm text-[#051836]">Approved Sponsor Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl">
                  <span className="block font-bold text-[#051836]/80 uppercase tracking-wider mb-1">Representative</span>
                  <p className="text-sm text-[#051836]">{sponsorMatch?.name || "Approved Sponsor"}</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl">
                  <span className="block font-bold text-[#051836]/80 uppercase tracking-wider mb-1">Organization</span>
                  <p className="text-sm text-[#051836]">{sponsorMatch?.company || "PWLIF Partner"}</p>
                </div>
              </div>
              <p className="text-[#051836]/60">For changes to approved sponsor details, please contact the PWLIF team through a scheduled partnership call.</p>
            </div>

            <div className="pt-6 border-t border-[#051836]/10 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-montserrat font-bold text-sm text-[#051836]">Passwordless Sign-In</h4>
                <p className="text-xs text-[#051836]/60">Your sponsor invitation uses a secure email link. Password changes and self-managed MFA are not part of this portal.</p>
              </div>
              <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-[#005C27] border border-[#005C27]/30 shrink-0">Email-link access</span>
            </div>
          </div>
        )}

        {/* TAB 6: PARTNERSHIP DOCUMENTS */}
        {activeTab === "certificates" && (
          <div className="bg-white rounded-3xl border border-[#051836]/10 shadow-xl p-6 sm:p-8 space-y-6 text-[#051836]">
            <div>
              <h2 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#005C27]" />
                <span>Partnership Documents</span>
              </h2>
              <p className="text-xs text-[#051836]/70 mt-1">
                Financial and transparency reporting are intentionally not available through this portal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter text-xs">
              <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#051836]/10 space-y-4">
                <div className="flex items-center justify-between border-b border-[#051836]/10 pb-3">
                  <span className="text-xs font-mono text-[#005C27] font-bold">PARTNERSHIP-ACCESS</span>
                  <span className="bg-[#051836]/10 text-[#051836]/60 text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#051836]/20">Unavailable</span>
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-base text-[#051836]">Private partnership information</h4>
                  <p className="text-xs text-[#051836]/60 mt-1">PWLIF discusses partnership details through appropriate private channels.</p>
                </div>
                <button disabled className="w-full bg-[#005C27]/10 text-[#005C27]/50 font-bold py-2.5 px-4 rounded-xl text-xs border border-[#005C27]/30 transition flex items-center justify-center gap-2 cursor-not-allowed">
                  <Download className="w-4 h-4" /> No document available
                </button>
              </div>

              <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#051836]/10 space-y-4">
                <div className="flex items-center justify-between border-b border-[#051836]/10 pb-3">
                  <span className="text-xs font-mono text-[#005C27] font-bold">PORTAL-STATUS</span>
                  <span className="bg-[#051836]/10 text-[#051836]/60 text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#051836]/20">Disabled</span>
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-base text-[#051836]">Reporting workflows</h4>
                  <p className="text-xs text-[#051836]/60 mt-1">This application does not publish financial, tax, or transparency records.</p>
                </div>
                <button disabled className="w-full bg-[#005C27]/10 text-[#005C27]/50 font-bold py-2.5 px-4 rounded-xl text-xs border border-[#005C27]/30 transition flex items-center justify-center gap-2 cursor-not-allowed">
                  <Download className="w-4 h-4" /> No document available
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: NOTIFICATIONS */}
        {activeTab === "alerts" && (
          <div className="bg-white rounded-3xl border border-[#051836]/10 shadow-xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto text-[#051836]">
            <div>
              <h2 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#005C27]" />
                <span>Notification Settings</span>
              </h2>
              <p className="text-xs text-[#051836]/70 mt-1">
                Automated sponsor notifications are not enabled in this portal.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 text-xs text-[#051836]/70 leading-relaxed">
              PWLIF does not use this dashboard to promise or manage automated alerts. Please use the established partnership channel to coordinate any follow-up.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
