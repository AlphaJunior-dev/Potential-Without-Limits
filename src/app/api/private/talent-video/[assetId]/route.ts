import { NextRequest, NextResponse } from "next/server";
import { adminDb, requireAdministrator, requireApprovedSponsor, toSponsorTalentCard } from "@/lib/admin";
import { createTalentVideoReadUrl } from "@/lib/supabase-media";

export const runtime = "nodejs";

const assetIdPattern = /^[A-Za-z0-9_-]{8,80}$/;
const allowedContentTypes = new Set(["video/mp4", "video/webm"]);

function notFound() {
  return NextResponse.json({ error: "Talent video not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
}

/** Approved sponsors may access linked private videos; authenticated administrators may preview all protected Talent media. */
export async function GET(request: NextRequest, context: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await context.params;
  if (!assetIdPattern.test(assetId)) return notFound();

  try {
    const videoUrl = `/api/talent-video/${assetId}`;
    try {
      await requireAdministrator(request);
    } catch {
      await requireApprovedSponsor(request);
      const linked = await adminDb().collection("sponsor_talent_records").where("mediaUrls", "array-contains", videoUrl).limit(1).get();
      if (linked.empty || !toSponsorTalentCard(linked.docs[0]!.id, linked.docs[0]!.data())) return notFound();
    }

    const asset = await adminDb().collection("talent_video_assets").doc(assetId).get();
    const data = asset.data();
    const storagePath = data?.storagePath;
    const contentType = data?.contentType;
    if (!asset.exists || data?.uploadState !== "ready" || typeof storagePath !== "string" || !allowedContentTypes.has(contentType)) return notFound();

    return NextResponse.json({ url: await createTalentVideoReadUrl(storagePath) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return notFound();
  }
}
