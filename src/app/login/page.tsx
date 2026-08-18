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
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FDFCF9] px-4 py-12 bg-foundation-pattern">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl border border-[#051836]/10 text-left">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="mb-4">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <h1 className="font-montserrat text-2xl font-black text-[#051836]">
            Sponsor Sign In
          </h1>
          <p className="font-inter text-xs text-[#051836]/70 mt-1">
            Access your verified PWLIF sponsor hub
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 font-inter">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-inter text-xs">
          <div>
            <label className="block text-xs font-bold text-[#051836] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#051836]/40 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sponsor@organization.org"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] text-[#051836] placeholder:text-[#051836]/40 border border-[#051836]/15 rounded-xl text-sm font-medium focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#051836] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#051836]/40 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] text-[#051836] placeholder:text-[#051836]/40 border border-[#051836]/15 rounded-xl text-sm font-medium focus:outline-none focus:border-[#005C27] focus:ring-1 focus:ring-[#005C27] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-extrabold py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 font-inter mt-2 disabled:opacity-50 cursor-pointer text-xs"
          >
            <span>{submitting ? "Signing In..." : "Sign In to Sponsor Hub"}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#051836]/10 text-center text-xs font-inter text-[#051836]/75 leading-relaxed">
          New to PWLIF?{" "}
          <Link
            href="/book-a-call"
            className="text-[#005C27] font-bold hover:underline"
          >
            Book an Orientation Call
          </Link>{" "}
          — sponsor access is provided after a brief call with our team.
        </div>
      </div>
    </div>
  );
}
