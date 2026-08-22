import assert from "node:assert/strict";
import test from "node:test";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketId = "pwlif-media";
const headers = () => ({
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
});

test("Supabase server credential can reach and provision the private PWLIF media bucket", { skip: !supabaseUrl || !serviceRoleKey }, async () => {
  assert.match(supabaseUrl, /^https:\/\/[a-z0-9-]+\.supabase\.co$/i);
  assert.ok(serviceRoleKey);

  const response = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    headers: headers(),
  });

  assert.equal(response.ok, true);
  const buckets = await response.json();
  const existingBucket = buckets.find((bucket) => bucket.id === bucketId);

  if (!existingBucket) {
    const createResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        id: bucketId,
        name: bucketId,
        public: false,
        file_size_limit: 4 * 1024 * 1024,
        allowed_mime_types: ["image/jpeg", "image/png", "image/webp"],
      }),
    });
    assert.equal(createResponse.ok || createResponse.status === 409, true);
  }

  const verifyResponse = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucketId}`, {
    headers: headers(),
  });
  assert.equal(verifyResponse.ok, true);
  const bucket = await verifyResponse.json();
  assert.equal(bucket.public, false);
});
