import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import {
  adminAuth,
  adminDb,
  requireAdministrator,
  sanitizeAdminTeam,
  sanitizePublicBranding,
  sanitizePublicLegal,
  sanitizePublicMissionVision,
  sanitizePublicVideos,
  sanitizeTalentRecord,
  sanitizeTalentTagLibrary,
} from "@/lib/admin";

export const runtime = "nodejs";

const reviewStatuses = new Set(["new", "contacted", "call_scheduled", "approved", "declined"]);

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

async function sendPasswordlessSponsorLink(email: string) {
  const apiKey = process.env.FIREBASE_WEB_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const continueUrl = process.env.FIREBASE_EMAIL_LINK_CONTINUE_URL;
  if (!apiKey || !continueUrl) throw new Error("Passwordless invitation delivery is not configured.");

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestType: "EMAIL_SIGNIN", email, continueUrl, canHandleCodeInApp: true }),
  });
  if (!response.ok) throw new Error("Firebase could not send the passwordless invitation.");
}

export async function GET(request: NextRequest) {
  try {
    await requireAdministrator(request);
    const db = adminDb();
    const [site, applications, cards, talentRecords, sponsorAccounts, audit] = await Promise.all([
      db.collection("public_site_content").doc("main").get(),
      db.collection("sponsor_applications").orderBy("createdAt", "desc").limit(100).get(),
      db.collection("pilot_overview_cards").orderBy("displayOrder", "asc").get(),
      db.collection("sponsor_talent_records").orderBy("displayOrder", "asc").limit(100).get(),
      db.collection("sponsor_accounts").orderBy("updatedAt", "desc").limit(100).get(),
      db.collection("audit_log").orderBy("createdAt", "desc").limit(150).get(),
    ]);
    return NextResponse.json({
      site: site.exists ? site.data() : {},
      applications: applications.docs.map((document) => ({ id: document.id, ...document.data() })),
      cards: cards.docs.map((document) => ({ id: document.id, ...document.data() })),
      talentRecords: talentRecords.docs.map((document) => ({ id: document.id, ...document.data() })),
      sponsorAccounts: sponsorAccounts.docs.map((document) => ({ id: document.id, ...document.data() })),
      audit: audit.docs.map((document) => ({ id: document.id, ...document.data() })),
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

    if (body.action === "updateSite") {
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
      let userRecord;
      try {
        userRecord = await adminAuth().getUserByEmail(email);
      } catch {
        userRecord = await adminAuth().createUser({ email, emailVerified: false, disabled: false });
      }
      await adminAuth().setCustomUserClaims(userRecord.uid, { ...(userRecord.customClaims ?? {}), sponsor: true });
      try {
        await sendPasswordlessSponsorLink(email);
      } catch (error) {
        await db.collection("sponsor_accounts").doc(userRecord.uid).set({ email, applicationId: applicationRef.id, invitationStatus: "delivery_failed", updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        throw error;
      }
      await db.collection("sponsor_accounts").doc(userRecord.uid).set({
        email,
        applicationId: applicationRef.id,
        invitationStatus: "sent",
        invitedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        assignedTalentIds: [],
      }, { merge: true });
      await appendAudit("sendManualSponsorInvitation", "sponsor_account", userRecord.uid, administrator.uid, { applicationId: applicationRef.id });
      return NextResponse.json({ ok: true, invitationStatus: "sent", applicationId: applicationRef.id });
    } else if (body.action === "sendSponsorInvitation" && typeof body.applicationId === "string") {
      const application = await db.collection("sponsor_applications").doc(body.applicationId).get();
      const data = application.data();
      const email = typeof data?.email === "string" ? data.email.trim().toLowerCase() : "";
      if (!application.exists || !email || data?.status !== "approved") return NextResponse.json({ error: "Only an approved application with an email address can receive an invitation." }, { status: 400 });
      let userRecord;
      try {
        userRecord = await adminAuth().getUserByEmail(email);
      } catch {
        userRecord = await adminAuth().createUser({ email, emailVerified: false, disabled: false });
      }
      await adminAuth().setCustomUserClaims(userRecord.uid, { ...(userRecord.customClaims ?? {}), sponsor: true });
      try {
        await sendPasswordlessSponsorLink(email);
      } catch (error) {
        await db.collection("sponsor_accounts").doc(userRecord.uid).set({ email, applicationId: body.applicationId, invitationStatus: "delivery_failed", updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        throw error;
      }
      await db.collection("sponsor_accounts").doc(userRecord.uid).set({
        email,
        applicationId: body.applicationId,
        invitationStatus: "sent",
        invitedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        assignedTalentIds: [],
      }, { merge: true });
      await appendAudit("sendSponsorInvitation", "sponsor_account", userRecord.uid, administrator.uid, { applicationId: body.applicationId });
      return NextResponse.json({ ok: true, invitationStatus: "sent" });
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
    } else {
      return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
    }

    await appendAudit(String(body.action), body.action === "updateSite" ? "site_content" : "sponsor_application", typeof body.applicationId === "string" ? body.applicationId : "main", administrator.uid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return error instanceof Error && error.message.includes("Passwordless invitation")
      ? NextResponse.json({ error: error.message }, { status: 503 })
      : deny(error);
  }
}
