import Link from "next/link";
import { WlpLogo } from "@/components/WlpLogo";

const links = [
  ["Sponsor a Dream", "/orientation"],
  ["Mission & Vision", "/mission-vision"],
  ["Our Pilot", "/our-pilot"],
  ["FAQ", "/faq"],
] as const;

/** A hook-free public header that keeps the familiar navigation usable on every viewport. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#051836]/10 bg-[#FDFCF9]/95 shadow-[0_1px_10px_rgba(5,24,54,.03)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Potential Without Limits International Foundation home">
          <WlpLogo className="h-11 w-auto sm:h-12" />
        </Link>
        <nav className="order-3 flex w-full items-center justify-center gap-4 overflow-x-auto pb-1 text-[11px] font-semibold text-[#051836]/75 sm:gap-6 lg:order-2 lg:w-auto lg:flex-1 lg:pb-0" aria-label="Public navigation">
          {links.map(([label, href]) => <Link key={href} href={href} className="whitespace-nowrap transition hover:text-[#005C27]">{label}</Link>)}
        </nav>
        <div className="order-2 flex shrink-0 items-center gap-2 lg:order-3">
          <Link href="/orientation" className="inline-flex items-center gap-2 rounded-xl bg-[#005C27] px-3.5 py-2.5 text-[11px] font-extrabold text-white shadow-[0_8px_18px_rgba(0,92,39,.16)] transition hover:bg-[#004b20] sm:px-4">
            <span aria-hidden="true">▣</span><span className="hidden sm:inline">Book Orientation Call</span><span className="sm:hidden">Orientation</span>
          </Link>
          <Link href="/our-pilot" className="rounded-xl bg-[#051836] px-3.5 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#042554] sm:px-4">Our Pilot</Link>
        </div>
      </div>
    </header>
  );
}
