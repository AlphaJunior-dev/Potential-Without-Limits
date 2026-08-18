"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- compatibility boundary for unchanged legacy page contracts */

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { YouthProfile } from "@/lib/data";
import type { BrandingConfig, LegalSecurityConfig, MissionVisionData, TeamMember } from "@/lib/cmsData";

type UserStatus = "logged_out" | "pending" | "admin" | "approved";
type AdminRole = "Super Admin" | "Vetting Officer" | "Curator";
type FlexibleRecord = Record<string, any>;
export type PendingSponsor = FlexibleRecord;
type AuthContextType = {
  user: User | null;
  userStatus: UserStatus;
  loading: boolean;
  profiles: YouthProfile[];
  branding: BrandingConfig;
  legalSecurity: LegalSecurityConfig;
  missionVision: MissionVisionData;
  pendingSponsors: PendingSponsor[];
  inquiries: FlexibleRecord[];
  supportInquiries: FlexibleRecord[];
  faqItems: FlexibleRecord[];
  teamMembers: TeamMember[];
  auditLogs: FlexibleRecord[];
  transparencyReports: FlexibleRecord[];
  foundationVideos: FlexibleRecord[];
  sponsorDreams: FlexibleRecord[];
  mfaVerified: boolean;
  adminRole: AdminRole;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setAdminRole: (role: AdminRole) => void;
  bookVettingCall: (...args: any[]) => void;
  submitSupportInquiry: (...args: any[]) => void;
  [key: string]: any;
};

const safeBranding: BrandingConfig = {
  logoUrl: "/pwlif-logo.png", siteTitle: "Potential Without Limits International Foundation",
  primaryColor: "#051836", secondaryColor: "#005C27", backgroundColor: "#FDFCF9", cardBackgroundColor: "#FFFFFF", textColor: "#051836", headerFont: "Montserrat", bodyFont: "Inter",
  heroMediaType: "image", heroImage: "/pwlif-logo.png", heroBadgeText: "Potential Without Limits International Foundation (PWLIF)",
  heroHeadline: "Potential grows when communities lead.",
  heroSubheadline: "Potential Without Limits International Foundation is beginning a careful Rwanda pilot shaped through community-informed planning.",
  heroCtaText: "Explore the Rwanda Pilot", heroSecondaryCtaText: "Book Sponsor Orientation",
  heroCardLocation: "Rwanda pilot", heroCardTitle: "Community-guided potential", heroCardDescription: "Partnership conversations begin with an orientation call and safeguarding review.",
  videoSectionBadge: "Foundation Introduction", videoSectionTitle: "Foundation Introduction & Impact", videoSectionSubtitle: "An introduction video will be shared when it is ready.",
  sponsorSectionBadge: "Pilot Overview", sponsorSectionTitle: "Sponsor a Dream", sponsorSectionSubtitle: "Explore non-identifying pilot information and begin with an orientation conversation.",
  pathwaySectionBadge: "Our Pathway", pathwaySectionTitle: "From Potential to Purpose", pathwaySectionSubtitle: "A careful, community-guided pathway for the Rwanda pilot.",
  transparencySectionBadge: "Partnership", transparencySectionTitle: "Accountability & stewardship", transparencySectionSubtitle: "Detailed information is shared through appropriate private partnership conversations.",
  statsMetrics: [{ value: "Pilot", label: "Rwanda" }, { value: "Guided", label: "by community" }, { value: "Private", label: "orientation" }],
  pathSteps: [{ stepNumber: "01", title: "Listen", description: "Begin with community-informed planning." }, { stepNumber: "02", title: "Prepare", description: "Review safeguarding and partnership needs." }, { stepNumber: "03", title: "Connect", description: "Hold a private orientation conversation." }, { stepNumber: "04", title: "Support", description: "Coordinate carefully with local partners." }],
};

const safeMission: MissionVisionData = {
  mission: "PWLIF is preparing a community-informed Rwanda pilot focused on careful partnership, learning, and youth potential.",
  vision: "A future in which young people can access dignified, locally guided pathways to learn and thrive.",
  foundersNote: "Our work will be guided by careful listening, safeguarding, and respectful partnership.",
  foundersTitle: "Potential Without Limits International Foundation", pillars: [], lastUpdated: "",
};

