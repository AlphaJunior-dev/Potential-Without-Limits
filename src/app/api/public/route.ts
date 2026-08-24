import { NextResponse } from "next/server";
import { readPublicSite } from "@/lib/admin";

export const runtime = "nodejs";

const baseBranding = {
  logoUrl: "/pwlif-logo.png", siteTitle: "Potential Without Limits International Foundation", primaryColor: "#0B2E6B", secondaryColor: "#079432", backgroundColor: "#FCFCFA", cardBackgroundColor: "#FFFFFF", textColor: "#0B2E6B", headerFont: "Montserrat", bodyFont: "Inter", heroMediaType: "image", heroImage: "/pwlif-logo.png",
  heroBadgeText: "Potential Without Limits International Foundation (PWLIF)", heroCtaText: "Explore Sponsor Talent", heroSecondaryCtaText: "Book Sponsor Orientation", heroCardLocation: "Sponsor Talent", heroCardTitle: "Community-guided potential", heroCardDescription: "Partnership conversations begin with an orientation call and safeguarding review.", videoSectionBadge: "Foundation Introduction", videoSectionTitle: "Foundation Introduction & Impact", videoSectionSubtitle: "An introduction video will be shared when it is ready.", sponsorSectionBadge: "Sponsor Talent", sponsorSectionTitle: "Sponsor Talent", sponsorSectionSubtitle: "Explore non-identifying Sponsor Talent information and begin with an orientation conversation.", pathwaySectionBadge: "Our Pathway", pathwaySectionTitle: "From Potential to Purpose", pathwaySectionSubtitle: "A careful, community-guided pathway for Sponsor Talent opportunities.", transparencySectionBadge: "Partnership", transparencySectionTitle: "Accountability & stewardship", transparencySectionSubtitle: "Detailed information is shared through appropriate private partnership conversations.", statsMetrics: [{ value: "Sponsor", label: "Talent" }, { value: "Guided", label: "by community" }, { value: "Private", label: "orientation" }], pathSteps: [{ stepNumber: "01", title: "Listen", description: "Begin with community-informed planning." }, { stepNumber: "02", title: "Prepare", description: "Review safeguarding and partnership needs." }, { stepNumber: "03", title: "Connect", description: "Hold a private orientation conversation." }, { stepNumber: "04", title: "Support", description: "Coordinate carefully with local partners." }],
};

const fallbackFaqItems = [
  { id: "faq-1", question: "How does Sponsor Talent work?", answer: "Begin with a private orientation conversation. The foundation shares appropriate, non-identifying information and next steps based on safeguarding and partnership requirements.", category: "Sponsors", order: 1 },
  { id: "faq-2", question: "How is privacy protected?", answer: "Public pages do not publish identifying participant information. Further information is shared only through appropriate, verified conversations.", category: "Security & Privacy", order: 2 },
  { id: "faq-3", question: "What happens after an orientation request?", answer: "The foundation reviews the request and follows up using the details you provide. A conversation is scheduled only when it is appropriate to do so.", category: "General", order: 3 },
  { id: "faq-4", question: "How does safeguarding guide the process?", answer: "Safeguarding, privacy, and responsible partnership review guide how the foundation shares information and considers Sponsor Talent opportunities.", category: "Child Protection", order: 4 },
];

const fallbackTeamMembers = [
  { id: "leadership-information", name: "Leadership Information", role: "Published as confirmed", bio: "PWLIF publishes individual leadership details only after they have been confirmed for public release. Partnership and advisory enquiries can be directed through the foundation's orientation process.", photoUrl: "/pwlif-logo.png", order: 1 },
];

const fallbackMissionVision = {
  mission: "PWLIF develops community-informed Sponsor Talent opportunities through careful partnership, learning, and youth potential.",
  vision: "A future in which young people can access dignified, locally guided pathways to learn and thrive.",
  foundersNote: "Our work will be guided by careful listening, safeguarding, and respectful partnership.",
  foundersTitle: "Potential Without Limits International Foundation",
  presidentPhotoUrl: "",
  presidentPhotoFocusY: 35,
  presidentPhotoZoom: 100,
  pillars: [],
  lastUpdated: "",
};

