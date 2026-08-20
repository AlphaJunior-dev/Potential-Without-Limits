"use client";

import React, { useState } from "react";
import { X, Send, ShieldCheck, Mail, CheckCircle2 } from "lucide-react";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Child Sponsorship & Grants",
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({ name: "", email: "", subject: "Child Sponsorship & Grants", message: "" });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2E6B]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#0B2E6B]/10 overflow-hidden font-inter">
        {/* Header */}
        <div className="bg-[#0B2E6B] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#079432]/20 border border-[#079432]/30">
              <Mail className="w-5 h-5 text-[#079432]" />
            </div>
            <div>
              <h3 className="font-montserrat text-lg font-bold text-white">Contact PWLIF Concierge</h3>
              <p className="text-xs text-white/70">Foundation Office &amp; Sponsor Support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 text-xs text-[#0B2E6B]">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 text-[#079432] mb-2 border border-[#079432]/20">
                <CheckCircle2 className="w-8 h-8 text-[#079432]" />
              </div>
              <h4 className="font-montserrat font-bold text-xl text-[#0B2E6B]">Inquiry Received</h4>
              <p className="text-xs text-[#0B2E6B]/70 max-w-xs mx-auto leading-relaxed">
                Thank you for contacting our foundation desk. A representative will respond to your email within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B2E6B]/80 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Mwangi"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-lg text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2E6B]/80 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.org"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-lg text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2E6B]/80 mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-lg text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition font-medium"
                >
                  <option value="Child Sponsorship & Grants">Child Sponsorship &amp; Grants</option>
                  <option value="Parental Consent Verification">Parental Consent Verification</option>
                  <option value="Sponsor Orientation">Sponsor Orientation Request</option>
                  <option value="General Foundation Inquiry">General Foundation Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2E6B]/80 mb-1">How can we assist you?</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide details regarding your inquiry..."
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-lg text-sm text-[#0B2E6B] focus:outline-none focus:border-[#079432] focus:ring-1 focus:ring-[#079432] transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#0B2E6B]/50 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#079432]" /> Protected by PWLIF Safety Protocol
                </span>
                <button
                  type="submit"
                  className="bg-[#079432] hover:bg-[#14B84A] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
