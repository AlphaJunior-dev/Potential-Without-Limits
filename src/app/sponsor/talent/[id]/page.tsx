"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, MessageCircle, ShieldCheck, Sparkles, Target } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TalentPhoto } from "@/components/TalentPhoto";
import { TalentVideo } from "@/components/TalentVideo";

type PrivateTalentRecord = {
  id: string;
  title: string;
  summary: string;
  supportArea?: string;
  ageBand?: string;
  region?: string;
  skills?: string[];
  story?: string;
  aspiration?: string;
  supportPathway?: string;
  photoUrl?: string;
  mediaUrls?: string[];
};

export default function SponsorTalentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, userStatus } = useAuth();
  const router = useRouter();
  const [record, setRecord] = useState<PrivateTalentRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (userStatus === "logged_out" || userStatus === "pending" || userStatus === "admin") router.replace("/login");
  }, [router, userStatus]);

  useEffect(() => {
    if (!user || userStatus !== "approved" || !id) return;
    const authenticatedUser = user;
    let cancelled = false;
    async function loadRecord() {
      setLoading(true);
      setError("");
      try {
        const token = await authenticatedUser.getIdToken(true);
        const response = await fetch(`/api/sponsor/talent/${encodeURIComponent(id)}`, { headers: { authorization: `Bearer ${token}` }, cache: "no-store" });
        if (response.status === 401 || response.status === 403) {
          router.replace("/login");
          return;
        }
        if (!response.ok) throw new Error(response.status === 404 ? "This Sponsor Talent record is no longer available." : "This Sponsor Talent record could not be loaded.");
        const payload = await response.json() as { talent: PrivateTalentRecord };
        if (!cancelled) setRecord(payload.talent);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "This Sponsor Talent record could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadRecord();
    return () => { cancelled = true; };
  }, [id, router, user, userStatus]);

  const handleRecordMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!record || !user || !message.trim()) return;
    setMessageStatus("");
    setIsSendingMessage(true);
    try {
      const token = await user.getIdToken(true);
      const response = await fetch("/api/sponsor", {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ action: "sendMessage", subject: `Sponsor Talent record: ${record.title}`.slice(0, 200), message, talentId: record.id }),
      });
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || "Your message could not be sent. Please try again.");
      setMessage("");
      setMessageStatus("Your record-specific message has been delivered to the Foundation inbox.");
    } catch (sendError) {
      setMessageStatus(sendError instanceof Error ? sendError.message : "Your message could not be sent. Please try again.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F6F0] px-5 py-10 text-[#0B2E6B] sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link href="/sponsor/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-[#079432] hover:text-[#14B84A]"><ArrowLeft className="h-4 w-4" /> Back to private directory</Link>
        {loading && <div className="mt-8 rounded-3xl bg-white p-10 text-sm text-[#0B2E6B]/65 shadow-sm">Loading the private Sponsor Talent record…</div>}
        {!loading && error && <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-800">{error}</div>}
        {!loading && record && <>
          <header className="mt-8 overflow-hidden rounded-[2rem] bg-[#061D45] text-white shadow-[0_18px_40px_rgba(5,24,54,0.16)]">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-72 bg-[#0B2E6B]">{record.photoUrl ? <TalentPhoto src={record.photoUrl} alt="Private Sponsor Talent record" className="h-full w-full object-cover" /> : <div className="flex h-full items-end p-8"><div><Sparkles className="h-8 w-8 text-[#A9F1C3]" /><p className="mt-12 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9F1C3]">Private Sponsor Talent record</p></div></div>}</div>
              <div className="p-8 sm:p-12"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9F1C3]">Approved sponsor access</p><h1 className="mt-4 font-montserrat text-4xl font-black tracking-[-0.05em] sm:text-5xl">{record.title}</h1>{record.supportArea && <p className="mt-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85">{record.supportArea}</p>}<p className="mt-7 max-w-2xl text-base leading-8 text-white/76">{record.summary}</p></div>
            </div>
          </header>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="space-y-6"><DetailCard eyebrow="Talent story" title="Context and potential" body={record.story} /><DetailCard eyebrow="Aspiration" title="Looking ahead" body={record.aspiration} icon={<Target className="h-5 w-5" />} /><DetailCard eyebrow="Support pathway" title="Appropriate next steps" body={record.supportPathway} icon={<ShieldCheck className="h-5 w-5" />} /></section>
            <aside className="space-y-6"><section className="rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)]"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Record overview</p>{record.ageBand && <p className="mt-5 text-sm font-semibold"><span className="text-[#0B2E6B]/52">Age band: </span>{record.ageBand}</p>}{record.region && <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-[#079432]" />{record.region}</p>}{record.skills?.length ? <div className="mt-6 border-t border-[#0B2E6B]/10 pt-5"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0B2E6B]/52">Skills and interests</p><div className="mt-3 flex flex-wrap gap-2">{record.skills.map((skill) => <span key={skill} className="rounded-full bg-[#079432]/10 px-3 py-1.5 text-xs font-bold text-[#079432]">{skill}</span>)}</div></div> : <p className="mt-5 rounded-2xl bg-[#F5F6F0] p-4 text-xs leading-5 text-[#0B2E6B]/62">No skills or interests have been added to this private record yet.</p>}{!record.ageBand && !record.region && <p className="mt-4 text-xs leading-5 text-[#0B2E6B]/52">Additional overview details are not yet available in this record.</p>}</section>
            <section className="rounded-3xl border border-[#0B2E6B]/10 bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)]"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Shared media</p>{record.mediaUrls?.length ? <div className="mt-5 space-y-4">{record.mediaUrls.map((mediaUrl, index) => <div key={mediaUrl} className="overflow-hidden rounded-xl border border-[#0B2E6B]/10 bg-[#F5F6F0]"><TalentVideo src={mediaUrl} access="private" className="aspect-video w-full bg-[#061D45] object-cover" /><p className="px-4 py-3 text-xs font-bold text-[#0B2E6B]/72">Private Talent video {index + 1}</p></div>)}</div> : <p className="mt-5 rounded-2xl bg-[#F5F6F0] p-4 text-xs leading-5 text-[#0B2E6B]/62">No media has been shared for this private record yet.</p>}</section></aside>
          </div>
          <section className="mt-8 rounded-3xl border border-[#079432]/20 bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)] sm:p-8"><div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#079432]/10 text-[#079432]"><MessageCircle className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Foundation enquiry</p><h2 className="mt-2 font-montserrat text-2xl font-black tracking-[-0.04em]">Ask a question about this record.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#0B2E6B]/65">Your message is delivered only to the Foundation inbox with this record reference. It does not create an automatic sponsorship assignment.</p></div></div><form onSubmit={handleRecordMessage} className="mt-6 max-w-3xl space-y-3"><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#0B2E6B]/55" htmlFor="record-message">Your question or context</label><textarea id="record-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} required rows={5} placeholder="What would you like the Foundation team to clarify about this Sponsor Talent record?" className="w-full resize-y rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#0B2E6B] outline-none focus:border-[#079432]" /><button type="submit" disabled={isSendingMessage} className="inline-flex items-center gap-2 rounded-xl bg-[#079432] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#14B84A] disabled:cursor-not-allowed disabled:opacity-60">{isSendingMessage ? "Sending message…" : "Send to Foundation"} <ArrowRight className="h-4 w-4" /></button>{messageStatus && <p role="status" className="text-xs leading-5 text-[#0B2E6B]/70">{messageStatus}</p>}</form></section>
        </>}
      </div>
    </main>
  );
}

function DetailCard({ eyebrow, title, body, icon }: { eyebrow: string; title: string; body?: string; icon?: ReactNode }) {
  return <section className="rounded-3xl bg-white p-7 shadow-[0_12px_32px_rgba(5,24,54,0.08)] sm:p-8"><div className="flex items-center gap-3 text-[#079432]">{icon}<p className="text-[10px] font-bold uppercase tracking-[0.16em]">{eyebrow}</p></div><h2 className="mt-3 font-montserrat text-2xl font-black tracking-[-0.04em]">{title}</h2>{body ? <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#0B2E6B]/70">{body}</p> : <div className="mt-4 rounded-2xl border border-dashed border-[#0B2E6B]/18 bg-[#F5F6F0] p-4"><p className="text-sm font-bold text-[#0B2E6B]">Not yet available in this record</p><p className="mt-1 text-xs leading-5 text-[#0B2E6B]/62">PWLIF has not added this part of the private Sponsor Talent record yet. Use the Foundation enquiry form below if you need appropriate context.</p></div>}</section>;
}
