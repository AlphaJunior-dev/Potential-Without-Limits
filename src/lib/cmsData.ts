export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedinUrl?: string;
  twitterUrl?: string;
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
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  statsMetrics: StatMetric[];
  pathSteps: PathStep[];
}

export interface LegalSecurityConfig {
  termsContent: string;
  privacyContent: string;
  securityStandardsContent: string;
  lastUpdated: string;
}

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
  category: "General" | "Security & Privacy" | "Sponsors" | "Talent Admissions";
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
    question: "How does Potential Without Limits Foundation protect child safety and privacy?",
    answer: "Public profiles display verified first names, ages, and community regions only. Every child profile is published under 100% verified parental/guardian consent records, and all sponsor interactions are safeguarded by foundation officers.",
    category: "Security & Privacy",
    order: 1,
  },
  {
    id: "faq-2",
    question: "What are the available Sponsorship Categories?",
    answer: "PWLIF offers 5 tailored categories: Child Sponsor (direct child education grants), Program Sponsor (lab hardware & equipment), Foundation Sponsor (annual core support), Corporate Partner (CSR matching), and Strategic Partner (global alliance).",
    category: "Sponsors",
    order: 2,
  },
  {
    id: "faq-3",
    question: "What benefits come with different Membership Tiers?",
    answer: "Membership Tiers range from Bronze ($150/mo), Silver ($500/mo), Gold ($1,500/mo), to Platinum ($5,000+/mo). Tiers include quarterly audited impact reports, dedicated foundation concierge, and community lab naming opportunities.",
    category: "Sponsors",
    order: 3,
  },
  {
    id: "faq-4",
    question: "How do I Sponsor a Specific Child's Dream?",
    answer: "You can browse the Child Dream Directory (/talents), select a child's profile, and click 'Sponsor This Dream'. You can also link or adopt dreams directly within your Sponsor Hub.",
    category: "General",
    order: 4,
  },
  {
    id: "faq-5",
    question: "How are sponsorship funds distributed and audited?",
    answer: "100% of direct child sponsorship grants go toward educational equipment, tuition, and learning labs. Annual financial audit PDFs are publicly published in the Transparency section of our website.",
    category: "Talent Admissions",
    order: 5,
  },
];

export const INITIAL_MISSION_VISION: MissionVisionData = {
  mission:
    "To empower children and young innovators worldwide by connecting them with dedicated sponsors, providing direct educational grants, equipment, and transparent stewardship to build unlimited futures.",
  vision:
    "To be the global benchmark for transparent, child-centered humanitarian sponsorship, where every child's dream is nurtured and every sponsor sees verified, life-changing impact.",
  foundersNote:
    "Potential Without Limits Foundation was founded on a simple truth: talent and passion are universal, but access to education and tools is not. We built PWLIF to create a direct, transparent bridge between compassionate sponsors and young dreamers under strict child protection standards.",
  foundersTitle:
    "Executive Director & Founder, Potential Without Limits Foundation",
  pillars: [
    {
      title: "Verified Parental Consent & Child Safety",
      description:
        "Every child profile is published under verified parental/guardian consent records and strict privacy protections.",
    },
    {
      title: "100% Direct Grant Deployment",
      description:
        "Sponsorship funds bypass unnecessary intermediaries to directly acquire learning hardware, tuition, and community lab resources.",
    },
    {
      title: "Transparent Audited Impact",
      description:
        "Sponsors receive quarterly financial audits, progress reports, and milestone updates on every child supported.",
    },
  ],
  lastUpdated: "2026-08-01",
};

