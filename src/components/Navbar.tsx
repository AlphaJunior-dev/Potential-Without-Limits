"use client";
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { WlpLogo } from "./WlpLogo";
import { LogOut, ShieldAlert, LayoutDashboard, Calendar, Menu, X, ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { userStatus, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);

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

  const publicMenus = [
    { label: "About Us", items: [{ href: "/mission-vision", label: "Mission & Vision" }, { href: "/meet-the-team", label: "Meet the Team" }] },
    { label: "Our Approach", items: [{ href: "/talents", label: "Sponsor Talent" }, { href: "/our-pilot", label: "How It Works" }] },
    { label: "News & Updates", items: [{ href: "/foundation-updates", label: "Foundation Updates" }, { href: "/stories-learning", label: "Stories & Learning" }] },
    { label: "Media & Press", items: [{ href: "/media-gallery", label: "Media Gallery" }, { href: "/press-resources", label: "Press & Resources" }] },
    {
      label: "Get Involved",
      items: userStatus === "approved"
        ? [{ href: "/sponsor/dashboard", label: "Partnership Desk" }, { href: "/partnership", label: "Partner With Us" }, { href: "/volunteer", label: "Volunteer" }]
        : [{ href: "/book-a-call", label: "Book Orientation" }, { href: "/partnership", label: "Partner With Us" }, { href: "/volunteer", label: "Volunteer" }],
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 h-[5.25rem] bg-[#FCFCFA] px-3 py-2 transition-all duration-300 font-inter sm:px-5 ${
        isScrolled
          ? "bg-[#FCFCFA]/55 backdrop-blur-md"
          : "bg-[#FCFCFA]"
      }`}
    >
      <div className={`mx-auto flex h-full max-w-[92rem] items-center justify-between rounded-[1.65rem] border px-5 transition-all duration-300 sm:px-8 lg:px-10 ${isScrolled ? "nav-glass-scrolled" : "border-[#0B2E6B]/8 bg-white shadow-[0_8px_24px_rgba(11,46,107,0.06)]"}`}>
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

        {/* Desktop navigation opens on hover, while retaining click and keyboard controls. */}
        <nav aria-label="Foundation navigation" className="hidden xl:flex items-center gap-4 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#0B2E6B]/90 2xl:gap-5 2xl:text-[11px]">
          <Link href="/" className="whitespace-nowrap hover:text-[#079432] transition-colors">Home</Link>
          {publicMenus.map((menu) => {
            const menuId = `desktop-menu-${menu.label.toLowerCase().replace(/\s+/g, "-")}`;
            const isMenuOpen = activeDesktopMenu === menu.label;

            return (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => setActiveDesktopMenu(menu.label)}
                onMouseLeave={() => setActiveDesktopMenu(null)}
                onFocus={() => setActiveDesktopMenu(menu.label)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setActiveDesktopMenu(null);
                  }
                }}
              >
                <button
                  type="button"
                  aria-expanded={isMenuOpen}
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={() => setActiveDesktopMenu(isMenuOpen ? null : menu.label)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setActiveDesktopMenu(null);
                      event.currentTarget.blur();
                    }
                  }}
                  className="flex cursor-pointer items-center gap-1 whitespace-nowrap hover:text-[#079432] focus-visible:text-[#079432] focus-visible:outline-none"
                >
                  {menu.label}<ChevronDown className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  id={menuId}
                  className={`absolute left-1/2 top-full z-20 w-52 -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-150 ease-out ${
                    isMenuOpen ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-1 opacity-0"
                  }`}
                >
                  <div className="rounded-2xl border border-[#0B2E6B]/10 bg-[#061D45] p-2.5 shadow-[0_18px_46px_rgba(6,29,69,0.22)]">
                    {menu.items.map((item) => <Link key={item.href} href={item.href} onClick={() => setActiveDesktopMenu(null)} className="block rounded-xl px-3 py-2.5 text-[11px] font-bold normal-case tracking-normal text-white/90 transition hover:bg-white/10 hover:text-[#A9F1C3] focus-visible:bg-white/10 focus-visible:text-[#A9F1C3] focus-visible:outline-none">{item.label}</Link>)}
                  </div>
                </div>
              </div>
            );
          })}
          <Link href="/support" className="whitespace-nowrap hover:text-[#079432] transition-colors">Contact</Link>
        </nav>

        {/* Navigation Action Buttons (Desktop) */}
        <nav aria-label="Global Navigation" className="hidden xl:flex items-center gap-3">
          {userStatus === "admin" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="bg-[#0B2E6B] text-white border border-white/20 px-4 sm:px-5 py-2.5 rounded-full font-montserrat font-bold text-[11px] uppercase tracking-[0.1em] hover:bg-[#082657] transition shadow-xs inline-flex items-center gap-2"
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
                className="bg-[#079432] text-white px-4 sm:px-5 py-2.5 rounded-full font-montserrat font-bold text-[11px] uppercase tracking-[0.1em] hover:bg-[#14B84A] transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
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
                className="bg-[#079432] text-white px-4 sm:px-5 py-2.5 rounded-full font-inter font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.08em] hover:bg-[#14B84A] transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book Orientation Call</span>
              </Link>
              <Link
                href="/login"
                className="border border-[#0B2E6B]/18 px-4 sm:px-5 py-2.5 rounded-full font-inter font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.08em] text-[#0B2E6B] hover:bg-[#0B2E6B] hover:text-white transition shadow-2xs"
              >
                Sponsor Login
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 xl:hidden">
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
        <div className="xl:hidden fixed inset-x-0 top-[5.25rem] bg-[#FCFCFA]/98 backdrop-blur-2xl border-b border-[#0B2E6B]/10 shadow-2xl p-6 space-y-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-[#0B2E6B]">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-[#0B2E6B]/10 hover:text-[#079432] transition flex items-center justify-between"><span>Home</span><ArrowRight className="w-4 h-4 text-[#0B2E6B]/40" /></Link>
            {publicMenus.map((menu) => (
              <details key={menu.label} className="border-b border-[#0B2E6B]/10 pb-3">
                <summary className="flex cursor-pointer list-none items-center justify-between py-2 hover:text-[#079432] [&::-webkit-details-marker]:hidden"><span>{menu.label}</span><ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" /></summary>
                <div className="mt-1 space-y-1 border-l-2 border-[#079432]/20 pl-4">
                  {menu.items.map((item) => <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[#0B2E6B]/70 hover:text-[#079432]">{item.label}</Link>)}
                </div>
              </details>
            ))}
            <Link href="/support" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-[#0B2E6B]/10 hover:text-[#079432] transition flex items-center justify-between"><span>Contact</span><ArrowRight className="w-4 h-4 text-[#0B2E6B]/40" /></Link>
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
