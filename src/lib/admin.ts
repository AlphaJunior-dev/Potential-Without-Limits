import "server-only";

import { NextRequest } from "next/server";

// Firebase Admin is pinned to the CommonJS-compatible v13 line because the v14
// ESM dependency chain fails when Vercel externalizes the package for Next.js.
// Keep these Node-only imports as explicit CommonJS resolution paths.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { cert, getApps, initializeApp } = require("firebase-admin/app") as typeof import("firebase-admin/app");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getAuth } = require("firebase-admin/auth") as typeof import("firebase-admin/auth");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getFirestore } = require("firebase-admin/firestore") as typeof import("firebase-admin/firestore");

function adminApp() {
  if (getApps().length) return getApps()[0]!;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Server Firebase credentials are not configured.");
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export function adminDb() {
  return getFirestore(adminApp());
}

export async function requireAdministrator(request: NextRequest) {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const sessionToken = request.cookies.get("__session")?.value;
  const token = bearer || sessionToken;
  if (!token) throw new Error("UNAUTHENTICATED");

  const decoded = await getAuth(adminApp()).verifyIdToken(token);
  if (decoded.admin !== true) throw new Error("FORBIDDEN");
  return decoded;
}

export const safePublicDefaults = {
  heroTitle: "Potential grows when communities lead.",
  heroText:
    "Potential Without Limits International Foundation is building careful, community-informed Sponsor Talent opportunities.",
  bookingUrl: "https://calendly.com/withoutlimitspotential/onboarding-call",
  pilotCards: [
    {
      id: "sponsor-talent-overview",
      title: "Sponsor Talent Overview",
      summary: "Discover the foundation's Sponsor Talent pathway through a private safeguarding and partnership orientation.",
      supportArea: "Orientation conversation",
    },
    {
      id: "community-guided-support",
      title: "Community-guided Support",
      summary: "Potential partners can learn about community-informed Sponsor Talent opportunities during a private orientation call.",
      supportArea: "Partnership conversation",
    },
    {
      id: "safeguarding-first",
      title: "Safeguarding First",
      summary: "Sponsor Talent information is reviewed through appropriate safeguarding and privacy practices.",
      supportArea: "Safeguarding review",
    },
  ] as Array<{ id: string; title: string; summary: string; supportArea?: string }>,
};

export async function readPublicSite() {
  try {
    const db = adminDb();
    const [siteSnapshot, cardsSnapshot] = await Promise.all([
      db.collection("public_site_content").doc("main").get(),
      db.collection("pilot_overview_cards").where("status", "==", "published").orderBy("displayOrder", "asc").get(),
    ]);
    const values = siteSnapshot.exists ? siteSnapshot.data() : {};
    const sponsorTalentWording = (value: string) => value.replace(/Rwanda\s+pilot|Rwanda/gi, "Sponsor Talent");
    const publishedCards = cardsSnapshot.docs.map((document) => {
      const card = document.data();
      return {
        id: document.id,
        title: sponsorTalentWording(String(card.title ?? "Sponsor Talent Overview")),
        summary: sponsorTalentWording(String(card.summary ?? "")),
        supportArea: typeof card.supportArea === "string" ? sponsorTalentWording(card.supportArea) : undefined,
      };
    });

    return {
      heroTitle: typeof values?.heroTitle === "string" ? sponsorTalentWording(values.heroTitle) : safePublicDefaults.heroTitle,
      heroText: typeof values?.heroText === "string" ? sponsorTalentWording(values.heroText) : safePublicDefaults.heroText,
      bookingUrl: typeof values?.bookingUrl === "string" ? values.bookingUrl : safePublicDefaults.bookingUrl,
      pilotCards: publishedCards.length ? publishedCards : safePublicDefaults.pilotCards,
    };
  } catch {
    return safePublicDefaults;
  }
}