export const INITIAL_BRANDING: BrandingConfig = {
  logoUrl: "/pwlif-logo.png",
  siteTitle: "Potential Without Limits Foundation",
  primaryColor: "#051836",
  secondaryColor: "#005C27",
  backgroundColor: "#FDFCF9",
  cardBackgroundColor: "#FFFFFF",
  textColor: "#051836",
  headerFont: "Montserrat",
  bodyFont: "Inter",
  heroMediaType: "image",
  heroImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  heroVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  heroHeadline: "Empowering Every Child's Dream. Building Potential Without Limits.",
  heroSubheadline: "Directly sponsor young innovators, fund educational equipment grants, and track transparent child impact across 24 global communities.",
  heroCtaText: "Sponsor a Dream Today",
  statsMetrics: [
    { value: "100%", label: "Parental Consent Verified" },
    { value: "$2.4M+", label: "Direct Educational Grants" },
    { value: "340+", label: "Children Impacted" },
    { value: "24", label: "Global Communities" },
  ],
  pathSteps: [
    {
      stepNumber: "STEP 01",
      title: "1. Discover Dreams",
      description: "Explore the curated directory of child dream profiles across Technology, Robotics, Music, and Digital Arts.",
    },
    {
      stepNumber: "STEP 02",
      title: "2. Choose Category & Tier",
      description: "Select from Child Sponsorship, Program Sponsorship, or Foundation Partnership membership tiers.",
    },
    {
      stepNumber: "STEP 03",
      title: "3. Direct Adoption",
      description: "Complete sponsor registration with 100% verified parental consent & child safety shields.",
    },
    {
      stepNumber: "STEP 04",
      title: "4. Track Impact",
      description: "Receive audited progress updates, direct milestone reports, and transparent financial stewardship.",
    },
  ],
};

export const INITIAL_LEGAL_SECURITY: LegalSecurityConfig = {
  termsContent: `Terms of Service - Potential Without Limits Foundation (PWLIF)

1. Acceptance of Terms: By accessing the Potential Without Limits Foundation platform, sponsors, donors, and partners agree to abide by our child protection standards, parental consent guidelines, and transparent stewardship protocols.

2. Sponsor Conduct & Ethics: Sponsor accounts are granted to support educational and creative development. Any unauthorized distribution or inappropriate communication is strictly prohibited and subject to immediate revocation.

3. Grant & Stewardship Integrity: 100% of sponsorship grants allocated to children and youth programs must be deployed towards educational hardware, learning materials, tuition, or community lab resources as specified in sponsorship terms.`,
  privacyContent: `Child Protection & Privacy Shield Protocol

1. Parental & Guardian Consent: Public child profiles display verified first names, age, and community regions only. Every profile is backed by signed parental consent records on file.

2. Data Encryption & Safety: Personal child identification, document records, and location details are encrypted and protected behind multi-factor administrative access.

3. Monitored Communications: All sponsor updates, letters, and progress milestones are facilitated through PWLIF foundation officers to ensure complete minor safety.`,
  securityStandardsContent: `PWLIF Child Protection & Safeguarding Standards

1. Child Safety & Parental Consent Verification: Every youth profile is published only after formal, signed parental/guardian consent and identity verification by our foundation safety panel.

2. Transparent Financial Stewardship: 100% of direct grant contributions are tracked, audited annually, and published in open transparency reports.

3. Immutable Compliance Logging: All administrative actions, sponsor approvals, password updates, and credential changes are recorded in immutable security audit logs.`,
  lastUpdated: "2026-08-01",
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    name: "Eleanor Andersen",
    role: "Founder & Executive Director",
    bio: "Former tech executive and youth advocacy leader passionate about democratizing access to high-growth tech and creative industries for underrepresented youth.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/eleanor-a",
    twitterUrl: "https://twitter.com/eleanor_wlp",
    order: 1,
  },
  {
    id: "team-2",
    name: "Marcus Vance",
    role: "Head of Child Protection & Vetting",
    bio: "10+ years in educational admissions and youth advocacy. Oversees PWLIF's parental consent verification and child safety protection system.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/marcus-vance",
    order: 2,
  },
  {
    id: "team-3",
    name: "Sophia Thorne",
    role: "Director of Sponsor Relations & Global Partnerships",
    bio: "Drives foundation partnership strategy, matching individual sponsors, family foundations, and CSR initiatives with verified youth dreamers.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/sophiathorne",
    twitterUrl: "https://twitter.com/sthorne_impact",
    order: 3,
  },
  {
    id: "team-4",
    name: "Devon Chen",
    role: "Lead Community & Education Curator",
    bio: "Coordinates community youth labs, digital arts workshops, and maintains child safety media standards across global learning hubs.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/devonchen-media",
    order: 4,
  },
];

