"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Station } from "@/lib/data/projects";
import type { Waypoint } from "@/lib/data/certifications";
import { useSiteContent } from "@/lib/content/ContentProvider";
import { TransferBullet } from "./TransferBullet";
import { CurrentStatus } from "@/components/status/CurrentStatus";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import {
  X,
  ExternalLink,
  Github,
  FileText,
  Award,
  Cpu,
  Compass,
  ArrowDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UnifiedTransitMapProps {
  selectedLineId?: string | null;
  selectedStationId?: string | null;
  onSelectStation?: (stationId: string | null) => void;
  onSelectLine?: (lineId: string | null) => void;
}

export function UnifiedTransitMap({
  selectedLineId = null,
  selectedStationId = null,
  onSelectStation,
  onSelectLine,
}: UnifiedTransitMapProps) {
  const { stations: STATIONS, lines: LINES, waypoints: WAYPOINTS } = useSiteContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapSvgGroupRef = useRef<SVGGElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const mapFurnitureRef = useRef<HTMLDivElement>(null);
  const secondaryStationsRef = useRef<SVGGElement>(null);
  const letterSpineRef = useRef<SVGGElement>(null);
  const categoryLabelsRef = useRef<SVGGElement>(null);

  // SVG Path references for continuous math
  const eePathRef = useRef<SVGPathElement>(null);
  const aeroPathRef = useRef<SVGPathElement>(null);
  const polisciPathRef = useRef<SVGPathElement>(null);

  // Train animation state refs
  const eeTrainRef = useRef<SVGGElement>(null);
  const aeroTrainRef = useRef<SVGGElement>(null);
  const polisciTrainRef = useRef<SVGGElement>(null);

  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isZoomedOut, setIsZoomedOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [activeModalStation, setActiveModalStation] = useState<Station | null>(null);
  const [hoveredStation, setHoveredStation] = useState<{
    station: Station;
    pos: { x: number; y: number };
  } | null>(null);

  // Client-side mount & mobile detection
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync selectedStationId with modal
  useEffect(() => {
    if (selectedStationId) {
      const station = STATIONS.find((s) => s.id === selectedStationId);
      if (station) {
        setActiveModalStation(station);
      }
    }
  }, [selectedStationId, STATIONS]);

  // Master Spatial Camera: Smooth Scroll Zoom Parallax & Spine Descent
  useEffect(() => {
    if (prefersReducedMotion || isMobile) {
      setIsZoomedOut(true);
      return;
    }

    const containerEl = containerRef.current;
    const mapGroup = mapSvgGroupRef.current;
    const textOverlay = textOverlayRef.current;
    const secondaryStations = secondaryStationsRef.current;
    const letterSpine = letterSpineRef.current;
    const categoryLabels = categoryLabelsRef.current;

    if (!containerEl || !mapGroup) return;

    // Grand Central Hub is at (500, 260)
    const initialScale = 2.2;
    const initialTx = 640 - 500 * initialScale;
    const initialTy = 320 - 260 * initialScale;

    gsap.set(mapGroup, {
      scale: initialScale,
      x: initialTx,
      y: initialTy,
      transformOrigin: "0 0",
    });

    if (secondaryStations) gsap.set(secondaryStations, { opacity: 0 });
    if (letterSpine) gsap.set(letterSpine, { opacity: 0.3 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerEl,
          start: "top top",
          end: "+=65%",
          scrub: 0.5,
          onUpdate: (self) => {
            setIsZoomedOut(self.progress > 0.7);
          },
        },
      });

      // 1. Text Overlay fades out smoothly
      if (textOverlay) {
        tl.to(
          textOverlay,
          {
            opacity: 0,
            y: -30,
            ease: "power1.out",
            duration: 0.25,
            pointerEvents: "none",
          },
          0
        );
      }

      // 2. Map Group zooms out to 1.0x centered
      tl.to(
        mapGroup,
        {
          scale: 1.0,
          x: 0,
          y: 0,
          ease: "power2.out",
          duration: 1.0,
        },
        0
      );

      // 3. MALACHI letter-spine fades in
      if (letterSpine) {
        tl.to(
          letterSpine,
          {
            opacity: 0.9,
            ease: "power1.inOut",
            duration: 0.6,
          },
          0.2
        );
      }

      // 4. Secondary stations fade in
      if (secondaryStations) {
        tl.to(
          secondaryStations,
          {
            opacity: 1,
            ease: "power1.in",
            duration: 0.5,
          },
          0.3
        );
      }

      // 5. Category watermarks parallax drift
      if (categoryLabels) {
        tl.to(
          categoryLabels,
          {
            y: 30,
            ease: "none",
            duration: 1.0,
          },
          0
        );
      }
    }, containerEl);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion, isMobile]);

  // Train Engine (Continuous unbroken pathing & accurate station dwells on tight 10px pitch paths)
  useEffect(() => {
    if (prefersReducedMotion) return;

    let animId: number;
    let lastTime = performance.now();

    const speed = 140;
    const dwellDuration = 1.4;

    const trains = [
      {
        pathRef: eePathRef,
        groupRef: eeTrainRef,
        distance: 0,
        dwellTimer: 0,
        // Exact calculated arc length milestones:
        // Grand Central Hub (160), Smart Controller (900), Flight Sensor (1760), SDR Signal (2740)
        stationDistances: [160, 900, 1760, 2740],
        visitedStation: -1,
      },
      {
        pathRef: aeroPathRef,
        groupRef: aeroTrainRef,
        distance: 140,
        dwellTimer: 0,
        // Grand Central Hub (160), Rocket Simulation (1190), Flight Sensor (1780), Mini-Satellite (2610)
        stationDistances: [160, 1190, 1780, 2610],
        visitedStation: -1,
      },
      {
        pathRef: polisciPathRef,
        groupRef: polisciTrainRef,
        distance: 280,
        dwellTimer: 0,
        // Grand Central Hub (160), Tech Export Rules (1850)
        stationDistances: [160, 1850],
        visitedStation: -1,
      },
    ];

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      trains.forEach((train) => {
        const path = train.pathRef.current;
        const group = train.groupRef.current;
        if (!path || !group) return;

        const totalLength = path.getTotalLength();
        if (totalLength <= 0) return;

        if (train.dwellTimer > 0) {
          train.dwellTimer -= dt;
        } else {
          train.distance = (train.distance + speed * dt) % totalLength;

          for (let i = 0; i < train.stationDistances.length; i++) {
            const sDist = train.stationDistances[i];
            if (
              Math.abs(train.distance - sDist) < 14 &&
              train.visitedStation !== i
            ) {
              train.distance = sDist; // Snap dead center to station marker
              train.dwellTimer = dwellDuration;
              train.visitedStation = i;
              break;
            }
            if (Math.abs(train.distance - sDist) > 28 && train.visitedStation === i) {
              train.visitedStation = -1;
            }
          }
        }

        const curDist = Math.max(0, Math.min(train.distance, totalLength));
        const deltaDist = Math.min(curDist + 3, totalLength);
        const p1 = path.getPointAtLength(curDist);
        const p2 = path.getPointAtLength(deltaDist);

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        group.setAttribute(
          "transform",
          `translate(${p1.x}, ${p1.y}) rotate(${angle})`
        );
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  const closeModal = () => {
    setActiveModalStation(null);
    if (onSelectStation) onSelectStation(null);
  };

  const getStationWaypoints = (stationId: string): Waypoint[] => {
    return WAYPOINTS.filter((w) => w.stationId === stationId);
  };

  const handleStationClick = (station: Station) => {
    setActiveModalStation(station);
    if (onSelectStation) onSelectStation(station.id);
  };

  // =========================================================================
  // TIGHT INTERLINED 10PX PITCH TRACK GEOMETRY (Pure 90° & Uniform 10px Pitch)
  // =========================================================================

  // 1. EE Line (Orange #ff6319) - Center x=490, Left Concourse x=100, Bottom Raceway y=3360
  const eePathD =
    "M 490 100 L 490 540 L 270 540 L 270 1340 L 490 1340 L 490 1420 L 490 1720 L 270 1720 L 270 2520 L 100 2520 L 100 3360 L 1000 3360";

  // 2. Aero Line (Blue #0039a6) - Center x=500, Left Concourse x=110, Bottom Raceway y=3350
  const aeroPathD =
    "M 500 100 L 500 620 L 730 620 L 730 1340 L 500 1340 L 500 1420 L 500 1660 L 730 1660 L 730 2560 L 110 2560 L 110 3350 L 1000 3350";

  // 3. Policy Line (Red #ee352e) - Center x=510, Left Concourse x=120, Bottom Raceway y=3340
  const polisciPathD =
    "M 510 100 L 510 460 L 260 460 L 260 2600 L 120 2600 L 120 3340 L 1000 3340";

  return (
    <section
      ref={containerRef}
      id="map-hero-unified"
      className="relative w-full min-h-screen drafting-grid-full bg-[#faf8f5] overflow-hidden select-none"
    >
      {/* Top Map Furniture (Filter Buttons & Symbology) */}
      <div
        ref={mapFurnitureRef}
        className={`absolute top-16 left-0 right-0 z-30 px-4 sm:px-8 transition-opacity duration-300 ${
          isMobile || prefersReducedMotion ? "opacity-100" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 bg-[#faf8f5]/95 backdrop-blur-md p-3.5 rounded-2xl border border-zinc-300 shadow-sm">
          {/* Route Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs font-bold text-zinc-500 uppercase tracking-wide mr-1 hidden sm:inline">
              Filter Route:
            </span>
            <button
              onClick={() => {
                if (onSelectLine) onSelectLine(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-sans font-bold rounded-full transition-all border ${
                selectedLineId === null
                  ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                  : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              ALL ROUTES
            </button>

            {LINES.map((line) => {
              const isSelected = selectedLineId === line.id;
              return (
                <button
                  key={line.id}
                  onClick={() => {
                    if (onSelectLine) onSelectLine(isSelected ? null : line.id);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-sans font-bold rounded-full transition-all border ${
                    isSelected
                      ? "bg-white text-zinc-950 border-zinc-900 ring-2 ring-zinc-900 shadow-xs"
                      : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                    style={{ backgroundColor: line.color }}
                  >
                    {line.bullet[0]}
                  </span>
                  <span>{line.label}</span>
                  {line.underConstruction && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#0039a6] text-[9px] font-mono font-bold tracking-tight">
                      Coming Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Symbology Indicators (MTA Official Map Style) */}
          <div className="flex items-center gap-4 font-sans text-xs text-zinc-600 font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-3 rounded-full border-2 border-zinc-900 bg-white" />
              <span>Transfer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-zinc-900 bg-white" />
              <span>Local</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-0 border-t-2 border-dashed border-[#0039a6]" />
              <span className="text-[#0039a6]">Under Construction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Text Overlay (Clear, Friendly, Accessible Language) */}
      <div
        ref={textOverlayRef}
        className={`absolute inset-0 z-20 pointer-events-auto flex flex-col justify-center pl-8 sm:pl-16 lg:pl-24 max-w-xl transition-all ${
          isMobile || prefersReducedMotion ? "hidden" : ""
        }`}
      >
        <div className="space-y-4 pr-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 text-white font-sans text-xs font-extrabold tracking-wider uppercase shadow-xs">
            <span>GRAND CENTRAL HUB</span>
            <span className="text-[#ff6319]">•</span>
            <span className="text-zinc-300 font-medium">MAIN STATION</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-zinc-950 tracking-tight leading-[1.0] font-sans">
            Grand Central
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-700 font-editorial italic font-medium">
            An engineering portfolio designed like a transit system.
          </p>

          <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-sans font-normal pt-1">
            Explore projects across <strong className="text-[#ff6319] font-extrabold">Computers &amp; Circuits</strong>,{" "}
            <strong className="text-[#0039a6] font-extrabold">Rockets &amp; Aerospace</strong>, and{" "}
            <strong className="text-[#ee352e] font-extrabold">Tech Policy &amp; Rules</strong>.
          </p>

          {/* Prompt to Scroll */}
          <div className="pt-6">
            <div className="inline-flex items-center gap-2.5 text-xs font-extrabold text-zinc-900 bg-white/95 backdrop-blur-xs px-4 py-2.5 rounded-full border border-zinc-300 shadow-sm animate-bounce">
              <Compass className="w-4 h-4 text-[#ff6319]" />
              <span>SCROLL TO EXPLORE STATIONS</span>
              <ArrowDown className="w-4 h-4 text-zinc-500" />
            </div>
          </div>
        </div>
      </div>

      {/* The Single Continuous Vertical SVG Transit Map (ViewBox 0 0 1000 3500) */}
      <div className="w-full flex items-center justify-center relative">
        <svg
          viewBox="0 0 1000 3500"
          className="w-full h-auto max-w-[1000px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <g ref={mapSvgGroupRef} id="unified-vertical-map-group">
            {/* Background Layer: Regional Watermarks (Plain English, Clean & Unobstructed) */}
            <g id="layer-background">
              <g ref={categoryLabelsRef} id="category-watermarks">
                <text
                  x="60"
                  y="380"
                  className="font-sans font-black text-2xl fill-zinc-400/35 tracking-widest uppercase"
                >
                  COMPUTERS &amp; CIRCUITS
                </text>
                <text
                  x="940"
                  y="880"
                  textAnchor="end"
                  className="font-sans font-black text-2xl fill-zinc-400/35 tracking-widest uppercase"
                >
                  ROCKETS &amp; AEROSPACE
                </text>
                <text
                  x="60"
                  y="1900"
                  className="font-sans font-black text-2xl fill-zinc-400/35 tracking-widest uppercase"
                >
                  TECH POLICY &amp; RULES
                </text>
              </g>
            </g>

            {/* Midground Layer: MALACHI Letter-Spine & Tight Track Bundles */}
            <g id="layer-midground">
              {/* MALACHI Letter-Spine (Centered in x: 380 to 620, zero track overlap) */}
              <g
                ref={letterSpineRef}
                id="malachi-letter-spine"
                stroke="#d8d1c5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.9"
              >
                {/* Letter 'M' (y: 160 to 380) */}
                <path d="M 380 380 L 380 160 L 500 280 L 620 160 L 620 380" />

                {/* Letter 'A' (y: 500 to 740) */}
                <path d="M 380 740 L 380 620 L 500 500 L 620 620 L 620 740" />
                <path d="M 420 640 L 580 640" />

                {/* Letter 'L' (y: 860 to 1100) */}
                <path d="M 420 860 L 420 1100 L 620 1100" />

                {/* Letter 'A' (y: 1220 to 1460) */}
                <path d="M 380 1460 L 380 1340 L 500 1220 L 620 1340 L 620 1460" />
                <path d="M 420 1360 L 580 1360" />

                {/* Letter 'C' (y: 1580 to 1820) */}
                <path d="M 620 1580 L 460 1580 L 380 1660 L 380 1740 L 460 1820 L 620 1820" />

                {/* Letter 'H' (y: 1940 to 2180) */}
                <path d="M 380 1940 L 380 2180" />
                <path d="M 620 1940 L 620 2180" />
                <path d="M 380 2060 L 620 2060" />

                {/* Letter 'I' (y: 2300 to 2540) */}
                <path d="M 420 2300 L 580 2300" />
                <path d="M 500 2300 L 500 2540" />
                <path d="M 420 2540 L 580 2540" />
              </g>

              {/* Shared White Casing for Tight Interlined Tracks */}
              <g id="tracks-white-casing" stroke="#faf8f5" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d={eePathD} />
                <path d={aeroPathD} />
                <path d={polisciPathD} />
              </g>

              {/* 1. Computer Systems / EE Line (Orange #ff6319) */}
              <g
                id="route-ee"
                opacity={selectedLineId && selectedLineId !== "ee-line" ? 0.2 : 1}
                className="transition-opacity duration-200"
              >
                <path
                  ref={eePathRef}
                  d={eePathD}
                  fill="none"
                  stroke="#ff6319"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* 2. Aerospace Dynamics Line (Blue #0039a6 - Under Construction Dashed Line) */}
              <g
                id="route-aero"
                opacity={selectedLineId && selectedLineId !== "aero-line" ? 0.2 : 0.75}
                className="transition-opacity duration-200"
              >
                <path
                  ref={aeroPathRef}
                  d={aeroPathD}
                  fill="none"
                  stroke="#0039a6"
                  strokeWidth="9"
                  strokeDasharray="14 10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Trailing Open-Ended Extension Label */}
                <g transform="translate(130, 2570)">
                  <rect
                    x="0"
                    y="0"
                    width="320"
                    height="24"
                    rx="6"
                    fill="#0039a6"
                    fillOpacity="0.12"
                    stroke="#0039a6"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                  />
                  <text
                    x="160"
                    y="16"
                    textAnchor="middle"
                    className="font-mono font-bold text-[10px] fill-[#0039a6] tracking-wider uppercase"
                  >
                    AEROSPACE EXTENSION // UNDER CONSTRUCTION
                  </text>
                </g>
              </g>

              {/* 3. Systems Policy Line (Red #ee352e) */}
              <g
                id="route-polisci"
                opacity={selectedLineId && selectedLineId !== "polisci-line" ? 0.2 : 1}
                className="transition-opacity duration-200"
              >
                <path
                  ref={polisciPathRef}
                  d={polisciPathD}
                  fill="none"
                  stroke="#ee352e"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Directional Capsule Trains */}
              {!prefersReducedMotion && (
                <g id="directional-capsule-trains">
                  {/* EE Train Capsule (White fill, Orange outline, Orange leading chevron) */}
                  <g ref={eeTrainRef}>
                    <rect
                      x="-9"
                      y="-4"
                      width="18"
                      height="8"
                      rx="4"
                      fill="#ffffff"
                      stroke="#ff6319"
                      strokeWidth="2"
                    />
                    <polygon points="5,-2.5 8,0 5,2.5" fill="#ff6319" />
                  </g>

                  {/* Aero Train Capsule (Dashed outline work-train) */}
                  <g ref={aeroTrainRef}>
                    <rect
                      x="-9"
                      y="-4"
                      width="18"
                      height="8"
                      rx="4"
                      fill="#ffffff"
                      stroke="#0039a6"
                      strokeWidth="2"
                      strokeDasharray="3 2"
                    />
                    <polygon points="5,-2.5 8,0 5,2.5" fill="#0039a6" />
                  </g>

                  {/* Policy Train Capsule (White fill, Red outline, Red leading chevron) */}
                  <g ref={polisciTrainRef}>
                    <rect
                      x="-9"
                      y="-4"
                      width="18"
                      height="8"
                      rx="4"
                      fill="#ffffff"
                      stroke="#ee352e"
                      strokeWidth="2"
                    />
                    <polygon points="5,-2.5 8,0 5,2.5" fill="#ee352e" />
                  </g>
                </g>
              )}
            </g>

            {/* Foreground Station Markers Layer (Official MTA Subway Map Symbology) */}
            <g id="layer-foreground-stations">
              {/* Grand Central Hub (Official MTA Transfer Barbell Capsule across 3 lines) */}
              <g
                id="grand-central-terminal-hub"
                transform="translate(500, 260)"
                className="cursor-pointer group focus:outline-hidden focus-visible:ring-4 focus-visible:ring-zinc-950"
                role="button"
                tabIndex={0}
                aria-label="Grand Central Hub station, Main 3-Line Interchange, Systems Origin"
                onClick={() => handleStationClick(STATIONS[0])}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleStationClick(STATIONS[0]);
                  }
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredStation({
                    station: STATIONS[0],
                    pos: { x: rect.left + rect.width / 2, y: rect.top },
                  });
                }}
                onMouseLeave={() => setHoveredStation(null)}
              >
                {/* Fixed Station Pulse Outline */}
                <rect
                  x="-27"
                  y="-14"
                  width="54"
                  height="28"
                  rx="14"
                  fill="none"
                  stroke="#ff6319"
                  strokeWidth="2.5"
                  className="train-pulse"
                  aria-hidden="true"
                />

                {/* MTA Official Transfer Barbell Pill (Default Always-Visible Symbol) */}
                <rect
                  x="-24"
                  y="-11"
                  width="48"
                  height="22"
                  rx="11"
                  fill="#ffffff"
                  stroke="#000000"
                  strokeWidth="2.5"
                  className="shadow-sm"
                />

                {/* 3 Track Transfer Connection Dots inside Barbell */}
                <circle cx="-10" cy="0" r="4" fill="#000000" />
                <circle cx="0" cy="0" r="4" fill="#000000" />
                <circle cx="10" cy="0" r="4" fill="#000000" />

                {/* Station Bullets Badge (Hover/Selection-Triggered Detail) */}
                <g
                  transform="translate(-37, -36)"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  aria-hidden="true"
                >
                  <rect
                    x="0"
                    y="0"
                    width="74"
                    height="20"
                    rx="10"
                    fill="#18181b"
                    className="shadow-md"
                  />
                  <circle cx="12" cy="10" r="6" fill="#ff6319" />
                  <text
                    x="12"
                    y="13"
                    textAnchor="middle"
                    className="font-sans font-black text-[9px] fill-white"
                  >
                    E
                  </text>
                  <circle cx="37" cy="10" r="6" fill="#0039a6" />
                  <text
                    x="37"
                    y="13"
                    textAnchor="middle"
                    className="font-sans font-black text-[9px] fill-white"
                  >
                    A
                  </text>
                  <circle cx="62" cy="10" r="6" fill="#ee352e" />
                  <text
                    x="62"
                    y="13"
                    textAnchor="middle"
                    className="font-sans font-black text-[9px] fill-white"
                  >
                    P
                  </text>
                </g>

                <text
                  x="0"
                  y="36"
                  textAnchor="middle"
                  className="font-sans font-black text-sm fill-zinc-950 select-none group-hover:fill-[#ff6319] transition-colors"
                >
                  {STATIONS[0]?.title || "Grand Central Hub"}
                </text>
                <text
                  x="0"
                  y="50"
                  textAnchor="middle"
                  className="font-mono text-xs fill-zinc-500 font-bold"
                >
                  [{STATIONS[0]?.date || "Main 3-Line Interchange"}]
                </text>
              </g>

              {/* Secondary Stations Layer */}
              <g ref={secondaryStationsRef} id="secondary-stations-layer">
                {/* 1. Porta — Windows App Compatibility Runner (x=270, y=780 - Stop 1 on EE Line) */}
                <g
                  transform="translate(270, 780)"
                  className="cursor-pointer group focus:outline-hidden focus-visible:ring-4 focus-visible:ring-zinc-950"
                  role="button"
                  tabIndex={0}
                  aria-label="Porta — Windows App Compatibility Runner station, Computer Systems line, Active Work in Progress"
                  onClick={() => handleStationClick(STATIONS[1])}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleStationClick(STATIONS[1]);
                    }
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredStation({
                      station: STATIONS[1],
                      pos: { x: rect.left + rect.width / 2, y: rect.top },
                    });
                  }}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  {/* Fixed Station Pulse Outline */}
                  <rect
                    x="-20"
                    y="-13"
                    width="40"
                    height="26"
                    rx="13"
                    fill="none"
                    stroke="#ff6319"
                    strokeWidth="2.5"
                    className="train-pulse"
                    aria-hidden="true"
                  />

                  {/* Active Station Capsule */}
                  <rect
                    x="-17"
                    y="-10"
                    width="34"
                    height="20"
                    rx="10"
                    fill="#ffffff"
                    stroke="#ff6319"
                    strokeWidth="2.5"
                    className="shadow-sm"
                  />
                  <circle cx="0" cy="0" r="4.5" fill="#ff6319" />

                  {/* Bullet Badge (Hover/Selection-Triggered Detail) */}
                  <g
                    transform="translate(24, -20)"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    aria-hidden="true"
                  >
                    <rect x="0" y="0" width="30" height="18" rx="9" fill="#18181b" className="shadow-md" />
                    <circle cx="15" cy="9" r="5.5" fill="#ff6319" />
                    <text
                      x="15"
                      y="12"
                      textAnchor="middle"
                      className="font-sans font-black text-[8px] fill-white"
                    >
                      E
                    </text>
                  </g>

                  <text
                    x="24"
                    y="12"
                    className="font-sans font-extrabold text-xs fill-zinc-950 group-hover:fill-[#ff6319] transition-colors"
                  >
                    {STATIONS[1]?.title || "Porta — Windows App Compatibility Runner"}
                  </text>
                  <text x="24" y="26" className="font-mono text-[11px] text-amber-700 font-bold">
                    [{STATIONS[1]?.date || "STOP 01 • ACTIVE WORK"}]
                  </text>
                </g>

                {/* 2. Aerospace Project Idea #1 (x=730, y=1060 - Stop 1 on Aero Line) */}
                <g
                  transform="translate(730, 1060)"
                  className="cursor-pointer group focus:outline-hidden focus-visible:ring-4 focus-visible:ring-zinc-950"
                  role="button"
                  tabIndex={0}
                  aria-label="Aerospace Project Idea #1 station, Aerospace line, Under Construction"
                  onClick={() => handleStationClick(STATIONS[2])}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleStationClick(STATIONS[2]);
                    }
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredStation({
                      station: STATIONS[2],
                      pos: { x: rect.left + rect.width / 2, y: rect.top },
                    });
                  }}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  <circle cx="0" cy="0" r="9" fill="none" stroke="#0039a6" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#0039a6" strokeWidth="2" />
                  <text
                    x="-16"
                    y="4"
                    textAnchor="end"
                    className="font-sans font-extrabold text-xs fill-zinc-950 group-hover:fill-[#0039a6] transition-colors"
                  >
                    {STATIONS[2]?.title || "Aerospace Project Idea #1"}
                  </text>
                  <text
                    x="-16"
                    y="18"
                    textAnchor="end"
                    className="font-mono text-[11px] fill-blue-700 font-bold"
                  >
                    [{STATIONS[2]?.date || "UNDER CONSTRUCTION"}]
                  </text>
                </g>

                {/* 3. Engineering Project Idea #1 (x=495, y=1420 - Stop 2 on EE Line) */}
                <g
                  transform="translate(495, 1420)"
                  className="cursor-pointer group focus:outline-hidden focus-visible:ring-4 focus-visible:ring-zinc-950"
                  role="button"
                  tabIndex={0}
                  aria-label="Engineering Project Idea #1 station, Computer Systems line, Under Construction"
                  onClick={() => handleStationClick(STATIONS[3])}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleStationClick(STATIONS[3]);
                    }
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredStation({
                      station: STATIONS[3],
                      pos: { x: rect.left + rect.width / 2, y: rect.top },
                    });
                  }}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  <circle cx="0" cy="0" r="8" fill="none" stroke="#ff6319" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="0" cy="0" r="5" fill="#ffffff" stroke="#ff6319" strokeWidth="2" />

                  <text
                    x="20"
                    y="4"
                    className="font-sans font-extrabold text-xs fill-zinc-950 group-hover:fill-[#ff6319] transition-colors"
                  >
                    {STATIONS[3]?.title || "Engineering Project Idea #1"}
                  </text>
                  <text x="20" y="18" className="font-mono text-[11px] text-amber-700 font-semibold">
                    [{STATIONS[3]?.date || "UNDER CONSTRUCTION"}]
                  </text>
                </g>

                {/* 4. Ideology Test & Political Compass (x=260, y=1700 - Stop 1 on POL Line) */}
                <g
                  transform="translate(260, 1700)"
                  className="cursor-pointer group focus:outline-hidden focus-visible:ring-4 focus-visible:ring-zinc-950"
                  role="button"
                  tabIndex={0}
                  aria-label="Ideology Test and Political Compass station, Policy Modeling line, In Development"
                  onClick={() => handleStationClick(STATIONS[4])}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleStationClick(STATIONS[4]);
                    }
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredStation({
                      station: STATIONS[4],
                      pos: { x: rect.left + rect.width / 2, y: rect.top },
                    });
                  }}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  <circle cx="0" cy="0" r="6.5" fill="#ffffff" stroke="#ee352e" strokeWidth="2.5" />
                  <text
                    x="16"
                    y="4"
                    className="font-sans font-extrabold text-xs fill-zinc-950 group-hover:fill-[#ee352e] transition-colors"
                  >
                    {STATIONS[4]?.title || "Ideology Test & Political Compass"}
                  </text>
                  <text x="16" y="18" className="font-mono text-[11px] fill-amber-700 font-semibold">
                    [{STATIONS[4]?.date || "STOP 01 • PRE-BUILD MODEL"}]
                  </text>
                </g>

                {/* 5. Policy Project Idea #1 (x=730, y=2020 - Stop 2 on POL Line) */}
                <g
                  transform="translate(730, 2020)"
                  className="cursor-pointer group focus:outline-hidden focus-visible:ring-4 focus-visible:ring-zinc-950"
                  role="button"
                  tabIndex={0}
                  aria-label="Policy Project Idea #1 station, Policy Modeling line, Under Construction"
                  onClick={() => handleStationClick(STATIONS[5])}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleStationClick(STATIONS[5]);
                    }
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredStation({
                      station: STATIONS[5],
                      pos: { x: rect.left + rect.width / 2, y: rect.top },
                    });
                  }}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  <circle cx="0" cy="0" r="8" fill="none" stroke="#ee352e" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="0" cy="0" r="5" fill="#ffffff" stroke="#ee352e" strokeWidth="2" />

                  <text
                    x="18"
                    y="4"
                    className="font-sans font-extrabold text-xs fill-zinc-950 group-hover:fill-[#ee352e] transition-colors"
                  >
                    {STATIONS[5]?.title || "Policy Project Idea #1"}
                  </text>
                  <text x="18" y="18" className="font-mono text-[11px] fill-amber-700 font-semibold">
                    [{STATIONS[5]?.date || "UNDER CONSTRUCTION"}]
                  </text>
                </g>

                {/* 6. Engineering Project Idea #2 (x=270, y=2180 - Stop 3 on EE Line) */}
                <g
                  transform="translate(270, 2180)"
                  className="cursor-pointer group focus:outline-hidden focus-visible:ring-4 focus-visible:ring-zinc-950"
                  role="button"
                  tabIndex={0}
                  aria-label="Engineering Project Idea #2 station, Computer Systems line, Under Construction"
                  onClick={() => handleStationClick(STATIONS[6])}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleStationClick(STATIONS[6]);
                    }
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredStation({
                      station: STATIONS[6],
                      pos: { x: rect.left + rect.width / 2, y: rect.top },
                    });
                  }}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  <circle cx="0" cy="0" r="8" fill="none" stroke="#ff6319" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="0" cy="0" r="5" fill="#ffffff" stroke="#ff6319" strokeWidth="2" />
                  <text
                    x="16"
                    y="4"
                    className="font-sans font-extrabold text-xs fill-zinc-950 group-hover:fill-[#ff6319] transition-colors"
                  >
                    {STATIONS[6]?.title || "Engineering Project Idea #2"}
                  </text>
                  <text x="16" y="18" className="font-mono text-[11px] fill-amber-700 font-semibold">
                    [{STATIONS[6]?.date || "UNDER CONSTRUCTION"}]
                  </text>
                </g>
              </g>
            </g>

            {/* Authentic NYC Subway Porcelain Enamel Hanging Sign (y: 2580 to 2664) */}
            <g id="concourse-lintel-beam" transform="translate(0, 2580)">
              {/* Ceiling Steel Suspension Rods */}
              <line x1="120" y1="-30" x2="120" y2="0" stroke="#71717a" strokeWidth="3.5" />
              <line x1="880" y1="-30" x2="880" y2="0" stroke="#71717a" strokeWidth="3.5" />
              <rect x="110" y="-4" width="20" height="6" rx="1.5" fill="#3f3f46" />
              <rect x="870" y="-4" width="20" height="6" rx="1.5" fill="#3f3f46" />

              {/* Porcelain Enamel Sign Chassis */}
              <rect
                x="60"
                y="0"
                width="880"
                height="84"
                rx="8"
                fill="#18181b"
                stroke="#27272a"
                strokeWidth="2"
                className="shadow-2xl"
              />

              {/* White Top Enamel Highlight Line */}
              <line x1="68" y1="2" x2="932" y2="2" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

              {/* Corner Mounting Screws */}
              <circle cx="76" cy="14" r="2.5" fill="#71717a" />
              <circle cx="924" cy="14" r="2.5" fill="#71717a" />
              <circle cx="76" cy="70" r="2.5" fill="#71717a" />
              <circle cx="924" cy="70" r="2.5" fill="#71717a" />

              {/* Left: Directional Down Arrow Circle */}
              <g transform="translate(108, 42)">
                <circle cx="0" cy="0" r="22" fill="#ffffff" />
                <path
                  d="M 0 -10 L 0 10 M -6 4 L 0 10 L 6 4"
                  stroke="#18181b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>

              {/* Center: Iconic Subway Wayfinding Typography */}
              <g transform="translate(148, 22)">
                <text
                  x="0"
                  y="20"
                  className="font-sans font-black text-2xl fill-white tracking-tight"
                >
                  Concourse Level
                </text>
                <text
                  x="0"
                  y="42"
                  className="font-sans font-medium text-xs fill-zinc-300 tracking-wide"
                >
                  Grand Central Terminal // Departures &amp; Engineering Platforms
                </text>
              </g>

              {/* Right: Colored Subway Route Bullets (E) (A) (P) */}
              <g transform="translate(820, 42)">
                <circle cx="-56" cy="0" r="15" fill="#ff6319" stroke="#18181b" strokeWidth="1.5" />
                <text
                  x="-56"
                  y="5.5"
                  textAnchor="middle"
                  className="font-sans font-black text-sm fill-white"
                >
                  E
                </text>

                <circle cx="-20" cy="0" r="15" fill="#0039a6" stroke="#18181b" strokeWidth="1.5" />
                <text
                  x="-20"
                  y="5.5"
                  textAnchor="middle"
                  className="font-sans font-black text-sm fill-white"
                >
                  A
                </text>

                <circle cx="16" cy="0" r="15" fill="#ee352e" stroke="#18181b" strokeWidth="1.5" />
                <text
                  x="16"
                  y="5.5"
                  textAnchor="middle"
                  className="font-sans font-black text-sm fill-white"
                >
                  P
                </text>
              </g>
            </g>
          </g>
        </svg>

        {/* Departure Board Interactive Component (EAP Light Mode Dual Screens) */}
        <div
          id="departure-board-concourse-overlay"
          className="absolute left-0 right-0 z-30 px-4 sm:px-8 pointer-events-auto"
          style={{ bottom: "24px" }}
        >
          <div className="max-w-7xl mx-auto">
            <CurrentStatus onSelectStation={onSelectStation || undefined} />
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredStation && !activeModalStation && isZoomedOut && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-3 px-4 py-2 bg-zinc-950 text-white rounded-xl shadow-2xl font-sans text-xs font-bold"
          style={{
            left: `${hoveredStation.pos.x}px`,
            top: `${hoveredStation.pos.y - 12}px`,
          }}
        >
          <div className="text-white font-extrabold">
            {hoveredStation.station.title}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-300 mt-0.5 font-normal">
            <span>{hoveredStation.station.date}</span>
            <span>•</span>
            <span className="text-[#ff6319] font-bold">
              {hoveredStation.station.status.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Station Detail Centered Pop-Out Modal Window (Mounted to body via React Portal) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeModalStation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/60 backdrop-blur-sm"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 15 }}
                transition={{
                  type: "spring",
                  damping: 26,
                  stiffness: 260,
                  duration: prefersReducedMotion ? 0 : 0.3,
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl max-h-[88vh] bg-white border border-zinc-300 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-y-auto flex flex-col justify-between"
                role="dialog"
                aria-modal="true"
                aria-labelledby="station-modal-title"
                aria-describedby="station-modal-summary"
              >
                <div>
                  {/* Modal Header with Clean Unobstructed Close Button */}
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-5">
                    <div className="flex items-center gap-2.5">
                      {activeModalStation.inDevelopment ? (
                        <span className="font-sans text-xs font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-md">
                          IN DEVELOPMENT // PRE-BUILD
                        </span>
                      ) : activeModalStation.id === "station-windows-runner" ? (
                        <span className="font-sans text-xs font-extrabold text-white bg-[#ff6319] px-3 py-1 rounded-md">
                          ACTIVE WORK IN PROGRESS
                        </span>
                      ) : (
                        <span className="font-sans text-xs font-extrabold text-white bg-zinc-950 px-3 py-1 rounded-md">
                          PROJECT CARD
                        </span>
                      )}
                      <span className="font-mono text-xs text-zinc-500 font-bold">
                        {activeModalStation.date}
                      </span>
                    </div>

                    <button
                      onClick={closeModal}
                      className="p-2 rounded-full text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-950"
                      aria-label="Close Station Details"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Technical Placeholder Media Block */}
                  <div className="w-full h-32 rounded-xl border border-zinc-300 transit-hatch-pattern flex flex-col items-center justify-center relative mb-5" aria-hidden="true">
                    <div className="font-sans text-xs font-bold text-zinc-800 bg-white/95 px-3 py-1.5 rounded-lg border border-zinc-300 shadow-xs flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-[#ff6319]" />
                      <span>PROJECT PREVIEW // {activeModalStation.id}</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500 mt-1 font-medium">
                      SCHEMATICS • DESIGNS • DOCUMENTS
                    </span>
                  </div>

                  {/* Station Title & Summary */}
                  <div className="space-y-2 mb-6">
                    <h3 id="station-modal-title" className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
                      {activeModalStation.title}
                    </h3>
                    <p id="station-modal-summary" className="text-sm sm:text-base text-zinc-700 font-sans leading-relaxed">
                      {activeModalStation.summary}
                    </p>
                  </div>

                  {/* Technical Specifications */}
                  {activeModalStation.specs && (
                    <div className="mb-6 p-4 rounded-xl bg-[#faf8f5] border border-zinc-200 space-y-2">
                      <div className="font-sans text-xs font-extrabold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 pb-1.5 mb-2">
                        Key Project Highlights
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                        {Object.entries(activeModalStation.specs).map(([k, v]) => (
                          <div
                            key={k}
                            className="flex justify-between p-2 rounded bg-white border border-zinc-200"
                          >
                            <span className="text-zinc-500">{k}:</span>
                            <span className="text-zinc-900 font-bold text-right ml-2">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connected Routes */}
                  <div className="mb-6">
                    <span className="font-sans text-xs font-bold text-zinc-500 uppercase block mb-2">
                      Related Discipline Lines:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeModalStation.lines.map((lineId) => {
                        const line = LINES.find((l) => l.id === lineId);
                        return (
                          <span
                            key={lineId}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 font-sans text-xs font-bold text-zinc-800"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: line?.color || "#18181b" }}
                            />
                            <span>{line?.label || lineId}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Associated Waypoints */}
                  {getStationWaypoints(activeModalStation.id).length > 0 && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                      <div className="font-sans text-xs font-extrabold text-[#0039a6] flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#0039a6]" />
                        <span>VERIFIED CREDENTIAL</span>
                      </div>
                      {getStationWaypoints(activeModalStation.id).map((wp) => (
                        <div key={wp.id} className="text-xs font-sans text-zinc-800">
                          <div className="font-bold">{wp.label}</div>
                          <div className="text-zinc-500 text-[11px]">
                            {wp.issuer} ({wp.date})
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Domain Technologies */}
                  <div className="mb-6">
                    <span className="font-sans text-xs font-bold text-zinc-500 uppercase block mb-2">
                      Key Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeModalStation.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer Action Links */}
                <div className="border-t border-zinc-200 pt-4 flex flex-wrap justify-end gap-3">
                  {activeModalStation.links.repo && (
                    <a
                      href={activeModalStation.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-xl font-sans text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Github className="w-4 h-4 text-zinc-700" />
                      <span>CODE REPOSITORY</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </a>
                  )}

                  {activeModalStation.links.writeup && (
                    <a
                      href={activeModalStation.links.writeup}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-sans text-xs font-bold transition-colors shadow-sm cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-zinc-200" />
                      <span>READ ARTICLE</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
