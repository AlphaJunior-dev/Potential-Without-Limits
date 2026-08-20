"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { WlpLogo } from "./WlpLogo";
import { LogOut, ShieldAlert, LayoutDashboard, Calendar, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { userStatus, logout, branding } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  // Private workspaces use their own navigation; the public header is never
  // rendered inside administrative or approved-sponsor portal routes.
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/sponsor/")) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 font-inter ${
        isScrolled
          ? "bg-[#FCFCFA]/95 backdrop-blur-xl border-b border-[#0B2E6B]/10 shadow-sm"
          : "bg-[#FCFCFA]/92 backdrop-blur-md border-b border-[#0B2E6B]/8"
      }`}
    >
      <div className="max-w-[92rem] mx-auto px-5 sm:px-8 lg:px-10 h-[4.85rem] flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link
          href="/"
          aria-label="Potential Without Limits International Foundation"
          className="flex items-center gap-3 hover:opacity-95 transition-opacity"
        >
          <img
            src="/pwlif-logo.png"
            alt="Potential Without Limits International Foundation Logo"
            className="h-11 sm:h-[3.15rem] w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 text-[10px] font-bold uppercase tracking-[0.13em] text-[#0B2E6B]/72">
          <Link href="/talents" className="hover:text-[#079432] transition-colors">
            Sponsor a Dream
          </Link>
          <Link href="/mission-vision" className="hover:text-[#079432] transition-colors">
            Mission &amp; Vision
          </Link>
          <Link href="/meet-the-team" className="hover:text-[#079432] transition-colors">
            Meet the Team
          </Link>
          <Link href="/security-standards" className="hover:text-[#079432] transition-colors">
            Security &amp; Consent
          </Link>
          <Link href="/faq" className="hover:text-[#079432] transition-colors">
            FAQ
          </Link>
        </div>

        {/* Navigation Action Buttons (Desktop) */}
        <nav aria-label="Global Navigation" className="hidden sm:flex items-center gap-3">
          {userStatus === "admin" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="bg-[#0B2E6B] text-white border border-white/20 px-4 sm:px-5 py-2.5 rounded-full font-montserrat font-bold text-[10px] uppercase tracking-[0.12em] hover:bg-[#082657] transition shadow-xs inline-flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#F7B500]" />
                <span>Admin Portal</span>
              </Link>
              <button
                onClick={logout}
                aria-label="Log out"
                className="flex items-center gap-1.5 text-xs text-[#0B2E6B]/70 hover:text-[#0B2E6B] font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#079432]" />
                <span>Logout</span>
              </button>
            </div>
          ) : userStatus === "approved" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/sponsor/dashboard"
                className="bg-[#079432] text-white px-4 sm:px-5 py-2.5 rounded-full font-montserrat font-bold text-[10px] uppercase tracking-[0.12em] hover:bg-[#14B84A] transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-white" />
                <span>My Dashboard</span>
              </Link>
              <button
                onClick={logout}
                aria-label="Log out"
                className="flex items-center gap-1.5 text-xs text-[#0B2E6B]/70 hover:text-[#0B2E6B] font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#079432]" />
                <span>Logout</span>
              </button>
            </div>
          ) : userStatus === "pending" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/book-a-call"
                className="flex items-center gap-1.5 text-xs font-inter text-[#079432] bg-[#079432]/10 px-3.5 py-2 rounded-xl border border-[#079432]/30 hover:bg-[#079432]/20 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Book Vetting Call</span>
              </Link>
              <button
                onClick={logout}
                aria-label="Log out"
                className="flex items-center gap-1.5 text-xs text-[#0B2E6B]/70 hover:text-[#0B2E6B] font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#079432]" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/book-a-call"
                className="bg-[#079432] text-white px-4 sm:px-5 py-2.5 rounded-full font-inter font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.1em] hover:bg-[#14B84A] transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book Orientation Call</span>
              </Link>
              <Link
                href="/login"
                className="border border-[#0B2E6B]/18 px-4 sm:px-5 py-2.5 rounded-full font-inter font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-[#0B2E6B] hover:bg-[#0B2E6B] hover:text-white transition shadow-2xs"
              >
                Sponsor Login
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-full text-[#0B2E6B] hover:bg-[#0B2E6B]/10 transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[4.85rem] bg-[#FCFCFA]/98 backdrop-blur-2xl border-b border-[#0B2E6B]/10 shadow-2xl p-6 space-y-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-4 text-sm font-semibold text-[#0B2E6B]">
            <Link
              href="/talents"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#0B2E6B]/10 hover:text-[#079432] transition flex items-center justify-between"
            >
              <span>Sponsor a Dream</span>
              <ArrowRight className="w-4 h-4 text-[#0B2E6B]/40" />
            </Link>
            <Link
              href="/mission-vision"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#0B2E6B]/10 hover:text-[#079432] transition flex items-center justify-between"
            >
              <span>Mission &amp; Vision</span>
              <ArrowRight className="w-4 h-4 text-[#0B2E6B]/40" />
            </Link>
            <Link
              href="/meet-the-team"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#0B2E6B]/10 hover:text-[#079432] transition flex items-center justify-between"
            >
              <span>Meet the Team</span>
              <ArrowRight className="w-4 h-4 text-[#0B2E6B]/40" />
            </Link>
            <Link
              href="/security-standards"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#0B2E6B]/10 hover:text-[#079432] transition flex items-center justify-between"
            >
              <span>Security &amp; Consent</span>
              <ArrowRight className="w-4 h-4 text-[#0B2E6B]/40" />
            </Link>
            <Link
              href="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#0B2E6B]/10 hover:text-[#079432] transition flex items-center justify-between"
            >
              <span>FAQ</span>
              <ArrowRight className="w-4 h-4 text-[#0B2E6B]/40" />
            </Link>
          </nav>

          <div className="pt-2 space-y-3">
            {userStatus === "approved" ? (
              <div className="space-y-2">
                <Link
                  href="/sponsor/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#079432] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-xs font-semibold text-[#0B2E6B]/70 py-2 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4 text-[#079432]" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/book-a-call"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#079432] text-white py-3 px-4 rounded-xl font-bold text-xs text-center shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Orientation Call</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#0B2E6B] text-white border border-[#0B2E6B] py-3 px-4 rounded-xl font-semibold text-xs text-center"
                >
                  Sponsor Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
