"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SponsorCategory, MembershipTier } from "@/lib/data";
import { ArrowRight, ShieldCheck, Heart, User, Mail, Lock, Building2, Award } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetTalentId = searchParams.get("talentId") || "";

  const { register, profiles } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [category, setCategory] = useState<SponsorCategory>("Child Sponsor");
  const [tier, setTier] = useState<MembershipTier>("Gold");
  const [selectedTalentId, setSelectedTalentId] = useState(targetTalentId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      await register(name, email, password, linkedin, category, tier, selectedTalentId);
      router.push("/pending");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register sponsor account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#FDFCF9] px-4 py-12 bg-foundation-pattern">
      <div className="bg-white max-w-xl w-full p-8 rounded-3xl shadow-2xl border border-[#051836]/10 text-left space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits Foundation"
              className="h-16 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="font-montserrat text-2xl font-black text-[#051836]">
            Sponsor Registration &amp; Dream Adoption
          </h1>
          <p className="font-inter text-xs text-[#051836]/70 max-w-md mx-auto">
            Join Potential Without Limits Foundation (PWLIF) to directly sponsor child dreams, fund educational grants, and receive audited impact reports.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-inter text-xs text-[#051836]">
          <div>
            <label className="block font-bold mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#005C27]" />
              <span>Full Name or Organization *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Eleanor Vance / NextGen Global Foundation"
              className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27]"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#005C27]" />
              <span>Official Email Address *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eleanor@nextgenglobal.org"
              className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27]"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#005C27]" />
              <span>Create Account Password *</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27]"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#005C27]" />
              <span>LinkedIn / Official Website URL *</span>
            </label>
            <input
              type="url"
              required
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/eleanorvance"
              className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold mb-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#005C27]" />
                <span>Sponsorship Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SponsorCategory)}
                className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27]"
              >
                <option value="Child Sponsor">Child Sponsor (Direct Grant)</option>
                <option value="Program Sponsor">Program Sponsor (Lab Hardware)</option>
                <option value="Foundation Sponsor">Foundation Sponsor (Annual Partner)</option>
                <option value="Corporate Partner">Corporate Partner (CSR)</option>
                <option value="Strategic Partner">Strategic Partner (Global Alliance)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#F5AB00]" />
                <span>Membership Tier</span>
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as MembershipTier)}
                className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27]"
              >
                <option value="Platinum">Platinum Tier ($5,000+/mo)</option>
                <option value="Gold">Gold Tier ($1,500/mo)</option>
                <option value="Silver">Silver Tier ($500/mo)</option>
                <option value="Bronze">Bronze Tier ($150/mo)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">
              Select Specific Youth Creator to Sponsor (Optional)
            </label>
            <select
              value={selectedTalentId}
              onChange={(e) => setSelectedTalentId(e.target.value)}
              className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27]"
            >
              <option value="">-- General Foundation Fund --</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category}) - Dream: &quot;{p.dream}&quot;
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-extrabold py-3.5 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-xs cursor-pointer mt-4"
          >
            <span>{isSubmitting ? "Submitting Registration..." : "Complete Sponsor Registration"}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        <div className="pt-2 border-t border-[#051836]/10 text-center space-y-2">
          <p className="text-xs text-[#051836]/70">
            Already registered?{" "}
            <Link href="/login" className="text-[#005C27] font-bold hover:underline">
              Sign In Here
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#051836]/50">
            <ShieldCheck className="w-3.5 h-3.5 text-[#005C27]" />
            <span>100% Parent Consent Verification &amp; Vetting Shield</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center text-[#051836]">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
