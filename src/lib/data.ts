export type SponsorCategory = 
  | "Child Sponsor" 
  | "Program Sponsor" 
  | "Foundation Sponsor" 
  | "Corporate Partner" 
  | "Strategic Partner";

export type MembershipTier = "Platinum" | "Gold" | "Silver" | "Bronze";

export interface ConsentRecord {
  parentalConsent: boolean;
  mediaReleasePermission: boolean;
  signedDate: string;
  guardianName: string;
  reference?: string;
  reviewedAt?: string;
  reviewDueAt?: string;
}

export interface YouthProfile {
  id: string;
  name: string;
  age: number;
  category: string;
  location?: string;
  bio: string;
  coverPhoto: string;
  rawMediaUrl?: string;
  status: "active" | "sponsored" | "pending" | "archived";
  inquiriesCount?: number;
  skills?: string[];
  galleryImages?: string[];
  galleryVideos?: string[];
  featuredOnHomepage?: boolean;
  /** Set only from the server-authorized approved-sponsor response. */
  privateSponsorAccess?: boolean;
  publicVisibility?: {
    profileVisible: boolean;
    photoVisible: boolean;
    mediaVisible: boolean;
    summaryVisible: boolean;
    ageBandVisible?: boolean;
    regionVisible?: boolean;
    skillsVisible?: boolean;
    storyVisible?: boolean;
    aspirationVisible?: boolean;
    supportPathwayVisible?: boolean;
  };
  
  // PWLIF Foundation Specific Fields
  dream: string;
  current_situation: string;
  progress: string;
  current_needs: string;
  country_community: string;
  consentRecord: ConsentRecord;
  ageBand?: string;
  region?: string;
  story?: string;
  aspiration?: string;
  supportPathway?: string;
}

export interface TalentTag {
  id: string;
  name: string;
  status: "active" | "retired";
}

export interface SponsorDream {
  id: string;
  sponsorId: string;
  sponsorName: string;
  talentId: string;
  talentName: string;
  dreamTitle: string;
  grantAmount: string;
  progressUpdate: string;
  currentNeeds: string;
  dateAdopted: string;
  status: "active" | "completed";
}

export interface TransparencyReport {
  id: string;
  title: string;
  year: string;
  totalFunded: string;
  childrenImpacted: number;
  reportPdfUrl: string;
  auditDate: string;
  category: "Financial Audit" | "Annual Impact Report" | "Program Stewardship";
}

export interface FoundationVideo {
  id: string;
  title: string;
  category: "Foundation Intro" | "Impact Story" | "Transformational Journey";
  videoUrl: string;
  thumbnail: string;
  description: string;
  duration: string;
}

export const INITIAL_YOUTH_PROFILES: YouthProfile[] = [];

export const INITIAL_TRANSPARENCY_REPORTS: TransparencyReport[] = [];

export const INITIAL_FOUNDATION_VIDEOS: FoundationVideo[] = [];
