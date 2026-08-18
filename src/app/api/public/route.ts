import { NextResponse } from "next/server";
import { readPublicSite } from "@/lib/admin";

export const runtime = "nodejs";

const baseBranding = {
  logoUrl: "/pwlif-logo.png", siteTitle: "Potential Without Limits International Foundation", primaryColor: "#051836", secondaryColor: "#005C27", backgroundColor: "#FDFCF9", cardBackgroundColor: "#FFFFFF", textColor: "#051836", headerFont: "Montserrat", bodyFont: "Inter", heroMediaType: "image", heroImage: "/pwlif-logo.png",
  heroBadgeText: "Potential Without Limits International Foundation (PWLIF)", heroCtaText: "Explore the Rwanda Pilot", heroSecondaryCtaText: "Book Sponsor Orientation", heroCardLocation: "Rwanda pilot", heroCardTitle: "Community-guided potential", heroCardDescription: "Partnership conversations begin with an orientation call and safeguarding review.", videoSectionBadge: "Foundation Introduction", videoSectionTitle: "Foundation Introduction & Impact", videoSectionSubtitle: "An introduction video will be shared when it is ready.", sponsorSectionBadge: "Pilot Overview", sponsorSectionTitle: "Sponsor a Dream", sponsorSectionSubtitle: "Explore non-identifying pilot information and begin with an orientation conversation.", pathwaySectionBadge: "Our Pathway", pathwaySectionTitle: "From Potential to Purpose", pathwaySectionSubtitle: "A careful, community-guided pathway for the Rwanda pilot.", transparencySectionBadge: "Partnership", transparencySectionTitle: "Accountability & stewardship", transparencySectionSubtitle: "Detailed information is shared through appropriate private partnership conversations.", statsMetrics: [{ value: "Pilot", label: "Rwanda" }, { value: "Guided", label: "by community" }, { value: "Private", label: "orientation" }], pathSteps: [{ stepNumber: "01", title: "Listen", description: "Begin with community-informed planning." }, { stepNumber: "02", title: "Prepare", description: "Review safeguarding and partnership needs." }, { stepNumber: "03", title: "Connect", description: "Hold a private orientation conversation." }, { stepNumber: "04", title: "Support", description: "Coordinate carefully with local partners." }],
};

export async function GET() {
  const site = await readPublicSite();
  return NextResponse.json({
    branding: { ...baseBranding, heroHeadline: site.heroTitle, heroSubheadline: site.heroText },
    missionVision: { mission: "PWLIF is preparing a community-informed Rwanda pilot focused on careful partnership, learning, and youth potential.", vision: "A future in which young people can access dignified, locally guided pathways to learn and thrive.", foundersNote: "Our work will be guided by careful listening, safeguarding, and respectful partnership.", foundersTitle: "Potential Without Limits International Foundation", pillars: [], lastUpdated: "" },
    profiles: site.pilotCards.map((card) => ({ id: card.id, name: card.title, age: 0, category: card.supportArea || "Rwanda Pilot", location: "Rwanda pilot", country_community: "Rwanda pilot", bio: card.summary, coverPhoto: "/pwlif-logo.png", status: "active", skills: [], dream: card.summary, current_situation: "Information is shared through appropriate private conversations.", progress: "", current_needs: card.supportArea || "Orientation conversation", consentRecord: { parentalConsent: false, mediaReleasePermission: false, signedDate: "", guardianName: "" } })),
  });
}
