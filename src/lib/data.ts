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
  
  // PWLIF Foundation Specific Fields
  dream: string;
  current_situation: string;
  progress: string;
  current_needs: string;
  country_community: string;
  consentRecord: ConsentRecord;
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

export const INITIAL_YOUTH_PROFILES: YouthProfile[] = [
  {
    id: "yp-1",
    name: "Sarah M.",
    age: 18,
    category: "Technology",
    location: "Nairobi, Kenya",
    country_community: "Mathare Community, Nairobi, Kenya",
    bio: "Passionate young innovator engineering AI-powered open source screen readers to make public education accessible for visually impaired youth across East Africa.",
    dream: "To equip 5,000 blind students across East Africa with affordable open-source AI assistive devices.",
    current_situation: "Working with secondhand microcontrollers in a community youth lab with limited component access.",
    progress: "Successfully engineered Phase 1 hardware prototype with 94% text-to-speech accuracy in Swahili & English.",
    current_needs: "High-precision soldering equipment, 50 Raspberry Pi Zero microcontrollers, and annual STEM tuition.",
    coverPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    rawMediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    status: "active",
    inquiriesCount: 3,
    skills: ["Python", "OpenCV", "TensorFlow", "Raspberry Pi", "Swahili/English NLP"],
    featuredOnHomepage: true,
    consentRecord: {
      parentalConsent: true,
      mediaReleasePermission: true,
      signedDate: "2026-01-15",
      guardianName: "Grace M. (Mother)",
    },
  },
  {
    id: "yp-2",
    name: "Marcus K.",
    age: 17,
    category: "Music",
    location: "Chicago, IL",
    country_community: "South Side Youth Conservatory, Chicago, USA",
    bio: "Self-taught orchestral composer and cellist synthesizing classical chamber acoustics with modern digital scoring.",
    dream: "To score a full-length humanitarian documentary and establish a youth orchestral scholarship in his district.",
    current_situation: "Practicing on a borrowed student cello and composing on a shared library laptop.",
    progress: "Awarded 1st place in Regional Youth Orchestral Showcase; composed original 4-part symphony.",
    current_needs: "Professional full-size cello, digital audio workstation software license, and conservatory masterclasses.",
    coverPhoto: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    rawMediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    status: "active",
    inquiriesCount: 5,
    skills: ["Cello", "Logic Pro", "Acoustic Orchestration", "Sound Design"],
    featuredOnHomepage: true,
    consentRecord: {
      parentalConsent: true,
      mediaReleasePermission: true,
      signedDate: "2026-02-10",
      guardianName: "David K. (Father)",
    },
  },
  {
    id: "yp-3",
    name: "Elena R.",
    age: 19,
    category: "Digital Art",
    location: "San Jose, Costa Rica",
    country_community: "Valle Central Arts Collective, Costa Rica",
    bio: "3D digital visual artist documenting endangered rainforest biodiversity through interactive virtual reality installations.",
    dream: "To launch an interactive VR biodiversity exhibit for schools to foster environmental stewardship.",
    current_situation: "Creating 3D renders on an entry-level graphics tablet with limited GPU rendering capacity.",
    progress: "Completed 12 photorealistic 3D flora/fauna models currently exhibited at San Jose Community Center.",
    current_needs: "High-performance rendering workstation, VR headset for testing, and digital arts mentorship.",
    coverPhoto: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
    rawMediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    status: "sponsored",
    inquiriesCount: 8,
    skills: ["Blender 3D", "Unreal Engine 5", "Environmental Art", "ZBrush"],
    featuredOnHomepage: true,
    consentRecord: {
      parentalConsent: true,
      mediaReleasePermission: true,
      signedDate: "2025-11-20",
      guardianName: "Rosa R. (Mother)",
    },
  },
  {
    id: "yp-4",
    name: "Jordan T.",
    age: 16,
    category: "Robotics",
    location: "Detroit, MI",
    country_community: "Eastside Tech Hub, Detroit, USA",
    bio: "Young mechanical robotics builder engineering solar-assisted autonomous water filtration rovers for flood-prone areas.",
    dream: "To deploy autonomous water purification rovers to 20 rural emergency clean water relief stations.",
    current_situation: "Assembling rovers from salvaged automotive motors and 3D printed components.",
    progress: "Successfully filtered 500 gallons of water in field testing using prototype 0.2-micron filtration system.",
    current_needs: "Solar panel arrays, industrial 3D filament, water testing kits, and engineering lab tools.",
    coverPhoto: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    rawMediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    status: "active",
    inquiriesCount: 2,
    skills: ["ROS 2", "SolidWorks", "Solar Systems", "C++", "Hydraulic Filtration"],
    featuredOnHomepage: true,
    consentRecord: {
      parentalConsent: true,
      mediaReleasePermission: true,
      signedDate: "2026-03-01",
      guardianName: "Thomas T. (Father)",
    },
  },
  {
    id: "yp-5",
    name: "Dawit T.",
    age: 16,
    category: "Sports (Football)",
    location: "Addis Ababa, Ethiopia",
    country_community: "Kirkos Sub-City Youth Hub, Addis Ababa, Ethiopia",
    bio: "Talented young striker and team leader dreaming of joining the Ethiopian youth national league and studying sports management.",
    dream: "To earn a spot in the national youth sports academy and lead community youth leagues in Addis Ababa.",
    current_situation: "Training on gravel pitches with shared equipment after school.",
    progress: "Captained U-17 regional team to championship victory, scoring 14 goals in 10 matches.",
    current_needs: "Professional football kit, sports academy training grant, and athletic scholarship.",
    coverPhoto: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    rawMediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    status: "active",
    inquiriesCount: 4,
    skills: ["Football Striker", "Team Leadership", "Athletic Conditioning"],
    featuredOnHomepage: true,
    consentRecord: {
      parentalConsent: true,
      mediaReleasePermission: true,
      signedDate: "2026-03-10",
      guardianName: "Teshome T. (Father)",
    },
  },
  {
    id: "yp-6",
    name: "Bethelhem A.",
    age: 17,
    category: "Academics",
    location: "Hawassa, Ethiopia",
    country_community: "Lake Hawassa Community Hub, Hawassa, Ethiopia",
    bio: "Exceptional academic scholar with top marks in mathematics and environmental science, building peer tutoring circles for rural girls.",
    dream: "To secure a university STEM scholarship and establish community science labs across Southern Ethiopia.",
    current_situation: "Studying by solar lamp and sharing secondary school reference books with classmates.",
    progress: "Ranked #1 in Regional Academic Olympiad and established weekend peer math tutoring circle.",
    current_needs: "Academic tuition grant, science reference library, and student laptop.",
    coverPhoto: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    rawMediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    status: "active",
    inquiriesCount: 6,
    skills: ["Advanced Mathematics", "Peer Tutoring", "Environmental Science"],
    featuredOnHomepage: true,
    consentRecord: {
      parentalConsent: true,
      mediaReleasePermission: true,
      signedDate: "2026-03-12",
      guardianName: "Alem A. (Mother)",
    },
  },
];

