"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailLink, signOut } from "firebase/auth";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { userStatus } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isEmailLink, setIsEmailLink] = useState(false);

  useEffect(() => {
    if (userStatus === "approved") router.replace("/sponsor/dashboard");
    if (userStatus === "admin") router.replace("/admin");
  }, [router, userStatus]);

  useEffect(() => {
    setIsEmailLink(isSignInWithEmailLink(auth, window.location.href));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        throw new Error("Use the secure sign-in link sent to your approved sponsor email address.");
      }

      const credential = await signInWithEmailLink(auth, email.trim().toLowerCase(), window.location.href);
      const token = await credential.user.getIdTokenResult(true);
      if (token.claims.sponsor === true) {
        router.replace("/sponsor/dashboard");
        return;
      }

      await signOut(auth);
      throw new Error("This email address is not approved for sponsor access. Please contact PWLIF after your orientation call.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not complete secure sign-in. Please use the invitation link sent to your approved email address.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FCFCFA] px-4 py-12 bg-foundation-pattern">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl border border-[#0B2E6B]/10 text-left">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="mb-4">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <h1 className="font-montserrat text-2xl font-black text-[#0B2E6B]">
            Sponsor Access
          </h1>
          <p className="font-inter text-xs text-[#0B2E6B]/70 mt-1">
            Access your approved PWLIF sponsor hub through a secure email link
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
            <label className="block text-xs font-bold text-[#0B2E6B] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#0B2E6B]/40 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sponsor@organization.org"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] text-[#0B2E6B] placeholder:text-[#0B2E6B]/40 border border-[#0B2E6B]/15 rounded-xl text-sm font-medium focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !isEmailLink}
            className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-extrabold py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 font-inter mt-2 disabled:opacity-50 cursor-pointer text-xs"
          >
            <span>{submitting ? "Completing Access..." : "Complete Secure Sign-In"}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        {!isEmailLink && (
          <p className="mt-3 text-center text-[11px] text-[#0B2E6B]/60 font-inter">
            Open the invitation link sent to your approved email address, then enter that same address here to complete sign-in.
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-[#0B2E6B]/10 text-center text-xs font-inter text-[#0B2E6B]/75 leading-relaxed">
          New to PWLIF?{" "}
          <Link
            href="/book-a-call"
            className="text-[#079432] font-bold hover:underline"
          >
            Book an Orientation Call
          </Link>{" "}
          — sponsor access is provided after a brief call with our team.
        </div>
      </div>
    </div>
  );
}
