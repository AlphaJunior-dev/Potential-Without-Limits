"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- compatibility boundary for unchanged legacy page contracts */

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { TalentTag, YouthProfile } from "@/lib/data";
import { DEFAULT_SOCIAL_LINKS, INITIAL_EDITORIAL_PAGES, type BrandingConfig, type EditorialPagesConfig, type LegalSecurityConfig, type MissionVisionData, type SocialLink, type TeamMember } from "@/lib/cmsData";

type UserStatus = "logged_out" | "pending" | "admin" | "approved";
type AdminRole = "Super Admin" | "Vetting Officer" | "Curator";
type LoginDestination = "admin" | "approved";
type LoginPortal = "admin" | "sponsor";
type FlexibleRecord = Record<string, any>;
export type PendingSponsor = FlexibleRecord;
type AuthContextType = {
  user: User | null;
  userStatus: UserStatus;
  loading: boolean;
  profiles: YouthProfile[];
  publicProfiles: YouthProfile[];
  branding: BrandingConfig;
  legalSecurity: LegalSecurityConfig;
  editorialPages: EditorialPagesConfig;
  missionVision: MissionVisionData;
  pendingSponsors: PendingSponsor[];
  inquiries: FlexibleRecord[];
  supportInquiries: FlexibleRecord[];
  publicSubmissions: FlexibleRecord[];
  sponsorConversations: FlexibleRecord[];
  faqItems: FlexibleRecord[];
  teamMembers: TeamMember[];
  socialLinks: SocialLink[];
  updateSocialLinks: (links: SocialLink[]) => Promise<void>;
  auditLogs: FlexibleRecord[];
  transparencyReports: FlexibleRecord[];
  foundationVideos: FlexibleRecord[];
  talentTags: TalentTag[];
  talentCategories: TalentTag[];
  updateTalentCategories: (categories: TalentTag[]) => Promise<void>;
  sponsorDreams: FlexibleRecord[];
  mfaVerified: boolean;
  adminRole: AdminRole;
  login: (email: string, pass: string, portal?: LoginPortal) => Promise<LoginDestination>;
  logout: () => Promise<void>;
  setAdminRole: (role: AdminRole) => void;
  bookVettingCall: (...args: any[]) => void;
  submitSupportInquiry: (...args: any[]) => void;
  [key: string]: any;
};

const safeBranding: BrandingConfig = {
  logoUrl: "/pwlif-logo.png", siteTitle: "Potential Without Limits International Foundation",
  primaryColor: "#0B2E6B", secondaryColor: "#079432", backgroundColor: "#FCFCFA", cardBackgroundColor: "#FFFFFF", textColor: "#0B2E6B", headerFont: "Montserrat", bodyFont: "Inter",
  heroMediaType: "image", heroImage: "/pwlif-logo.png", heroBadgeText: "Potential Without Limits International Foundation (PWLIF)",
  heroHeadline: "Potential grows when communities lead.",
  heroSubheadline: "Potential Without Limits International Foundation is building careful, community-informed Sponsor Talent opportunities.",
  heroCtaText: "Explore Sponsor Talent", heroSecondaryCtaText: "Book Sponsor Orientation",
  heroCardLocation: "Sponsor Talent", heroCardTitle: "Community-guided potential", heroCardDescription: "Partnership conversations begin with an orientation call and safeguarding review.",
  videoSectionBadge: "Foundation Introduction", videoSectionTitle: "Foundation Introduction & Impact", videoSectionSubtitle: "An introduction video will be shared when it is ready.",
  sponsorSectionBadge: "Sponsor Talent", sponsorSectionTitle: "Sponsor Talent", sponsorSectionSubtitle: "Explore non-identifying Sponsor Talent information and begin with an orientation conversation.",
  pathwaySectionBadge: "Our Pathway", pathwaySectionTitle: "From Potential to Purpose", pathwaySectionSubtitle: "A careful, community-guided pathway for Sponsor Talent opportunities.",
  transparencySectionBadge: "Partnership", transparencySectionTitle: "Accountability & stewardship", transparencySectionSubtitle: "Detailed information is shared through appropriate private partnership conversations.",
  statsMetrics: [{ value: "Sponsor", label: "Talent" }, { value: "Guided", label: "by community" }, { value: "Private", label: "orientation" }],
  pathSteps: [{ stepNumber: "01", title: "Listen", description: "Begin with community-informed planning." }, { stepNumber: "02", title: "Prepare", description: "Review safeguarding and partnership needs." }, { stepNumber: "03", title: "Connect", description: "Hold a private orientation conversation." }, { stepNumber: "04", title: "Support", description: "Coordinate carefully with local partners." }],
};

