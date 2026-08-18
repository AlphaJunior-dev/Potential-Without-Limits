const links = [
  ["Mission & Vision", "/mission-vision"],
  ["Our Pilot", "/our-pilot"],
  ["Partnership Approach", "/partnership"],
  ["FAQ", "/faq"],
] as const;

/** A hook-free public header that keeps the familiar navigation usable on every viewport. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#051836]/10 bg-[#FDFCF9]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Intentional server-rendered fallback navigation. */}
        <a href="/" className="group flex shrink-0 items-center gap-3" aria-label="Potential Without Limits International Foundation home">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#005C27] text-lg font-black text-[#FDFCF9] shadow-[0_8px_24px_rgba(0,92,39,.24)]">P</span>
          <span className="leading-tight"><span className="block font-montserrat text-sm font-black tracking-tight text-[#051836]">Potential Without Limits</span><span className="block text-[10px] font-bold uppercase tracking-[.16em] text-[#005C27]">International Foundation</span></span>
        </a>
        <a href="/orientation" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#005C27] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#005C27]/20 transition hover:-translate-y-0.5 hover:bg-[#004b20]">Request Orientation <span aria-hidden="true">→</span></a>
        <nav className="order-3 flex w-full items-center gap-5 overflow-x-auto pb-1 pt-1 lg:order-2 lg:w-auto lg:overflow-visible" aria-label="Public navigation">
          {links.map(([label, href]) => <a key={href} href={href} className="whitespace-nowrap text-xs font-bold text-[#051836]/75 transition hover:text-[#005C27]">{label}</a>)}
        </nav>
      </div>
    </header>
  );
}
