"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Headset, HelpCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PublicHero } from "@/components/PublicStory";

const categories = ["All", "Security & Privacy", "Sponsors", "Child Protection", "General"];

export default function FaqPage() {
  const { faqItems } = useAuth();
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredItems = faqItems.filter((item) => selectedCategory === "All" || item.category === selectedCategory);
  useEffect(() => setOpenId(filteredItems[0]?.id || null), [selectedCategory, faqItems.length]);

  return <div className="bg-[#FCFCFA]">
    <PublicHero dark eyebrow="Foundation guidance" title="Questions deserve clear, careful answers." intro="Find guidance on PWLIF’s privacy-first Sponsor Talent process, orientation pathway, and responsible foundation practice." primaryAction={{ href: "/book-a-call", label: "Book Sponsor Orientation" }} />
    <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10"><div className="mx-auto max-w-5xl"><div className="flex gap-2 overflow-x-auto pb-2">{categories.map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={`shrink-0 rounded-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] transition ${selectedCategory === category ? "bg-[#0B2E6B] text-white" : "border border-[#0B2E6B]/12 bg-white text-[#0B2E6B]/68 hover:border-[#079432] hover:text-[#079432]"}`}>{category}</button>)}</div><div className="mt-10 divide-y divide-[#0B2E6B]/10 rounded-[1.75rem] border border-[#0B2E6B]/10 bg-white px-6 shadow-[0_16px_44px_rgba(11,46,107,0.08)] sm:px-9">{filteredItems.map((item, index) => { const isOpen = openId === item.id; return <article key={item.id}><button onClick={() => setOpenId(isOpen ? null : item.id)} className="flex w-full items-center gap-5 py-6 text-left"><span className="font-montserrat text-2xl font-black text-[#14B84A]">{String(index + 1).padStart(2, "0")}</span><span className="flex-1 font-montserrat text-lg font-bold leading-snug text-[#0B2E6B] sm:text-xl">{item.question}</span><ChevronDown className={`h-5 w-5 shrink-0 text-[#079432] transition ${isOpen ? "rotate-180" : ""}`} /></button>{isOpen && <div className="pb-7 pl-12 pr-2 sm:pl-14"><p className="text-sm leading-7 text-[#0B2E6B]/70">{item.answer}</p><div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#079432]"><ShieldCheck className="h-4 w-4" />{item.category || "PWLIF guidance"}</div></div>}</article>; })}{filteredItems.length === 0 && <div className="p-10 text-center text-sm text-[#0B2E6B]/65">No questions are currently published in this category.</div>}</div><div className="mt-10 grid gap-5 rounded-[1.75rem] bg-[#EAF7EF] p-7 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#079432]">Need more context?</p><h2 className="mt-3 font-montserrat text-2xl font-black tracking-[-0.035em] text-[#0B2E6B]">Start with a conversation.</h2><p className="mt-2 text-sm leading-6 text-[#0B2E6B]/65">For a specific question, PWLIF can guide you through the appropriate private route.</p></div><div className="flex flex-wrap gap-3"><Link href="/support" className="inline-flex items-center gap-2 rounded-full border border-[#0B2E6B]/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0B2E6B] hover:border-[#079432] hover:text-[#079432]"><Headset className="h-4 w-4" />Support</Link><Link href="/book-a-call" className="rounded-full bg-[#079432] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[#14B84A]">Orientation</Link></div></div></div></section>
  </div>;
}
