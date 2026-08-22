import { NextRequest, NextResponse } from "next/server";
import { adminDb, requireAdministrator } from "@/lib/admin";
import { createTalentVideoUploadTarget, MAX_TALENT_VIDEO_BYTES } from "@/lib/supabase-media";

export const runtime = "nodejs";

const assetIdPattern = /^[A-Za-z0-9_-]{8,80}$/;
const allowedContentTypes = new Set(["video/mp4", "video/webm"]);

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Video upload could not be completed.";
  console.error("Talent video upload failed", { message });
  if (message === "UNAUTHENTICATED") return NextResponse.json({ error: "Sign in as an administrator before uploading a video." }, { status: 401 });
  if (message === "FORBIDDEN") return NextResponse.json({ error: "Administrator access is required to upload a video." }, { status: 403 });
  if (message === "SUPABASE_MEDIA_NOT_CONFIGURED") return NextResponse.json({ error: "The private media service is not configured yet." }, { status: 503 });
  return NextResponse.json({ error: "The video could not be prepared for secure storage. Please try again." }, { status: 500 });
}

/**
 * Starts and completes a direct-to-Supabase upload. The request body never
 * carries video bytes through Vercel, avoiding request-body limits while every
 * capability remains bound to the verified administrator who requested it.
 */
export async function POST(request: NextRequest) {
  try {
    const administrator = await requireAdministrator(request);
    const body = await request.json().catch(() => ({})) as { action?: unknown; contentType?: unknown; size?: unknown; assetId?: unknown };

    if (body.action === "start") {
      const contentType = typeof body.contentType === "string" ? body.contentType.toLowerCase() : "";
      const size = typeof body.size === "number" ? body.size : 0;
      if (!allowedContentTypes.has(contentType) || !Number.isSafeInteger(size) || size < 1 || size > MAX_TALENT_VIDEO_BYTES) {
        return NextResponse.json({ error: "Choose one MP4 or WebM video between 1 byte and 50 MB." }, { status: 400 });
      }

      const asset = adminDb().collection("talent_video_assets").doc();
      const target = await createTalentVideoUploadTarget(asset.id, contentType);
      await asset.set({
        storagePath: target.storagePath,
        mediaProvider: "supabase",
        contentType,
        size,
        uploadedBy: administrator.uid,
        uploadState: "pending",
        createdAt: new Date(),
      });
      return NextResponse.json({ assetId: asset.id, uploadUrl: target.signedUrl }, { headers: { "Cache-Control": "private, no-store" } });
    }

    if (body.action === "complete") {
      const assetId = typeof body.assetId === "string" ? body.assetId : "";
      if (!assetIdPattern.test(assetId)) return NextResponse.json({ error: "The video upload reference is invalid." }, { status: 400 });
      const asset = adminDb().collection("talent_video_assets").doc(assetId);
      const snapshot = await asset.get();
      if (!snapshot.exists || snapshot.data()?.uploadedBy !== administrator.uid || snapshot.data()?.uploadState !== "pending") {
        return NextResponse.json({ error: "The video upload could not be verified." }, { status: 404 });
      }
      await asset.update({ uploadState: "ready", completedAt: new Date() });
      return NextResponse.json({ url: `/api/talent-video/${assetId}` }, { headers: { "Cache-Control": "private, no-store" } });
    }

    return NextResponse.json({ error: "Unsupported Talent video operation." }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}
