import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/admin";
import { loadMissionPresidentPhoto } from "@/lib/supabase-media";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!/^[A-Za-z0-9_-]{8,80}$/.test(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const site = await adminDb().collection("public_site_content").doc("main").get();
    const missionVision = site.data()?.missionVision;
    if (missionVision?.presidentPhotoUrl !== `/api/mission-president-photo/${id}`) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const asset = await adminDb().collection("mission_president_photo_assets").doc(id).get();
    const data = asset.data();
    if (!asset.exists || typeof data?.storagePath !== "string" || !["image/jpeg", "image/png", "image/webp"].includes(String(data.contentType))) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const bytes = await loadMissionPresidentPhoto(data.storagePath);
    return new NextResponse(bytes, { headers: { "Content-Type": data.contentType, "Cache-Control": "public, max-age=3600, s-maxage=3600", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    console.error("Mission president photo delivery failed", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
