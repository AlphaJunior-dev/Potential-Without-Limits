import { readPublicSite } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = await readPublicSite();
  const steps = [
    ["01", "Begin with context", "Read the public overview and consider whether PWLIF’s careful approach aligns with your organisation."],
    ["02", "Request orientation", "Share a short, private introduction before scheduling an orientation conversation."],
    ["03", "Explore responsibly", "A call is a conversation, not a sponsorship commitment, payment process, or child-selection mechanism."],
  ] as const;

  return <>
    <section className="relative overflow-hidden bg-[#051836] px-5 pb-20 pt-16 text-white sm:px-8 lg:pb-28 lg:pt-24">
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_7%_35%,#327B2F_0,transparent_27%),radial-gradient(circle_at_87%_14%,#F5AB00_0,transparent_20%),linear-gradient(120deg,transparent_60%,rgba(255,255,255,.05)_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#F5AB00]">Rwanda pilot · careful beginnings</p>
          <h1 className="mt-5 max-w-3xl font-montserrat text-5xl font-black leading-[.9] tracking-[-.065em] sm:text-7xl">{site.heroTitle}</h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{site.heroText}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="/orientation" className="inline-flex items-center gap-2 rounded-xl bg-[#005C27] px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#004b20]">Request orientation <span aria-hidden="true">→</span></a>
            <a href="/our-pilot" className="rounded-xl border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white/10">Explore the pilot</a>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/15 bg-white/[.08] p-7 backdrop-blur-sm">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#F5AB00]">A deliberate approach</p>
          <div className="mt-8 grid gap-6">
            <div className="border-l-2 border-[#F5AB00] pl-4"><p className="font-montserrat text-2xl font-black">Listen</p><p className="mt-1 text-sm leading-6 text-white/65">Start with local knowledge and community-informed planning.</p></div>
            <div className="border-l-2 border-[#327B2F] pl-4"><p className="font-montserrat text-2xl font-black">Learn</p><p className="mt-1 text-sm leading-6 text-white/65">Build carefully, without turning children into public profiles.</p></div>
            <div className="border-l-2 border-white/45 pl-4"><p className="font-montserrat text-2xl font-black">Build</p><p className="mt-1 text-sm leading-6 text-white/65">Create respectful pathways for long-term partnership.</p></div>
          </div>
        </div>
      </div>
    </section>
    <section className="border-y border-[#051836]/10 bg-white px-5 py-7 sm:px-8"><div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-3"><p className="text-sm font-bold text-[#051836]/75"><span className="mr-2 text-[#005C27]">01</span>Early-stage Rwanda pilot</p><p className="text-sm font-bold text-[#051836]/75"><span className="mr-2 text-[#005C27]">02</span>Six children in the initial pilot</p><p className="text-sm font-bold text-[#051836]/75"><span className="mr-2 text-[#005C27]">03</span>Community-informed planning</p></div></section>
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[.2em] text-[#005C27]">Partnership with care</p><h2 className="mt-3 font-montserrat text-4xl font-black tracking-[-.045em] text-[#051836]">A clearer first conversation.</h2><p className="mt-4 text-base leading-7 text-[#051836]/70">We welcome organisations that want to learn about the pilot and explore whether a thoughtful partnership is appropriate.</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{steps.map(([number, title, body]) => <article key={title} className="rounded-3xl border border-[#051836]/10 bg-white p-7 shadow-[0_16px_45px_rgba(5,24,54,.06)]"><p className="text-xs font-black tracking-[.2em] text-[#005C27]">{number}</p><h3 className="mt-6 font-montserrat text-2xl font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-[#051836]/70">{body}</p></article>)}</div>
    </section>
  </>;
}
