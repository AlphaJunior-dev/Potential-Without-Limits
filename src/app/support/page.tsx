"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { WlpLogo } from "@/components/WlpLogo";
import {
  Headset,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  FileText,
  MessageSquare,
} from "lucide-react";

export default function SupportPage() {
  const { submitSupportInquiry } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    submitSupportInquiry(name, email, subject || "General Support Inquiry", message, "Support Concierge");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050814] font-inter bg-gallery-pattern text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block mb-2">
            <WlpLogo showText={true} className="h-10 w-auto mx-auto" />
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121A36] border border-[#F28482]/30 text-[#F28482] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F28482]" />
            <span>Dedicated Priority Assistance</span>
          </div>

          <h1 className="font-montserrat text-3xl sm:text-5xl font-black tracking-tight text-white">
            WLP Support Concierge
          </h1>
          <p className="font-inter text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Have questions regarding corporate sponsorship verification, youth data privacy, or hardware grant compliance? Send a message directly to our executive team.
          </p>
        </div>

        {/* Support Card */}
        <div className="bg-[#121A36] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 mb-2 border border-emerald-500/30">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="font-montserrat text-2xl font-black text-white">
                Inquiry Dispatched to Command Center!
              </h3>
              <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your inquiry has been routed to our Admissions &amp; Support desk. A representative will contact you at <strong>{email}</strong> within 24 hours.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <Link
                  href="/"
                  className="bg-[#F28482] text-white px-6 py-3 rounded-xl text-xs font-extrabold hover:brightness-105 transition inline-flex items-center gap-2 shadow-md"
                >
                  <span>Return to Exhibition Grid</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Information Side Panel */}
              <div className="lg:col-span-5 bg-[#050814] p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F28482] mb-3">
                    <Headset className="w-4 h-4" />
                    <span>Support Desk</span>
                  </div>
                  <h3 className="font-montserrat text-xl font-bold text-white">Direct Executive Channel</h3>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">
                    Submissions are logged directly in our Command Center unified inbox for rapid turnaround.
                  </p>

                  <div className="mt-6 space-y-3 text-xs text-white/80">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Encrypted Communications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#F28482]" />
                      <span>24-Hour Desk Turnaround</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80 space-y-1">
                  <p>📅 <strong>Need to book a call?</strong> You can also schedule a live 15-minute vetting call directly.</p>
                  <Link href="/book-a-call" className="text-[#F28482] font-bold hover:underline block pt-1">
                    Book Vetting Call →
                  </Link>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
                <h3 className="font-montserrat font-bold text-lg text-white border-b border-white/10 pb-2">
                  Submit Support Ticket
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                    Contact Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. marcus@company.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                    Inquiry Subject
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Corporate Vetting / Hardware Compliance"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                    Detailed Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how our support team can assist you..."
                    className="w-full p-3 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482] transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#F28482] text-white font-extrabold py-3.5 px-6 rounded-xl hover:brightness-105 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Support Ticket</span>
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
