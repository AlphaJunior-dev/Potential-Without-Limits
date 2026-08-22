import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const readSource = (path) => readFile(new URL(path, root), "utf8");

test("homepage uses the approved Potential in Motion sequence, published Sponsor Talent cards, and no Foundation Introduction placeholder", async () => {
  const page = await readSource("src/app/page.tsx");

  for (const marker of [
    "Potential moves when possibility has a pathway.",
    "A glimpse of potential—shared with care.",
    "From initial interest to an appropriate private connection.",
  ]) {
    assert.match(page, new RegExp(marker));
  }

  for (const prohibitedPublicPattern of [
    "INITIAL_YOUTH_PROFILES",
    "Foundation introduction",
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

test("existing Team and FAQ shells receive safe published content and unfinished public wording avoids Rwanda-pilot labels", async () => {
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

  assert.match(pilotPage, /ComingSoonPage/);
  assert.doesNotMatch(pilotPage, /Rwanda pilot/i);
  assert.match(footer, /Sponsor Talent/);
  assert.doesNotMatch(footer, /Rwanda pilot/i);
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
  const [adminPage, provider, adminRoute, loginPage, sponsorSetupPage, bookCall, orientationForm, orientationRoute, sponsorRoute, publicRoute, pendingPage, adminLibrary] = await Promise.all([
    readSource("src/app/admin/page.tsx"),
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/api/admin/route.ts"),
    readSource("src/app/login/page.tsx"),
    readSource("src/app/sponsor/setup/page.tsx"),
    readSource("src/app/book-a-call/page.tsx"),
    readSource("src/components/OrientationForm.tsx"),
    readSource("src/app/api/orientation/route.ts"),
    readSource("src/app/api/sponsor/route.ts"),
    readSource("src/app/api/public/route.ts"),
    readSource("src/app/pending/page.tsx"),
    readSource("src/lib/admin.ts"),
  ]);

  assert.match(adminPage, /provisionSponsorManual/);
  assert.match(adminPage, /manualPostCallConfirmed/);
  assert.match(adminPage, /Send Sponsor Invitation/);
  assert.match(provider, /runOperationalAction\("sendSponsorInvitation"/);
  assert.match(provider, /runOperationalAction\("createManualSponsorInvitation"/);
  assert.match(provider, /postCallConfirmed: true/);
  assert.match(adminRoute, /body\.action === "sendSponsorInvitation"/);
  assert.match(adminRoute, /requestSponsorSetupEmail/);
  assert.match(adminRoute, /requestType: "PASSWORD_RESET"/);
  assert.match(adminRoute, /provisionPasswordSponsorAccount/);
  assert.match(adminRoute, /randomBytes\(32\)/);
  assert.match(adminRoute, /invitationStatus: "requested"/);
  assert.match(adminRoute, /body\.action === "revokeSponsorAccess"/);
  assert.match(adminRoute, /revokeRefreshTokens/);
  assert.match(adminPage, /Orientation Form Submission/);
  assert.match(adminPage, /Organization description/);
  assert.match(adminPage, /Revoke Access/);
  assert.doesNotMatch(adminPage, /Vetting Call Status|Call Scheduled|Revoke &amp; Delete Sponsor/);
  assert.match(provider, /revokeSponsorAccess/);
  assert.match(adminLibrary, /account\.data\(\)\?\.accessStatus === "revoked"/);
  assert.match(loginPage, /login\(email, password, "sponsor"\)/);
  assert.match(provider, /portal === "admin"/);
  assert.match(provider, /We could not verify these administrator credentials/);
  assert.match(provider, /portal === "sponsor"/);
  assert.match(provider, /signInWithEmailAndPassword/);
  assert.match(loginPage, /setup"\) === "complete"/);
  assert.match(loginPage, /Your password has been set/);
  assert.doesNotMatch(loginPage, /updatePassword|signInWithEmailLink/);
  assert.match(sponsorSetupPage, /Firebase’s secure password page/);
  assert.doesNotMatch(sponsorSetupPage, /verifyPasswordResetCode|confirmPasswordReset/);
  assert.match(adminRoute, /new URL\("\/login", configuredContinueUrl\)/);
  assert.match(adminRoute, /setupCompletionUrl\.searchParams\.set\("setup", "complete"\)/);
  assert.match(adminRoute, /canHandleCodeInApp: false/);
  assert.match(loginPage, /router\.replace\("\/sponsor\/dashboard"\)/);
  assert.match(loginPage, /destination === "admin" \? "\/admin" : "\/sponsor\/dashboard"/);
  assert.match(provider, /Sponsor access is activated only after orientation approval/);
  assert.match(provider, /action: "completePasswordSetup"/);
  assert.match(sponsorRoute, /passwordSetupCompletedAt/);
  assert.match(bookCall, /\/api\/orientation/);
  assert.match(bookCall, /type="url"/);
  assert.match(orientationForm, /calendly-inline-widget/);
  assert.match(orientationRoute, /websiteOrLinkedIn/);
  assert.match(sponsorRoute, /websiteOrLinkedIn/);
  assert.match(adminRoute, /sponsor_applications/);
  assert.doesNotMatch(publicRoute, /websiteOrLinkedIn|sponsor_applications/);
  for (const source of [bookCall, orientationForm, orientationRoute, provider, sponsorRoute]) {
    assert.doesNotMatch(source, /preferredTime|preferredContactWindow/);
  }
  assert.match(pendingPage, /create your own dashboard password/i);

  for (const source of [adminPage, loginPage, bookCall, pendingPage]) {
    assert.doesNotMatch(source, /Temporary Token Password|Temporary Access Password|Generate Credentials|Credentials Token/i);
  }
});

test("the redesigned sponsor dashboard uses a dedicated portal header and separates approved-sponsor pipeline access from public visibility controls", async () => {
  const [dashboard, sponsorRoute, sponsorTalentRoute, sponsorTalentPage, adminLibrary, navbar] = await Promise.all([
    readSource("src/app/sponsor/dashboard/page.tsx"),
    readSource("src/app/api/sponsor/route.ts"),
    readSource("src/app/api/sponsor/talent/[id]/route.ts"),
    readSource("src/app/sponsor/talent/[id]/page.tsx"),
    readSource("src/lib/admin.ts"),
    readSource("src/components/Navbar.tsx"),
  ]);

  assert.match(dashboard, /fetch\("\/api\/sponsor"/);
  assert.match(dashboard, /authenticatedUser\.getIdToken\(true\)/);
  assert.match(dashboard, /Partnership, with purpose\./);
  assert.match(dashboard, /Notifications/);
  assert.match(dashboard, /Private Sponsor Talent directory/);
  assert.match(dashboard, /\/sponsor\/talent\/\$\{record\.id\}/);
  assert.match(dashboard, /updatePassword/);
  assert.match(dashboard, /onClick=\{\(\) => logout\(\)\}/);
  assert.doesNotMatch(dashboard, /-mt-7/);
  assert.doesNotMatch(dashboard, /pendingSponsors|PWLIF Partner|Focus Track Interests|Tier:/);

  assert.match(sponsorRoute, /requireApprovedSponsor\(request\)/);
  assert.match(sponsorRoute, /collection\("sponsor_accounts"\)\.doc\(sponsor\.uid\)/);
  assert.match(sponsorRoute, /collection\("sponsor_talent_records"\)/);
  assert.match(sponsorRoute, /toSponsorTalentCard/);
  assert.doesNotMatch(sponsorRoute, /visibility\.profileVisible/);
  assert.match(sponsorTalentRoute, /requireApprovedSponsor\(request\)/);
  assert.match(sponsorTalentRoute, /collection\("sponsor_talent_records"\)\.doc\(id\)/);
  assert.match(sponsorTalentRoute, /toSponsorTalentCard/);
  assert.match(sponsorTalentRoute, /Cache-Control": "private, no-store"/);
  assert.match(sponsorTalentPage, /\/api\/sponsor\/talent\/\$\{encodeURIComponent\(id\)\}/);
  assert.match(sponsorTalentPage, /Approved sponsor access/);
  assert.match(adminLibrary, /export function toPublicTalentCard/);
  assert.match(adminLibrary, /export function toSponsorTalentCard/);
  assert.match(navbar, /pathname\?\.startsWith\("\/sponsor\/"\)/);
  assert.doesNotMatch(sponsorRoute, /firebase\/firestore|localStorage|sessionStorage/);
});

test("approved sponsors retain the private Talent pipeline while public visitors can browse only published consent-controlled Sponsor Talent profiles", async () => {
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
  assert.match(homepage, /const featuredProfiles = profiles\.slice\(0, 3\)/);
  assert.match(homepage, /\/portfolio\/\$\{profile\.id\}/);
  assert.doesNotMatch(homepage, /Foundation introduction/);
  assert.match(talentsPage, /Explore a careful introduction to potential\./);
  assert.match(talentsPage, /talentTags\.filter/);
  assert.match(talentsPage, /hasApprovedSponsorAccess/);
  assert.match(detailPage, /const profile = profiles\.find/);
  assert.match(detailPage, /Published public overview/);
  assert.match(detailPage, /publicVisibility\?\.photoVisible === true/);
  assert.doesNotMatch(detailPage, /TalentVideo/);
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
  assert.match(adminPage, /All public fields are hidden by default/);
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
    adminPage.indexOf("Public visibility controls"),
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

test("Talent videos remain in bounded private storage while public profiles intentionally do not render video playback", async () => {
  const [adminPage, provider, uploadRoute, publicRoute, privateRoute, adminLibrary, mediaLibrary, player, publicDetail, sponsorDetail] = await Promise.all([
    readSource("src/app/admin/page.tsx"),
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/api/admin/talent-video/route.ts"),
    readSource("src/app/api/talent-video/[assetId]/route.ts"),
    readSource("src/app/api/private/talent-video/[assetId]/route.ts"),
    readSource("src/lib/admin.ts"),
    readSource("src/lib/supabase-media.ts"),
    readSource("src/components/TalentVideo.tsx"),
    readSource("src/app/portfolio/[id]/page.tsx"),
    readSource("src/app/sponsor/talent/[id]/page.tsx"),
  ]);

  assert.match(adminPage, /uploadTalentVideo/);
  assert.match(adminPage, /isVideoUploading/);
  assert.match(adminPage, /media-release consent/);
  assert.doesNotMatch(adminPage, /Raw Media Video URL/);

  assert.match(provider, /MAX_TALENT_VIDEO_SOURCE_BYTES = 50 \* 1024 \* 1024/);
  assert.match(provider, /action: "start"/);
  assert.match(provider, /action: "complete"/);
  assert.match(provider, /fetch\("\/api\/admin\/talent-video"/);
  assert.match(provider, /x-upsert/);
  assert.match(provider, /internalTalentVideoPattern/);
  assert.doesNotMatch(provider, /SUPABASE_SERVICE_ROLE_KEY/);

  assert.match(uploadRoute, /requireAdministrator\(request\)/);
  assert.match(uploadRoute, /allowedContentTypes/);
  assert.match(uploadRoute, /MAX_TALENT_VIDEO_BYTES/);
  assert.match(uploadRoute, /collection\("talent_video_assets"\)/);
  assert.match(uploadRoute, /createTalentVideoUploadTarget/);
  assert.match(uploadRoute, /uploadedBy: administrator\.uid/);
  assert.match(uploadRoute, /uploadState: "pending"/);
  assert.match(uploadRoute, /uploadState: "ready"/);

  assert.match(mediaLibrary, /MAX_TALENT_VIDEO_BYTES = 50 \* 1024 \* 1024/);
  assert.match(mediaLibrary, /video\/mp4/);
  assert.match(mediaLibrary, /video\/webm/);
  assert.match(mediaLibrary, /public: false/);
  assert.match(mediaLibrary, /storage\.getBucket\(PWLIF_MEDIA_BUCKET\)/);
  assert.doesNotMatch(mediaLibrary, /storage\.updateBucket\(/);
  assert.match(mediaLibrary, /String\(lookupError\.status \?\? ""\) !== "404"/);
  assert.match(mediaLibrary, /function normalizeSupabaseServerUrl\(rawUrl: string\)/);
  assert.match(mediaLibrary, /apiPath !== "\/rest\/v1" && apiPath !== "\/storage\/v1"/);
  assert.match(mediaLibrary, /return parsed\.origin/);
  assert.match(mediaLibrary, /createSignedUploadUrl/);
  assert.match(mediaLibrary, /createSignedUrl/);

  assert.match(adminLibrary, /function safeTalentVideoUrl/);
  assert.match(adminLibrary, /mediaReleasePermission/);
  assert.match(adminLibrary, /record\.consent\.mediaReleasePermission/);
  assert.doesNotMatch(adminLibrary, /mediaUrls: rawMedia\.map\(safeAssetUrl\)/);

  assert.match(publicRoute, /toPublicTalentCard/);
  assert.match(publicRoute, /array-contains/);
  assert.match(publicRoute, /uploadState !== "ready"/);
  assert.match(privateRoute, /requireApprovedSponsor\(request\)/);
  assert.match(privateRoute, /toSponsorTalentCard/);
  assert.match(privateRoute, /"Cache-Control": "private, no-store"/);
  assert.doesNotMatch(privateRoute, /data\?\.uploadedBy !== administratorUid/);

  assert.match(player, /use client/);
  assert.match(player, /getIdToken\(true\)/);
  assert.match(player, /\/api\/private\/talent-video\//);
  assert.match(player, /access = "public"/);
  assert.match(player, /access === "private"/);
  assert.match(player, /Sign in to preview this protected Talent video/);
  assert.match(player, /controlsList="nodownload"/);
  assert.match(provider, /galleryVideos\.some\(isSafeTalentVideoUrl\)/);
  assert.match(adminPage, /<TalentVideo src=\{vUrl\} access="private"/);
  assert.match(adminPage, /disabled=\{isImageUploading \|\| isVideoUploading\}/);
  assert.match(publicDetail, /const profile = profiles\.find/);
  assert.match(publicDetail, /Cover image is not published\./);
  assert.doesNotMatch(publicDetail, /TalentVideo/);
  assert.doesNotMatch(publicDetail, /Approved media/);
  assert.match(sponsorDetail, /TalentVideo src=\{mediaUrl\} access="private"/);
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

test("the public Sponsor Talent directory filters only server-sanitized published profile data", async () => {
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
  assert.match(talentsPage, /profiles\.filter/);
  assert.match(talentsPage, /talentTags\.filter/);
  assert.match(talentsPage, /\/portfolio\/\$\{profile\.id\}/);
  assert.doesNotMatch(talentsPage, /TalentVideo/);
  assert.match(publicRoute, /skills: Array\.isArray\(showcaseCard\.skills\)/);
});

test("Foundation conversations accept only server-authorized sponsor messages and approved sessions no longer receive orientation prompts", async () => {
  const [adminRoute, sponsorRoute, provider, dashboard, navbar, homepage, supportModal, privateTalent, adminPage] = await Promise.all([
    readSource("src/app/api/admin/route.ts"),
    readSource("src/app/api/sponsor/route.ts"),
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/sponsor/dashboard/page.tsx"),
    readSource("src/components/Navbar.tsx"),
    readSource("src/app/page.tsx"),
    readSource("src/components/SupportModal.tsx"),
    readSource("src/app/sponsor/talent/[id]/page.tsx"),
    readSource("src/app/admin/page.tsx"),
  ]);

  assert.match(sponsorRoute, /requireApprovedSponsor\(request\)/);
  assert.match(sponsorRoute, /body\.action === "sendMessage"/);
  assert.match(sponsorRoute, /subject\.length > 200/);
  assert.match(sponsorRoute, /message\.length > 2_000/);
  assert.match(sponsorRoute, /collection\("sponsor_messages"\)\.doc\(\)/);
  assert.match(sponsorRoute, /collection\("thread"\)\.doc\(\)/);
  assert.match(sponsorRoute, /body\.action === "replyToConversation"/);
  assert.match(sponsorRoute, /sponsorUid: sponsor\.uid/);
  assert.match(sponsorRoute, /sponsorEmail/);
  assert.doesNotMatch(sponsorRoute, /firebase\/firestore|localStorage|sessionStorage/);

  assert.match(adminRoute, /collection\("sponsor_messages"\)/);
  assert.match(adminRoute, /foundationInbox/);
  assert.match(adminRoute, /body\.action === "resolveInboxItem"/);
  assert.match(adminRoute, /body\.action === "replyToSponsorConversation"/);
  assert.match(adminRoute, /reviewedBy: administrator\.uid/);
  assert.match(provider, /setInquiries\(Array\.isArray\(data\.foundationInbox\)/);
  assert.match(provider, /const sendInquiry = async/);
  assert.match(provider, /action: "sendMessage"/);
  assert.match(adminPage, /Foundation Conversations/);
  assert.match(adminPage, /Reply to sponsor/);
  assert.match(adminPage, /Mark Reviewed/);

  assert.match(supportModal, /fetch\("\/api\/contact"/);
  assert.match(dashboard, /handleFoundationMessage/);
  assert.match(dashboard, /sendInquiry\(messageSubject, messageBody\)/);
  assert.match(privateTalent, /Not yet available in this record/);
  assert.match(privateTalent, /action: "sendMessage"/);
  assert.doesNotMatch(privateTalent, /if \(!body\) return null/);

  assert.match(navbar, /userStatus === "approved"[\s\S]*?Partnership Desk/);
  assert.match(homepage, /action=\{hasApprovedSponsorAccess \? \{ href: "\/sponsor\/dashboard"[\s\S]*?\} : \{ href: "\/book-a-call"/);
  assert.match(homepage, /hasApprovedSponsorAccess \? `\/sponsor\/talent\/\$\{profile\.id\}` : `\/portfolio\/\$\{profile\.id\}`/);
});

test("public forms stay separate from sponsor conversations and preserve their approved contextual fields", async () => {
  const [contactRoute, adminRoute, adminPage, volunteerPage, partnershipPage, enquiryForm] = await Promise.all([
    readSource("src/app/api/contact/route.ts"),
    readSource("src/app/api/admin/route.ts"),
    readSource("src/app/admin/page.tsx"),
    readSource("src/app/volunteer/page.tsx"),
    readSource("src/app/partnership/page.tsx"),
    readSource("src/components/PublicEnquiryForm.tsx"),
  ]);

  assert.match(contactRoute, /collection\("public_form_submissions"\)\.add/);
  assert.match(contactRoute, /source/);
  assert.match(contactRoute, /details/);
  assert.doesNotMatch(contactRoute, /sponsor_messages/);
  assert.match(adminRoute, /collection\("public_form_submissions"\)/);
  assert.match(adminRoute, /body\.action === "resolvePublicSubmission"/);
  assert.match(adminPage, /Public Form Submissions/);
  assert.match(adminPage, /resolveSupportInquiry\(submission\.id, "public"\)/);
  assert.match(volunteerPage, /PublicEnquiryForm/);
  assert.match(partnershipPage, /PublicEnquiryForm/);
  assert.match(enquiryForm, /fetch\("\/api\/contact"/);
  assert.match(enquiryForm, /source/);
  assert.match(enquiryForm, /details: interest/);
});

test("Team publishing uses persistent administrator-authorized media and the requested public pages use controlled CMS data", async () => {
  const [adminPage, teamUpload, teamDelivery, mediaLibrary, adminRoute, adminLibrary, cmsData, howItWorks, updates, press, gallery, terms, privacy, security] = await Promise.all([
    readSource("src/app/admin/page.tsx"),
    readSource("src/app/api/admin/team-headshot/route.ts"),
    readSource("src/app/api/team-headshot/[id]/route.ts"),
    readSource("src/lib/supabase-media.ts"),
    readSource("src/app/api/admin/route.ts"),
    readSource("src/lib/admin.ts"),
    readSource("src/lib/cmsData.ts"),
    readSource("src/app/our-pilot/page.tsx"),
    readSource("src/app/foundation-updates/page.tsx"),
    readSource("src/app/press-resources/page.tsx"),
    readSource("src/app/media-gallery/page.tsx"),
    readSource("src/app/terms/page.tsx"),
    readSource("src/app/privacy/page.tsx"),
    readSource("src/app/security-standards/page.tsx"),
  ]);

  assert.match(adminPage, /handleTeamHeadshotUpload/);
  assert.match(adminPage, /fetch\("\/api\/admin\/team-headshot"/);
  assert.doesNotMatch(adminPage.slice(adminPage.indexOf("const handleTeamHeadshotUpload"), adminPage.indexOf("const handleImageUpload")), /FileReader|readAsDataURL/);
  assert.match(teamUpload, /requireAdministrator\(request\)/);
  assert.match(teamUpload, /storeTeamHeadshot/);
  assert.match(teamDelivery, /visibility\?\.isPublic === true/);
  assert.match(teamDelivery, /visibility\?\.showPhoto === true/);
  assert.match(mediaLibrary, /storeTeamHeadshot/);

  assert.match(cmsData, /EditorialPagesConfig/);
  assert.match(cmsData, /INITIAL_EDITORIAL_PAGES/);
  assert.match(adminRoute, /body\.action === "updateEditorialPages"/);
  assert.match(adminLibrary, /sanitizeEditorialPages/);
  assert.match(adminLibrary, /status === "published"/);
  for (const page of [howItWorks, updates, press, gallery]) assert.match(page, /ComingSoonPage/);
  assert.match(terms, /legalSecurity\?\.termsContent \|\|/);
  assert.match(privacy, /legalSecurity\?\.privacyContent \|\|/);
  assert.match(security, /legalSecurity\.securityStandardsContent \|\|/);
});

test("administrative controls contain no financial CMS and audit rendering is operational and read-only", async () => {
  const adminPage = await readSource("src/app/admin/page.tsx");

  assert.doesNotMatch(adminPage, /Transparency Financial CMS/);
  assert.doesNotMatch(adminPage, /activeSection === "transparency"/);
  assert.doesNotMatch(adminPage, /Financial and transparency workflows are unavailable/);
  assert.match(adminPage, /Operational Audit Trail/);
  assert.match(adminPage, /Read-only record of protected administrator operations/);
});

test("Sponsor sign-in validates the secured account before routing and Sponsor Overview tolerates incomplete manual records", async () => {
  const [provider, adminPage, sponsorRoute, adminLibrary] = await Promise.all([
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/admin/page.tsx"),
    readSource("src/app/api/sponsor/route.ts"),
    readSource("src/lib/admin.ts"),
  ]);

  assert.match(provider, /const sponsorAccess = await fetch\("\/api\/sponsor"/);
  assert.match(provider, /Sponsor account is not ready for dashboard access yet/);
  assert.match(provider, /payload\?\.reason === "revoked"/);
  assert.match(sponsorRoute, /reason = message === "SPONSOR_ACCESS_REVOKED" \? "revoked" : "authorization"/);
  assert.match(sponsorRoute, /console\.warn\("sponsor_access_denied", \{ code: message \|\| "UNKNOWN" \}\)/);
  assert.match(sponsorRoute, /where\("sponsorUid", "==", sponsor\.uid\)\.limit\(100\)\.get\(\)/);
  assert.doesNotMatch(sponsorRoute, /where\("sponsorUid", "==", sponsor\.uid\)\.orderBy\("updatedAt", "desc"\)/);
  assert.match(sponsorRoute, /sponsor_dashboard_read_failed/);
  assert.match(adminLibrary, /Earlier manual-approval records predate UID-keyed `sponsor_accounts` entries/);
  assert.match(adminLibrary, /SPONSOR_CLAIM_REQUIRED/);
  assert.match(adminLibrary, /SPONSOR_APPROVAL_REQUIRED/);
  assert.match(adminLibrary, /data\.status === "approved" && data\.accessStatus !== "revoked"/);
  assert.match(adminPage, /String\(selectedSponsorOverview\.email \|\| ""\)\.trim\(\)\.toLowerCase\(\)/);
  assert.match(adminPage, /typeof selectedSponsorOverview\.linkedin === "string"/);
});

test("private Sponsor routes wait for Firebase access resolution before redirecting", async () => {
  const [dashboard, detail] = await Promise.all([
    readSource("src/app/sponsor/dashboard/page.tsx"),
    readSource("src/app/sponsor/talent/[id]/page.tsx"),
  ]);

  assert.match(dashboard, /loading: authLoading/);
  assert.match(dashboard, /if \(authLoading\) return;/);
  assert.match(dashboard, /if \(!user\) \{\s*router\.replace\("\/login"\)/);
  assert.match(dashboard, /userStatus === "pending"\) router\.replace\("\/pending"\)/);
  assert.match(detail, /loading: authLoading/);
  assert.match(detail, /if \(authLoading\) return;/);
  assert.match(detail, /if \(!user\) \{\s*router\.replace\("\/login"\)/);
});

test("Social Links are administrator-managed, HTTPS-validated, and publicly limited to visible approved entries", async () => {
  const [adminPage, provider, adminRoute, adminLibrary, publicRoute, footer, cmsData] = await Promise.all([
    readSource("src/app/admin/page.tsx"),
    readSource("src/context/AuthContext.tsx"),
    readSource("src/app/api/admin/route.ts"),
    readSource("src/lib/admin.ts"),
    readSource("src/app/api/public/route.ts"),
    readSource("src/components/Footer.tsx"),
    readSource("src/lib/cmsData.ts"),
  ]);

  assert.match(adminPage, /Social Links CMS/);
  assert.match(adminPage, /updateSocialLinks\(socialLinkDraft\)/);
  assert.match(adminPage, /Show in public footer/);
  assert.match(provider, /updatePublicContent\("updateSocialLinks", \{ socialLinks: nextSocialLinks \}\)/);
  assert.match(adminRoute, /body\.action === "updateSocialLinks"/);
  assert.match(adminLibrary, /sanitizeSocialLinks/);
  assert.match(adminLibrary, /const url = safeAssetUrl\(item\.url\)/);
  assert.match(adminLibrary, /if \(!url \|\| seen\.has\(id\)\) return null/);
  assert.match(publicRoute, /socialLinks: site\.socialLinks/);
  assert.match(footer, /socialLinks\.filter\(\(link\) => link\.visible\)/);
  assert.match(cmsData, /potential-without-limits-international-foundation/);
  assert.match(cmsData, /DEFAULT_SOCIAL_LINKS/);
  assert.doesNotMatch(provider, /firebase\/firestore|setDoc\(|updateDoc\(/);
});

test("Firebase browser configuration receives its API key only from build-time environment configuration", async () => {
  const firebaseClient = await readSource("src/lib/firebase.ts");

  assert.match(firebaseClient, /apiKey: process\.env\.NEXT_PUBLIC_FIREBASE_API_KEY \|\| ""/);
  assert.doesNotMatch(firebaseClient, /AIza[0-9A-Za-z_-]{20,}/);
  assert.doesNotMatch(firebaseClient, /FIREBASE_PRIVATE_KEY|SUPABASE_SERVICE_ROLE_KEY/);
});
