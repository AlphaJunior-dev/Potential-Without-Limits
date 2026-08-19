"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, FileWarning, LockKeyhole, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type PreviewCard = {
  id: string;
  title: string;
  focus: string;
  summary: string;
  tags: string[];
  accent: "forest" | "navy" | "gold";
};

const accentStyles: Record<PreviewCard["accent"], string> = {
  forest: "from-[#005C27] to-[#0b7d3a]",
  navy: "from-[#051836] to-[#173765]",
  gold: "from-[#A66B00] to-[#F5AB00]",
};

export default function TalentDesignPreviewPage() {
  const router = useRouter();
  const { user, userStatus, loading } = useAuth();
  const [cards, setCards] = useState<PreviewCard[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "denied">("loading");

  useEffect(() => {
    if (loading) return;
    if (userStatus !== "admin" || !user) {
      router.replace("/admin/login");
      return;
    }

    let active = true;
    void (async () => {
      try {
        const token = await user.getIdToken(true);
        const response = await fetch("/api/admin/talent-preview", {
          headers: { authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Administrator access is required.");
        const data = await response.json() as { cards?: PreviewCard[] };
        if (active) {
          setCards(Array.isArray(data.cards) ? data.cards : []);
          setStatus("ready");
        }
      } catch {
        if (active) setStatus("denied");
      }
    })();

    return () => { active = false; };
  }, [loading, router, user, userStatus]);

  if (status === "denied") {
    return (
      <main className="min-h-screen bg-[#FDFCF9] px-6 py-24 text-[#051836]">
        <section className="mx-auto max-w-xl rounded-3xl border border-[#051836]/10 bg-white p-10 text-center shadow-[0_20px_60px_rgba(5,24,54,0.10)]">
          <LockKeyhole className="mx-auto mb-4 h-8 w-8 text-[#005C27]" />
          <h1 className="font-heading text-3xl font-black">Administrator access required</h1>
          <p className="mt-3 text-sm leading-6 text-[#051836]/65">This layout review is not available to sponsors or public visitors.</p>
          <Link href="/admin/login" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#005C27] px-5 py-3 text-sm font-bold text-white">Return to admin login <ArrowLeft className="h-4 w-4 rotate-180" /></Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCF9] pb-20 text-[#051836]">
      <header className="border-b border-[#051836]/10 bg-white/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#051836]/70 transition hover:text-[#005C27]"><ArrowLeft className="h-4 w-4" /> Back to Admin Portal</Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#F5AB00]/35 bg-[#FFF8E8] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#805300]"><LockKeyhole className="h-3.5 w-3.5" /> Administrator-only</span>
        </div>
      </header>

      <section className="border-b border-[#051836]/10 bg-[#051836] px-6 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#F5AB00]"><Sparkles className="h-3.5 w-3.5" /> Design preview only</div>
          <h1 className="font-heading max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">Preview the Sponsor Talent directory, without publishing a record.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">The cards below are fictional layout samples for internal review only. They are not stored in the Talent pipeline and cannot be viewed by sponsors or public visitors.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 grid gap-4 rounded-2xl border border-[#F5AB00]/35 bg-[#FFF8E8] p-5 text-sm text-[#5A3D00] md:grid-cols-[auto_1fr] md:items-center">
          <FileWarning className="h-6 w-6 text-[#A66B00]" />
          <p><strong>Not a live directory:</strong> these cards exist only in this protected design route. Live sponsor and public directories remain connected exclusively to verified Sponsor Talent records.</p>
        </div>

        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#005C27]">Layout samples</p>
            <h2 className="mt-2 font-heading text-3xl font-black tracking-[-0.035em]">Private directory card system</h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E9F5EC] px-3 py-1.5 text-xs font-bold text-[#005C27]"><Eye className="h-3.5 w-3.5" /> Admin review</span>
        </div>

        {status === "loading" ? (
          <div className="grid gap-6 md:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-[350px] animate-pulse rounded-3xl bg-[#051836]/5" />)}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {cards.map((card, index) => (
              <article key={card.id} className="group overflow-hidden rounded-3xl border border-[#051836]/10 bg-white shadow-[0_18px_45px_rgba(5,24,54,0.08)]">
                <div className={`relative min-h-44 bg-gradient-to-br ${accentStyles[card.accent]} p-6 text-white`}>
                  <div className="absolute right-[-20px] top-[-28px] h-36 w-36 rounded-full border border-white/15" />
                  <div className="relative flex items-start justify-between gap-4"><span className="rounded-full border border-white/20 bg-black/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]">Layout sample</span><span className="text-sm font-black text-white/60">0{index + 1}</span></div>
                  <div className="relative mt-9 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 font-heading text-lg font-black">{card.title.charAt(0)}</div>
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#005C27]">{card.focus}</p>
                  <h3 className="mt-2 font-heading text-2xl font-black tracking-[-0.03em]">{card.title}</h3>
                  <p className="mt-3 min-h-16 text-sm leading-6 text-[#051836]/65">{card.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">{card.tags.map((tag) => <span key={tag} className="rounded-full bg-[#F1F5F0] px-3 py-1 text-xs font-semibold text-[#005C27]">{tag}</span>)}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
