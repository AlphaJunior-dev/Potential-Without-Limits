import { NextRequest, NextResponse } from "next/server";
import { requireAdministrator } from "@/lib/admin";

export const runtime = "nodejs";

const designPreviewCards = [
  {
    id: "layout-sample-01",
    title: "Technology pathway",
    focus: "Card hierarchy sample",
    summary: "Fictional placeholder copy used only to review spacing, typography, and the private-directory card layout.",
    tags: ["Digital tools", "Problem solving"],
    accent: "forest",
  },
  {
    id: "layout-sample-02",
    title: "Creative practice",
    focus: "Media-free treatment",
    summary: "This sample demonstrates how a rich profile card reads when no approved image or media is supplied.",
    tags: ["Expression", "Portfolio"],
    accent: "navy",
  },
  {
    id: "layout-sample-03",
    title: "Learning pathway",
    focus: "Compact metadata sample",
    summary: "This fictional content exists only for administrator design review and is not a foundation record or opportunity.",
    tags: ["Learning", "Planning"],
    accent: "gold",
  },
];

function deny(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return NextResponse.json(
    { error: "Administrator access required." },
    { status: message === "UNAUTHENTICATED" ? 401 : 403 },
  );
}

/**
 * Layout-only content for administrator review. These samples never enter
 * Firestore, the public content route, the Sponsor API, or the live directory.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdministrator(request);
    return NextResponse.json(
      { label: "Administrator-only design preview", cards: designPreviewCards },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return deny(error);
  }
}
