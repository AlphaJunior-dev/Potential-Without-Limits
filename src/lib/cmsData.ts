export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  visibility?: {
    isPublic: boolean;
    showPhoto: boolean;
    showRole: boolean;
    showBio: boolean;
    showLink: boolean;
  };
  order: number;
}

export interface MissionVisionData {
  mission: string;
  vision: string;
  foundersNote: string;
  foundersTitle: string;
  pillars: {
    title: string;
    description: string;
  }[];
  lastUpdated: string;
}

export type SocialPlatform = "LinkedIn" | "Facebook" | "Instagram" | "X" | "YouTube" | "TikTok" | "WhatsApp" | "Website";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  visible: boolean;
  order: number;
}

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    id: "linkedin-pwlif",
    platform: "LinkedIn",
    label: "Follow PWLIF on LinkedIn",
    url: "https://www.linkedin.com/company/potential-without-limits-international-foundation/",
    visible: true,
    order: 1,
  },
];

export interface StatMetric {
  value: string;
  label: string;
}

export interface PathStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface BrandingConfig {
  logoUrl?: string;
  siteTitle?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  headerFont: string;
  bodyFont: string;
  heroMediaType: "image" | "video" | "none";
  heroImage: string;
  heroVideoUrl?: string;
  heroBadgeText?: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  heroSecondaryCtaText?: string;
  heroCardLocation?: string;
  heroCardTitle?: string;
  heroCardDescription?: string;
  videoSectionBadge?: string;
  videoSectionTitle?: string;
  videoSectionSubtitle?: string;
  sponsorSectionBadge?: string;
  sponsorSectionTitle?: string;
  sponsorSectionSubtitle?: string;
  pathwaySectionBadge?: string;
  pathwaySectionTitle?: string;
  pathwaySectionSubtitle?: string;
  transparencySectionBadge?: string;
  transparencySectionTitle?: string;
  transparencySectionSubtitle?: string;
  statsMetrics: StatMetric[];
  pathSteps: PathStep[];
}

export interface LegalSecurityConfig {
  termsContent: string;
  privacyContent: string;
  securityStandardsContent: string;
  lastUpdated: string;
}

export type EditorialPageKey = "howItWorks" | "foundationUpdates" | "mediaPress";

export interface EditorialPageContent {
  title: string;
  introduction: string;
  body: string;
  status: "draft" | "published";
  updatedAt: string;
}

export type EditorialPagesConfig = Record<EditorialPageKey, EditorialPageContent>;

export const INITIAL_EDITORIAL_PAGES: EditorialPagesConfig = {
  howItWorks: { title: "", introduction: "", body: "", status: "draft", updatedAt: "" },
  foundationUpdates: { title: "", introduction: "", body: "", status: "draft", updatedAt: "" },
  mediaPress: { title: "", introduction: "", body: "", status: "draft", updatedAt: "" },
};

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: string;
  details: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Security & Privacy" | "Sponsors" | "Child Protection";
  order: number;
}

export interface SupportInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: "Support Concierge" | "Priority Call Form" | "General";
  status: "pending" | "resolved" | "declined";
  createdAt: string;
}

export const INITIAL_FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How does Potential Without Limits International Foundation approach safety and privacy?",
    answer: "PWLIF uses careful safeguarding and privacy review. Public Sponsor Talent information is intentionally limited, and partnership conversations take place through appropriate foundation-led channels.",
    category: "Child Protection",
    order: 1,
  },
  {
    id: "faq-2",
    question: "What are the available Sponsorship Categories?",
    answer: "PWLIF discusses potential Sponsor Talent, programme, foundation, corporate, and strategic partnership opportunities during a private orientation conversation. Availability and scope are reviewed individually.",
    category: "Sponsors",
    order: 2,
  },
  {
    id: "faq-3",
    question: "What benefits come with different Membership Tiers?",
    answer: "PWLIF does not publish standardised membership benefits or financial commitments on this site. Potential partnership arrangements are discussed privately after an orientation call.",
    category: "Sponsors",
    order: 3,
  },
  {
    id: "faq-4",
    question: "How do I begin a Sponsor Talent conversation?",
    answer: "Prospective sponsors submit an orientation request at /book-a-call and then schedule a private conversation. Sponsor access is considered only after that call and manual approval; approved sponsors receive a one-time email-link invitation to create their own password.",
    category: "General",
    order: 4,
  },
  {
    id: "faq-5",
    question: "Where can I learn more about partnership details?",
    answer: "PWLIF shares relevant partnership information through appropriate private conversations. This public site and sponsor portal do not publish financial, tax, or transparency reports.",
    category: "General",
    order: 5,
  },
];

export const INITIAL_MISSION_VISION: MissionVisionData = {
  mission: "PWLIF develops community-informed Sponsor Talent opportunities through careful partnership, learning, and youth potential.",
  vision: "A future in which young people can access dignified, locally guided pathways to learn and thrive.",
  foundersNote: "Our work will be guided by careful listening, safeguarding, and respectful partnership.",
  foundersTitle: "Potential Without Limits International Foundation",
  pillars: [],
  lastUpdated: "2026-08-01",
};

