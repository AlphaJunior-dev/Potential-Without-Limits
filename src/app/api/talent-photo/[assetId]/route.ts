import { NextRequest, NextResponse } from "next/server";
import { adminDb, toPublicTalentCard } from "@/lib/admin";

export const runtime = "nodejs";

const assetIdPattern = /^[A-Za-z0-9_-]{8,80}$/;

function notFound() {
  return NextResponse.json({ error: "Talent photo not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
}

function assetBytes(value: unknown) {
  if (Buffer.isBuffer(value)) return value;
  if (value && typeof value === "object" && "toUint8Array" in value && typeof value.toUint8Array === "function") {
    return Buffer.from(value.toUint8Array());
  }
  return null;
}

/**
 * Anonymous visitors may retrieve a Firestore-backed photo only when its
 * linked Sponsor Talent record has both public-profile and public-photo
 * visibility enabled. The raw asset document itself is never publicly listed.
 */
export async function GET(_request: NextRequest, context: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await context.params;
  if (!assetIdPattern.test(assetId)) return notFound();

  try {
    const photoUrl = `/api/talent-photo/${assetId}`;
    const linked = await adminDb().collection("sponsor_talent_records").where("photoUrl", "==", photoUrl).limit(1).get();
    const card = linked.empty ? null : toPublicTalentCard(linked.docs[0]!.id, linked.docs[0]!.data());
    if (!card || card.photoUrl !== photoUrl) return notFound();

    const asset = await adminDb().collection("talent_photo_assets").doc(assetId).get();
    const bytes = asset.exists ? assetBytes(asset.data()?.bytes) : null;
    const contentType = asset.data()?.contentType;
    if (!bytes || !["image/jpeg", "image/png", "image/webp"].includes(contentType)) return notFound();

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return notFound();
  }
}
