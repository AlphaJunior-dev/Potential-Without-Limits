import "server-only";

import { createClient } from "@supabase/supabase-js";

export const PWLIF_MEDIA_BUCKET = "pwlif-media";
const permittedImageContentTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const permittedTalentVideoContentTypes = new Set(["video/mp4", "video/webm"]);
const permittedContentTypes = new Set([...permittedImageContentTypes, ...permittedTalentVideoContentTypes]);
export const MAX_TALENT_VIDEO_BYTES = 50 * 1024 * 1024;

function talentVideoExtension(contentType: string) {
  if (contentType === "video/mp4") return "mp4";
  if (contentType === "video/webm") return "webm";
  throw new Error("UNSUPPORTED_TALENT_VIDEO_TYPE");
}

function serverMediaClient() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secretKey) throw new Error("SUPABASE_MEDIA_NOT_CONFIGURED");

  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Creates a private, server-managed bucket only when it does not already exist. */
async function ensurePrivateMediaBucket() {
  const client = serverMediaClient();
  const { data: existingBucket, error: lookupError } = await client.storage.getBucket(PWLIF_MEDIA_BUCKET);
  if (existingBucket) return client;

  // A missing bucket is the only state that should lead to a write against the
  // bucket configuration. Reconfiguring an existing private bucket for every
  // Talent upload adds a privileged operation that is unnecessary for media
  // delivery and can fail even when the existing bucket is fully usable.
  if (lookupError && String(lookupError.status ?? "") !== "404") {
    console.error("Private media bucket lookup failed", {
      operation: "getBucket",
      status: lookupError.status ?? "unknown",
      code: lookupError.name ?? "unknown",
    });
    throw new Error("SUPABASE_MEDIA_BUCKET_UNAVAILABLE");
  }

  const { error: createError } = await client.storage.createBucket(PWLIF_MEDIA_BUCKET, {
    public: false,
    fileSizeLimit: MAX_TALENT_VIDEO_BYTES,
    allowedMimeTypes: [...permittedContentTypes],
  });

  if (createError && !/already exists|duplicate/i.test(createError.message)) {
    console.error("Private media bucket creation failed", {
      operation: "createBucket",
      status: createError.status ?? "unknown",
      code: createError.name ?? "unknown",
    });
    throw new Error("SUPABASE_MEDIA_BUCKET_UNAVAILABLE");
  }

  return client;
}

export async function storeTalentPhoto(assetId: string, bytes: Uint8Array, contentType: string, extension: string) {
  if (!permittedContentTypes.has(contentType)) throw new Error("UNSUPPORTED_MEDIA_TYPE");
  const storagePath = `talent-photos/${assetId}.${extension}`;
  const client = await ensurePrivateMediaBucket();
  const { error } = await client.storage.from(PWLIF_MEDIA_BUCKET).upload(storagePath, bytes, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error("SUPABASE_MEDIA_UPLOAD_FAILED");
  return storagePath;
}

export async function storeTeamHeadshot(assetId: string, bytes: Uint8Array, contentType: string, extension: string) {
  if (!permittedContentTypes.has(contentType)) throw new Error("UNSUPPORTED_MEDIA_TYPE");
  const storagePath = `team-headshots/${assetId}.${extension}`;
  const client = await ensurePrivateMediaBucket();
  const { error } = await client.storage.from(PWLIF_MEDIA_BUCKET).upload(storagePath, bytes, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error("SUPABASE_MEDIA_UPLOAD_FAILED");
  return storagePath;
}

export async function loadTalentPhoto(storagePath: string) {
  if (!/^talent-photos\/[A-Za-z0-9_-]{8,80}\.(?:jpg|png|webp)$/.test(storagePath)) {
    throw new Error("INVALID_MEDIA_PATH");
  }

  const { data, error } = await serverMediaClient().storage.from(PWLIF_MEDIA_BUCKET).download(storagePath);
  if (error || !data) throw new Error("SUPABASE_MEDIA_NOT_FOUND");
  return Buffer.from(await data.arrayBuffer());
}

export async function loadTeamHeadshot(storagePath: string) {
  if (!/^team-headshots\/[A-Za-z0-9_-]{8,80}\.(?:jpg|png|webp)$/.test(storagePath)) {
    throw new Error("INVALID_MEDIA_PATH");
  }

  const { data, error } = await serverMediaClient().storage.from(PWLIF_MEDIA_BUCKET).download(storagePath);
  if (error || !data) throw new Error("SUPABASE_MEDIA_NOT_FOUND");
  return Buffer.from(await data.arrayBuffer());
}

/**
 * Returns a short-lived, single-object upload capability for a validated
 * Talent video. The service-role key stays server-only; the browser receives
 * no bucket credential and can upload only to this generated path.
 */
export async function createTalentVideoUploadTarget(assetId: string, contentType: string) {
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(assetId) || !permittedTalentVideoContentTypes.has(contentType)) {
    throw new Error("UNSUPPORTED_TALENT_VIDEO_TYPE");
  }

  const storagePath = `talent-videos/${assetId}.${talentVideoExtension(contentType)}`;
  const client = await ensurePrivateMediaBucket();
  const { data, error } = await client.storage.from(PWLIF_MEDIA_BUCKET).createSignedUploadUrl(storagePath, { upsert: false });
  if (error || !data?.signedUrl) throw new Error("SUPABASE_MEDIA_UPLOAD_FAILED");
  return { storagePath, signedUrl: data.signedUrl };
}

/** Creates a brief playback URL for a confirmed video held in the private bucket. */
export async function createTalentVideoReadUrl(storagePath: string, expiresInSeconds = 300) {
  if (!/^talent-videos\/[A-Za-z0-9_-]{8,80}\.(?:mp4|webm)$/.test(storagePath)) {
    throw new Error("INVALID_MEDIA_PATH");
  }

  const expiresIn = Math.max(60, Math.min(600, Math.trunc(expiresInSeconds)));
  const { data, error } = await serverMediaClient().storage.from(PWLIF_MEDIA_BUCKET).createSignedUrl(storagePath, expiresIn);
  if (error || !data?.signedUrl) throw new Error("SUPABASE_MEDIA_NOT_FOUND");
  return data.signedUrl;
}
