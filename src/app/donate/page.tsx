"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  Award, 
  FileText,
  DollarSign,
  Gift
} from "lucide-react";

export default function DonatePage() {
  const [selectedTier, setSelectedTier] = useState<string>("Child Sponsor");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDonationSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] bg-foundation-pattern py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block mb-2">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto mx-auto object-contain"
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005C27]/10 border border-[#005C27]/20 text-[#005C27] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 text-[#F5AB00] fill-[#F5AB00]" />
            <span>Financial Stewardship &amp; Giving Channels</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-[#051836]">
            Ways to Donate &amp; Support
          </h1>
          <p className="font-inter text-base sm:text-lg text-[#051836]/70 max-w-3xl mx-auto leading-relaxed">
            Your contributions directly fund educational grants, STEM hardware, tuition, and community learning center infrastructure for vulnerable children across Africa.
          </p>
        </div>

        {/* 5 Donation Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-inter">
          {[
            {
              title: "Direct Child Sponsorship",
              amount: "$150 / Month",
              desc: "Provides a child with direct educational tuition, STEM equipment, learning materials, and quarterly audited progress reporting.",
              category: "Child Sponsor",
              popular: true,
            },
            {
              title: "Program & Lab Equipment Grant",
              amount: "$500 / Month",
              desc: "Equips local Talent Development Centres in Ethiopia with microcontrollers, laptops, digital audio workstations, and 3D printers.",
              category: "Program Sponsor",
              popular: false,
            },
            {
              title: "Foundation Core Support",
              amount: "$1,500 / Month",
              desc: "Sponsors core operations, international child safeguarding systems, guardian liaisons, and foundation sustainability.",
              category: "Foundation Sponsor",
              popular: false,
            },
          ].map((channel, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-7 border shadow-lg flex flex-col justify-between space-y-4 relative ${
                channel.popular ? "border-[#005C27] ring-2 ring-[#005C27]/20" : "border-[#051836]/10"
              }`}
            >
              {channel.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#005C27] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                  Most Popular Channel
                </span>
              )}

              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#005C27]">
                  {channel.category}
                </span>
                <h3 className="font-montserrat font-bold text-xl text-[#051836]">
                  {channel.title}
                </h3>
                <div className="font-montserrat font-black text-2xl text-[#005C27]">
                  {channel.amount}
                </div>
                <p className="text-xs text-[#051836]/70 leading-relaxed">
                  {channel.desc}
                </p>
              </div>

              <button
                onClick={() => setSelectedTier(channel.category)}
                className={`w-full font-bold py-3 px-4 rounded-xl text-xs transition text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedTier === channel.category
                    ? "bg-[#005C27] text-white shadow-md"
                    : "bg-[#F8FAFC] text-[#051836] border border-[#051836]/15 hover:border-[#005C27]"
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-[#F5AB00] fill-[#F5AB00]" />
                <span>Select {channel.category}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Corporate & Custom Donation Form */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#051836]/10 shadow-2xl space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b border-[#051836]/10 pb-4">
            <div className="p-3 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
                Make a Contribution
              </span>
              <h2 className="font-montserrat font-bold text-2xl text-[#051836]">
                Select Grant Category or Custom Amount
              </h2>
            </div>
          </div>

          {donationSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-3 text-center animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-[#005C27] mx-auto" />
              <h3 className="font-montserrat font-bold text-lg">Thank You for Your Generous Support!</h3>
              <p className="text-xs leading-relaxed max-w-md mx-auto">
                Your commitment helps transform youth potential into purpose. Our sponsorship team has sent confirmation details to your email.
              </p>
              <button
                onClick={() => setDonationSuccess(false)}
                className="mt-2 text-xs font-bold text-[#005C27] hover:underline"
              >
                Make another contribution
              </button>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-6 font-inter text-xs">
              <div className="space-y-2">
                <label className="block font-semibold text-[#051836]">Selected Sponsorship Tier</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Child Sponsor", "Program Sponsor", "Foundation Sponsor", "Custom Grant"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTier(t)}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${
                        selectedTier === t
                          ? "bg-[#005C27] text-white border-[#005C27] shadow-sm"
                          : "bg-[#F8FAFC] text-[#051836] border-[#051836]/15 hover:border-[#005C27]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {selectedTier === "Custom Grant" && (
                <div>
                  <label className="block font-semibold text-[#051836] mb-1">Custom Grant Amount ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount (e.g. 250)"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#051836] mb-1">Your Name / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="Global Education Trust"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#051836] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@organization.org"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#051836]/10 text-xs text-[#051836]/70 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#005C27] shrink-0" />
                <p>
                  <strong>100% Financial Accountability:</strong> All direct grants are audited annually and reported transparently on our institutional financial portal.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-4 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <Heart className="w-4 h-4 text-[#F5AB00] fill-[#F5AB00]" />
                <span>Confirm &amp; Complete Sponsorship</span>
              </button>
            </form>
          )}
        </div>

        {/* Financial Transparency Link Box */}
        <div className="bg-white p-8 rounded-3xl border border-[#051836]/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
              Financial Accountability
            </span>
            <h3 className="font-montserrat font-bold text-xl text-[#051836]">
              Inspect Our Public Audits &amp; Reports
            </h3>
            <p className="text-xs text-[#051836]/70 max-w-xl">
              PWLIF publishes independent annual financial audits and quarter-by-quarter direct grant distribution PDF reports.
            </p>
          </div>
          <Link
            href="/#transparency"
            className="bg-[#051836] hover:bg-[#042554] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-md flex items-center gap-2 text-xs shrink-0"
          >
            <FileText className="w-4 h-4 text-[#F5AB00]" />
            <span>View Financial Audits</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
