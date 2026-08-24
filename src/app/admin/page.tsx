"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth, PendingSponsor } from "@/context/AuthContext";
import { TalentPhoto } from "@/components/TalentPhoto";
import { TalentVideo } from "@/components/TalentVideo";
import { WlpLogoMark } from "@/components/WlpLogo";
import { INITIAL_YOUTH_PROFILES, YouthProfile } from "@/lib/data";
import { INITIAL_EDITORIAL_PAGES, INITIAL_MISSION_VISION, INITIAL_TEAM_MEMBERS, type EditorialPageKey, type SocialLink, TeamMember } from "@/lib/cmsData";
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
  User,
  Link2
} from "lucide-react";

const prepareTeamHeadshotUpload = async (file: File): Promise<File> => {
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
    throw new Error("Use a JPEG, PNG, or WebP headshot.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const source = new window.Image();
    await new Promise<void>((resolve, reject) => {
      source.onload = () => resolve();
      source.onerror = () => reject(new Error("This image could not be read. Please choose another file."));
      source.src = objectUrl;
    });

    const render = async (maximumSide: number, quality: number) => {
      const scale = Math.min(1, maximumSide / Math.max(source.width, source.height));
      const width = Math.max(1, Math.round(source.width * scale));
      const height = Math.max(1, Math.round(source.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser could not prepare this headshot.");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(source, 0, 0, width, height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (!blob) throw new Error("This image could not be prepared for secure upload.");
      return blob;
    };

    let blob = await render(1600, 0.84);
    if (blob.size > 3_000_000) blob = await render(1200, 0.76);
    if (blob.size > 3_000_000) {
      throw new Error("This headshot is still too large after preparation. Choose a smaller image file.");
    }
    const basename = file.name.replace(/\.[^.]+$/, "") || "team-headshot";
    return new File([blob], `${basename}.jpg`, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export default function AdminDashboardPage() {
  const { 
    user,
    userStatus, 
    pendingSponsors, 
    inquiries, 
    publicSubmissions,
    sponsorConversations,
    profiles,
    branding,
    legalSecurity,
    editorialPages,
    auditLogs,
    mfaVerified, 
    adminRole, 
    verifyMfa, 
    setAdminRole, 
    approveSponsor, 
    rejectSponsor,
    deleteSponsor,
    revokeSponsorAccess,
    updateSponsorPassword,
    generateCredentials,
    provisionSponsorManual,
    resolveSupportInquiry,
    resolveSponsorConversation,
    replyToSponsorConversation,
    addProfile,
    updateProfile,
    deleteProfile,
    updateBranding,
    updateLegalSecurity,
    updateEditorialPages,
    missionVision,
    updateMissionVision,
    faqItems,
    addFaqItem,
    updateFaqItem,
    deleteFaqItem,
    teamMembers,
    updateTeamMembers,
    socialLinks,
    updateSocialLinks,
    foundationVideos,
    addFoundationVideo,
    deleteFoundationVideo,
    uploadTalentPhoto,
    uploadMissionPresidentPhoto,
    uploadTalentVideo,
    talentTags,
    updateTalentTags,
    talentCategories,
    updateTalentCategories,
    logout
  } = useAuth();

  // CMS State: Talent Profiles Extended Fields
  const [dream, setDream] = useState("");
  const [currentSituation, setCurrentSituation] = useState("");
  const [progress, setProgress] = useState("");
  const [currentNeeds, setCurrentNeeds] = useState("");
  const [countryCommunity, setCountryCommunity] = useState("");
  const [mediaReleasePermission, setMediaReleasePermission] = useState(false);

  // CMS State: Video Management Form
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  const [videoThumbnail, setVideoThumbnail] = useState("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80");
  const [videoDuration, setVideoDuration] = useState("3:45");
  const [videoCategory, setVideoCategory] = useState<"Foundation Intro" | "Impact Story" | "Transformational Journey">("Foundation Intro");
  const [videoDescription, setVideoDescription] = useState("");

  // Selected Left Sidebar Section & Mobile Sidebar State
  const [activeSection, setActiveSection] = useState<
    "vetting" | "inquiries" | "submissions" | "talent" | "mission" | "team" | "branding" | "editorial" | "socials" | "legal" | "audit" | "videos"
  >("vetting");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [socialLinkDraft, setSocialLinkDraft] = useState<SocialLink[]>(socialLinks);

  useEffect(() => {
    setSocialLinkDraft(socialLinks);
  }, [socialLinks]);

  // Manual Post-Call Sponsor Invitation State
  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualCompany, setManualCompany] = useState("");
  const [manualPostCallConfirmed, setManualPostCallConfirmed] = useState(false);
  const [provisionedModal, setProvisionedModal] = useState<{ email: string; invitationStatus: string } | null>(null);

  // Global Toast System State
  const [toastNotice, setToastNotice] = useState<{ title: string; message: string } | null>(null);
  const [conversationReplies, setConversationReplies] = useState<Record<string, string>>({});
  const [replyingConversation, setReplyingConversation] = useState<string | null>(null);

  const triggerToast = (title: string, message: string) => {
    setToastNotice({ title, message });
    setTimeout(() => setToastNotice(null), 4000);
  };

  const formatReceivedAt = (value: unknown) => {
    const seconds = typeof value === "object" && value ? (value as { seconds?: unknown; _seconds?: unknown }).seconds ?? (value as { _seconds?: unknown })._seconds : undefined;
    if (typeof seconds === "number") return new Date(seconds * 1000).toLocaleString();
    if (typeof value === "string" || typeof value === "number") return new Date(value).toLocaleString();
    return "Received recently";
  };

  const addCustomSkill = async () => {
    const name = customSkill.trim().replace(/\s+/g, " ");
    if (!name) return;
    const existing = talentTags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
    const tag = existing || { id: `tag-${Date.now()}`, name, status: "active" as const };
    if (!existing) await updateTalentTags([...talentTags, tag]);
    setSelectedSkills((current) => current.includes(tag.name) ? current : [...current, tag.name]);
    setCustomSkill("");
  };

  const toggleSkill = (name: string) => setSelectedSkills((current) => current.includes(name) ? current.filter((skill) => skill !== name) : [...current, name]);

  const renameTalentTag = async (id: string) => {
    const current = talentTags.find((tag) => tag.id === id);
    if (!current) return;
    const requestedName = window.prompt("Rename this Foundation tag", current.name)?.trim().replace(/\s+/g, " ");
    if (!requestedName || requestedName === current.name || talentTags.some((tag) => tag.id !== id && tag.name.toLowerCase() === requestedName.toLowerCase())) return;
    await updateTalentTags(talentTags.map((tag) => tag.id === id ? { ...tag, name: requestedName } : tag));
    setSelectedSkills((skills) => skills.map((skill) => skill === current.name ? requestedName : skill));
  };

  const retireTalentTag = async (id: string) => {
    const current = talentTags.find((tag) => tag.id === id);
    if (!current || !window.confirm(`Retire “${current.name}” from future Talent profiles? Existing profiles will keep their saved history.`)) return;
    await updateTalentTags(talentTags.map((tag) => tag.id === id ? { ...tag, status: "retired" as const } : tag));
    setSelectedSkills((skills) => skills.filter((skill) => skill !== current.name));
  };

  const addCustomCategory = async () => {
    const name = customCategory.trim().replace(/\s+/g, " ");
    if (!name) return;
    const existing = talentCategories.find((categoryItem) => categoryItem.name.toLowerCase() === name.toLowerCase());
    const categoryItem = existing || { id: `category-${Date.now()}`, name, status: "active" as const };
    if (!existing) await updateTalentCategories([...talentCategories, categoryItem]);
    setCategory(categoryItem.name);
    setCustomCategory("");
  };

  const renameTalentCategory = async (id: string) => {
    const current = talentCategories.find((categoryItem) => categoryItem.id === id);
    if (!current) return;
    const requestedName = window.prompt("Rename this Foundation category", current.name)?.trim().replace(/\s+/g, " ");
    if (!requestedName || requestedName === current.name || talentCategories.some((categoryItem) => categoryItem.id !== id && categoryItem.name.toLowerCase() === requestedName.toLowerCase())) return;
    await updateTalentCategories(talentCategories.map((categoryItem) => categoryItem.id === id ? { ...categoryItem, name: requestedName } : categoryItem));
    if (category === current.name) setCategory(requestedName);
  };

  const retireTalentCategory = async (id: string) => {
    const current = talentCategories.find((categoryItem) => categoryItem.id === id);
    if (!current || !window.confirm(`Retire “${current.name}” from future Talent profiles? Existing profiles will keep their saved category.`)) return;
    await updateTalentCategories(talentCategories.map((categoryItem) => categoryItem.id === id ? { ...categoryItem, status: "retired" as const } : categoryItem));
    if (category === current.name) setCategory("");
  };

  // Branding CMS Form State
  const [brandingForm, setBrandingForm] = useState(branding);
  const [brandingNotice, setBrandingNotice] = useState(false);

  // Legal CMS Form State
  const [legalForm, setLegalForm] = useState(legalSecurity);
  const [legalNotice, setLegalNotice] = useState(false);
  const [editorialForm, setEditorialForm] = useState(editorialPages || INITIAL_EDITORIAL_PAGES);

  useEffect(() => {
    setEditorialForm(editorialPages || INITIAL_EDITORIAL_PAGES);
  }, [editorialPages]);

  // MFA State
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState(false);

  // Invitation Status Modal & Sponsor Inspector Modal
  const [credentialModalSponsor, setCredentialModalSponsor] = useState<{ name: string; email: string; invitationStatus: string } | null>(null);
  const [selectedSponsorOverview, setSelectedSponsorOverview] = useState<PendingSponsor | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");

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
  const [talentVisibility, setTalentVisibility] = useState({ profileVisible: false, photoVisible: false, mediaVisible: false, summaryVisible: false, ageBandVisible: false, regionVisible: false, skillsVisible: false, storyVisible: false, aspirationVisible: false, supportPathwayVisible: false });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [story, setStory] = useState("");
  const [aspiration, setAspiration] = useState("");
  const [supportPathway, setSupportPathway] = useState("");
  const [consentReference, setConsentReference] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);

  // CMS State: Mission & Vision
  const [missionText, setMissionText] = useState(missionVision?.mission || INITIAL_MISSION_VISION.mission);
  const [visionText, setVisionText] = useState(missionVision?.vision || INITIAL_MISSION_VISION.vision);
  const [foundersNoteText, setFoundersNoteText] = useState(missionVision?.foundersNote || INITIAL_MISSION_VISION.foundersNote);
  const [foundersTitleText, setFoundersTitleText] = useState(missionVision?.foundersTitle || INITIAL_MISSION_VISION.foundersTitle);
  const [presidentPhotoUrl, setPresidentPhotoUrl] = useState(missionVision?.presidentPhotoUrl || "");
  const [isUploadingPresidentPhoto, setIsUploadingPresidentPhoto] = useState(false);
  const [presidentPhotoUploadError, setPresidentPhotoUploadError] = useState<string | null>(null);
  const [pillars, setPillars] = useState(missionVision?.pillars || INITIAL_MISSION_VISION.pillars);
  const [cmsSavedNotice, setCmsSavedNotice] = useState(false);

  // CMS State: Team Members
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [memberPhoto, setMemberPhoto] = useState("");
  const [memberProfileLink, setMemberProfileLink] = useState("");
  const [isUploadingMemberPhoto, setIsUploadingMemberPhoto] = useState(false);
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
      setCoverPhoto(photoUrls[0] || "");
      triggerToast("✓ Photo Stored", `${photoUrls.length} Talent photo${photoUrls.length === 1 ? "" : "s"} is selected as the cover and ready to save.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The Talent photo could not be stored.";
      setImageUploadError(message);
      triggerToast("✗ Photo Not Stored", message);
    } finally {
      setIsImageUploading(false);
      e.target.value = "";
    }
  };

  // Persistent video upload: the browser receives only a short-lived,
  // administrator-issued storage capability. Video bytes never pass through
  // this application route and never become a browser-only blob URL.
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setVideoUploadError(null);
    setIsVideoUploading(true);
    try {
      const videoUrls: string[] = [];
      for (const file of Array.from(files)) videoUrls.push(await uploadTalentVideo(file));
      setUploadedVideos((current) => [...current, ...videoUrls].slice(0, 4));
      setRawMediaUrl(videoUrls[0] || "");
      triggerToast("✓ Video Stored", `${videoUrls.length} Talent video${videoUrls.length === 1 ? "" : "s"} is private until its profile and media visibility controls are explicitly enabled.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The Talent video could not be stored.";
      setVideoUploadError(message);
      triggerToast("✗ Video Not Stored", message);
    } finally {
      setIsVideoUploading(false);
      e.target.value = "";
    }
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
            skills: selectedSkills,
            ageBand: age,
            story,
            aspiration,
            supportPathway,
            consentRecord: {
              parentalConsent: true,
              mediaReleasePermission: mediaReleasePermission,
              signedDate: existing.consentRecord?.signedDate || "2026-01-10",
              guardianName: existing.consentRecord?.guardianName || "Parent/Guardian",
              reference: consentReference,
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
            rawMediaUrl,
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
          skills: selectedSkills,
          ageBand: age,
          story,
          aspiration,
          supportPathway,
            consentRecord: {
            parentalConsent: true,
            mediaReleasePermission: mediaReleasePermission,
            signedDate: "2026-01-10",
              guardianName: "Parent/Guardian",
              reference: consentReference,
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
      setTalentVisibility({ profileVisible: false, photoVisible: false, mediaVisible: false, summaryVisible: false, ageBandVisible: false, regionVisible: false, skillsVisible: false, storyVisible: false, aspirationVisible: false, supportPathwayVisible: false });
      setSelectedSkills([]);
      setStory("");
      setAspiration("");
      setSupportPathway("");
      setConsentReference("");
      setMediaReleasePermission(false);
    } catch (err) {
      triggerToast("✗ Save Failed", err instanceof Error ? err.message : "Could not save talent profile. Check your connection and try again.");
    }
  };

  const handleEditTalent = (p: YouthProfile) => {
    setEditingId(p.id);
    setFirstName(p.name);
    setAge(p.ageBand || "");
    setCategory(p.category);
    setLocation(p.location || "");
    setBio(p.bio);
    setCoverPhoto(p.coverPhoto);
    setRawMediaUrl(p.rawMediaUrl || "");
    setUploadedImages(p.galleryImages || []);
    setUploadedVideos(p.galleryVideos || []);
    setTalentVisibility({ profileVisible: p.publicVisibility?.profileVisible ?? p.featuredOnHomepage === true, photoVisible: p.publicVisibility?.photoVisible ?? p.featuredOnHomepage === true, mediaVisible: p.publicVisibility?.mediaVisible ?? p.featuredOnHomepage === true, summaryVisible: p.publicVisibility?.summaryVisible ?? p.featuredOnHomepage === true, ageBandVisible: p.publicVisibility?.ageBandVisible ?? false, regionVisible: p.publicVisibility?.regionVisible ?? false, skillsVisible: p.publicVisibility?.skillsVisible ?? false, storyVisible: p.publicVisibility?.storyVisible ?? false, aspirationVisible: p.publicVisibility?.aspirationVisible ?? false, supportPathwayVisible: p.publicVisibility?.supportPathwayVisible ?? false });
    setSelectedSkills(p.skills || []);
    setStory(p.story || p.current_situation || "");
    setAspiration(p.aspiration || p.dream || "");
    setSupportPathway(p.supportPathway || p.current_needs || "");
    setConsentReference(p.consentRecord?.reference || "");
    setMediaReleasePermission(p.consentRecord?.mediaReleasePermission === true);
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
        presidentPhotoUrl,
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

  const handlePresidentPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const photo = e.target.files?.[0];
    if (!photo) return;
    setPresidentPhotoUploadError(null);
    setIsUploadingPresidentPhoto(true);
    try {
      const preparedPhoto = await prepareTeamHeadshotUpload(photo);
      const url = await uploadMissionPresidentPhoto(preparedPhoto);
      setPresidentPhotoUrl(url);
      triggerToast("✓ President Photo Stored", "Save Mission & Vision to publish this photo in the right-hand founding-perspective section.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The president photo could not be stored.";
      setPresidentPhotoUploadError(message);
      triggerToast("✗ President Photo Not Stored", message);
    } finally {
      setIsUploadingPresidentPhoto(false);
      e.target.value = "";
    }
  };

  // Save Team Member CMS
  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const profileLink = memberProfileLink.trim();
      if (profileLink && !/^https:\/\//i.test(profileLink)) {
        throw new Error("Use a complete HTTPS professional profile link.");
      }
      if (editingMemberId) {
        const updated = teamMembers.map((m) =>
          m.id === editingMemberId
            ? {
                ...m,
                name: memberName,
                role: memberRole,
                bio: memberBio,
                photoUrl: memberPhoto || m.photoUrl,
                linkedinUrl: profileLink || undefined,
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
          ...(profileLink ? { linkedinUrl: profileLink } : {}),
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
      setMemberProfileLink("");
      setMemberVisibility({ isPublic: false, showPhoto: false, showRole: false, showBio: false, showLink: false });
    } catch (err) {
      triggerToast("✗ Save Failed", err instanceof Error ? err.message : "Could not save team member. Check your connection and try again.");
    }
  };

  const handleTeamHeadshotUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";
    if (!selectedFile) return;
    if (!user) {
      triggerToast("✗ Upload Failed", "Sign in as an administrator before uploading a headshot.");
      return;
    }

    setIsUploadingMemberPhoto(true);
    try {
      const file = await prepareTeamHeadshotUpload(selectedFile);
      const token = await user.getIdToken(true);
      const form = new FormData();
      form.set("photo", file);
      const response = await fetch("/api/admin/team-headshot", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: form,
      });
      const payload = await response.json().catch(() => null) as { url?: string; error?: string } | null;
      if (!response.ok || !payload?.url) throw new Error(payload?.error || "The headshot could not be stored.");
      setMemberPhoto(payload.url);
      triggerToast("✓ Headshot Uploaded", "The image is stored privately and will only be public when its visibility controls are enabled.");
    } catch (error) {
      triggerToast("✗ Upload Failed", error instanceof Error ? error.message : "The headshot could not be stored.");
    } finally {
      setIsUploadingMemberPhoto(false);
    }
  };

  const handleEditMember = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setMemberName(m.name);
    setMemberRole(m.role);
    setMemberBio(m.bio);
    setMemberPhoto(m.photoUrl);
    setMemberProfileLink(m.linkedinUrl || "");
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

    return matchesSearch;
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
                <span>Foundation Conversations</span>
              </div>
              <span className="text-[10px] bg-[#079432]/20 text-[#0B2E6B] px-1.5 py-0.5 rounded font-mono font-bold">
                {sponsorConversations.filter((i) => i.status !== "reviewed" && i.status !== "closed").length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSection("submissions");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "submissions"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Public Form Submissions</span>
              </div>
              <span className="text-[10px] bg-[#079432]/20 text-[#0B2E6B] px-1.5 py-0.5 rounded font-mono font-bold">
                {publicSubmissions.filter((i) => i.status !== "reviewed").length}
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
                setActiveSection("editorial");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "editorial"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Public Pages CMS</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("socials");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeSection === "socials"
                  ? "bg-[#079432] text-white font-extrabold"
                  : "text-[#0B2E6B]/70 hover:bg-[#0B2E6B]/5 hover:text-[#0B2E6B]"
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Social Links CMS</span>
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
                  Review incoming sponsor applications, confirm orientation completion, and approve access.
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
                          {sponsor.invitationStatus === "requested" ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-[#0B2E6B]/10 text-[#0B2E6B] font-mono text-[11px] px-3 py-1.5 rounded-lg border border-[#0B2E6B]/15 inline-flex items-center gap-1.5">
                                <Mail className="w-3 h-3 text-[#079432]" />
                                <span>Email Request Accepted</span>
                              </span>
                              <button
                                onClick={() => handleSendInvitationClick(sponsor.id, sponsor.name)}
                                className="border border-[#079432]/30 bg-[#079432]/10 px-2.5 py-1.5 text-[10px] font-bold text-[#079432] transition hover:bg-[#079432] hover:text-white"
                                title="Request a new Firebase invitation email for this sponsor"
                              >
                                Resend
                              </button>
                            </div>
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
                              disabled={sponsor.accessStatus === "revoked"}
                              onClick={async () => {
                                if (!window.confirm(`Revoke dashboard access for "${sponsor.name}"? Their application record will be retained.`)) return;
                                try {
                                  await revokeSponsorAccess(sponsor.id);
                                  triggerToast("✓ Sponsor Access Revoked", `${sponsor.name} can no longer access the sponsor dashboard. Their application was retained.`);
                                } catch (err) {
                                  triggerToast("✗ Access Not Revoked", err instanceof Error ? err.message : "The protected sponsor account could not be revoked. Please try again.");
                                }
                              }}
                              className="bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 font-bold px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition text-[11px] inline-flex items-center gap-1 cursor-pointer"
                              title={sponsor.accessStatus === "revoked" ? "Dashboard access is already revoked" : "Revoke dashboard access without deleting this sponsor record"}
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>{sponsor.accessStatus === "revoked" ? "Access Revoked" : "Revoke Access"}</span>
                            </button>
                            <button
                              onClick={() => setSelectedSponsorOverview(sponsor)}
                              className="bg-[#079432]/10 hover:bg-[#079432] text-[#079432] hover:text-[#0B2E6B] font-bold px-2.5 py-1.5 rounded-lg border border-[#079432]/30 transition text-[11px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Overview</span>
                            </button>

                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete sponsor "${sponsor.name}" (${sponsor.company || sponsor.email})? This permanently removes the private application and account record.`)) {
                                  try {
                                    await deleteSponsor(sponsor.id);
                                    triggerToast("✓ Sponsor Deleted", `Removed ${sponsor.name} and their private sponsor record.`);
                                  } catch (err) {
                                    triggerToast("✗ Sponsor Not Removed", err instanceof Error ? err.message : "The protected sponsor record could not be removed. Please try again.");
                                  }
                                }
                              }}
                              className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white font-bold p-1.5 rounded-lg border border-red-500/30 transition text-[11px] cursor-pointer"
                              title="Delete sponsor record"
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

        {/* PANEL 2: Sponsor-only Foundation conversations. */}
        {activeSection === "inquiries" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">
                Foundation Conversations
              </h1>
              <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                Private message threads with approved sponsors only. Replying here is visible only to the corresponding authenticated sponsor.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#0B2E6B]/10 overflow-hidden shadow-xl">
              {sponsorConversations.length === 0 ? (
                <div className="p-12 text-center text-[#0B2E6B]/50 text-xs">
                  No approved-sponsor conversations have arrived yet.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {sponsorConversations.map((conversation) => {
                    const entries = Array.isArray(conversation.thread) && conversation.thread.length
                      ? conversation.thread
                      : conversation.message ? [{ id: "initial", sender: "sponsor", senderName: conversation.sponsorName, message: conversation.message, createdAt: conversation.createdAt }] : [];
                    return (
                    <div key={conversation.id} className="p-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="space-y-3 max-w-3xl">
                        <div className="flex items-center gap-3">
                          <span className="font-montserrat font-bold text-base text-[#0B2E6B]">
                            {conversation.sponsorName || "Approved sponsor"}{conversation.sponsorEmail ? ` (${conversation.sponsorEmail})` : ""}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-[#0A8CF5]/10 text-[#0A6FBE] border border-[#0A8CF5]/25">Approved sponsor</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#0B2E6B]/10 text-xs text-[#0B2E6B]/80 space-y-1">
                          <p className="font-semibold text-[#079432]">Subject: <span className="text-[#0B2E6B] font-bold">{conversation.subject || "Foundation conversation"}</span></p>
                          {conversation.sponsorOrganization && <p className="text-[#0B2E6B]/62">Organization: {conversation.sponsorOrganization}</p>}
                          {conversation.talentId && <p className="text-[#0B2E6B]/62">Related Sponsor Talent record: {conversation.talentId}</p>}
                        </div>
                        <div className="space-y-2">
                          {entries.map((entry: { id?: string; sender?: string; senderName?: string; message?: string; createdAt?: unknown }, index: number) => <div key={entry.id || index} className={`rounded-xl px-4 py-3 text-xs leading-6 ${entry.sender === "foundation" ? "bg-[#0B2E6B] text-white" : "bg-[#F5F6F0] text-[#0B2E6B]"}`}><p className={`text-[9px] font-bold uppercase tracking-[0.12em] ${entry.sender === "foundation" ? "text-white/65" : "text-[#079432]"}`}>{entry.sender === "foundation" ? "PWLIF Foundation Team" : entry.senderName || "Approved sponsor"}</p><p className="mt-1 whitespace-pre-wrap">{entry.message}</p><p className={`mt-1 text-[9px] ${entry.sender === "foundation" ? "text-white/50" : "text-[#0B2E6B]/45"}`}>{formatReceivedAt(entry.createdAt)}</p></div>)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <form onSubmit={async (event) => {
                          event.preventDefault();
                          const message = (conversationReplies[conversation.id] || "").trim();
                          if (!message) return triggerToast("Message needed", "Write a reply before sending it to the sponsor.");
                          setReplyingConversation(conversation.id);
                          try {
                            await replyToSponsorConversation(conversation.id, message);
                            setConversationReplies((current) => ({ ...current, [conversation.id]: "" }));
                            triggerToast("Reply Sent", "Your secure reply is now visible in this sponsor’s private dashboard.");
                          } catch (error) {
                            triggerToast("Reply Failed", error instanceof Error ? error.message : "The reply could not be sent.");
                          } finally {
                            setReplyingConversation(null);
                          }
                        }} className="space-y-2 rounded-xl border border-[#0B2E6B]/10 bg-[#FCFCFA] p-3">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#0B2E6B]/55" htmlFor={`reply-${conversation.id}`}>Reply to sponsor</label>
                          <textarea id={`reply-${conversation.id}`} value={conversationReplies[conversation.id] || ""} onChange={(event) => setConversationReplies((current) => ({ ...current, [conversation.id]: event.target.value }))} maxLength={2000} rows={5} placeholder="Write a private Foundation reply…" className="w-full resize-y rounded-lg border border-[#0B2E6B]/15 bg-white px-3 py-2 text-xs leading-5 outline-none focus:border-[#079432]" />
                          <button type="submit" disabled={replyingConversation === conversation.id} className="w-full rounded-lg bg-[#0B2E6B] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#079432] disabled:opacity-60">{replyingConversation === conversation.id ? "Sending…" : "Send secure reply"}</button>
                        </form>
                        {conversation.status !== "reviewed" ? (
                          <button
                            onClick={async () => {
                              try {
                                await resolveSponsorConversation(conversation.id);
                                triggerToast("✓ Marked Reviewed", "The sponsor conversation has been retained and marked reviewed.");
                              } catch (err) {
                                triggerToast("✗ Could Not Update Conversation", err instanceof Error ? err.message : "The sponsor conversation could not be updated.");
                              }
                            }}
                            className="bg-[#079432] hover:bg-[#14B84A] text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Reviewed</span>
                          </button>
                        ) : (
                          <div className="text-right text-xs font-semibold text-[#079432]">Reviewed</div>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 3: Non-sponsor public form submissions. */}
        {activeSection === "submissions" && (
          <div className="space-y-6">
            <div><h1 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">Public Form Submissions</h1><p className="text-xs text-[#0B2E6B]/60 mt-0.5">Contact, support, volunteer, partnership, and other non-orientation public forms. These submissions never appear in sponsor conversations.</p></div>
            <div className="bg-white rounded-2xl border border-[#0B2E6B]/10 overflow-hidden shadow-xl">
              {publicSubmissions.length === 0 ? <div className="p-12 text-center text-[#0B2E6B]/50 text-xs">No public form submissions have arrived yet.</div> : <div className="divide-y divide-[#0B2E6B]/5">{publicSubmissions.map((submission) => <div key={submission.id} className="p-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="max-w-3xl space-y-2"><div className="flex flex-wrap items-center gap-2"><h2 className="font-montserrat text-base font-bold text-[#0B2E6B]">{submission.name || "Public visitor"}{submission.email ? ` (${submission.email})` : ""}</h2><span className="rounded-full border border-[#079432]/25 bg-[#079432]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#079432]">{submission.source || "Public form"}</span></div><div className="rounded-xl border border-[#0B2E6B]/10 bg-[#F8FAFC] p-4 text-xs leading-6 text-[#0B2E6B]/75"><p className="font-semibold text-[#079432]">Subject: <span className="text-[#0B2E6B]">{submission.subject || "Public submission"}</span></p><p className="mt-1 whitespace-pre-wrap">{submission.message || "No message provided."}</p><p className="mt-2 font-mono text-[10px] text-[#0B2E6B]/40">Received: {formatReceivedAt(submission.createdAt)}</p></div></div><div className="shrink-0">{submission.status !== "reviewed" ? <button onClick={async () => { try { await resolveSupportInquiry(submission.id, "public"); triggerToast("✓ Marked Reviewed", "The public form submission has been retained and marked reviewed."); } catch (error) { triggerToast("✗ Could Not Update Submission", error instanceof Error ? error.message : "The public form submission could not be updated."); } }} className="rounded-xl bg-[#079432] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#14B84A]">Mark Reviewed</button> : <span className="text-xs font-semibold text-[#079432]">Reviewed</span>}</div></div>)}</div>}
            </div>
          </div>
        )}

        {/* PANEL 4: Sponsor Talent Directory CMS */}
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
                      setTalentVisibility({ profileVisible: false, photoVisible: false, mediaVisible: false, summaryVisible: false, ageBandVisible: false, regionVisible: false, skillsVisible: false, storyVisible: false, aspirationVisible: false, supportPathwayVisible: false });
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
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Optional public age band</label>
                      <input
                        type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="For example: 13–15"
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Primary category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                      >
                        <option value="">Select a category</option>
                        {category && !talentCategories.some((categoryItem) => categoryItem.name === category && categoryItem.status === "active") && <option value={category}>{category}</option>}
                        {talentCategories.filter((categoryItem) => categoryItem.status === "active").map((categoryItem) => <option key={categoryItem.id} value={categoryItem.name}>{categoryItem.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <details className="rounded-xl border border-[#0B2E6B]/10 bg-[#F8FAFC] p-3">
                    <summary className="cursor-pointer list-none font-semibold text-[#0B2E6B] [&::-webkit-details-marker]:hidden">Manage category library <span className="ml-1 text-[10px] font-normal text-[#0B2E6B]/55">({talentCategories.filter((item) => item.status === "active").length} active)</span></summary>
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2"><input value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void addCustomCategory(); } }} placeholder="Add a category, for example Architecture" className="min-w-0 flex-1 rounded-lg border border-[#0B2E6B]/15 bg-white p-2 text-[#0B2E6B] focus:border-[#079432] focus:outline-none" /><button type="button" onClick={() => void addCustomCategory()} className="shrink-0 rounded-lg bg-[#0B2E6B] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#079432]">Add</button></div>
                      <div className="max-h-36 space-y-1 overflow-y-auto pr-1">{talentCategories.filter((item) => item.status === "active").map((item) => <div key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-[#0B2E6B]/10 bg-white px-2 py-1.5 text-[10px] font-semibold text-[#0B2E6B]"><span className="truncate">{item.name}</span><span className="shrink-0 space-x-1"><button type="button" onClick={() => void renameTalentCategory(item.id)} className="rounded px-1 text-[#0B2E6B]/55 hover:bg-[#EAF7EF] hover:text-[#079432]">Edit</button><button type="button" onClick={() => void retireTalentCategory(item.id)} className="rounded px-1 text-[#0B2E6B]/55 hover:bg-red-50 hover:text-red-600">Retire</button></span></div>)}</div>
                    </div>
                  </details>

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

                  <div className="space-y-2 rounded-xl border border-[#0B2E6B]/10 bg-[#F8FAFC] p-3">
                    <div className="flex items-center justify-between gap-3"><label className="font-semibold text-[#0B2E6B]">Skills &amp; interests</label><span className="text-[10px] text-[#0B2E6B]/55">{selectedSkills.length ? `${selectedSkills.length} selected` : "None selected"}</span></div>
                    <select value="" onChange={(event) => { if (event.target.value) toggleSkill(event.target.value); }} className="w-full rounded-lg border border-[#0B2E6B]/15 bg-white p-2 text-[#0B2E6B] focus:border-[#079432] focus:outline-none"><option value="">Select or remove a skill</option>{talentTags.filter((tag) => tag.status === "active").map((tag) => <option key={tag.id} value={tag.name}>{selectedSkills.includes(tag.name) ? `✓ ${tag.name}` : tag.name}</option>)}</select>
                    <details className="rounded-lg border border-[#0B2E6B]/10 bg-white p-2"><summary className="cursor-pointer list-none text-[10px] font-semibold text-[#0B2E6B] [&::-webkit-details-marker]:hidden">Manage skills library <span className="font-normal text-[#0B2E6B]/55">({talentTags.filter((tag) => tag.status === "active").length} active)</span></summary><div className="mt-2 space-y-2"><div className="flex gap-2"><input value={customSkill} onChange={(event) => setCustomSkill(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void addCustomSkill(); } }} placeholder="Add a new skill or interest" className="min-w-0 flex-1 rounded-lg border border-[#0B2E6B]/15 bg-white p-2 text-[#0B2E6B] focus:border-[#079432] focus:outline-none" /><button type="button" onClick={() => void addCustomSkill()} className="shrink-0 rounded-lg bg-[#0B2E6B] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#079432]">Add</button></div><div className="max-h-36 space-y-1 overflow-y-auto pr-1">{talentTags.filter((tag) => tag.status === "active").map((tag) => <div key={`manage-${tag.id}`} className="flex items-center justify-between gap-2 rounded-lg border border-[#0B2E6B]/10 px-2 py-1.5 text-[10px] font-semibold text-[#0B2E6B]"><span className="truncate">{tag.name}</span><span className="shrink-0 space-x-1"><button type="button" onClick={() => void renameTalentTag(tag.id)} className="rounded px-1 text-[#0B2E6B]/55 hover:bg-[#EAF7EF] hover:text-[#079432]">Edit</button><button type="button" onClick={() => void retireTalentTag(tag.id)} className="rounded px-1 text-[#0B2E6B]/55 hover:bg-red-50 hover:text-red-600">Retire</button></span></div>)}</div></div></details>
                  </div>

	                  <div><label className="block text-[#0B2E6B]/80 font-semibold mb-1">Approved story</label><textarea rows={3} value={story} onChange={(event) => setStory(event.target.value)} placeholder="Focus on learning, effort, and interests — never private family, school, health, or financial details." className="w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] p-2.5 text-[#0B2E6B] focus:border-[#079432] focus:outline-none" /></div>
	                  <div><label className="block text-[#0B2E6B]/80 font-semibold mb-1">Where they are heading</label><input value={aspiration} onChange={(event) => setAspiration(event.target.value)} placeholder="An approved learning or future goal" className="w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] p-2.5 text-[#0B2E6B] focus:border-[#079432] focus:outline-none" /></div>
	                  <div><label className="block text-[#0B2E6B]/80 font-semibold mb-1">What support could unlock</label><input value={supportPathway} onChange={(event) => setSupportPathway(event.target.value)} placeholder="Examples: mentoring, equipment, training, creative materials" className="w-full rounded-xl border border-[#0B2E6B]/15 bg-[#F8FAFC] p-2.5 text-[#0B2E6B] focus:border-[#079432] focus:outline-none" /></div>

	                  <div className="space-y-2 rounded-xl border border-amber-500/25 bg-amber-50 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-800">Private consent record — never public</p><input value={consentReference} onChange={(event) => setConsentReference(event.target.value)} placeholder="Consent reference / internal file ID" className="w-full rounded-lg border border-amber-700/15 bg-white p-2 text-[#0B2E6B]" /><p className="text-[10px] leading-relaxed text-amber-900/70">Consent review is handled by your safeguarding team. This CMS keeps only the private reference and the public-release switches.</p></div>

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

                  {/* PERSISTENT PRIVATE VIDEO UPLOADS */}
                  <div className="p-3 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[#0B2E6B] flex items-center gap-1.5 text-xs">
                        <VideoIcon className="w-3.5 h-3.5 text-[#079432]" />
                        <span>Store Talent Videos Privately</span>
                      </label>
                      <span className="text-[10px] text-[#0B2E6B]/40 font-mono">
                        {uploadedVideos.length}/4 stored
                      </span>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="video/mp4,video/webm"
                      onChange={handleVideoUpload}
                      disabled={isVideoUploading || uploadedVideos.length >= 4}
                      className="w-full text-[11px] text-[#0B2E6B]/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#079432] file:text-white hover:file:brightness-110 cursor-pointer"
                    />
                    <p className="text-[10px] leading-4 text-[#0B2E6B]/58">MP4 or WebM only, up to 50 MB each. Uploads go directly to the Foundation’s private media storage. Save or update this Talent record to attach a stored video.</p>
                    {isVideoUploading && <p role="status" className="text-[10px] font-semibold text-[#079432]">Uploading securely… Please keep this tab open.</p>}
                    {videoUploadError && <p role="alert" className="text-[10px] font-semibold text-red-700">{videoUploadError}</p>}

                    {uploadedVideos.length > 0 && (
                      <div className="space-y-3 pt-1">
                        {uploadedVideos.map((vUrl, idx) => (
                          <div key={vUrl} className="overflow-hidden rounded-lg border border-[#0B2E6B]/10 bg-[#0B2E6B]/5 text-[11px]">
                            <TalentVideo src={vUrl} access="private" className="aspect-video w-full bg-[#061D45] object-cover" />
                            <div className="flex items-center justify-between p-2">
                              <span className="flex items-center gap-2 truncate text-[#0B2E6B]/80 font-mono"><Play className="w-3 h-3 text-[#079432] shrink-0" />Stored video #{idx + 1}</span>
                              <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setRawMediaUrl(vUrl)}
                                className="px-2 py-0.5 bg-[#079432]/20 text-[#079432] rounded text-[10px] font-bold"
                              >
                                Primary
                              </button>
                              <button
                                type="button"
                                onClick={() => { setUploadedVideos(uploadedVideos.filter((_, i) => i !== idx)); if (rawMediaUrl === vUrl) setRawMediaUrl(""); }}
                                className="p-1 text-red-400 hover:text-[#0B2E6B]"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Cover Photo URL (Or select uploaded image)</label>
                    <input
                      type="text"
                      inputMode="url"
                      value={coverPhoto}
                      onChange={(e) => setCoverPhoto(e.target.value)}
                      placeholder="https://... or select an uploaded image"
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                  </div>

                  <fieldset className="rounded-xl border border-[#079432]/25 bg-[#079432]/5 p-3 space-y-2">
                    <legend className="px-1 text-[11px] font-bold text-[#079432]">Public visibility controls</legend>
                    <p className="text-[10px] text-[#0B2E6B]/60">All public fields are hidden by default. A video appears publicly only when its profile, approved-media setting, and recorded media-release consent are all enabled. You can edit these choices after publishing.</p>
                    {[
                      ["profileVisible", "Publish this Sponsor Talent profile"],
                      ["summaryVisible", "Show the approved summary"],
                      ["photoVisible", "Show the approved cover photo"],
                      ["mediaVisible", "Show approved media"],
                      ["skillsVisible", "Show approved skills and interests"],
                      ["storyVisible", "Show the approved story"],
                      ["aspirationVisible", "Show where they are heading"],
                      ["supportPathwayVisible", "Show what support could unlock"],
                      ["regionVisible", "Show broad region / community"],
                      ["ageBandVisible", "Show approved age band"],
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
                      disabled={isImageUploading || isVideoUploading}
                      className="flex-1 bg-[#079432] hover:brightness-110 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isImageUploading ? "Storing Photo…" : isVideoUploading ? "Storing Video…" : editingId ? "Update Sponsor Talent" : "Save Sponsor Talent"}
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

              <div className="rounded-xl border border-[#0B2E6B]/10 bg-[#F8FAFC] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold">President Photo</label>
                    <p className="mt-1 max-w-xl text-[11px] leading-5 text-[#0B2E6B]/60">Upload a JPEG, PNG, or WebP portrait. It is stored privately first and appears publicly only after you save these Mission &amp; Vision updates.</p>
                  </div>
                  {presidentPhotoUrl && <button type="button" onClick={() => setPresidentPhotoUrl("")} className="rounded-lg border border-[#0B2E6B]/15 px-3 py-2 text-[11px] font-bold text-[#0B2E6B] hover:border-red-300 hover:text-red-600">Remove selection</button>}
                </div>
                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0B2E6B] px-4 py-2.5 text-[11px] font-bold text-white transition hover:brightness-110">
                  <Upload className="h-4 w-4" />
                  <span>{isUploadingPresidentPhoto ? "Preparing photo…" : presidentPhotoUrl ? "Replace president photo" : "Upload president photo"}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePresidentPhotoUpload} disabled={isUploadingPresidentPhoto} className="sr-only" />
                </label>
                {presidentPhotoUrl && <p className="mt-3 text-[11px] font-semibold text-emerald-700">A president photo is ready. Select “Publish CMS Updates” to display it on the public page.</p>}
                {presidentPhotoUploadError && <p role="alert" className="mt-3 text-[11px] font-semibold text-red-600">{presidentPhotoUploadError}</p>}
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
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Professional Social Profile Link <span className="font-normal text-[#0B2E6B]/50">(optional)</span></label>
                    <input
                      type="url"
                      inputMode="url"
                      placeholder="https://www.linkedin.com/in/member-profile"
                      value={memberProfileLink}
                      onChange={(e) => setMemberProfileLink(e.target.value)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] focus:outline-none focus:border-[#079432]"
                    />
                    <p className="mt-1 text-[10px] text-[#0B2E6B]/55">Use an approved HTTPS profile link. It stays private unless “Show public profile link” is enabled below.</p>
                  </div>

                  <div>
                    <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Headshot Photo (persistent upload or HTTPS URL)</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleTeamHeadshotUpload}
                        disabled={isUploadingMemberPhoto}
                        className="w-full p-2 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#079432] file:text-white hover:file:brightness-110"
                      />
                      <input
                        type="text"
                        placeholder="Or paste a trusted HTTPS image URL..."
                        value={memberPhoto}
                        onChange={(e) => setMemberPhoto(e.target.value)}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs focus:outline-none focus:border-[#079432]"
                      />
                      {isUploadingMemberPhoto && <p className="text-[10px] font-semibold text-[#079432]">Storing headshot securely…</p>}
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
                      ["showLink", "Show public profile link"],
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
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Partnership Section Badge</label>
                      <input
                        type="text"
                        value={brandingForm.transparencySectionBadge || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, transparencySectionBadge: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Partnership Section Title</label>
                      <input
                        type="text"
                        value={brandingForm.transparencySectionTitle || ""}
                        onChange={(e) => setBrandingForm({ ...brandingForm, transparencySectionTitle: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#0B2E6B]/15 rounded-xl text-[#0B2E6B] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0B2E6B]/80 font-semibold mb-1">Partnership Section Subtitle</label>
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

        {/* PANEL 8: Public Pages CMS */}
        {activeSection === "editorial" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-6 max-w-4xl">
            <div className="border-b border-[#0B2E6B]/10 pb-4">
              <h1 className="font-montserrat font-bold text-xl text-[#0B2E6B] flex items-center gap-2"><FileText className="w-5 h-5 text-[#079432]" /> Public Pages CMS</h1>
              <p className="text-xs text-[#0B2E6B]/60 mt-1">Manage real Foundation content for How It Works, News &amp; Updates, and Media &amp; Press. Drafts stay private until they are published.</p>
            </div>
            <form
              className="space-y-8"
              onSubmit={async (event) => {
                event.preventDefault();
                try {
                  await updateEditorialPages(editorialForm);
                  triggerToast("✓ Public pages saved", "Published page content is now available on its matching public route. Drafts remain private.");
                } catch (error) {
                  triggerToast("✗ Save failed", error instanceof Error ? error.message : "Could not save the public page content.");
                }
              }}
            >
              {([
                ["howItWorks", "How It Works", "/our-pilot"],
                ["foundationUpdates", "News & Updates", "/foundation-updates"],
                ["mediaPress", "Media & Press", "/press-resources"],
              ] as [EditorialPageKey, string, string][]).map(([key, label, route]) => {
                const page = editorialForm[key] || INITIAL_EDITORIAL_PAGES[key];
                const updatePage = (field: "title" | "introduction" | "body" | "status", value: string) => setEditorialForm((current) => ({ ...current, [key]: { ...page, [field]: value } }));
                return <section key={key} className="rounded-xl border border-[#0B2E6B]/10 p-4 sm:p-5 space-y-3 bg-[#FCFCFA]">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-sm text-[#0B2E6B]">{label}</h2><p className="text-[11px] text-[#0B2E6B]/60">Public route: {route}</p></div><select value={page.status} onChange={(event) => updatePage("status", event.target.value)} className="rounded-lg border border-[#0B2E6B]/15 bg-white px-3 py-2 text-xs text-[#0B2E6B]"><option value="draft">Draft — private</option><option value="published">Published</option></select></div>
                  <input value={page.title} onChange={(event) => updatePage("title", event.target.value)} maxLength={160} placeholder="Page title" className="w-full rounded-lg border border-[#0B2E6B]/15 bg-white px-3 py-2.5 text-sm text-[#0B2E6B]" />
                  <textarea value={page.introduction} onChange={(event) => updatePage("introduction", event.target.value)} maxLength={1000} rows={3} placeholder="Introduction" className="w-full rounded-lg border border-[#0B2E6B]/15 bg-white px-3 py-2.5 text-sm text-[#0B2E6B]" />
                  <textarea value={page.body} onChange={(event) => updatePage("body", event.target.value)} maxLength={20000} rows={8} placeholder="Page content" className="w-full rounded-lg border border-[#0B2E6B]/15 bg-white px-3 py-2.5 text-sm text-[#0B2E6B]" />
                </section>;
              })}
              <div className="flex justify-end"><button type="submit" className="bg-[#079432] hover:brightness-110 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Save drafts &amp; publishing status</button></div>
            </form>
          </div>
        )}

        {activeSection === "socials" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-6 max-w-4xl">
            <div className="border-b border-[#0B2E6B]/10 pb-4">
              <h1 className="font-montserrat font-bold text-xl text-[#0B2E6B] flex items-center gap-2"><Link2 className="w-5 h-5 text-[#079432]" /> Social Links CMS</h1>
              <p className="text-xs text-[#0B2E6B]/60 mt-1">Add and manage the social links shown in the public footer. Only visible entries are published. Links open in a new tab and must use HTTPS.</p>
            </div>
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                try {
                  await updateSocialLinks(socialLinkDraft);
                  triggerToast("✓ Social links saved", "Visible, approved links are now published in the public footer.");
                } catch (error) {
                  triggerToast("✗ Save failed", error instanceof Error ? error.message : "Could not save social links.");
                }
              }}
            >
              {socialLinkDraft.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#0B2E6B]/20 bg-[#FCFCFA] p-5 text-xs text-[#0B2E6B]/60">No social links are currently configured. Add one below when you are ready to publish it.</p>
              ) : socialLinkDraft.map((link, index) => (
                <section key={link.id} className="rounded-xl border border-[#0B2E6B]/10 bg-[#FCFCFA] p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold text-sm text-[#0B2E6B]">Social link {index + 1}</h2><button type="button" onClick={() => setSocialLinkDraft((links) => links.filter((item) => item.id !== link.id))} className="rounded-lg border border-red-200 px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50">Remove</button></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1 text-xs font-semibold text-[#0B2E6B]"><span>Platform</span><select value={link.platform} onChange={(event) => setSocialLinkDraft((links) => links.map((item) => item.id === link.id ? { ...item, platform: event.target.value as SocialLink["platform"] } : item))} className="w-full rounded-lg border border-[#0B2E6B]/15 bg-white px-3 py-2.5 text-sm text-[#0B2E6B]"><option>LinkedIn</option><option>Facebook</option><option>Instagram</option><option>X</option><option>YouTube</option><option>TikTok</option><option>WhatsApp</option><option>Website</option></select></label>
                    <label className="space-y-1 text-xs font-semibold text-[#0B2E6B]"><span>Public label</span><input value={link.label} onChange={(event) => setSocialLinkDraft((links) => links.map((item) => item.id === link.id ? { ...item, label: event.target.value } : item))} maxLength={60} placeholder="Follow PWLIF on LinkedIn" className="w-full rounded-lg border border-[#0B2E6B]/15 bg-white px-3 py-2.5 text-sm text-[#0B2E6B]" /></label>
                  </div>
                  <label className="block space-y-1 text-xs font-semibold text-[#0B2E6B]"><span>HTTPS destination</span><input type="url" value={link.url} onChange={(event) => setSocialLinkDraft((links) => links.map((item) => item.id === link.id ? { ...item, url: event.target.value } : item))} maxLength={500} placeholder="https://www.linkedin.com/company/..." className="w-full rounded-lg border border-[#0B2E6B]/15 bg-white px-3 py-2.5 text-sm text-[#0B2E6B]" required /></label>
                  <div className="flex flex-wrap items-center gap-5"><label className="flex items-center gap-2 text-xs font-semibold text-[#0B2E6B]"><input type="checkbox" checked={link.visible} onChange={(event) => setSocialLinkDraft((links) => links.map((item) => item.id === link.id ? { ...item, visible: event.target.checked } : item))} className="h-4 w-4 accent-[#079432]" /> Show in public footer</label><label className="flex items-center gap-2 text-xs font-semibold text-[#0B2E6B]">Display order <input type="number" min={0} max={999} value={link.order} onChange={(event) => setSocialLinkDraft((links) => links.map((item) => item.id === link.id ? { ...item, order: Number(event.target.value) || 0 } : item))} className="w-20 rounded-lg border border-[#0B2E6B]/15 bg-white px-2 py-1.5 text-sm text-[#0B2E6B]" /></label></div>
                </section>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#0B2E6B]/10 pt-5"><button type="button" onClick={() => setSocialLinkDraft((links) => [...links, { id: `social-${Date.now()}`, platform: "Website", label: "Foundation website", url: "", visible: false, order: links.length + 1 }])} className="rounded-xl border border-[#079432]/30 bg-[#079432]/5 px-4 py-2.5 text-xs font-bold text-[#087A2C] hover:bg-[#079432]/10"><Plus className="mr-1 inline h-4 w-4" /> Add social link</button><button type="submit" className="bg-[#079432] hover:brightness-110 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Save social links</button></div>
            </form>
          </div>
        )}

        {/* PANEL 9: Audit Trail Log */}
        {activeSection === "audit" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-montserrat font-bold text-2xl text-[#0B2E6B]">Operational Audit Trail</h1>
              <p className="text-xs text-[#0B2E6B]/60 mt-0.5">
                Read-only record of protected administrator operations. It does not calculate financial or performance metrics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#0B2E6B]/10 shadow-xl space-y-4">
              <h3 className="font-montserrat font-bold text-base text-[#0B2E6B]">Administrative event log</h3>
              <div className="space-y-2">
                {auditLogs.length === 0 ? <p className="rounded-xl border border-dashed border-[#0B2E6B]/20 p-5 text-xs text-[#0B2E6B]/60">No administrative events have been recorded yet.</p> : auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#0B2E6B]/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-400 font-mono font-bold">{String(log.action || "Administrative action")}</span>
                      <p className="text-[#0B2E6B]/70 mt-0.5">{typeof log.details === "string" ? log.details : "Protected administrative event recorded."}</p>
                    </div>
                    <div className="text-right text-[10px] font-mono text-[#0B2E6B]/40">
                      <div>{String(log.adminEmail || log.performedBy || "Administrator")}</div>
                      <div>{formatReceivedAt(log.timestamp || log.createdAt)}</div>
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
                  <h3 className="font-montserrat font-bold text-lg text-[#0B2E6B]">Invitation Email Requested</h3>
                  <p className="text-xs text-[#0B2E6B]/60">Firebase accepted the request; inbox delivery is not reported back to the portal.</p>
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
            <p className="text-[11px] leading-relaxed text-[#0B2E6B]/60">Ask the sponsor to check their inbox and spam folder. If it does not arrive, use the resend control after confirming the email address and Firebase email-link configuration.</p>
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
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">Organization</span>
                  <span className="font-semibold text-[#0B2E6B]/90 text-xs block mt-0.5">{selectedSponsorOverview.company || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">Role or title</span>
                  <span className="font-semibold text-[#0B2E6B]/90 text-xs block mt-0.5">{selectedSponsorOverview.roleTitle || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">Dashboard access</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] inline-block mt-0.5 ${selectedSponsorOverview.accessStatus === "revoked" ? "bg-red-500/10 text-red-600" : "bg-emerald-500/20 text-emerald-600"}`}>
                    {selectedSponsorOverview.accessStatus === "revoked" ? "Revoked" : "Active"}
                  </span>
                </div>
                <div>
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">Password setup</span>
                  <span className="font-semibold text-[#0B2E6B]/90 text-xs block mt-0.5">
                    {selectedSponsorOverview.passwordSetupComplete ? "Completed by sponsor" : "Awaiting sponsor completion"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">LinkedIn Record</span>
                  {typeof selectedSponsorOverview.linkedin === "string" && selectedSponsorOverview.linkedin.trim() ? (
                    <a
                      href={selectedSponsorOverview.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#079432] hover:underline font-semibold text-xs inline-flex items-center gap-1 mt-0.5"
                    >
                      {selectedSponsorOverview.linkedin} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-semibold text-[#0B2E6B]/60 text-xs block mt-0.5">Not provided</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#FCFCFA] p-5 rounded-2xl border border-[#0B2E6B]/10 space-y-4">
              <h4 className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#079432] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Orientation Form Submission
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">Organization description</span>
                  <p className="mt-1 whitespace-pre-wrap leading-relaxed text-[#0B2E6B]/85">{selectedSponsorOverview.orgDescription || "Not provided"}</p>
                </div>
                <div className="border-t border-[#0B2E6B]/10 pt-3">
                  <span className="text-[#0B2E6B]/40 block text-[10px] uppercase">How they hope to support</span>
                  <p className="mt-1 whitespace-pre-wrap leading-relaxed text-[#0B2E6B]/85">{selectedSponsorOverview.supportIntent || "Not provided"}</p>
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
              {inquiries.filter((i) => String(i.sponsorEmail || "").trim().toLowerCase() === String(selectedSponsorOverview.email || "").trim().toLowerCase() || i.sponsorId === selectedSponsorOverview.id).length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {inquiries.filter((i) => String(i.sponsorEmail || "").trim().toLowerCase() === String(selectedSponsorOverview.email || "").trim().toLowerCase() || i.sponsorId === selectedSponsorOverview.id).map((inq) => (
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
            <div className="pt-3 border-t border-[#0B2E6B]/10 flex flex-wrap items-center justify-between gap-3">
              <button
                disabled={selectedSponsorOverview.accessStatus === "revoked"}
                onClick={async () => {
                  if (!window.confirm(`Revoke dashboard access for "${selectedSponsorOverview.name}"? Their application record will be retained.`)) return;
                  try {
                    await revokeSponsorAccess(selectedSponsorOverview.id);
                    setSelectedSponsorOverview(null);
                    triggerToast("✓ Sponsor Access Revoked", `${selectedSponsorOverview.name} can no longer access the sponsor dashboard. Their application was retained.`);
                  } catch (err) {
                    triggerToast("✗ Access Not Revoked", err instanceof Error ? err.message : "The protected sponsor account could not be revoked. Please try again.");
                  }
                }}
                className="bg-amber-500 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60 text-[#0B2E6B] font-bold py-2.5 px-4 rounded-xl transition text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Lock className="w-4 h-4" />
                <span>{selectedSponsorOverview.accessStatus === "revoked" ? "Access Revoked" : "Revoke Access"}</span>
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    if (!window.confirm(`Delete sponsor "${selectedSponsorOverview.name}" (${selectedSponsorOverview.company || selectedSponsorOverview.email})? This permanently removes the private application and account record.`)) return;
                    try {
                      await deleteSponsor(selectedSponsorOverview.id);
                      setSelectedSponsorOverview(null);
                      triggerToast("✓ Sponsor Deleted", `${selectedSponsorOverview.name}'s private sponsor record was removed.`);
                    } catch (err) {
                      triggerToast("✗ Sponsor Not Removed", err instanceof Error ? err.message : "The protected sponsor record could not be removed. Please try again.");
                    }
                  }}
                  className="border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  Delete Sponsor
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
