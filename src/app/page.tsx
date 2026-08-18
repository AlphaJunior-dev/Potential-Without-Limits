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
    <>
      <section className="relative overflow-hidden border-b border-[#051836]/10 bg-[#FDFCF9] px-4 pb-16 pt-12 sm:px-6 md:pb-20 md:pt-18 lg:px-8 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_85%_22%,rgba(245,171,0,.09),transparent_22%),radial-gradient(circle_at_13%_72%,rgba(0,92,39,.07),transparent_24%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="inline-flex rounded-full border border-[#005C27]/25 bg-[#005C27]/8 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#005C27]">Potential Without Limits International Foundation</p>
            <h1 className="mt-6 max-w-3xl font-montserrat text-5xl font-black leading-[.92] tracking-[-.06em] text-[#051836] sm:text-6xl lg:text-7xl">{site.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#051836]/70 sm:text-lg">{site.heroText}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/orientation" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#005C27] px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(0,92,39,.2)] transition hover:-translate-y-0.5 hover:bg-[#004b20]">
                <span aria-hidden="true" className="text-[#F5AB00]">●</span> Request Orientation <span aria-hidden="true">→</span>
              </Link>
              <Link href="/our-pilot" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#051836] px-6 py-4 text-sm font-bold text-white shadow-[0_12px_28px_rgba(5,24,54,.15)] transition hover:bg-[#042554]">
                Explore the Pilot <span aria-hidden="true" className="text-[#F5AB00]">→</span>
              </Link>
            </div>
            <div className="mt-7 grid max-w-xl grid-cols-3 gap-4 border-t border-[#051836]/10 pt-6 text-xs">
              {pilotFacts.map(([value, label], index) => <div key={label}><p className={`font-montserrat text-lg font-black ${index === 0 ? "text-[#005C27]" : index === 1 ? "text-[#051836]" : "text-[#F5AB00]"}`}>{value}</p><p className="mt-1 text-[11px] leading-4 text-[#051836]/60">{label}</p></div>)}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative min-h-90 overflow-hidden rounded-[1.8rem] border-4 border-white bg-[#051836] p-7 shadow-[0_24px_55px_rgba(5,24,54,.23)]">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F5AB00]/20 blur-2xl" />
              <div className="absolute -bottom-18 -left-16 h-56 w-56 rounded-full bg-[#005C27]/70 blur-2xl" />
              <div className="relative flex min-h-76 flex-col justify-between">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#F5AB00]"><span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F5AB00]" /> Rwanda pilot · careful beginnings</div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-[#F5AB00]">A thoughtful first step</p>
                  <h2 className="mt-3 font-montserrat text-2xl font-black leading-tight text-white">Listen first. Learn carefully. Build with community.</h2>
                  <p className="mt-3 text-sm leading-6 text-white/75">PWLIF is beginning with a community-informed Rwanda pilot, not public profiles or direct-aid promises.</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/15 pt-5 text-xs text-white/65"><span>Private orientation process</span><span className="font-bold text-[#F5AB00]">PWLIF</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-22 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#005C27]">Foundation introduction</p><h2 className="mt-3 font-montserrat text-4xl font-black leading-tight tracking-[-.045em] text-[#051836]">A familiar purpose, approached with care.</h2><p className="mt-5 text-sm leading-7 text-[#051836]/70">This public introduction explains the early-stage pilot. Individual information stays private, and partnership conversations begin through orientation.</p><Link href="/mission-vision" className="mt-6 inline-flex rounded-xl border border-[#051836]/15 px-4 py-3 text-xs font-bold text-[#051836] transition hover:border-[#005C27] hover:text-[#005C27]">Read Mission &amp; Vision →</Link></div>
          <div className="rounded-[1.8rem] border border-[#051836]/10 bg-white p-7 shadow-[0_18px_45px_rgba(5,24,54,.08)] sm:p-9"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#F5AB00]">Introduction video</p><div className="mt-5 grid min-h-54 place-items-center rounded-2xl bg-gradient-to-br from-[#051836] via-[#042554] to-[#005C27] p-8 text-center text-white"><div><p className="text-4xl text-[#F5AB00]">▶</p><p className="mt-4 font-montserrat text-xl font-black">Foundation introduction in preparation</p><p className="mt-2 text-sm leading-6 text-white/70">A public overview will be shared when it is ready.</p></div></div></div>
        </div>
      </section>

      <section className="border-y border-[#051836]/10 bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#005C27]">Partnership approach</p><h2 className="mt-3 font-montserrat text-4xl font-black tracking-[-.045em] text-[#051836]">Start with a conversation, not a transaction.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[["01", "Share context", "Tell us about your organisation, work, and interest through the private orientation form."], ["02", "Schedule orientation", "Choose a time for an initial conversation using the booking calendar shown after submission."], ["03", "Explore fit", "Consider whether a respectful, long-term partnership is appropriate."]].map(([number, title, description]) => <article key={number} className="rounded-3xl border border-[#051836]/10 bg-[#FDFCF9] p-6 shadow-[0_10px_24px_rgba(5,24,54,.04)]"><p className="text-xs font-black tracking-[.16em] text-[#005C27]">STEP {number}</p><h3 className="mt-5 font-montserrat text-xl font-black text-[#051836]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#051836]/70">{description}</p></article>)}</div></div></section>
    </>
  );
}
