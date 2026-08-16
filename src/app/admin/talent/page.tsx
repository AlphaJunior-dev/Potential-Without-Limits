"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// NOTE: This route used to contain a standalone talent-management page that
// stored profiles in local component state only (useState), never touching
// Firestore. Any edits made there looked successful but were never saved and
// vanished on refresh. The real, working Talent CMS lives inside the main
// admin dashboard's "Talent Directory" tab. Redirecting here instead of
// deleting the route outright, in case it's bookmarked anywhere.
export default function AdminTalentRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return null;
}