export const INITIAL_BRANDING: BrandingConfig = {
  logoUrl: "/pwlif-logo.png", siteTitle: "Potential Without Limits International Foundation", primaryColor: "#0B2E6B", secondaryColor: "#079432", backgroundColor: "#FCFCFA", cardBackgroundColor: "#FFFFFF", textColor: "#0B2E6B", headerFont: "Montserrat", bodyFont: "Inter", heroMediaType: "image", heroImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80", heroVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", heroBadgeText: "Potential Without Limits International Foundation (PWLIF)", heroHeadline: "Potential grows when communities lead.", heroSubheadline: "Potential Without Limits International Foundation is building careful, community-informed Sponsor Talent opportunities.", heroCtaText: "Explore Sponsor Talent", heroSecondaryCtaText: "Book Sponsor Orientation", heroCardLocation: "Sponsor Talent", heroCardTitle: "Community-guided potential", heroCardDescription: "Partnership conversations begin with an orientation call and safeguarding review.", videoSectionBadge: "Foundation Introduction", videoSectionTitle: "Foundation Introduction & Impact", videoSectionSubtitle: "An introduction video will be shared when it is ready.", sponsorSectionBadge: "Sponsor Talent", sponsorSectionTitle: "Sponsor Talent", sponsorSectionSubtitle: "Explore non-identifying Sponsor Talent information and begin with an orientation conversation.", pathwaySectionBadge: "Our Pathway", pathwaySectionTitle: "From Potential to Purpose", pathwaySectionSubtitle: "A careful, community-guided pathway for Sponsor Talent opportunities.", transparencySectionBadge: "Partnership", transparencySectionTitle: "Accountability & stewardship", transparencySectionSubtitle: "Detailed information is shared through appropriate private partnership conversations.", statsMetrics: [{ value: "Sponsor", label: "Talent" }, { value: "Guided", label: "by community" }, { value: "Private", label: "orientation" }], pathSteps: [{ stepNumber: "STEP 01", title: "Listen", description: "Begin with community-informed planning." }, { stepNumber: "STEP 02", title: "Prepare", description: "Review safeguarding and partnership needs." }, { stepNumber: "STEP 03", title: "Connect", description: "Hold a private orientation conversation." }, { stepNumber: "STEP 04", title: "Support", description: "Coordinate carefully with local partners." }],
};

export const INITIAL_LEGAL_SECURITY: LegalSecurityConfig = {
  termsContent: "Terms of Service - Potential Without Limits International Foundation (PWLIF)\n\n1. Acceptance of Terms: By accessing the PWLIF platform, visitors, sponsors, donors, and partners agree to use the site responsibly and respect its safeguarding and privacy practices.\n\n2. Sponsor Conduct & Ethics: Sponsor access is considered only after an orientation call and manual approval. Any inappropriate use of private information or communications is prohibited and may result in access being withdrawn.\n\n3. Partnership Information: This site does not publish financial, tax, or transparency reports. Relevant partnership details are discussed through appropriate private channels.",
  privacyContent: "Privacy & Safeguarding Protocol\n\n1. Limited Public Information: PWLIF publishes only the Sponsor Talent information it has specifically approved for public display. Public pages are designed to avoid unnecessary personal or identifying information.\n\n2. Account Data: Orientation-request and sponsor-access information is handled through controlled, server-enforced systems. Access is limited to authorised foundation personnel.\n\n3. Private Communications: Partnership conversations are coordinated through appropriate PWLIF channels and are not an open public messaging service.",
  securityStandardsContent: "PWLIF Security & Safeguarding Standards\n\n1. Controlled Publication: Sponsor Talent records and team information use field-level publication controls, so information can be reviewed, published, edited, or withdrawn as appropriate.\n\n2. Sponsor Password Access: Sponsors receive a secure one-time email-link invitation only after an orientation call and manual approval. The invitation lets each sponsor create their own password; no passwords are generated, displayed, or stored by the portal.\n\n3. Administrative Accountability: Authorised administrative actions, including application reviews, invitations, and content updates, are recorded through protected server-side workflows.",
  lastUpdated: "2026-08-01",
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [];

export const DEFAULTS = { siteContent: INITIAL_BRANDING, faqs: INITIAL_FAQ_ITEMS, mission: INITIAL_MISSION_VISION, team: INITIAL_TEAM_MEMBERS, legal_security: INITIAL_LEGAL_SECURITY };
export function useFirestoreCollection<T>(_name: string, defaults: T[]): T[] { return defaults; }
export function useFirestoreDoc<T>(_name: string, _docId: string, defaultValue: T): T { return defaultValue; }
export async function addDocSafe(): Promise<never> { throw new Error("Client database writes are disabled."); }
export async function updateDocSafe(): Promise<never> { throw new Error("Client database writes are disabled."); }
export async function deleteDocSafe(): Promise<never> { throw new Error("Client database writes are disabled."); }
export async function setSingleDocSafe(): Promise<never> { throw new Error("Client database writes are disabled."); }
export function useCmsData<T>(_key: string, defaultValue: T): T { return defaultValue; }
export function saveCmsData(): never { throw new Error("Client database writes are disabled."); }