export const INITIAL_TRANSPARENCY_REPORTS: TransparencyReport[] = [
  {
    id: "tr-1",
    title: "2025 Annual Financial Stewardship & Impact Audit",
    year: "2025",
    totalFunded: "$1,450,000",
    childrenImpacted: 340,
    reportPdfUrl: "https://wlp-app.vercel.app/reports/2025-stewardship.pdf",
    auditDate: "2025-12-31",
    category: "Financial Audit",
  },
  {
    id: "tr-2",
    title: "Q1 2026 Direct Child Dream Grant Distribution Report",
    year: "2026",
    totalFunded: "$420,000",
    childrenImpacted: 115,
    reportPdfUrl: "https://wlp-app.vercel.app/reports/2026-q1-impact.pdf",
    auditDate: "2026-03-31",
    category: "Annual Impact Report",
  },
];

export const INITIAL_FOUNDATION_VIDEOS: FoundationVideo[] = [
  {
    id: "fv-1",
    title: "Potential Without Limits International Foundation: Empowering Every Child's Dream",
    category: "Foundation Intro",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    description: "Learn how PWLIF bridges direct sponsor support with young innovators across 24 global communities.",
    duration: "3:45",
  },
  {
    id: "fv-2",
    title: "Sarah's Transformation: From Recycled Tech to AI Assistive Devices",
    category: "Transformational Journey",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    description: "See how direct dream sponsorship transformed Sarah's AI vision into 50 deployed screen reading units.",
    duration: "4:12",
  },
];
