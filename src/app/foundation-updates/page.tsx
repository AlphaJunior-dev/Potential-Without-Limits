"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ComingSoonPage } from "@/components/ComingSoonPage";

function paragraphs(body: string) {
  return body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export default function FoundationUpdatesPage() {
  const { editorialPages } = useAuth();
  const page = editorialPages.foundationUpdates;
  const updates = (page.updates || []).filter((update) => update.status === "published");

  if (page.status !== "published" || (!page.title && updates.length === 0)) {
    return <ComingSoonPage eyebrow="News & updates" title="Foundation updates are coming soon." description="PWLIF is preparing verified announcements and public information with Foundation leadership." />;
  }

  return (
    <main className="min-h-screen bg-[#FCFCFA] text-[#0B2E6B]">
      <section className="border-b border-[#0B2E6B]/10 bg-[#0B2E6B] px-6 py-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] text-[#A9F1C3]">News &amp; updates</p>
          <h1 className="max-w-4xl font-montserrat text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-6xl">{page.title}</h1>
          {page.introduction && <p className="mt-6 max-w-2xl font-inter text-base leading-8 text-white/75 sm:text-lg">{page.introduction}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-14 px-6 py-14 sm:px-10 lg:px-16">
        {page.body && <p className="max-w-3xl whitespace-pre-line font-inter text-base leading-8 text-[#0B2E6B]/75">{page.body}</p>}
        {updates.map((update, index) => (
          <article key={update.id} className="grid gap-8 border-t border-[#0B2E6B]/10 pt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div className="relative min-h-[260px] overflow-hidden rounded-[2rem] bg-[#0B2E6B] sm:min-h-[360px]">
              {update.imageUrl ? (
                <Image src={update.imageUrl} alt={update.imageAlt || update.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-8 text-center font-montserrat text-sm font-bold uppercase tracking-[0.18em] text-white/70">PWLIF update</div>
              )}
              <span className="absolute left-5 top-4 font-montserrat text-5xl font-black tracking-[-0.06em] text-white/65">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#079432]">Foundation update</p>
              <h2 className="mt-4 font-montserrat text-3xl font-black leading-[1.08] tracking-[-0.035em] sm:text-4xl">{update.title}</h2>
              {update.byline && <p className="mt-4 font-inter text-sm font-semibold text-[#0B2E6B]/60">{update.byline}</p>}
              <p className="mt-6 font-inter text-base font-semibold leading-8 text-[#0B2E6B]/80">{update.introduction}</p>
              <div className="mt-5 space-y-4 font-inter text-base leading-8 text-[#0B2E6B]/70">
                {paragraphs(update.body).map((paragraph, paragraphIndex) => <p key={`${update.id}-${paragraphIndex}`}>{paragraph}</p>)}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
