"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailAndPassword, signInWithEmailLink, signOut, updatePassword } from "firebase/auth";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { userStatus } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isEmailLink, setIsEmailLink] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

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
      const normalizedEmail = email.trim().toLowerCase();
      if (!password) throw new Error("Enter your password to continue.");
      const credential = isSignInWithEmailLink(auth, window.location.href)
        ? await signInWithEmailLink(auth, normalizedEmail, window.location.href)
        : await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const token = await credential.user.getIdTokenResult(true);
      if (token.claims.sponsor === true) {
        if (isEmailLink) {
          if (password.length < 10) throw new Error("Choose a password with at least 10 characters.");
          if (password !== passwordConfirmation) throw new Error("Your password confirmation does not match.");
          await updatePassword(credential.user, password);
          const freshToken = await credential.user.getIdToken(true);
          await fetch("/api/sponsor", {
            method: "POST",
            headers: { Authorization: `Bearer ${freshToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({ action: "completePasswordSetup" }),
          });
        }
        router.replace("/sponsor/dashboard");
        return;
      }

      await signOut(auth);
      throw new Error("This email address is not approved for sponsor access. Please contact PWLIF after your orientation call.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not complete secure sign-in. Please try again or use a new invitation link.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#061D45] px-5 py-16">
      <div className="pwlif-motion-field" aria-hidden="true" />
      <div className="relative bg-white max-w-md w-full p-8 rounded-[2rem] shadow-2xl border border-white/20 text-left sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="mb-4">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Private PWLIF pathway</p>
          <h1 className="font-montserrat text-3xl font-black tracking-[-0.04em] text-[#0B2E6B]">
            Sponsor Access
          </h1>
          <p className="font-inter text-xs text-[#0B2E6B]/70 mt-1">
            {isEmailLink ? "Verify your invitation, then choose a password for future secure sign-in." : "Sign in to your approved PWLIF sponsor hub."}
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
              Approved Email Address
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

          <div>
            <label className="block text-xs font-bold text-[#0B2E6B] uppercase tracking-wider mb-2">
              {isEmailLink ? "Create Password" : "Password"}
            </label>
            <input
              type="password"
              required
              minLength={isEmailLink ? 10 : 1}
              autoComplete={isEmailLink ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEmailLink ? "At least 10 characters" : "Your password"}
              className="w-full px-4 py-3 bg-[#F8FAFC] text-[#0B2E6B] placeholder:text-[#0B2E6B]/40 border border-[#0B2E6B]/15 rounded-xl text-sm font-medium focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
            />
          </div>

          {isEmailLink && (
            <div>
              <label className="block text-xs font-bold text-[#0B2E6B] uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={10}
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 bg-[#F8FAFC] text-[#0B2E6B] placeholder:text-[#0B2E6B]/40 border border-[#0B2E6B]/15 rounded-xl text-sm font-medium focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#079432] hover:bg-[#14B84A] text-white font-montserrat font-extrabold py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 font-inter mt-2 disabled:opacity-50 cursor-pointer text-xs"
          >
            <span>{submitting ? "Completing Access..." : isEmailLink ? "Set Password & Continue" : "Sign In Securely"}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        {isEmailLink ? (
          <p className="mt-3 text-center text-[11px] text-[#0B2E6B]/60 font-inter">
            This one-time invitation verifies your approved email address. PWLIF never sees or stores the password you choose.
          </p>
        ) : (
          <p className="mt-3 text-center text-[11px] text-[#0B2E6B]/60 font-inter">
            First-time sponsor? Open the secure invitation link sent after your orientation call to set your password.
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
