"use client";

import React, { useState } from "react";
import Link from "next/link";
import Script from "next/script";
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

import { SponsorCategory } from "@/lib/data";

export default function BookACallPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [preferredTime, setPreferredTime] = useState("Tomorrow 10:00 AM EST");
  const [category, setCategory] = useState<SponsorCategory>("Child Sponsor");
  const [orgDescription, setOrgDescription] = useState("");
  const [supportIntent, setSupportIntent] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingUrl, setBookingUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/orientation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          organization: company,
          roleTitle,
          websiteOrLinkedIn: linkedin,
          orgDescription,
          supportIntent,
          preferredContactWindow: preferredTime,
          consent,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result?.error === "string" ? result.error : "We could not save your request right now. Please try again shortly.");
      setBookingUrl(typeof result?.bookingUrl === "string" ? result.bookingUrl : "");
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not save your request right now. Please try again shortly.");
    } finally {
      setSubmitting(false);
    }
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
            <span>Sponsor Orientation &amp; Foundation Inquiry</span>
          </div>

          <h1 className="mt-5 font-montserrat text-4xl sm:text-6xl font-black tracking-[-0.05em] text-white">
            Schedule a Sponsor Orientation
          </h1>
          <p className="font-inter text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Potential Without Limits International Foundation (PWLIF) connects prospective sponsors with carefully published Sponsor Talent information. Submit an orientation request, then schedule a private conversation with our foundation team.
          </p>
          </div>
        </div>

        {/* 3-Step Journey */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-inter">
          <div className="bg-white p-7 rounded-[1.6rem] border border-[#0B2E6B]/10 shadow-[0_14px_40px_rgba(11,46,107,0.08)] relative">
            <div className="w-9 h-9 rounded-full bg-[#079432]/10 text-[#079432] border border-[#079432]/20 flex items-center justify-center font-montserrat font-bold text-xs mb-5">
              01
            </div>
            <h4 className="font-montserrat font-bold text-sm text-[#0B2E6B] mb-1">
              1. Submit Orientation Form
            </h4>
            <p className="text-xs text-[#0B2E6B]/70 leading-relaxed">
              Fill out your details, sponsorship category, and preferred time slot.
            </p>
          </div>

          <div className="bg-white p-7 rounded-[1.6rem] border border-[#0B2E6B]/10 shadow-[0_14px_40px_rgba(11,46,107,0.08)] relative">
            <div className="w-9 h-9 rounded-full bg-[#079432]/10 text-[#079432] border border-[#079432]/20 flex items-center justify-center font-montserrat font-bold text-xs mb-5">
              02
            </div>
            <h4 className="font-montserrat font-bold text-sm text-[#0B2E6B] mb-1">
              2. Orientation &amp; Vetting
            </h4>
            <p className="text-xs text-[#0B2E6B]/70 leading-relaxed">
              Our foundation officers discuss your organization, interests, and responsible partnership approach.
            </p>
          </div>

          <div className="bg-white p-7 rounded-[1.6rem] border border-[#0B2E6B]/10 shadow-[0_14px_40px_rgba(11,46,107,0.08)] relative">
            <div className="w-9 h-9 rounded-full bg-[#079432]/10 text-[#079432] border border-[#079432]/20 flex items-center justify-center font-montserrat font-bold text-xs mb-5">
              03
            </div>
            <h4 className="font-montserrat font-bold text-sm text-[#0B2E6B] mb-1">
              3. Secure Sponsor Access
            </h4>
            <p className="text-xs text-[#0B2E6B]/70 leading-relaxed">
              After approval, PWLIF sends a secure email invitation. The sponsor verifies it and creates their own password for future dashboard sign-in.
            </p>
          </div>
        </div>

        {/* Direct Orientation Form */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-[#0B2E6B]/10 shadow-[0_20px_60px_rgba(11,46,107,0.1)]">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-emerald-50 text-[#079432] mb-2 border border-[#079432]/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="font-montserrat text-2xl font-black text-[#0B2E6B]">
                  Orientation Session Requested!
                </h3>
                <p className="text-sm text-[#0B2E6B]/70 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your orientation request was saved. Please use the booking calendar below to choose a suitable time.
                </p>
                {bookingUrl ? (
                  <div className="pt-4 min-h-[700px] text-left">
                    <div className="calendly-inline-widget" data-url={bookingUrl} style={{ minWidth: "320px", height: "700px" }} />
                    <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
                  </div>
                ) : (
                  <p className="text-xs text-[#0B2E6B]/60">The booking calendar is not available yet. The PWLIF team will follow up using the contact details you provided.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-inter text-xs text-[#0B2E6B]">
                {/* Information Card */}
                <div className="lg:col-span-5 bg-[#F8FAFC] text-[#0B2E6B] p-6 rounded-2xl flex flex-col justify-between space-y-6 border border-[#0B2E6B]/10">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#079432] mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>Direct Orientation Channel</span>
                    </div>
                    <h3 className="font-montserrat text-xl font-bold">15-Min Foundation Session</h3>
                    <p className="text-xs text-[#0B2E6B]/70 mt-2 leading-relaxed">
                      Meet with a PWLIF foundation officer to discuss Sponsor Talent interests, safeguarding, and potential partnership approaches.
                    </p>

                    <div className="mt-6 space-y-3 text-xs text-[#0B2E6B]/80">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#079432]" />
                        <span>15-Minute Virtual Session</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#079432]" />
                        <span>Safeguarding-informed discussion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#079432]" />
                        <span>Invitation sent only after approval</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#0B2E6B]/10 text-[11px] text-[#0B2E6B]/80 space-y-1">
                    <p><strong>Booking calendar:</strong> It will appear after you submit the orientation request.</p>
                  </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
                  <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B] border-b border-[#0B2E6B]/10 pb-2">
                    Sponsor Orientation Request Form
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                      Your Full Name
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
                      Email Address
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
                      Your Role / Title
                    </label>
                    <input
                      type="text"
                      required
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. Partnerships Director"
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                        Organization / Individual
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-[#0B2E6B]/40 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Organization or Individual Sponsor"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                        LinkedIn / Website URL
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-[#0B2E6B]/40 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="linkedin.com/in/..."
                          className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                        Sponsorship Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as SponsorCategory)}
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-xs text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition font-medium"
                      >
                        <option value="Child Sponsor">Sponsor Talent Partner</option>
                        <option value="Program Sponsor">Programme Partner</option>
                        <option value="Foundation Sponsor">Foundation Partner</option>
                        <option value="Corporate Partner">Corporate Partner</option>
                        <option value="Strategic Partner">Strategic Partner</option>
                      </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                      Tell us about your organization
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={orgDescription}
                      onChange={(e) => setOrgDescription(e.target.value)}
                      placeholder="Briefly describe your organization and its work."
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-xs text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                      Partnership Interest
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={supportIntent}
                      onChange={(e) => setSupportIntent(e.target.value)}
                      placeholder="Tell us what you hope to discuss during an orientation call."
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-xs text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2E6B]/80 uppercase tracking-wider mb-1">
                      Select Preferred Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition font-medium"
                    >
                      <option value="Tomorrow 10:00 AM EST">Tomorrow 10:00 AM EST</option>
                      <option value="Tomorrow 2:30 PM EST">Tomorrow 2:30 PM EST</option>
                      <option value="Friday 11:00 AM EST">Friday 11:00 AM EST</option>
                      <option value="Friday 4:00 PM EST">Friday 4:00 PM EST</option>
                      <option value="Next Monday 1:00 PM EST">Next Monday 1:00 PM EST</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <label className="mb-3 flex items-start gap-2 text-[11px] text-[#0B2E6B]/70 cursor-pointer">
                      <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[#079432]" />
                      <span>I confirm that the information provided is accurate and that PWLIF may use it to review this orientation request.</span>
                    </label>
                    {submitError && <p className="mb-3 text-xs text-red-700">{submitError}</p>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-xs"
                    >
                      <span>{submitting ? "Saving Request..." : "Save Request &amp; Continue to Booking"}</span>
                      <ArrowRight className="w-4 h-4 text-white" />
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
