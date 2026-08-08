"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { INITIAL_YOUTH_PROFILES, YouthProfile } from "@/lib/data";
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
  KeyRound,
} from "lucide-react";

export default function SponsorDashboardPage() {
  const { user, userStatus, pendingSponsors, inquiries, profiles, sendInquiry, updateSponsorProfile, completeFirstTimeProfile, updateSponsorPassword } = useAuth();
  
  const [activeTab, setActiveTab] = useState<
    "overview" | "exhibition" | "partnerships" | "security" | "certificates" | "alerts"
  >("overview");

  // Find active sponsor or fallback
  const sponsorMatch = pendingSponsors.find(
    (s) => s.email.toLowerCase() === (user?.email || "sponsor@wlp.org").toLowerCase()
  ) || pendingSponsors[0];

  const sponsorInquiries = inquiries.filter(
    (inq) => inq.sponsorEmail.toLowerCase() === (user?.email || sponsorMatch?.email || "").toLowerCase()
  );

  // First-Time Profile Modal Form State
  const [modalCompany, setModalCompany] = useState(sponsorMatch?.company || "");
  const [modalIndustry, setModalIndustry] = useState("Technology & VC");
  const [modalContactName, setModalContactName] = useState(sponsorMatch?.name || "");
  const [modalPhone, setModalPhone] = useState("+1 (555) 234-5678");
  const [modalAgreed, setModalAgreed] = useState(false);

  // Profile Edit State
  const [editName, setEditName] = useState(sponsorMatch?.name || "WLP Partner");
  const [editCompany, setEditCompany] = useState(sponsorMatch?.company || "WLP Impact Network");
  const [editLinkedin, setEditLinkedin] = useState(sponsorMatch?.linkedin || "https://linkedin.com");
  const [editInterests, setEditInterests] = useState<string[]>(sponsorMatch?.interests || ["Technology", "Robotics"]);
  const [savedNotice, setSavedNotice] = useState(false);

  // Password & Security State
  const [newPassword, setNewPassword] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [passwordNotice, setPasswordNotice] = useState(false);

  // Alert Settings State
  const [alertCategory, setAlertCategory] = useState("AI & Technology");
  const [alertFrequency, setAlertFrequency] = useState("Weekly Digest");
  const [alertNotice, setAlertNotice] = useState(false);

  // Feed Filter
  const [feedCategory, setFeedCategory] = useState<string>("All");

  // Messaging Modal State
  const [messagingTalent, setMessagingTalent] = useState<YouthProfile | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messageSentNotice, setMessageSentNotice] = useState(false);

  const availableCategories = ["All", "Technology", "Robotics", "Digital Art", "Music", "Sports", "Academics", "Leadership", "Entrepreneurship", "Biotech", "Creative Writing"];

  const activeProfiles = profiles && profiles.length > 0 ? profiles : INITIAL_YOUTH_PROFILES;

  const filteredFeed = activeProfiles.filter((p) => {
    if (feedCategory === "All") return p.status === "active" || p.status === "sponsored";
    return p.category === feedCategory;
  });

  const handleFirstTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAgreed) return;
    completeFirstTimeProfile(sponsorMatch.id, modalContactName, modalCompany, "https://linkedin.com", [modalIndustry]);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSponsorProfile(sponsorMatch.id, editName, editCompany, editLinkedin, editInterests);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messagingTalent || !messageText) return;
    sendInquiry(messagingTalent.id, messagingTalent.name, messageText);
    setMessageSentNotice(true);
    setTimeout(() => {
      setMessageSentNotice(false);
      setMessagingTalent(null);
      setMessageText("");
    }, 2000);
  };

  // Mandatory First-Time Profile Completion Modal check
  const showFirstTimeModal = userStatus === "approved" && sponsorMatch && !sponsorMatch.isProfileComplete;

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] pb-16 bg-foundation-pattern relative">
      {/* 1. MANDATORY FIRST-TIME LOGIN PROFILE SETUP MODAL */}
      {showFirstTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051836]/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 border border-[#005C27]/30 shadow-2xl space-y-6 text-[#051836]">
            <div className="text-center space-y-2 border-b border-[#051836]/10 pb-4">
              <div className="inline-flex p-3 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/30 mb-1">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="font-montserrat text-2xl font-black text-[#051836]">
                Complete Sponsor Profile
              </h2>
              <p className="text-xs text-[#051836]/70">
                Welcome to PWLIF! Before accessing child dream profiles and tracking sponsorship impact, please verify your sponsor credentials.
              </p>
            </div>

            <form onSubmit={handleFirstTimeSubmit} className="space-y-4 text-xs font-inter">
              <div>
                <label className="block font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                  Organization / Sponsor Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={modalCompany}
                  onChange={(e) => setModalCompany(e.target.value)}
                  placeholder="e.g. NextGen Philanthropic Foundation"
                  className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                    Sponsorship Sector *
                  </label>
                  <select
                    value={modalIndustry}
                    onChange={(e) => setModalIndustry(e.target.value)}
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27]"
                  >
                    <option value="Technology & VC">Technology &amp; Education</option>
                    <option value="Arts & Media Production">Arts &amp; Media</option>
                    <option value="Robotics & Hardware Engineering">STEM &amp; Robotics</option>
                    <option value="Biotech & Life Sciences">Biotech &amp; Life Sciences</option>
                    <option value="Corporate Foundation / CSR">Corporate Foundation / CSR</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                    Direct Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#051836]/10 text-[11px] text-[#051836]/80 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={modalAgreed}
                    onChange={(e) => setModalAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-[#005C27] focus:ring-[#005C27]"
                  />
                  <span>
                    I confirm that I am an authorized representative and agree to uphold PWLIF Child Protection &amp; Parental Consent standards.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!modalAgreed}
                className="w-full bg-[#005C27] hover:bg-[#327B2F] disabled:opacity-50 text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <span>Activate My Sponsorship Hub</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}

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
                Category: {sponsorMatch?.sponsorCategory || "Child Sponsor"}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#051836]/80">
              Welcome back, <strong>{sponsorMatch?.name || "Verified Sponsor"}</strong> ({sponsorMatch?.company || "PWLIF Impact Partner"}). Child dream tracking &amp; financial audit downloads active.
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
            <span>Dream Tracking</span>
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
            <span>My Sponsored Dreams</span>
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
            <span>Security &amp; Password</span>
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
            <span>Impact Reports</span>
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
            <span>Child Alerts</span>
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
                    {sponsorMatch?.company || "NextGen Ventures"}
                  </p>
                </div>

                <div>
                  <span className="text-[#051836]/50 font-semibold uppercase tracking-wider block mb-1">
                    Sponsor Representative
                  </span>
                  <p className="font-bold text-[#051836] text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#051836]/40" />
                    {sponsorMatch?.name || "Sophia Martinez"}
                  </p>
                </div>

                <div>
                  <span className="text-[#051836]/50 font-semibold uppercase tracking-wider block mb-1">
                    Sponsorship Category &amp; Tier
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#005C27]/10 text-[#005C27] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#005C27]/20">
                      {sponsorMatch?.sponsorCategory || "Child Sponsor"}
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
                    {sponsorMatch?.email || "sponsor@wlp.org"}
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
                  <span>Sponsorship Impact Overview</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10">
                    <span className="text-3xl font-black text-[#005C27] font-montserrat">
                      $15,000
                    </span>
                    <p className="text-xs text-[#051836]/60 font-semibold mt-1">
                      Direct Capital Grants Deployed
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10">
                    <span className="text-3xl font-black text-[#005C27] font-montserrat">
                      2 Children
                    </span>
                    <p className="text-xs text-[#051836]/60 font-semibold mt-1">
                      Actively Sponsored
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10">
                    <span className="text-3xl font-black text-[#F5AB00] font-montserrat">
                      100%
                    </span>
                    <p className="text-xs text-[#051836]/60 font-semibold mt-1">
                      Parent Consent Verified
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("exhibition")}
                    className="bg-[#005C27] hover:bg-[#327B2F] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>View Child Dream Progress</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setActiveTab("certificates")}
                    className="bg-[#F8FAFC] text-[#051836] border border-[#051836]/15 px-5 py-2.5 rounded-xl font-bold text-xs hover:border-[#005C27] hover:text-[#005C27] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#005C27]" />
                    <span>Download Impact Reports</span>
                  </button>
                </div>
              </div>

              {/* Security & Governance Status Box */}
              <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl space-y-3">
                <h3 className="font-montserrat font-bold text-sm text-[#051836] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#005C27]" />
                  <span>Child Protection &amp; Governance Clearance</span>
                </h3>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-[#005C27]/20 text-xs text-[#051836] space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-[#005C27]">
                    <CheckCircle2 className="w-4 h-4 text-[#005C27]" /> Sponsor Credentials Active &amp; Verified
                  </p>
                  <p className="text-[#051836]/70 leading-relaxed">
                    Your sponsor account has passed PWLIF admissions clearance. All interactions adhere to 100% verified parental consent records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DREAM TRACKING (PROGRESS UPDATES) */}
        {activeTab === "exhibition" && (
          <div className="space-y-6 text-[#051836]">
            <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#005C27]" />
                  <span>Dream Tracking &amp; Child Milestone Progress</span>
                </h2>
                <p className="text-xs text-[#051836]/70 mt-0.5">
                  Follow live progress updates and grant distribution for sponsored children.
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
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Parent Consent Verified
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                        {profile.name}, {profile.age}
                      </h3>
                      <span className="text-xs font-semibold text-[#051836]/50">
                        {profile.country_community || profile.location}
                      </span>
                    </div>

                    {/* Child's Dream */}
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#051836]/10 text-xs mb-3 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#005C27]">
                        🌟 Dream: &quot;{profile.dream}&quot;
                      </span>
                      <p className="text-[11px] text-[#051836]/80 pt-1">
                        <strong>Current Progress:</strong> {profile.progress}
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
                      View Child Portfolio &amp; Details
                    </Link>
                    <button
                      onClick={() => setMessagingTalent(profile)}
                      className="w-full bg-[#005C27]/10 hover:bg-[#005C27] hover:text-white text-[#005C27] font-extrabold py-2.5 px-3 rounded-xl text-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer border border-[#005C27]/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Sponsor This Dream</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MY SPONSORED DREAMS */}
        {activeTab === "partnerships" && (
          <div className="bg-white rounded-3xl border border-[#051836]/10 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 text-[#051836]">
            <div>
              <h2 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#005C27]" />
                <span>My Sponsored Children &amp; Dreams</span>
              </h2>
              <p className="text-xs text-[#051836]/70 mt-1">
                Active child dream profiles supported by your organization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter">
              {activeProfiles.slice(0, 2).map((p) => (
                <div key={p.id} className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#051836]/10 flex flex-col justify-between space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 border-2 border-[#005C27]">
                      <Image src={p.coverPhoto} alt={p.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-montserrat font-bold text-base text-[#051836]">{p.name}</h4>
                      <p className="text-xs text-[#005C27] font-semibold">{p.category} • {p.country_community || p.location}</p>
                      <span className="inline-block mt-1 bg-emerald-100 text-[#005C27] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#005C27]/20">
                        Grant Active ($7,500)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#051836]/10 text-xs">
                    <strong className="text-[#005C27]">Dream:</strong> &quot;{p.dream}&quot;
                  </div>

                  <div className="pt-2 border-t border-[#051836]/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setMessagingTalent(p)}
                      className="text-[#005C27] font-bold hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message Foundation Desk
                    </button>
                    <Link href={`/portfolio/${p.id}`} className="text-[#051836]/60 hover:text-[#005C27] flex items-center gap-1 font-semibold">
                      View Progress <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & SETTINGS */}
        {activeTab === "security" && (
          <div className="bg-white rounded-3xl border border-[#051836]/10 shadow-xl p-6 sm:p-8 space-y-8 max-w-3xl mx-auto text-[#051836]">
            <div className="border-b border-[#051836]/10 pb-4">
              <h2 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#005C27]" />
                <span>Security &amp; Password Settings</span>
              </h2>
              <p className="text-xs text-[#051836]/70 mt-1">
                Manage your credentials, Multi-Factor Authentication (MFA), and sponsor profile.
              </p>
            </div>

            {/* Profile Update Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-inter">
              <h3 className="font-montserrat font-bold text-sm text-[#051836]">Update Representative Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                    Representative Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                  Website / LinkedIn URL
                </label>
                <input
                  type="url"
                  required
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#005C27] text-white font-bold py-2.5 px-5 rounded-xl transition text-xs hover:bg-[#327B2F]"
                >
                  Save Profile Details
                </button>
                {savedNotice && <span className="ml-3 text-xs text-emerald-600 font-semibold">Saved!</span>}
              </div>
            </form>

            {/* Change Password Form */}
            <div className="pt-6 border-t border-[#051836]/10 space-y-4">
              <h3 className="font-montserrat font-bold text-sm text-[#051836] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#005C27]" /> Change Sponsor Password
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPassword.trim()) return;
                  if (sponsorMatch?.email || user?.email) {
                    updateSponsorPassword(sponsorMatch?.email || user?.email || "", newPassword);
                  }
                  setPasswordNotice(true);
                  setNewPassword("");
                  setTimeout(() => setPasswordNotice(false), 4000);
                }}
                className="flex flex-col sm:flex-row items-end gap-4 text-xs font-inter"
              >
                <div className="flex-1 w-full">
                  <label className="block font-bold text-[#051836]/80 mb-1">New Sponsor Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password..."
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3 px-6 rounded-xl transition text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </form>

              {passwordNotice && (
                <p className="text-xs text-[#005C27] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#005C27]" /> New password saved. Temporary password has been invalidated immediately.
                </p>
              )}
            </div>

            {/* MFA Security Toggle */}
            <div className="pt-6 border-t border-[#051836]/10 flex items-center justify-between">
              <div>
                <h4 className="font-montserrat font-bold text-sm text-[#051836]">Multi-Factor Authentication (MFA)</h4>
                <p className="text-xs text-[#051836]/60">Enforce OTP verification upon login.</p>
              </div>

              <button
                type="button"
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  mfaEnabled ? "bg-emerald-100 text-[#005C27] border border-[#005C27]/30" : "bg-gray-100 text-[#051836]/60"
                }`}
              >
                {mfaEnabled ? "MFA Active ✓" : "Enable MFA"}
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: IMPACT REPORTS */}
        {activeTab === "certificates" && (
          <div className="bg-white rounded-3xl border border-[#051836]/10 shadow-xl p-6 sm:p-8 space-y-6 text-[#051836]">
            <div>
              <h2 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#005C27]" />
                <span>Foundation Impact &amp; Financial Stewardship Reports</span>
              </h2>
              <p className="text-xs text-[#051836]/70 mt-1">
                Official verified reports for grant allocations, child progress milestones, and tax receipts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter text-xs">
              <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#051836]/10 space-y-4">
                <div className="flex items-center justify-between border-b border-[#051836]/10 pb-3">
                  <span className="text-xs font-mono text-[#005C27] font-bold">REPORT-2026-PWLIF-091</span>
                  <span className="bg-emerald-100 text-[#005C27] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#005C27]/20">Verified</span>
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-base text-[#051836]">Direct Grant: Laptop &amp; Learning Tools</h4>
                  <p className="text-xs text-[#051836]/60 mt-1">Sponsor: {sponsorMatch?.company} • Amount: $7,500</p>
                </div>
                <button className="w-full bg-[#005C27]/10 hover:bg-[#005C27] hover:text-white text-[#005C27] font-bold py-2.5 px-4 rounded-xl text-xs border border-[#005C27]/30 transition flex items-center justify-center gap-2 cursor-pointer">
                  <Download className="w-4 h-4" /> Download Impact PDF Report
                </button>
              </div>

              <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#051836]/10 space-y-4">
                <div className="flex items-center justify-between border-b border-[#051836]/10 pb-3">
                  <span className="text-xs font-mono text-[#005C27] font-bold">REPORT-2026-PWLIF-042</span>
                  <span className="bg-emerald-100 text-[#005C27] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#005C27]/20">Verified</span>
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-base text-[#051836]">Community Center STEM Lab Stipend</h4>
                  <p className="text-xs text-[#051836]/60 mt-1">Sponsor: {sponsorMatch?.company} • Amount: $7,500</p>
                </div>
                <button className="w-full bg-[#005C27]/10 hover:bg-[#005C27] hover:text-white text-[#005C27] font-bold py-2.5 px-4 rounded-xl text-xs border border-[#005C27]/30 transition flex items-center justify-center gap-2 cursor-pointer">
                  <Download className="w-4 h-4" /> Download Impact PDF Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: CHILD ALERTS */}
        {activeTab === "alerts" && (
          <div className="bg-white rounded-3xl border border-[#051836]/10 shadow-xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto text-[#051836]">
            <div>
              <h2 className="font-montserrat font-bold text-xl text-[#051836] flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#005C27]" />
                <span>Automated Child Dream Alert Settings</span>
              </h2>
              <p className="text-xs text-[#051836]/70 mt-1">
                Receive notifications when new verified child dream profiles match your sponsorship criteria.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAlertNotice(true);
                setTimeout(() => setAlertNotice(false), 3000);
              }}
              className="space-y-4 text-xs font-inter"
            >
              <div>
                <label className="block font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                  Target Dream Category Alert
                </label>
                <select
                  value={alertCategory}
                  onChange={(e) => setAlertCategory(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27]"
                >
                  <option value="Technology">Technology</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Academics">Academics</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Biotech">Biotech</option>
                  <option value="Creative Writing">Creative Writing</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                  Notification Frequency
                </label>
                <select
                  value={alertFrequency}
                  onChange={(e) => setAlertFrequency(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27]"
                >
                  <option value="Immediate Email Alert">Immediate Email Notification</option>
                  <option value="Weekly Digest">Weekly Foundation Digest</option>
                  <option value="Monthly Executive Summary">Monthly Executive Summary</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3 px-6 rounded-xl transition text-xs shadow-md cursor-pointer"
                >
                  Save Alert Rules
                </button>
                {alertNotice && <span className="text-xs text-emerald-600 font-bold">Alert preferences updated!</span>}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Secure Messaging Modal */}
      {messagingTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051836]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#051836]/10 space-y-6 text-[#051836]">
            <div className="flex items-center justify-between border-b border-[#051836]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/30 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5 text-[#005C27]" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                    Sponsorship Proposal for {messagingTalent.name}
                  </h3>
                  <p className="text-xs text-[#051836]/60">Category: {messagingTalent.category}</p>
                </div>
              </div>
              <button
                onClick={() => setMessagingTalent(null)}
                className="text-[#051836]/40 hover:text-[#051836] p-1 text-xs"
              >
                ✕
              </button>
            </div>

            {messageSentNotice ? (
              <div className="py-8 text-center space-y-3">
                <div className="p-3 rounded-full bg-emerald-100 text-[#005C27] border border-[#005C27]/30 inline-block">
                  <CheckCircle2 className="w-8 h-8 text-[#005C27]" />
                </div>
                <h4 className="font-montserrat font-bold text-lg text-[#051836]">Sponsorship Proposal Transmitted!</h4>
                <p className="text-xs text-[#051836]/70 max-w-xs mx-auto">
                  Your message has been logged for foundation officer review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4 text-xs font-inter">
                <div>
                  <label className="block font-bold text-[#051836]/80 mb-1">
                    Sponsorship Grant Proposal &amp; Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Describe your sponsorship grant proposal or support commitment for ${messagingTalent.name}...`}
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-xs text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#051836]/10 text-[11px] text-[#051836]/70 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#005C27] shrink-0" />
                  <span>100% verified parental consent protocol enforced.</span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMessagingTalent(null)}
                    className="px-4 py-2.5 rounded-xl border border-[#051836]/10 text-xs text-[#051836]/70 hover:bg-[#F8FAFC]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Transmit Proposal</span>
                    <Send className="w-3.5 h-3.5 text-white" />
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
