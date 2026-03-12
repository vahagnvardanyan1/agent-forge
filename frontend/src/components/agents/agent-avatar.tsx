"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  seed: string;
  size?: number;
  className?: string;
}

export const AgentAvatar = ({ seed, size = 48, className }: AgentAvatarProps) => {
  const [error, setError] = useState(false);
  const initials = seed.slice(0, 2).toUpperCase();

  if (error) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-full bg-primary/20 text-primary font-bold", className)}
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={`https://api.dicebear.com/9.x/bottts/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&backgroundType=gradientLinear`}
      alt="Agent avatar"
      width={size}
      height={size}
      className={cn("rounded-full", className)}
      onError={() => setError(true)}
      unoptimized
    />
  );
};
