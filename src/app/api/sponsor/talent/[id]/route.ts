import { NextRequest, NextResponse } from "next/server";
import { adminDb, requireApprovedSponsor, toSponsorTalentCard } from "@/lib/admin";

export const runtime = "nodejs";

function deny(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return NextResponse.json({ error: "Approved sponsor access is required." }, { status: message === "UNAUTHENTICATED" ? 401 : 403 });
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireApprovedSponsor(request);
    const { id } = await context.params;
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) return NextResponse.json({ error: "Talent record not found." }, { status: 404 });
    const document = await adminDb().collection("sponsor_talent_records").doc(id).get();
    const talent = document.exists ? toSponsorTalentCard(document.id, document.data()) : null;
    if (!talent) return NextResponse.json({ error: "Talent record not found." }, { status: 404 });
    return NextResponse.json({ talent }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return deny(error);
  }
}
