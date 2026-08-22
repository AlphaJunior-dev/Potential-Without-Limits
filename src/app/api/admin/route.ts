import { FieldValue } from "firebase-admin/firestore";
import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  adminAuth,
  adminDb,
  requireAdministrator,
  sanitizeAdminTeam,
  sanitizeEditorialPages,
  sanitizePublicBranding,
  sanitizePublicLegal,
  sanitizePublicMissionVision,
  sanitizePublicVideos,
  sanitizeTalentCategoryLibrary,
  sanitizeTalentRecord,
  sanitizeTalentTagLibrary,
} from "@/lib/admin";

export const runtime = "nodejs";

const reviewStatuses = new Set(["new", "contacted", "call_scheduled", "approved", "declined"]);
type FoundationInboxItem = Record<string, unknown> & {
  id: string;
  type: "public" | "sponsor";
  status: string;
  createdAt?: unknown;
};

function timestampMillis(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object" && "toMillis" in value && typeof (value as { toMillis?: unknown }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (value && typeof value === "object") {
    const seconds = (value as { seconds?: unknown; _seconds?: unknown }).seconds ?? (value as { _seconds?: unknown })._seconds;
    if (typeof seconds === "number") return seconds * 1_000;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function deny(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return NextResponse.json({ error: "Administrator access required." }, { status: message === "UNAUTHENTICATED" ? 401 : 403 });
}

async function appendAudit(action: string, entityType: string, entityId: string, performedBy: string, details: Record<string, unknown> = {}) {
  await adminDb().collection("audit_log").add({
    action,
    entityType,
    entityId,
    performedBy,
    details,
    createdAt: FieldValue.serverTimestamp(),
  });
}

async function requestSponsorSetupEmail(email: string) {
  const apiKey = process.env.FIREBASE_WEB_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const configuredContinueUrl = process.env.FIREBASE_EMAIL_LINK_CONTINUE_URL;
  if (!apiKey || !configuredContinueUrl) throw new Error("Sponsor invitation delivery is not configured.");
  let continueUrl: string;
  try {
    // Firebase's hosted reset handler owns the one-time `oobCode`. A continue URL
    // is only reached after that handler has consumed the code, so it must return
    // to normal Sponsor login rather than to our custom code-validation screen.
    const setupCompletionUrl = new URL("/login", configuredContinueUrl);
    setupCompletionUrl.searchParams.set("setup", "complete");
    continueUrl = setupCompletionUrl.toString();
  } catch {
    throw new Error("Sponsor invitation delivery is not configured with a valid continue URL.");
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestType: "PASSWORD_RESET", email, continueUrl, canHandleCodeInApp: false }),
  });
  const payload = await response.json().catch(() => null) as { error?: { message?: string } } | null;
  if (!response.ok) {
    const providerMessage = payload?.error?.message;
    throw new Error(providerMessage ? `Firebase could not accept the sponsor invitation request: ${providerMessage}` : "Firebase could not accept the sponsor invitation request.");
  }
}

