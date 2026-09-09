"use client";

import React, { useState } from "react";
import { useSiteContent } from "@/lib/content/ContentProvider";
import { useSpatialCamera, SpatialMilestone } from "@/lib/hooks/useSpatialCamera";
import { Volume2 } from "lucide-react";

// MALACHI 7-letter Subway Bullet cluster
const MALACHI_BULLETS = [
  { letter: "M", bg: "#ff6319", text: "#ffffff" }, // Orange
  { letter: "A", bg: "#0039a6", text: "#ffffff" }, // Blue
  { letter: "L", bg: "#ee352e", text: "#ffffff" }, // Red
  { letter: "A", bg: "#00933c", text: "#ffffff" }, // Green
  { letter: "C", bg: "#fccc0a", text: "#18181b" }, // Yellow
  { letter: "H", bg: "#b933ad", text: "#ffffff" }, // Purple
  { letter: "I", bg: "#18181b", text: "#ffffff" }, // Dark Slate
];

export function Nav() {
  const { lines: LINES } = useSiteContent();
  const { activeSection, isScrolled, navigateTo, milestones } = useSpatialCamera();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAnnouncement = () => {
    setIsPlayingAudio(true);
    const audio = new Audio("/audio/now-arriving-at-grand-central.mp3");
    audio.play().catch(() => {});
    audio.onended = () => setIsPlayingAudio(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-[#faf8f5]/95 backdrop-blur-md border-b border-zinc-300/90 shadow-sm"
          : "bg-[#faf8f5]/80 backdrop-blur-sm border-b border-zinc-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / MALACHI 7-Letter Subway Bullet Cluster */}
        <div
          onClick={() => navigateTo("map-hero-unified")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="flex items-center -space-x-1">
            {MALACHI_BULLETS.map((b, idx) => (
              <span
                key={idx}
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs ring-1 ring-[#faf8f5] transition-transform group-hover:scale-105"
                style={{ backgroundColor: b.bg, color: b.text }}
              >
                {b.letter}
              </span>
            ))}
          </div>

          <div className="flex flex-col">
            <span className="font-sans font-black text-sm sm:text-base text-zinc-950 tracking-tight leading-none group-hover:text-zinc-700 transition-colors">
              GRAND CENTRAL
            </span>
            <span className="hidden sm:block font-mono text-[9px] text-zinc-500 font-bold tracking-wider uppercase mt-0.5">
              TRANSIT SCHEMATIC
            </span>
          </div>
        </div>

        {/* Section Anchors linked to Spatial Camera */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
          {milestones.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id as SpatialMilestone)}
                className={`relative px-2.5 sm:px-3 py-1.5 text-xs font-sans font-bold transition-all rounded-md cursor-pointer ${
                  isActive
                    ? "text-zinc-950 bg-zinc-200/90 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                <span className="hidden md:inline mr-1 text-zinc-400 font-mono text-[11px]">
                  {item.code}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-zinc-950 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Audio Announcement Replay & Subway Line Legend (Right) */}
        <div className="flex items-center gap-3">
          {/* Station Announcer Audio Button */}
          <button
            onClick={handlePlayAnnouncement}
            title="Play Station Arrival Announcement"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all border cursor-pointer ${
              isPlayingAudio
                ? "bg-[#ff6319] text-white border-[#ff6319] animate-pulse shadow-xs"
                : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ANNOUNCEMENT</span>
          </button>

          {/* Line Bullets */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-zinc-300">
            {LINES.map((line) => (
              <div
                key={line.id}
                className="flex items-center gap-1.5"
                title={line.label}
              >
                <span
                  className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-black"
                  style={{ backgroundColor: line.color }}
                >
                  {line.bullet[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
