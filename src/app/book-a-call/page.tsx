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
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] py-12 px-4 sm:px-6 lg:px-8 bg-foundation-pattern">
      {/* Calendly External Script */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block mb-2">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto mx-auto object-contain"
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005C27]/10 border border-[#005C27]/20 text-[#005C27] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#005C27]" />
            <span>Sponsor Orientation &amp; Foundation Inquiry</span>
          </div>

          <h1 className="font-montserrat text-3xl sm:text-5xl font-black tracking-tight text-[#051836]">
            Schedule a Sponsor Orientation
          </h1>
          <p className="font-inter text-base text-[#051836]/70 max-w-2xl mx-auto leading-relaxed">
            Potential Without Limits International Foundation (PWLIF) connects passionate sponsors with young innovators under strict child safety protocols. Schedule a brief 15-minute orientation call with our foundation team to learn about child dream adoption and sponsorship tiers.
          </p>

          {/* Toggle View Mode Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView("calendly")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === "calendly"
                  ? "bg-[#005C27] text-white shadow-md"
                  : "bg-white text-[#051836] border border-[#051836]/15 hover:border-[#005C27]"
              }`}
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Live Calendly Scheduler</span>
            </button>
            <button
              onClick={() => setActiveView("form")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === "form"
                  ? "bg-[#005C27] text-white shadow-md"
                  : "bg-white text-[#051836] border border-[#051836]/15 hover:border-[#005C27]"
              }`}
            >
              <Mail className="w-4 h-4 text-white" />
              <span>Direct Orientation Form</span>
            </button>
          </div>
        </div>

        {/* 3-Step Journey */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-inter">
          <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl relative">
            <div className="w-8 h-8 rounded-lg bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20 flex items-center justify-center font-montserrat font-bold text-xs mb-3">
              01
            </div>
            <h4 className="font-montserrat font-bold text-sm text-[#051836] mb-1">
              1. Book Orientation Call
            </h4>
            <p className="text-xs text-[#051836]/70 leading-relaxed">
              Select your preferred time slot using our live Calendly calendar widget below.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl relative">
            <div className="w-8 h-8 rounded-lg bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20 flex items-center justify-center font-montserrat font-bold text-xs mb-3">
              02
            </div>
            <h4 className="font-montserrat font-bold text-sm text-[#051836] mb-1">
              2. Orientation &amp; Align Goals
            </h4>
            <p className="text-xs text-[#051836]/70 leading-relaxed">
              Our foundation officers align on your sponsorship preferences, child dream adoption, or corporate CSR goals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#051836]/10 shadow-xl relative">
            <div className="w-8 h-8 rounded-lg bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20 flex items-center justify-center font-montserrat font-bold text-xs mb-3">
              03
            </div>
            <h4 className="font-montserrat font-bold text-sm text-[#051836] mb-1">
              3. Activated Sponsorship Hub
            </h4>
            <p className="text-xs text-[#051836]/70 leading-relaxed">
              Upon approval, your sponsor credentials are activated to track child progress and impact reports.
            </p>
          </div>
        </div>

        {/* VIEW 1: Live Calendly Inline Widget Embed */}
        {activeView === "calendly" && (
          <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#051836]/10 shadow-2xl overflow-hidden">
            <div className="mb-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
                Potential Without Limits International Foundation Calendly Portal
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
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#051836]/10 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-emerald-50 text-[#005C27] mb-2 border border-[#005C27]/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="font-montserrat text-2xl font-black text-[#051836]">
                  Orientation Session Requested!
                </h3>
                <p className="text-sm text-[#051836]/70 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Our foundation team has reserved your time slot (
                  <span className="font-semibold text-[#005C27]">{preferredTime}</span>). A calendar invitation and confirmation email have been sent to <strong>{email}</strong>.
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-inter text-xs text-[#051836]">
                {/* Information Card */}
                <div className="lg:col-span-5 bg-[#F8FAFC] text-[#051836] p-6 rounded-2xl flex flex-col justify-between space-y-6 border border-[#051836]/10">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005C27] mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>Direct Orientation Channel</span>
                    </div>
                    <h3 className="font-montserrat text-xl font-bold">15-Min Foundation Session</h3>
                    <p className="text-xs text-[#051836]/70 mt-2 leading-relaxed">
                      Meet with a PWLIF foundation officer to discuss sponsorship categories, child dream adoption, and transparent financial stewardship.
                    </p>

                    <div className="mt-6 space-y-3 text-xs text-[#051836]/80">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#005C27]" />
                        <span>15-Minute Virtual Session</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#005C27]" />
                        <span>100% Parent Consent Verification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#005C27]" />
                        <span>Immediate Credential Activation</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#051836]/10 text-[11px] text-[#051836]/80 space-y-1">
                    <p>⚡ <strong>Live Calendly Widget:</strong> Switch tabs above to use the inline calendar.</p>
                  </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
                  <h3 className="font-montserrat font-bold text-lg text-[#051836] border-b border-[#051836]/10 pb-2">
                    Sponsor Orientation Request Form
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                      Your Full Name
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
                      Email Address
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                        Organization / Individual
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-[#051836]/40 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. NextGen Foundation / Individual Sponsor"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                        LinkedIn / Website URL
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-[#051836]/40 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="linkedin.com/in/..."
                          className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27] transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#051836]/80 uppercase tracking-wider mb-1">
                      Select Preferred Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-sm text-[#051836] focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27] transition font-medium"
                    >
                      <option value="Tomorrow 10:00 AM EST">Tomorrow 10:00 AM EST</option>
                      <option value="Tomorrow 2:30 PM EST">Tomorrow 2:30 PM EST</option>
                      <option value="Friday 11:00 AM EST">Friday 11:00 AM EST</option>
                      <option value="Friday 4:00 PM EST">Friday 4:00 PM EST</option>
                      <option value="Next Monday 1:00 PM EST">Next Monday 1:00 PM EST</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-xs"
                    >
                      <span>Confirm &amp; Schedule Orientation Call</span>
                      <ArrowRight className="w-4 h-4 text-white" />
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

