"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { WlpLogo } from "@/components/WlpLogo";
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const destination = await login(email, password, "admin");
      router.replace(destination === "admin" ? "/admin" : "/admin/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in. Please check admin credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFCFA] px-4 py-12 font-inter text-[#0B2E6B] relative overflow-hidden bg-foundation-pattern">
      <div className="bg-white border border-[#0B2E6B]/10 max-w-md w-full p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="mb-4">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#079432]/10 border border-[#079432]/20 text-[#079432] text-xs font-montserrat font-bold uppercase tracking-wider mb-3">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Foundation Admin Portal</span>
          </div>
          <h1 className="font-montserrat text-2xl font-black text-[#0B2E6B]">
            PWLIF Admin Login
          </h1>
          <p className="font-inter text-xs text-[#0B2E6B]/60 mt-1">
            Authorized foundation administrator access only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-inter">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-inter">
          <div>
            <label className="block text-xs font-bold text-[#0B2E6B] uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#0B2E6B]/40 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wlp.org"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-sm text-[#0B2E6B] placeholder-[#0B2E6B]/40 focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2E6B] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#0B2E6B]/40 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-sm text-[#0B2E6B] placeholder-[#0B2E6B]/40 focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-bold py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-xs cursor-pointer mt-2 disabled:opacity-50"
          >
            <span>{submitting ? "Authenticating..." : "Access Admin Portal"}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#0B2E6B]/10 flex items-center justify-between text-xs text-[#0B2E6B]/60 font-inter">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#079432]" />
            <span>MFA Protected Portal</span>
          </div>
          <Link href="/login" className="text-[#079432] font-bold hover:underline">
            Sponsor Login
          </Link>
        </div>
      </div>
    </div>
  );
}
