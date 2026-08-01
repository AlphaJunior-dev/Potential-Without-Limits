"use client";

import React, { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useAuth } from "@/context/AuthContext";
import { WlpLogo, WlpLogoMark } from "@/components/WlpLogo";
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  User,
  Mail,
  Building2,
  Globe,
  Sparkles,
  Lock,
} from "lucide-react";

export default function BookACallPage() {
  const { bookVettingCall } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [preferredTime, setPreferredTime] = useState("Tomorrow 10:00 AM EST");
  const [submitted, setSubmitted] = useState(false);
  const [activeView, setActiveView] = useState<"calendly" | "form">("calendly");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookVettingCall(name, email, company, linkedin, preferredTime);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050814] font-inter bg-gallery-pattern text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Calendly External Script */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121A36] border border-[#F28482]/30 text-[#F28482] text-xs font-semibold uppercase tracking-wider">
            <WlpLogoMark className="w-4 h-4" />
            <span>Exclusive Corporate Sponsor Onboarding</span>
          </div>

          <h1 className="font-montserrat text-3xl sm:text-5xl font-black tracking-tight text-white">
            Schedule a Sponsor Vetting Call
          </h1>
          <p className="font-inter text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            WLP protects youth talent behind a multi-layer verification shield. To ensure safety and alignment, every corporate sponsor undergoes a brief 15-minute admissions call before receiving unique login credentials.
          </p>

          {/* Toggle View Mode Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView("calendly")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === "calendly"
                  ? "bg-[#F28482] text-white shadow-md"
                  : "bg-[#121A36] text-white border border-white/15 hover:border-[#F28482]/50"
              }`}
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Live Calendly Scheduler</span>
            </button>
            <button
              onClick={() => setActiveView("form")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === "form"
                  ? "bg-[#F28482] text-white shadow-md"
                  : "bg-[#121A36] text-white border border-white/15 hover:border-[#F28482]/50"
              }`}
            >
              <Mail className="w-4 h-4 text-white" />
              <span>Direct Priority Request Form</span>
            </button>
          </div>
        </div>

        {/* 3-Step Vetting Journey */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121A36] p-6 rounded-3xl border border-white/10 shadow-xl relative">
            <div className="w-8 h-8 rounded-lg bg-[#050814] text-[#F28482] border border-[#F28482]/30 flex items-center justify-center font-montserrat font-bold text-xs mb-3">
              01
            </div>
            <h4 className="font-montserrat font-bold text-sm text-white mb-1">
              1. Book a Vetting Call
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Select your preferred time window using our live Calendly calendar widget below.
            </p>
          </div>

          <div className="bg-[#121A36] p-6 rounded-3xl border border-white/10 shadow-xl relative">
            <div className="w-8 h-8 rounded-lg bg-[#050814] text-[#F28482] border border-[#F28482]/30 flex items-center justify-center font-montserrat font-bold text-xs mb-3">
              02
            </div>
            <h4 className="font-montserrat font-bold text-sm text-white mb-1">
              2. Brief Admissions Review
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Our executive team verifies corporate credentials and aligns on sponsorship goals.
            </p>
          </div>

          <div className="bg-[#121A36] p-6 rounded-3xl border border-white/10 shadow-xl relative">
            <div className="w-8 h-8 rounded-lg bg-[#050814] text-[#F28482] border border-[#F28482]/30 flex items-center justify-center font-montserrat font-bold text-xs mb-3">
              03
            </div>
            <h4 className="font-montserrat font-bold text-sm text-white mb-1">
              3. Secure Credentials Issued
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Upon approval, unique login credentials are sent to unlock raw media &amp; direct contacts.
            </p>
          </div>
        </div>

        {/* VIEW 1: Live Calendly Inline Widget Embed */}
        {activeView === "calendly" && (
          <div className="bg-[#121A36] rounded-3xl p-4 sm:p-8 border border-white/10 shadow-2xl overflow-hidden">
            <div className="mb-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F28482]">
                Without Limits Potential Calendly Portal
              </span>
            </div>
            
            {/* Official Calendly Inline Widget */}
            <div
              className="calendly-inline-widget w-full rounded-2xl overflow-hidden"
              data-url="https://calendly.com/withoutlimitspotential/onboarding-call?primary_color=f28482"
              style={{ minWidth: "320px", height: "700px" }}
            />
          </div>
        )}

        {/* VIEW 2: Direct Priority Request Form */}
        {activeView === "form" && (
          <div className="bg-[#121A36] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 mb-2 border border-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="font-montserrat text-2xl font-black text-white">
                  Vetting Call Requested!
                </h3>
                <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Our admissions team has reserved your time slot (
                  <span className="font-semibold text-[#F28482]">{preferredTime}</span>). A calendar invitation and confirmation email have been routed for <strong>{email}</strong>.
                </p>
                <div className="pt-4 flex justify-center gap-4">
                  <Link
                    href="/"
                    className="bg-[#F28482] text-white px-6 py-3 rounded-xl text-xs font-extrabold hover:brightness-105 transition inline-flex items-center gap-2 shadow-md"
                  >
                    <span>Return to Exhibition Grid</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Information Card */}
                <div className="lg:col-span-5 bg-[#050814] text-white p-6 rounded-2xl flex flex-col justify-between space-y-6 border border-white/10">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F28482] mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>Direct Vetting Channel</span>
                    </div>
                    <h3 className="font-montserrat text-xl font-bold">15-Min Executive Session</h3>
                    <p className="text-xs text-white/70 mt-2 leading-relaxed">
                      Meet directly with the WLP Founder &amp; Admissions Director to discuss sponsorship tiers, equipment grants, and safety rules.
                    </p>

                    <div className="mt-6 space-y-3 text-xs text-white/80">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#F28482]" />
                        <span>15 Minutes Video Call</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Strict Privacy Confidentiality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#F28482]" />
                        <span>Same-Day Credential Issuance</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80 space-y-1">
                    <p>⚡ <strong>Live Calendly Widget:</strong> Switch tabs above to use the inline calendar.</p>
                  </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
                  <h3 className="font-montserrat font-bold text-lg text-white border-b border-white/10 pb-2">
                    Corporate Priority Request Form
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#050814] border border-white/15 rounded-xl text-sm text-white placeholder-white/60 focus:outline-none focus:border-[#F28482] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                      Corporate / Institutional Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. eleanor@impactfund.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#050814] border border-white/15 rounded-xl text-sm text-white placeholder-white/60 focus:outline-none focus:border-[#F28482] transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                        Organization Name
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Impact Fund VC"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#050814] border border-white/15 rounded-xl text-sm text-white placeholder-white/60 focus:outline-none focus:border-[#F28482] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                        LinkedIn URL
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="linkedin.com/in/..."
                          className="w-full pl-10 pr-4 py-2.5 bg-[#050814] border border-white/15 rounded-xl text-sm text-white placeholder-white/60 focus:outline-none focus:border-[#F28482] transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                      Select Preferred Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#050814] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#F28482] transition font-medium"
                    >
                      <option value="Tomorrow 10:00 AM EST" className="bg-[#050814] text-white">Tomorrow 10:00 AM EST</option>
                      <option value="Tomorrow 2:30 PM EST" className="bg-[#050814] text-white">Tomorrow 2:30 PM EST</option>
                      <option value="Friday 11:00 AM EST" className="bg-[#050814] text-white">Friday 11:00 AM EST</option>
                      <option value="Friday 4:00 PM EST" className="bg-[#050814] text-white">Friday 4:00 PM EST</option>
                      <option value="Next Monday 1:00 PM EST" className="bg-[#050814] text-white">Next Monday 1:00 PM EST</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#F28482] text-white font-extrabold py-3.5 px-6 rounded-xl hover:brightness-105 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Confirm &amp; Schedule Vetting Call</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

