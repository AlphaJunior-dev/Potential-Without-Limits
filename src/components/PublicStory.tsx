import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";

type Action = {
  href: string;
  label: string;
};

export function PublicHero({
  eyebrow,
  title,
  intro,
  primaryAction,
  secondaryAction,
  children,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  children?: ReactNode;
  dark?: boolean;
}) {
  const textClass = dark ? "text-white" : "text-[#0B2E6B]";
  const mutedClass = dark ? "text-white/72" : "text-[#0B2E6B]/72";

  return (
    <section className={`relative overflow-hidden ${dark ? "bg-[#061D45]" : "bg-[#FCFCFA]"}`}>
      <div className="pwlif-motion-field" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="max-w-4xl lg:col-span-8">
            <p className={`mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] ${dark ? "text-[#A9F1C3]" : "text-[#079432]"}`}>
              <span className={`h-px w-9 ${dark ? "bg-[#F7B500]" : "bg-[#0A8CF5]"}`} />
              {eyebrow}
            </p>
            <h1 className={`max-w-5xl font-montserrat text-5xl font-black leading-[0.97] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[5.7rem] ${textClass}`}>
              {title}
            </h1>
            <p className={`mt-7 max-w-2xl text-base leading-8 sm:text-lg ${mutedClass}`}>{intro}</p>
            {(primaryAction || secondaryAction) && (
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                {primaryAction && <PublicAction {...primaryAction} />}
                {secondaryAction && (
                  <Link href={secondaryAction.href} className={`group inline-flex items-center gap-2 px-2 py-3 text-sm font-bold ${dark ? "text-white hover:text-[#A9F1C3]" : "text-[#0B2E6B] hover:text-[#079432]"}`}>
                    {secondaryAction.label}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            )}
          </div>
          {children && <div className="lg:col-span-4">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function PublicAction({ href, label }: Action) {
  return (
    <Link href={href} className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#079432] px-6 py-4 text-sm font-bold text-white shadow-[0_14px_35px_rgba(7,148,50,0.24)] transition duration-200 hover:bg-[#14B84A] active:scale-[0.97]">
      {label}
      <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = "left", dark = false }: { eyebrow: string; title: string; intro?: string; align?: "left" | "center"; dark?: boolean }) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className={`mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] ${dark ? "text-[#A9F1C3]" : "text-[#079432]"} ${centered ? "justify-center" : ""}`}>
        <span className="h-px w-8 bg-[#F7B500]" />
        {eyebrow}
      </p>
      <h2 className={`font-montserrat text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl ${dark ? "text-white" : "text-[#0B2E6B]"}`}>{title}</h2>
      {intro && <p className={`mt-5 text-sm leading-7 sm:text-base ${dark ? "text-white/68" : "text-[#0B2E6B]/70"}`}>{intro}</p>}
    </div>
  );
}

export function EditorialSplit({
  number,
  eyebrow,
  title,
  children,
  aside,
  reverse = false,
  dark = false,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  aside: ReactNode;
  reverse?: boolean;
  dark?: boolean;
}) {
  const content = (
    <div className={`pwlif-editorial-copy flex flex-col justify-center ${dark ? "text-white" : "text-[#0B2E6B]"}`}>
      <p className={`mb-5 text-[11px] font-bold uppercase tracking-[0.18em] ${dark ? "text-[#A9F1C3]" : "text-[#079432]"}`}>{eyebrow}</p>
      <h2 className="font-montserrat text-4xl font-black leading-[1.04] tracking-[-0.045em] sm:text-5xl">{title}</h2>
      <div className={`mt-6 text-sm leading-7 sm:text-base ${dark ? "text-white/72" : "text-[#0B2E6B]/70"}`}>{children}</div>
    </div>
  );
  const media = (
    <div className="pwlif-editorial-frame relative min-h-[300px] overflow-hidden rounded-[2rem] bg-[#0B2E6B] sm:min-h-[420px]">
      <span className="absolute left-6 top-5 z-10 font-montserrat text-5xl font-black tracking-[-0.06em] text-white/25">{number}</span>
      {aside}
    </div>
  );
  return <div className={`grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-16 ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}>{content}{media}</div>;
}

export function PublicCtaBand({ eyebrow, title, intro, action }: { eyebrow: string; title: string; intro: string; action: Action }) {
  return (
    <section className="relative overflow-hidden bg-[#061D45] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="pwlif-motion-field opacity-70" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A9F1C3]">{eyebrow}</p>
          <h2 className="mt-4 max-w-4xl font-montserrat text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">{intro}</p>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end"><PublicAction {...action} /></div>
      </div>
    </section>
  );
}
