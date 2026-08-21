import "server-only";

import { createClient } from "@supabase/supabase-js";

export const PWLIF_MEDIA_BUCKET = "pwlif-media";
const permittedContentTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function serverMediaClient() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secretKey) throw new Error("SUPABASE_MEDIA_NOT_CONFIGURED");

  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Creates a private, server-managed bucket on its first administrator upload. */
async function ensurePrivateMediaBucket() {
  const client = serverMediaClient();
  const { error } = await client.storage.createBucket(PWLIF_MEDIA_BUCKET, {
    public: false,
    fileSizeLimit: 4 * 1024 * 1024,
    allowedMimeTypes: [...permittedContentTypes],
  });

  if (error && !/already exists|duplicate/i.test(error.message)) {
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
