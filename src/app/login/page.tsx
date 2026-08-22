"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, userStatus } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      router.replace(`/sponsor/setup${window.location.search}`);
      return;
    }
    if (userStatus === "approved") router.replace("/sponsor/dashboard");
    if (userStatus === "admin") router.replace("/admin");
  }, [router, userStatus]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const destination = await login(email, password, "sponsor");
      router.replace(destination === "admin" ? "/admin" : "/sponsor/dashboard");
    } catch (loginError: unknown) {
      setError(loginError instanceof Error ? loginError.message : "Could not sign in. Check your email address and password, then try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#061D45] px-5 py-16"><div className="pwlif-motion-field" aria-hidden="true" /><div className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-white p-8 text-left shadow-2xl sm:p-10"><div className="mb-8 flex flex-col items-center text-center"><Link href="/" className="mb-4"><img src="/pwlif-logo.png" alt="Potential Without Limits International Foundation" className="h-16 w-auto object-contain" /></Link><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#079432]">Private PWLIF pathway</p><h1 className="font-montserrat text-3xl font-black tracking-[-0.04em] text-[#0B2E6B]">Sponsor Login</h1><p className="mt-1 font-inter text-xs text-[#0B2E6B]/70">Sign in with the email address and password you created through your approved invitation.</p></div>{error && <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-inter text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}<form onSubmit={handleSubmit} className="space-y-5 font-inter text-xs"><label className="block text-xs font-bold uppercase tracking-wider text-[#0B2E6B]">Email address<div className="relative mt-2"><Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#0B2E6B]/40" /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="sponsor@organization.org" className="w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] py-3 pl-10 pr-4 text-sm font-medium text-[#0B2E6B] placeholder:text-[#0B2E6B]/40 focus:border-[#079432] focus:outline-none focus:ring-1 focus:ring-[#079432]" /></div></label><label className="block text-xs font-bold uppercase tracking-wider text-[#0B2E6B]">Password<div className="relative mt-2"><LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-[#0B2E6B]/40" /><input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className="w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] py-3 pl-10 pr-4 text-sm font-medium text-[#0B2E6B] placeholder:text-[#0B2E6B]/40 focus:border-[#079432] focus:outline-none focus:ring-1 focus:ring-[#079432]" /></div></label><button type="submit" disabled={submitting} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#079432] px-4 py-3.5 font-montserrat text-xs font-extrabold text-white shadow-lg transition hover:bg-[#14B84A] disabled:cursor-not-allowed disabled:opacity-50"><span>{submitting ? "Signing in…" : "Sign in securely"}</span><ArrowRight className="h-4 w-4" /></button></form><p className="mt-5 text-center text-[11px] font-inter text-[#0B2E6B]/60">First time here? Use the one-time invitation link sent after orientation approval to create your password.</p><div className="mt-8 border-t border-[#0B2E6B]/10 pt-6 text-center text-xs font-inter text-[#0B2E6B]/75">Need access? Your organization must first receive a current PWLIF Sponsor invitation after orientation approval.</div><div className="mt-4 border-t border-[#0B2E6B]/10 pt-6 text-center text-xs font-inter text-[#0B2E6B]/75">New to PWLIF? <Link href="/book-a-call" className="font-bold text-[#079432] hover:underline">Book an Orientation Call</Link></div></div></div>;
}
