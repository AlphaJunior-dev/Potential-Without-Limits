"use client";

/* eslint-disable @next/next/no-img-element -- Reuses the existing project logo file. */
import { useState } from "react";
import Link from "next/link";

const publicLinks = [
  ["Sponsor a Dream", "/orientation"],
  ["Mission & Vision", "/mission-vision"],
  ["Meet the Team", "/partnership"],
  ["Security & Consent", "/privacy"],
  ["FAQ", "/faq"],
] as const;

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#0B2E6B]/10 bg-[#FCFCFA]/95 py-1 font-inter shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Potential Without Limits International Foundation" className="flex items-center gap-3 transition-opacity hover:opacity-95">
          <img src="/pwlif-logo.png" alt="Potential Without Limits International Foundation Logo" className="h-14 w-auto object-contain sm:h-16" />
        </Link>
        <nav className="hidden items-center gap-6 text-xs font-semibold text-[#0B2E6B]/80 lg:flex" aria-label="Primary navigation">
          {publicLinks.map(([label, href]) => <Link key={label} href={href} className="transition hover:text-[#079432]">{label}</Link>)}
        </nav>
        <nav aria-label="Orientation actions" className="hidden items-center gap-3 sm:flex">
          <Link href="/orientation" className="flex items-center gap-1.5 rounded-xl bg-[#079432] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#14B84A] sm:px-5 sm:text-sm"><span aria-hidden="true">▣</span><span>Book Orientation Call</span></Link>
          <Link href="/our-pilot" className="rounded-xl border border-[#0B2E6B] bg-[#0B2E6B] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#082657] sm:px-5 sm:text-sm">Our Pilot</Link>
        </nav>
        <button onClick={() => setIsMobileMenuOpen((open) => !open)} aria-label="Toggle navigation menu" aria-expanded={isMobileMenuOpen} className="rounded-xl p-2 text-[#0B2E6B] transition hover:bg-[#0B2E6B]/10 lg:hidden"><span className="text-2xl leading-none" aria-hidden="true">{isMobileMenuOpen ? "×" : "☰"}</span></button>
      </div>
      {isMobileMenuOpen && <div className="fixed inset-x-0 top-[5.25rem] border-b border-[#0B2E6B]/10 bg-[#FCFCFA]/98 p-6 shadow-2xl backdrop-blur-2xl lg:hidden"><nav className="flex flex-col text-sm font-semibold text-[#0B2E6B]" aria-label="Mobile navigation">{publicLinks.map(([label, href]) => <Link key={label} href={href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between border-b border-[#0B2E6B]/10 py-3 transition hover:text-[#079432]"><span>{label}</span><span aria-hidden="true">→</span></Link>)}</nav><div className="mt-5 grid gap-2"><Link href="/orientation" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl bg-[#079432] px-4 py-3 text-center text-xs font-bold text-white">Book Orientation Call</Link><Link href="/our-pilot" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl bg-[#0B2E6B] px-4 py-3 text-center text-xs font-semibold text-white">Our Pilot</Link></div></div>}
    </header>
  );
}
