"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth, PendingSponsor } from "@/context/AuthContext";
import { TalentPhoto } from "@/components/TalentPhoto";
import { WlpLogoMark } from "@/components/WlpLogo";
import { INITIAL_YOUTH_PROFILES, YouthProfile } from "@/lib/data";
import { INITIAL_MISSION_VISION, INITIAL_TEAM_MEMBERS, TeamMember } from "@/lib/cmsData";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  CheckCircle2, 
  ArrowLeft,
  Calendar,
  Lock,
  Layers,
  FileText,
  UserCheck,
  Building,
  Building2,
  Sparkles,
  MessageSquare,
  UserPlus,
  ExternalLink,
  Activity,
  LogOut,
  ChevronRight,
  Menu,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Play,
  Eye,
  Award,
  Mail,
  User
} from "lucide-react";

export default function AdminDashboardPage() {
  const { 
    userStatus, 
    pendingSponsors, 
    inquiries, 
    profiles,
    branding,
    legalSecurity,
    auditLogs,
    mfaVerified, 
    adminRole, 
    verifyMfa, 
    setAdminRole, 
    approveSponsor, 
    rejectSponsor,
    deleteSponsor,
    updateSponsorPassword,
    generateCredentials,
    provisionSponsorManual,
    updateCallStatus,
    approveTalentAddition,
    rejectTalentAddition,
    addProfile,
    updateProfile,
    deleteProfile,
    updateBranding,
    updateLegalSecurity,
    missionVision,
    updateMissionVision,
    faqItems,
    addFaqItem,
    updateFaqItem,
    deleteFaqItem,
    teamMembers,
    updateTeamMembers,
    transparencyReports,
    foundationVideos,
    addTransparencyReport,
    deleteTransparencyReport,
    addFoundationVideo,
    deleteFoundationVideo,
    uploadTalentPhoto,
    logout
  } = useAuth();

  // CMS State: Talent Profiles Extended Fields
  const [dream, setDream] = useState("");
  const [currentSituation, setCurrentSituation] = useState("");
  const [progress, setProgress] = useState("");
  const [currentNeeds, setCurrentNeeds] = useState("");
  const [countryCommunity, setCountryCommunity] = useState("");
  const [mediaReleasePermission, setMediaReleasePermission] = useState(true);

  // CMS State: Transparency Financial Reports Form
  const [transparencyTitle, setTransparencyTitle] = useState("");
  const [transparencyAuditDate, setTransparencyAuditDate] = useState("2026-01-15");
  const [transparencyTotalFunded, setTransparencyTotalFunded] = useState("$250,000");
  const [transparencyChildrenImpacted, setTransparencyChildrenImpacted] = useState(120);
  const [transparencyCategory, setTransparencyCategory] = useState<"Financial Audit" | "Annual Impact Report" | "Program Stewardship">("Financial Audit");
  const [transparencyPdfUrl, setTransparencyPdfUrl] = useState("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");

  // CMS State: Video Management Form
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  const [videoThumbnail, setVideoThumbnail] = useState("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80");
  const [videoDuration, setVideoDuration] = useState("3:45");
  const [videoCategory, setVideoCategory] = useState<"Foundation Intro" | "Impact Story" | "Transformational Journey">("Foundation Intro");
  const [videoDescription, setVideoDescription] = useState("");

  // Selected Left Sidebar Section & Mobile Sidebar State
  const [activeSection, setActiveSection] = useState<
    "vetting" | "inquiries" | "talent" | "mission" | "team" | "branding" | "legal" | "audit" | "transparency" | "videos"
  >("vetting");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Manual Post-Call Sponsor Invitation State
  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualCompany, setManualCompany] = useState("");
  const [manualPostCallConfirmed, setManualPostCallConfirmed] = useState(false);
  const [provisionedModal, setProvisionedModal] = useState<{ email: string; invitationStatus: string } | null>(null);

  // Global Toast System State
  const [toastNotice, setToastNotice] = useState<{ title: string; message: string } | null>(null);

  const triggerToast = (title: string, message: string) => {
    setToastNotice({ title, message });
    setTimeout(() => setToastNotice(null), 4000);
  };

  // Branding CMS Form State
  const [brandingForm, setBrandingForm] = useState(branding);
  const [brandingNotice, setBrandingNotice] = useState(false);

  // Legal CMS Form State
  const [legalForm, setLegalForm] = useState(legalSecurity);
  const [legalNotice, setLegalNotice] = useState(false);

  // MFA State
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState(false);

  // Invitation Status Modal & Sponsor Inspector Modal
  const [credentialModalSponsor, setCredentialModalSponsor] = useState<{ name: string; email: string; invitationStatus: string } | null>(null);
  const [selectedSponsorOverview, setSelectedSponsorOverview] = useState<PendingSponsor | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCallStatus, setFilterCallStatus] = useState<string>("All");

  // CMS State: Talent Profiles
  const [editingId, setEditingId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("Technology");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [rawMediaUrl, setRawMediaUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [talentVisibility, setTalentVisibility] = useState({ profileVisible: false, photoVisible: false, mediaVisible: false, summaryVisible: false });
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  // CMS State: Mission & Vision
  const [missionText, setMissionText] = useState(missionVision?.mission || INITIAL_MISSION_VISION.mission);
  const [visionText, setVisionText] = useState(missionVision?.vision || INITIAL_MISSION_VISION.vision);
  const [foundersNoteText, setFoundersNoteText] = useState(missionVision?.foundersNote || INITIAL_MISSION_VISION.foundersNote);
  const [foundersTitleText, setFoundersTitleText] = useState(missionVision?.foundersTitle || INITIAL_MISSION_VISION.foundersTitle);
  const [pillars, setPillars] = useState(missionVision?.pillars || INITIAL_MISSION_VISION.pillars);
  const [cmsSavedNotice, setCmsSavedNotice] = useState(false);

  // CMS State: Team Members
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [memberPhoto, setMemberPhoto] = useState("");
  const [memberVisibility, setMemberVisibility] = useState({ isPublic: false, showPhoto: false, showRole: false, showBio: false, showLink: false });

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyMfa(mfaCode)) {
      setMfaError(true);
    }
  };

  const handleSendInvitationClick = async (id: string, name: string) => {
    try {
      const invitation = await generateCredentials(id);
      setCredentialModalSponsor({ name, email: invitation.email, invitationStatus: invitation.invitationStatus });
    } catch (err) {
      triggerToast("✗ Invitation Not Sent", err instanceof Error ? err.message : "Check the sponsor approval and invitation configuration, then try again.");
    }
  };

  // Persistent Talent photo upload: browser files are stored only after the
  // server verifies the Firebase administrator claim and returns an HTTPS URL.
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setImageUploadError(null);
    setIsImageUploading(true);

    try {
      const photoUrls: string[] = [];
      for (const file of Array.from(files)) {
        photoUrls.push(await uploadTalentPhoto(file));
      }
      setUploadedImages((current) => [...current, ...photoUrls]);
      setCoverPhoto((current) => current || photoUrls[0] || "");
      triggerToast("✓ Photo Stored", `${photoUrls.length} Talent photo${photoUrls.length === 1 ? "" : "s"} is ready to save.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The Talent photo could not be stored.";
      setImageUploadError(message);
      triggerToast("✗ Photo Not Stored", message);
    } finally {
      setIsImageUploading(false);
      e.target.value = "";
    }
  };

  // Local Video Upload Handler (Unlimited)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const videoBlobUrl = URL.createObjectURL(file);
      setUploadedVideos((prev) => [...prev, videoBlobUrl]);
      if (!rawMediaUrl) setRawMediaUrl(videoBlobUrl);
    });
  };

  // Save Talent CMS
  const handleSaveTalent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const existing = profiles.find((p) => p.id === editingId);
        if (existing) {
          await updateProfile({
            ...existing,
            name: firstName,
            age: parseInt(age) || existing.age,
            category,
            location,
            bio,
            coverPhoto: coverPhoto || existing.coverPhoto,
            rawMediaUrl: rawMediaUrl || existing.rawMediaUrl,
            galleryImages: uploadedImages.length > 0 ? uploadedImages : existing.galleryImages,
            galleryVideos: uploadedVideos.length > 0 ? uploadedVideos : existing.galleryVideos,
            publicVisibility: talentVisibility,
            dream: dream || existing.dream,
            current_situation: currentSituation || existing.current_situation,
            progress: progress || existing.progress,
            current_needs: currentNeeds || existing.current_needs,
            country_community: countryCommunity || existing.country_community,
            consentRecord: {
              parentalConsent: true,
              mediaReleasePermission: mediaReleasePermission,
              signedDate: existing.consentRecord?.signedDate || "2026-01-10",
              guardianName: existing.consentRecord?.guardianName || "Parent/Guardian",
            }
          });
        }
        triggerToast("✓ Profile Updated", "Youth creator profile updated in database.");
        setEditingId(null);
      } else {
        const newProfile: YouthProfile = {
          id: "yp-" + Date.now(),
          name: firstName,
          age: parseInt(age) || 18,
          category,
          location,
          bio,
          coverPhoto: coverPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
          rawMediaUrl: rawMediaUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          status: "active",
          inquiriesCount: 0,
          galleryImages: uploadedImages,
          galleryVideos: uploadedVideos,
          publicVisibility: talentVisibility,
          dream: dream || "Mastering technical skills and community innovation.",
          current_situation: currentSituation || bio,
          progress: progress || "Actively participating in local community youth labs.",
          current_needs: currentNeeds || "Educational grant & laptop hardware",
          country_community: countryCommunity || location,
          consentRecord: {
            parentalConsent: true,
            mediaReleasePermission: mediaReleasePermission,
            signedDate: "2026-01-10",
            guardianName: "Parent/Guardian",
          }
        };
        await addProfile(newProfile);
        triggerToast("✓ Profile Created", "New youth creator added to directory.");
      }
      setFirstName("");
      setAge("");
      setLocation("");
      setBio("");
      setCoverPhoto("");
      setRawMediaUrl("");
      setUploadedImages([]);
      setUploadedVideos([]);
      setTalentVisibility({ profileVisible: false, photoVisible: false, mediaVisible: false, summaryVisible: false });
    } catch (err) {
      triggerToast("✗ Save Failed", err instanceof Error ? err.message : "Could not save talent profile. Check your connection and try again.");
    }
  };

  const handleEditTalent = (p: YouthProfile) => {
    setEditingId(p.id);
    setFirstName(p.name);
    setAge(p.age.toString());
    setCategory(p.category);
    setLocation(p.location || "");
    setBio(p.bio);
    setCoverPhoto(p.coverPhoto);
    setRawMediaUrl(p.rawMediaUrl || "");
    setUploadedImages(p.galleryImages || []);
    setUploadedVideos(p.galleryVideos || []);
    setTalentVisibility(p.publicVisibility || { profileVisible: p.featuredOnHomepage === true, photoVisible: p.featuredOnHomepage === true, mediaVisible: p.featuredOnHomepage === true, summaryVisible: p.featuredOnHomepage === true });
  };

  const handleDeleteTalent = async (id: string) => {
    try {
      await deleteProfile(id);
      triggerToast("✓ Profile Removed", "Youth creator profile deleted.");
    } catch (err) {
      triggerToast("✗ Delete Failed", err instanceof Error ? err.message : "Could not delete profile. Check your connection and try again.");
    }
  };

  // Save Mission & Vision CMS
  const handleSaveMissionVision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMissionVision({
        mission: missionText,
        vision: visionText,
        foundersNote: foundersNoteText,
        foundersTitle: foundersTitleText,
        pillars,
        lastUpdated: new Date().toISOString().split("T")[0],
      });
      setCmsSavedNotice(true);
      triggerToast("✓ Mission & Vision Saved", "Public mission statement and pillars updated.");
      setTimeout(() => setCmsSavedNotice(false), 3000);
    } catch (err) {
      triggerToast("✗ Save Failed", err instanceof Error ? err.message : "Could not save Mission & Vision. Check your connection and try again.");
    }
  };

  // Save Team Member CMS
  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMemberId) {
        const updated = teamMembers.map((m) =>
          m.id === editingMemberId
            ? {
                ...m,
                name: memberName,
                role: memberRole,
                bio: memberBio,
                photoUrl: memberPhoto || m.photoUrl,
                visibility: memberVisibility,
              }
            : m
        );
        await updateTeamMembers(updated);
        triggerToast("✓ Member Updated", "Team member profile updated.");
        setEditingMemberId(null);
      } else {
        const newMember: TeamMember = {
          id: "tm-" + Date.now(),
          name: memberName,
          role: memberRole,
          bio: memberBio,
          photoUrl: memberPhoto,
          visibility: memberVisibility,
          order: teamMembers.length + 1,
        };
        await updateTeamMembers([...teamMembers, newMember]);
        triggerToast("✓ Member Added", "New leadership member added to roster.");
      }
      setMemberName("");
      setMemberRole("");
      setMemberBio("");
      setMemberPhoto("");
      setMemberVisibility({ isPublic: false, showPhoto: false, showRole: false, showBio: false, showLink: false });
    } catch (err) {
      triggerToast("✗ Save Failed", err instanceof Error ? err.message : "Could not save team member. Check your connection and try again.");
    }
  };

  const handleEditMember = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setMemberName(m.name);
    setMemberRole(m.role);
    setMemberBio(m.bio);
    setMemberPhoto(m.photoUrl);
    setMemberVisibility(m.visibility || { isPublic: true, showPhoto: true, showRole: true, showBio: true, showLink: true });
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const updated = teamMembers.filter((m) => m.id !== id);
      await updateTeamMembers(updated);
      triggerToast("✓ Member Removed", "Team member deleted from roster.");
    } catch (err) {
      triggerToast("✗ Delete Failed", err instanceof Error ? err.message : "Could not remove team member. Check your connection and try again.");
    }
  };

  // MFA Gate
  if (!mfaVerified && userStatus === "admin") {
    return (
      <div className="min-h-screen bg-[#FCFCFA] text-[#0B2E6B] flex items-center justify-center p-4 font-inter bg-gallery-pattern">
        <div className="bg-white border border-[#079432]/30 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-[#079432]/10 text-[#079432] mb-2 border border-[#079432]/30">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-montserrat font-black text-2xl">MFA Authentication Required</h1>
            <p className="text-xs text-[#0B2E6B]/60">
              Admin Portal security protocol: Enter your 6-digit authenticator passcode to access administrative control panel.
            </p>
          </div>

          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => {
                  setMfaCode(e.target.value);
                  setMfaError(false);
                }}
                placeholder="Authenticator code"
                className="w-full text-center font-mono text-2xl tracking-widest p-3 rounded-xl bg-[#FCFCFA] border border-[#0B2E6B]/20 text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
              />
              {mfaError && (
                <p className="text-red-400 text-xs text-center mt-2 font-semibold">
                  Verification could not be completed. Please sign in again with your configured identity provider.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#079432] text-white font-extrabold py-3.5 rounded-xl hover:brightness-110 transition text-sm cursor-pointer shadow-lg"
            >
              Authenticate Command Session
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter Vetting List
  const filteredSponsors = pendingSponsors.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.company && s.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterCallStatus === "All" || s.callStatus === filterCallStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FCFCFA] text-[#0B2E6B] font-inter flex flex-col md:flex-row bg-gallery-pattern">
      {/* Mobile Top Header Toggle Bar */}
      <div className="md:hidden bg-white border-b border-[#0B2E6B]/10 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/pwlif-logo.png" alt="PWLIF" className="h-7 w-auto object-contain" />
          <span className="font-montserrat font-bold text-xs text-[#0B2E6B]">Admin Portal</span>
        </div>

        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-lg bg-[#0B2E6B]/10 text-[#0B2E6B] hover:bg-[#0B2E6B]/20 transition"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* LEFT NAVIGATION SIDEBAR */}
      <aside
        className={`${
          isMobileSidebarOpen ? "block" : "hidden md:flex"
        } w-full md:w-64 bg-white border-r border-[#0B2E6B]/10 shrink-0 flex-col justify-between p-4 md:p-6 space-y-8 min-h-screen md:min-h-0 md:sticky md:top-0 md:h-screen md:self-start md:overflow-y-auto z-30`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="space-y-2 hidden md:block">
            <div className="flex items-center gap-2">
              <img src="/pwlif-logo.png" alt="PWLIF" className="h-8 w-auto object-contain" />
              <span className="font-montserrat font-bold text-sm tracking-tight text-[#0B2E6B]">
                Admin Portal
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#0B2E6B]/50 bg-[#FCFCFA] px-2.5 py-1 rounded-md border border-[#0B2E6B]/10 font-mono">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Session: Active Admin</span>
            </div>
          </div>

          {/* RBAC Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2E6B]/40 block">
              Active Security Role
            </span>
            <select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value as "Super Admin" | "Vetting Officer" | "Curator")}
              className="w-full bg-[#FCFCFA] border border-[#0B2E6B]/15 text-[#0B2E6B] text-xs rounded-lg p-2 focus:outline-none focus:border-[#079432]"
            >
              <option value="Super Admin">Super Admin (Full Access)</option>
              <option value="Vetting Officer">Vetting Officer</option>
              <option value="Curator">Curator (CMS Only)</option>
            </select>
          </div>

          {/* Navigation Control Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveSection("vetting");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "vetting"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Sponsor Vetting</span>
              </div>
              <span className="text-[10px] bg-[#0B2E6B]/20 px-1.5 py-0.5 rounded font-mono">
                {pendingSponsors.filter((s) => s.status === "pending").length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSection("inquiries");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "inquiries"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4" />
                <span>Inquiries &amp; Additions</span>
              </div>
              <span className="text-[10px] bg-[#079432]/20 text-[#0B2E6B] px-1.5 py-0.5 rounded font-mono font-bold">
                {inquiries.filter((i) => i.status === "pending").length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSection("talent");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "talent"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Talent Directory CMS</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("branding");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "branding"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Site &amp; Hero Content CMS</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("transparency");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "transparency"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#F7B500]" />
                <span>Transparency Financial CMS</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-amber-700" /> Classified
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSection("videos");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "videos"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <VideoIcon className="w-4 h-4 text-[#F7B500]" />
              <span>Video Management CMS</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("legal");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "legal"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Legal &amp; Security CMS</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("mission");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "mission"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Mission &amp; Vision CMS</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("team");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "team"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Meet the Team CMS</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("audit");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "audit"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Metrics &amp; Audit Trail</span>
            </button>
          </nav>
        </div>


        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#0B2E6B]/10 space-y-2">
          <Link
            href="/"
            className="w-full bg-[#0B2E6B]/10 hover:bg-[#0B2E6B]/20 text-[#0B2E6B] font-semibold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#079432]" />
            <span>Back to Public Site</span>
          </Link>

          <button
            onClick={logout}
            className="w-full text-[#0B2E6B]/50 hover:text-[#0B2E6B] text-xs py-2 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>End Admin Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-w-7xl">
        {/* PANEL 1: Sponsor Vetting Hub */}
        {activeSection === "vetting" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">
                  Sponsor Vetting &amp; Onboarding
                </h1>
                <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                  Review incoming sponsor applications, verify categories and tiers, and approve access.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#0B2E6B]/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter sponsors..."
                    className="pl-9 pr-4 py-2 bg-white border border-[#0B2E6B]/15 rounded-xl text-xs text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                  />
                </div>

                <select
                  value={filterCallStatus}
                  onChange={(e) => setFilterCallStatus(e.target.value)}
                  className="bg-white border border-[#0B2E6B]/15 text-xs text-[#0B2E6B] rounded-xl p-2 focus:outline-none"
                >
                  <option value="All">All Call Statuses</option>
                  <option value="Call Scheduled">Call Scheduled</option>
                  <option value="Vetted (Approved)">Vetted (Approved)</option>
                  <option value="Vetted (Rejected)">Vetted (Rejected)</option>
                </select>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#0B2E6B]/10 pb-3">
                <h3 className="font-montserrat font-bold text-sm text-[#0B2E6B] flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#079432]" />
                  Approve Foundation Sponsor
                </h3>
                <span className="text-[10px] text-[#0B2E6B]/50 font-mono">Send post-call sponsor invitation</span>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!manualEmail.trim() || !manualName.trim() || !manualPostCallConfirmed) return;
                  try {
                    const invitation = await provisionSponsorManual(manualEmail, manualName, manualCompany);
                    setProvisionedModal(invitation);
                    setManualEmail("");
                    setManualName("");
                    setManualCompany("");
                    setManualPostCallConfirmed(false);
                  } catch (err) {
                    triggerToast("✗ Invitation Not Sent", err instanceof Error ? err.message : "Check the post-call confirmation and invitation configuration, then try again.");
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs"
              >
                <div>
                  <label className="block text-[#0B2E6B]/70 font-semibold mb-1">Sponsor Email *</label>
                  <input
                    type="email"
                    required
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="sponsor@company.com"
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                  />
                </div>

                <div>
                  <label className="block text-[#0B2E6B]/70 font-semibold mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                  />
                </div>

                <div>
                  <label className="block text-[#0B2E6B]/70 font-semibold mb-1">Organization / Foundation</label>
                  <input
                    type="text"
                    value={manualCompany}
                    onChange={(e) => setManualCompany(e.target.value)}
                    placeholder="Acme Foundation"
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                  />
                </div>

                <label className="sm:col-span-3 flex items-center gap-2 text-[#0B2E6B]/70 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={manualPostCallConfirmed}
                    onChange={(e) => setManualPostCallConfirmed(e.target.checked)}
                    className="h-3.5 w-3.5 accent-[#079432]"
                  />
                  <span>I confirm this sponsor has completed an orientation call.</span>
                </label>

                <button
                  type="submit"
                  disabled={!manualPostCallConfirmed}
                  className="bg-[#079432] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Sponsor Invitation</span>
                </button>
              </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#0B2E6B]/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#0B2E6B]/60 uppercase font-mono tracking-wider border-b border-[#0B2E6B]/10">
                    <tr>
                      <th className="p-4">Organization / Contact</th>
                      <th className="p-4">Category &amp; Tier</th>
                      <th className="p-4">Vetting Call Status</th>
                      <th className="p-4">Verification Actions</th>
                      <th className="p-4">Invitation Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredSponsors.map((sponsor) => (
                      <tr key={sponsor.id} className="hover:bg-[#0B2E6B]/5 transition">
                        <td className="p-4 space-y-1">
                          <div className="font-bold text-sm text-[#0B2E6B] flex items-center gap-2">
                            <span>{sponsor.company || "Corporate Partner"}</span>
                            <span className="text-[10px] text-[#0B2E6B]/50 font-normal">
                              ({sponsor.name})
                            </span>
                          </div>
                          <div className="text-[#0B2E6B]/60 font-mono text-[11px]">{sponsor.email}</div>
                          <a
                            href={sponsor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#079432] hover:underline text-[10px] inline-flex items-center gap-1"
                          >
                            LinkedIn Record <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </td>

                        <td className="p-4 space-y-1">
                          <div className="flex flex-col gap-1">
                            <span className="bg-[#079432]/10 text-[#079432] text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit">
                              {sponsor.sponsorCategory || "Child Sponsor"}
                            </span>
                            <span className="bg-[#F7B500]/15 text-[#0B2E6B] text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit">
                              {sponsor.membershipTier || "Gold Tier"}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 space-y-2">
                          <select
                            value={sponsor.callStatus}
                            onChange={(e) => updateCallStatus(sponsor.id, e.target.value as PendingSponsor["callStatus"])}
                            className="bg-[#F8FAFC] border border-[#0B2E6B]/15 text-xs text-[#0B2E6B] rounded-lg p-1.5 focus:outline-none"
                          >
                            <option value="Not Scheduled">Not Scheduled</option>
                            <option value="Call Scheduled">Call Scheduled</option>
                            <option value="Vetted (Approved)">Vetted (Approved)</option>
                            <option value="Vetted (Rejected)">Vetted (Rejected)</option>
                          </select>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {sponsor.status === "approved" ? (
                              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" /> Vetted &amp; Approved
                              </span>
                            ) : (
                              <button
                                onClick={async () => {
                                  try {
                                    await approveSponsor(sponsor.id);
                                    triggerToast("✓ Sponsor Approved", `${sponsor.name} vetted and approved.`);
                                  } catch (err) {
                                    triggerToast("✗ Approval Failed", err instanceof Error ? err.message : "Check your connection and try again.");
                                  }
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" /> Approve Sponsor
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          {sponsor.invitationStatus === "sent" ? (
                            <span className="bg-[#0B2E6B]/10 text-[#0B2E6B] font-mono text-[11px] px-3 py-1.5 rounded-lg border border-[#0B2E6B]/15 inline-flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-[#079432]" />
                              <span>Invitation Sent</span>
                            </span>
                          ) : (
                            <button
                              disabled={sponsor.status !== "approved"}
                              onClick={() => handleSendInvitationClick(sponsor.id, sponsor.name)}
                              className="bg-[#079432] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-3 py-1.5 rounded-lg transition text-[11px] inline-flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Send Invitation</span>
                            </button>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedSponsorOverview(sponsor)}
                              className="bg-[#079432]/10 hover:bg-[#079432] text-[#079432] hover:text-[#0B2E6B] font-bold px-2.5 py-1.5 rounded-lg border border-[#079432]/30 transition text-[11px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Overview</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Revoke access and delete sponsor "${sponsor.name}" (${sponsor.company || sponsor.email})?`)) {
                                  deleteSponsor(sponsor.id);
                                  triggerToast("✓ Sponsor Access Revoked", `Removed ${sponsor.name} and revoked dashboard access.`);
                                }
                              }}
                              className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white font-bold p-1.5 rounded-lg border border-red-500/30 transition text-[11px] cursor-pointer"
                              title="Delete Sponsor & Revoke Access"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: Dedicated Sponsor Inquiries & Talent Additions */}
        {activeSection === "inquiries" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">
                Sponsor Inquiries &amp; Talent Sponsorship Requests
              </h1>
              <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                Review requests from verified sponsors wanting to add specific youth creators to their corporate portfolio or provide equipment grants.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#0B2E6B]/10 overflow-hidden shadow-xl">
              {inquiries.length === 0 ? (
                <div className="p-12 text-center text-[#0B2E6B]/50 text-xs">
                  No active sponsor talent requests pending review.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-6 flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-3 max-w-2xl">
                        <div className="flex items-center gap-3">
                          <span className="font-montserrat font-bold text-base text-[#0B2E6B]">
                            Sponsor: {inq.sponsorName} ({inq.sponsorEmail})
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              inq.status === "connected"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : inq.status === "closed"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {inq.status === "connected" ? "Linked to Portfolio" : inq.status}
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#0B2E6B]/10 text-xs text-[#0B2E6B]/80 space-y-1">
                          <p className="font-semibold text-[#079432]">
                            Target Creator Requested: <span className="text-[#0B2E6B] font-bold">{inq.talentName}</span>
                          </p>
                          <p className="text-[#0B2E6B]/70 italic">&quot;{inq.message}&quot;</p>
                          <span className="text-[10px] text-[#0B2E6B]/40 block font-mono pt-1">
                            Submitted: {inq.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row md:flex-col justify-center gap-2 shrink-0">
                        {inq.status === "pending" ? (
                          <>
                            <button
                              onClick={() => approveTalentAddition(inq.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#0B2E6B]" />
                              <span>Approve &amp; Link Talent</span>
                            </button>
                            <button
                              onClick={() => rejectTalentAddition(inq.id)}
                              className="bg-[#0B2E6B]/10 hover:bg-[#0B2E6B]/20 text-[#0B2E6B] font-semibold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <X className="w-4 h-4 text-red-400" />
                              <span>Decline Request</span>
                            </button>
                          </>
                        ) : (
                          <div className="text-right text-xs font-semibold text-[#0B2E6B]/60">
                            Status: <span className="text-emerald-400">{inq.status}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 3: Sponsor Talent Directory CMS */}
        {activeSection === "talent" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">
                Sponsor Talent Directory CMS
              </h1>
              <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                Add and edit controlled Sponsor Talent records. Public visibility is always your choice.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#0B2E6B]/10 pb-3">
                  <h2 className="font-montserrat font-bold text-base text-[#0B2E6B]">
                    {editingId ? "Edit Sponsor Talent Record" : "Add Sponsor Talent Record"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setFirstName("Public Talent Profile");
                      setAge("18");
                      setCategory("Technology");
                      setLocation("Community-based");
                      setBio("Add an approved, non-identifying summary of the talent and their support pathway.");
                      setCoverPhoto("");
                      setRawMediaUrl("");
                      setTalentVisibility({ profileVisible: false, photoVisible: false, mediaVisible: false, summaryVisible: false });
                    }}
                    className="text-[11px] font-bold text-[#079432] hover:underline flex items-center gap-1 cursor-pointer bg-[#079432]/10 px-2.5 py-1 rounded-md border border-[#079432]/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fill Safe Draft</span>
                  </button>
                </div>

                <form onSubmit={handleSaveTalent} className="space-y-4 text-xs font-inter">
                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Public Display Title</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Internal Reference</label>
                      <input
                        type="number"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                      >
                        <option value="Technology">Technology</option>
                        <option value="Robotics">Robotics</option>
                        <option value="Digital Art">Digital Art</option>
                        <option value="Music">Music</option>
                        <option value="Sports">Sports</option>
                        <option value="Academics">Academics</option>
                        <option value="Leadership">Leadership</option>
                        <option value="Entrepreneurship">Entrepreneurship</option>
                        <option value="Biotech">Biotech</option>
                        <option value="Creative Writing">Creative Writing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Region / Community</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Use a broad region only"
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Approved Non-identifying Summary</label>
                    <textarea
                      rows={3}
                      required
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  {/* Persistent server-authorized Talent photo uploads */}
                  <div className="p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[#0B2E6B] flex items-center gap-1.5 text-xs">
                        <ImageIcon className="w-3.5 h-3.5 text-[#079432]" />
                        <span>Upload Talent Photos</span>
                      </label>
                      <span className="text-[10px] text-[#0B2E6B]/40 font-mono">
                        {isImageUploading ? "Storing…" : `${uploadedImages.length} Stored`}
                      </span>
                    </div>

                    <p className="text-[10px] leading-relaxed text-[#0B2E6B]/60">
                      JPEG, PNG, or WebP source files up to 4 MB are accepted. Larger source images are resized securely in this browser for the Foundation’s no-cost image service before they can be saved to this Sponsor Talent record.
                    </p>

                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={isImageUploading}
                      className="w-full text-[11px] text-[#0B2E6B]/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#079432] file:text-white hover:file:brightness-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    />

                    {imageUploadError && <p role="alert" className="text-[10px] text-red-600">{imageUploadError}</p>}

                    {/* Image Previews */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#0B2E6B]/20 group">
                          <TalentPhoto src={img} alt="Preview" fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => setCoverPhoto(img)}
                              title="Set as Cover Photo"
                              className="absolute top-0.5 left-0.5 bg-black/60 text-[#0B2E6B] text-[9px] p-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                              Cover
                            </button>
                            <button
                              type="button"
                              onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                              className="absolute top-0.5 right-0.5 bg-red-600/80 text-[#0B2E6B] p-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* UNLIMITED LOCAL FILE UPLOADS: VIDEOS */}
                  <div className="p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[#0B2E6B] flex items-center gap-1.5 text-xs">
                        <VideoIcon className="w-3.5 h-3.5 text-[#079432]" />
                        <span>Upload Local Videos (Unlimited)</span>
                      </label>
                      <span className="text-[10px] text-[#0B2E6B]/40 font-mono">
                        {uploadedVideos.length} Uploaded
                      </span>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="w-full text-[11px] text-[#0B2E6B]/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#079432] file:text-white hover:file:brightness-110 cursor-pointer"
                    />

                    {/* Video Previews */}
                    {uploadedVideos.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {uploadedVideos.map((vUrl, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-[#0B2E6B]/5 border border-[#0B2E6B]/10 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2 truncate">
                              <Play className="w-3 h-3 text-[#079432] shrink-0" />
                              <span className="text-[#0B2E6B]/80 font-mono truncate">Local Video #{idx + 1}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setRawMediaUrl(vUrl)}
                                className="px-2 py-0.5 bg-[#079432]/20 text-[#079432] rounded text-[10px] font-bold"
                              >
                                Set Reel
                              </button>
                              <button
                                type="button"
                                onClick={() => setUploadedVideos(uploadedVideos.filter((_, i) => i !== idx))}
                                className="p-1 text-red-400 hover:text-[#0B2E6B]"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Cover Photo URL (Or select uploaded image)</label>
                    <input
                      type="url"
                      value={coverPhoto}
                      onChange={(e) => setCoverPhoto(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Raw Media Video URL (Or select uploaded video)</label>
                    <input
                      type="url"
                      value={rawMediaUrl}
                      onChange={(e) => setRawMediaUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <fieldset className="rounded-xl border border-[#079432]/25 bg-[#079432]/5 p-3 space-y-2">
                    <legend className="px-1 text-[11px] font-bold text-[#079432]">Public visibility controls</legend>
                    <p className="text-[10px] text-[#0B2E6B]/60">All public fields are hidden by default. A photo appears publicly only when both the profile and its cover-photo setting are enabled. You can edit these choices after publishing.</p>
                    {[
                      ["profileVisible", "Publish this Sponsor Talent profile"],
                      ["summaryVisible", "Show the approved summary"],
                      ["photoVisible", "Show the approved cover photo"],
                      ["mediaVisible", "Show approved media"],
                    ].map(([field, label]) => (
                      <label key={field} className="flex items-center gap-2 text-[11px] text-[#0B2E6B] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={talentVisibility[field as keyof typeof talentVisibility]}
                          onChange={(event) => setTalentVisibility((current) => ({ ...current, [field]: event.target.checked }))}
                          className="accent-[#079432]"
                        />
                        {label}
                      </label>
                    ))}
                  </fieldset>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="submit"
                      disabled={isImageUploading}
                      className="flex-1 bg-[#079432] hover:brightness-110 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isImageUploading ? "Storing Photo…" : editingId ? "Update Sponsor Talent" : "Save Sponsor Talent"}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2.5 rounded-xl bg-[#0B2E6B]/10 text-[#0B2E6B] text-xs"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Grid List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-montserrat font-bold text-base text-[#0B2E6B]">
                  Active Exhibition Grid Profiles ({profiles.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profiles.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl p-4 border border-[#0B2E6B]/10 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl relative overflow-hidden bg-[#0B2E6B]/10 shrink-0">
                          <TalentPhoto src={p.coverPhoto} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-montserrat font-bold text-sm text-[#0B2E6B]">
                            {p.name}, {p.age}
                          </h3>
                          <span className="text-[10px] text-[#079432] font-semibold block">
                            {p.category} • {p.location}
                          </span>
                          <p className="text-[11px] text-[#0B2E6B]/60 line-clamp-2 mt-1">{p.bio}</p>
                          {(p.galleryImages?.length || p.galleryVideos?.length) ? (
                            <span className="text-[9px] font-mono text-emerald-400 block mt-1">
                              📁 Assets: {p.galleryImages?.length || 0} Photos • {p.galleryVideos?.length || 0} Videos
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#0B2E6B]/5">
                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = !p.featuredOnHomepage;
                            updateProfile({
                              ...p,
                              featuredOnHomepage: newStatus,
                            });
                            triggerToast(
                              "✓ Homepage Curation Updated",
                              newStatus
                                ? `${p.name} is now featured on the homepage (max 3 cards).`
                                : `${p.name} was removed from homepage preview.`
                            );
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                            p.featuredOnHomepage
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-[#0B2E6B]/5 text-[#0B2E6B]/50 border-[#0B2E6B]/10 hover:text-[#0B2E6B]"
                          }`}
                        >
                          {p.featuredOnHomepage ? "★ Featured on Homepage" : "+ Feature on Homepage"}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditTalent(p)}
                            className="p-1.5 bg-[#0B2E6B]/10 hover:bg-[#0B2E6B]/20 text-[#0B2E6B] rounded-lg text-xs"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTalent(p.id)}
                            className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 4: Mission & Vision CMS */}
        {activeSection === "mission" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-6 max-w-3xl">
            <div className="flex items-center justify-between border-b border-[#0B2E6B]/10 pb-4">
              <div>
                <h1 className="font-montserrat font-bold text-xl text-[#0B2E6B]">
                  Mission &amp; Vision Public CMS
                </h1>
                <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                  Update public copy displayed on /mission-vision route.
                </p>
              </div>

              {cmsSavedNotice && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Live Content Updated!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveMissionVision} className="space-y-4 text-xs font-inter">
              <div>
                <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Core Mission Statement</label>
                <textarea
                  rows={3}
                  value={missionText}
                  onChange={(e) => setMissionText(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                />
              </div>

              <div>
                <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Vision Statement</label>
                <textarea
                  rows={3}
                  value={visionText}
                  onChange={(e) => setVisionText(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                />
              </div>

              <div>
                <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Founder&apos;s Statement / Letter</label>
                <textarea
                  rows={4}
                  value={foundersNoteText}
                  onChange={(e) => setFoundersNoteText(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                />
              </div>

              <div>
                <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Founder Title &amp; Signature</label>
                <input
                  type="text"
                  value={foundersTitleText}
                  onChange={(e) => setFoundersTitleText(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#079432] hover:brightness-110 text-white font-bold py-3 px-6 rounded-xl transition text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Publish CMS Updates</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PANEL 5: Meet the Team CMS */}
        {activeSection === "team" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">
                Meet the Team CMS
              </h1>
              <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                Manage executive leadership profiles displayed on /meet-the-team.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-4">
                <h2 className="font-montserrat font-bold text-base text-[#0B2E6B] border-b border-[#0B2E6B]/10 pb-3">
                  {editingMemberId ? "Edit Team Member" : "Add Team Member"}
                </h2>

                <form onSubmit={handleSaveTeamMember} className="space-y-4 text-xs font-inter">
                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Role Title</label>
                    <input
                      type="text"
                      required
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Bio Summary</label>
                    <textarea
                      rows={3}
                      required
                      value={memberBio}
                      onChange={(e) => setMemberBio(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Headshot Photo (Upload File or URL)</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setMemberPhoto(event.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full p-2 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#079432] file:text-white hover:file:brightness-110"
                      />
                      <input
                        type="text"
                        placeholder="Or paste image URL..."
                        value={memberPhoto}
                        onChange={(e) => setMemberPhoto(e.target.value)}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs focus:outline-none focus:border-[#079432]"
                      />
                      {memberPhoto && (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#0B2E6B]/20">
                          <Image src={memberPhoto} alt="Preview" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <fieldset className="rounded-xl border border-[#079432]/25 bg-[#079432]/5 p-3 space-y-2">
                    <legend className="px-1 text-[11px] font-bold text-[#079432]">Public visibility controls</legend>
                    <p className="text-[10px] text-[#0B2E6B]/60">Every field is private by default. You can change these choices later.</p>
                    {[
                      ["isPublic", "Publish this team member"],
                      ["showPhoto", "Show photo"],
                      ["showRole", "Show role title"],
                      ["showBio", "Show biography"],
                      ["showLink", "Show approved external link"],
                    ].map(([field, label]) => (
                      <label key={field} className="flex items-center gap-2 text-[11px] text-[#0B2E6B] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={memberVisibility[field as keyof typeof memberVisibility]}
                          onChange={(event) => setMemberVisibility((current) => ({ ...current, [field]: event.target.checked }))}
                          className="accent-[#079432]"
                        />
                        {label}
                      </label>
                    ))}
                  </fieldset>

                  <button
                    type="submit"
                    className="w-full bg-[#079432] hover:brightness-110 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-md cursor-pointer"
                  >
                    {editingMemberId ? "Update Member" : "Add to Leadership Directory"}
                  </button>
                </form>
              </div>

              {/* Members List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-montserrat font-bold text-base text-[#0B2E6B]">
                  Leadership Roster ({teamMembers.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {teamMembers.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-2xl p-4 border border-[#0B2E6B]/10 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl relative overflow-hidden bg-[#0B2E6B]/10 shrink-0">
                          <Image src={m.photoUrl} alt={m.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-montserrat font-bold text-sm text-[#0B2E6B]">{m.name}</h3>
                          <span className="text-[10px] text-[#079432] block">{m.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditMember(m)}
                          className="p-1.5 bg-[#0B2E6B]/10 hover:bg-[#0B2E6B]/20 text-[#0B2E6B] rounded-lg text-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id)}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: Transparency and financial reporting are intentionally disabled. */}
        {activeSection === "transparency" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">Partnership Information</h1>
              <p className="text-xs text-[#0B2E6B]/60 mt-0.5">This portal does not manage financial contributions, tax records, or transparency reports.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-4 max-w-3xl">
              <div className="w-11 h-11 rounded-2xl bg-[#079432]/10 text-[#079432] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="font-montserrat font-bold text-lg text-[#0B2E6B]">Financial and transparency workflows are unavailable</h2>
              <p className="text-xs text-[#0B2E6B]/70 leading-relaxed">Do not upload reports, publish financial figures, or use this portal to process contributions. Appropriate partnership information is handled through private foundation processes outside this application.</p>
            </div>
          </div>
        )}

        {/* PANEL: Video Management CMS */}
        {activeSection === "videos" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">
                Foundation Video Management CMS
              </h1>
              <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                Manage foundation intro videos, impact documentaries, and community spotlight videos.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-4">
                <h2 className="font-montserrat font-bold text-base text-[#0B2E6B] border-b border-[#0B2E6B]/10 pb-3">
                  Add Foundation Video
                </h2>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!videoTitle.trim()) return;
                    try {
                      await addFoundationVideo({
                        id: "fv-" + Date.now(),
                        title: videoTitle,
                        videoUrl: videoUrl,
                        thumbnail: videoThumbnail,
                        duration: videoDuration,
                        category: videoCategory,
                        description: videoDescription,
                      });
                      triggerToast("✓ Video Added", `Added ${videoTitle} to foundation video roster.`);
                      setVideoTitle("");
                    } catch (err) {
                      triggerToast("✗ Add Failed", err instanceof Error ? err.message : "Could not add video. Check your connection and try again.");
                    }
                  }}
                  className="space-y-4 text-xs font-inter"
                >
                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Video Title *</label>
                    <input
                      type="text"
                      required
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="e.g. Sponsor Talent Introduction Video"
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Duration</label>
                      <input
                        type="text"
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(e.target.value)}
                        placeholder="3:45"
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Category</label>
                      <select
                        value={videoCategory}
                        onChange={(e) => setVideoCategory(e.target.value as "Foundation Intro" | "Impact Story" | "Transformational Journey")}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                      >
                        <option value="Foundation Intro">Foundation Intro</option>
                        <option value="Impact Story">Impact Story</option>
                        <option value="Transformational Journey">Transformational Journey</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Video Stream URL *</label>
                    <input
                      type="url"
                      required
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Thumbnail Cover Image URL</label>
                    <input
                      type="url"
                      value={videoThumbnail}
                      onChange={(e) => setVideoThumbnail(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#079432] hover:bg-[#14B84A] text-[#0B2E6B] font-bold py-3 rounded-xl transition text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <VideoIcon className="w-4 h-4 text-[#F7B500]" />
                    <span>Publish Video to Roster</span>
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-montserrat font-bold text-base text-[#0B2E6B]">
                  Active Foundation Videos ({foundationVideos.length})
                </h2>
                <div className="space-y-3">
                  {foundationVideos.map((vid) => (
                    <div
                      key={vid.id}
                      className="bg-white p-4 rounded-xl border border-[#0B2E6B]/10 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg relative overflow-hidden bg-black shrink-0">
                          <Image src={vid.thumbnail} alt={vid.title} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="bg-[#079432]/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                            {vid.category} • {vid.duration}
                          </span>
                          <h4 className="font-montserrat font-bold text-sm text-[#0B2E6B] mt-0.5">{vid.title}</h4>
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            await deleteFoundationVideo(vid.id);
                            triggerToast("✓ Video Removed", `Removed ${vid.title}`);
                          } catch (err) {
                            triggerToast("✗ Delete Failed", err instanceof Error ? err.message : "Could not delete video. Check your connection and try again.");
                          }
                        }}
                        className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 6: Branding & Theme Engine */}
        {activeSection === "branding" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-6 max-w-4xl text-[#0B2E6B]">
            {/* Save Confirmation Toast Banner */}
            {brandingNotice && (
              <div className="bg-emerald-600 text-[#0B2E6B] p-4 rounded-2xl shadow-lg border border-emerald-500 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#0B2E6B] shrink-0" />
                  <div>
                    <h4 className="font-montserrat font-bold text-sm">
                      ✓ Changes Saved &amp; Applied Live!
                    </h4>
                    <p className="text-xs text-[#0B2E6B]/90">
                      Your new Header Logo, Title, and Site Builder settings are live on the homepage.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0B2E6B]/20 px-3 py-1 rounded-full">
                  Live Sync Active
                </span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-[#0B2E6B]/10 pb-4">
              <div>
                <h1 className="font-montserrat font-bold text-xl text-[#0B2E6B] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#079432]" />
                  Global Visual Engine &amp; Site Builder
                </h1>
                <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                  Customize platform logo, title, hero layout mode, typography, and color palette.
                </p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await updateBranding(brandingForm);
                  setBrandingNotice(true);
                  triggerToast("✓ Site Builder Settings Live", "Header logo, title, hero layout mode, and color palette updated.");
                  setTimeout(() => setBrandingNotice(false), 4000);
                } catch (err) {
                  triggerToast("✗ Save Failed", err instanceof Error ? err.message : "Could not save branding settings. Check your connection and try again.");
                }
              }}
              className="space-y-6 text-xs font-inter"
            >
              {/* Color Palette Controls */}
              <div className="space-y-4">
                <h3 className="font-montserrat font-bold text-sm text-[#0B2E6B] uppercase tracking-wider">
                  1. Color Palette Controls
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Primary Color (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandingForm.primaryColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                        className="w-8 h-8 rounded border border-[#0B2E6B]/20 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={brandingForm.primaryColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Secondary / Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandingForm.secondaryColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, secondaryColor: e.target.value })}
                        className="w-8 h-8 rounded border border-[#0B2E6B]/20 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={brandingForm.secondaryColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, secondaryColor: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Site Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandingForm.backgroundColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, backgroundColor: e.target.value })}
                        className="w-8 h-8 rounded border border-[#0B2E6B]/20 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={brandingForm.backgroundColor}
                        onChange={(e) => setBrandingForm({ ...brandingForm, backgroundColor: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography Controls */}
              <div className="space-y-4 pt-4 border-t border-[#0B2E6B]/10">
                <h3 className="font-montserrat font-bold text-sm text-[#0B2E6B] uppercase tracking-wider">
                  2. Typography Engine
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Header Font</label>
                    <select
                      value={brandingForm.headerFont}
                      onChange={(e) => setBrandingForm({ ...brandingForm, headerFont: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                    >
                      <option value="Montserrat">Montserrat (Modern Clean)</option>
                      <option value="Inter">Inter (Sans-Serif Classic)</option>
                      <option value="Playfair Display">Playfair Display (Serif Luxury)</option>
                      <option value="Roboto">Roboto (Technical Minimal)</option>
                      <option value="Outfit">Outfit (Geometric Premium)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Body Text Font</label>
                    <select
                      value={brandingForm.bodyFont}
                      onChange={(e) => setBrandingForm({ ...brandingForm, bodyFont: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                    >
                      <option value="Inter">Inter (Clean System)</option>
                      <option value="Montserrat">Montserrat (Bold Modern)</option>
                      <option value="Roboto">Roboto (Standard Sans)</option>
                      <option value="Outfit">Outfit (Modern Tech)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Header & Logo Customization */}
              <div className="space-y-4 pt-4 border-t border-[#0B2E6B]/10">
                <h3 className="font-montserrat font-bold text-sm text-[#0B2E6B] uppercase tracking-wider">
                  0. Header &amp; Brand Logo Manager
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Header Brand Title</label>
                    <input
                      type="text"
                      value={brandingForm.siteTitle || "WITHOUT LIMITS POTENTIAL"}
                      onChange={(e) => setBrandingForm({ ...brandingForm, siteTitle: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Header Logo Image (File Upload or URL)</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setBrandingForm({ ...brandingForm, logoUrl: event.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full p-2 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#079432] file:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Or paste Logo Image URL..."
                        value={brandingForm.logoUrl || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Banner Manager */}
              <div className="space-y-4 pt-4 border-t border-[#0B2E6B]/10">
                <h3 className="font-montserrat font-bold text-sm text-[#0B2E6B] uppercase tracking-wider">
                  3. Hero Section &amp; Media Type Builder
                </h3>

                <div>
                  <label className="block text-[#0B2E6B]/80 font-semibold mb-2">Hero Layout Media Mode</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-[#0B2E6B] text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="heroMediaType"
                        value="image"
                        checked={brandingForm.heroMediaType === "image"}
                        onChange={() => setBrandingForm({ ...brandingForm, heroMediaType: "image" })}
                        className="text-[#079432]"
                      />
                      <span>Image Banner</span>
                    </label>

                    <label className="flex items-center gap-2 text-[#0B2E6B] text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="heroMediaType"
                        value="video"
                        checked={brandingForm.heroMediaType === "video"}
                        onChange={() => setBrandingForm({ ...brandingForm, heroMediaType: "video" })}
                        className="text-[#079432]"
                      />
                      <span>Video Loop Banner</span>
                    </label>

                    <label className="flex items-center gap-2 text-[#0B2E6B] text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="heroMediaType"
                        value="none"
                        checked={brandingForm.heroMediaType === "none"}
                        onChange={() => setBrandingForm({ ...brandingForm, heroMediaType: "none" })}
                        className="text-[#079432]"
                      />
                      <span>None (Clean Text Only)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Hero Top Badge Text</label>
                  <input
                    type="text"
                    value={brandingForm.heroBadgeText || ""}
                    onChange={(e) => setBrandingForm({ ...brandingForm, heroBadgeText: e.target.value })}
                    className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Main Headline</label>
                  <input
                    type="text"
                    value={brandingForm.heroHeadline}
                    onChange={(e) => setBrandingForm({ ...brandingForm, heroHeadline: e.target.value })}
                    className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Sub-headline Description</label>
                  <textarea
                    rows={2}
                    value={brandingForm.heroSubheadline}
                    onChange={(e) => setBrandingForm({ ...brandingForm, heroSubheadline: e.target.value })}
                    className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Primary CTA Button Text</label>
                    <input
                      type="text"
                      value={brandingForm.heroCtaText}
                      onChange={(e) => setBrandingForm({ ...brandingForm, heroCtaText: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Secondary CTA Button Text</label>
                    <input
                      type="text"
                      value={brandingForm.heroSecondaryCtaText || ""}
                      onChange={(e) => setBrandingForm({ ...brandingForm, heroSecondaryCtaText: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Hero Card Location Tag</label>
                    <input
                      type="text"
                      value={brandingForm.heroCardLocation || ""}
                      onChange={(e) => setBrandingForm({ ...brandingForm, heroCardLocation: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Hero Card Title</label>
                    <input
                      type="text"
                      value={brandingForm.heroCardTitle || ""}
                      onChange={(e) => setBrandingForm({ ...brandingForm, heroCardTitle: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Hero Card Description</label>
                    <input
                      type="text"
                      value={brandingForm.heroCardDescription || ""}
                      onChange={(e) => setBrandingForm({ ...brandingForm, heroCardDescription: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {brandingForm.heroMediaType === "image" && (
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Hero Image (File Upload or URL)</label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setBrandingForm({ ...brandingForm, heroImage: event.target.result as string });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full p-2 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#079432] file:text-white"
                        />
                        <input
                          type="text"
                          value={brandingForm.heroImage}
                          onChange={(e) => setBrandingForm({ ...brandingForm, heroImage: e.target.value })}
                          className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {brandingForm.heroMediaType === "video" && (
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Hero Video (File Upload or URL)</label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const videoUrl = URL.createObjectURL(file);
                              setBrandingForm({ ...brandingForm, heroVideoUrl: videoUrl });
                            }
                          }}
                          className="w-full p-2 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#079432] file:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Or paste video URL (MP4/WebM)..."
                          value={brandingForm.heroVideoUrl || ""}
                          onChange={(e) => setBrandingForm({ ...brandingForm, heroVideoUrl: e.target.value })}
                          className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Homepage Section Titles & Badges Controls */}
                <div className="space-y-4 pt-6 border-t border-[#0B2E6B]/10">
                  <h3 className="font-montserrat font-bold text-sm text-[#0B2E6B] uppercase tracking-wider">
                    4. Homepage Section Titles &amp; Headers CMS
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Video Section Badge</label>
                      <input
                        type="text"
                        value={brandingForm.videoSectionBadge || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, videoSectionBadge: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Video Section Title</label>
                      <input
                        type="text"
                        value={brandingForm.videoSectionTitle || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, videoSectionTitle: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Video Section Subtitle</label>
                      <input
                        type="text"
                        value={brandingForm.videoSectionSubtitle || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, videoSectionSubtitle: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Sponsor Section Badge</label>
                      <input
                        type="text"
                        value={brandingForm.sponsorSectionBadge || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, sponsorSectionBadge: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Sponsor Section Title</label>
                      <input
                        type="text"
                        value={brandingForm.sponsorSectionTitle || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, sponsorSectionTitle: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Sponsor Section Subtitle</label>
                      <input
                        type="text"
                        value={brandingForm.sponsorSectionSubtitle || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, sponsorSectionSubtitle: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Pathway Section Badge</label>
                      <input
                        type="text"
                        value={brandingForm.pathwaySectionBadge || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, pathwaySectionBadge: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Pathway Section Title</label>
                      <input
                        type="text"
                        value={brandingForm.pathwaySectionTitle || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, pathwaySectionTitle: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Pathway Section Subtitle</label>
                      <input
                        type="text"
                        value={brandingForm.pathwaySectionSubtitle || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, pathwaySectionSubtitle: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Transparency Section Badge</label>
                      <input
                        type="text"
                        value={brandingForm.transparencySectionBadge || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, transparencySectionBadge: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Transparency Section Title</label>
                      <input
                        type="text"
                        value={brandingForm.transparencySectionTitle || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, transparencySectionTitle: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Transparency Section Subtitle</label>
                      <input
                        type="text"
                        value={brandingForm.transparencySectionSubtitle || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, transparencySectionSubtitle: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#079432] hover:brightness-110 text-white font-bold py-3 px-6 rounded-xl transition text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Apply Branding Changes Live</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PANEL 7: Legal & Security CMS */}
        {activeSection === "legal" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-6 max-w-4xl">
            <div className="flex items-center justify-between border-b border-[#0B2E6B]/10 pb-4">
              <div>
                <h1 className="font-montserrat font-bold text-xl text-[#0B2E6B] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  Legal Policies &amp; Security Standards CMS
                </h1>
                <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                  Update public copy for /terms, /privacy, and /security-standards.
                </p>
              </div>

              {legalNotice && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Legal Copy Updated!
                </span>
              )}
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await updateLegalSecurity(legalForm);
                  setLegalNotice(true);
                  triggerToast("✓ Legal & Security Copy Saved", "Public copy for /terms, /privacy, and /security-standards updated.");
                  setTimeout(() => setLegalNotice(false), 3000);
                } catch (err) {
                  triggerToast("✗ Save Failed", err instanceof Error ? err.message : "Could not save legal & security copy. Check your connection and try again.");
                }
              }}
              className="space-y-6 text-xs font-inter"
            >
              <div>
                <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Terms of Service (/terms)</label>
                <textarea
                  rows={5}
                  value={legalForm.termsContent}
                  onChange={(e) => setLegalForm({ ...legalForm, termsContent: e.target.value })}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Privacy Policy (/privacy)</label>
                <textarea
                  rows={5}
                  value={legalForm.privacyContent}
                  onChange={(e) => setLegalForm({ ...legalForm, privacyContent: e.target.value })}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Security Standards (/security-standards)</label>
                <textarea
                  rows={5}
                  value={legalForm.securityStandardsContent}
                  onChange={(e) => setLegalForm({ ...legalForm, securityStandardsContent: e.target.value })}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#079432] hover:brightness-110 text-white font-bold py-3 px-6 rounded-xl transition text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Publish Legal &amp; Security Standards</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PANEL 8: Audit Trail Log */}
        {activeSection === "audit" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">
                Platform Performance &amp; Security Audit Trail
              </h1>
              <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                Real-time security events, administrative credential generation, and telemetry logs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-xl">
                <span className="text-xs text-[#0B2E6B]/60 uppercase font-semibold">Total Verified Sponsors</span>
                <p className="text-3xl font-montserrat font-bold text-[#0B2E6B] mt-2">
                  {pendingSponsors.filter(s => s.status === "approved").length}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-xl">
                <span className="text-xs text-[#0B2E6B]/60 uppercase font-semibold">Initiated Inquiries</span>
                <p className="text-3xl font-montserrat font-bold text-[#079432] mt-2">
                  {inquiries.length}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-xl">
                <span className="text-xs text-[#0B2E6B]/60 uppercase font-semibold">Exhibition Grid Profiles</span>
                <p className="text-3xl font-montserrat font-bold text-emerald-400 mt-2">
                  {profiles.length}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-4">
              <h3 className="font-montserrat font-bold text-base text-[#0B2E6B]">Security Event Log</h3>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#0B2E6B]/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-400 font-mono font-bold">{log.action}</span>
                      <p className="text-[#0B2E6B]/70 mt-0.5">{log.details}</p>
                    </div>
                    <div className="text-right text-[10px] font-mono text-[#0B2E6B]/40">
                      <div>{log.adminEmail}</div>
                      <div>{log.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Provisioned Modal */}
      {provisionedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#0B2E6B]/15 space-y-6">
            <div className="flex items-center justify-between border-b border-[#0B2E6B]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">Sponsor Invitation Sent</h3>
                  <p className="text-xs text-[#0B2E6B]/60">Passwordless access invitation delivered</p>
                </div>
              </div>
              <button
                onClick={() => setProvisionedModal(null)}
                className="text-[#0B2E6B]/50 hover:text-[#0B2E6B] p-1 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#0B2E6B]/15 space-y-2">
                <div>
                  <span className="text-[#0B2E6B]/40 uppercase tracking-wider block text-[10px]">
                    Sponsor Email
                  </span>
                  <p className="text-[#0B2E6B] font-bold text-sm">{provisionedModal.email}</p>
                </div>

                <div className="pt-2 border-t border-[#0B2E6B]/10">
                  <span className="text-[#0B2E6B]/40 uppercase tracking-wider block text-[10px]">
                    Invitation Status
                  </span>
                  <p className="text-[#079432] font-bold text-base tracking-wider">{provisionedModal.invitationStatus}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setProvisionedModal(null)}
                className="w-full bg-[#0B2E6B]/10 hover:bg-[#0B2E6B]/20 text-[#0B2E6B] font-bold px-4 py-3 rounded-xl transition text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sponsor Invitation Status Modal */}
      {credentialModalSponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#0B2E6B]/15 space-y-6">
            <div className="flex items-center justify-between border-b border-[#0B2E6B]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#079432]/10 text-[#079432] flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">Invitation Status</h3>
                  <p className="text-xs text-[#0B2E6B]/60">Sponsor: {credentialModalSponsor.name}</p>
                </div>
              </div>
              <button
                onClick={() => setCredentialModalSponsor(null)}
                className="text-[#0B2E6B]/50 hover:text-[#0B2E6B] p-1 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#0B2E6B]/15 space-y-2">
                <div>
                  <span className="text-[#0B2E6B]/40 uppercase tracking-wider block text-[10px]">
                    Sponsor Email
                  </span>
                  <p className="text-[#0B2E6B] font-bold text-sm">{credentialModalSponsor.email}</p>
                </div>
                <div className="pt-2 border-t border-[#0B2E6B]/10">
                  <span className="text-[#0B2E6B]/40 uppercase tracking-wider block text-[10px]">
                    Invitation Status
                  </span>
                  <p className="text-[#079432] font-bold text-sm">{credentialModalSponsor.invitationStatus}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCredentialModalSponsor(null)}
                  className="w-full bg-[#079432] hover:brightness-110 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPONSOR INSPECTOR OVERVIEW MODAL */}
      {selectedSponsorOverview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FCFCFA]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#0B2E6B]/10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#0B2E6B]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#079432]/10 text-[#079432] border border-[#079432]/30 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">
                    {selectedSponsorOverview.company || selectedSponsorOverview.name}
                  </h3>
                  <p className="text-xs text-[#0B2E6B]/60">
                    Foundation Sponsor ID: {selectedSponsorOverview.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSponsorOverview(null)}
                className="text-[#0B2E6B]/40 hover:text-[#0B2E6B] p-1 text-xs"
              >
                ✕
              </button>
            </div>

            {/* SECTION 1: Corporate & Contact Details */}
            <div className="bg-[#FCFCFA] p-5 rounded-2xl border border-[#0B2E6B]/10 space-y-4">
              <h4 className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#079432] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Sponsor Representative Overview
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">Contact Person</span>
                  <span className="font-bold text-[#0B2E6B] text-sm">{selectedSponsorOverview.name}</span>
                </div>
                <div>
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">Contact Email</span>
                  <span className="font-mono text-[#0B2E6B] text-sm">{selectedSponsorOverview.email}</span>
                </div>
                <div>
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">Vetting Status</span>
                  <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">
                    {selectedSponsorOverview.callStatus} ({selectedSponsorOverview.status})
                  </span>
                </div>
                <div>
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">Password Security</span>
                  <span className="font-semibold text-[#0B2E6B]/90 text-xs block mt-0.5">
                    {selectedSponsorOverview.customPassword ? "✓ Custom Password Set (Temp Pass Revoked)" : "⚡ Active Temporary Password"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">LinkedIn Record</span>
                  <a
                    href={selectedSponsorOverview.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#079432] hover:underline font-semibold text-xs inline-flex items-center gap-1 mt-0.5"
                  >
                    {selectedSponsorOverview.linkedin} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* SECTION 2: Sponsored Youth Talents Under Them */}
            <div className="space-y-3">
              <h4 className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#079432] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Actively Sponsored Youth Talents
              </h4>
              <div className="space-y-2">
                {(selectedSponsorOverview.sponsoredTalents && selectedSponsorOverview.sponsoredTalents.length > 0) ? (
                  selectedSponsorOverview.sponsoredTalents.map((st: NonNullable<PendingSponsor["sponsoredTalents"]>[number], idx: number) => (
                    <div key={idx} className="bg-[#FCFCFA] p-4 rounded-xl border border-[#0B2E6B]/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0B2E6B] text-sm block">{st.talentName}</span>
                        <span className="text-[#0B2E6B]/60 text-[11px]">{st.grantTitle}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#079432] text-sm block">{st.grantAmount}</span>
                        <span className="text-[#0B2E6B]/40 text-[10px]">{st.dateGranted}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#FCFCFA] p-4 rounded-xl border border-[#0B2E6B]/10 text-center text-xs text-[#0B2E6B]/50">
                    No direct talent grants recorded yet for this sponsor.
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: Inquiries & Proposals */}
            <div className="space-y-3">
              <h4 className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#079432] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Sponsorship Proposals &amp; Message Log
              </h4>
              {inquiries.filter((i) => i.sponsorEmail?.toLowerCase() === selectedSponsorOverview.email.toLowerCase() || i.sponsorId === selectedSponsorOverview.id).length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {inquiries.filter((i) => i.sponsorEmail?.toLowerCase() === selectedSponsorOverview.email.toLowerCase() || i.sponsorId === selectedSponsorOverview.id).map((inq) => (
                    <div key={inq.id} className="bg-[#FCFCFA] p-3 rounded-xl border border-[#0B2E6B]/10 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#0B2E6B]">
                        <span>Target: {inq.talentName}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">{inq.status}</span>
                      </div>
                      <p className="text-[#0B2E6B]/70 italic text-[11px]">&quot;{inq.message}&quot;</p>
                      <span className="text-[10px] text-[#0B2E6B]/40 font-mono block">{inq.createdAt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#FCFCFA] p-4 rounded-xl border border-[#0B2E6B]/10 text-center text-xs text-[#0B2E6B]/50">
                  No active talent proposal messages logged.
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#0B2E6B]/10 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (window.confirm(`Revoke access and delete sponsor "${selectedSponsorOverview.name}" (${selectedSponsorOverview.company || selectedSponsorOverview.email})?`)) {
                    deleteSponsor(selectedSponsorOverview.id);
                    setSelectedSponsorOverview(null);
                    triggerToast("✓ Sponsor Access Revoked", `Sponsor ${selectedSponsorOverview.name} deleted.`);
                  }
                }}
                className="bg-red-600 hover:bg-red-500 text-[#0B2E6B] font-bold py-2.5 px-4 rounded-xl transition text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                <span>Revoke &amp; Delete Sponsor</span>
              </button>

              <button
                onClick={() => setSelectedSponsorOverview(null)}
                className="bg-[#0B2E6B]/10 hover:bg-[#0B2E6B]/20 text-[#0B2E6B] font-semibold py-2.5 px-5 rounded-xl transition text-xs"
              >
                Close Overview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL FLOATING TOAST NOTIFICATION BANNER */}
      {toastNotice && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-[#0B2E6B] px-5 py-4 rounded-2xl shadow-2xl border border-emerald-400 flex items-start gap-3 max-w-md animate-bounce-short">
          <CheckCircle2 className="w-6 h-6 text-[#0B2E6B] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-montserrat font-bold text-sm">{toastNotice.title}</h4>
            <p className="text-xs text-[#0B2E6B]/90 leading-snug">{toastNotice.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
