"use client";

import React, { useEffect, useRef, useState } from "react";
import { Station, STATIONS } from "@/lib/data/projects";
import { LINES, Line } from "@/lib/data/skills";
import { WAYPOINTS, Waypoint } from "@/lib/data/certifications";
import { MapEngine } from "./MapEngine";
import { RenderStation } from "./mapData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import {
  X,
  ExternalLink,
  Github,
  FileText,
  Award,
  MapPin,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TransitMapProps {
  selectedLineId?: string | null;
  selectedStationId?: string | null;
  onSelectStation?: (stationId: string | null) => void;
  onSelectLine?: (lineId: string | null) => void;
}

export function TransitMap({
  selectedLineId = null,
  selectedStationId = null,
  onSelectStation,
  onSelectLine,
}: TransitMapProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<MapEngine | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeDrawerStation, setActiveDrawerStation] = useState<Station | null>(null);
  const [hoveredStation, setHoveredStation] = useState<{
    station: RenderStation;
    pos: { x: number; y: number };
  } | null>(null);

  // Sync selectedStationId with drawer
  useEffect(() => {
    if (selectedStationId) {
      const station = STATIONS.find((s) => s.id === selectedStationId);
      if (station) {
        setActiveDrawerStation(station);
        if (engineRef.current) {
          engineRef.current.setHighlightedStation(station.id);
        }
      }
    }
  }, [selectedStationId]);

  // Sync selectedLineId with engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setHighlightedLine(selectedLineId || null);
    }
  }, [selectedLineId]);

  // Initialize Pixi MapEngine
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const engine = new MapEngine({
      container: canvasContainerRef.current,
      onSelectStation: (station) => {
        setActiveDrawerStation(station);
        if (onSelectStation) {
          onSelectStation(station.id);
        }
      },
      onHoverStation: (station, pos) => {
        if (station && pos) {
          setHoveredStation({ station, pos });
        } else {
          setHoveredStation(null);
        }
      },
    });

    engine.init();
    engineRef.current = engine;

    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, [onSelectStation]);

  const closeDrawer = () => {
    setActiveDrawerStation(null);
    if (onSelectStation) onSelectStation(null);
    if (engineRef.current) {
      engineRef.current.setHighlightedStation(null);
    }
  };

  const getStationWaypoints = (stationId: string): Waypoint[] => {
    return WAYPOINTS.filter((w) => w.stationId === stationId);
  };

  return (
    <section id="map" className="py-16 border-b border-zinc-300 relative min-h-screen bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          code="02"
          title="Multidisciplinary Transit Map"
          subtitle="Official route schematic charting engineering projects, research milestones, and intersection transfer points."
          badge="CARTOGRAPHIC SCHEMATIC"
        />

        {/* Map Header / Route Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200">
          {/* Subway Route Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs font-bold text-zinc-500 uppercase tracking-wide mr-1">
              Filter Route:
            </span>
            <button
              onClick={() => {
                if (onSelectLine) onSelectLine(null);
                if (engineRef.current) engineRef.current.setHighlightedLine(null);
              }}
              className={`px-3 py-1.5 text-xs font-sans font-bold rounded-full transition-all border ${
                selectedLineId === null
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                  : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              ALL ROUTES
            </button>

            {LINES.map((line) => (
              <button
                key={line.id}
                onClick={() => {
                  const nextId = selectedLineId === line.id ? null : line.id;
                  if (onSelectLine) onSelectLine(nextId);
                  if (engineRef.current) engineRef.current.setHighlightedLine(nextId);
                }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-sans font-bold rounded-full transition-all border ${
                  selectedLineId === line.id
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
                <span>{line.shortLabel}</span>
              </button>
            ))}
          </div>

          {/* Legend Symbology Key */}
          <div className="flex items-center gap-4 font-sans text-xs text-zinc-600 font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-zinc-900 bg-white" />
              <span>Transfer Hub</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rotate-45 bg-[#0039a6]" />
              <span>Waypoint / Cert</span>
            </div>
          </div>
        </div>

        {/* Map Paper Canvas Container */}
        <div className="relative rounded-2xl overflow-hidden bg-[#faf8f5] border-2 border-zinc-300 shadow-md min-h-[580px]">
          {/* Desktop 2D Canvas */}
          <div
            ref={canvasContainerRef}
            className="w-full h-[580px] cursor-pointer hidden md:block"
          />

          {/* Mobile Reflow: Vertical Route Guide */}
          <div className="md:hidden p-6 space-y-6">
            <div className="p-3 bg-zinc-100 rounded-lg border border-zinc-200 font-sans text-xs font-bold text-zinc-700">
              SCHEMATIC VIEW: VERTICAL ROUTE STRIP
            </div>

            <div className="relative pl-6 border-l-4 border-zinc-900 space-y-6 my-4">
              {STATIONS.map((st) => {
                const isSelected = activeDrawerStation?.id === st.id;
                const isCurrent = st.status === "in-progress";

                return (
                  <div
                    key={st.id}
                    onClick={() => {
                      setActiveDrawerStation(st);
                      if (onSelectStation) onSelectStation(st.id);
                    }}
                    className="relative cursor-pointer group"
                  >
                    {/* Station Bullet Pip */}
                    <div
                      className={`absolute -left-[34px] top-1 w-5 h-5 rounded-full border-2 border-zinc-900 transition-all ${
                        isCurrent
                          ? "bg-[#ff6319] train-pulse"
                          : st.lines.length > 1
                          ? "bg-white ring-2 ring-zinc-900"
                          : "bg-white"
                      }`}
                    />

                    <div className="transit-card p-4 rounded-xl border border-zinc-300 hover:border-zinc-500 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-sans text-base font-extrabold text-zinc-900">
                          {st.title}
                        </span>
                        <span className="font-mono text-xs text-zinc-500 font-bold">
                          {st.date}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 line-clamp-2 font-sans">
                        {st.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {st.lines.map((lId) => (
                          <span
                            key={lId}
                            className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700"
                          >
                            {lId.replace("-line", "").toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hover Tooltip (Desktop) */}
          {hoveredStation && !activeDrawerStation && (
            <div
              className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 bg-zinc-900 text-white rounded-lg shadow-xl font-sans text-xs font-bold"
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

          {/* Station Detail Drawer Panel (Framer Motion slide-in from right) */}
          <AnimatePresence>
            {activeDrawerStation && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 26,
                  stiffness: 220,
                  duration: prefersReducedMotion ? 0 : 0.35,
                }}
                className="absolute top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white border-l border-zinc-300 p-6 z-40 overflow-y-auto shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-xs font-extrabold text-white bg-zinc-900 px-2.5 py-1 rounded">
                        STATION DOSSIER
                      </span>
                      <span className="font-mono text-xs text-zinc-500 font-bold">
                        {activeDrawerStation.date}
                      </span>
                    </div>

                    <button
                      onClick={closeDrawer}
                      className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                      aria-label="Close Station Details"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Neutral Placeholder Media Block with diagonal hatch pattern (no broken img tags) */}
                  <div className="w-full h-36 rounded-xl border border-zinc-300 transit-hatch-pattern flex flex-col items-center justify-center relative mb-5">
                    <div className="font-sans text-xs font-bold text-zinc-800 bg-white/95 px-3 py-1.5 rounded-lg border border-zinc-300 shadow-xs flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-[#ff6319]" />
                      <span>SCHEMATIC CAPTURE // {activeDrawerStation.id}</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500 mt-1 font-medium">
                      HARDWARE SCHEMATICS & WAVEFORM DATA
                    </span>
                  </div>

                  {/* Station Title & Summary */}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
                      {activeDrawerStation.title}
                    </h3>
                    <p className="text-sm text-zinc-700 font-sans leading-relaxed">
                      {activeDrawerStation.summary}
                    </p>
                  </div>

                  {/* Technical Specifications */}
                  {activeDrawerStation.specs && (
                    <div className="mb-6 p-4 rounded-xl bg-[#faf8f5] border border-zinc-200 space-y-2">
                      <div className="font-sans text-xs font-extrabold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 pb-1.5 mb-2">
                        Engineering Specifications
                      </div>
                      {Object.entries(activeDrawerStation.specs).map(([k, v]) => (
                        <div
                          key={k}
                          className="flex justify-between text-xs font-sans"
                        >
                          <span className="text-zinc-500">{k}:</span>
                          <span className="text-zinc-900 font-bold text-right ml-2">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Discipline Lines */}
                  <div className="mb-6">
                    <span className="font-sans text-xs font-bold text-zinc-500 uppercase block mb-2">
                      Connected Routes:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeDrawerStation.lines.map((lineId) => {
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
                  {getStationWaypoints(activeDrawerStation.id).length > 0 && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                      <div className="font-sans text-xs font-extrabold text-[#0039a6] flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#0039a6]" />
                        <span>VERIFIED WAYPOINT CREDENTIAL</span>
                      </div>
                      {getStationWaypoints(activeDrawerStation.id).map((wp) => (
                        <div key={wp.id} className="text-xs font-sans text-zinc-800">
                          <div className="font-bold">{wp.label}</div>
                          <div className="text-zinc-500 text-[11px]">
                            {wp.issuer} ({wp.date})
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* System Technology Tags */}
                  <div className="mb-6">
                    <span className="font-sans text-xs font-bold text-zinc-500 uppercase block mb-2">
                      Domain Technologies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDrawerStation.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Links */}
                <div className="border-t border-zinc-200 pt-4 flex flex-wrap gap-3">
                  {activeDrawerStation.links.repo && (
                    <a
                      href={activeDrawerStation.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-lg font-sans text-xs font-bold transition-colors"
                    >
                      <Github className="w-4 h-4 text-zinc-700" />
                      <span>REPOSITORY</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </a>
                  )}

                  {activeDrawerStation.links.writeup && (
                    <a
                      href={activeDrawerStation.links.writeup}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-sans text-xs font-bold transition-colors shadow-xs"
                    >
                      <FileText className="w-4 h-4 text-zinc-200" />
                      <span>TECHNICAL REPORT</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
