"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { WlpLogo } from "@/components/WlpLogo";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, pendingSponsors } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      
      // Check user role/status
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin");
        return;
      }

      const match = pendingSponsors.find((s) => s.email.toLowerCase() === email.toLowerCase());
      if (match) {
        if (match.status === "approved") {
          router.push("/");
        } else if (match.status === "pending") {
          router.push("/pending");
        } else {
          setError("Your sponsor application was rejected. Please contact support.");
        }
      } else {
        router.push("/pending");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-wlp-alabaster px-4 py-12">
      <div className="bg-wlp-white max-w-md w-full p-8 rounded-2xl shadow-xs border border-wlp-navy/5">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="mb-4">
            <WlpLogo showText={false} className="h-12 w-auto" dark={false} />
          </Link>
          <h1 className="font-montserrat text-2xl font-bold text-wlp-navy">
            Sponsor Sign In
          </h1>
          <p className="font-inter text-sm text-wlp-navy/70 mt-1">
            Access your verified sponsor portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 font-inter">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-inter">
          <div>
            <label className="block text-xs font-semibold text-[#0A1128]/80 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#0A1128]/40 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-3 bg-white text-[#0A1128] placeholder:text-[#0A1128]/40 border border-[#0A1128]/20 rounded-xl text-sm font-medium focus:outline-none focus:border-[#F28482] focus:ring-1 focus:ring-[#F28482] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0A1128]/80 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#0A1128]/40 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white text-[#0A1128] placeholder:text-[#0A1128]/40 border border-[#0A1128]/20 rounded-xl text-sm font-medium focus:outline-none focus:border-[#F28482] focus:ring-1 focus:ring-[#F28482] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#F28482] text-white font-bold py-3.5 px-4 rounded-xl hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2 font-inter mt-2 disabled:opacity-50 cursor-pointer text-sm"
          >
            <span>{submitting ? "Signing In..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-wlp-navy/5 text-center text-xs font-inter text-wlp-navy/70">
          <span>Don&apos;t have a sponsor account? </span>
          <Link
            href="/register"
            className="text-wlp-coral font-semibold hover:underline"
          >
            Apply as a Sponsor
          </Link>
        </div>
      </div>
    </div>
  );
}
