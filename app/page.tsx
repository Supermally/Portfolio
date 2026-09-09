"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Nav } from "@/components/ui/Nav";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { UnifiedTransitMap } from "@/components/map/UnifiedTransitMap";
import { ConcourseCorridor } from "@/components/spatial/ConcourseCorridor";
import { SpatialSection } from "@/components/spatial/SpatialSection";
import { SkillsLegend } from "@/components/sections/SkillsLegend";
import { Resume } from "@/components/sections/Resume";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  // Check if visitor has already seen the intro or is on direct link
  const [showSplash, setShowSplash] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const hasSeenIntro = localStorage.getItem("grand_central_intro_seen");
    const hasHash = window.location.hash.length > 1;

    // First-time visitors without a direct hash link see the splash intro
    if (!hasSeenIntro && !hasHash) {
      setShowSplash(true);
    }
  }, []);

  const handleEnterStation = () => {
    try {
      localStorage.setItem("grand_central_intro_seen", "true");
    } catch (e) {}
    setShowSplash(false);
  };

  const handleSkipIntro = () => {
    try {
      localStorage.setItem("grand_central_intro_seen", "true");
    } catch (e) {}
    setShowSplash(false);
  };

  const handleSelectStation = (stationId: string | null) => {
    setSelectedStationId(stationId);
  };

  const handleSelectLine = (lineId: string | null) => {
    setSelectedLineId(lineId);
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] text-zinc-900 font-sans overflow-x-hidden">
      {/* 0. Fullscreen Subway Entrance Splash Screen with Immediate Skip & Persistence */}
      <AnimatePresence>
        {mounted && showSplash && (
          <SplashScreen
            onEnter={handleEnterStation}
            onSkip={handleSkipIntro}
          />
        )}
      </AnimatePresence>

      <Nav />

      {/* 1. Master Continuous Canvas: Map, Spine, Concourse Threshold & EAP Displays (P0 -> P4) */}
      <UnifiedTransitMap
        selectedLineId={selectedLineId}
        selectedStationId={selectedStationId}
        onSelectStation={handleSelectStation}
        onSelectLine={handleSelectLine}
      />

      {/* Intermediary Corridor: Tracking Down & Right */}
      <ConcourseCorridor variant="departure-to-system" />

      {/* 2. System Guide (P5) — Arrives from down-right, departs up-right */}
      <SpatialSection
        id="skills"
        initialRotateX={0}
        initialRotateY={3}
        initialScale={0.98}
        initialTranslateX={40}
        initialTranslateY={25}
        exitTranslateX={30}
        exitTranslateY={-25}
        exitRotateY={2}
      >
        <SkillsLegend
          selectedLineId={selectedLineId}
          onSelectLine={handleSelectLine}
          onSelectStation={handleSelectStation}
        />
      </SpatialSection>

      {/* Intermediary Corridor: Tracking Down & Left */}
      <ConcourseCorridor variant="system-to-fare" />

      {/* 3. Fare Card / Resume (P6) — Arrives from down-left, departs up */}
      <SpatialSection
        id="resume"
        initialRotateX={-3}
        initialRotateY={-2}
        initialScale={0.96}
        initialTranslateX={-35}
        initialTranslateY={30}
        exitTranslateY={-25}
      >
        <Resume />
      </SpatialSection>

      {/* Intermediary Corridor: Approaching Station Exits */}
      <ConcourseCorridor variant="fare-to-exits" />

      {/* 4. Platform Exits / Contact (P7) — Settle stably at final destination */}
      <SpatialSection
        id="contact"
        initialRotateX={2.5}
        initialRotateY={0}
        initialScale={0.98}
        initialTranslateY={30}
        exitTranslateY={0}
      >
        <Contact />
      </SpatialSection>
    </main>
  );
}
