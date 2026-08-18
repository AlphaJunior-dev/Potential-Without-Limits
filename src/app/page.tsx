import Link from "next/link";
import { readPublicSite } from "@/lib/admin";

export const dynamic = "force-dynamic";

const pilotFacts = [
  ["Early stage", "Rwanda pilot"],
  ["Six", "children in the initial pilot"],
  ["Community", "informed planning"],
] as const;

export default async function HomePage() {
  const site = await readPublicSite();

  return (
    <div className="min-h-screen overflow-x-hidden bg-foundation-pattern">
      <section className="relative border-b border-[#051836]/10 px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 text-left lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#005C27]/30 bg-[#005C27]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#005C27]"><span aria-hidden="true" className="text-sm text-[#F5AB00]">✦</span><span>Potential Without Limits International Foundation (PWLIF)</span></div>
            <h1 className="font-montserrat text-4xl font-black leading-[1.08] tracking-tight text-[#051836] sm:text-6xl">{site.heroTitle}</h1>
            <p className="text-base font-normal leading-relaxed text-[#051836]/80 sm:text-lg">{site.heroText}</p>
            <div className="flex flex-col items-stretch gap-4 pt-2 sm:flex-row sm:items-center">
              <Link href="/orientation" className="group flex items-center justify-center gap-2 rounded-2xl bg-[#005C27] px-8 py-4 font-montserrat text-sm font-extrabold text-white shadow-lg transition hover:bg-[#327B2F]"><span aria-hidden="true" className="text-lg text-[#F5AB00]">♥</span><span>Request Orientation</span><span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></Link>
              <Link href="/our-pilot" className="group flex items-center justify-center gap-2 rounded-2xl bg-[#051836] px-8 py-4 font-montserrat text-sm font-bold text-white shadow-lg transition hover:bg-[#042554]"><span>Explore the Pilot</span><span aria-hidden="true" className="text-[#F5AB00] transition-transform group-hover:translate-x-1">→</span></Link>
            </div>
            <div className="grid grid-cols-3 divide-x divide-[#051836]/10 border-t border-[#051836]/10 pt-6">
              {pilotFacts.map(([value, label], index) => <div key={label} className="px-3 first:pl-0"><p className={`font-montserrat text-2xl font-black ${index === 0 ? "text-[#005C27]" : index === 1 ? "text-[#051836]" : "text-[#F5AB00]"}`}>{value}</p><p className="mt-1 text-[10px] font-medium leading-4 text-[#051836]/55 sm:text-xs">{label}</p></div>)}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative h-[23rem] overflow-hidden rounded-3xl border border-[#051836]/10 bg-[#051836] shadow-2xl sm:h-[25rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(245,171,0,.42),transparent_22%),radial-gradient(circle_at_20%_100%,rgba(0,92,39,.75),transparent_42%),linear-gradient(135deg,#051836,#042554)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051836] via-transparent to-transparent" />
              <div className="absolute inset-0 grid place-items-center"><div className="grid h-20 w-20 place-items-center rounded-full bg-[#005C27] text-2xl text-white shadow-2xl">▶</div></div>
              <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl border border-white/10 bg-[#051836]/90 p-4 backdrop-blur-md"><div><span className="text-[10px] font-bold uppercase tracking-wider text-[#F5AB00]">Foundation story · in preparation</span><h2 className="mt-1 font-montserrat text-base font-bold text-white">Potential Without Limits Foundation Introduction</h2></div><span className="rounded-xl bg-[#005C27] px-3 py-1.5 text-xs font-bold text-white">Coming soon</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#051836]/10 bg-[#FDFCF9] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center"><span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">Humanitarian spotlight</span><h2 className="mt-3 font-montserrat text-3xl font-black text-[#051836] sm:text-4xl">Foundation Introduction &amp; Impact</h2><p className="mt-3 text-sm text-[#051836]/70">A public introduction will share the foundation’s purpose when it is ready.</p></div>
          <div className="relative mt-10 aspect-video overflow-hidden rounded-3xl border border-[#051836]/10 bg-[#051836] shadow-2xl"><div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(245,171,0,.35),transparent_20%),radial-gradient(circle_at_20%_90%,rgba(0,92,39,.8),transparent_42%),linear-gradient(135deg,#051836,#042554)]" /><div className="absolute inset-0 grid place-items-center"><div className="grid h-20 w-20 place-items-center rounded-full bg-[#005C27] text-2xl text-white shadow-2xl">▶</div></div><div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl border border-white/10 bg-[#051836]/90 p-4 backdrop-blur-md"><div><span className="text-[10px] font-bold uppercase tracking-wider text-[#F5AB00]">Foundation intro · in preparation</span><h3 className="mt-1 font-montserrat text-base font-bold text-white">Potential Without Limits International Foundation</h3></div><span className="rounded-xl bg-[#005C27] px-3 py-1.5 text-xs font-bold text-white">Coming soon</span></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="space-y-2"><span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#005C27]"><span aria-hidden="true" className="text-[#F5AB00]">♥</span> Direct partnership orientation</span><h2 className="font-montserrat text-3xl font-black text-[#051836] sm:text-4xl">Sponsor a Dream</h2><p className="max-w-2xl text-xs text-[#051836]/70 sm:text-sm">Detailed individual information is intentionally private. Begin with orientation to learn whether the Rwanda pilot is a fit.</p></div><Link href="/orientation" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#051836]/15 bg-white px-4 py-2 text-xs font-bold text-[#051836] transition hover:bg-[#005C27]/10">Book orientation <span aria-hidden="true">→</span></Link></div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[["Community-informed", "Partnership starts with listening", "Orientation conversations establish respectful context before any next step."], ["Consent-centred", "Privacy is protected", "No names, photos, schools, or individual biographies are made public."], ["Pilot-focused", "A careful Rwanda beginning", "The early-stage pilot is intentionally small and developed with care."]].map(([category, title, description], index) => <article key={category} className="overflow-hidden rounded-3xl border border-[#051836]/10 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"><div className={`relative aspect-video ${index === 0 ? "bg-[linear-gradient(135deg,#051836,#005C27)]" : index === 1 ? "bg-[linear-gradient(135deg,#042554,#327B2F)]" : "bg-[linear-gradient(135deg,#005C27,#051836)]"}`}><div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(245,171,0,.45),transparent_22%)]" /><span className="absolute left-3 top-3 rounded-full bg-[#005C27] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{category}</span><span className="absolute bottom-3 left-3 text-xs font-bold text-white/90">Rwanda pilot · private details</span></div><div className="p-6"><h3 className="font-montserrat text-xl font-black text-[#051836]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#051836]/70">{description}</p><Link href="/orientation" className="mt-6 inline-flex text-sm font-bold text-[#005C27] transition hover:text-[#327B2F]">Request orientation →</Link></div></article>)}
        </div>
      </section>

      <section className="bg-[#051836] px-4 py-16 text-white sm:px-6 md:py-24 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-3xl text-center"><span className="text-xs font-bold uppercase tracking-wider text-[#F5AB00]">Transformational pathway</span><h2 className="mt-3 font-montserrat text-3xl font-black sm:text-4xl">From Potential to Purpose</h2><p className="mt-3 text-sm text-white/70">The foundation is approaching its first pilot with clear, deliberate stages.</p></div><div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{[["01", "Identification & Consent", "Community input and appropriate consent guide the pilot."], ["02", "Partner Orientation", "Potential partners start with a private conversation."], ["03", "Careful Planning", "Any next steps are assessed responsibly and privately."], ["04", "Community Purpose", "Long-term value is considered with the local community."]].map(([number, title, description]) => <article key={number} className="rounded-3xl border border-white/15 bg-white/5 p-6"><span className="font-montserrat text-2xl font-black text-[#F5AB00]">{number}</span><h3 className="mt-4 font-montserrat text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-white/70">{description}</p></article>)}</div></div></section>

      <section className="bg-white px-4 py-16 sm:px-6 md:py-24 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-center"><div className="lg:col-span-7"><span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">Accountability &amp; stewardship</span><h2 className="mt-3 font-montserrat text-3xl font-black text-[#051836] sm:text-4xl">Information is shared responsibly.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-[#051836]/70">The public site does not publish individual records, private partnership discussions, or financial documents. Relevant information is handled through appropriate private processes.</p></div><div className="rounded-3xl border border-[#051836]/10 bg-[#FDFCF9] p-7 shadow-lg lg:col-span-5"><h3 className="font-montserrat text-xl font-black text-[#051836]">Interested in partnering?</h3><p className="mt-3 text-sm leading-6 text-[#051836]/70">Share your context through the orientation form, then choose a time for an initial conversation.</p><Link href="/orientation" className="mt-6 inline-flex rounded-xl bg-[#005C27] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#327B2F]">Request Sponsor Orientation →</Link></div></div></section>
    </div>
  );
}