const safeMission: MissionVisionData = {
  mission: "PWLIF develops community-informed Sponsor Talent opportunities through careful partnership, learning, and youth potential.",
  vision: "A future in which young people can access dignified, locally guided pathways to learn and thrive.",
  foundersNote: "Our work will be guided by careful listening, safeguarding, and respectful partnership.",
  foundersTitle: "Potential Without Limits International Foundation", presidentPhotoUrl: "", presidentPhotoFocusY: 35, presidentPhotoZoom: 100, pillars: [], lastUpdated: "",
};

function isTemporaryMissionCopy(value: unknown) {
  if (!value || typeof value !== "object") return false;
  const text = ["mission", "vision", "foundersNote", "foundersTitle"]
    .map((key) => String((value as Record<string, unknown>)[key] || ""))
    .join(" ")
    .toLowerCase();
  return text.includes("temporary test") || text.includes("test copy") || text.includes("test content");
}

const safeLegal: LegalSecurityConfig = { termsContent: "", privacyContent: "", securityStandardsContent: "", lastUpdated: "" };
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const internalTalentPhotoPattern = /^\/api\/talent-photo\/[A-Za-z0-9_-]{8,80}$/;
const internalTalentVideoPattern = /^\/api\/talent-video\/[A-Za-z0-9_-]{8,80}$/;
const internalMissionPresidentPhotoPattern = /^\/api\/mission-president-photo\/[A-Za-z0-9_-]{8,80}$/;
const MAX_TALENT_PHOTO_SOURCE_BYTES = 4 * 1024 * 1024;
const MAX_TALENT_VIDEO_SOURCE_BYTES = 50 * 1024 * 1024;

function isSafeTalentVideoUrl(value: unknown): value is string {
  return typeof value === "string" && internalTalentVideoPattern.test(value);
}

async function prepareTalentPhotoForPrivateMedia(source: File) {
  if (!/^image\/(jpeg|png|webp)$/i.test(source.type)) {
    throw new Error("Choose a JPEG, PNG, or WebP photo.");
  }

  if (source.size > MAX_TALENT_PHOTO_SOURCE_BYTES) {
    throw new Error("Choose a source photo smaller than 4 MB.");
  }

  return source;
}

