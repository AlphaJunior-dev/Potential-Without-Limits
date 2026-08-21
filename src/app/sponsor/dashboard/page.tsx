"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { TalentPhoto } from "@/components/TalentPhoto";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import {
  ArrowRight,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Compass,
  FileText,
  LockKeyhole,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type DashboardTab = "overview" | "talent" | "partnership" | "account" | "notifications";

type SponsorProfile = {
  name?: string;
  organization?: string;
  roleTitle?: string;
  email?: string;
  applicationRecorded: boolean;
  passwordSetupComplete?: boolean;
  orientationSubmission?: {
    websiteOrLinkedIn?: string;
    organizationDescription?: string;
    supportIntent?: string;
  } | null;
};

type SponsorTalent = {
  id: string;
  title: string;
  summary: string;
  supportArea?: string;
  photoUrl?: string;
  mediaUrls?: string[];
  displayOrder: number;
};

type ConversationEntry = {
  id: string;
  sender?: "sponsor" | "foundation";
  senderName?: string;
  message?: string;
  createdAt?: unknown;
};

type SponsorConversation = {
  id: string;
  subject: string;
  talentId?: string;
  status?: string;
  message?: string;
  thread?: ConversationEntry[];
};

type DashboardData = {
  sponsor: SponsorProfile;
  talent: SponsorTalent[];
  conversations?: SponsorConversation[];
};

const tabs: Array<{ id: DashboardTab; label: string; icon: React.ElementType }> = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "talent", label: "Sponsor Talent", icon: Sparkles },
  { id: "partnership", label: "Partnership Desk", icon: MessageCircle },
  { id: "account", label: "Account", icon: CircleUserRound },
  { id: "notifications", label: "Notifications", icon: Bell },
];

function profileLabel(profile: SponsorProfile) {
  return profile.organization || profile.name || "Sponsor partner";
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="border-b border-[#0B2E6B]/10 py-4 last:border-b-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0B2E6B]/50">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-[#0B2E6B]">{value}</p>
    </div>
  );
}

function conversationTime(value: unknown) {
  if (typeof value === "number") return new Date(value).toLocaleString();
  if (value && typeof value === "object" && "toMillis" in value && typeof (value as { toMillis?: unknown }).toMillis === "function") {
    return new Date((value as { toMillis: () => number }).toMillis()).toLocaleString();
  }
  return "Just now";
}

