"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Mail } from "lucide-react";
import { auth } from "@/lib/firebase";
import { confirmPasswordReset, signInWithEmailAndPassword, signOut, verifyPasswordResetCode } from "firebase/auth";

export default function SponsorSetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validLink, setValidLink] = useState<boolean | null>(null);

  useEffect(() => {
    const invitationUrl = new URL(window.location.href);
    const actionCode = invitationUrl.searchParams.get("oobCode");
    const hasInvitationAction = invitationUrl.searchParams.get("mode") === "resetPassword" && Boolean(actionCode);
    if (!hasInvitationAction || !actionCode) {
      setValidLink(false);
      return;
    }
    void verifyPasswordResetCode(auth, actionCode)
      .then((approvedEmail) => {
        setEmail(approvedEmail);
        setValidLink(true);
      })
      .catch(() => setValidLink(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const invitationUrl = new URL(window.location.href);
      const actionCode = invitationUrl.searchParams.get("oobCode");
      if (invitationUrl.searchParams.get("mode") !== "resetPassword" || !actionCode || !validLink) throw new Error("This invitation link is invalid or has expired. Ask the foundation to resend it.");
      const normalizedEmail = email.trim().toLowerCase();
      if (password.length < 10) throw new Error("Choose a password with at least 10 characters.");
      if (password !== passwordConfirmation) throw new Error("Your password confirmation does not match.");

      await confirmPasswordReset(auth, actionCode, password);
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const token = await credential.user.getIdTokenResult(true);
      if (token.claims.sponsor !== true) {
        await signOut(auth);
        throw new Error("This email address is not approved for sponsor access. Please contact PWLIF after your orientation call.");
      }

      const freshToken = await credential.user.getIdToken(true);
      const completion = await fetch("/api/sponsor", {
        method: "POST",
        headers: { Authorization: `Bearer ${freshToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "completePasswordSetup" }),
      });
      if (!completion.ok) throw new Error("Your password was set, but the sponsor setup record could not be completed. Please contact PWLIF.");
      router.replace("/sponsor/dashboard");
    } catch (setupError: unknown) {
      setError(setupError instanceof Error ? setupError.message : "Could not complete secure sponsor setup. Please try again or use a new invitation link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#061D45] px-5 py-16">
      <div className="pwlif-motion-field" aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-white p-8 text-left shadow-2xl sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-4"><img src="/pwlif-logo.png" alt="Potential Without Limits International Foundation" className="h-16 w-auto object-contain" /></Link>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">One-time sponsor invitation</p>
          <h1 className="font-montserrat text-3xl font-black tracking-[-0.04em] text-[#0B2E6B]">Create your password</h1>
          <p className="mt-1 font-inter text-xs text-[#0B2E6B]/70">Your approved email address is verified by this invitation. Choose the password you will use to sign in.</p>
        </div>

        {error && <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-inter text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}

        {validLink === null && <div className="rounded-xl border border-[#0B2E6B]/10 bg-[#F8FAFC] px-4 py-5 text-center text-xs font-inter text-[#0B2E6B]/65">Checking your invitation link…</div>}
        {validLink === false && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-xs font-inter text-red-700"><p>This password setup page is available only from a current PWLIF invitation link.</p><p className="mt-2">Ask PWLIF to resend your invitation if your link has expired.</p><Link href="/login" className="mt-4 inline-flex font-bold text-[#079432] hover:underline">Go to Sponsor Login</Link></div>}
        {validLink === true && <>
          <form onSubmit={handleSubmit} className="space-y-5 font-inter text-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2E6B]">Approved email address<div className="relative mt-2"><Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#0B2E6B]/40" /><input type="email" required readOnly value={email} placeholder="sponsor@organization.org" className="w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] py-3 pl-10 pr-4 text-sm font-medium text-[#0B2E6B] placeholder:text-[#0B2E6B]/40 focus:border-[#079432] focus:outline-none focus:ring-1 focus:ring-[#079432]" /></div></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2E6B]">Create password<input type="password" required minLength={10} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 10 characters" className="mt-2 w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#0B2E6B] placeholder:text-[#0B2E6B]/40 focus:border-[#079432] focus:outline-none focus:ring-1 focus:ring-[#079432]" /></label>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2E6B]">Confirm password<input type="password" required minLength={10} autoComplete="new-password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Re-enter your password" className="mt-2 w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#0B2E6B] placeholder:text-[#0B2E6B]/40 focus:border-[#079432] focus:outline-none focus:ring-1 focus:ring-[#079432]" /></label>
            <button type="submit" disabled={submitting} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#079432] px-4 py-3.5 font-montserrat text-xs font-extrabold text-white shadow-lg transition hover:bg-[#14B84A] disabled:cursor-not-allowed disabled:opacity-50"><span>{submitting ? "Completing setup…" : "Set password & continue"}</span><ArrowRight className="h-4 w-4" /></button>
          </form>
          <p className="mt-3 text-center text-[11px] font-inter text-[#0B2E6B]/60">This link can be used only for your first password setup. PWLIF never sees or stores the password you choose.</p>
        </>}
        <p className="mt-7 border-t border-[#0B2E6B]/10 pt-6 text-center text-xs font-inter text-[#0B2E6B]/75">Already created a password? <Link href="/login" className="font-bold text-[#079432] hover:underline">Sponsor Login</Link></p>
      </div>
    </div>
  );
}