function isSafeTalentPhotoUrl(value: unknown) {
  return typeof value === "string" && (/^https:\/\//i.test(value) || internalTalentPhotoPattern.test(value));
}

function isSafeMissionPresidentPhotoUrl(value: unknown): value is string {
  return typeof value === "string" && internalMissionPresidentPhotoPattern.test(value);
}

function noClientAuthority() {
  throw new Error("This control requires a secured server operation.");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userStatus, setStatus] = useState<UserStatus>("logged_out");
  const [loading, setLoading] = useState(true);
  const [publicProfiles, setPublicProfiles] = useState<YouthProfile[]>([]);
  const [adminProfiles, setAdminProfiles] = useState<YouthProfile[]>([]);
  const [sponsorProfiles, setSponsorProfiles] = useState<YouthProfile[]>([]);
  const [branding, setBranding] = useState<BrandingConfig>(safeBranding);
  const [missionVision, setMissionVision] = useState<MissionVisionData>(safeMission);
  const [legalSecurity, setLegalSecurity] = useState<LegalSecurityConfig>(safeLegal);
  const [editorialPages, setEditorialPages] = useState<EditorialPagesConfig>(INITIAL_EDITORIAL_PAGES);
  const [faqItems, setFaqItems] = useState<FlexibleRecord[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS);
  const [foundationVideos, setFoundationVideos] = useState<FlexibleRecord[]>([]);
  const [talentTags, setTalentTags] = useState<TalentTag[]>([]);
  const [talentCategories, setTalentCategories] = useState<TalentTag[]>([]);
  const [pendingSponsors, setPendingSponsors] = useState<PendingSponsor[]>([]);
  const [inquiries, setInquiries] = useState<FlexibleRecord[]>([]);
  const [publicSubmissions, setPublicSubmissions] = useState<FlexibleRecord[]>([]);
  const [sponsorConversations, setSponsorConversations] = useState<FlexibleRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<FlexibleRecord[]>([]);
  const [adminRole, setAdminRole] = useState<AdminRole>("Super Admin");
  const profiles = userStatus === "approved"
    ? sponsorProfiles
    : userStatus === "admin"
      ? adminProfiles
      : publicProfiles;

  const loadAdminData = async (authenticatedUser: User) => {
    const token = await authenticatedUser.getIdToken(true);
    const response = await fetch("/api/admin", { headers: { authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error("Could not load protected administrator records.");
    const data = await response.json() as FlexibleRecord;
    const applications = Array.isArray(data.applications) ? data.applications : [];
    const sponsorAccounts = Array.isArray(data.sponsorAccounts) ? data.sponsorAccounts : [];
    const sponsorAccountByApplicationId = new Map(
      sponsorAccounts
        .filter((account: FlexibleRecord) => typeof account.applicationId === "string")
        .map((account: FlexibleRecord) => [account.applicationId as string, account])
    );
    setPendingSponsors(applications.map((application: FlexibleRecord) => {
      const account = sponsorAccountByApplicationId.get(application.id) as FlexibleRecord | undefined;
      return {
        ...application,
        name: application.fullName || "Orientation applicant",
        company: application.organization || "",
        linkedin: application.websiteOrLinkedIn || "",
        invitationStatus: account?.invitationStatus,
        accessStatus: account?.accessStatus === "revoked" || application.accessStatus === "revoked" ? "revoked" : "active",
        passwordSetupComplete: Boolean(account?.passwordSetupCompletedAt),
      };
    }));
    setInquiries(Array.isArray(data.foundationInbox) ? data.foundationInbox : []);
    setPublicSubmissions(Array.isArray(data.publicSubmissions) ? data.publicSubmissions : []);
    setAuditLogs(Array.isArray(data.audit) ? data.audit : []);
    setTalentTags(Array.isArray(data.site?.talentTags) ? data.site.talentTags : []);
    setTalentCategories(Array.isArray(data.site?.talentCategories) ? data.site.talentCategories : []);
    setEditorialPages({ ...INITIAL_EDITORIAL_PAGES, ...(data.site?.editorialPages && typeof data.site.editorialPages === "object" ? data.site.editorialPages : {}) } as EditorialPagesConfig);
    setTeamMembers(Array.isArray(data.site?.teamMembers) ? data.site.teamMembers as TeamMember[] : []);
    const records = Array.isArray(data.talentRecords) ? data.talentRecords : [];
    setAdminProfiles(records.map((record: FlexibleRecord) => ({
      id: record.id,
      name: record.displayTitle,
      age: 0,
      category: record.supportArea,
      location: record.region || (record.visibility?.profileVisible === true ? "Publicly displayed" : "Not publicly displayed"),
      bio: record.summary,
      coverPhoto: record.photoUrl || "/pwlif-logo.png",
      rawMediaUrl: Array.isArray(record.mediaUrls) ? record.mediaUrls.find(isSafeTalentVideoUrl) || "" : "",
      galleryImages: record.photoUrl ? [record.photoUrl] : [],
      galleryVideos: Array.isArray(record.mediaUrls) ? record.mediaUrls.filter(isSafeTalentVideoUrl) : [],
      featuredOnHomepage: record.visibility?.profileVisible === true,
      publicVisibility: {
        profileVisible: record.visibility?.profileVisible === true,
        photoVisible: record.visibility?.photoVisible === true,
        mediaVisible: record.visibility?.mediaVisible === true,
        summaryVisible: record.visibility?.summaryVisible === true,
        ageBandVisible: record.visibility?.ageBandVisible === true,
        regionVisible: record.visibility?.regionVisible === true,
        skillsVisible: record.visibility?.skillsVisible === true,
        storyVisible: record.visibility?.storyVisible === true,
        aspirationVisible: record.visibility?.aspirationVisible === true,
        supportPathwayVisible: record.visibility?.supportPathwayVisible === true,
      },
      status: "active",
      inquiriesCount: 0,
      skills: Array.isArray(record.skills) ? record.skills : [],
      dream: record.aspiration || "",
      current_situation: record.story || "",
      progress: "",
      current_needs: record.supportPathway || "",
      country_community: "",
      consentRecord: { parentalConsent: false, mediaReleasePermission: false, signedDate: "", guardianName: "", ...(record.consent || {}) },
      ageBand: record.ageBand || "",
      region: record.region || "",
      story: record.story || "",
      aspiration: record.aspiration || "",
      supportPathway: record.supportPathway || "",
    })) as YouthProfile[]);
  };

  const loadApprovedSponsorProfiles = async (authenticatedUser: User) => {
    const token = await authenticatedUser.getIdToken(true);
    const response = await fetch("/api/sponsor", { headers: { authorization: `Bearer ${token}` } });
    const payload = !response.ok
      ? await response.json().catch(() => null) as { reason?: unknown } | null
      : null;
    // Only an explicit server-confirmed revocation ends an active Firebase session.
    // A temporary data or authorization response must leave the user signed in so
    // the dashboard can present an accurate recovery state instead of redirecting.
    if (response.status === 403 && payload?.reason === "revoked") {
      await signOut(auth);
      throw new Error("Sponsor dashboard access has been revoked.");
    }
    if (!response.ok) throw new Error("Could not load the approved Sponsor Talent pipeline.");
    const data = await response.json() as FlexibleRecord;
    const talent = Array.isArray(data.talent) ? data.talent : [];
    setSponsorConversations(Array.isArray(data.conversations) ? data.conversations : []);
    setSponsorProfiles(talent.map((record: FlexibleRecord) => {
      const mediaUrls = Array.isArray(record.mediaUrls) ? record.mediaUrls.filter(isSafeTalentVideoUrl) : [];
      const photoUrl = isSafeTalentPhotoUrl(record.photoUrl)
        ? record.photoUrl
        : "/pwlif-logo.png";
      const summary = typeof record.summary === "string" ? record.summary : "";
      const supportArea = typeof record.supportArea === "string" ? record.supportArea : "Sponsor Talent";
      return {
        id: String(record.id || ""),
        name: typeof record.title === "string" ? record.title : "Sponsor Talent",
        age: 0,
        category: supportArea,
        location: "Private Sponsor Talent pipeline",
        bio: summary,
        coverPhoto: photoUrl,
        rawMediaUrl: mediaUrls[0] || "",
        galleryImages: photoUrl !== "/pwlif-logo.png" ? [photoUrl] : [],
        galleryVideos: mediaUrls,
        featuredOnHomepage: true,
        publicVisibility: { profileVisible: true, photoVisible: true, mediaVisible: true, summaryVisible: true },
        privateSponsorAccess: true,
        status: "active" as const,
        inquiriesCount: 0,
        dream: summary,
        current_situation: summary,
        progress: "",
        current_needs: supportArea,
        country_community: "Private Sponsor Talent pipeline",
        consentRecord: { parentalConsent: false, mediaReleasePermission: false, signedDate: "", guardianName: "" },
      };
    }) as YouthProfile[]);
  };

  useEffect(() => {
    void fetch("/api/public").then((response) => response.ok ? response.json() : null).then((data) => {
      if (data?.branding) setBranding(data.branding);
      if (data?.missionVision && !isTemporaryMissionCopy(data.missionVision)) setMissionVision(data.missionVision);
      if (data?.legalSecurity) setLegalSecurity(data.legalSecurity);
      if (Array.isArray(data?.talentTags)) setTalentTags(data.talentTags);
      if (Array.isArray(data?.profiles)) setPublicProfiles(data.profiles);
      if (Array.isArray(data?.faqItems)) setFaqItems(data.faqItems);
      if (Array.isArray(data?.teamMembers)) {
        setTeamMembers((current) => current.length > 0 ? current : data.teamMembers);
      }
      if (Array.isArray(data?.socialLinks)) setSocialLinks(data.socialLinks as SocialLink[]);
      if (Array.isArray(data?.foundationVideos)) setFoundationVideos(data.foundationVideos);
      if (data?.editorialPages && typeof data.editorialPages === "object") {
        setEditorialPages({ ...INITIAL_EDITORIAL_PAGES, ...data.editorialPages } as EditorialPagesConfig);
      }
    }).catch(() => undefined);

    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setSponsorProfiles([]);
        setSponsorConversations([]);
        setStatus("logged_out");
        setLoading(false);
        return;
      }
      // Refresh once when Firebase reports a session change. A newly approved sponsor can
      // otherwise receive a cached token here after `login()` has already refreshed claims,
      // causing this listener to overwrite the approved state with `pending`.
      const claims = await currentUser.getIdTokenResult(true).then((token) => token.claims as Record<string, unknown>).catch(() => ({} as Record<string, unknown>));
      const nextStatus = claims.admin === true ? "admin" : claims.sponsor === true ? "approved" : "pending";
      setStatus(nextStatus);
      if (nextStatus === "admin") void loadAdminData(currentUser).catch(() => undefined);
      if (nextStatus === "approved") void loadApprovedSponsorProfiles(currentUser).catch(() => setSponsorProfiles([]));
      setLoading(false);
    });
  }, []);

  const login = async (email: string, pass: string, portal?: LoginPortal): Promise<LoginDestination> => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), pass);
      const token = await credential.user.getIdTokenResult(true);
      if (token.claims.admin === true) {
        if (portal === "sponsor") {
          await signOut(auth);
          throw new Error("This account is an administrator account. Please use the Admin Login portal.");
        }
        setStatus("admin");
        return "admin";
      }
      if (token.claims.sponsor === true) {
        if (portal === "admin") {
          await signOut(auth);
          throw new Error("This account is approved for Sponsor access. Please use the Sponsor Login portal.");
        }
        const sponsorToken = await credential.user.getIdToken(true);
        const sponsorAccess = await fetch("/api/sponsor", {
          headers: { authorization: `Bearer ${sponsorToken}` },
        });
        if (!sponsorAccess.ok) {
          await signOut(auth);
          throw new Error("Your Sponsor account is not ready for dashboard access yet. Please complete the current PWLIF invitation email to set your password, or ask the foundation to resend the invitation.");
        }
        // Firebase's hosted password-reset page returns the newly approved Sponsor
        // here after it consumes the one-time action code. This server-side,
        // claim-gated metadata update is deliberately best-effort: access remains
        // governed by the approved Firebase claim and active account record.
        await fetch("/api/sponsor", {
          method: "POST",
          headers: { authorization: `Bearer ${sponsorToken}`, "content-type": "application/json" },
          body: JSON.stringify({ action: "completePasswordSetup" }),
        }).catch(() => undefined);
        setStatus("approved");
        return "approved";
      }
      await signOut(auth);
      throw new Error("This account is not approved for the requested portal.");
    } catch (loginError: unknown) {
      const code = typeof loginError === "object" && loginError && "code" in loginError
        ? String((loginError as { code?: unknown }).code)
        : "";
      if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        if (portal === "admin") {
          throw new Error("We could not verify these administrator credentials. Check the administrator email and password, then try again.");
        }
        throw new Error("We could not verify this Sponsor login. Please use the email and password you created through a current PWLIF invitation. Sponsor access is activated only after orientation approval.");
      }
      throw loginError;
    }
  };

  const updateBranding = async (nextBranding: BrandingConfig) => {
    if (!user || userStatus !== "admin") throw new Error("Administrator access is required to update public content.");
    const token = await user.getIdToken(true);
    const response = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "updateBranding", branding: nextBranding }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(typeof result?.error === "string" ? result.error : "Could not save branding settings.");
    if (result?.branding && typeof result.branding === "object") {
      setBranding((current) => ({ ...current, ...result.branding }));
    }
  };

  const updatePublicContent = async (action: string, body: Record<string, unknown>) => {
    if (!user || userStatus !== "admin") throw new Error("Administrator access is required to update public content.");
    const token = await user.getIdToken(true);
    const response = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, ...body }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(typeof result?.error === "string" ? result.error : "Could not save public content.");
    return result as FlexibleRecord;
  };

  const uploadTalentPhoto = async (photo: File) => {
    if (!user || userStatus !== "admin") throw new Error("Administrator access is required to upload a Talent photo.");
    const token = await user.getIdToken(true);
    const preparedPhoto = await prepareTalentPhotoForPrivateMedia(photo);
    const form = new FormData();
    form.append("photo", preparedPhoto);
    const response = await fetch("/api/admin/talent-photo", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: form,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !isSafeTalentPhotoUrl(result?.url)) {
      throw new Error(typeof result?.error === "string" ? result.error : "The Talent photo could not be stored.");
    }
    return result.url;
  };

  const uploadMissionPresidentPhoto = async (photo: File) => {
    if (!user || userStatus !== "admin") throw new Error("Administrator access is required to upload the president photo.");
    const token = await user.getIdToken(true);
    const preparedPhoto = await prepareTalentPhotoForPrivateMedia(photo);
    const form = new FormData();
    form.append("photo", preparedPhoto);
    const response = await fetch("/api/admin/mission-president-photo", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: form,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !isSafeMissionPresidentPhotoUrl(result?.url)) {
      throw new Error(typeof result?.error === "string" ? result.error : "The president photo could not be stored.");
    }
    return result.url;
  };

  const uploadTalentVideo = async (video: File) => {
    if (!user || userStatus !== "admin") throw new Error("Administrator access is required to upload a Talent video.");
    if (!/^(video\/mp4|video\/webm)$/i.test(video.type) || video.size < 1 || video.size > MAX_TALENT_VIDEO_SOURCE_BYTES) {
      throw new Error("Choose one MP4 or WebM video up to 50 MB.");
    }
    const token = await user.getIdToken(true);
    const start = await fetch("/api/admin/talent-video", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "start", contentType: video.type.toLowerCase(), size: video.size }),
    });
    const target = await start.json().catch(() => ({})) as FlexibleRecord;
    if (!start.ok || typeof target.assetId !== "string" || typeof target.uploadUrl !== "string" || !target.uploadUrl.startsWith("https://")) {
      throw new Error(typeof target?.error === "string" ? target.error : "The Talent video could not be prepared for storage.");
    }

    const uploaded = await fetch(target.uploadUrl, {
      method: "PUT",
      headers: { "content-type": video.type, "x-upsert": "false" },
      body: video,
    });
    if (!uploaded.ok) throw new Error("The private media service did not accept this video. Please try again.");

    const complete = await fetch("/api/admin/talent-video", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "complete", assetId: target.assetId }),
    });
    const result = await complete.json().catch(() => ({})) as FlexibleRecord;
    if (!complete.ok || !isSafeTalentVideoUrl(result?.url)) {
      throw new Error(typeof result?.error === "string" ? result.error : "The Talent video could not be confirmed in private storage.");
    }
    return result.url;
  };

  const updateMissionVision = async (nextMissionVision: MissionVisionData) => {
    const result = await updatePublicContent("updateMissionVision", { missionVision: nextMissionVision });
    if (result.missionVision && typeof result.missionVision === "object") setMissionVision(result.missionVision as MissionVisionData);
  };

  const updateTeamMembers = async (nextTeamMembers: TeamMember[]) => {
    const result = await updatePublicContent("updateTeamMembers", { teamMembers: nextTeamMembers });
    if (Array.isArray(result.teamMembers)) setTeamMembers(result.teamMembers as TeamMember[]);
  };

  const updateSocialLinks = async (nextSocialLinks: SocialLink[]) => {
    const result = await updatePublicContent("updateSocialLinks", { socialLinks: nextSocialLinks });
    if (Array.isArray(result.socialLinks)) setSocialLinks(result.socialLinks as SocialLink[]);
  };

  const updateLegalSecurity = async (nextLegalSecurity: LegalSecurityConfig) => {
    const result = await updatePublicContent("updateLegalSecurity", { legalSecurity: nextLegalSecurity });
    if (result.legalSecurity && typeof result.legalSecurity === "object") setLegalSecurity(result.legalSecurity as LegalSecurityConfig);
  };

  const updateEditorialPages = async (nextEditorialPages: EditorialPagesConfig) => {
    const result = await updatePublicContent("updateEditorialPages", { editorialPages: nextEditorialPages });
    if (result.editorialPages && typeof result.editorialPages === "object") setEditorialPages(result.editorialPages as EditorialPagesConfig);
  };

  const updateFoundationVideos = async (nextFoundationVideos: FlexibleRecord[]) => {
    const result = await updatePublicContent("updateFoundationVideos", { foundationVideos: nextFoundationVideos });
    if (Array.isArray(result.foundationVideos)) setFoundationVideos(result.foundationVideos as FlexibleRecord[]);
  };

  const updateTalentTags = async (nextTalentTags: TalentTag[]) => {
    const result = await updatePublicContent("updateTalentTagLibrary", { talentTags: nextTalentTags });
    if (Array.isArray(result.talentTags)) setTalentTags(result.talentTags as TalentTag[]);
  };

  const updateTalentCategories = async (nextTalentCategories: TalentTag[]) => {
    const result = await updatePublicContent("updateTalentCategoryLibrary", { talentCategories: nextTalentCategories });
    if (Array.isArray(result.talentCategories)) setTalentCategories(result.talentCategories as TalentTag[]);
  };

  const runOperationalAction = async (action: string, payload: FlexibleRecord = {}) => {
    const result = await updatePublicContent(action, payload);
    if (user) await loadAdminData(user);
    return result;
  };

  const approveSponsor = async (applicationId: string) => runOperationalAction("reviewApplication", { applicationId, status: "approved" });
  const rejectSponsor = async (applicationId: string) => runOperationalAction("reviewApplication", { applicationId, status: "declined" });
  const deleteSponsor = async (applicationId: string) => runOperationalAction("deleteSponsor", { applicationId });
  const revokeSponsorAccess = async (applicationId: string) => runOperationalAction("revokeSponsorAccess", { applicationId });
  const generateCredentials = async (applicationId: string) => {
    const result = await runOperationalAction("sendSponsorInvitation", { applicationId });
    const sponsor = pendingSponsors.find((item) => item.id === applicationId);
    return { email: sponsor?.email || "Approved sponsor", invitationStatus: result.invitationStatus === "requested" ? "Email request accepted" : "Invitation request pending" };
  };

  const provisionSponsorManual = async (email: string, fullName: string, organization: string) => {
    const result = await runOperationalAction("createManualSponsorInvitation", {
      email,
      fullName,
      organization,
      postCallConfirmed: true,
    });
    return { email: email.trim().toLowerCase(), invitationStatus: result.invitationStatus === "requested" ? "Email request accepted" : "Invitation request pending" };
  };

  const sendInquiry = async (subject: string, message: string, talentId?: string) => {
    if (!user || userStatus !== "approved") throw new Error("Approved sponsor access is required to contact the Foundation.");
    const token = await user.getIdToken(true);
    const response = await fetch("/api/sponsor", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ action: "sendMessage", subject, message, ...(talentId ? { talentId } : {}) }),
    });
    const payload = await response.json().catch(() => null) as { error?: string } | null;
    if (!response.ok) throw new Error(payload?.error || "Your message could not be sent. Please try again.");
    return payload;
  };

  const replyToFoundationConversation = async (conversationId: string, message: string) => {
    if (!user || userStatus !== "approved") throw new Error("Approved sponsor access is required to reply to the Foundation.");
    const token = await user.getIdToken(true);
    const response = await fetch("/api/sponsor", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ action: "replyToConversation", conversationId, message }),
    });
    const payload = await response.json().catch(() => null) as { error?: string } | null;
    if (!response.ok) throw new Error(payload?.error || "Your reply could not be sent. Please try again.");
    await loadApprovedSponsorProfiles(user);
    return payload;
  };

  const replyToSponsorConversation = async (conversationId: string, message: string) => {
    const result = await runOperationalAction("replyToSponsorConversation", { conversationId, message });
    return result;
  };

  const saveTalentRecord = async (profile: YouthProfile, id?: string) => {
    const title = String(profile.name || "").trim();
    const summary = String(profile.bio || "").trim();
    const supportArea = String(profile.category || "").trim();
    const requestedVisibility = profile.publicVisibility;
    const profileVisible = requestedVisibility?.profileVisible ?? profile.featuredOnHomepage === true;
    const visibility = {
      profileVisible,
      photoVisible: profileVisible && requestedVisibility?.photoVisible === true && isSafeTalentPhotoUrl(profile.coverPhoto),
      mediaVisible: profileVisible && requestedVisibility?.mediaVisible === true && Array.isArray(profile.galleryVideos) && profile.galleryVideos.some(isSafeTalentVideoUrl),
      summaryVisible: profileVisible && requestedVisibility?.summaryVisible === true,
      ageBandVisible: profileVisible && requestedVisibility?.ageBandVisible === true,
      regionVisible: profileVisible && requestedVisibility?.regionVisible === true,
      skillsVisible: profileVisible && requestedVisibility?.skillsVisible === true,
      storyVisible: profileVisible && requestedVisibility?.storyVisible === true,
      aspirationVisible: profileVisible && requestedVisibility?.aspirationVisible === true,
      supportPathwayVisible: profileVisible && requestedVisibility?.supportPathwayVisible === true,
    };
    return runOperationalAction(id ? "updateTalentRecord" : "createTalentRecord", {
      ...(id ? { talentId: id } : {}),
      talentRecord: {
        displayTitle: title,
        summary,
        supportArea,
        ageBand: profile.ageBand || "",
        region: profile.region || "",
        skills: profile.skills || [],
        story: profile.story || profile.current_situation || "",
        aspiration: profile.aspiration || profile.dream || "",
        supportPathway: profile.supportPathway || profile.current_needs || "",
        consent: { reference: profile.consentRecord?.reference || "", mediaReleasePermission: profile.consentRecord?.mediaReleasePermission === true },
        photoUrl: isSafeTalentPhotoUrl(profile.coverPhoto) ? profile.coverPhoto : "",
        mediaUrls: (profile.galleryVideos || []).filter(isSafeTalentVideoUrl),
        displayOrder: 0,
        visibility,
      },
    });
  };

  const value = useMemo<AuthContextType>(() => ({
    user, userStatus, loading, profiles, publicProfiles, branding, missionVision, legalSecurity, editorialPages, adminRole, mfaVerified: userStatus === "admin", talentTags, talentCategories,
    pendingSponsors, inquiries, supportInquiries: publicSubmissions, publicSubmissions, sponsorConversations, faqItems, teamMembers, socialLinks, auditLogs, transparencyReports: [], foundationVideos, sponsorDreams: [],
    login, logout: async () => { await signOut(auth); setSponsorProfiles([]); setUser(null); setStatus("logged_out"); }, setAdminRole,
    verifyMfa: () => false,
    bookVettingCall: (name: string, email: string, company: string, linkedin: string, category?: string, dreamInterest?: string) => {
      const websiteOrLinkedIn = /^https?:\/\//i.test(linkedin) ? linkedin : `https://${linkedin}`;
      void fetch("/api/orientation", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fullName: name, email, organization: company, roleTitle: category || "Prospective partner", websiteOrLinkedIn, orgDescription: dreamInterest || "Orientation request submitted from the public booking form.", supportIntent: `${category || "Partnership"} — Orientation`, consent: true }) });
    },
    submitSupportInquiry: (name: string, email: string, subject: string, message: string, source = "Support Concierge") => {
      void fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, email, subject, message, source }) });
    },
    register: noClientAuthority, approveSponsor, rejectSponsor, deleteSponsor, revokeSponsorAccess, updateSponsorPassword: noClientAuthority, updateSponsorCategoryAndTier: noClientAuthority, generateCredentials, provisionSponsorManual, updateSponsorProfile: noClientAuthority, completeFirstTimeProfile: noClientAuthority, approveTalentAddition: noClientAuthority, rejectTalentAddition: noClientAuthority, uploadTalentPhoto, uploadMissionPresidentPhoto, uploadTalentVideo, addProfile: (profile: YouthProfile) => saveTalentRecord(profile), updateProfile: (profile: YouthProfile) => saveTalentRecord(profile, profile.id), deleteProfile: (id: string) => runOperationalAction("deleteTalentRecord", { talentId: id }), updateBranding, updateLegalSecurity, updateEditorialPages, updateMissionVision, updateTeamMembers, updateSocialLinks, updateTalentTags, updateTalentCategories, addFaqItem: noClientAuthority, updateFaqItem: noClientAuthority, deleteFaqItem: noClientAuthority, resolveSupportInquiry: (itemId: string) => runOperationalAction("resolvePublicSubmission", { submissionId: itemId }), resolveSponsorConversation: (itemId: string) => runOperationalAction("resolveInboxItem", { itemId }), replyToSponsorConversation, replyToFoundationConversation, addTransparencyReport: noClientAuthority, deleteTransparencyReport: noClientAuthority, addFoundationVideo: async (video: FlexibleRecord) => updateFoundationVideos([...foundationVideos, video]), deleteFoundationVideo: async (id: string) => updateFoundationVideos(foundationVideos.filter((video) => video.id !== id)), adoptSponsorDream: noClientAuthority, logAuditAction: noClientAuthority, setUserStatus: noClientAuthority, sendInquiry,
  }), [adminRole, adminProfiles, auditLogs, branding, editorialPages, faqItems, foundationVideos, inquiries, legalSecurity, loading, missionVision, pendingSponsors, profiles, publicProfiles, publicSubmissions, socialLinks, sponsorConversations, sponsorProfiles, talentCategories, talentTags, teamMembers, user, userStatus]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
