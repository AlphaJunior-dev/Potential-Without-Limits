import Link from "next/link";
import { ArrowUpRight, FileText, Mail, ShieldCheck } from "lucide-react";
import { EditorialSplit, PublicCtaBand, PublicHero, SectionHeading } from "@/components/PublicStory";
import { readPublicSite } from "@/lib/admin";

export default async function PressResourcesPage() {
  const site = await readPublicSite();
  const editorial = site.editorialPages.mediaPress;
  const hasPublishedEditorial = editorial.status === "published" && Boolean(editorial.title || editorial.introduction || editorial.body);
  return (
    <main className="overflow-x-hidden bg-[#FCFCFA] text-[#0B2E6B]">
      <PublicHero
        eyebrow="Press & resources"
        title={hasPublishedEditorial && editorial.title ? editorial.title : "Accurate context for responsible coverage."}
        intro={hasPublishedEditorial && editorial.introduction ? editorial.introduction : "PWLIF provides public information that helps partners, journalists, and community stakeholders understand the foundation without compromising privacy or overstating its work."}
        primaryAction={{ href: "/support", label: "Make an Enquiry" }}
        secondaryAction={{ href: "/mission-vision", label: "About PWLIF" }}
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0B2E6B] p-8 text-white shadow-2xl"><div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#0A8CF5]/55" /><div className="relative"><FileText className="h-9 w-9 text-[#F7B500]" /><p className="mt-16 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A9F1C3]">Public information</p><p className="mt-3 font-montserrat text-2xl font-black leading-tight">Clear about what PWLIF can share—and what it must protect.</p></div></div>
      </PublicHero>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="mx-auto max-w-7xl"><EditorialSplit number="01" eyebrow="Foundation overview" title="A starting point for accurate context." aside={<div className="relative z-10 flex h-full min-h-[300px] flex-col justify-end p-8 text-white"><ShieldCheck className="h-10 w-10 text-[#A9F1C3]" /><p className="mt-10 font-montserrat text-3xl font-black">Public information is always limited by safeguarding responsibilities.</p></div>}><p>PWLIF is a foundation focused on careful talent development, learning, mentorship, and appropriate connection. Deeper Sponsor Talent information is considered privately through orientation, rather than published as a public catalogue.</p><Link href="/mission-vision" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#079432] hover:text-[#14B84A]">Read Mission & Vision <ArrowUpRight className="h-4 w-4" /></Link></EditorialSplit></div></section>

      <section className="bg-[#F2F8F4] px-5 py-20 sm:px-8 sm:py-24 lg:px-10"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Available materials" title={hasPublishedEditorial ? editorial.title || "Media & press" : "No press pack or published resources are available yet."} intro={hasPublishedEditorial ? editorial.introduction || "" : "Official resource documents, approved statements, and media materials will be added here once PWLIF has reviewed them for public release."} />{hasPublishedEditorial && editorial.body && <div className="mt-10 max-w-4xl rounded-[1.7rem] border border-[#0B2E6B]/10 bg-white p-7 sm:p-9"><p className="whitespace-pre-wrap text-sm leading-8 text-[#0B2E6B]/72">{editorial.body}</p></div>}<div className="mt-10 rounded-[1.7rem] border border-[#0B2E6B]/10 bg-white p-7 sm:p-9"><div className="flex gap-4"><Mail className="h-7 w-7 shrink-0 text-[#079432]" /><div><h2 className="font-montserrat text-2xl font-black">Need to contact PWLIF?</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-[#0B2E6B]/70">Use the support enquiry route to request appropriate context. PWLIF will respond through its review process and will not provide private Talent records through public channels.</p><Link href="/support" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#079432] hover:text-[#14B84A]">Contact PWLIF <ArrowUpRight className="h-4 w-4" /></Link></div></div></div></div></section>

      <PublicCtaBand eyebrow="Respectful coverage" title="Start with the right context." intro="PWLIF welcomes responsible enquiries that respect its privacy, consent, and safeguarding commitments." action={{ href: "/support", label: "Make an Enquiry" }} />
    </main>
  );
}
