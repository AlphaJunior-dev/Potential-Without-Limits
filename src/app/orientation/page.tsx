import { OrientationForm } from "@/components/OrientationForm";
import { PageHero } from "@/components/PageHero";
import { readPublicSite } from "@/lib/admin";
export const dynamic = "force-dynamic";
export default async function OrientationPage() { const site = await readPublicSite(); return <><PageHero eyebrow="Contact & Orientation" title="Begin with a respectful introduction." intro="Tell us briefly about your organisation and the support you would like to explore. Your details remain private to PWLIF’s authorised team." /><section className="mx-auto max-w-4xl px-5 py-16 sm:px-8"><OrientationForm bookingUrl={site.bookingUrl} /></section></>; }
