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
          ? "bg-[#FDFCF9]/95 backdrop-blur-md border-b border-[#051836]/10 shadow-md py-1"
          : "bg-[#FDFCF9] border-b border-[#051836]/10 shadow-xs py-1"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link
          href="/"
          aria-label="Potential Without Limits International Foundation"
          className="flex items-center gap-3 hover:opacity-95 transition-opacity"
        >
          <img
            src="/pwlif-logo.png"
            alt="Potential Without Limits International Foundation Logo"
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#051836]/80">
          <Link href="/talents" className="hover:text-[#005C27] transition">
            Sponsor a Dream
          </Link>
          <Link href="/mission-vision" className="hover:text-[#005C27] transition">
            Mission &amp; Vision
          </Link>
          <Link href="/meet-the-team" className="hover:text-[#005C27] transition">
            Meet the Team
          </Link>
          <Link href="/security-standards" className="hover:text-[#005C27] transition">
            Security &amp; Consent
          </Link>
          <Link href="/faq" className="hover:text-[#005C27] transition">
            FAQ
          </Link>
        </div>

        {/* Navigation Action Buttons (Desktop) */}
        <nav aria-label="Global Navigation" className="hidden sm:flex items-center gap-3">
          {userStatus === "admin" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="bg-[#051836] text-white border border-white/20 px-4 sm:px-5 py-2.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider hover:bg-[#042554] transition shadow-xs inline-flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#F5AB00]" />
                <span>Admin Portal</span>
              </Link>
              <button
                onClick={logout}
                aria-label="Log out"
                className="flex items-center gap-1.5 text-xs text-[#051836]/70 hover:text-[#051836] font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#005C27]" />
                <span>Logout</span>
              </button>
            </div>
          ) : userStatus === "approved" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/sponsor/dashboard"
                className="bg-[#005C27] text-white px-4 sm:px-5 py-2.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider hover:bg-[#327B2F] transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-white" />
                <span>My Dashboard</span>
              </Link>
              <button
                onClick={logout}
                aria-label="Log out"
                className="flex items-center gap-1.5 text-xs text-[#051836]/70 hover:text-[#051836] font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#005C27]" />
                <span>Logout</span>
              </button>
            </div>
          ) : userStatus === "pending" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/book-a-call"
                className="flex items-center gap-1.5 text-xs font-inter text-[#005C27] bg-[#005C27]/10 px-3.5 py-2 rounded-xl border border-[#005C27]/30 hover:bg-[#005C27]/20 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Book Vetting Call</span>
              </Link>
              <button
                onClick={logout}
                aria-label="Log out"
                className="flex items-center gap-1.5 text-xs text-[#051836]/70 hover:text-[#051836] font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#005C27]" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/book-a-call"
                className="bg-[#005C27] text-white px-4 sm:px-5 py-2.5 rounded-xl font-inter font-bold text-xs sm:text-sm hover:bg-[#327B2F] transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book Orientation Call</span>
              </Link>
              <Link
                href="/login"
                className="bg-[#051836] text-white border border-[#051836] px-4 sm:px-5 py-2.5 rounded-xl font-inter font-semibold text-xs sm:text-sm hover:bg-[#042554] transition shadow-2xs"
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
            className="p-2 rounded-xl text-[#051836] hover:bg-[#051836]/10 transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-[#FDFCF9]/98 backdrop-blur-2xl border-b border-[#051836]/10 shadow-2xl p-6 space-y-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-4 text-sm font-semibold text-[#051836]">
            <Link
              href="/talents"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#051836]/10 hover:text-[#005C27] transition flex items-center justify-between"
            >
              <span>Sponsor a Dream</span>
              <ArrowRight className="w-4 h-4 text-[#051836]/40" />
            </Link>
            <Link
              href="/mission-vision"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#051836]/10 hover:text-[#005C27] transition flex items-center justify-between"
            >
              <span>Mission &amp; Vision</span>
              <ArrowRight className="w-4 h-4 text-[#051836]/40" />
            </Link>
            <Link
              href="/meet-the-team"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#051836]/10 hover:text-[#005C27] transition flex items-center justify-between"
            >
              <span>Meet the Team</span>
              <ArrowRight className="w-4 h-4 text-[#051836]/40" />
            </Link>
            <Link
              href="/security-standards"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#051836]/10 hover:text-[#005C27] transition flex items-center justify-between"
            >
              <span>Security &amp; Consent</span>
              <ArrowRight className="w-4 h-4 text-[#051836]/40" />
            </Link>
            <Link
              href="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#051836]/10 hover:text-[#005C27] transition flex items-center justify-between"
            >
              <span>FAQ</span>
              <ArrowRight className="w-4 h-4 text-[#051836]/40" />
            </Link>
          </nav>

          <div className="pt-2 space-y-3">
            {userStatus === "approved" ? (
              <div className="space-y-2">
                <Link
                  href="/sponsor/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#005C27] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-xs font-semibold text-[#051836]/70 py-2 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4 text-[#005C27]" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/book-a-call"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#005C27] text-white py-3 px-4 rounded-xl font-bold text-xs text-center shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Orientation Call</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#051836] text-white border border-[#051836] py-3 px-4 rounded-xl font-semibold text-xs text-center"
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
