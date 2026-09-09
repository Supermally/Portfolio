import React from "react";
import type { Line } from "@/lib/data/skills";
import { useSiteContent } from "@/lib/content/ContentProvider";

interface TransferBulletProps {
  lineIds: string[];
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function TransferBullet({
  lineIds,
  className = "",
  size = "md",
}: TransferBulletProps) {
  const { lines: LINES } = useSiteContent();
  const lineDetails = lineIds
    .map((id) => LINES.find((l) => l.id === id))
    .filter((l): l is Line => !!l);

  if (lineDetails.length === 0) return null;

  const sizeClasses = {
    sm: { pill: "h-5 px-1.5 gap-1", bullet: "w-3.5 h-3.5 text-[9px]" },
    md: { pill: "h-6 px-2 gap-1.5", bullet: "w-4.5 h-4.5 text-[10px]" },
    lg: { pill: "h-7 px-2.5 gap-1.5", bullet: "w-5.5 h-5.5 text-xs" },
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-full bg-zinc-950 shadow-xs border border-zinc-800 ${sizeClasses.pill} ${className}`}
    >
      {lineDetails.map((line) => (
        <span
          key={line.id}
          className={`rounded-full text-white font-sans font-black flex items-center justify-center flex-shrink-0 ${sizeClasses.bullet}`}
          style={{ backgroundColor: line.color }}
          title={line.label}
        >
          {line.bullet[0]}
        </span>
      ))}
    </div>
  );
}
