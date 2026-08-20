import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const readSource = (path) => readFile(new URL(path, root), "utf8");

test("homepage uses the approved Potential in Motion sequence while avoiding hard-coded profile fallbacks", async () => {
  const page = await readSource("src/app/page.tsx");

  for (const marker of [
    "Potential moves when possibility has a pathway.",
    "A glimpse of potential—shared with care.",
    "An invitation to understand the work before taking part.",
    "From initial interest to an appropriate private connection.",
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

test("public Talent retrieval applies the strict sanitizer after a server-only collection read", async () => {
  const adminLibrary = await readSource("src/lib/admin.ts");

  assert.match(adminLibrary, /collection\("sponsor_talent_records"\)\.limit\(100\)\.get\(\)/);
  assert.doesNotMatch(adminLibrary, /collection\("sponsor_talent_records"\)\.where\("visibility\.profileVisible"/);
  assert.match(adminLibrary, /collection\("pilot_overview_cards"\)\.limit\(100\)\.get\(\)/);
  assert.doesNotMatch(adminLibrary, /collection\("pilot_overview_cards"\)\.where\("status"/);
  assert.match(adminLibrary, /if \(card\.status !== "published"\) return null/);
  assert.match(adminLibrary, /\.map\(\(document\) => toPublicTalentCard\(document\.id, document\.data\(\)\)\)/);
  assert.match(adminLibrary, /if \(!record \|\| !record\.visibility\.profileVisible\) return null/);
});

test("sponsor access is issued by post-call verified invitation with sponsor-chosen credentials, never displayed credentials", async () => {
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
  assert.match(loginPage, /createUserWithEmailAndPassword|updatePassword/);
  assert.match(loginPage, /router\.replace\("\/sponsor\/dashboard"\)/);
  assert.match(bookCall, /\/api\/orientation/);
  assert.match(pendingPage, /create your own dashboard password/i);

  for (const source of [adminPage, loginPage, bookCall, pendingPage]) {
    assert.doesNotMatch(source, /Temporary Token Password|Temporary Access Password|Generate Credentials|Credentials Token/i);
  }
});

test("the redesigned sponsor dashboard uses a dedicated portal header and separates approved-sponsor pipeline access from public visibility controls", async () => {
  const [dashboard, sponsorRoute, adminLibrary, navbar] = await Promise.all([
    readSource("src/app/sponsor/dashboard/page.tsx"),
    readSource("src/app/api/sponsor/route.ts"),
    readSource("src/lib/admin.ts"),
    readSource("src/components/Navbar.tsx"),
  ]);

  assert.match(dashboard, /fetch\("\/api\/sponsor"/);
  assert.match(dashboard, /authenticatedUser\.getIdToken\(true\)/);
  assert.match(dashboard, /Partnership, with purpose\./);
  assert.match(dashboard, /Notifications/);
  assert.match(dashboard, /Private Sponsor Talent directory/);
  assert.match(dashboard, /onClick=\{\(\) => logout\(\)\}/);
  assert.doesNotMatch(dashboard, /-mt-7/);
  assert.doesNotMatch(dashboard, /pendingSponsors|PWLIF Partner|Focus Track Interests|Tier:/);

  assert.match(sponsorRoute, /requireApprovedSponsor\(request\)/);
  assert.match(sponsorRoute, /collection\("sponsor_accounts"\)\.doc\(sponsor\.uid\)/);
  assert.match(sponsorRoute, /collection\("sponsor_talent_records"\)/);
  assert.match(sponsorRoute, /toSponsorTalentCard/);
  assert.doesNotMatch(sponsorRoute, /visibility\.profileVisible/);
  assert.match(adminLibrary, /export function toPublicTalentCard/);
  assert.match(adminLibrary, /export function toSponsorTalentCard/);
  assert.match(navbar, /pathname\?\.startsWith\("\/sponsor\/"\)/);
  assert.doesNotMatch(sponsorRoute, /firebase\/firestore|localStorage|sessionStorage/);
});

test("approved sponsors automatically receive the private Talent pipeline on shared Foundation pages without changing anonymous public data", async () => {
  const [provider, homepage, talentsPage, detailPage, publicRoute, adminLibrary] = await Promise.all([
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/page.tsx"),
    readSource("src/app/talents/page.tsx"),
    readSource("src/app/portfolio/[id]/page.tsx"),
    readSource("src/app/api/public/route.ts"),
    readSource("src/lib/admin.ts"),
  ]);

  assert.match(provider, /const \[publicProfiles, setPublicProfiles\]/);
  assert.match(provider, /const \[sponsorProfiles, setSponsorProfiles\]/);
  assert.match(provider, /userStatus === "approved"\s*\? sponsorProfiles/);
  assert.match(provider, /fetch\("\/api\/sponsor"/);
  assert.match(provider, /authenticatedUser\.getIdToken\(true\)/);
  assert.match(provider, /privateSponsorAccess: true/);
  assert.match(provider, /setSponsorProfiles\(\[\]\)/);
  assert.match(provider, /location: record\.region \|\| \(record\.visibility\?\.profileVisible === true \? "Publicly displayed" : "Not publicly displayed"\)/);
  assert.match(homepage, /hasApprovedSponsorAccess/);
  assert.match(talentsPage, /hasApprovedSponsorAccess/);
  assert.match(detailPage, /profile\.privateSponsorAccess === true/);
  assert.match(detailPage, /profile\.publicVisibility\?\.photoVisible === true/);
  assert.match(detailPage, /const profile = profiles\.find\(\(p\) => p\.id === id\);/);
  assert.doesNotMatch(detailPage, /profiles\.find\(\(p\) => p\.id === id\) \?\? profiles\[0\]/);
  assert.match(publicRoute, /readPublicSite\(\)/);
  assert.match(publicRoute, /publicVisibility,/);
  assert.match(publicRoute, /galleryImages: card\.photoUrl \? \[card\.photoUrl\] : \[\]/);
  assert.match(adminLibrary, /export function toPublicTalentCard/);
  assert.match(adminLibrary, /visibility: \{/);
  assert.match(adminLibrary, /export function toSponsorTalentCard/);
});

test("the Talent design preview is administrator-only and never seeds mock records into live sponsor or public data paths", async () => {
  const [previewPage, previewRoute, sponsorRoute, publicRoute] = await Promise.all([
    readSource("src/app/admin/talent-preview/page.tsx"),
    readSource("src/app/api/admin/talent-preview/route.ts"),
    readSource("src/app/api/sponsor/route.ts"),
    readSource("src/app/api/public/route.ts"),
  ]);

  assert.match(previewPage, /userStatus !== "admin"/);
  assert.match(previewPage, /fetch\("\/api\/admin\/talent-preview"/);
  assert.match(previewPage, /Design preview only/);
  assert.match(previewRoute, /requireAdministrator\(request\)/);
  assert.match(previewRoute, /Cache-Control": "private, no-store"/);
  assert.doesNotMatch(previewRoute, /sponsor_talent_records|adminDb\(/);
  assert.doesNotMatch(sponsorRoute, /layout-sample-|Technology pathway|Creative practice/);
  assert.doesNotMatch(publicRoute, /layout-sample-|Technology pathway|Creative practice/);
});

test("Talent photo uploads use a verified administrator server boundary and preserve the two deliberate public-photo opt-ins", async () => {
  const [adminPage, provider, uploadRoute, adminLibrary, imageConfig, mediaLibrary] = await Promise.all([
    readSource("src/app/admin/page.tsx"),
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/api/admin/talent-photo/route.ts"),
    readSource("src/lib/admin.ts"),
    readSource("next.config.ts"),
    readSource("src/lib/supabase-media.ts"),
  ]);

  assert.match(adminPage, /uploadTalentPhoto/);
  assert.match(adminPage, /isImageUploading/);
  assert.match(adminPage, /A photo appears publicly only when both the profile and its cover-photo setting are enabled/);
  assert.match(adminPage, /md:sticky md:top-0 md:h-screen md:self-start md:overflow-y-auto/);
  const talentImageHandler = adminPage.slice(
    adminPage.indexOf("const handleImageUpload"),
    adminPage.indexOf("const handleVideoUpload"),
  );
  assert.doesNotMatch(talentImageHandler, /FileReader|readAsDataURL/);
  assert.match(talentImageHandler, /setCoverPhoto\(photoUrls\[0\] \|\| ""\)/);
  assert.match(talentImageHandler, /selected as the cover and ready to save/);
  const coverPhotoInput = adminPage.slice(
    adminPage.indexOf("Cover Photo URL"),
    adminPage.indexOf("Raw Media Video URL"),
  );
  assert.match(coverPhotoInput, /type="text"/);
  assert.match(coverPhotoInput, /inputMode="url"/);
  assert.doesNotMatch(coverPhotoInput, /type="url"/);

  assert.match(provider, /new FormData\(\)/);
  assert.match(provider, /prepareTalentPhotoForPrivateMedia/);
  assert.match(provider, /MAX_TALENT_PHOTO_SOURCE_BYTES = 4 \* 1024 \* 1024/);
  assert.match(provider, /form\.append\("photo", preparedPhoto\)/);
  assert.match(provider, /fetch\("\/api\/admin\/talent-photo"/);
  assert.match(provider, /getIdToken\(true\)/);

  assert.match(uploadRoute, /requireAdministrator\(request\)/);
  assert.match(uploadRoute, /MAX_IMAGE_BYTES/);
  assert.match(uploadRoute, /imageTypeFromBytes/);
  assert.match(uploadRoute, /adminDb\(\)\.collection\("talent_photo_assets"\)/);
  assert.match(uploadRoute, /storeTalentPhoto/);
  assert.match(uploadRoute, /4 \* 1024 \* 1024/);
  assert.match(uploadRoute, /mediaProvider: "supabase"/);
  assert.match(uploadRoute, /\/api\/talent-photo\/\$\{asset\.id\}/);
  assert.match(uploadRoute, /Talent photo upload failed/);
  assert.doesNotMatch(uploadRoute, /bytes: Buffer\.from\(bytes\)/);
  assert.doesNotMatch(uploadRoute, /setPublic\(/);
  assert.doesNotMatch(adminLibrary, /firebase-admin\/storage/);
  assert.doesNotMatch(adminLibrary, /storageBucket/);
  assert.match(mediaLibrary, /public: false/);
  assert.match(mediaLibrary, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(mediaLibrary, /allowedMimeTypes/);
  assert.match(imageConfig, /remotePatterns/);
});

test("the public header removes the redundant strapline and supports hover, click, keyboard, and mobile navigation", async () => {
  const navbar = await readSource("src/components/Navbar.tsx");

  assert.doesNotMatch(navbar, /Potential in Motion\s*<span[^>]*>\/\s*<\/span>\s*Privacy-first Talent development/);
  assert.match(navbar, /const \[activeDesktopMenu, setActiveDesktopMenu\]/);
  assert.match(navbar, /onMouseEnter=\{\(\) => setActiveDesktopMenu\(menu\.label\)\}/);
  assert.match(navbar, /onMouseLeave=\{\(\) => setActiveDesktopMenu\(null\)\}/);
  assert.match(navbar, /aria-expanded=\{isMenuOpen\}/);
  assert.match(navbar, /event\.key === "Escape"/);
  assert.match(navbar, /top-\[4\.85rem\]/);
  assert.match(navbar, /\{\/\* Mobile Slide-Over Menu Drawer \*\/\}[\s\S]*?<details key=\{menu\.label\}/);
});

test("the public Talent Showcase uses managed tags and remains empty until a reviewed Talent record is released", async () => {
  const [adminLibrary, adminPage, talentsPage, publicRoute] = await Promise.all([
    readSource("src/lib/admin.ts"),
    readSource("src/app/admin/page.tsx"),
    readSource("src/app/talents/page.tsx"),
    readSource("src/app/api/public/route.ts"),
  ]);

  assert.match(adminLibrary, /pilotCards: publishedTalentCards/);
  assert.match(adminLibrary, /sanitizeTalentTagLibrary/);
  assert.match(adminLibrary, /skillsVisible/);
  assert.match(adminPage, /updateTalentTags/);
  assert.match(adminPage, /Add a new skill or interest/);
  assert.match(adminPage, /consentReference/);
  assert.match(talentsPage, /talentTags\.filter/);
  assert.match(publicRoute, /skills: Array\.isArray\(showcaseCard\.skills\)/);
});
