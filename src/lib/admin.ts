import "server-only";

import { NextRequest } from "next/server";

// Firebase Admin v14 provides both ESM and CommonJS entrypoints. Next's server
// compiler selected the ESM entrypoint before externalizing the package for
// Vercel, after which Node tried to load it with require(). Use the explicit
// CommonJS resolution path for this Node-only module instead.
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
    "Potential Without Limits International Foundation is beginning a careful Rwanda pilot with six children, shaped through community-informed planning.",
  bookingUrl: "https://calendly.com/withoutlimitspotential/onboarding-call",
  pilotCards: [] as Array<{ id: string; title: string; summary: string; supportArea?: string }>,
};

export async function readPublicSite() {
  try {
    const db = adminDb();
    const [siteSnapshot, cardsSnapshot] = await Promise.all([
      db.collection("public_site_content").doc("main").get(),
      db.collection("pilot_overview_cards").where("status", "==", "published").orderBy("displayOrder", "asc").get(),
    ]);
    const values = siteSnapshot.exists ? siteSnapshot.data() : {};
    return {
      heroTitle: typeof values?.heroTitle === "string" ? values.heroTitle : safePublicDefaults.heroTitle,
      heroText: typeof values?.heroText === "string" ? values.heroText : safePublicDefaults.heroText,
      bookingUrl: typeof values?.bookingUrl === "string" ? values.bookingUrl : safePublicDefaults.bookingUrl,
      pilotCards: cardsSnapshot.docs.map((document) => {
        const card = document.data();
        return {
          id: document.id,
          title: String(card.title ?? "Pilot overview"),
          summary: String(card.summary ?? ""),
          supportArea: typeof card.supportArea === "string" ? card.supportArea : undefined,
        };
      }),
    };
  } catch {
    return safePublicDefaults;
  }
}