async function provisionPasswordSponsorAccount(email: string) {
  const temporaryPassword = randomBytes(32).toString("base64url");
  let userRecord;
  try {
    userRecord = await adminAuth().getUserByEmail(email);
    if (userRecord.customClaims?.admin === true) throw new Error("An administrator account cannot be provisioned as a sponsor.");
    await adminAuth().updateUser(userRecord.uid, { password: temporaryPassword, disabled: false });
  } catch (error: unknown) {
    const code = typeof error === "object" && error && "code" in error ? (error as { code?: string }).code : undefined;
    if (code !== "auth/user-not-found") throw error;
    userRecord = await adminAuth().createUser({ email, password: temporaryPassword, emailVerified: false, disabled: false });
  }
  await adminAuth().setCustomUserClaims(userRecord.uid, { ...(userRecord.customClaims ?? {}), sponsor: true });
  return userRecord;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdministrator(request);
    const db = adminDb();
    const [site, applications, cards, talentRecords, sponsorAccounts, audit, publicSubmissions, sponsorMessages] = await Promise.all([
      db.collection("public_site_content").doc("main").get(),
      db.collection("sponsor_applications").orderBy("createdAt", "desc").limit(100).get(),
      db.collection("pilot_overview_cards").orderBy("displayOrder", "asc").get(),
      db.collection("sponsor_talent_records").orderBy("displayOrder", "asc").limit(100).get(),
      db.collection("sponsor_accounts").orderBy("updatedAt", "desc").limit(100).get(),
      db.collection("audit_log").orderBy("createdAt", "desc").limit(150).get(),
      db.collection("public_form_submissions").orderBy("createdAt", "desc").limit(150).get(),
      db.collection("sponsor_messages").orderBy("createdAt", "desc").limit(150).get(),
    ]);
    const foundationInbox = (await Promise.all(sponsorMessages.docs.map(async (document) => {
      const thread = await document.ref.collection("thread").orderBy("createdAt", "asc").limit(200).get();
      return {
        id: document.id,
        type: "sponsor" as const,
        status: "new",
        ...document.data(),
        thread: thread.docs.map((message) => ({ id: message.id, ...message.data() })),
      } as FoundationInboxItem;
    }))).sort((first, second) => timestampMillis(second.createdAt) - timestampMillis(first.createdAt));
    return NextResponse.json({
      site: site.exists ? site.data() : {},
      applications: applications.docs.map((document) => ({ id: document.id, ...document.data() })),
      cards: cards.docs.map((document) => ({ id: document.id, ...document.data() })),
      talentRecords: talentRecords.docs.map((document) => ({ id: document.id, ...document.data() })),
      sponsorAccounts: sponsorAccounts.docs.map((document) => ({ id: document.id, ...document.data() })),
      audit: audit.docs.map((document) => ({ id: document.id, ...document.data() })),
      foundationInbox,
      publicSubmissions: publicSubmissions.docs.map((document) => ({ id: document.id, type: "public" as const, status: "new", ...document.data() })),
    });
  } catch (error) {
    return deny(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const administrator = await requireAdministrator(request);
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    const db = adminDb();

    if (body.action === "resolveInboxItem") {
      const itemId = typeof body.itemId === "string" ? body.itemId.trim() : "";
      if (!itemId) return NextResponse.json({ error: "A valid sponsor conversation is required." }, { status: 400 });
      const item = await db.collection("sponsor_messages").doc(itemId).get();
      if (!item.exists) return NextResponse.json({ error: "Foundation inbox item not found." }, { status: 404 });
      await item.ref.set({ status: "reviewed", reviewedAt: FieldValue.serverTimestamp(), reviewedBy: administrator.uid, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      await appendAudit("resolveInboxItem", "sponsor_conversation", itemId, administrator.uid);
      return NextResponse.json({ ok: true });
    } else if (body.action === "resolvePublicSubmission") {
      const submissionId = typeof body.submissionId === "string" ? body.submissionId.trim() : "";
      if (!submissionId) return NextResponse.json({ error: "A valid public form submission is required." }, { status: 400 });
      const submission = await db.collection("public_form_submissions").doc(submissionId).get();
      if (!submission.exists) return NextResponse.json({ error: "Public form submission not found." }, { status: 404 });
      await submission.ref.set({ status: "reviewed", reviewedAt: FieldValue.serverTimestamp(), reviewedBy: administrator.uid, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      await appendAudit("resolvePublicSubmission", "public_form_submission", submissionId, administrator.uid);
      return NextResponse.json({ ok: true });
    } else if (body.action === "replyToSponsorConversation") {
      const conversationId = typeof body.conversationId === "string" ? body.conversationId.trim() : "";
      const message = typeof body.message === "string" ? body.message.trim() : "";
      if (!conversationId || !message || message.length > 2_000) return NextResponse.json({ error: "Provide a reply of up to 2,000 characters." }, { status: 400 });
      const conversation = await db.collection("sponsor_messages").doc(conversationId).get();
      if (!conversation.exists) return NextResponse.json({ error: "Sponsor conversation not found." }, { status: 404 });
      const batch = db.batch();
      batch.set(conversation.ref.collection("thread").doc(), {
        sender: "foundation",
        senderUid: administrator.uid,
        senderName: "PWLIF Foundation Team",
        message,
        createdAt: FieldValue.serverTimestamp(),
      });
      batch.set(conversation.ref, { status: "replied", repliedAt: FieldValue.serverTimestamp(), repliedBy: administrator.uid, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      await batch.commit();
      await appendAudit("replyToSponsorConversation", "sponsor_conversation", conversationId, administrator.uid);
      return NextResponse.json({ ok: true });
    } else if (body.action === "updateSite") {
      await db.collection("public_site_content").doc("main").set({
        heroTitle: String(body.heroTitle ?? "").trim().slice(0, 160),
        heroText: String(body.heroText ?? "").trim().slice(0, 700),
        bookingUrl: String(body.bookingUrl ?? "").trim().slice(0, 300),
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: administrator.uid,
      }, { merge: true });
    } else if (body.action === "updateBranding") {
      const branding = sanitizePublicBranding(body.branding);
      if (!Object.keys(branding).length) return NextResponse.json({ error: "No supported branding values were supplied." }, { status: 400 });
      const update: Record<string, unknown> = { branding, updatedAt: FieldValue.serverTimestamp(), updatedBy: administrator.uid };
      if (branding.heroHeadline) update.heroTitle = branding.heroHeadline;
      if (branding.heroSubheadline) update.heroText = branding.heroSubheadline;
      await db.collection("public_site_content").doc("main").set(update, { merge: true });
      await appendAudit("updateBranding", "site_content", "main", administrator.uid);
      return NextResponse.json({ ok: true, branding });
    } else if (body.action === "updateMissionVision") {
      const missionVision = sanitizePublicMissionVision(body.missionVision);
      if (!missionVision.mission || !missionVision.vision) return NextResponse.json({ error: "Mission and vision are required." }, { status: 400 });
      await db.collection("public_site_content").doc("main").set({ missionVision, updatedAt: FieldValue.serverTimestamp(), updatedBy: administrator.uid }, { merge: true });
      await appendAudit("updateMissionVision", "site_content", "main", administrator.uid);
      return NextResponse.json({ ok: true, missionVision });
    } else if (body.action === "updateTeamMembers") {
      const teamMembers = sanitizeAdminTeam(body.teamMembers);
      await db.collection("public_site_content").doc("main").set({ teamMembers, updatedAt: FieldValue.serverTimestamp(), updatedBy: administrator.uid }, { merge: true });
      await appendAudit("updateTeamMembers", "site_content", "main", administrator.uid);
      return NextResponse.json({ ok: true, teamMembers });
    } else if (body.action === "updateLegalSecurity") {
      const legalSecurity = sanitizePublicLegal(body.legalSecurity);
      if (!legalSecurity.termsContent || !legalSecurity.privacyContent || !legalSecurity.securityStandardsContent) return NextResponse.json({ error: "Terms, privacy, and security standards are required." }, { status: 400 });
      await db.collection("public_site_content").doc("main").set({ legalSecurity, updatedAt: FieldValue.serverTimestamp(), updatedBy: administrator.uid }, { merge: true });
      await appendAudit("updateLegalSecurity", "site_content", "main", administrator.uid);
      return NextResponse.json({ ok: true, legalSecurity });
    } else if (body.action === "updateEditorialPages") {
      const editorialPages = sanitizeEditorialPages(body.editorialPages, true);
      const hasInvalidPublishedPage = Object.values(editorialPages).some((page) => page.status === "published" && (!page.title || !page.introduction || !page.body));
      if (hasInvalidPublishedPage) return NextResponse.json({ error: "A published page requires a title, introduction, and body." }, { status: 400 });
      const updatedAt = new Date().toISOString().slice(0, 10);
      const datedPages = Object.fromEntries(Object.entries(editorialPages).map(([key, page]) => [key, { ...page, updatedAt }])) as typeof editorialPages;
      await db.collection("public_site_content").doc("main").set({ editorialPages: datedPages, updatedAt: FieldValue.serverTimestamp(), updatedBy: administrator.uid }, { merge: true });
      await appendAudit("updateEditorialPages", "site_content", "main", administrator.uid);
      return NextResponse.json({ ok: true, editorialPages: datedPages });
    } else if (body.action === "updateFoundationVideos") {
      const foundationVideos = sanitizePublicVideos(body.foundationVideos);
      await db.collection("public_site_content").doc("main").set({ foundationVideos, updatedAt: FieldValue.serverTimestamp(), updatedBy: administrator.uid }, { merge: true });
      await appendAudit("updateFoundationVideos", "site_content", "main", administrator.uid);
      return NextResponse.json({ ok: true, foundationVideos });
    } else if (body.action === "updateTalentTagLibrary") {
      const talentTags = sanitizeTalentTagLibrary(body.talentTags);
      await db.collection("public_site_content").doc("main").set({ talentTags, updatedAt: FieldValue.serverTimestamp(), updatedBy: administrator.uid }, { merge: true });
      await appendAudit("updateTalentTagLibrary", "site_content", "main", administrator.uid, { activeTags: talentTags.filter((tag) => tag.status === "active").length });
      return NextResponse.json({ ok: true, talentTags });
    } else if (body.action === "updateTalentCategoryLibrary") {
      const talentCategories = sanitizeTalentCategoryLibrary(body.talentCategories);
      await db.collection("public_site_content").doc("main").set({ talentCategories, updatedAt: FieldValue.serverTimestamp(), updatedBy: administrator.uid }, { merge: true });
      await appendAudit("updateTalentCategoryLibrary", "site_content", "main", administrator.uid, { activeCategories: talentCategories.filter((category) => category.status === "active").length });
      return NextResponse.json({ ok: true, talentCategories });
    } else if (body.action === "reviewApplication" && typeof body.applicationId === "string") {
      if (typeof body.status !== "string" || !reviewStatuses.has(body.status)) return NextResponse.json({ error: "Invalid review status." }, { status: 400 });
      const reviewNote = typeof body.reviewNote === "string" ? body.reviewNote.trim().slice(0, 2_000) : "";
      const application = await db.collection("sponsor_applications").doc(body.applicationId).get();
      if (!application.exists) return NextResponse.json({ error: "Application not found." }, { status: 404 });
      await application.ref.set({
        status: body.status,
        review: { status: body.status, note: reviewNote, reviewedBy: administrator.uid, reviewedAt: FieldValue.serverTimestamp() },
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      await appendAudit("reviewApplication", "sponsor_application", body.applicationId, administrator.uid, { status: body.status });
      return NextResponse.json({ ok: true });
    } else if (body.action === "createManualSponsorInvitation") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 120) : "";
      const organization = typeof body.organization === "string" ? body.organization.trim().slice(0, 160) : "";
      if (!body.postCallConfirmed || !email || !email.includes("@") || !fullName) {
        return NextResponse.json({ error: "A confirmed post-call approval, name, and email address are required." }, { status: 400 });
      }
      const applicationRef = db.collection("sponsor_applications").doc();
      await applicationRef.set({
        fullName,
        email,
        organization,
        source: "manual_post_call_approval",
        status: "approved",
        review: { status: "approved", note: "Manually approved after orientation call.", reviewedBy: administrator.uid, reviewedAt: FieldValue.serverTimestamp() },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      const userRecord = await provisionPasswordSponsorAccount(email);
      try {
        await requestSponsorSetupEmail(email);
      } catch (error) {
        await db.collection("sponsor_accounts").doc(userRecord.uid).set({ email, applicationId: applicationRef.id, invitationStatus: "delivery_failed", deliveryStatus: "delivery_failed", updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        throw error;
      }
      await db.collection("sponsor_accounts").doc(userRecord.uid).set({
        email,
        applicationId: applicationRef.id,
        invitationStatus: "requested",
        deliveryStatus: "requested",
        invitationRequestedAt: FieldValue.serverTimestamp(),
        passwordSetupRequired: true,
        passwordSetupCompletedAt: null,
        accessStatus: "active",
        updatedAt: FieldValue.serverTimestamp(),
        assignedTalentIds: [],
      }, { merge: true });
      await appendAudit("sendManualSponsorInvitation", "sponsor_account", userRecord.uid, administrator.uid, { applicationId: applicationRef.id });
      return NextResponse.json({ ok: true, invitationStatus: "requested", applicationId: applicationRef.id });
    } else if (body.action === "sendSponsorInvitation" && typeof body.applicationId === "string") {
      const application = await db.collection("sponsor_applications").doc(body.applicationId).get();
      const data = application.data();
      const email = typeof data?.email === "string" ? data.email.trim().toLowerCase() : "";
      if (!application.exists || !email || data?.status !== "approved") return NextResponse.json({ error: "Only an approved application with an email address can receive an invitation." }, { status: 400 });
      const userRecord = await provisionPasswordSponsorAccount(email);
      try {
        await requestSponsorSetupEmail(email);
      } catch (error) {
        await db.collection("sponsor_accounts").doc(userRecord.uid).set({ email, applicationId: body.applicationId, invitationStatus: "delivery_failed", deliveryStatus: "delivery_failed", updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        throw error;
      }
      await db.collection("sponsor_accounts").doc(userRecord.uid).set({
        email,
        applicationId: body.applicationId,
        invitationStatus: "requested",
        deliveryStatus: "requested",
        invitationRequestedAt: FieldValue.serverTimestamp(),
        passwordSetupRequired: true,
        passwordSetupCompletedAt: null,
        accessStatus: "active",
        updatedAt: FieldValue.serverTimestamp(),
        assignedTalentIds: [],
      }, { merge: true });
      await appendAudit("sendSponsorInvitation", "sponsor_account", userRecord.uid, administrator.uid, { applicationId: body.applicationId });
      return NextResponse.json({ ok: true, invitationStatus: "requested" });
    } else if ((body.action === "createTalentRecord" || body.action === "updateTalentRecord") && body.talentRecord) {
      const talentRecord = sanitizeTalentRecord(body.talentRecord);
      if (!talentRecord) return NextResponse.json({ error: "A display title, non-identifying summary, and support area are required." }, { status: 400 });
      const document = body.action === "updateTalentRecord" && typeof body.talentId === "string"
        ? db.collection("sponsor_talent_records").doc(body.talentId)
        : db.collection("sponsor_talent_records").doc();
      await document.set({ ...talentRecord, updatedAt: FieldValue.serverTimestamp(), updatedBy: administrator.uid, createdAt: FieldValue.serverTimestamp() }, { merge: true });
      await appendAudit(body.action, "sponsor_talent", document.id, administrator.uid, { published: talentRecord.visibility.profileVisible });
      return NextResponse.json({ ok: true, talentRecord: { id: document.id, ...talentRecord } });
    } else if (body.action === "deleteTalentRecord" && typeof body.talentId === "string") {
      await db.collection("sponsor_talent_records").doc(body.talentId).delete();
      await appendAudit("deleteTalentRecord", "sponsor_talent", body.talentId, administrator.uid);
      return NextResponse.json({ ok: true });
    } else if (body.action === "revokeSponsorAccess" && typeof body.applicationId === "string") {
      const application = await db.collection("sponsor_applications").doc(body.applicationId).get();
      if (!application.exists) return NextResponse.json({ error: "Sponsor application not found." }, { status: 404 });
      const email = typeof application.data()?.email === "string" ? application.data()!.email.trim().toLowerCase() : "";
      if (!email) return NextResponse.json({ error: "This sponsor application has no email address." }, { status: 400 });
      try {
        const sponsorUser = await adminAuth().getUserByEmail(email);
        await adminAuth().setCustomUserClaims(sponsorUser.uid, { ...(sponsorUser.customClaims ?? {}), sponsor: false });
        await adminAuth().revokeRefreshTokens(sponsorUser.uid);
        await db.collection("sponsor_accounts").doc(sponsorUser.uid).set({
          email,
          applicationId: body.applicationId,
          accessStatus: "revoked",
          revokedAt: FieldValue.serverTimestamp(),
          revokedBy: administrator.uid,
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      } catch {
        return NextResponse.json({ error: "The sponsor account could not be revoked. No application data was deleted." }, { status: 409 });
      }
      await application.ref.set({ accessStatus: "revoked", updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      await appendAudit("revokeSponsorAccess", "sponsor_application", body.applicationId, administrator.uid, { email });
      return NextResponse.json({ ok: true, accessStatus: "revoked" });
    } else if (body.action === "deleteSponsor" && typeof body.applicationId === "string") {
      const application = await db.collection("sponsor_applications").doc(body.applicationId).get();
      if (!application.exists) return NextResponse.json({ error: "Sponsor application not found." }, { status: 404 });
      const email = typeof application.data()?.email === "string" ? application.data()!.email.trim().toLowerCase() : "";
      await application.ref.delete();
      if (email) {
        try {
          const sponsorUser = await adminAuth().getUserByEmail(email);
          await adminAuth().setCustomUserClaims(sponsorUser.uid, { ...(sponsorUser.customClaims ?? {}), sponsor: false });
          await db.collection("sponsor_accounts").doc(sponsorUser.uid).delete();
        } catch {
          // The sponsor application may not yet have a Firebase account.
        }
      }
      await appendAudit("deleteSponsor", "sponsor_application", body.applicationId, administrator.uid, { email });
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
    }

    await appendAudit(String(body.action), body.action === "updateSite" ? "site_content" : "sponsor_application", typeof body.applicationId === "string" ? body.applicationId : "main", administrator.uid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return error instanceof Error && error.message.includes("Sponsor invitation")
      ? NextResponse.json({ error: error.message }, { status: 503 })
      : deny(error);
  }
}
