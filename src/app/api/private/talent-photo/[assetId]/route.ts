import { NextRequest, NextResponse } from "next/server";
import { adminDb, requireAdministrator, requireApprovedSponsor, toSponsorTalentCard } from "@/lib/admin";
import { loadTalentPhoto } from "@/lib/supabase-media";

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
 * Approved sponsors may view linked private Talent photos. Administrators may
 * also preview their own unlinked upload before they save its Talent record.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await context.params;
  if (!assetIdPattern.test(assetId)) return notFound();

  try {
    const photoUrl = `/api/talent-photo/${assetId}`;
    let administratorUid: string | null = null;
    try {
      administratorUid = (await requireAdministrator(request)).uid;
    } catch {
      const sponsor = await requireApprovedSponsor(request);
      const linked = await adminDb().collection("sponsor_talent_records").where("photoUrl", "==", photoUrl).limit(1).get();
      if (linked.empty || !toSponsorTalentCard(linked.docs[0]!.id, linked.docs[0]!.data())) return notFound();
      void sponsor;
    }

    const asset = await adminDb().collection("talent_photo_assets").doc(assetId).get();
    if (!asset.exists || (administratorUid && asset.data()?.uploadedBy !== administratorUid)) return notFound();
    const storagePath = asset.data()?.storagePath;
    const bytes = typeof storagePath === "string" ? await loadTalentPhoto(storagePath) : assetBytes(asset.data()?.bytes);
    const contentType = asset.data()?.contentType;
    if (!bytes || !["image/jpeg", "image/png", "image/webp"].includes(contentType)) return notFound();

    return new NextResponse(bytes, {
      headers: { "Content-Type": contentType, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return notFound();
  }
}
