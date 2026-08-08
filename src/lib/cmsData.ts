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
    question: "How does Potential Without Limits International Foundation protect child safety and privacy?",
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
    category: "Child Protection",
    order: 5,
  },
];

export const INITIAL_MISSION_VISION: MissionVisionData = {
  mission:
    "To identify, nurture, and empower vulnerable children and youth through education, talent development, mentorship, psychosocial support, and strategic partnerships that create sustainable opportunities for lifelong success.",
  vision:
    "A world where every child and young person, regardless of their circumstances, discovers their full potential and thrives through education, opportunity, and hope.",
  foundersNote:
    "Potential Without Limits International Foundation was born from a simple but powerful belief: every child has unique potential waiting to be discovered. No child should be defined by poverty, homelessness, conflict, or limited opportunities. Through education, mentorship, talent development, and compassionate partnerships, we aim to unlock that potential and create pathways toward dignity, hope, and lasting success. Together with our supporters, volunteers, and partners, we are building a future where potential truly has no limits.",
  foundersTitle:
    "Rafiki Emmanuel — Founder & President, Potential Without Limits International Foundation (PWLIF)",
  pillars: [
    {
      title: "Education Access",
      description: "Providing quality academic tuition, learning resources, and educational grants for vulnerable youth across Africa.",
    },
    {
      title: "Talent Discovery & Development",
      description: "Identifying and nurturing latent artistic, athletic, technical, and leadership gifts in young dreamers.",
    },
    {
      title: "Child Protection & Psychosocial Well-being",
      description: "Comprehensive health care, counseling, and 100% verified guardian consent safeguards for every child.",
    },
    {
      title: "Youth Leadership & Entrepreneurship",
      description: "Practical mentorship and confidence building to equip youth for self-reliance and community impact.",
    },
    {
      title: "Digital Literacy & Innovation",
      description: "Equipping youth with modern computer skills, coding, robotics, and creative digital media tools.",
    },
    {
      title: "Sustainable Partnerships Across Africa",
      description: "Collaborating with local schools, international sponsors, and community foundations to build lasting opportunity.",
    },
  ],
  lastUpdated: "2026-08-01",
};

export const INITIAL_BRANDING: BrandingConfig = {
  logoUrl: "/pwlif-logo.png",
  siteTitle: "Potential Without Limits International Foundation",
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
  heroHeadline: "Unlocking Potential. Transforming Lives.",
  heroSubheadline: "Connecting dedicated sponsors with young dreamers and innovators across Africa — beginning in Ethiopia — through direct educational grants, talent development, and 100% transparent stewardship.",
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
      description: "Explore the curated directory of child dream profiles across Technology, Robotics, Music, Digital Arts, Sports, and Academics.",
    },
    {
      stepNumber: "STEP 02",
      title: "2. Choose Category & Tier",
      description: "Select from Child Sponsorship, Program Sponsorship, Foundation Sponsorship, or Corporate Partner tiers.",
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
  termsContent: `Terms of Service - Potential Without Limits International Foundation (PWLIF)

1. Acceptance of Terms: By accessing the Potential Without Limits International Foundation platform, sponsors, donors, and partners agree to abide by our child protection standards, parental consent guidelines, and transparent stewardship protocols.

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
    name: "Rafiki Emmanuel",
    role: "Founder & President",
    bio: "Teacher, youth mentor, and community volunteer who met talented children whose gifts were limited only by poverty and circumstance — and built PWLIF to give every child a real pathway.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/rafiki-emmanuel",
    twitterUrl: "https://twitter.com/rafiki_pwlif",
    order: 1,
  },
  {
    id: "team-2",
    name: "Dr. Amara Kone",
    role: "Lead Educator & Youth Mentor (Africa Region)",
    bio: "Dedicated educational director overseeing STEM workshops, learning centers, and academic sponsorship programs in Ethiopia and East Africa.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/amara-kone",
    order: 2,
  },
  {
    id: "team-3",
    name: "Sarah Jenkins",
    role: "Director of Volunteer & Sponsor Relations",
    bio: "Coordinates global volunteer mentors, family foundation partnerships, and child protection verification.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/sarahjenkins-pwlif",
    order: 3,
  },
  {
    id: "team-4",
    name: "Marcus Vance",
    role: "Head of Child Safeguarding & Ethics",
    bio: "10+ years in child advocacy and ethical compliance. Oversees PWLIF's parental consent protocols and safety standards.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    linkedinUrl: "https://linkedin.com/in/marcus-vance",
    order: 4,
  },
];

import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { INITIAL_YOUTH_PROFILES, INITIAL_TRANSPARENCY_REPORTS, INITIAL_FOUNDATION_VIDEOS } from "./data";

export const DEFAULTS = {
  siteContent: INITIAL_BRANDING,
  profiles: INITIAL_YOUTH_PROFILES,
  videos: INITIAL_FOUNDATION_VIDEOS,
  faqs: INITIAL_FAQ_ITEMS,
  mission: INITIAL_MISSION_VISION,
  team: INITIAL_TEAM_MEMBERS,
  transparency: INITIAL_TRANSPARENCY_REPORTS,
  legal_security: INITIAL_LEGAL_SECURITY,
};

export function useFirestoreCollection<T>(name: string, defaults: T[]): T[] {
  const [items, setItems] = useState<T[] | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsub = onSnapshot(collection(db, name), (snap) => {
      if (snap.empty) {
        // First load & empty collection: seed with defaults
        const seed = async () => {
          try {
            const batch = defaults.map((item, i) =>
              setDoc(doc(db, name, (item as any).id || `${name}-${i}`), item as any)
            );
            await Promise.all(batch);
          } catch {}
          setItems(defaults);
        };
        seed();
      } else {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as unknown as T[]);
      }
    });
    return () => unsub();
  }, [name]);

  return items ?? defaults;
}

export function useFirestoreDoc<T>(name: string, docId: string, defaultValue: T): T {
  const [item, setItem] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsub = onSnapshot(doc(db, name, docId), (snap) => {
      if (!snap.exists()) {
        setDoc(doc(db, name, docId), defaultValue as any).catch(() => {});
        setItem(defaultValue);
      } else {
        setItem(snap.data() as T);
      }
    });
    return () => unsub();
  }, [name, docId]);

  return item;
}

export async function addDocSafe(name: string, data: unknown) {
  const ref = doc(collection(db, name));
  const docData = { ...(data as any), id: ref.id, updatedAt: Date.now() };
  await setDoc(ref, docData);
  return ref.id;
}

export async function updateDocSafe(name: string, id: string, data: unknown) {
  await setDoc(doc(db, name, id), { ...(data as any), updatedAt: Date.now() }, { merge: true });
}

export async function deleteDocSafe(name: string, id: string) {
  await deleteDoc(doc(db, name, id));
}

export async function setSingleDocSafe(name: string, docId: string, data: unknown) {
  await setDoc(doc(db, name, docId), { ...(data as any), updatedAt: Date.now() }, { merge: true });
}

// Deprecated alias helper to maintain smooth fallback
export function useCmsData<T>(key: string, defaultValue: T): T {
  const docName = key.replace("wlp_", "");
  return useFirestoreDoc<T>("cms_content", docName, defaultValue);
}

export function saveCmsData<T>(key: string, value: T) {
  const docName = key.replace("wlp_", "");
  setSingleDocSafe("cms_content", docName, value);
}
