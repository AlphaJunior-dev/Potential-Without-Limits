import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const readSource = (path) => readFile(new URL(path, root), "utf8");

test("homepage retains its original section sequence while avoiding hard-coded profile fallbacks", async () => {
  const page = await readSource("src/app/page.tsx");

  for (const marker of [
    "Foundation Introduction & Impact",
    "Explore Sponsor Talent",
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

test("existing Team and FAQ shells receive safe published content and public wording avoids Rwanda-pilot labels", async () => {
  const [team, faq, provider, publicRoute, pilotPage, footer] = await Promise.all([
    readSource("src/app/meet-the-team/page.tsx"),
    readSource("src/app/faq/page.tsx"),
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/api/public/route.ts"),
    readSource("src/app/our-pilot/page.tsx"),
    readSource("src/components/SiteFooter.tsx"),
  ]);

  assert.match(team, /teamMembers/);
  assert.match(faq, /faqItems/);
  assert.match(provider, /Array\.isArray\(data\?\.teamMembers\)/);
  assert.match(provider, /Array\.isArray\(data\?\.faqItems\)/);
  assert.match(publicRoute, /teamMembers/);
  assert.match(publicRoute, /faqItems/);

  for (const source of [pilotPage, footer]) {
    assert.match(source, /Sponsor Talent/);
    assert.doesNotMatch(source, /Rwanda pilot/i);
  }
});

test("branding changes use a fresh Firebase ID token, a protected route, and an allowlisted public-data merge", async () => {
  const [provider, adminRoute, publicRoute, adminLibrary] = await Promise.all([
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/api/admin/route.ts"),
    readSource("src/app/api/public/route.ts"),
    readSource("src/lib/admin.ts"),
  ]);

  assert.match(provider, /user\.getIdToken\(true\)/);
  assert.match(provider, /authorization: `Bearer \$\{token\}`/);
  assert.match(provider, /action: "updateBranding"/);
  assert.match(adminRoute, /body\.action === "updateBranding"/);
  assert.match(adminRoute, /sanitizePublicBranding/);
  assert.match(publicRoute, /\.\.\.site\.branding/);
  assert.match(adminLibrary, /function safeAssetUrl/);
  assert.doesNotMatch(provider, /firebase\/firestore|setDoc\(|updateDoc\(/);
});

test("approved public CMS actions use the protected route and the public reader returns their safe payloads", async () => {
  const [provider, adminRoute, publicRoute, adminLibrary, missionPage] = await Promise.all([
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/api/admin/route.ts"),
    readSource("src/app/api/public/route.ts"),
    readSource("src/lib/admin.ts"),
    readSource("src/app/mission-vision/page.tsx"),
  ]);

  for (const action of ["updateMissionVision", "updateTeamMembers", "updateLegalSecurity", "updateFoundationVideos"]) {
    assert.match(provider, new RegExp(action));
    assert.match(adminRoute, new RegExp(`body\\.action === "${action}"`));
  }
  assert.match(adminLibrary, /sanitizePublicMissionVision/);
  assert.match(adminLibrary, /sanitizePublicTeam/);
  assert.match(adminLibrary, /sanitizePublicLegal/);
  assert.match(adminLibrary, /sanitizePublicVideos/);
  assert.match(publicRoute, /foundationVideos: site\.foundationVideos/);
  assert.match(missionPage, /missionVision\.mission/);
  assert.doesNotMatch(provider, /firebase\/firestore|setDoc\(|updateDoc\(/);
});

test("sponsor access is issued by post-call passwordless invitation rather than displayed credentials", async () => {
  const [adminPage, provider, adminRoute, loginPage, bookCall, pendingPage] = await Promise.all([
    readSource("src/app/admin/page.tsx"),
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/api/admin/route.ts"),
    readSource("src/app/login/page.tsx"),
    readSource("src/app/book-a-call/page.tsx"),
    readSource("src/app/pending/page.tsx"),
  ]);

  assert.match(adminPage, /provisionSponsorManual/);
  assert.match(adminPage, /manualPostCallConfirmed/);
  assert.match(adminPage, /Send Sponsor Invitation/);
  assert.match(provider, /runOperationalAction\("sendSponsorInvitation"/);
  assert.match(provider, /runOperationalAction\("createManualSponsorInvitation"/);
  assert.match(provider, /postCallConfirmed: true/);
  assert.match(adminRoute, /body\.action === "sendSponsorInvitation"/);
  assert.match(loginPage, /signInWithEmailLink/);
  assert.match(loginPage, /router\.replace\("\/sponsor\/dashboard"\)/);
  assert.match(bookCall, /\/api\/orientation/);
  assert.match(pendingPage, /passwordless(?: sign-in)? invitation/i);

  for (const source of [adminPage, loginPage, bookCall, pendingPage]) {
    assert.doesNotMatch(source, /Temporary Token Password|Temporary Access Password|Generate Credentials|Credentials Token/i);
  }
});
