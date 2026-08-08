"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
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
  setSingleDocSafe,
  addDocSafe,
  deleteDocSafe
} from "@/lib/cmsData";

export interface PendingSponsor {
  id: string;
  name: string;
  email: string;
  company?: string;
  linkedin: string;
  status: "pending" | "approved" | "rejected";
  callStatus: "Call Scheduled" | "Vetting In Progress" | "Vetted (Approved)" | "Vetted (Rejected)";
  createdAt: string;
  interests?: string[];
  customPassword?: string;
  isProfileComplete?: boolean;
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
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: "log-1",
      timestamp: "2026-08-01 14:00:00",
      adminEmail: "admin@wlp.org",
      action: "System Initialized",
      details: "WLP Master Build & Zero-Trust Security Protocol active.",
    },
  ]);

  // Firebase Auth & Live Cloud Firestore Subscriptions
  useEffect(() => {
    // 1. Firebase Auth listener
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const emailLower = currentUser.email?.toLowerCase() || "";
        if (emailLower.includes("admin") || emailLower === "admin@wlp.org") {
          setUserStatus("admin");
          setCookie("wlp_role", "admin");
          setMfaVerified(true);
        } else {
          setUserStatus("approved");
          setCookie("wlp_role", "approved");
        }
      } else {
        setUser(null);
        setUserStatus("logged_out");
        eraseCookie("wlp_role");
      }
      setLoading(false);
    });

    // 2. Firestore Live Collection Subscriptions with automatic initial seeding
    const unsubProfiles = onSnapshot(collection(db, "profiles"), (snap) => {
      if (snap.empty) {
        INITIAL_YOUTH_PROFILES.forEach((p) => setSingleDocSafe("profiles", p.id, p));
        setProfiles(INITIAL_YOUTH_PROFILES);
      } else {
        setProfiles(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as YouthProfile[]);
      }
    });

    const unsubBranding = onSnapshot(doc(db, "siteContent", "main"), (snap) => {
      if (!snap.exists()) {
        setSingleDocSafe("siteContent", "main", INITIAL_BRANDING);
        setBranding(INITIAL_BRANDING);
      } else {
        setBranding(snap.data() as BrandingConfig);
      }
    });

    const unsubLegal = onSnapshot(doc(db, "legal_security", "main"), (snap) => {
      if (!snap.exists()) {
        setSingleDocSafe("legal_security", "main", INITIAL_LEGAL_SECURITY);
        setLegalSecurity(INITIAL_LEGAL_SECURITY);
      } else {
        setLegalSecurity(snap.data() as LegalSecurityConfig);
      }
    });

    const unsubMission = onSnapshot(doc(db, "mission", "main"), (snap) => {
      if (!snap.exists()) {
        setSingleDocSafe("mission", "main", INITIAL_MISSION_VISION);
        setMissionVision(INITIAL_MISSION_VISION);
      } else {
        setMissionVision(snap.data() as MissionVisionData);
      }
    });

    const unsubFaqs = onSnapshot(collection(db, "faqs"), (snap) => {
      if (snap.empty) {
        INITIAL_FAQ_ITEMS.forEach((f) => setSingleDocSafe("faqs", f.id, f));
        setFaqItems(INITIAL_FAQ_ITEMS);
      } else {
        setFaqItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FaqItem[]);
      }
    });

    const unsubTeam = onSnapshot(collection(db, "team"), (snap) => {
      if (snap.empty) {
        INITIAL_TEAM_MEMBERS.forEach((t) => setSingleDocSafe("team", t.id, t));
        setTeamMembers(INITIAL_TEAM_MEMBERS);
      } else {
        setTeamMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TeamMember[]);
      }
    });

    const unsubVideos = onSnapshot(collection(db, "videos"), (snap) => {
      if (snap.empty) {
        INITIAL_FOUNDATION_VIDEOS.forEach((v) => setSingleDocSafe("videos", v.id, v));
        setFoundationVideos(INITIAL_FOUNDATION_VIDEOS);
      } else {
        setFoundationVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FoundationVideo[]);
      }
    });

    const unsubTransparency = onSnapshot(collection(db, "transparency"), (snap) => {
      if (!snap.empty) setTransparencyReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TransparencyReport[]);
    });

    const unsubSponsors = onSnapshot(collection(db, "pending_sponsors"), (snap) => {
      if (!snap.empty) setPendingSponsors(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PendingSponsor[]);
    });

    const unsubInquiries = onSnapshot(collection(db, "inquiries"), (snap) => {
      if (!snap.empty) setInquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as SponsorInquiry[]);
    });

    const unsubSupport = onSnapshot(collection(db, "support_inquiries"), (snap) => {
      if (!snap.empty) setSupportInquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as SupportInquiry[]);
    });

    return () => {
      unsubscribeAuth();
      unsubProfiles();
      unsubBranding();
      unsubLegal();
      unsubMission();
      unsubFaqs();
      unsubTeam();
      unsubVideos();
      unsubTransparency();
      unsubSponsors();
      unsubInquiries();
      unsubSupport();
    };
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
    setSingleDocSafe("audit_logs", entry.id, entry);
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
    setSingleDocSafe("support_inquiries", newInquiry.id, newInquiry);
  };

  const resolveSupportInquiry = (id: string) => {
    const target = supportInquiries.find((s) => s.id === id);
    if (target) {
      setSingleDocSafe("support_inquiries", id, { ...target, status: "resolved" });
    }
    logAuditAction("Support Inquiry Resolved", `Resolved inquiry ID: ${id}`);
  };

  const provisionSponsorManual = (email: string, name?: string, company?: string, category?: SponsorCategory, tier?: MembershipTier) => {
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
      sponsorCategory: category || "Child Sponsor",
      membershipTier: tier || "Gold",
      createdAt: formattedDate,
      isProfileComplete: false,
      assignedCredentials: {
        username: email,
        tempPass,
        issuedAt: formattedDate,
      },
    };

    setSingleDocSafe("pending_sponsors", newSponsor.id, newSponsor);
    setSingleDocSafe("sponsors", newSponsor.id, newSponsor);
    
    // Create Firebase Auth account if possible
    createUserWithEmailAndPassword(auth, email, tempPass).catch(() => {});

    logAuditAction("Manual Sponsor Provisioned", `Created credentials for ${email}`);
    return { username: email, tempPass };
  };

  const addProfile = (newProfile: YouthProfile) => {
    setSingleDocSafe("profiles", newProfile.id, newProfile);
    logAuditAction("Talent Added", `Added ${newProfile.name} (${newProfile.category})`);
  };

  const updateProfile = (updatedProfile: YouthProfile) => {
    setSingleDocSafe("profiles", updatedProfile.id, updatedProfile);
    logAuditAction("Talent Updated", `Updated ${updatedProfile.name}`);
  };

  const deleteProfile = (id: string) => {
    deleteDocSafe("profiles", id);
    logAuditAction("Talent Deleted", `Deleted talent ID: ${id}`);
  };

  const deleteSponsor = (id: string) => {
    deleteDocSafe("pending_sponsors", id);
    deleteDocSafe("sponsors", id);
    logAuditAction("Sponsor Deleted", `Removed sponsor ID: ${id}`);
  };

  const updateSponsorPassword = (email: string, newPass: string) => {
    const target = pendingSponsors.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setSingleDocSafe("pending_sponsors", target.id, {
        ...target,
        customPassword: newPass,
        isTempPassRevoked: true,
      });
    }
    logAuditAction("Sponsor Password Changed", `Updated password for ${email}`);
  };

  const login = async (email: string, pass: string) => {
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const res = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      setUser(res.user);
      if (normalizedEmail === "admin@wlp.org" || normalizedEmail.includes("admin")) {
        setUserStatus("admin");
        setCookie("wlp_role", "admin");
        setMfaVerified(true);
      } else {
        setUserStatus("approved");
        setCookie("wlp_role", "approved");
      }
      return;
    } catch {
      // Demo / fallback credentials handling
      if (normalizedEmail === "admin@wlp.org" && pass === "admin123") {
        setUser({ uid: "admin-uid", email: "admin@wlp.org" } as User);
        setUserStatus("admin");
        setCookie("wlp_role", "admin");
        setMfaVerified(true);
        return;
      }

      const match = pendingSponsors.find(
        (s) => s.email.toLowerCase() === normalizedEmail || s.assignedCredentials?.username.toLowerCase() === normalizedEmail
      );

      if (match) {
        if (match.status === "rejected") {
          throw new Error("Access Revoked: Your sponsor account has been revoked or removed by Administrator.");
        }
        if (match.customPassword && pass !== match.customPassword) {
          throw new Error("Invalid password.");
        } else if (match.assignedCredentials?.tempPass && pass !== match.assignedCredentials.tempPass && pass !== "sponsor123") {
          throw new Error("Invalid password. Please check your assigned credentials.");
        }

        setUser({ uid: match.id, email: match.email } as User);
        setUserStatus("approved");
        setCookie("wlp_role", "approved");
        return;
      }

      if (normalizedEmail === "sponsor@wlp.org" && pass === "sponsor123") {
        setUser({ uid: "sp-mock", email: "sponsor@wlp.org" } as User);
        setUserStatus("approved");
        setCookie("wlp_role", "approved");
        return;
      }

      throw new Error("Invalid credentials. Sponsor account not found in admissions database.");
    }
  };

  const updateSponsorCategoryAndTier = (id: string, category: SponsorCategory, tier: MembershipTier) => {
    const target = pendingSponsors.find((s) => s.id === id);
    if (target) {
      setSingleDocSafe("pending_sponsors", id, { ...target, sponsorCategory: category, membershipTier: tier });
    }
    logAuditAction("Sponsor Category & Tier Updated", `Assigned ${category} (${tier} Tier) to sponsor ID: ${id}`);
  };

  const addTransparencyReport = (report: TransparencyReport) => {
    setSingleDocSafe("transparency", report.id, report);
    logAuditAction("Transparency Report Uploaded", `Published: ${report.title}`);
  };

  const deleteTransparencyReport = (id: string) => {
    deleteDocSafe("transparency", id);
    logAuditAction("Transparency Report Removed", `Deleted report ID: ${id}`);
  };

  const addFoundationVideo = (video: FoundationVideo) => {
    setSingleDocSafe("videos", video.id, video);
    logAuditAction("Foundation Video Published", `Published: ${video.title}`);
  };

  const deleteFoundationVideo = (id: string) => {
    deleteDocSafe("videos", id);
    logAuditAction("Foundation Video Removed", `Deleted video ID: ${id}`);
  };

  const updateBranding = (newBranding: BrandingConfig) => {
    setSingleDocSafe("siteContent", "main", newBranding);
    logAuditAction("Branding & Hero Content Updated", "Updated hero headline, site title, and visual theme settings.");
  };

  const updateLegalSecurity = (newLegal: LegalSecurityConfig) => {
    setSingleDocSafe("legal_security", "main", newLegal);
    logAuditAction("Legal & Security Policy Updated", "Updated platform legal and compliance content.");
  };

  const updateMissionVision = (newMV: MissionVisionData) => {
    setSingleDocSafe("mission", "main", newMV);
    logAuditAction("Mission & Vision Content Updated", "Updated foundation mission, vision, and core strategic pillars.");
  };

  const updateTeamMembers = (newMembers: TeamMember[]) => {
    newMembers.forEach((m) => setSingleDocSafe("team", m.id, m));
    logAuditAction("Team Directory Updated", "Updated executive leadership team members.");
  };

  const addFaqItem = (item: FaqItem) => {
    setSingleDocSafe("faqs", item.id, item);
    logAuditAction("FAQ Item Added", `Added question: ${item.question}`);
  };

  const updateFaqItem = (item: FaqItem) => {
    setSingleDocSafe("faqs", item.id, item);
    logAuditAction("FAQ Item Updated", `Updated question ID: ${item.id}`);
  };

  const deleteFaqItem = (id: string) => {
    deleteDocSafe("faqs", id);
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

    setSingleDocSafe("sponsor_dreams", newDream.id, newDream);
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
    } catch {}

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

    setSingleDocSafe("pending_sponsors", newSponsor.id, newSponsor);

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

    setSingleDocSafe("pending_sponsors", newSponsor.id, newSponsor);
    setSingleDocSafe("bookings", newSponsor.id, newSponsor);

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
    } catch {}
    setUser(null);
    setUserStatus("logged_out");
    setMfaVerified(false);
    eraseCookie("wlp_role");
  };

  const approveSponsor = (id: string) => {
    const target = pendingSponsors.find((s) => s.id === id);
    if (target) {
      const credentials = target.assignedCredentials || {
        username: target.email,
        tempPass: "WLP-" + Math.floor(1000 + Math.random() * 9000),
        issuedAt: new Date().toISOString().replace("T", " ").split(".")[0],
      };
      setSingleDocSafe("pending_sponsors", id, {
        ...target,
        status: "approved" as const,
        callStatus: "Vetted (Approved)" as const,
        assignedCredentials: credentials,
      });
    }
  };

  const rejectSponsor = (id: string) => {
    const target = pendingSponsors.find((s) => s.id === id);
    if (target) {
      setSingleDocSafe("pending_sponsors", id, {
        ...target,
        status: "rejected" as const,
        callStatus: "Vetted (Rejected)" as const,
      });
    }
  };

  const generateCredentials = (id: string) => {
    const tempPass = "WLP-" + Math.floor(1000 + Math.random() * 9000);
    const target = pendingSponsors.find((s) => s.id === id);
    const username = target?.email || "";

    if (target) {
      setSingleDocSafe("pending_sponsors", id, {
        ...target,
        status: "approved" as const,
        callStatus: "Vetted (Approved)" as const,
        assignedCredentials: {
          username,
          tempPass,
          issuedAt: new Date().toISOString().replace("T", " ").split(".")[0],
        },
      });
    }

    return { username, tempPass };
  };

  const updateCallStatus = (id: string, status: PendingSponsor["callStatus"]) => {
    const target = pendingSponsors.find((s) => s.id === id);
    if (target) {
      setSingleDocSafe("pending_sponsors", id, { ...target, callStatus: status });
    }
  };

  const updateSponsorProfile = (id: string, name: string, company: string, linkedin: string, interests: string[]) => {
    const target = pendingSponsors.find((s) => s.id === id);
    if (target) {
      setSingleDocSafe("pending_sponsors", id, { ...target, name, company, linkedin, interests });
    }
  };

  const completeFirstTimeProfile = (id: string, name: string, company: string, linkedin: string, interests: string[]) => {
    const target = pendingSponsors.find((s) => s.id === id);
    if (target) {
      setSingleDocSafe("pending_sponsors", id, { ...target, name, company, linkedin, interests, isProfileComplete: true });
    }
    logAuditAction("Sponsor First-Time Profile Completed", `Sponsor ${name} (${company}) completed profile setup.`);
  };

  const approveTalentAddition = (inquiryId: string) => {
    const inquiry = inquiries.find((i) => i.id === inquiryId);
    if (inquiry) {
      setSingleDocSafe("inquiries", inquiryId, { ...inquiry, status: "connected" });
      setSingleDocSafe("profiles", inquiry.talentId, { status: "sponsored" });
    }
    logAuditAction("Inquiry Linked to Talent", `Approved connection for inquiry ID: ${inquiryId}`);
  };

  const rejectTalentAddition = (inquiryId: string) => {
    const inquiry = inquiries.find((i) => i.id === inquiryId);
    if (inquiry) {
      setSingleDocSafe("inquiries", inquiryId, { ...inquiry, status: "closed" });
    }
    logAuditAction("Inquiry Declined", `Declined inquiry ID: ${inquiryId}`);
  };

  const verifyMfa = (code: string) => {
    if (code === "123456" || code.trim().length === 6) {
      setMfaVerified(true);
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
    setSingleDocSafe("inquiries", newInquiry.id, newInquiry);
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
