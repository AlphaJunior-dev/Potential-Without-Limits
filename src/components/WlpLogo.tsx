import React from "react";
import Image from "next/image";

interface WlpLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
  frameColor?: string;
  dark?: boolean;
}

export function PwlifLogoMark({ className = "h-12 w-auto" }: { className?: string; frameColor?: string; dark?: boolean }) {
  return (
    <img
      src="/pwlif-logo.png"
      alt="Potential Without Limits International Foundation"
      className={`${className} object-contain`}
    />
  );
}

export function WlpLogoMark(props: { className?: string; frameColor?: string; dark?: boolean }) {
  return <PwlifLogoMark {...props} />;
}

export function PwlifLogo({
  className = "h-16 w-auto",
}: WlpLogoProps) {
  return (
    <div className="flex items-center gap-3 select-none cursor-pointer">
      <img
        src="/pwlif-logo.png"
        alt="Potential Without Limits International Foundation"
        className={`${className} object-contain`}
      />
    </div>
  );
}

export function WlpLogo(props: WlpLogoProps) {
  return <PwlifLogo {...props} />;
}