const fallbackLegalSecurity = {
  termsContent: "Use of this website is subject to responsible, respectful engagement with the foundation and its safeguarding practices.",
  privacyContent: "Public pages do not publish identifying participant information. The foundation handles orientation requests with appropriate privacy and safeguarding practices.",
  securityStandardsContent: "Safeguarding, privacy, and responsible partnership guide the foundation's public information and orientation process.",
  lastUpdated: "",
};

export async function GET() {
  const site = await readPublicSite();
  return NextResponse.json({
    branding: { ...baseBranding, ...site.branding, heroHeadline: site.heroTitle, heroSubheadline: site.heroText },
    missionVision: { ...fallbackMissionVision, ...site.missionVision },
    profiles: site.pilotCards.map((card) => {
      const showcaseCard = card as typeof card & { ageBand?: string; educationLevel?: string; region?: string; skills?: string[]; story?: string; aspiration?: string; supportPathway?: string };
      const mediaUrls = Array.isArray(card.mediaUrls) ? card.mediaUrls : [];
      const publicVisibility: {
        profileVisible: boolean;
        photoVisible: boolean;
        mediaVisible: boolean;
        summaryVisible: boolean;
        ageBandVisible?: boolean;
        educationLevelVisible?: boolean;
        regionVisible?: boolean;
        skillsVisible?: boolean;
        storyVisible?: boolean;
        aspirationVisible?: boolean;
        supportPathwayVisible?: boolean;
      } = card.visibility || {
        profileVisible: true,
        photoVisible: Boolean(card.photoUrl),
        mediaVisible: mediaUrls.length > 0,
        summaryVisible: true,
      };
      const showPhoto = publicVisibility.photoVisible === true && Boolean(card.photoUrl);
      const showMedia = publicVisibility.mediaVisible === true;
      const showSummary = publicVisibility.summaryVisible === true;
      const showAgeBand = publicVisibility.ageBandVisible === true;
      const showEducationLevel = publicVisibility.educationLevelVisible === true;
      const showRegion = publicVisibility.regionVisible === true;
      const showSkills = publicVisibility.skillsVisible === true;
      const showStory = publicVisibility.storyVisible === true;
      const showAspiration = publicVisibility.aspirationVisible === true;
      const showSupportPathway = publicVisibility.supportPathwayVisible === true;
      return {
        id: card.id,
        name: card.title,
        age: 0,
        category: card.supportArea || "Sponsor Talent",
        location: showRegion ? showcaseCard.region || "" : "",
        country_community: showRegion ? showcaseCard.region || "" : "",
        bio: showSummary ? card.summary : "",
        coverPhoto: showPhoto ? card.photoUrl : "/pwlif-logo.png",
        galleryImages: showPhoto && card.photoUrl ? [card.photoUrl] : [],
        galleryVideos: showMedia ? mediaUrls : [],
        publicVisibility,
        status: "active" as const,
        skills: showSkills && Array.isArray(showcaseCard.skills) ? showcaseCard.skills : [],
        dream: showAspiration ? showcaseCard.aspiration || "" : "",
        current_situation: showStory ? showcaseCard.story || "" : "",
        progress: "",
        current_needs: showSupportPathway ? showcaseCard.supportPathway || "" : "",
        consentRecord: { parentalConsent: false, mediaReleasePermission: false, signedDate: "", guardianName: "" },
        ageBand: showAgeBand ? showcaseCard.ageBand || "" : "",
        educationLevel: showEducationLevel ? showcaseCard.educationLevel || "" : "",
        region: showRegion ? showcaseCard.region || "" : "",
        story: showStory ? showcaseCard.story || "" : "",
        aspiration: showAspiration ? showcaseCard.aspiration || "" : "",
        supportPathway: showSupportPathway ? showcaseCard.supportPathway || "" : "",
      };
    }),
    talentTags: site.talentTags.filter((tag) => tag.status === "active"),
    faqItems: fallbackFaqItems,
    teamMembers: site.teamMembers.length ? site.teamMembers : fallbackTeamMembers,
    legalSecurity: { ...fallbackLegalSecurity, ...site.legalSecurity },
    foundationVideos: site.foundationVideos,
    socialLinks: site.socialLinks,
  });
}