const safeLegal: LegalSecurityConfig = { termsContent: "", privacyContent: "", securityStandardsContent: "", lastUpdated: "" };
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function noClientAuthority() {
  throw new Error("This control requires a secured server operation.");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userStatus, setStatus] = useState<UserStatus>("logged_out");
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<YouthProfile[]>([]);
  const [branding, setBranding] = useState<BrandingConfig>(safeBranding);
  const [missionVision, setMissionVision] = useState<MissionVisionData>(safeMission);
  const [adminRole, setAdminRole] = useState<AdminRole>("Super Admin");

  useEffect(() => {
    void fetch("/api/public").then((response) => response.ok ? response.json() : null).then((data) => {
      if (data?.branding) setBranding(data.branding);
      if (data?.missionVision) setMissionVision(data.missionVision);
      if (Array.isArray(data?.profiles)) setProfiles(data.profiles);
    }).catch(() => undefined);

    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) { setStatus("logged_out"); setLoading(false); return; }
      const claims = await currentUser.getIdTokenResult().then((token) => token.claims as Record<string, unknown>).catch(() => ({} as Record<string, unknown>));
      setStatus(claims.admin === true ? "admin" : claims.sponsor === true ? "approved" : "pending");
      setLoading(false);
    });
  }, []);

  const login = async (email: string, pass: string) => {
    const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), pass);
    const token = await credential.user.getIdTokenResult(true);
    if (token.claims.admin === true) { setStatus("admin"); return; }
    if (token.claims.sponsor === true) { setStatus("approved"); return; }
    await signOut(auth);
    throw new Error("This account is not approved for the requested portal.");
  };

  const value = useMemo<AuthContextType>(() => ({
    user, userStatus, loading, profiles, branding, missionVision, legalSecurity: safeLegal, adminRole, mfaVerified: userStatus === "admin",
    pendingSponsors: [], inquiries: [], supportInquiries: [], faqItems: [], teamMembers: [], auditLogs: [], transparencyReports: [], foundationVideos: [], sponsorDreams: [],
    login, logout: async () => { await signOut(auth); setUser(null); setStatus("logged_out"); }, setAdminRole,
    verifyMfa: () => false,
    bookVettingCall: (name: string, email: string, company: string, linkedin: string, preferredTime: string, category?: string, tier?: string, dreamInterest?: string) => {
      const websiteOrLinkedIn = /^https?:\/\//i.test(linkedin) ? linkedin : `https://${linkedin}`;
      void fetch("/api/orientation", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fullName: name, email, organization: company, roleTitle: category || "Prospective partner", websiteOrLinkedIn, orgDescription: dreamInterest || "Orientation request submitted from the public booking form.", supportIntent: `${category || "Partnership"} — ${tier || "Orientation"}`, preferredContactWindow: preferredTime, consent: true }) });
    },
    submitSupportInquiry: (name: string, email: string, subject: string, message: string, source = "Support Concierge") => {
      void fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, email, subject, message, source }) });
    },
    register: noClientAuthority, approveSponsor: noClientAuthority, rejectSponsor: noClientAuthority, deleteSponsor: noClientAuthority, updateSponsorPassword: noClientAuthority, updateSponsorCategoryAndTier: noClientAuthority, generateCredentials: noClientAuthority, provisionSponsorManual: noClientAuthority, updateCallStatus: noClientAuthority, updateSponsorProfile: noClientAuthority, completeFirstTimeProfile: noClientAuthority, approveTalentAddition: noClientAuthority, rejectTalentAddition: noClientAuthority, addProfile: noClientAuthority, updateProfile: noClientAuthority, deleteProfile: noClientAuthority, updateBranding: noClientAuthority, updateLegalSecurity: noClientAuthority, updateMissionVision: noClientAuthority, updateTeamMembers: noClientAuthority, addFaqItem: noClientAuthority, updateFaqItem: noClientAuthority, deleteFaqItem: noClientAuthority, resolveSupportInquiry: noClientAuthority, addTransparencyReport: noClientAuthority, deleteTransparencyReport: noClientAuthority, addFoundationVideo: noClientAuthority, deleteFoundationVideo: noClientAuthority, adoptSponsorDream: noClientAuthority, logAuditAction: noClientAuthority, setUserStatus: noClientAuthority, sendInquiry: noClientAuthority,
  }), [adminRole, branding, loading, missionVision, profiles, user, userStatus]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
