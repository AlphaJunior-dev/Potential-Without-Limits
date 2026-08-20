import { NextRequest, NextResponse } from "next/server";
import { adminDb, requireAdministrator } from "@/lib/admin";

export const runtime = "nodejs";

// Firestore has a 1 MiB document limit. Keeping each photo below 192 KiB leaves
// material room for metadata and makes this a deliberately small, no-cost
// fallback—not a general-purpose file storage system.
const MAX_IMAGE_BYTES = 192 * 1024;

function imageTypeFromBytes(bytes: Uint8Array) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { contentType: "image/png", extension: "png" };
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { contentType: "image/webp", extension: "webp" };
  }

  return null;
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Upload could not be completed.";
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "unknown";

  // Do not expose stack traces or service-account details to the browser. The
  // compact diagnostic is retained in protected Vercel runtime logs instead.
  console.error("Talent photo upload failed", { code, message });

  if (message === "UNAUTHENTICATED") return NextResponse.json({ error: "Sign in as an administrator before uploading a photo." }, { status: 401 });
  if (message === "FORBIDDEN") return NextResponse.json({ error: "Administrator access is required to upload a photo." }, { status: 403 });
  return NextResponse.json({ error: "The image could not be stored. Please try again." }, { status: 500 });
}

/**
 * Stores a small, validated Talent photo only after the Firebase administrator
 * claim has been verified server-side. The raw bytes are never returned in
 * public CMS data and are served only by dedicated visibility-aware routes.
 */
export async function POST(request: NextRequest) {
  try {
    const administrator = await requireAdministrator(request);
    const form = await request.formData();
    const photo = form.get("photo");

    if (!photo || typeof photo === "string") {
      return NextResponse.json({ error: "Choose one JPEG, PNG, or WebP photo to upload." }, { status: 400 });
    }

    if (photo.size === 0 || photo.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Each Talent photo must be between 1 byte and 192 KB for the Foundation's no-cost image service." }, { status: 400 });
    }

    const bytes = new Uint8Array(await photo.arrayBuffer());
    const image = imageTypeFromBytes(bytes);
    if (!image) {
      return NextResponse.json({ error: "Only JPEG, PNG, and WebP Talent photos are accepted." }, { status: 400 });
    }

    const asset = adminDb().collection("talent_photo_assets").doc();
    await asset.set({
      bytes: Buffer.from(bytes),
      contentType: image.contentType,
      uploadedBy: administrator.uid,
      createdAt: new Date(),
    });

    const url = `/api/talent-photo/${asset.id}`;
    return NextResponse.json({ url }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
