import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, readPublicSite } from "@/lib/admin";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlPattern = /^https?:\/\//i;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Please complete the orientation form." }, { status: 400 });
  }

  if (text(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const fullName = text(body.fullName, 120);
  const email = text(body.email, 180).toLowerCase();
  const organization = text(body.organization, 160);
  const roleTitle = text(body.roleTitle, 120);
  const websiteOrLinkedIn = text(body.websiteOrLinkedIn, 300);
  const orgDescription = text(body.orgDescription, 1000);
  const supportIntent = text(body.supportIntent, 1000);
  const consent = body.consent === true;

  if (!fullName || !emailPattern.test(email) || !organization || !roleTitle || !urlPattern.test(websiteOrLinkedIn) || !orgDescription || !supportIntent || !consent) {
    return NextResponse.json({ error: "Please complete every required field and provide a valid website or LinkedIn URL." }, { status: 400 });
  }

  try {
    const db = adminDb();
    const application = await db.collection("sponsor_applications").add({
      fullName,
      email,
      organization,
      roleTitle,
      websiteOrLinkedIn,
      orgDescription,
      supportIntent,
      consent: true,
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    await db.collection("audit_log").add({
      action: "orientation_application_created",
      entityType: "sponsor_application",
      entityId: application.id,
      performedBy: "public_orientation_form",
      createdAt: FieldValue.serverTimestamp(),
    });
    const site = await readPublicSite();
    return NextResponse.json({ ok: true, bookingUrl: site.bookingUrl });
  } catch {
    return NextResponse.json({ error: "We could not save your request right now. Please try again shortly." }, { status: 503 });
  }
}
