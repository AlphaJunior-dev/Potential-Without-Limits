import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const readSource = (path) => readFile(new URL(path, root), "utf8");

test("homepage retains the original-style public section sequence using safe sources", async () => {
  const page = await readSource("src/app/page.tsx");

  for (const marker of [
    "readPublicSite",
    "Foundation Introduction &amp; Impact",
    "Sponsor a Dream",
    "From Potential to Purpose",
    "Accountability &amp; stewardship",
  ]) {
    assert.match(page, new RegExp(marker));
  }

  for (const prohibitedPublicPattern of [
    "useAuth",
    "INITIAL_YOUTH_PROFILES",
    "transparencyReports",
    "images.unsplash.com",
    "Sponsor Login",
  ]) {
    assert.doesNotMatch(page, new RegExp(prohibitedPublicPattern));
  }
});

test("restored header directs public sponsor actions to private orientation, not login", async () => {
  const header = await readSource("src/components/SiteHeader.tsx");

  assert.match(header, /Book Orientation Call/);
  assert.match(header, /href="\/orientation"/);
  assert.doesNotMatch(header, /Sponsor Login/);
  assert.doesNotMatch(header, /useAuth/);
});

