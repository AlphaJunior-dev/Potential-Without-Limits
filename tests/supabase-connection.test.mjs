import assert from "node:assert/strict";
import test from "node:test";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

test("Supabase server credential can reach the private Storage API", { skip: !supabaseUrl || !serviceRoleKey }, async () => {
  assert.match(supabaseUrl, /^https:\/\/[a-z0-9-]+\.supabase\.co$/i);
  assert.ok(serviceRoleKey);

  const response = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  assert.equal(response.ok, true);
});
