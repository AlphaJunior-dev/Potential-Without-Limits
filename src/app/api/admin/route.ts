import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { adminDb, requireAdministrator, sanitizePublicBranding } from "@/lib/admin";

export const runtime = "nodejs";

function deny(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return NextResponse.json({ error: "Administrator access required." }, { status: message === "UNAUTHENTICATED" ? 401 : 403 });
}

export async function GET(request: NextRequest) {
  try {
    await requireAdministrator(request);
    const db = adminDb();
    const [site, applications, cards] = await Promise.all([
      db.collection("public_site_content").doc("main").get(),
      db.collection("sponsor_applications").orderBy("createdAt", "desc").limit(100).get(),
      db.collection("pilot_overview_cards").orderBy("displayOrder", "asc").get(),
    ]);
    return NextResponse.json({
      site: site.exists ? site.data() : {},
      applications: applications.docs.map((document) => ({ id: document.id, ...document.data() })),
      cards: cards.docs.map((document) => ({ id: document.id, ...document.data() })),
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

      const update: Record<string, unknown> = {
        branding,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: administrator.uid,
      };
      if (branding.heroHeadline) update.heroTitle = branding.heroHeadline;
      if (branding.heroSubheadline) update.heroText = branding.heroSubheadline;
      await db.collection("public_site_content").doc("main").set(update, { merge: true });
      await db.collection("audit_log").add({
        action: "updateBranding",
        entityType: "site_content",
        entityId: "main",
        performedBy: administrator.uid,
        createdAt: FieldValue.serverTimestamp(),
      });
      return NextResponse.json({ ok: true, branding });
    } else if (body.action === "updateApplicationStatus" && typeof body.applicationId === "string") {
      const allowed = ["new", "contacted", "call_scheduled", "approved", "declined"];
      if (!allowed.includes(body.status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      await db.collection("sponsor_applications").doc(body.applicationId).update({ status: body.status, updatedAt: FieldValue.serverTimestamp() });
    } else {
      return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
    }

    await db.collection("audit_log").add({
      action: String(body.action),
      entityType: body.action === "updateSite" ? "site_content" : "sponsor_application",
      entityId: typeof body.applicationId === "string" ? body.applicationId : "main",
      performedBy: administrator.uid,
      createdAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return deny(error);
  }
}
