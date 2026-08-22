"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const internalPhotoPattern = /^\/api\/talent-photo\/([A-Za-z0-9_-]{8,80})$/;

type TalentPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
};

/**
 * The public branch uses the original same-origin image URL. Approved sponsors
 * and administrators fetch private Supabase-backed photo bytes through the
 * server with a fresh Firebase token, then display an in-memory object URL.
 */
export function TalentPhoto({ src, alt, className, fill = false, priority = false }: TalentPhotoProps) {
  const { user, userStatus } = useAuth();
  const [privateSource, setPrivateSource] = useState<string | null>(null);
  const asset = internalPhotoPattern.exec(src)?.[1];
  const needsPrivateFetch = Boolean(asset && user && (userStatus === "admin" || userStatus === "approved"));

  useEffect(() => {
    if (!asset || !needsPrivateFetch || !user) {
      setPrivateSource(null);
      return;
    }

    let active = true;
    let objectUrl = "";
    void user.getIdToken(true).then(async (token) => {
      const response = await fetch(`/api/private/talent-photo/${asset}`, { headers: { authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Private Talent photo is unavailable.");
      const blob = await response.blob();
      objectUrl = URL.createObjectURL(blob);
      if (active) setPrivateSource(objectUrl);
    }).catch(() => active && setPrivateSource(null));

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [asset, needsPrivateFetch, user]);

  if (needsPrivateFetch) {
    return <img src={privateSource || "/pwlif-logo.png"} alt={alt} className={`${fill ? "absolute inset-0 h-full w-full " : ""}${className || ""}`} />;
  }

  return <Image src={src} alt={alt} fill={fill} priority={priority} className={className} />;
}
