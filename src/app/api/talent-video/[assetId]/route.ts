import { NextRequest, NextResponse } from "next/server";
import { adminDb, toPublicTalentCard } from "@/lib/admin";
import { createTalentVideoReadUrl } from "@/lib/supabase-media";

export const runtime = "nodejs";

const assetIdPattern = /^[A-Za-z0-9_-]{8,80}$/;
const allowedContentTypes = new Set(["video/mp4", "video/webm"]);

function notFound() {
  return NextResponse.json({ error: "Talent video not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
}

/** Public playback is permitted only for a linked record with public profile and media release enabled. */
export async function GET(_request: NextRequest, context: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await context.params;
  if (!assetIdPattern.test(assetId)) return notFound();

  try {
    const videoUrl = `/api/talent-video/${assetId}`;
    const linked = await adminDb().collection("sponsor_talent_records").where("mediaUrls", "array-contains", videoUrl).limit(1).get();
    const card = linked.empty ? null : toPublicTalentCard(linked.docs[0]!.id, linked.docs[0]!.data());
    if (!card || !card.mediaUrls?.includes(videoUrl)) return notFound();

    const asset = await adminDb().collection("talent_video_assets").doc(assetId).get();
    const storagePath = asset.data()?.storagePath;
    const contentType = asset.data()?.contentType;
    if (asset.data()?.uploadState !== "ready" || typeof storagePath !== "string" || !allowedContentTypes.has(contentType)) return notFound();

    const signedUrl = await createTalentVideoReadUrl(storagePath);
    const response = NextResponse.redirect(signedUrl, 307);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch {
    return notFound();
  }
}
