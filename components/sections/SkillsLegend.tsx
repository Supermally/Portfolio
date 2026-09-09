"use client";

import React from "react";
import { useSiteContent } from "@/lib/content/ContentProvider";
import { TransferBullet } from "@/components/map/TransferBullet";
import { Award, Compass } from "lucide-react";

interface SkillsLegendProps {
  selectedLineId?: string | null;
  onSelectLine?: (lineId: string | null) => void;
  onSelectStation?: (stationId: string) => void;
}

export function SkillsLegend({
  selectedLineId,
  onSelectLine,
  onSelectStation,
}: SkillsLegendProps) {
  const { lines: LINES, stations: STATIONS, waypoints: WAYPOINTS } = useSiteContent();
  return (
    <section id="skills" className="py-16 border-b border-zinc-300 bg-[#faf8f5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* System Guide Signage Header */}
        <div className="border-b-2 border-zinc-950 pb-4 mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
              <Compass className="w-3.5 h-3.5 text-[#ff6319]" />
              <span>OFFICIAL SYSTEM ROUTE GUIDE // SECTION 03</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight font-sans">
              Engineering Disciplines &amp; Route Guide
            </h2>
          </div>
          <p className="text-zinc-600 text-xs sm:text-sm font-sans max-w-md">
            Explore projects organized by engineering field and follow each route from beginning to end.
          </p>
        </div>

        {/* 3 Wall Route Strips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {LINES.map((line) => {
            const isSelected = selectedLineId === line.id;
            const lineStations = line.stations
              .map((sId) => STATIONS.find((s) => s.id === sId))
              .filter((s): s is (typeof STATIONS)[0] => !!s);

            return (
              <div
                key={line.id}
                onClick={() => {
                  if (onSelectLine) {
                    onSelectLine(isSelected ? null : line.id);
                  }
                }}
                className={`rounded-2xl border transition-all cursor-pointer overflow-hidden bg-white shadow-sm ${
                  isSelected
                    ? "ring-2 ring-zinc-950 border-zinc-950 shadow-md"
                    : "border-zinc-300 hover:border-zinc-400 hover:shadow-md"
                }`}
              >
                {/* Porcelain Route Header Banner */}
                <div
                  className="p-4 text-white flex items-center justify-between"
                  style={{ backgroundColor: line.color }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white text-zinc-950 font-sans text-sm font-black flex items-center justify-center shadow-xs">
                      {line.bullet}
                    </span>
                    <div>
                      <h3 className="font-sans text-base font-black leading-tight text-white flex items-center gap-2">
                        <span>{line.label}</span>
                        {line.underConstruction && (
                          <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[9px] font-mono font-bold tracking-tight uppercase">
                            Under Construction
                          </span>
                        )}
                      </h3>
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-white/80">
                        {line.shortLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                    {line.description}
                  </p>

                  {/* Ordered Station Sequence */}
                  <div className="space-y-1.5 border-t border-zinc-200 pt-3">
                    <span className="font-sans text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider block">
                      Featured Projects ({lineStations.length}):
                    </span>
                    <div className="space-y-1.5">
                      {lineStations.map((station) => (
                        <div
                          key={station.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectStation) onSelectStation(station.id);
                            const mapEl = document.getElementById("map-hero-unified");
                            if (mapEl) mapEl.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: line.color }}
                            />
                            <span className="text-xs font-bold text-zinc-900 font-sans">
                              {station.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500 font-semibold">
                            {station.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
