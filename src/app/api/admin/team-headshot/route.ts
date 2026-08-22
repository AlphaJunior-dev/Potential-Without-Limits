import { NextRequest, NextResponse } from "next/server";
import { adminDb, requireAdministrator } from "@/lib/admin";
import { storeTeamHeadshot } from "@/lib/supabase-media";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function imageTypeFromBytes(bytes: Uint8Array) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { contentType: "image/jpeg", extension: "jpg" };
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return { contentType: "image/png", extension: "png" };
  if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return { contentType: "image/webp", extension: "webp" };
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const administrator = await requireAdministrator(request);
    const form = await request.formData();
    const photo = form.get("photo");
    if (!photo || typeof photo === "string") return NextResponse.json({ error: "Choose one JPEG, PNG, or WebP headshot." }, { status: 400 });
    if (photo.size === 0 || photo.size > MAX_IMAGE_BYTES) return NextResponse.json({ error: "Each Team headshot must be between 1 byte and 4 MB." }, { status: 400 });

    const bytes = new Uint8Array(await photo.arrayBuffer());
    const image = imageTypeFromBytes(bytes);
    if (!image) return NextResponse.json({ error: "Only JPEG, PNG, and WebP headshots are accepted." }, { status: 400 });

    const asset = adminDb().collection("team_headshot_assets").doc();
    const storagePath = await storeTeamHeadshot(asset.id, bytes, image.contentType, image.extension);
    await asset.set({ storagePath, mediaProvider: "supabase", contentType: image.contentType, size: bytes.byteLength, uploadedBy: administrator.uid, createdAt: new Date() });
    return NextResponse.json({ url: `/api/team-headshot/${asset.id}` }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload could not be completed.";
    console.error("Team headshot upload failed", { message });
    if (message === "UNAUTHENTICATED") return NextResponse.json({ error: "Sign in as an administrator before uploading a headshot." }, { status: 401 });
    if (message === "FORBIDDEN") return NextResponse.json({ error: "Administrator access is required to upload a headshot." }, { status: 403 });
    if (message === "SUPABASE_MEDIA_NOT_CONFIGURED") return NextResponse.json({ error: "The private media service is not configured yet." }, { status: 503 });
    return NextResponse.json({ error: "The headshot could not be stored. Please try again." }, { status: 500 });
  }
}
