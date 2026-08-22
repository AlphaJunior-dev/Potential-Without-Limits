"use client";

import { FormEvent, useState } from "react";

type PublicEnquiryFormProps = {
  source: string;
  subject: string;
  title: string;
  intro: string;
  interestLabel?: string;
  interestPlaceholder?: string;
};

export function PublicEnquiryForm({ source, subject, title, intro, interestLabel = "Organisation or relevant experience", interestPlaceholder = "Share any useful context" }: PublicEnquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("");
    setSending(true);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, email, subject, message, source, details: interest ? { [interestLabel]: interest } : {} }) });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || "Your form could not be sent.");
      setName(""); setEmail(""); setInterest(""); setMessage("");
      setStatus("Thank you. Your submission has been received by the Foundation team.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Your form could not be sent. Please try again.");
    } finally { setSending(false); }
  };

  return <section className="mt-14 rounded-[2rem] border border-[#0B2E6B]/10 bg-white p-7 shadow-[0_14px_40px_rgba(11,46,107,0.07)] sm:p-10">
    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Public form submission</p><h2 className="mt-3 font-montserrat text-3xl font-black tracking-[-0.04em] text-[#0B2E6B]">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#0B2E6B]/70">{intro}</p>
    <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-[#0B2E6B]">Full name<input required value={name} maxLength={120} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#0B2E6B]/15 px-4 py-3 font-normal outline-none focus:border-[#079432]" /></label><label className="text-xs font-bold text-[#0B2E6B]">Email address<input required type="email" value={email} maxLength={180} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#0B2E6B]/15 px-4 py-3 font-normal outline-none focus:border-[#079432]" /></label><label className="text-xs font-bold text-[#0B2E6B] sm:col-span-2">{interestLabel}<input value={interest} maxLength={500} placeholder={interestPlaceholder} onChange={(event) => setInterest(event.target.value)} className="mt-2 w-full rounded-xl border border-[#0B2E6B]/15 px-4 py-3 font-normal outline-none focus:border-[#079432]" /></label><label className="text-xs font-bold text-[#0B2E6B] sm:col-span-2">How can the Foundation help?<textarea required value={message} maxLength={2000} rows={5} onChange={(event) => setMessage(event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-[#0B2E6B]/15 px-4 py-3 font-normal leading-6 outline-none focus:border-[#079432]" /></label><div className="sm:col-span-2 flex flex-wrap items-center gap-4"><button type="submit" disabled={sending} className="rounded-xl bg-[#079432] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#14B84A] disabled:opacity-60">{sending ? "Sending…" : "Send submission"}</button>{status && <p role="status" className="text-xs leading-5 text-[#0B2E6B]/70">{status}</p>}</div></form>
  </section>;
}
