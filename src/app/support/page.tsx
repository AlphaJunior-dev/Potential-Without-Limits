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
    submitSupportInquiry(name, email, subject || "Sponsorship Inquiry / Donation Question", message, "Support Concierge");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] py-12 px-4 sm:px-6 lg:px-8 bg-foundation-pattern">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block mb-2">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits Foundation"
              className="h-16 w-auto mx-auto object-contain"
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005C27]/10 border border-[#005C27]/20 text-[#005C27] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#005C27]" />
            <span>Dedicated Foundation Assistance</span>
          </div>

          <h1 className="font-montserrat text-3xl sm:text-5xl font-black tracking-tight text-[#051836]">
            PWLIF Support Concierge
          </h1>
          <p className="font-inter text-base text-[#051836]/70 max-w-2xl mx-auto leading-relaxed">
            Have questions regarding sponsorship categories, child dream adoption, parental consent standards, or donation stewardship? Send a message directly to our foundation office.
          </p>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#051836]/10 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-50 text-[#005C27] mb-2 border border-[#005C27]/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="font-montserrat text-2xl font-black text-[#051836]">
                Inquiry Dispatched to Foundation Office!
              </h3>
              <p className="text-sm text-[#051836]/70 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your message has been received by our Foundation Concierge desk. A representative will contact you at <strong>{email}</strong> within 24 hours.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <Link
                  href="/"
                  className="bg-[#005C27] hover:bg-[#327B2F] text-white px-6 py-3 rounded-xl text-xs font-extrabold transition inline-flex items-center gap-2 shadow-md"
                >
                  <span>Return to Foundation Homepage</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Information Side Panel */}
              <div className="lg:col-span-5 bg-[#F8FAFC] p-6 rounded-2xl border border-[#051836]/10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005C27] mb-3">
                    <Headset className="w-4 h-4" />
                    <span>Foundation Desk</span>
                  </div>
                  <h3 className="font-montserrat text-xl font-bold text-[#051836]">Direct Foundation Channel</h3>
                  <p className="text-xs text-[#051836]/70 mt-2 leading-relaxed">
                    Submissions are reviewed directly by our foundation officers for prompt assistance.
                  </p>

                  <div className="mt-6 space-y-3 text-xs text-[#051836]/80">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#005C27]" />
                      <span>Child Safety Safeguarded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#005C27]" />
                      <span>24-Hour Office Turnaround</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#051836]/10 text-[11px] text-[#051836]/80 space-y-1">
                  <p>📅 <strong>Need orientation?</strong> You can also schedule a live orientation call directly.</p>
                  <Link href="/book-a-call" className="text-[#005C27] font-bold hover:underline block pt-1">
                    Contact Foundation Office →
                  </Link>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 font-inter text-xs text-[#051836]">
                <h3 className="font-montserrat font-bold text-lg text-[#051836] border-b border-[#051836]/10 pb-2">
                  Submit Foundation Inquiry
                </h3>

                <div>
                  <label className="block text-xs font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#051836]/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                    Contact Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#051836]/40 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. eleanor@organization.org"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                    Inquiry Subject
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#051836]/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Sponsorship Inquiry / Donation Question"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                    Detailed Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how our foundation team can assist you..."
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27] transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-xs"
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