export default function SponsorDashboardPage() {
  const { user, userStatus, logout, sendInquiry, replyToFoundationConversation } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedCategory, setFeedCategory] = useState("All");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [replyBodies, setReplyBodies] = useState<Record<string, string>>({});
  const [replyStatus, setReplyStatus] = useState<Record<string, string>>({});
  const [replyingConversation, setReplyingConversation] = useState<string | null>(null);

  useEffect(() => {
    if (userStatus === "logged_out" || userStatus === "pending" || userStatus === "admin") {
      router.replace("/login");
    }
  }, [router, userStatus]);

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMessage("");
    if (!user?.email || !auth.currentUser) {
      setPasswordMessage("Your active sponsor session could not be verified. Please sign in again.");
      return;
    }
    if (nextPassword.length < 10) {
      setPasswordMessage("Choose a new password with at least 10 characters.");
      return;
    }
    if (nextPassword !== passwordConfirmation) {
      setPasswordMessage("Your new password confirmation does not match.");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      await reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(user.email, currentPassword));
      await updatePassword(auth.currentUser, nextPassword);
      setCurrentPassword("");
      setNextPassword("");
      setPasswordConfirmation("");
      setPasswordMessage("Your password has been updated.");
    } catch (passwordError) {
      setPasswordMessage(passwordError instanceof Error ? passwordError.message : "Your password could not be updated. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleFoundationMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessageStatus("");
    if (!messageSubject.trim() || !messageBody.trim()) {
      setMessageStatus("Please add both a subject and a message for the Foundation team.");
      return;
    }
    setIsSendingMessage(true);
    try {
      const created = await sendInquiry(messageSubject, messageBody) as { conversationId?: unknown } | null;
      const createdId = typeof created?.conversationId === "string" ? created.conversationId : "";
      if (createdId) {
        const message = messageBody.trim();
        const subject = messageSubject.trim();
        setDashboard((current) => current ? {
          ...current,
          conversations: [{
            id: createdId,
            subject,
            status: "new",
            thread: [{ id: "sent", sender: "sponsor", senderName: current.sponsor.name || "Approved sponsor", message, createdAt: Date.now() }],
          }, ...(current.conversations || [])],
        } : current);
      }
      setMessageSubject("");
      setMessageBody("");
      setMessageStatus("Your message has been sent to the Foundation team. You can continue the conversation below when they reply.");
    } catch (error) {
      setMessageStatus(error instanceof Error ? error.message : "Your message could not be sent. Please try again.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleConversationReply = async (event: React.FormEvent, conversationId: string) => {
    event.preventDefault();
    const message = (replyBodies[conversationId] || "").trim();
    if (!message) {
      setReplyStatus((current) => ({ ...current, [conversationId]: "Write a message before sending your reply." }));
      return;
    }
    setReplyingConversation(conversationId);
    setReplyStatus((current) => ({ ...current, [conversationId]: "" }));
    try {
      await replyToFoundationConversation(conversationId, message);
      setDashboard((current) => current ? {
        ...current,
        conversations: (current.conversations || []).map((conversation) => conversation.id === conversationId ? {
          ...conversation,
          status: "new",
          thread: [...(conversation.thread || []), { id: `reply-${Date.now()}`, sender: "sponsor", senderName: current.sponsor.name || "Approved sponsor", message, createdAt: Date.now() }],
        } : conversation),
      } : current);
      setReplyBodies((current) => ({ ...current, [conversationId]: "" }));
      setReplyStatus((current) => ({ ...current, [conversationId]: "Your reply has been sent to the Foundation team." }));
    } catch (error) {
      setReplyStatus((current) => ({ ...current, [conversationId]: error instanceof Error ? error.message : "Your reply could not be sent. Please try again." }));
    } finally {
      setReplyingConversation(null);
    }
  };

  useEffect(() => {
    if (!user || userStatus !== "approved") return;
    const authenticatedUser = user;
    let cancelled = false;

    async function loadDashboard() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const token = await authenticatedUser.getIdToken(true);
        const response = await fetch("/api/sponsor", {
          headers: { authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Your sponsor information could not be loaded right now.");
        const nextDashboard = await response.json() as DashboardData;
        if (!cancelled) setDashboard(nextDashboard);
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "Your sponsor information could not be loaded right now.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadDashboard();
    return () => { cancelled = true; };
  }, [user, userStatus]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set((dashboard?.talent || []).map((record) => record.supportArea).filter((value): value is string => Boolean(value))))],
    [dashboard?.talent],
  );
  const filteredTalent = useMemo(
    () => (dashboard?.talent || []).filter((record) => feedCategory === "All" || record.supportArea === feedCategory),
    [dashboard?.talent, feedCategory],
  );

  useEffect(() => {
    if (!categories.includes(feedCategory)) setFeedCategory("All");
  }, [categories, feedCategory]);

  if (userStatus === "logged_out" || userStatus === "pending" || userStatus === "admin") return null;

  const profile = dashboard?.sponsor;
  const displayName = profileLabel(profile || { applicationRecorded: false });

  return (
    <div className="min-h-screen bg-[#F5F6F0] pb-20 text-[#0B2E6B]">
      <header className="relative z-20 border-b border-white/10 bg-[#0B2E6B] text-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Potential Without Limits International Foundation" className="flex items-center gap-3">
            <img src="/pwlif-logo.png" alt="Potential Without Limits International Foundation" className="h-12 w-auto rounded-full bg-white object-contain p-1" />
            <span className="hidden border-l border-white/15 pl-3 text-xs font-bold uppercase tracking-[0.15em] text-white/75 sm:inline">Sponsor Portal</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70 md:inline-flex">Approved partner</span>
            <Link href="/" className="hidden text-xs font-bold text-white/75 transition hover:text-[#F7B500] sm:inline-flex">Foundation home</Link>
            <button type="button" onClick={() => logout()} className="rounded-xl border border-white/20 px-3 py-2 text-xs font-bold text-white transition hover:border-[#F7B500] hover:text-[#F7B500] sm:px-4">Sign out</button>
          </div>
        </div>
      </header>
      <section className="relative overflow-hidden bg-[#0B2E6B] text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 84% 18%, #F7B500 0, transparent 21%), radial-gradient(circle at 7% 88%, #14B84A 0, transparent 28%)" }} />
        <div className="absolute -right-24 top-[-110px] h-80 w-80 rounded-full border border-white/15" />
        <div className="absolute -right-8 top-[-42px] h-56 w-56 rounded-full border border-white/10" />
        <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
                <ShieldCheck className="h-3.5 w-3.5 text-[#F7B500]" />
                Private partnership portal
              </div>
              <h1 className="font-montserrat text-3xl font-black tracking-[-0.04em] sm:text-5xl">Partnership, with purpose.</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                A focused space for approved partners to review the foundation’s private Sponsor Talent pipeline and coordinate appropriate next steps.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F7B500]"><CheckCircle2 className="h-4 w-4" /> Sponsor access active</div>
              <p className="mt-3 text-sm font-semibold text-white">{isLoading ? "Loading your profile…" : displayName}</p>
              {profile?.email && <p className="mt-1 truncate text-xs text-white/65">{profile.email}</p>}
              <Link href="/" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-white transition hover:text-[#F7B500]">
                Foundation homepage <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 pt-7 sm:px-8 sm:pt-8">
        <div className="rounded-2xl border border-[#0B2E6B]/10 bg-white p-2 shadow-[0_18px_45px_rgba(5,24,54,0.12)]">
          <nav aria-label="Sponsor portal sections" className="flex gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition sm:px-4 ${active ? "bg-[#079432] text-white shadow-sm" : "text-[#0B2E6B]/65 hover:bg-[#F5F6F0] hover:text-[#0B2E6B]"}`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {isLoading && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="h-80 animate-pulse rounded-3xl bg-white" />
            <div className="h-80 animate-pulse rounded-3xl bg-white" />
          </div>
        )}

        {!isLoading && loadError && (
          <section className="mt-10 rounded-3xl border border-amber-400/40 bg-amber-50 p-7 shadow-sm">
            <p className="font-montserrat text-lg font-bold text-[#0B2E6B]">Your portal information is temporarily unavailable</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#0B2E6B]/70">{loadError} You can use the Partnership Desk to coordinate with the foundation.</p>
            <button type="button" onClick={() => setActiveTab("partnership")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0B2E6B] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#082657]">
              Open Partnership Desk <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </section>
        )}

        {!isLoading && !loadError && activeTab === "overview" && (
          <section className="mt-10 space-y-6">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)] sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Your partnership profile</p>
                    <h2 className="mt-2 font-montserrat text-2xl font-black tracking-[-0.03em]">{displayName}</h2>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#079432]/10 text-[#079432]"><Building2 className="h-5 w-5" /></div>
                </div>
                <div className="mt-6">
                  <DetailRow label="Representative" value={profile?.name} />
                  <DetailRow label="Organization" value={profile?.organization} />
                  <DetailRow label="Role" value={profile?.roleTitle} />
                  <DetailRow label="Verified email" value={profile?.email} />
                </div>
                {!profile?.applicationRecorded && <p className="mt-5 rounded-xl bg-[#F5F6F0] p-3 text-xs leading-5 text-[#0B2E6B]/70">Your access is active. The foundation can confirm any remaining profile details through the Partnership Desk.</p>}
              </article>

              <article className="relative overflow-hidden rounded-3xl bg-[#079432] p-7 text-white shadow-[0_18px_40px_rgba(0,92,39,0.22)] sm:p-8">
                <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full border border-white/15" />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80"><Sparkles className="h-3.5 w-3.5 text-[#F7B500]" /> Approved sponsor access</div>
                    <h2 className="mt-5 max-w-md font-montserrat text-3xl font-black leading-tight tracking-[-0.04em]">Review the full Sponsor Talent pipeline.</h2>
                    <p className="mt-4 max-w-md text-sm leading-6 text-white/75">Your approved account provides private access to the complete Sponsor Talent records maintained by the foundation. Public-page visibility is managed separately.</p>
                  </div>
                  <button type="button" onClick={() => setActiveTab("talent")} className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#079432] transition hover:bg-[#F7B500] hover:text-[#0B2E6B]">
                    Browse Sponsor Talent <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            </div>

            {profile?.applicationRecorded && (
              <article className="rounded-3xl border border-[#0B2E6B]/10 bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.06)] sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Your orientation submission</p>
                    <h2 className="mt-2 font-montserrat text-xl font-black tracking-[-0.03em]">The details you shared with PWLIF</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#0B2E6B]/65">This private overview is visible only to your approved sponsor account and mirrors the information submitted before your orientation call.</p>
                  </div>
                  <FileText className="h-6 w-6 shrink-0 text-[#079432]" />
                </div>
                <div className="mt-5 grid gap-x-8 md:grid-cols-2">
                  <DetailRow label="Website or LinkedIn" value={profile.orientationSubmission?.websiteOrLinkedIn} />
                  <DetailRow label="About your organization" value={profile.orientationSubmission?.organizationDescription} />
                  <DetailRow label="How you hope to support" value={profile.orientationSubmission?.supportIntent} />
                </div>
              </article>
            )}

            <article className="rounded-3xl border border-[#0B2E6B]/10 bg-white p-6 shadow-[0_12px_32px_rgba(5,24,54,0.06)] sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">A considered process</p>
                  <h2 className="mt-2 font-montserrat text-xl font-black tracking-[-0.03em]">Designed for private, responsible coordination.</h2>
                </div>
                <button type="button" onClick={() => setActiveTab("partnership")} className="inline-flex items-center gap-2 text-xs font-bold text-[#079432] hover:text-[#14B84A]">Open Partnership Desk <ChevronRight className="h-4 w-4" /></button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ["01", "Verified access", "Sponsor accounts are reviewed and approved before portal access is issued."],
                  ["02", "Private Talent directory", "Approved sponsors can review the complete Sponsor Talent pipeline; public pages have separate visibility controls."],
                  ["03", "Guided next steps", "The partnership team coordinates follow-up through appropriate private channels."],
                ].map(([number, title, description]) => (
                  <div key={number} className="rounded-2xl bg-[#F5F6F0] p-5">
                    <span className="font-montserrat text-xs font-black text-[#F7B500]">{number}</span>
                    <h3 className="mt-3 font-montserrat text-sm font-black">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#0B2E6B]/65">{description}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {!isLoading && !loadError && activeTab === "talent" && (
          <section className="mt-10">
            <div className="rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)] sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Approved sponsor access</p>
                  <h2 className="mt-2 font-montserrat text-3xl font-black tracking-[-0.04em]">Private Sponsor Talent directory</h2>
                  <p className="mt-3 text-sm leading-6 text-[#0B2E6B]/65">Your approved sponsor account provides access to every safe Sponsor Talent record in the foundation’s private pipeline. Anonymous public pages receive a separate, field-limited view.</p>
                </div>
                {categories.length > 1 && (
                  <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                    {categories.map((category) => (
                      <button key={category} type="button" onClick={() => setFeedCategory(category)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition ${feedCategory === category ? "bg-[#0B2E6B] text-white" : "border border-[#0B2E6B]/10 bg-[#F5F6F0] text-[#0B2E6B]/70 hover:border-[#079432]/50"}`}>
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {filteredTalent.length === 0 ? (
                <div className="mt-8 grid min-h-72 place-items-center rounded-2xl border border-dashed border-[#0B2E6B]/20 bg-[#F5F6F0] p-8 text-center">
                  <div className="max-w-md">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#079432] shadow-sm"><Sparkles className="h-5 w-5" /></div>
                    <h3 className="mt-5 font-montserrat text-xl font-black">No Sponsor Talent records are available yet.</h3>
                    <p className="mt-3 text-sm leading-6 text-[#0B2E6B]/65">No Sponsor Talent records are currently available in the private pipeline. You can use the Partnership Desk for a conversation with the foundation.</p>
                    <button type="button" onClick={() => setActiveTab("partnership")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#079432] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#14B84A]">Open Partnership Desk <ArrowRight className="h-4 w-4" /></button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredTalent.map((record) => (
                    <article key={record.id} className="group overflow-hidden rounded-3xl border border-[#0B2E6B]/10 bg-[#FCFCFA] shadow-[0_10px_25px_rgba(5,24,54,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(5,24,54,0.13)]">
                      {record.photoUrl ? (
                        <TalentPhoto src={record.photoUrl} alt="" className="h-44 w-full object-cover" />
                      ) : (
                        <div className="relative flex h-44 items-end overflow-hidden bg-[#0B2E6B] p-5">
                          <div className="absolute right-[-20px] top-[-45px] h-40 w-40 rounded-full border border-white/10" />
                          <span className="relative rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/80">Sponsor Talent</span>
                        </div>
                      )}
                      <div className="p-6">
                        {record.supportArea && <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#079432]">{record.supportArea}</p>}
                        <h3 className="mt-2 font-montserrat text-lg font-black leading-snug">{record.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-[#0B2E6B]/65">{record.summary}</p>
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#0B2E6B]/10 pt-4">
                          {record.mediaUrls?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {record.mediaUrls.map((mediaUrl, index) => (
                                <a key={mediaUrl} href={mediaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F6F0] px-2.5 py-2 text-[11px] font-bold text-[#079432] transition hover:bg-[#079432] hover:text-white"><FileText className="h-3.5 w-3.5" /> Media {index + 1}</a>
                              ))}
                            </div>
                          ) : <span className="text-[11px] font-semibold text-[#0B2E6B]/45">No shared media</span>}
                          <Link href={`/sponsor/talent/${record.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#079432] hover:text-[#14B84A]">View full record <ArrowRight className="h-3.5 w-3.5" /></Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {!isLoading && !loadError && activeTab === "partnership" && (
          <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Partnership Desk</p>
              <h2 className="mt-2 max-w-xl font-montserrat text-3xl font-black tracking-[-0.04em]">Coordinate the next conversation with care.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#0B2E6B]/65">Individual sponsorship assignments and sensitive partnership information are not displayed in this portal. Start a focused conversation, then continue privately with the Foundation team after they reply.</p>
              <form onSubmit={handleFoundationMessage} className="mt-7 max-w-xl space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#0B2E6B]/55" htmlFor="partnership-message-subject">Message subject</label>
                <input id="partnership-message-subject" value={messageSubject} maxLength={200} onChange={(event) => setMessageSubject(event.target.value)} placeholder="How can the Foundation help?" className="w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0B2E6B] outline-none focus:border-[#079432]" />
                <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#0B2E6B]/55" htmlFor="partnership-message-body">Your message</label>
                <textarea id="partnership-message-body" value={messageBody} maxLength={2000} rows={5} onChange={(event) => setMessageBody(event.target.value)} placeholder="Share the context for your question or partnership conversation." className="w-full resize-y rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#0B2E6B] outline-none focus:border-[#079432]" />
                <button type="submit" disabled={isSendingMessage} className="inline-flex items-center gap-2 rounded-xl bg-[#079432] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#14B84A] disabled:cursor-not-allowed disabled:opacity-60">{isSendingMessage ? "Sending message…" : "Send to Foundation"} <ArrowRight className="h-4 w-4" /></button>
                {messageStatus && <p role="status" className="text-xs leading-5 text-[#0B2E6B]/70">{messageStatus}</p>}
              </form>
            </article>
            <aside className="max-h-[620px] overflow-y-auto rounded-3xl border border-[#0B2E6B]/10 bg-[#FCFCFA] p-7 shadow-[0_12px_32px_rgba(5,24,54,0.06)] sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F7B500]/20 text-[#0B2E6B]"><MessageCircle className="h-5 w-5" /></div>
                <span className="rounded-full bg-[#079432]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#079432]">Private conversation</span>
              </div>
              <h3 className="mt-5 font-montserrat text-xl font-black">Your conversations</h3>
              {!dashboard?.conversations?.length ? (
                <p className="mt-4 text-sm leading-6 text-[#0B2E6B]/65">No Foundation conversations yet. Send a focused message to begin one.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {dashboard.conversations.map((conversation) => {
                    const entries = conversation.thread?.length ? conversation.thread : conversation.message ? [{ id: "first-message", sender: "sponsor" as const, message: conversation.message }] : [];
                    return <article key={conversation.id} className="rounded-2xl border border-[#0B2E6B]/10 bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-bold text-[#0B2E6B]">{conversation.subject}</h4><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${conversation.status === "replied" ? "bg-[#079432]/10 text-[#079432]" : "bg-[#F7B500]/15 text-[#0B2E6B]"}`}>{conversation.status === "replied" ? "Foundation replied" : "Awaiting Foundation"}</span></div>
                      <div className="mt-4 space-y-3">
                        {entries.map((entry) => <div key={entry.id} className={`rounded-xl px-3 py-2.5 text-xs leading-5 ${entry.sender === "foundation" ? "bg-[#0B2E6B] text-white" : "bg-[#F5F6F0] text-[#0B2E6B]"}`}><p className={`text-[9px] font-bold uppercase tracking-[0.12em] ${entry.sender === "foundation" ? "text-white/65" : "text-[#079432]"}`}>{entry.sender === "foundation" ? "PWLIF Foundation Team" : "You"}</p><p className="mt-1 whitespace-pre-wrap">{entry.message}</p><p className={`mt-1 text-[9px] ${entry.sender === "foundation" ? "text-white/50" : "text-[#0B2E6B]/45"}`}>{conversationTime(entry.createdAt)}</p></div>)}
                      </div>
                      <form onSubmit={(event) => handleConversationReply(event, conversation.id)} className="mt-4 space-y-2"><label className="sr-only" htmlFor={`conversation-reply-${conversation.id}`}>Reply to Foundation</label><textarea id={`conversation-reply-${conversation.id}`} value={replyBodies[conversation.id] || ""} maxLength={2000} rows={3} onChange={(event) => setReplyBodies((current) => ({ ...current, [conversation.id]: event.target.value }))} placeholder="Continue this private conversation…" className="w-full resize-y rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] px-3 py-2.5 text-xs leading-5 text-[#0B2E6B] outline-none focus:border-[#079432]" /><button type="submit" disabled={replyingConversation === conversation.id} className="rounded-lg border border-[#079432]/30 px-3 py-2 text-[10px] font-bold text-[#079432] transition hover:bg-[#079432] hover:text-white disabled:opacity-50">{replyingConversation === conversation.id ? "Sending…" : "Send reply"}</button>{replyStatus[conversation.id] && <p role="status" className="text-[11px] leading-5 text-[#0B2E6B]/65">{replyStatus[conversation.id]}</p>}</form>
                    </article>;
                  })}
                </div>
              )}
            </aside>
          </section>
        )}

        {!isLoading && !loadError && activeTab === "account" && (
          <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-3xl bg-[#0B2E6B] p-7 text-white shadow-[0_16px_38px_rgba(5,24,54,0.18)] sm:p-8">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#F7B500]"><LockKeyhole className="h-5 w-5" /></div>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">Account security</p>
              <h2 className="mt-2 font-montserrat text-2xl font-black tracking-[-0.04em]">Your access is protected by your password.</h2>
              <p className="mt-4 text-sm leading-6 text-white/70">You create your password once through the private invitation link. You can update it here whenever you need to.</p>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85"><CheckCircle2 className="h-3.5 w-3.5 text-[#F7B500]" /> Access active</div>
            </article>
            <article className="rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Change password</p>
              <h2 className="mt-2 font-montserrat text-2xl font-black tracking-[-0.04em]">Update your sign-in details</h2>
              <form onSubmit={handlePasswordChange} className="mt-5 space-y-3"><input aria-label="Current password" type="password" required autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Current password" className="w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0B2E6B] outline-none focus:border-[#079432]" /><input aria-label="New password" type="password" required minLength={10} autoComplete="new-password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} placeholder="New password — at least 10 characters" className="w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0B2E6B] outline-none focus:border-[#079432]" /><input aria-label="Confirm new password" type="password" required minLength={10} autoComplete="new-password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Confirm new password" className="w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] px-4 py-3 text-sm text-[#0B2E6B] outline-none focus:border-[#079432]" /><button type="submit" disabled={isUpdatingPassword} className="rounded-xl bg-[#079432] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#14B84A] disabled:opacity-50">{isUpdatingPassword ? "Updating password…" : "Update password"}</button></form>{passwordMessage && <p className="mt-4 text-xs leading-5 text-[#0B2E6B]/70">{passwordMessage}</p>}<div className="mt-6 border-t border-[#0B2E6B]/10 pt-5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Approved profile</p><div className="mt-3"><DetailRow label="Representative" value={profile?.name} /><DetailRow label="Organization" value={profile?.organization} /><DetailRow label="Role" value={profile?.roleTitle} /><DetailRow label="Email" value={profile?.email} /></div><div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#F5F6F0] p-4 text-xs leading-5 text-[#0B2E6B]/70"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#079432]" /><span>To request a change to approved sponsor details, please use the Partnership Desk to arrange a conversation with the foundation.</span></div></div>
            </article>
          </section>
        )}

        {!isLoading && !loadError && activeTab === "notifications" && (
          <section className="mt-10 rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)] sm:p-8">
            <div className="mx-auto max-w-2xl py-6 text-center sm:py-12">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#079432]/10 text-[#079432]"><Bell className="h-6 w-6" /></div>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Notifications</p>
              <h2 className="mt-2 font-montserrat text-3xl font-black tracking-[-0.04em]">A calm space for foundation updates.</h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#0B2E6B]/65">There are no updates to display. When PWLIF enables a reviewed sponsor communications workflow, foundation-issued updates will appear here. This portal does not create automated alerts or promotional messages.</p>
              <button type="button" onClick={() => setActiveTab("partnership")} className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#079432]/25 bg-[#079432]/5 px-4 py-3 text-xs font-bold text-[#079432] transition hover:bg-[#079432] hover:text-white">Contact the Partnership Desk <ArrowRight className="h-4 w-4" /></button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
