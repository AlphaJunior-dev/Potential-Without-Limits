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
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getStorage } = require("firebase-admin/storage") as typeof import("firebase-admin/storage");

function adminApp() {
  if (getApps().length) return getApps()[0]!;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Server Firebase credentials are not configured.");
  }

  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`;
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), storageBucket });
}

export function adminDb() {
  return getFirestore(adminApp());
}

export function adminAuth() {
  return getAuth(adminApp());
}

export function adminStorage() {
  return getStorage(adminApp()).bucket(
    process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
  );
}

export async function requireAdministrator(request: NextRequest) {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const sessionToken = request.cookies.get("__session")?.value;
  const token = bearer || sessionToken;
  if (!token) throw new Error("UNAUTHENTICATED");

  const decoded = await adminAuth().verifyIdToken(token);
  if (decoded.admin !== true) throw new Error("FORBIDDEN");
  return decoded;
}

export async function requireApprovedSponsor(request: NextRequest) {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const sessionToken = request.cookies.get("__session")?.value;
  const token = bearer || sessionToken;
  if (!token) throw new Error("UNAUTHENTICATED");

  const decoded = await adminAuth().verifyIdToken(token);
  if (decoded.sponsor !== true) throw new Error("FORBIDDEN");
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
      photoUrl: "",
    },
    {
      id: "community-guided-support",
      title: "Community-guided Support",
      summary: "Potential partners can learn about community-informed Sponsor Talent opportunities during a private orientation call.",
      supportArea: "Partnership conversation",
      photoUrl: "",
    },
    {
      id: "safeguarding-first",
      title: "Safeguarding First",
      summary: "Sponsor Talent information is reviewed through appropriate safeguarding and privacy practices.",
      supportArea: "Safeguarding review",
      photoUrl: "",
    },
  ] as Array<{ id: string; title: string; summary: string; supportArea?: string; photoUrl?: string }>,
};

const publicBrandingTextLimits: Record<string, number> = {
  siteTitle: 140,
  heroBadgeText: 160,
  heroHeadline: 160,
  heroSubheadline: 700,
  heroCtaText: 80,
  heroSecondaryCtaText: 80,
  heroCardLocation: 100,
  heroCardTitle: 160,
  heroCardDescription: 260,
  videoSectionBadge: 100,
  videoSectionTitle: 160,
  videoSectionSubtitle: 360,
  sponsorSectionBadge: 100,
  sponsorSectionTitle: 160,
  sponsorSectionSubtitle: 360,
  pathwaySectionBadge: 100,
  pathwaySectionTitle: 160,
  pathwaySectionSubtitle: 360,
  transparencySectionBadge: 100,
  transparencySectionTitle: 160,
  transparencySectionSubtitle: 360,
};

const publicBrandingColorFields = ["primaryColor", "secondaryColor", "backgroundColor", "cardBackgroundColor", "textColor"];
const approvedHeaderFonts = new Set(["Montserrat", "Inter", "Playfair Display", "Roboto", "Outfit"]);
const approvedBodyFonts = new Set(["Inter", "Montserrat", "Roboto", "Outfit"]);

function sponsorTalentWording(value: string) {
  return value.replace(/Rwanda\s+pilot|Rwanda/gi, "Sponsor Talent");
}

function safeAssetUrl(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, 1_500);
  if (!trimmed || trimmed.startsWith("data:") || trimmed.startsWith("//")) return undefined;
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function safePublicText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return undefined;
  const text = sponsorTalentWording(value.trim()).slice(0, maxLength);
  return text || undefined;
}

export function sanitizePublicMissionVision(input: unknown) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const pillars = Array.isArray(source.pillars)
    ? source.pillars.slice(0, 8).map((pillar) => {
      const item = pillar && typeof pillar === "object" ? pillar as Record<string, unknown> : {};
      const title = safePublicText(item.title, 100);
      const description = safePublicText(item.description, 420);
      return title && description ? { title, description } : null;
    }).filter((pillar): pillar is { title: string; description: string } => Boolean(pillar))
    : [];

  return {
    mission: safePublicText(source.mission, 1_500),
    vision: safePublicText(source.vision, 1_500),
    foundersNote: safePublicText(source.foundersNote, 2_000),
    foundersTitle: safePublicText(source.foundersTitle, 180),
    pillars,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

export function sanitizePublicTeam(input: unknown) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 12).map((member, index) => {
    const item = member && typeof member === "object" ? member as Record<string, unknown> : {};
    const name = safePublicText(item.name, 120);
    const role = safePublicText(item.role, 160);
    const bio = safePublicText(item.bio, 1_200);
    if (!name || !role || !bio) return null;
    const rawVisibility = item.visibility && typeof item.visibility === "object" ? item.visibility as Record<string, unknown> : {};
    const visibility = {
      isPublic: rawVisibility.isPublic === true,
      showPhoto: rawVisibility.showPhoto === true,
      showRole: rawVisibility.showRole === true,
      showBio: rawVisibility.showBio === true,
      showLink: rawVisibility.showLink === true,
    };
    if (!visibility.isPublic) return null;
    const photoUrl = visibility.showPhoto ? (safeAssetUrl(item.photoUrl) || "/pwlif-logo.png") : "/pwlif-logo.png";
    const linkedinUrl = safeAssetUrl(item.linkedinUrl);
    return {
      id: safePublicText(item.id, 80)?.replace(/[^a-zA-Z0-9_-]/g, "") || `team-${index + 1}`,
      name,
      role: visibility.showRole ? role : "",
      bio: visibility.showBio ? bio : "",
      photoUrl,
      ...(visibility.showLink && linkedinUrl ? { linkedinUrl } : {}),
      visibility,
      order: Math.max(1, Math.min(99, Number.isFinite(item.order) ? Math.trunc(item.order as number) : index + 1)),
    };
  }).filter((member): member is NonNullable<typeof member> => Boolean(member));
}

export function sanitizeAdminTeam(input: unknown) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 12).map((member, index) => {
    const item = member && typeof member === "object" ? member as Record<string, unknown> : {};
    const name = safePublicText(item.name, 120);
    const role = safePublicText(item.role, 160);
    const bio = safePublicText(item.bio, 1_200);
    if (!name || !role || !bio) return null;
    const rawVisibility = item.visibility && typeof item.visibility === "object" ? item.visibility as Record<string, unknown> : {};
    return {
      id: safePublicText(item.id, 80)?.replace(/[^a-zA-Z0-9_-]/g, "") || `team-${index + 1}`,
      name,
      role,
      bio,
      photoUrl: safeAssetUrl(item.photoUrl) || "/pwlif-logo.png",
      ...(safeAssetUrl(item.linkedinUrl) ? { linkedinUrl: safeAssetUrl(item.linkedinUrl) } : {}),
      order: Math.max(1, Math.min(99, Number.isFinite(item.order) ? Math.trunc(item.order as number) : index + 1)),
      visibility: {
        isPublic: rawVisibility.isPublic === true,
        showPhoto: rawVisibility.showPhoto === true,
        showRole: rawVisibility.showRole === true,
        showBio: rawVisibility.showBio === true,
        showLink: rawVisibility.showLink === true,
      },
    };
  }).filter((member): member is NonNullable<typeof member> => Boolean(member));
}

export function sanitizeTalentRecord(input: unknown) {
  const item = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const displayTitle = safePublicText(item.displayTitle, 120);
  const summary = safePublicText(item.summary, 1_500);
  const supportArea = safePublicText(item.supportArea, 160);
  if (!displayTitle || !summary || !supportArea) return null;
  const rawVisibility = item.visibility && typeof item.visibility === "object" ? item.visibility as Record<string, unknown> : {};
  const rawMedia = Array.isArray(item.mediaUrls) ? item.mediaUrls : [];
  return {
    displayTitle,
    summary,
    supportArea,
    photoUrl: safeAssetUrl(item.photoUrl) || "",
    mediaUrls: rawMedia.map(safeAssetUrl).filter((url): url is string => Boolean(url)).slice(0, 4),
    displayOrder: Math.max(1, Math.min(999, Number.isFinite(item.displayOrder) ? Math.trunc(item.displayOrder as number) : 999)),
    visibility: {
      profileVisible: rawVisibility.profileVisible === true,
      photoVisible: rawVisibility.photoVisible === true,
      mediaVisible: rawVisibility.mediaVisible === true,
      summaryVisible: rawVisibility.summaryVisible === true,
    },
  };
}

export function toPublicTalentCard(id: string, input: unknown) {
  const record = sanitizeTalentRecord(input);
  if (!record || !record.visibility.profileVisible) return null;
  return {
    id,
    title: record.displayTitle,
    summary: record.visibility.summaryVisible ? record.summary : "Information is shared through an appropriate private orientation conversation.",
    supportArea: record.supportArea,
    ...(record.visibility.photoVisible && record.photoUrl ? { photoUrl: record.photoUrl } : {}),
    ...(record.visibility.mediaVisible ? { mediaUrls: record.mediaUrls } : {}),
    displayOrder: record.displayOrder,
  };
}

/**
 * Approved sponsors have a separate, private authorization boundary from
 * anonymous visitors. This mapper retains every safe Sponsor Talent field
 * validated at write time; public field-visibility choices remain enforced by
 * toPublicTalentCard() and are never relaxed for public routes.
 */
export function toSponsorTalentCard(id: string, input: unknown) {
  const record = sanitizeTalentRecord(input);
  if (!record) return null;
  return {
    id,
    title: record.displayTitle,
    summary: record.summary,
    supportArea: record.supportArea,
    ...(record.photoUrl ? { photoUrl: record.photoUrl } : {}),
    ...(record.mediaUrls.length ? { mediaUrls: record.mediaUrls } : {}),
    displayOrder: record.displayOrder,
  };
}

export function sanitizePublicLegal(input: unknown) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  return {
    termsContent: safePublicText(source.termsContent, 20_000),
    privacyContent: safePublicText(source.privacyContent, 20_000),
    securityStandardsContent: safePublicText(source.securityStandardsContent, 20_000),
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

export function sanitizePublicVideos(input: unknown) {
  if (!Array.isArray(input)) return [];
  const categories = new Set(["Foundation Intro", "Impact Story", "Transformational Journey"]);
  return input.slice(0, 6).map((video, index) => {
    const item = video && typeof video === "object" ? video as Record<string, unknown> : {};
    const title = safePublicText(item.title, 160);
    const videoUrl = safeAssetUrl(item.videoUrl);
    if (!title || !videoUrl) return null;
    const thumbnail = safeAssetUrl(item.thumbnail) || "/pwlif-logo.png";
    const category = typeof item.category === "string" && categories.has(item.category) ? item.category : "Foundation Intro";
    return {
      id: safePublicText(item.id, 80)?.replace(/[^a-zA-Z0-9_-]/g, "") || `video-${index + 1}`,
      title,
      videoUrl,
      thumbnail,
      duration: safePublicText(item.duration, 20) || "",
      category,
      description: safePublicText(item.description, 1_000) || "",
    };
  }).filter((video): video is NonNullable<typeof video> => Boolean(video));
}

export function sanitizePublicBranding(input: unknown) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const branding: Record<string, string> = {};

  for (const [field, limit] of Object.entries(publicBrandingTextLimits)) {
    const value = source[field];
    if (typeof value === "string" && value.trim()) branding[field] = sponsorTalentWording(value.trim()).slice(0, limit);
  }

  for (const field of publicBrandingColorFields) {
    const value = source[field];
    if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value.trim())) branding[field] = value.trim();
  }

  if (typeof source.headerFont === "string" && approvedHeaderFonts.has(source.headerFont)) branding.headerFont = source.headerFont;
  if (typeof source.bodyFont === "string" && approvedBodyFonts.has(source.bodyFont)) branding.bodyFont = source.bodyFont;
  if (source.heroMediaType === "image" || source.heroMediaType === "video" || source.heroMediaType === "none") branding.heroMediaType = source.heroMediaType;

  const heroImage = safeAssetUrl(source.heroImage);
  const heroVideoUrl = safeAssetUrl(source.heroVideoUrl);
  const logoUrl = safeAssetUrl(source.logoUrl);
  if (heroImage) branding.heroImage = heroImage;
  if (heroVideoUrl) branding.heroVideoUrl = heroVideoUrl;
  if (logoUrl) branding.logoUrl = logoUrl;

  return branding;
}

export async function readPublicSite() {
  try {
    const db = adminDb();
    const [siteSnapshot, cardsSnapshot, talentSnapshot] = await Promise.all([
      db.collection("public_site_content").doc("main").get(),
      db.collection("pilot_overview_cards").where("status", "==", "published").orderBy("displayOrder", "asc").get(),
      db.collection("sponsor_talent_records").where("visibility.profileVisible", "==", true).limit(100).get(),
    ]);
    const values = siteSnapshot.exists ? siteSnapshot.data() : {};
    const branding = sanitizePublicBranding(values?.branding);
    const publishedCards = cardsSnapshot.docs.map((document) => {
      const card = document.data();
      return {
        id: document.id,
        title: sponsorTalentWording(String(card.title ?? "Sponsor Talent Overview")),
        summary: sponsorTalentWording(String(card.summary ?? "")),
        supportArea: typeof card.supportArea === "string" ? sponsorTalentWording(card.supportArea) : undefined,
        photoUrl: "",
      };
    });
    const publishedTalentCards = talentSnapshot.docs
      .map((document) => toPublicTalentCard(document.id, document.data()))
      .filter((card): card is NonNullable<typeof card> => Boolean(card))
      .sort((first, second) => first.displayOrder - second.displayOrder);

    return {
      heroTitle: typeof values?.heroTitle === "string" ? sponsorTalentWording(values.heroTitle) : branding.heroHeadline || safePublicDefaults.heroTitle,
      heroText: typeof values?.heroText === "string" ? sponsorTalentWording(values.heroText) : branding.heroSubheadline || safePublicDefaults.heroText,
      bookingUrl: typeof values?.bookingUrl === "string" ? values.bookingUrl : safePublicDefaults.bookingUrl,
      pilotCards: publishedTalentCards.length ? publishedTalentCards : (publishedCards.length ? publishedCards : safePublicDefaults.pilotCards),
      branding,
      missionVision: sanitizePublicMissionVision(values?.missionVision),
      teamMembers: sanitizePublicTeam(values?.teamMembers),
      legalSecurity: sanitizePublicLegal(values?.legalSecurity),
      foundationVideos: sanitizePublicVideos(values?.foundationVideos),
    };
  } catch {
    return { ...safePublicDefaults, branding: {}, missionVision: {}, teamMembers: [], legalSecurity: {}, foundationVideos: [] };
  }
}
