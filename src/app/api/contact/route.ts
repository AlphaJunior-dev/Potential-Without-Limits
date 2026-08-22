import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/admin";

export const runtime = "nodejs";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

function cleanDetails(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .slice(0, 12)
    .map(([key, detail]) => [clean(key, 60), clean(detail, 500)])
    .filter(([key, detail]) => Boolean(key && detail)));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = clean(body?.name, 120), email = clean(body?.email, 180).toLowerCase(), subject = clean(body?.subject, 200), message = clean(body?.message, 2000), source = clean(body?.source, 80), details = cleanDetails(body?.details);
  if (!name || !emailPattern.test(email) || !subject || !message) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  try {
    await adminDb().collection("public_form_submissions").add({
      name,
      email,
      subject,
      message,
      source: source || "General enquiry",
      details,
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  }
  catch { return NextResponse.json({ error: "We could not save your request right now." }, { status: 503 }); }
}
