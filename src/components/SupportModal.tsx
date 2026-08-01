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
    subject: "General Inquiry",
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wlp-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-wlp-white rounded-2xl shadow-2xl border border-wlp-navy/10 overflow-hidden font-inter">
        {/* Header */}
        <div className="bg-wlp-navy px-6 py-5 text-wlp-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-wlp-coral/20 border border-wlp-coral/30">
              <Mail className="w-5 h-5 text-wlp-coral" />
            </div>
            <div>
              <h3 className="font-montserrat text-lg font-bold text-wlp-white">Contact WLP Concierge</h3>
              <p className="text-xs text-wlp-alabaster/70">Admissions & Sponsor Relations Support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-wlp-alabaster/60 hover:text-wlp-white p-1 rounded-lg hover:bg-wlp-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-montserrat font-bold text-xl text-wlp-navy">Inquiry Received</h4>
              <p className="text-sm text-wlp-navy/70 max-w-xs mx-auto">
                Thank you for contacting our concierge team. A representative will respond to your corporate email within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-wlp-navy/80 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3.5 py-2.5 bg-wlp-alabaster border border-wlp-navy/15 rounded-lg text-sm focus:outline-none focus:border-wlp-coral focus:ring-1 focus:ring-wlp-coral transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-wlp-navy/80 mb-1">Corporate / Institutional Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. eleanor@impactfund.com"
                  className="w-full px-3.5 py-2.5 bg-wlp-alabaster border border-wlp-navy/15 rounded-lg text-sm focus:outline-none focus:border-wlp-coral focus:ring-1 focus:ring-wlp-coral transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-wlp-navy/80 mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-wlp-alabaster border border-wlp-navy/15 rounded-lg text-sm focus:outline-none focus:border-wlp-coral focus:ring-1 focus:ring-wlp-coral transition"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Sponsorship & Grants">Sponsorship & Grants</option>
                  <option value="Admissions & Vetting">Admissions & Vetting Process</option>
                  <option value="Technical Support">Technical & Account Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-wlp-navy/80 mb-1">How can we assist you?</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide details regarding your inquiry..."
                  className="w-full px-3.5 py-2.5 bg-wlp-alabaster border border-wlp-navy/15 rounded-lg text-sm focus:outline-none focus:border-wlp-coral focus:ring-1 focus:ring-wlp-coral transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-wlp-navy/50 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Protected by WLP Shield
                </span>
                <button
                  type="submit"
                  className="bg-wlp-coral text-wlp-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-105 transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
