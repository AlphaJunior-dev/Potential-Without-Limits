import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const readSource = (path) => readFile(new URL(path, root), "utf8");

test("homepage retains its original section sequence while avoiding hard-coded profile fallbacks", async () => {
  const page = await readSource("src/app/page.tsx");

  for (const marker of [
    "Foundation Introduction & Impact",
    "Sponsor a Child's Dream",
    "From Potential to Purpose",
    "Accountability & Stewardship",
  ]) {
    assert.match(page, new RegExp(marker));
  }

  for (const prohibitedPublicPattern of [
    "INITIAL_YOUTH_PROFILES",
  ]) {
    assert.doesNotMatch(page, new RegExp(prohibitedPublicPattern));
  }
});

test("restored original interface receives public data through the safe provider boundary", async () => {
  const provider = await readSource("src/context/AuthContext.tsx");
  const cms = await readSource("src/lib/cmsData.ts");

  assert.match(provider, /fetch\("\/api\/public"\)/);
  assert.match(provider, /getIdTokenResult/);
  assert.match(provider, /claims\.admin === true/);
  assert.doesNotMatch(provider, /localStorage|sessionStorage|admin123|sponsor123|123456/);
  assert.doesNotMatch(cms, /firebase\/firestore|onSnapshot|setDoc\(|deleteDoc\(/);
});
