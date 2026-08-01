"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, AlertCircle, KeyRound } from "lucide-react";

interface AdminMfaModalProps {
  onVerify: (code: string) => boolean;
}

export function AdminMfaModal({ onVerify }: AdminMfaModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const success = onVerify(code);
      if (!success) {
        setError("Invalid security verification code. Try code: 123456");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-wlp-navy/80 backdrop-blur-md flex items-center justify-center p-4 font-inter">
      <div className="bg-wlp-white max-w-md w-full p-8 rounded-2xl shadow-2xl border border-wlp-navy/10 relative">
        <div className="w-14 h-14 rounded-full bg-wlp-coral/10 text-wlp-coral flex items-center justify-center mx-auto mb-4 border border-wlp-coral/20">
          <KeyRound className="w-7 h-7" />
        </div>

        <div className="text-center mb-6">
          <h2 className="font-montserrat text-2xl font-bold text-wlp-navy">
            Admin MFA Verification
          </h2>
          <p className="text-xs text-wlp-navy/60 mt-1">
            Two-factor authentication required for WLP Admin Control Center
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-wlp-navy/80 uppercase tracking-wider mb-2 text-center">
              Enter 6-Digit Authenticator Code
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 bg-wlp-alabaster border border-wlp-navy/15 rounded-lg focus:outline-none focus:border-wlp-coral focus:ring-1 focus:ring-wlp-coral font-bold text-wlp-navy"
            />
            <p className="text-[11px] text-wlp-navy/40 text-center mt-2">
              For testing, enter <span className="font-mono font-bold text-wlp-navy/70">123456</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-wlp-navy hover:bg-black text-wlp-white font-bold py-3 px-4 rounded-lg transition shadow-xs flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-wlp-coral" />
            <span>{loading ? "Verifying..." : "Authenticate Session"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
