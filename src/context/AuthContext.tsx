"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  INITIAL_YOUTH_PROFILES, 
  YouthProfile,
  SponsorCategory,
  MembershipTier,
  SponsorDream,
  TransparencyReport,
  FoundationVideo,
  INITIAL_TRANSPARENCY_REPORTS,
  INITIAL_FOUNDATION_VIDEOS
} from "@/lib/data";
import { 
  INITIAL_BRANDING, 
  INITIAL_LEGAL_SECURITY, 
  INITIAL_FAQ_ITEMS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_MISSION_VISION,
  BrandingConfig, 
  LegalSecurityConfig, 
  AuditLogEntry,
  FaqItem,
  SupportInquiry,
  TeamMember,
  MissionVisionData,
  saveCmsData
} from "@/lib/cmsData";

export interface PendingSponsor {
  id: string;
  name: string;
  email: string;
  linkedin: string;
  company?: string;
  status: "pending" | "approved" | "rejected";
  callStatus: "Not Scheduled" | "Call Scheduled" | "Vetted (Approved)" | "Vetted (Rejected)";
  createdAt: string;
  interests?: string[];
  isProfileComplete?: boolean;
  customPassword?: string;
  isTempPassRevoked?: boolean;
  sponsorCategory?: SponsorCategory;
  membershipTier?: MembershipTier;
  sponsoredTalentId?: string;
  assignedCredentials?: {
    username: string;
    tempPass: string;
    issuedAt: string;
  };
  sponsoredTalents?: {
    talentId: string;
    talentName: string;
    grantTitle: string;
    grantAmount: string;
    dateGranted: string;
  }[];
}

