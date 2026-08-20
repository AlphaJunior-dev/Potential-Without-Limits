import { NextRequest, NextResponse } from "next/server";
import { adminStorage, requireAdministrator } from "@/lib/admin";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

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
  if (message === "UNAUTHENTICATED") return NextResponse.json({ error: "Sign in as an administrator before uploading a photo." }, { status: 401 });
  if (message === "FORBIDDEN") return NextResponse.json({ error: "Administrator access is required to upload a photo." }, { status: 403 });
  return NextResponse.json({ error: "The image could not be stored. Please try again." }, { status: 500 });
}

/**
 * Stores one selected Talent photo only after the Firebase administrator claim
 * has been verified server-side. The client receives an HTTPS download URL that
 * the existing Talent sanitizer can safely persist and later control via the
 * profile and photo visibility switches.
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
      return NextResponse.json({ error: "Each Talent photo must be between 1 byte and 4 MB." }, { status: 400 });
    }

    const bytes = new Uint8Array(await photo.arrayBuffer());
    const image = imageTypeFromBytes(bytes);
    if (!image) {
      return NextResponse.json({ error: "Only JPEG, PNG, and WebP Talent photos are accepted." }, { status: 400 });
    }

    const bucket = adminStorage();
    const downloadToken = crypto.randomUUID();
    const objectName = `talent-photos/${administrator.uid}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${image.extension}`;
    const object = bucket.file(objectName);

    await object.save(Buffer.from(bytes), {
      resumable: false,
      validation: "crc32c",
      metadata: {
        contentType: image.contentType,
        cacheControl: "private, max-age=0, no-store",
        metadata: {
          uploadedBy: administrator.uid,
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket.name)}/o/${encodeURIComponent(objectName)}?alt=media&token=${downloadToken}`;
    return NextResponse.json({ url }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
