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
  const [email, setEmail] = useState("admin@wlp.org");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in. Please check admin credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A1128] px-4 py-12 font-inter text-[#FAFAFA] relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#F28482_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="bg-[#0A1128] border border-[#FAFAFA]/10 max-w-md w-full p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="mb-4">
            <WlpLogo showText={false} className="h-12 w-auto" />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F28482]/10 border border-[#F28482]/20 text-[#F28482] text-xs font-montserrat font-bold uppercase tracking-wider mb-3">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Admin Management System</span>
          </div>
          <h1 className="font-montserrat text-2xl font-bold text-[#FAFAFA]">
            WLP Admin Login
          </h1>
          <p className="font-inter text-xs text-[#FAFAFA]/60 mt-1">
            Authorized administrator access only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-200 font-inter">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-inter">
          <div>
            <label className="block text-xs font-semibold text-[#FAFAFA]/70 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#FAFAFA]/40 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wlp.org"
                className="w-full pl-10 pr-4 py-3 bg-[#FAFAFA]/5 border border-[#FAFAFA]/10 rounded-lg text-sm text-[#FAFAFA] placeholder-[#FAFAFA]/30 focus:outline-none focus:border-[#F28482] focus:ring-1 focus:ring-[#F28482] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#FAFAFA]/70 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#FAFAFA]/40 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#FAFAFA]/5 border border-[#FAFAFA]/10 rounded-lg text-sm text-[#FAFAFA] placeholder-[#FAFAFA]/30 focus:outline-none focus:border-[#F28482] focus:ring-1 focus:ring-[#F28482] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#F28482] text-white font-medium py-3 px-4 rounded-lg hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 font-inter mt-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{submitting ? "Authenticating..." : "Access Admin Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#FAFAFA]/10 flex items-center justify-between text-xs text-[#FAFAFA]/50 font-inter">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#F28482]" />
            <span>Secure Admin Protocol</span>
          </div>
          <Link href="/login" className="text-[#FAFAFA]/70 hover:text-white underline">
            Sponsor Login
          </Link>
        </div>
      </div>
    </div>
  );
}