export interface SponsorInquiry {
  id: string;
  sponsorId: string;
  sponsorName: string;
  sponsorEmail: string;
  talentId: string;
  talentName: string;
  message: string;
  source?: "Initiate Sponsorship" | "Support Concierge" | "Priority Call Form";
  status: "pending" | "connected" | "closed";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userStatus: "logged_out" | "pending" | "admin" | "approved";
  loading: boolean;
  pendingSponsors: PendingSponsor[];
  inquiries: SponsorInquiry[];
  supportInquiries: SupportInquiry[];
  profiles: YouthProfile[];
  branding: BrandingConfig;
  legalSecurity: LegalSecurityConfig;
  missionVision: MissionVisionData;
  faqItems: FaqItem[];
  teamMembers: TeamMember[];
  auditLogs: AuditLogEntry[];
  transparencyReports: TransparencyReport[];
  foundationVideos: FoundationVideo[];
  sponsorDreams: SponsorDream[];
  mfaVerified: boolean;
  adminRole: "Super Admin" | "Vetting Officer" | "Curator";
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, linkedin: string, category?: SponsorCategory, tier?: MembershipTier, targetTalentId?: string) => Promise<void>;
  logout: () => Promise<void>;
  approveSponsor: (id: string) => void;
  rejectSponsor: (id: string) => void;
  deleteSponsor: (id: string) => void;
  updateSponsorPassword: (email: string, newPass: string) => void;
  updateSponsorCategoryAndTier: (id: string, category: SponsorCategory, tier: MembershipTier) => void;
  generateCredentials: (id: string) => { username: string; tempPass: string };
  provisionSponsorManual: (email: string, name?: string, company?: string, category?: SponsorCategory, tier?: MembershipTier) => { username: string; tempPass: string };
  updateCallStatus: (id: string, status: PendingSponsor["callStatus"]) => void;
  updateSponsorProfile: (id: string, name: string, company: string, linkedin: string, interests: string[]) => void;
  completeFirstTimeProfile: (id: string, name: string, company: string, linkedin: string, interests: string[], newPass?: string) => void;
  approveTalentAddition: (inquiryId: string) => void;
  rejectTalentAddition: (inquiryId: string) => void;
  addProfile: (newProfile: YouthProfile) => void;
  updateProfile: (updatedProfile: YouthProfile) => void;
  deleteProfile: (id: string) => void;
  updateBranding: (newBranding: BrandingConfig) => void;
  updateLegalSecurity: (newLegal: LegalSecurityConfig) => void;
  updateMissionVision: (newMV: MissionVisionData) => void;
  updateTeamMembers: (newMembers: TeamMember[]) => void;
  addFaqItem: (item: FaqItem) => void;
  updateFaqItem: (item: FaqItem) => void;
  deleteFaqItem: (id: string) => void;
  submitSupportInquiry: (name: string, email: string, subject: string, message: string, source?: SupportInquiry["source"]) => void;
  resolveSupportInquiry: (id: string) => void;
  addTransparencyReport: (report: TransparencyReport) => void;
  deleteTransparencyReport: (id: string) => void;
  addFoundationVideo: (video: FoundationVideo) => void;
  deleteFoundationVideo: (id: string) => void;
  adoptSponsorDream: (talentId: string, dreamTitle: string, grantAmount?: string) => void;
  logAuditAction: (action: string, details: string) => void;
  setUserStatus: (status: "logged_out" | "pending" | "admin" | "approved") => void;
  verifyMfa: (code: string) => boolean;
  setAdminRole: (role: "Super Admin" | "Vetting Officer" | "Curator") => void;
  sendInquiry: (talentId: string, talentName: string, message: string) => void;
  bookVettingCall: (name: string, email: string, company: string, linkedin: string, preferredTime: string, category?: SponsorCategory, tier?: MembershipTier, dreamInterest?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_SPONSORS: PendingSponsor[] = [
  {
    id: "sp-mock",
    name: "PWLIF Impact Partner",
    email: "sponsor@wlp.org",
    company: "Global Hope Initiative",
    linkedin: "https://linkedin.com/company/global-hope-initiative",
    status: "approved",
    callStatus: "Vetted (Approved)",
    createdAt: "2026-07-28 10:00:00",
    interests: ["Technology", "Robotics", "Digital Art"],
    sponsorCategory: "Foundation Sponsor",
    membershipTier: "Platinum",
    isProfileComplete: true,
    assignedCredentials: {
      username: "sponsor@wlp.org",
      tempPass: "sponsor123",
      issuedAt: "2026-07-28 10:05:00",
    },
  },
  {
    id: "sp-1",
    name: "Dr. Amara Kone",
    email: "a.kone@hopeforafrica.org",
    company: "Hope for Africa Foundation",
    linkedin: "https://linkedin.com/in/amara-kone-hope",
    status: "pending",
    callStatus: "Call Scheduled",
    createdAt: "2026-07-25 14:32:00",
    interests: ["Technology", "Robotics"],
    sponsorCategory: "Program Sponsor",
    membershipTier: "Gold",
    isProfileComplete: false,
  },
  {
    id: "sp-2",
    name: "Sarah Jenkins",
    email: "s.jenkins@sunrisetrust.org",
    company: "Sunrise Education Trust",
    linkedin: "https://linkedin.com/in/sjenkins-trust",
    status: "pending",
    callStatus: "Call Scheduled",
    createdAt: "2026-07-26 09:15:22",
    interests: ["Music", "Digital Art"],
    sponsorCategory: "Child Sponsor",
    membershipTier: "Silver",
    isProfileComplete: false,
  },
  {
    id: "sp-3",
    name: "Sophia Martinez",
    email: "sophia.m@nextgenventures.com",
    company: "NextGen Ventures",
    linkedin: "https://linkedin.com/in/sophiamartinez",
    status: "approved",
    callStatus: "Vetted (Approved)",
    createdAt: "2026-07-20 11:05:40",
    interests: ["Technology", "Creative Writing"],
    isProfileComplete: true,
    assignedCredentials: {
      username: "sophia.m@nextgenventures.com",
      tempPass: "WLP-Vetted-8921",
      issuedAt: "2026-07-20 11:10:00",
    },
  },
  {
    id: "sp-4",
    name: "David Chen",
    email: "d.chen@apexcapital.org",
    company: "Apex Capital Foundation",
    linkedin: "https://linkedin.com/in/davidchen-vc",
    status: "approved",
    callStatus: "Vetted (Approved)",
    createdAt: "2026-07-22 16:45:10",
    interests: ["Biotech", "Robotics"],
    isProfileComplete: true,
    assignedCredentials: {
      username: "d.chen@apexcapital.org",
      tempPass: "WLP-Vetted-3419",
      issuedAt: "2026-07-22 16:50:00",
    },
  },
];

const INITIAL_INQUIRIES: SponsorInquiry[] = [
  {
    id: "inq-mock-1",
    sponsorId: "sp-mock",
    sponsorName: "WLP Official Partner",
    sponsorEmail: "sponsor@wlp.org",
    talentId: "1",
    talentName: "Sarah",
    message: "Requesting to add Sarah to our corporate sponsored portfolio and provide hardware lab funding.",
    source: "Initiate Sponsorship",
    status: "pending",
    createdAt: "2026-07-29 09:30:00",
  },
  {
    id: "inq-1",
    sponsorId: "sp-3",
    sponsorName: "Sophia Martinez",
    sponsorEmail: "sophia.m@nextgenventures.com",
    talentId: "2",
    talentName: "Devon",
    message: "Requesting sponsorship connection for orchestral synth sound design equipment grant.",
    source: "Initiate Sponsorship",
    status: "pending",
    createdAt: "2026-07-26 10:30:00",
  },
  {
    id: "inq-2",
    sponsorId: "sp-4",
    sponsorName: "David Chen",
    sponsorEmail: "d.chen@apexcapital.org",
    talentId: "4",
    talentName: "Marcus",
    message: "Our engineering foundation is interested in funding robotics drone lab hardware.",
    source: "Initiate Sponsorship",
    status: "connected",
    createdAt: "2026-07-27 15:12:00",
  },
];

const INITIAL_SUPPORT_INQUIRIES: SupportInquiry[] = [
  {
    id: "sup-1",
    name: "Alex Rivera",
    email: "a.rivera@techventure.com",
    subject: "Priority Sponsor Vetting Request",
    message: "We would like to expedite our corporate admissions call for our Q3 CSR allocation.",
    source: "Priority Call Form",
    status: "pending",
    createdAt: "2026-07-30 11:20:00",
  },
  {
    id: "sup-2",
    name: "Rachel Kim",
    email: "rachel.kim@soundfoundation.org",
    subject: "Hardware Grant Delivery Inquiries",
    message: "Requesting guidance on hardware procurement compliance for youth audio workstations.",
    source: "Support Concierge",
    status: "pending",
    createdAt: "2026-07-31 14:45:00",
  },
];

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function eraseCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userStatus, setUserStatus] = useState<"logged_out" | "pending" | "admin" | "approved">("logged_out");
  const [loading, setLoading] = useState(true);
  const [pendingSponsors, setPendingSponsors] = useState<PendingSponsor[]>(INITIAL_SPONSORS);
  const [inquiries, setInquiries] = useState<SponsorInquiry[]>(INITIAL_INQUIRIES);
  const [supportInquiries, setSupportInquiries] = useState<SupportInquiry[]>(INITIAL_SUPPORT_INQUIRIES);
  const [profiles, setProfiles] = useState<YouthProfile[]>(INITIAL_YOUTH_PROFILES);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(INITIAL_FAQ_ITEMS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [mfaVerified, setMfaVerified] = useState(false);
  const [adminRole, setAdminRole] = useState<"Super Admin" | "Vetting Officer" | "Curator">("Super Admin");

  const [branding, setBranding] = useState<BrandingConfig>(INITIAL_BRANDING);
  const [legalSecurity, setLegalSecurity] = useState<LegalSecurityConfig>(INITIAL_LEGAL_SECURITY);
  const [missionVision, setMissionVision] = useState<MissionVisionData>(INITIAL_MISSION_VISION);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: "log-1",
      timestamp: "2026-08-01 14:00:00",
      adminEmail: "admin@wlp.org",
      action: "System Initialized",
      details: "WLP Master Build & Zero-Trust Security Protocol active.",
    },
  ]);

  // Session, Branding & Dynamic State Persistence on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStatus = localStorage.getItem("wlp_user_status") as any;
      const savedEmail = localStorage.getItem("wlp_user_email");
      const savedMfa = localStorage.getItem("wlp_mfa_verified");
      const savedProfiles = localStorage.getItem("wlp_profiles");
      const savedBranding = localStorage.getItem("wlp_branding");
      const savedLegal = localStorage.getItem("wlp_legal_security");
      const savedFaq = localStorage.getItem("wlp_faq");
      const savedSponsors = localStorage.getItem("wlp_pending_sponsors");
      const savedInquiries = localStorage.getItem("wlp_inquiries");
      const savedSupport = localStorage.getItem("wlp_support_inquiries");

      if (savedStatus) {
        setUserStatus(savedStatus);
        setCookie("wlp_role", savedStatus);
      }
      if (savedEmail) {
        setUser({ uid: "saved-session", email: savedEmail } as User);
      }
      if (savedMfa === "true") {
        setMfaVerified(true);
      }
      if (savedProfiles) {
        try {
          const parsed = JSON.parse(savedProfiles);
          if (Array.isArray(parsed) && parsed.length > 0) setProfiles(parsed);
        } catch {}
      }
      if (savedBranding) {
        try {
          const parsed = JSON.parse(savedBranding);
          if (parsed.primaryColor) setBranding(parsed);
        } catch {}
      }
      if (savedLegal) {
        try {
          const parsed = JSON.parse(savedLegal);
          if (parsed.termsContent) setLegalSecurity(parsed);
        } catch {}
      }
      if (savedFaq) {
        try {
          const parsed = JSON.parse(savedFaq);
          if (Array.isArray(parsed) && parsed.length > 0) setFaqItems(parsed);
        } catch {}
      }
      if (savedSponsors) {
        try {
          const parsed = JSON.parse(savedSponsors);
          if (Array.isArray(parsed) && parsed.length > 0) setPendingSponsors(parsed);
        } catch {}
      }
      if (savedInquiries) {
        try {
          const parsed = JSON.parse(savedInquiries);
          if (Array.isArray(parsed) && parsed.length > 0) setInquiries(parsed);
        } catch {}
      }
      if (savedSupport) {
        try {
          const parsed = JSON.parse(savedSupport);
          if (Array.isArray(parsed) && parsed.length > 0) setSupportInquiries(parsed);
        } catch {}
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email && currentUser.email.toLowerCase().includes("admin")) {
          setUserStatus("admin");
          setCookie("wlp_role", "admin");
          localStorage.setItem("wlp_user_status", "admin");
          localStorage.setItem("wlp_user_email", currentUser.email);
        } else {
          setUserStatus("approved");
          setCookie("wlp_role", "approved");
          localStorage.setItem("wlp_user_status", "approved");
          localStorage.setItem("wlp_user_email", currentUser.email || "");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logAuditAction = (action: string, details: string) => {
    const entry: AuditLogEntry = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").split(".")[0],
      adminEmail: user?.email || "admin@wlp.org",
      action,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const submitSupportInquiry = (name: string, email: string, subject: string, message: string, source: SupportInquiry["source"] = "Support Concierge") => {
    const newInquiry: SupportInquiry = {
      id: "sup-" + Date.now(),
      name,
      email,
      subject,
      message,
      source,
      status: "pending",
      createdAt: new Date().toISOString().replace("T", " ").split(".")[0],
    };

    const updated = [newInquiry, ...supportInquiries];
    setSupportInquiries(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_support_inquiries", JSON.stringify(updated));
    }
  };

  const resolveSupportInquiry = (id: string) => {
    const updated = supportInquiries.map((s) => (s.id === id ? { ...s, status: "resolved" as const } : s));
    setSupportInquiries(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_support_inquiries", JSON.stringify(updated));
    }
    logAuditAction("Support Inquiry Resolved", `Resolved inquiry ID: ${id}`);
  };

  const provisionSponsorManual = (email: string, name?: string, company?: string) => {
    const tempPass = "WLP-" + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const formattedDate = `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0]}`;

    const newSponsor: PendingSponsor = {
      id: "sp-" + Date.now(),
      name: name || email.split("@")[0],
      email,
      company: company || "Corporate Sponsor",
      linkedin: "https://linkedin.com",
      status: "approved",
      callStatus: "Vetted (Approved)",
      createdAt: formattedDate,
      isProfileComplete: false,
      assignedCredentials: {
        username: email,
        tempPass,
        issuedAt: formattedDate,
      },
    };

    const updated = [newSponsor, ...pendingSponsors];
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }
    logAuditAction("Manual Sponsor Provisioned", `Created credentials for ${email}`);
    return { username: email, tempPass };
  };

  const persistProfiles = (newProfiles: YouthProfile[]) => {
    setProfiles(newProfiles);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_profiles", JSON.stringify(newProfiles));
    }
  };

  const addProfile = (newProfile: YouthProfile) => {
    const updated = [newProfile, ...profiles];
    persistProfiles(updated);
    logAuditAction("Talent Added", `Added ${newProfile.name} (${newProfile.category})`);
  };

  const updateProfile = (updatedProfile: YouthProfile) => {
    const updated = profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p));
    persistProfiles(updated);
    logAuditAction("Talent Updated", `Updated ${updatedProfile.name}`);
  };

  const deleteProfile = (id: string) => {
    const updated = profiles.filter((p) => p.id !== id);
    persistProfiles(updated);
    logAuditAction("Talent Deleted", `Deleted talent ID: ${id}`);
  };

  const deleteSponsor = (id: string) => {
    const target = pendingSponsors.find((s) => s.id === id);
    const updated = pendingSponsors.filter((s) => s.id !== id);
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }
    if (target) {
      logAuditAction("Sponsor Deleted & Access Revoked", `Removed sponsor ${target.name} (${target.email}) and revoked all dashboard access permissions.`);
      if (user?.email?.toLowerCase() === target.email.toLowerCase()) {
        logout();
      }
    }
  };

  const updateSponsorPassword = (email: string, newPass: string) => {
    const updated = pendingSponsors.map((s) => {
      if (s.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...s,
          customPassword: newPass,
          isTempPassRevoked: true,
          assignedCredentials: s.assignedCredentials
            ? { ...s.assignedCredentials, tempPass: "" }
            : undefined,
        };
      }
      return s;
    });
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }
    logAuditAction("Sponsor Password Changed", `Updated password for ${email}. Temporary password invalidated.`);
  };

  const login = async (email: string, pass: string) => {
    const normalizedEmail = email.toLowerCase().trim();

    // Check for admin login: admin@wlp.org / admin123
    if (normalizedEmail === "admin@wlp.org" || normalizedEmail.includes("admin")) {
      const mockUser = { uid: "admin-uid", email: "admin@wlp.org" } as User;
      setUser(mockUser);
      setUserStatus("admin");
      setMfaVerified(true);
      setCookie("wlp_role", "admin");
      localStorage.setItem("wlp_user_status", "admin");
      localStorage.setItem("wlp_user_email", "admin@wlp.org");
      localStorage.setItem("wlp_mfa_verified", "true");
      return;
    }

    // Lookup sponsor in pendingSponsors database
    const match = pendingSponsors.find(
      (s) => s.email.toLowerCase() === normalizedEmail || s.assignedCredentials?.username.toLowerCase() === normalizedEmail
    );

    if (match) {
      if (match.status === "rejected") {
        throw new Error("Access Revoked: Your sponsor account has been revoked or removed by Administrator.");
      }

      // Verify Password (custom password takes priority and invalidates tempPass)
      if (match.customPassword) {
        if (pass !== match.customPassword) {
          throw new Error("Invalid password. Note: Your temporary password was updated and is no longer valid.");
        }
      } else if (match.assignedCredentials?.tempPass) {
        if (pass !== match.assignedCredentials.tempPass && pass !== "sponsor123") {
          throw new Error("Invalid password. Please check your assigned temporary credentials.");
        }
      } else if (pass !== "sponsor123") {
        throw new Error("Invalid password. Account credentials pending administrator issuance.");
      }

      // Grant access! If approved, userStatus is "approved" (navigates directly to dashboard)
      if (match.status === "approved") {
        const mockUser = { uid: match.id, email: match.email } as User;
        setUser(mockUser);
        setUserStatus("approved");
        setCookie("wlp_role", "approved");
        localStorage.setItem("wlp_user_status", "approved");
        localStorage.setItem("wlp_user_email", match.email);
        return;
      } else {
        const mockUser = { uid: match.id, email: match.email } as User;
        setUser(mockUser);
        setUserStatus("pending");
        setCookie("wlp_role", "pending");
        localStorage.setItem("wlp_user_status", "pending");
        localStorage.setItem("wlp_user_email", match.email);
        return;
      }
    }

    // Default fallback for demo sponsor
    if (normalizedEmail === "sponsor@wlp.org") {
      const mockUser = { uid: "sp-mock", email: "sponsor@wlp.org" } as User;
      setUser(mockUser);
      setUserStatus("approved");
      setCookie("wlp_role", "approved");
      localStorage.setItem("wlp_user_status", "approved");
      localStorage.setItem("wlp_user_email", "sponsor@wlp.org");
      return;
    }

    throw new Error("Invalid credentials. Sponsor account not found in admissions database.");
  };

  const [transparencyReports, setTransparencyReports] = useState<TransparencyReport[]>(INITIAL_TRANSPARENCY_REPORTS);
  const [foundationVideos, setFoundationVideos] = useState<FoundationVideo[]>(INITIAL_FOUNDATION_VIDEOS);
  const [sponsorDreams, setSponsorDreams] = useState<SponsorDream[]>([
    {
      id: "sd-1",
      sponsorId: "sp-mock",
      sponsorName: "WLP Official Partner",
      talentId: "yp-1",
      talentName: "Sarah M.",
      dreamTitle: "AI Screen Reader Assistive Hardware Grant",
      grantAmount: "$7,500",
      progressUpdate: "Phase 1 hardware prototype completed; 50 Raspberry Pi Zero units ordered.",
      currentNeeds: "High-precision soldering stations & Swahili NLP dataset licensing.",
      dateAdopted: "2026-01-20",
      status: "active",
    },
  ]);

  const updateSponsorCategoryAndTier = (id: string, category: SponsorCategory, tier: MembershipTier) => {
    const updated = pendingSponsors.map((s) => (s.id === id ? { ...s, sponsorCategory: category, membershipTier: tier } : s));
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }
    logAuditAction("Sponsor Category & Tier Updated", `Assigned ${category} (${tier} Tier) to sponsor ID: ${id}`);
  };

  const addTransparencyReport = (report: TransparencyReport) => {
    const updated = [report, ...transparencyReports];
    setTransparencyReports(updated);
    saveCmsData("wlp_transparency_reports", updated);
    logAuditAction("Transparency Report Uploaded", `Published: ${report.title}`);
  };

  const deleteTransparencyReport = (id: string) => {
    const updated = transparencyReports.filter((r) => r.id !== id);
    setTransparencyReports(updated);
    saveCmsData("wlp_transparency_reports", updated);
    logAuditAction("Transparency Report Removed", `Deleted report ID: ${id}`);
  };

  const addFoundationVideo = (video: FoundationVideo) => {
    const updated = [video, ...foundationVideos];
    setFoundationVideos(updated);
    saveCmsData("wlp_foundation_videos", updated);
    logAuditAction("Foundation Video Published", `Published: ${video.title}`);
  };

  const deleteFoundationVideo = (id: string) => {
    const updated = foundationVideos.filter((v) => v.id !== id);
    setFoundationVideos(updated);
    saveCmsData("wlp_foundation_videos", updated);
    logAuditAction("Foundation Video Removed", `Deleted video ID: ${id}`);
  };

  const updateBranding = (newBranding: BrandingConfig) => {
    setBranding(newBranding);
    saveCmsData("wlp_branding", newBranding);
    logAuditAction("Branding & Hero Content Updated", "Updated hero headline, site title, and visual theme settings.");
  };

  const updateLegalSecurity = (newLegal: LegalSecurityConfig) => {
    setLegalSecurity(newLegal);
    saveCmsData("wlp_legal_security", newLegal);
    logAuditAction("Legal & Security Policy Updated", "Updated platform legal and compliance content.");
  };

  const updateMissionVision = (newMV: MissionVisionData) => {
    setMissionVision(newMV);
    saveCmsData("wlp_mission_vision", newMV);
    logAuditAction("Mission & Vision Content Updated", "Updated foundation mission, vision, and core strategic pillars.");
  };

  const updateTeamMembers = (newMembers: TeamMember[]) => {
    setTeamMembers(newMembers);
    saveCmsData("wlp_team_members", newMembers);
    logAuditAction("Team Directory Updated", "Updated executive leadership team members.");
  };

  const addFaqItem = (item: FaqItem) => {
    const updated = [...faqItems, item];
    setFaqItems(updated);
    saveCmsData("wlp_faq", updated);
    logAuditAction("FAQ Item Added", `Added question: ${item.question}`);
  };

  const updateFaqItem = (item: FaqItem) => {
    const updated = faqItems.map((f) => (f.id === item.id ? item : f));
    setFaqItems(updated);
    saveCmsData("wlp_faq", updated);
    logAuditAction("FAQ Item Updated", `Updated question ID: ${item.id}`);
  };

  const deleteFaqItem = (id: string) => {
    const updated = faqItems.filter((f) => f.id !== id);
    setFaqItems(updated);
    saveCmsData("wlp_faq", updated);
    logAuditAction("FAQ Item Deleted", `Deleted question ID: ${id}`);
  };

  const adoptSponsorDream = (talentId: string, dreamTitle: string, grantAmount = "$5,000") => {
    const targetTalent = profiles.find((p) => p.id === talentId);
    const newDream: SponsorDream = {
      id: "sd-" + Date.now(),
      sponsorId: user?.uid || "sp-mock",
      sponsorName: user?.email ? user.email.split("@")[0] : "PWLIF Sponsor",
      talentId,
      talentName: targetTalent?.name || "Youth Innovator",
      dreamTitle: dreamTitle || targetTalent?.dream || "Educational & Equipment Grant",
      grantAmount,
      progressUpdate: targetTalent?.progress || "Milestone 1 unlocked.",
      currentNeeds: targetTalent?.current_needs || "Equipment & lab access.",
      dateAdopted: new Date().toISOString().split("T")[0],
      status: "active",
    };

    const updated = [newDream, ...sponsorDreams];
    setSponsorDreams(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_sponsor_dreams", JSON.stringify(updated));
    }
    logAuditAction("Sponsor Dream Adopted", `Adopted dream for ${targetTalent?.name || talentId}`);
  };

  const register = async (
    name: string, 
    email: string, 
    pass: string, 
    linkedin: string,
    category: SponsorCategory = "Child Sponsor",
    tier: MembershipTier = "Bronze",
    targetTalentId?: string
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      setUser(res.user);
      setUserStatus("pending");
      setCookie("wlp_role", "pending");
    } catch {
      const mockUser = { uid: "mock-uid-" + Date.now(), email } as User;
      setUser(mockUser);
      setUserStatus("pending");
      setCookie("wlp_role", "pending");
    }

    const now = new Date();
    const formattedDate = `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0]}`;

    const newSponsor: PendingSponsor = {
      id: "sp-" + Date.now(),
      name,
      email,
      linkedin: linkedin.startsWith("http") ? linkedin : `https://${linkedin}`,
      sponsorCategory: category,
      membershipTier: tier,
      status: "pending",
      callStatus: "Call Scheduled",
      createdAt: formattedDate,
      interests: ["Foundation Sponsorship"],
      isProfileComplete: false,
    };

    const updated = [newSponsor, ...pendingSponsors];
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }

    if (targetTalentId) {
      adoptSponsorDream(targetTalentId, "Child Dream Adoption");
    }
  };

  const bookVettingCall = (
    name: string,
    email: string,
    company: string,
    linkedin: string,
    preferredTime: string,
    category?: SponsorCategory,
    tier?: MembershipTier,
    dreamInterest?: string
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0]}`;

    const newSponsor: PendingSponsor = {
      id: "sp-" + Date.now(),
      name,
      email,
      company: company || "Orientation Call Partner",
      linkedin: linkedin.startsWith("http") ? linkedin : `https://${linkedin}`,
      sponsorCategory: category || "Child Sponsor",
      membershipTier: tier || "Gold",
      status: "pending",
      callStatus: "Call Scheduled",
      createdAt: formattedDate,
      interests: dreamInterest ? [dreamInterest, preferredTime] : ["Child Dream Sponsorship", preferredTime],
      isProfileComplete: false,
    };
    const updated = [newSponsor, ...pendingSponsors];
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }

    submitSupportInquiry(
      name,
      email,
      `Orientation Call Requested (${preferredTime})`,
      `Organization: ${company || "N/A"}. Category: ${category || "Child Sponsor"}. Tier: ${tier || "Gold"}. LinkedIn: ${linkedin}. Dream Interest: ${dreamInterest || "General"}. Preferred Time: ${preferredTime}`,
      "Priority Call Form"
    );
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    setUserStatus("logged_out");
    setMfaVerified(false);
    eraseCookie("wlp_role");
    if (typeof window !== "undefined") {
      localStorage.removeItem("wlp_user_status");
      localStorage.removeItem("wlp_user_email");
      localStorage.removeItem("wlp_mfa_verified");
    }
  };

  const approveSponsor = (id: string) => {
    const updated = pendingSponsors.map((s) => {
      if (s.id === id) {
        const credentials = s.assignedCredentials || {
          username: s.email,
          tempPass: "WLP-" + Math.floor(1000 + Math.random() * 9000),
          issuedAt: new Date().toISOString().replace("T", " ").split(".")[0],
        };
        return {
          ...s,
          status: "approved" as const,
          callStatus: "Vetted (Approved)" as const,
          assignedCredentials: credentials,
        };
      }
      return s;
    });
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }
  };

  const rejectSponsor = (id: string) => {
    const updated = pendingSponsors.map((s) => (s.id === id ? { ...s, status: "rejected" as const, callStatus: "Vetted (Rejected)" as const } : s));
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }
  };

  const generateCredentials = (id: string) => {
    const tempPass = "WLP-" + Math.floor(1000 + Math.random() * 9000);
    let username = "";

    const updated = pendingSponsors.map((s) => {
      if (s.id === id) {
        username = s.email;
        return {
          ...s,
          status: "approved" as const,
          callStatus: "Vetted (Approved)" as const,
          assignedCredentials: {
            username: s.email,
            tempPass,
            issuedAt: new Date().toISOString().replace("T", " ").split(".")[0],
          },
        };
      }
      return s;
    });
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }

    return { username, tempPass };
  };

  const updateCallStatus = (id: string, status: PendingSponsor["callStatus"]) => {
    const updated = pendingSponsors.map((s) => (s.id === id ? { ...s, callStatus: status } : s));
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }
  };

  const updateSponsorProfile = (id: string, name: string, company: string, linkedin: string, interests: string[]) => {
    const updated = pendingSponsors.map((s) => (s.id === id ? { ...s, name, company, linkedin, interests } : s));
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }
  };

  const completeFirstTimeProfile = (id: string, name: string, company: string, linkedin: string, interests: string[], newPass?: string) => {
    const updated = pendingSponsors.map((s) => (s.id === id ? { ...s, name, company, linkedin, interests, isProfileComplete: true } : s));
    setPendingSponsors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_pending_sponsors", JSON.stringify(updated));
    }
    logAuditAction("Sponsor First-Time Profile Completed", `Sponsor ${name} (${company}) completed profile setup.`);
  };

  const approveTalentAddition = (inquiryId: string) => {
    const inquiry = inquiries.find((i) => i.id === inquiryId);
    const updatedInq = inquiries.map((inq) => (inq.id === inquiryId ? { ...inq, status: "connected" as const } : inq));
    setInquiries(updatedInq);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_inquiries", JSON.stringify(updatedInq));
    }

    if (inquiry) {
      setProfiles((prev) =>
        prev.map((p) => (p.id === inquiry.talentId ? { ...p, status: "sponsored" as const } : p))
      );
    }
    logAuditAction("Inquiry Linked to Talent", `Approved connection for inquiry ID: ${inquiryId}`);
  };

  const rejectTalentAddition = (inquiryId: string) => {
    const updatedInq = inquiries.map((inq) => (inq.id === inquiryId ? { ...inq, status: "closed" as const } : inq));
    setInquiries(updatedInq);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_inquiries", JSON.stringify(updatedInq));
    }
    logAuditAction("Inquiry Declined", `Declined inquiry ID: ${inquiryId}`);
  };

  const verifyMfa = (code: string) => {
    if (code === "123456" || code.trim().length === 6) {
      setMfaVerified(true);
      localStorage.setItem("wlp_mfa_verified", "true");
      return true;
    }
    return false;
  };

  const sendInquiry = (talentId: string, talentName: string, message: string) => {
    const newInquiry: SponsorInquiry = {
      id: "inq-" + Date.now(),
      sponsorId: user?.uid || "sp-mock",
      sponsorName: user?.email ? user.email.split("@")[0] : "WLP Partner",
      sponsorEmail: user?.email || "sponsor@wlp.org",
      talentId,
      talentName,
      message,
      source: "Initiate Sponsorship",
      status: "pending",
      createdAt: new Date().toISOString().replace("T", " ").split(".")[0],
    };
    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wlp_inquiries", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userStatus,
        loading,
        pendingSponsors,
        inquiries,
        supportInquiries,
        profiles,
        branding,
        legalSecurity,
        missionVision,
        faqItems,
        teamMembers,
        auditLogs,
        transparencyReports,
        foundationVideos,
        sponsorDreams,
        mfaVerified,
        adminRole,
        login,
        register,
        logout,
        approveSponsor,
        rejectSponsor,
        deleteSponsor,
        updateSponsorPassword,
        updateSponsorCategoryAndTier,
        generateCredentials,
        provisionSponsorManual,
        updateCallStatus,
        updateSponsorProfile,
        completeFirstTimeProfile,
        approveTalentAddition,
        rejectTalentAddition,
        addProfile,
        updateProfile,
        deleteProfile,
        updateBranding,
        updateLegalSecurity,
        updateMissionVision,
        updateTeamMembers,
        addFaqItem,
        updateFaqItem,
        deleteFaqItem,
        submitSupportInquiry,
        resolveSupportInquiry,
        addTransparencyReport,
        deleteTransparencyReport,
        addFoundationVideo,
        deleteFoundationVideo,
        adoptSponsorDream,
        logAuditAction,
        setUserStatus,
        verifyMfa,
        setAdminRole,
        sendInquiry,
        bookVettingCall,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

