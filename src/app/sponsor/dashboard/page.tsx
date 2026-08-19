"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
};

type SponsorTalent = {
  id: string;
  title: string;
  summary: string;
  supportArea?: string;
  photoUrl?: string;
  displayOrder: number;
};

type DashboardData = {
  sponsor: SponsorProfile;
  talent: SponsorTalent[];
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
    <div className="border-b border-[#051836]/10 py-4 last:border-b-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#051836]/50">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-[#051836]">{value}</p>
    </div>
  );
}

export default function SponsorDashboardPage() {
  const { user, userStatus } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedCategory, setFeedCategory] = useState("All");

  useEffect(() => {
    if (userStatus === "logged_out" || userStatus === "pending" || userStatus === "admin") {
      router.replace("/login");
    }
  }, [router, userStatus]);

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
    <div className="min-h-screen bg-[#F5F6F0] pb-20 text-[#051836]">
      <section className="relative overflow-hidden bg-[#051836] text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 84% 18%, #F5AB00 0, transparent 21%), radial-gradient(circle at 7% 88%, #327B2F 0, transparent 28%)" }} />
        <div className="absolute -right-24 top-[-110px] h-80 w-80 rounded-full border border-white/15" />
        <div className="absolute -right-8 top-[-42px] h-56 w-56 rounded-full border border-white/10" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
                <ShieldCheck className="h-3.5 w-3.5 text-[#F5AB00]" />
                Private partnership portal
              </div>
              <h1 className="font-montserrat text-3xl font-black tracking-[-0.04em] sm:text-5xl">Partnership, with purpose.</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                A focused space for approved partners to review foundation-published Sponsor Talent and coordinate appropriate next steps.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F5AB00]"><CheckCircle2 className="h-4 w-4" /> Sponsor access active</div>
              <p className="mt-3 text-sm font-semibold text-white">{isLoading ? "Loading your profile…" : displayName}</p>
              {profile?.email && <p className="mt-1 truncate text-xs text-white/65">{profile.email}</p>}
              <Link href="/" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-white transition hover:text-[#F5AB00]">
                Foundation homepage <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="-mt-7 rounded-2xl border border-[#051836]/10 bg-white p-2 shadow-[0_18px_45px_rgba(5,24,54,0.12)]">
          <nav aria-label="Sponsor portal sections" className="flex gap-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition sm:px-4 ${active ? "bg-[#005C27] text-white shadow-sm" : "text-[#051836]/65 hover:bg-[#F5F6F0] hover:text-[#051836]"}`}
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
            <p className="font-montserrat text-lg font-bold text-[#051836]">Your portal information is temporarily unavailable</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#051836]/70">{loadError} You can use the Partnership Desk to coordinate with the foundation.</p>
            <button type="button" onClick={() => setActiveTab("partnership")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#051836] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#042554]">
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#005C27]">Your partnership profile</p>
                    <h2 className="mt-2 font-montserrat text-2xl font-black tracking-[-0.03em]">{displayName}</h2>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#005C27]/10 text-[#005C27]"><Building2 className="h-5 w-5" /></div>
                </div>
                <div className="mt-6">
                  <DetailRow label="Representative" value={profile?.name} />
                  <DetailRow label="Organization" value={profile?.organization} />
                  <DetailRow label="Role" value={profile?.roleTitle} />
                  <DetailRow label="Verified email" value={profile?.email} />
                </div>
                {!profile?.applicationRecorded && <p className="mt-5 rounded-xl bg-[#F5F6F0] p-3 text-xs leading-5 text-[#051836]/70">Your access is active. The foundation can confirm any remaining profile details through the Partnership Desk.</p>}
              </article>

              <article className="relative overflow-hidden rounded-3xl bg-[#005C27] p-7 text-white shadow-[0_18px_40px_rgba(0,92,39,0.22)] sm:p-8">
                <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full border border-white/15" />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80"><Sparkles className="h-3.5 w-3.5 text-[#F5AB00]" /> Curated access</div>
                    <h2 className="mt-5 max-w-md font-montserrat text-3xl font-black leading-tight tracking-[-0.04em]">Explore what the foundation has chosen to share.</h2>
                    <p className="mt-4 max-w-md text-sm leading-6 text-white/75">Sponsor Talent records appear here only when their publication settings allow it. Partnership planning continues through appropriate private conversations.</p>
                  </div>
                  <button type="button" onClick={() => setActiveTab("talent")} className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#005C27] transition hover:bg-[#F5AB00] hover:text-[#051836]">
                    Browse Sponsor Talent <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            </div>

            <article className="rounded-3xl border border-[#051836]/10 bg-white p-6 shadow-[0_12px_32px_rgba(5,24,54,0.06)] sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#005C27]">A considered process</p>
                  <h2 className="mt-2 font-montserrat text-xl font-black tracking-[-0.03em]">Designed for private, responsible coordination.</h2>
                </div>
                <button type="button" onClick={() => setActiveTab("partnership")} className="inline-flex items-center gap-2 text-xs font-bold text-[#005C27] hover:text-[#327B2F]">Open Partnership Desk <ChevronRight className="h-4 w-4" /></button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ["01", "Verified access", "Sponsor accounts are reviewed and approved before portal access is issued."],
                  ["02", "Published information", "Only foundation-approved Sponsor Talent details appear in this space."],
                  ["03", "Guided next steps", "The partnership team coordinates follow-up through appropriate private channels."],
                ].map(([number, title, description]) => (
                  <div key={number} className="rounded-2xl bg-[#F5F6F0] p-5">
                    <span className="font-montserrat text-xs font-black text-[#F5AB00]">{number}</span>
                    <h3 className="mt-3 font-montserrat text-sm font-black">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#051836]/65">{description}</p>
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
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#005C27]">Foundation-published records</p>
                  <h2 className="mt-2 font-montserrat text-3xl font-black tracking-[-0.04em]">Sponsor Talent directory</h2>
                  <p className="mt-3 text-sm leading-6 text-[#051836]/65">This directory contains only records PWLIF has approved for visibility. Publication settings can be updated or withdrawn by the foundation at any time.</p>
                </div>
                {categories.length > 1 && (
                  <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                    {categories.map((category) => (
                      <button key={category} type="button" onClick={() => setFeedCategory(category)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition ${feedCategory === category ? "bg-[#051836] text-white" : "border border-[#051836]/10 bg-[#F5F6F0] text-[#051836]/70 hover:border-[#005C27]/50"}`}>
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {filteredTalent.length === 0 ? (
                <div className="mt-8 grid min-h-72 place-items-center rounded-2xl border border-dashed border-[#051836]/20 bg-[#F5F6F0] p-8 text-center">
                  <div className="max-w-md">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#005C27] shadow-sm"><Sparkles className="h-5 w-5" /></div>
                    <h3 className="mt-5 font-montserrat text-xl font-black">No Sponsor Talent records are available yet.</h3>
                    <p className="mt-3 text-sm leading-6 text-[#051836]/65">When the foundation publishes an approved record, it will appear here. You can use the Partnership Desk for a private conversation in the meantime.</p>
                    <button type="button" onClick={() => setActiveTab("partnership")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#005C27] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#327B2F]">Open Partnership Desk <ArrowRight className="h-4 w-4" /></button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredTalent.map((record) => (
                    <article key={record.id} className="group overflow-hidden rounded-3xl border border-[#051836]/10 bg-[#FDFCF9] shadow-[0_10px_25px_rgba(5,24,54,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(5,24,54,0.13)]">
                      {record.photoUrl ? (
                        <img src={record.photoUrl} alt="" className="h-44 w-full object-cover" />
                      ) : (
                        <div className="relative flex h-44 items-end overflow-hidden bg-[#051836] p-5">
                          <div className="absolute right-[-20px] top-[-45px] h-40 w-40 rounded-full border border-white/10" />
                          <span className="relative rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/80">Sponsor Talent</span>
                        </div>
                      )}
                      <div className="p-6">
                        {record.supportArea && <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#005C27]">{record.supportArea}</p>}
                        <h3 className="mt-2 font-montserrat text-lg font-black leading-snug">{record.title}</h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#051836]/65">{record.summary}</p>
                        <div className="mt-6 flex items-center justify-between border-t border-[#051836]/10 pt-4">
                          <Link href={`/portfolio/${record.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005C27] hover:text-[#327B2F]">View details <ArrowRight className="h-3.5 w-3.5" /></Link>
                          <Link href="/book-a-call" className="text-xs font-bold text-[#051836]/60 hover:text-[#051836]">Discuss</Link>
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
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#005C27]">Partnership Desk</p>
              <h2 className="mt-2 max-w-xl font-montserrat text-3xl font-black tracking-[-0.04em]">Coordinate the next conversation with care.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#051836]/65">Individual sponsorship assignments and sensitive partnership information are not displayed in this portal. The foundation coordinates appropriate next steps after a private conversation and safeguarding review.</p>
              <Link href="/book-a-call" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#005C27] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#327B2F]">Book a partnership call <ArrowRight className="h-4 w-4" /></Link>
            </article>
            <aside className="rounded-3xl border border-[#051836]/10 bg-[#FDFCF9] p-7 shadow-[0_12px_32px_rgba(5,24,54,0.06)] sm:p-8">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F5AB00]/20 text-[#051836]"><MessageCircle className="h-5 w-5" /></div>
              <h3 className="mt-5 font-montserrat text-xl font-black">What to expect</h3>
              <ol className="mt-5 space-y-4 text-sm text-[#051836]/70">
                <li className="flex gap-3"><span className="font-montserrat font-black text-[#005C27]">01</span><span>Choose a suitable time for a conversation.</span></li>
                <li className="flex gap-3"><span className="font-montserrat font-black text-[#005C27]">02</span><span>The partnership team reviews the appropriate context with you.</span></li>
                <li className="flex gap-3"><span className="font-montserrat font-black text-[#005C27]">03</span><span>Any agreed follow-up is coordinated privately.</span></li>
              </ol>
            </aside>
          </section>
        )}

        {!isLoading && !loadError && activeTab === "account" && (
          <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-3xl bg-[#051836] p-7 text-white shadow-[0_16px_38px_rgba(5,24,54,0.18)] sm:p-8">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#F5AB00]"><LockKeyhole className="h-5 w-5" /></div>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">Passwordless sign-in</p>
              <h2 className="mt-2 font-montserrat text-2xl font-black tracking-[-0.04em]">Your access is linked to your email.</h2>
              <p className="mt-4 text-sm leading-6 text-white/70">PWLIF uses email-link access for approved sponsors. No password is created, stored, or shown in this portal.</p>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85"><CheckCircle2 className="h-3.5 w-3.5 text-[#F5AB00]" /> Access active</div>
            </article>
            <article className="rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#005C27]">Approved profile</p>
              <h2 className="mt-2 font-montserrat text-2xl font-black tracking-[-0.04em]">Your recorded details</h2>
              <div className="mt-5">
                <DetailRow label="Representative" value={profile?.name} />
                <DetailRow label="Organization" value={profile?.organization} />
                <DetailRow label="Role" value={profile?.roleTitle} />
                <DetailRow label="Email" value={profile?.email} />
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#F5F6F0] p-4 text-xs leading-5 text-[#051836]/70"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#005C27]" /><span>To request a change to approved sponsor details, please use the Partnership Desk to arrange a conversation with the foundation.</span></div>
            </article>
          </section>
        )}

        {!isLoading && !loadError && activeTab === "notifications" && (
          <section className="mt-10 rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)] sm:p-8">
            <div className="mx-auto max-w-2xl py-6 text-center sm:py-12">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#005C27]/10 text-[#005C27]"><Bell className="h-6 w-6" /></div>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#005C27]">Notifications</p>
              <h2 className="mt-2 font-montserrat text-3xl font-black tracking-[-0.04em]">A calm space for foundation updates.</h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#051836]/65">There are no updates to display. When PWLIF enables a reviewed sponsor communications workflow, foundation-issued updates will appear here. This portal does not create automated alerts or promotional messages.</p>
              <button type="button" onClick={() => setActiveTab("partnership")} className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#005C27]/25 bg-[#005C27]/5 px-4 py-3 text-xs font-bold text-[#005C27] transition hover:bg-[#005C27] hover:text-white">Contact the Partnership Desk <ArrowRight className="h-4 w-4" /></button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
