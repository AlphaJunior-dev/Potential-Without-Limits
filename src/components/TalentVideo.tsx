"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const internalVideoPattern = /^\/api\/talent-video\/([A-Za-z0-9_-]{8,80})$/;

type TalentVideoProps = {
  src: string;
  className?: string;
  controls?: boolean;
};

/**
 * Public videos stream through the consent-gated route. Approved sponsors and
 * administrators first exchange a fresh Firebase token for a brief signed
 * playback URL, keeping private storage paths out of the rendered record.
 */
export function TalentVideo({ src, className, controls = true }: TalentVideoProps) {
  const { user, userStatus } = useAuth();
  const [privateSource, setPrivateSource] = useState<string | null>(null);
  const asset = internalVideoPattern.exec(src)?.[1];
  const needsPrivateFetch = Boolean(asset && user && (userStatus === "admin" || userStatus === "approved"));

  useEffect(() => {
    if (!asset || !needsPrivateFetch || !user) {
      setPrivateSource(null);
      return;
    }
    let active = true;
    void user.getIdToken(true).then(async (token) => {
      const response = await fetch(`/api/private/talent-video/${asset}`, { headers: { authorization: `Bearer ${token}` }, cache: "no-store" });
      const payload = await response.json().catch(() => null) as { url?: unknown } | null;
      if (!response.ok || typeof payload?.url !== "string" || !payload.url.startsWith("https://")) throw new Error("Private Talent video is unavailable.");
      if (active) setPrivateSource(payload.url);
    }).catch(() => active && setPrivateSource(null));
    return () => { active = false; };
  }, [asset, needsPrivateFetch, user]);

  if (needsPrivateFetch && !privateSource) {
    return <div role="status" className={`${className || ""} flex items-center justify-center bg-[#061D45] p-5 text-center text-xs font-semibold text-white/75`}>Loading protected Talent video…</div>;
  }

  return <video src={needsPrivateFetch ? privateSource || undefined : src} controls={controls} playsInline preload="metadata" controlsList="nodownload" className={className} />;
}
