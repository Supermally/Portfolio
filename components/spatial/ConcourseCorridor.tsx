"use client";

import React from "react";
import { ArrowDownRight, ArrowDownLeft, ArrowDown } from "lucide-react";

interface ConcourseCorridorProps {
  variant: "departure-to-system" | "system-to-fare" | "fare-to-exits";
}

export function ConcourseCorridor({ variant }: ConcourseCorridorProps) {
  if (variant === "departure-to-system") {
    return (
      <div className="w-full py-8 bg-[#121214] border-y border-zinc-800 relative overflow-hidden select-none">
        {/* Continuous Track Conduit: Flowing Down & Right */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-amber-400 flex items-center justify-center text-xs">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
            <div className="font-mono text-xs text-zinc-400 tracking-wider">
              <span className="text-zinc-500">CORRIDOR 01-B // </span>
              <span className="text-zinc-300 font-bold uppercase">TRACKING TOWARD SYSTEM ROUTE DIRECTORY</span>
            </div>
          </div>

          {/* 3 Physical Embedded Track Lines */}
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff6319]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#0039a6]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ee352e]" />
            </div>
            <div className="w-32 sm:w-48 h-1 bg-gradient-to-r from-[#ff6319] via-[#0039a6] to-[#ee352e] rounded-full opacity-60" />
            <span className="font-mono text-[10px] text-zinc-500 hidden sm:inline">EAST WING CONCOURSE</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "system-to-fare") {
    return (
      <div className="w-full py-8 bg-[#faf8f5] border-y border-zinc-300 relative overflow-hidden select-none">
        {/* Continuous Track Conduit: Flowing Down & Left */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-zinc-200 border border-zinc-300 text-zinc-900 flex items-center justify-center text-xs">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
            <div className="font-mono text-xs text-zinc-600 tracking-wider">
              <span className="text-zinc-400">CORRIDOR 02-A // </span>
              <span className="text-zinc-900 font-bold uppercase">TRACKING TOWARD FARE INFORMATION BULLETIN</span>
            </div>
          </div>

          {/* Physical Subway Conduit Ribbon */}
          <div className="flex items-center gap-3">
            <div className="w-32 sm:w-48 h-1 bg-gradient-to-r from-[#ee352e] via-[#fccc0a] to-[#ff6319] rounded-full opacity-70" />
            <span className="font-mono text-[10px] text-zinc-500 font-semibold hidden sm:inline">WEST WALL PASSAGE</span>
          </div>
        </div>
      </div>
    );
  }

  // variant === "fare-to-exits"
  return (
    <div className="w-full py-8 bg-[#f4efe6]/80 border-y border-zinc-300 relative overflow-hidden select-none">
      {/* Continuous Track Conduit: Flowing Down to Platform Exits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-zinc-950 text-[#00933c] flex items-center justify-center text-xs shadow-xs">
            <ArrowDown className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="font-mono text-xs text-zinc-700 tracking-wider">
            <span className="text-zinc-400">EXIT CORRIDOR // </span>
            <span className="text-zinc-950 font-bold uppercase">APPROACHING PLATFORM EXITS &amp; DISPATCH</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-600">
          <span className="px-2 py-0.5 rounded bg-zinc-200 border border-zinc-300 font-bold">
            PLATFORMS A &amp; B AHEAD
          </span>
          <span className="text-emerald-600 font-bold hidden sm:inline">WAYFINDING CLEAR</span>
        </div>
      </div>
    </div>
  );
}
