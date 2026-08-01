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
    "overview" | "exhibition" | "partnerships" | "messages" | "security" | "certificates" | "alerts"
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

  const availableCategories = ["All", "Technology", "Robotics", "Digital Art", "Music", "Biotech", "Creative Writing"];

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
    <div className="min-h-screen bg-[#050814] font-inter text-white pb-16 bg-gallery-pattern relative">
      {/* 1. MANDATORY FIRST-TIME LOGIN PROFILE SETUP MODAL */}
      {showFirstTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050814]/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#121A36] rounded-3xl max-w-xl w-full p-8 border border-[#F28482]/40 shadow-2xl space-y-6">
            <div className="text-center space-y-2 border-b border-white/10 pb-4">
              <div className="inline-flex p-3 rounded-2xl bg-[#F28482]/10 text-[#F28482] border border-[#F28482]/30 mb-1">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="font-montserrat text-2xl font-black text-white">
                Complete Corporate VIP Profile
              </h2>
              <p className="text-xs text-white/70">
                Welcome to WLP! Before accessing raw youth portfolios and executing sponsorship grants, please verify your corporate representative credentials.
              </p>
            </div>

            <form onSubmit={handleFirstTimeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-white/80 uppercase tracking-wider mb-1">
                  Organization / Corporate Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={modalCompany}
                  onChange={(e) => setModalCompany(e.target.value)}
                  placeholder="e.g. Acme Impact Ventures"
                  className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-white/80 uppercase tracking-wider mb-1">
                    Industry Sector *
                  </label>
                  <select
                    value={modalIndustry}
                    onChange={(e) => setModalIndustry(e.target.value)}
                    className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482]"
                  >
                    <option value="Technology & VC">Technology &amp; VC</option>
                    <option value="Arts & Media Production">Arts &amp; Media Production</option>
                    <option value="Robotics & Hardware Engineering">Robotics &amp; Engineering</option>
                    <option value="Biotech & Life Sciences">Biotech &amp; Life Sciences</option>
                    <option value="Corporate Foundation / CSR">Corporate Foundation / CSR</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-white/80 uppercase tracking-wider mb-1">
                    Direct Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-white/80 uppercase tracking-wider mb-1">
                  Primary Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={modalContactName}
                  onChange={(e) => setModalContactName(e.target.value)}
                  placeholder="e.g. Eleanor Vance, Managing Director"
                  className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#050814] border border-white/10 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={modalAgreed}
                    onChange={(e) => setModalAgreed(e.target.checked)}
                    className="mt-0.5 accent-[#F28482]"
                  />
                  <span className="text-[11px] text-white/80 leading-relaxed">
                    I agree to the <strong>WLP Youth Safety Code of Ethics</strong>. I certify that all contact with youth creators will be monitored by WLP vetting officers and used solely for educational funding.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!modalAgreed}
                  className="w-full bg-[#F28482] disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-xl hover:brightness-105 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span>Save Profile &amp; Unlock VIP Portal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#042554] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-montserrat text-2xl sm:text-3xl font-black">
                Sponsor VIP Command Hub
              </h1>
              {userStatus === "approved" || sponsorMatch?.status === "approved" ? (
                <span className="bg-[#005C27] border border-emerald-400 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Sponsor
                </span>
              ) : (
                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Vetting Pending
                </span>
              )}

              {/* Membership Tier & Category Badge */}
              <span className="bg-[#F5AB00] text-[#051836] font-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#051836]" /> {sponsorMatch?.membershipTier || "Gold Tier"} Member
              </span>
              <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                Category: {sponsorMatch?.sponsorCategory || "Child Sponsor"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/80">
              Welcome back, <strong>{sponsorMatch?.name || "Verified Sponsor"}</strong> ({sponsorMatch?.company || "PWLIF Impact Partner"}). Child dream sponsorship channels &amp; financial audit downloads active.
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
        {/* 7 Sidebar / Top Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-[#F28482] text-[#F28482]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("exhibition")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "exhibition"
                ? "border-[#F28482] text-[#F28482]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Unlocked Exhibition</span>
          </button>

          <button
            onClick={() => setActiveTab("partnerships")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "partnerships"
                ? "border-[#F28482] text-[#F28482]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>My Partnerships</span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "messages"
                ? "border-[#F28482] text-[#F28482]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Message History</span>
            <span className="bg-[#F28482]/20 text-[#F28482] text-[10px] px-2 py-0.5 rounded-full font-extrabold">
              {sponsorInquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "security"
                ? "border-[#F28482] text-[#F28482]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security &amp; Password</span>
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "certificates"
                ? "border-[#F28482] text-[#F28482]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Impact Certificates</span>
          </button>

          <button
            onClick={() => setActiveTab("alerts")}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 border-b-2 flex items-center gap-2 ${
              activeTab === "alerts"
                ? "border-[#F28482] text-[#F28482]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Talent Alerts</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Info Box */}
            <div className="bg-[#121A36] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="font-montserrat font-bold text-lg text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#F28482]" />
                  <span>Verified Organization</span>
                </h2>
                <button
                  onClick={() => setActiveTab("security")}
                  className="text-xs font-semibold text-[#F28482] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-white/50 font-semibold uppercase tracking-wider block mb-1">
                    Organization Name
                  </span>
                  <p className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-white/40" />
                    {sponsorMatch?.company || "WLP Impact Partner"}
                  </p>
                </div>

                <div>
                  <span className="text-white/50 font-semibold uppercase tracking-wider block mb-1">
                    Corporate Contact Person
                  </span>
                  <p className="font-bold text-white text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-white/40" />
                    {sponsorMatch?.name || "Corporate Backer"}
                  </p>
                </div>

                <div>
                  <span className="text-white/50 font-semibold uppercase tracking-wider block mb-1">
                    Verified Work Email
                  </span>
                  <p className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-white/40" />
                    {sponsorMatch?.email || "sponsor@wlp.org"}
                  </p>
                </div>

                <div>
                  <span className="text-white/50 font-semibold uppercase tracking-wider block mb-1">
                    Focus Track Interests
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(sponsorMatch?.interests || ["Technology", "Robotics"]).map((int: string) => (
                      <span
                        key={int}
                        className="bg-[#050814] text-white font-semibold px-2.5 py-1 rounded-md border border-white/10 text-[11px]"
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
              <div className="bg-[#121A36] p-6 rounded-3xl border border-white/10 shadow-2xl">
                <h2 className="font-montserrat font-bold text-lg text-white flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#F28482]" />
                  <span>Sponsorship Impact Overview</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 rounded-2xl bg-[#050814] border border-white/10">
                    <span className="text-3xl font-black text-[#F28482] font-montserrat">
                      $15,000
                    </span>
                    <p className="text-xs text-white/60 font-semibold mt-1">
                      Capital Deployed (Grants)
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#050814] border border-white/10">
                    <span className="text-3xl font-black text-emerald-400 font-montserrat">
                      2 Talents
                    </span>
                    <p className="text-xs text-white/60 font-semibold mt-1">
                      Actively Sponsored
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#050814] border border-white/10">
                    <span className="text-3xl font-black text-[#F28482] font-montserrat">
                      100%
                    </span>
                    <p className="text-xs text-white/60 font-semibold mt-1">
                      Raw Media Reel Access
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("exhibition")}
                    className="bg-[#F28482] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-md"
                  >
                    <span>Browse Unlocked Exhibition</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab("certificates")}
                    className="bg-[#050814] text-white border border-white/15 px-5 py-2.5 rounded-xl font-bold text-xs hover:border-[#F28482] transition flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-[#F28482]" />
                    <span>Download Impact Certificates</span>
                  </button>
                </div>
              </div>

              {/* Security Status Box */}
              <div className="bg-[#121A36] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-3">
                <h3 className="font-montserrat font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verification &amp; Governance Status</span>
                </h3>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Admissions Vetting Passed
                  </p>
                  <p className="text-emerald-300/80 leading-relaxed">
                    Your corporate account has passed admissions clearance. All talent interactions remain encrypted and monitored by WLP Compliance Officers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UNLOCKED EXHIBITION (RAW MEDIA REELS) */}
        {activeTab === "exhibition" && (
          <div className="space-y-6">
            <div className="bg-[#121A36] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-montserrat font-bold text-xl text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F28482]" />
                  <span>Unlocked Youth Exhibition (Raw Media Access)</span>
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  As an authenticated corporate sponsor, you have full access to stream raw video reels and download verified asset bundles.
                </p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                <Filter className="w-4 h-4 text-white/40 shrink-0" />
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFeedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                      feedCategory === cat
                        ? "bg-[#F28482] text-white font-bold"
                        : "bg-[#050814] text-white/70 border border-white/10 hover:border-[#F28482]/40"
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
                  className="bg-[#121A36] rounded-3xl overflow-hidden border border-white/10 shadow-xl hover:border-[#F28482]/40 transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-[#050814] border border-white/10">
                      <Image
                        src={profile.coverPhoto}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050814]/90 via-transparent to-transparent" />
                      <span className="absolute top-2 left-2 bg-[#050814]/90 text-[#F28482] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#F28482]/30">
                        {profile.category}
                      </span>
                      <span className="absolute bottom-2 right-2 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-400" /> Raw Reel Unlocked
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-montserrat font-bold text-lg text-white">
                        {profile.name}, {profile.age}
                      </h3>
                      <span className="text-xs font-semibold text-white/50">
                        {profile.location}
                      </span>
                    </div>

                    <p className="text-xs text-white/70 line-clamp-3 mb-4 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <Link
                      href={`/portfolio/${profile.id}`}
                      className="w-full bg-[#050814] hover:bg-[#F28482] hover:text-white text-white font-bold py-2.5 px-3 rounded-xl text-xs transition text-center block border border-white/15"
                    >
                      Inspect Full Portfolio &amp; Raw Assets
                    </Link>
                    <button
                      onClick={() => setMessagingTalent(profile)}
                      className="w-full bg-[#F28482]/10 hover:bg-[#F28482] hover:text-white text-[#F28482] font-extrabold py-2.5 px-3 rounded-xl text-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer border border-[#F28482]/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Initiate Sponsorship Inquiry</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MY PARTNERSHIPS */}
        {activeTab === "partnerships" && (
          <div className="bg-[#121A36] rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-montserrat font-bold text-xl text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#F28482]" />
                <span>My Active Funded Partnerships</span>
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Active youth creators supported by your corporate organization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeProfiles.slice(0, 2).map((p) => (
                <div key={p.id} className="bg-[#050814] p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 border border-[#F28482]">
                      <Image src={p.coverPhoto} alt={p.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-montserrat font-bold text-base text-white">{p.name}</h4>
                      <p className="text-xs text-[#F28482] font-semibold">{p.category} • {p.location}</p>
                      <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Equipment Grant Active ($7,500)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setMessagingTalent(p)}
                      className="text-[#F28482] font-bold hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message Mentor Channel
                    </button>
                    <Link href={`/portfolio/${p.id}`} className="text-white/60 hover:text-white flex items-center gap-1">
                      Inspect Reel <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MESSAGE HISTORY */}
        {activeTab === "messages" && (
          <div className="bg-[#121A36] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="font-montserrat font-bold text-xl text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#F28482]" />
                <span>Message &amp; Inquiry History</span>
              </h2>
              <p className="text-xs text-white/70 mt-0.5">
                Log of all direct sponsorship proposals routed through WLP monitored channels.
              </p>
            </div>

            {sponsorInquiries.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <p className="text-xs text-white/60">
                  You haven&apos;t initiated any talent inquiries yet.
                </p>
                <button
                  onClick={() => setActiveTab("exhibition")}
                  className="text-xs font-bold text-[#F28482] hover:underline"
                >
                  Browse Unlocked Exhibition Grid →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {sponsorInquiries.map((inq) => (
                  <div key={inq.id} className="p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-montserrat font-bold text-base text-white">
                          Talent: {inq.talentName}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                          {inq.status}
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-[#050814] border border-white/10 text-xs text-white/80 font-medium">
                        &quot;{inq.message}&quot;
                      </div>
                      <span className="text-[10px] text-white/40 block font-mono">
                        Initiated on {inq.createdAt}
                      </span>
                    </div>

                    <Link
                      href={`/portfolio/${inq.talentId}`}
                      className="self-start md:self-center bg-[#050814] text-white border border-white/15 px-4 py-2.5 rounded-xl text-xs font-semibold hover:border-[#F28482] transition flex items-center gap-1.5 shrink-0"
                    >
                      <span>Inspect Portfolio</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#F28482]" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SECURITY & SETTINGS */}
        {activeTab === "security" && (
          <div className="bg-[#121A36] rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-8 max-w-3xl mx-auto">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-montserrat font-bold text-xl text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#F28482]" />
                <span>Security &amp; Password Settings</span>
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Manage your credentials, Multi-Factor Authentication (MFA), and corporate profile.
              </p>
            </div>

            {/* Profile Update Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <h3 className="font-montserrat font-bold text-sm text-white">Update Representative Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-white/80 uppercase tracking-wider mb-1">
                    Representative Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-white/80 uppercase tracking-wider mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-white/80 uppercase tracking-wider mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  required
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#050814] text-white border border-white/15 font-bold py-2.5 px-5 rounded-xl transition text-xs hover:border-[#F28482]"
                >
                  Save Profile Details
                </button>
                {savedNotice && <span className="ml-3 text-xs text-emerald-400 font-semibold">Saved!</span>}
              </div>
            </form>

            {/* Change Password Form */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="font-montserrat font-bold text-sm text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#F28482]" /> Change Corporate Password
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
                className="flex flex-col sm:flex-row items-end gap-4 text-xs"
              >
                <div className="flex-1 w-full">
                  <label className="block font-semibold text-white/80 mb-1">New Sponsor Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password..."
                    className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#F28482] text-white font-extrabold py-3 px-6 rounded-xl hover:brightness-110 transition text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </form>

              {passwordNotice && (
                <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> New password saved. Temporary password has been invalidated immediately.
                </p>
              )}
            </div>

            {/* MFA Security Toggle */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-montserrat font-bold text-sm text-white">Multi-Factor Authentication (MFA)</h4>
                <p className="text-xs text-white/60">Enforce OTP verification upon login.</p>
              </div>

              <button
                type="button"
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  mfaEnabled ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 text-white/60"
                }`}
              >
                {mfaEnabled ? "MFA Active ✓" : "Enable MFA"}
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: IMPACT CERTIFICATES */}
        {activeTab === "certificates" && (
          <div className="bg-[#121A36] rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-montserrat font-bold text-xl text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F28482]" />
                <span>Corporate Impact &amp; ESG Certificates</span>
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Official verified certificates for tax-deductible contributions and corporate ESG reporting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#050814] p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-[#F28482] font-bold">CERT-2026-WLP-091</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Verified</span>
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-base text-white">Hardware Grant: AI Screen Reader</h4>
                  <p className="text-xs text-white/60 mt-1">Sponsor: {sponsorMatch?.company} • Amount: $7,500</p>
                </div>
                <button className="w-full bg-[#F28482]/10 hover:bg-[#F28482] hover:text-white text-[#F28482] font-bold py-2 px-4 rounded-xl text-xs border border-[#F28482]/30 transition flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Digital PDF Certificate
                </button>
              </div>

              <div className="bg-[#050814] p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-[#F28482] font-bold">CERT-2026-WLP-042</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Verified</span>
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-base text-white">Robotics Lab Equipment Stipend</h4>
                  <p className="text-xs text-white/60 mt-1">Sponsor: {sponsorMatch?.company} • Amount: $7,500</p>
                </div>
                <button className="w-full bg-[#F28482]/10 hover:bg-[#F28482] hover:text-white text-[#F28482] font-bold py-2 px-4 rounded-xl text-xs border border-[#F28482]/30 transition flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Digital PDF Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: TALENT ALERTS */}
        {activeTab === "alerts" && (
          <div className="bg-[#121A36] rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
            <div>
              <h2 className="font-montserrat font-bold text-xl text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#F28482]" />
                <span>Automated Talent Alert Settings</span>
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Receive instant notifications when new verified youth profiles match your corporate criteria.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAlertNotice(true);
                setTimeout(() => setAlertNotice(false), 3000);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-white/80 uppercase tracking-wider mb-1">
                  Target Category Alert
                </label>
                <select
                  value={alertCategory}
                  onChange={(e) => setAlertCategory(e.target.value)}
                  className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482]"
                >
                  <option value="AI & Technology">AI &amp; Technology</option>
                  <option value="Robotics & Engineering">Robotics &amp; Engineering</option>
                  <option value="Digital Art & 3D Design">Digital Art &amp; 3D Design</option>
                  <option value="Music & Sound Design">Music &amp; Sound Design</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-white/80 uppercase tracking-wider mb-1">
                  Notification Frequency
                </label>
                <select
                  value={alertFrequency}
                  onChange={(e) => setAlertFrequency(e.target.value)}
                  className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482]"
                >
                  <option value="Immediate Email Alert">Immediate Email Alert</option>
                  <option value="Weekly Digest">Weekly Digest</option>
                  <option value="Monthly Executive Summary">Monthly Executive Summary</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-[#F28482] text-white font-extrabold py-3 px-6 rounded-xl hover:brightness-110 transition text-xs shadow-md"
                >
                  Save Alert Rules
                </button>
                {alertNotice && <span className="text-xs text-emerald-400 font-bold">Alert preferences updated!</span>}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Secure Messaging Modal */}
      {messagingTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050814]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121A36] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F28482]/10 text-[#F28482] border border-[#F28482]/30 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg text-white">
                    Sponsor Proposal for {messagingTalent.name}
                  </h3>
                  <p className="text-xs text-white/60">Category: {messagingTalent.category}</p>
                </div>
              </div>
              <button
                onClick={() => setMessagingTalent(null)}
                className="text-white/40 hover:text-white p-1 text-xs"
              >
                ✕
              </button>
            </div>

            {messageSentNotice ? (
              <div className="py-8 text-center space-y-3">
                <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-montserrat font-bold text-lg text-white">Sponsorship Proposal Dispatched!</h4>
                <p className="text-xs text-white/70 max-w-xs mx-auto">
                  Your message has been logged in the Command Center unified inbox for admissions review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4 text-xs font-inter">
                <div>
                  <label className="block font-semibold text-white/80 mb-1">
                    Sponsorship Proposal &amp; Equipment Grant Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Describe your equipment grant proposal, internship offer, or mentorship opportunity for ${messagingTalent.name}...`}
                    className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#F28482]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#050814] border border-white/10 text-[11px] text-white/70 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Monitored &amp; encrypted channel enforcing WLP Youth Privacy Shield.</span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMessagingTalent(null)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-white/70 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#F28482] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Transmit Proposal</span>
                    <Send className="w-3.5 h-3.5" />
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
