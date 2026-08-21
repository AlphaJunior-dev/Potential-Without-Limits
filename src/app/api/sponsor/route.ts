import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, requireApprovedSponsor, toSponsorTalentCard } from "@/lib/admin";

export const runtime = "nodejs";

function optionalText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, maxLength)
    : undefined;
}

function accessDenied(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return NextResponse.json(
    { error: "Approved sponsor access is required." },
    { status: message === "UNAUTHENTICATED" ? 401 : 403 },
  );
}

/**
 * The dashboard never reads sponsor-account or Sponsor Talent records directly
 * from the browser. This route verifies the current Firebase sponsor claim and
 * returns only the authenticated account's approved application fields plus
 * the complete safe Sponsor Talent pipeline. Anonymous public pages use a
 * separate field-visibility sanitizer and never call this route.
 */
export async function GET(request: NextRequest) {
  try {
    const sponsor = await requireApprovedSponsor(request);
    const db = adminDb();
    const accountSnapshot = await db.collection("sponsor_accounts").doc(sponsor.uid).get();
    const account = accountSnapshot.exists ? accountSnapshot.data() : undefined;
    const applicationId = optionalText(account?.applicationId, 120);
    const applicationSnapshot = applicationId
      ? await db.collection("sponsor_applications").doc(applicationId).get()
      : null;
    const application = applicationSnapshot?.exists ? applicationSnapshot.data() : undefined;

    const talentSnapshot = await db.collection("sponsor_talent_records").limit(100).get();

    const talent = talentSnapshot.docs
      .map((document) => toSponsorTalentCard(document.id, document.data()))
      .filter((record): record is NonNullable<typeof record> => Boolean(record))
      .sort((first, second) => first.displayOrder - second.displayOrder);

    return NextResponse.json({
      sponsor: {
        name: optionalText(application?.fullName, 120),
        organization: optionalText(application?.organization, 160),
        roleTitle: optionalText(application?.roleTitle, 160),
        email: optionalText(sponsor.email, 320) || optionalText(application?.email, 320),
        applicationRecorded: Boolean(application),
        orientationSubmission: application ? {
          websiteOrLinkedIn: optionalText(application.websiteOrLinkedIn, 300),
          organizationDescription: optionalText(application.orgDescription, 1000),
          supportIntent: optionalText(application.supportIntent, 1000),
        } : null,
        passwordSetupComplete: account?.passwordSetupRequired !== true || Boolean(account?.passwordSetupCompletedAt),
      },
      talent,
    });
  } catch (error) {
    return accessDenied(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const sponsor = await requireApprovedSponsor(request);
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Unsupported sponsor action." }, { status: 400 });
    }
    const db = adminDb();
    if (body.action === "completePasswordSetup") {
      await db.collection("sponsor_accounts").doc(sponsor.uid).set({
        passwordSetupRequired: false,
        passwordSetupCompletedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      return NextResponse.json({ ok: true });
    }
    if (body.action === "sendMessage") {
      const subject = typeof body.subject === "string" ? body.subject.trim() : "";
      const message = typeof body.message === "string" ? body.message.trim() : "";
      const talentId = optionalText(body.talentId, 120);
      if (!subject || subject.length > 200 || !message || message.length > 2_000) {
        return NextResponse.json({ error: "Provide a subject of up to 200 characters and a message of up to 2,000 characters." }, { status: 400 });
      }
      const accountSnapshot = await db.collection("sponsor_accounts").doc(sponsor.uid).get();
      const account = accountSnapshot.exists ? accountSnapshot.data() : undefined;
      const applicationId = optionalText(account?.applicationId, 120);
      const applicationSnapshot = applicationId ? await db.collection("sponsor_applications").doc(applicationId).get() : null;
      const application = applicationSnapshot?.exists ? applicationSnapshot.data() : undefined;
      await db.collection("sponsor_messages").add({
        sponsorUid: sponsor.uid,
        sponsorEmail: optionalText(sponsor.email, 320) || optionalText(application?.email, 320) || "",
        sponsorName: optionalText(application?.fullName, 120) || "Approved sponsor",
        sponsorOrganization: optionalText(application?.organization, 160) || "",
        subject,
        message,
        ...(talentId ? { talentId } : {}),
        source: "Sponsor Dashboard",
        status: "new",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unsupported sponsor action." }, { status: 400 });
  } catch (error) {
    return accessDenied(error);
  }
}
