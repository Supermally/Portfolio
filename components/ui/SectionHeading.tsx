import React from "react";

interface SectionHeadingProps {
  code: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export function SectionHeading({
  code,
  title,
  subtitle,
  badge = "TRANSIT DIRECTORY",
}: SectionHeadingProps) {
  return (
    <div className="mb-10 border-b-2 border-zinc-900 pb-4">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-zinc-900 text-white rounded">
            {code}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            {badge}
          </span>
        </div>
        <span className="font-mono text-xs text-zinc-400 font-medium hidden sm:inline">
          ROUTE GUIDE // MAP SYSTEM
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight font-sans">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-zinc-600 max-w-xl font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
