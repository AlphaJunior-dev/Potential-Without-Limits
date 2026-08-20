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
    submitSupportInquiry(name, email, subject || "Sponsor Talent or orientation inquiry", message, "Support Concierge");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFA] font-inter text-[#0B2E6B] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto space-y-10 px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[2rem] bg-[#061D45] px-7 py-12 text-center text-white shadow-2xl sm:px-12 sm:py-16">
          <div className="pwlif-motion-field" aria-hidden="true" />
          <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#14B84A]/30 bg-white/8 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A9F1C3]">
            <Sparkles className="w-3.5 h-3.5 text-[#F7B500]" />
            <span>Dedicated Foundation Assistance</span>
          </div>

          <h1 className="mt-5 font-montserrat text-4xl sm:text-6xl font-black tracking-[-0.05em] text-white">
            PWLIF Support Concierge
          </h1>
          <p className="font-inter text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Have questions about Sponsor Talent, the orientation process, or appropriate partnership conversations? Send a message to the foundation office.
          </p>
          </div>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-[#0B2E6B]/10 shadow-[0_20px_60px_rgba(11,46,107,0.1)]">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-50 text-[#079432] mb-2 border border-[#079432]/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="font-montserrat text-2xl font-black text-[#0B2E6B]">
                Inquiry Dispatched to Foundation Office!
              </h3>
              <p className="text-sm text-[#0B2E6B]/70 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your message request has been submitted for review. If a follow-up is appropriate, the foundation office may contact you at <strong>{email}</strong>.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <Link
                  href="/"
                  className="bg-[#079432] hover:bg-[#14B84A] text-white px-6 py-3 rounded-xl text-xs font-extrabold transition inline-flex items-center gap-2 shadow-md"
                >
                  <span>Return to Foundation Homepage</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Information Side Panel */}
              <div className="lg:col-span-5 bg-[#EAF7EF] p-7 rounded-[1.5rem] border border-[#079432]/15 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#079432] mb-3">
                    <Headset className="w-4 h-4" />
                    <span>Foundation Desk</span>
                  </div>
                  <h3 className="font-montserrat text-xl font-bold text-[#0B2E6B]">Direct Foundation Channel</h3>
                  <p className="text-xs text-[#0B2E6B]/70 mt-2 leading-relaxed">
                    Submissions are reviewed directly by our foundation officers for prompt assistance.
                  </p>

                  <div className="mt-6 space-y-3 text-xs text-[#0B2E6B]/80">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#079432]" />
                      <span>Safeguarding-aware process</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#079432]" />
                      <span>Review-based follow-up</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#0B2E6B]/10 text-[11px] text-[#0B2E6B]/80 space-y-1">
                  <p><strong>Need orientation?</strong> You can schedule a private orientation call directly.</p>
                  <Link href="/book-a-call" className="text-[#079432] font-bold hover:underline block pt-1">
                    Contact Foundation Office →
                  </Link>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 font-inter text-xs text-[#0B2E6B]">
                <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B] border-b border-[#0B2E6B]/10 pb-2">
                  Submit Foundation Inquiry
                </h3>

                <div>
                  <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#0B2E6B]/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Mwangi"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                    Contact Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#0B2E6B]/40 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.org"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                    Inquiry Subject
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#0B2E6B]/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Sponsor Talent or orientation inquiry"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                    Detailed Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how our foundation team can assist you..."
                    className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-xs"
                  >
                    <span>Contact Foundation Office</span>
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
