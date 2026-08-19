import { NextRequest, NextResponse } from "next/server";
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
      },
      talent,
    });
  } catch (error) {
    return accessDenied(error);
  }
}
