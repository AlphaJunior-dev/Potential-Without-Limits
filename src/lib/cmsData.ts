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
    question: "How does Without Limits Potential protect youth privacy?",
    answer: "Public profiles display anonymized first names, general regions, and verified skill tags only. Raw video reels, source code repositories, audio stems, and direct creator contact pathways are strictly locked behind multi-factor authenticated corporate sponsor accounts.",
    category: "Security & Privacy",
    order: 1,
  },
  {
    id: "faq-2",
    question: "How do corporate sponsors receive login credentials?",
    answer: "Sponsors cannot self-register. After scheduling and completing a 15-minute admissions vetting call with our executive team, verified sponsors are issued credentials directly by an Admin.",
    category: "Sponsors",
    order: 2,
  },
  {
    id: "faq-3",
    question: "What happens on a sponsor's first login?",
    answer: "Upon first login, sponsors are directed to a mandatory 'Complete Your Profile' setup where they provide their full name, LinkedIn URL, CSR focus areas, and set a new personal password.",
    category: "Sponsors",
    order: 3,
  },
  {
    id: "faq-4",
    question: "How are sponsorship funds and equipment grants deployed?",
    answer: "100% of corporate sponsorship funds are deployed directly toward hardware lab equipment, software licenses, educational stipends, or mentorship programs agreed upon in verified contracts.",
    category: "General",
    order: 4,
  },
  {
    id: "faq-5",
    question: "How does a youth creator qualify for WLP admissions?",
    answer: "Every creator undergoes a rigorous multi-stage portfolio audit evaluating technical proficiency in industry tools (e.g. React, Python, Blender, ROS 2, Logic Pro) alongside identity verification.",
    category: "Talent Admissions",
    order: 5,
  },
];

export const INITIAL_MISSION_VISION: MissionVisionData = {
  mission:
    "To empower unseen youth talent by connecting them with verified corporate sponsors, fostering growth, and building unlimited futures through direct funding, mentorship, and industry access.",
  vision:
    "To be the premier high-security, dual-sided marketplace where every talented young individual finds their champion, and every sponsor discovers impactful opportunities to shape the next generation of innovators.",
  foundersNote:
    "Without Limits Potential was born from a simple truth: talent is everywhere, but opportunity is not. We built this space to be the bridge—a secure, elite exhibition where corporate leaders can discover and champion the next generation of innovators without compromising youth safety.",
  foundersTitle:
    "Executive Director & Founder, Without Limits Potential",
  pillars: [
    {
      title: "Admissions & Rigorous Vetting",
      description:
        "Every youth portfolio and corporate backer is manually verified by our admissions panel to guarantee safety, integrity, and operational trust.",
    },
    {
      title: "Direct Equipment & Grant Impact",
      description:
        "Sponsorship funds bypass unnecessary intermediaries to directly acquire hardware, software licenses, and career-defining learning resources.",
    },
    {
      title: "Monitored Industry Mentorship",
      description:
        "Connecting youth creators with senior engineers, producers, and designers through structured, privacy-shielded communication channels.",
    },
  ],
  lastUpdated: "2026-08-01",
};

export const INITIAL_BRANDING: BrandingConfig = {
  logoUrl: "",
  siteTitle: "WITHOUT LIMITS POTENTIAL",
  primaryColor: "#050814",
  secondaryColor: "#F28482",
  backgroundColor: "#050814",
  cardBackgroundColor: "#121A36",
  textColor: "#F8FAFC",
  headerFont: "Montserrat",
  bodyFont: "Inter",
  heroMediaType: "image",
  heroImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  heroVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  heroHeadline: "Exceptional Creators. Verified Futures.",
  heroSubheadline: "A high-security, dual-sided marketplace connecting verified corporate sponsors directly with top-tier youth talent in Technology, Digital Art, Sound Design, and Robotics.",
  heroCtaText: "Book a Vetting Call",
  statsMetrics: [
    { value: "100%", label: "Admissions Vetted" },
    { value: "$2.4M+", label: "Equipment Grants" },
    { value: "48 hrs", label: "Vetting Call Turnaround" },
    { value: "50+", label: "Corporate Backers" },
  ],
  pathSteps: [
    {
      stepNumber: "STEP 01",
      title: "1. Discovery",
      description: "Explore the curated exhibition of anonymized youth talent across Technology, Robotics, Music, and Digital Art.",
    },
    {
      stepNumber: "STEP 02",
      title: "2. Vetting Call",
      description: "Schedule a direct call with our admissions executive team to verify your corporate credentials and CSR objectives.",
    },
    {
      stepNumber: "STEP 03",
      title: "3. Secure Access",
      description: "Receive unique login credentials to unlock raw 16:9 media reels, source repositories, and direct creator channels.",
    },
    {
      stepNumber: "STEP 04",
      title: "4. Direct Impact",
      description: "Fund equipment labs, provide software licenses, or offer career-defining grants directly to promising youth creators.",
    },
  ],
};

export const INITIAL_LEGAL_SECURITY: LegalSecurityConfig = {
  termsContent: `Terms of Service - Without Limits Potential (WLP)

1. Acceptance of Terms: By accessing Without Limits Potential, corporate sponsors and users agree to abide by our institutional safety protocols, verification guidelines, and privacy shield standards.

2. Sponsor Conduct & Vetting: Corporate accounts are provisioned exclusively after manual credentials verification. Unauthorized distribution of minor talent contact paths or raw media assets is strictly prohibited.

3. Grant & Funding Integrity: 100% of sponsorship grants allocated to youth talent must be deployed towards hardware, software licenses, educational programs, or direct stipends as agreed upon in sponsorship contracts.`,
  privacyContent: `Privacy Policy & Youth Shield Protocol

1. Anonymized Public Data: Public profiles exhibit first names, age, and general region only. Full names, exact street addresses, and direct contact methods are strictly protected behind multi-factor authorization.

2. Encrypted Vault Storage: Raw 16:9 media reels, source repositories, and audio stems are stored in encrypted cloud vaults accessible solely by verified corporate sponsors.

3. Monitored Communication: All sponsor-talent communications are routed through WLP Admissions security channels to guarantee minor protection.`,
  securityStandardsContent: `WLP Security & Technical Vetting Standards

1. Technical Audit Protocol: Every creator on WLP undergoes a multi-tiered technical assessment evaluating proficiency in industry tools (React, Python, Blender, Procreate, Logic Pro, ROS 2).

2. Zero-Trust Access Control: Access to sensitive creator files requires verified sponsor credentials and continuous session monitoring.

3. Compliance Audit Trails: All administrative credential generation, content modifications, and inquiry linkage actions are logged in immutable audit records.`,
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
    role: "Head of Talent Admissions & Vetting",
    bio: "10+ years in educational admissions and youth talent curation. Oversees WLP's multi-tier identity protection and portfolio verification system.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/marcus-vance",
    order: 2,
  },
  {
    id: "team-3",
    name: "Sophia Thorne",
    role: "Corporate Sponsor Relations Director",
    bio: "Drives corporate partnership strategy, matching Fortune 500 CSR initiatives and venture funds with verified youth creators.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/sophiathorne",
    twitterUrl: "https://twitter.com/sthorne_impact",
    order: 3,
  },
  {
    id: "team-4",
    name: "Devon Chen",
    role: "Lead Creative & Media Curator",
    bio: "Award-winning digital artist and sound designer who curates 16:9 exhibition previews and maintains raw media security standards.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/devonchen-media",
    order: 4,
  },
];

