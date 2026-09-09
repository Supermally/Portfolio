"use client";

import React, { useState, useEffect } from "react";
import { useSiteContent } from "@/lib/content/ContentProvider";
import { ArrowRight, MapPin, Radio, Cpu, CheckCircle2, Clock, Wrench, AlertCircle } from "lucide-react";

interface CurrentStatusProps {
  onSelectStation?: (stationId: string) => void;
}

export function CurrentStatus({ onSelectStation }: CurrentStatusProps) {
  const { stations: STATIONS, lines: LINES, featured } = useSiteContent();
  // Real-time clock for authentic EAP screen header
  const [timeStr, setTimeStr] = useState("6:44 pm");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).toLowerCase()
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeStation = STATIONS.find((s) => s.id === featured.activeProjectId) || STATIONS[0];
  const diagnosticsStation = STATIONS.find((s) => s.id === featured.diagnosticsProjectId) || activeStation;
  const activeLine = LINES.find((line) => line.stations.includes(activeStation.id)) || LINES[0];
  const routeStations = activeLine.stations.map((id) => STATIONS.find((station) => station.id === id)).filter(Boolean);

  const handleStationClick = () => {
    if (!activeStation) return;
    if (onSelectStation) {
      onSelectStation(activeStation.id);
    }
    const mapElement = document.getElementById("map-hero-unified");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="status" className="w-full relative z-20 select-none pb-4">
      {/* Concourse Wall Header — Offset right of tracks (pl-28 sm:pl-44) */}
      <div className="px-0 lg:pl-44 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-300 pb-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#ff6319] animate-pulse shadow-md shadow-orange-500/50" />
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-900 font-bold uppercase">
              <span>CONCOURSE EAST WALL // STATION PLATFORM SCREENS</span>
            </div>
            <span className="font-mono text-[11px] text-zinc-500">
              LIVE PROJECT STATUS • ACTIVE MISSIONS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-700 bg-white px-3 py-1.5 rounded-lg border border-zinc-300 shadow-xs">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="text-zinc-600">SYSTEM FEED:</span>
          <span className="text-emerald-700 font-bold">ONLINE &amp; ACTIVE</span>
        </div>
      </div>

      {/* Dual Light Mode MTA Digital Subway Displays Mounted in Black Enclosure Bezels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 items-start lg:ml-40">
        {/* ========================================================= */}
        {/* SCREEN 1 (LEFT): LIGHT MODE NEXT TRAIN & ROUTE STRIP     */}
        {/* ========================================================= */}
        <div className="mta-screen-bezel rounded-2xl bg-white text-zinc-900 overflow-hidden border-2 border-zinc-900 shadow-2xl">
          {/* Outfront Top Black Header Bar */}
          <div className="bg-zinc-950 text-white px-4 py-2 flex items-center justify-between">
            <span className="font-sans font-black text-sm tracking-tight text-white">
              Current Active Project // {featured.activeLabel}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Next Train Banner (Light Background) */}
          <div className="p-3 sm:p-4 bg-white border-b border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Vibrant Subway Bullet */}
                <div className="flex pt-0.5">
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white font-black text-sm sm:text-lg flex items-center justify-center shadow-md ring-2 ring-white" style={{ backgroundColor: activeLine.color }}>
                    {activeLine.bullet[0]}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-mono text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Wrench className="w-3 h-3" />
                    <span>Active Work in Progress</span>
                  </div>
                  <h4 className="text-lg sm:text-2xl font-black text-zinc-950 tracking-tight font-sans mt-0.5 leading-tight">
                    {activeStation.title}
                  </h4>
                  <div className="text-xs text-zinc-600 font-sans mt-1 leading-relaxed">
                    {activeStation.summary}
                  </div>
                </div>
              </div>

              {/* Status ETA Badge */}
              <div className="text-left sm:text-right shrink-0 pl-12 sm:pl-0">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-mono text-xs font-black uppercase">
                  {featured.activeLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Light Mode Route Stop Diagram */}
          <div className="p-4 bg-zinc-50/60 text-xs font-sans">
            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2.5 font-bold flex items-center gap-1.5">
              <span>Project sequence along {activeLine.shortLabel} ({activeLine.bullet})</span>
            </div>

            <div className="relative pl-6 space-y-2.5 font-sans">
              {/* Vertical Route Track Line */}
              <div className="absolute left-2.5 top-1 bottom-1 w-1 rounded-full" style={{ backgroundColor: activeLine.color }} />

              {/* Origin Stop */}
              <div className="relative flex items-center gap-2 text-zinc-500">
                <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-zinc-400 -ml-[19px]" />
                <span className="font-medium">{routeStations[0]?.title || "Grand Central Hub"}</span>
                <span className="text-[10px] font-mono text-zinc-400">[Route origin]</span>
              </div>

              {/* Stop 1: Active Current Station (Light Highlighted Box) */}
              <div className="relative -ml-4 p-3 rounded-xl bg-white border-2 text-zinc-950 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ borderColor: activeLine.color }}>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full animate-ping -ml-[14px]" style={{ backgroundColor: activeLine.color }} />
                  <div>
                    <div className="font-black text-sm text-zinc-950 font-sans flex items-center gap-2">
                      <span>{activeStation.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-white text-[9px] font-mono font-extrabold uppercase" style={{ backgroundColor: activeLine.color }}>
                        ACTIVE FOCUS
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-700 font-mono mt-0.5 font-semibold">
                      {featured.activeFocus}
                    </div>
                  </div>
                </div>
              </div>

              {routeStations.filter((station) => station && station.id !== activeStation.id && station.id !== routeStations[0]?.id).map((station) => station && <div key={station.id} className="relative flex flex-wrap items-center gap-2 text-zinc-600 pt-1"><span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-zinc-400 -ml-[19px]" /><span>{station.title}</span><span className="text-[10px] font-mono text-amber-700 font-semibold">[{station.date}]</span></div>)}
            </div>
          </div>

          {/* Bottom Later Services Cards */}
          <div className="bg-white p-3 border-t border-zinc-200 flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-500 uppercase">
              <span>Political Science &amp; Aerospace Research</span>
              <span>Discipline • Status</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-zinc-800 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#ee352e] text-white text-[10px] font-black flex items-center justify-center">
                  P
                </span>
                <span className="font-semibold">Ideology Test &amp; Political Compass</span>
              </div>
              <span className="font-mono text-amber-700 font-bold">In Development</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-zinc-800 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#0039a6] text-white text-[10px] font-black flex items-center justify-center">
                  A
                </span>
                <span className="font-semibold">Flight Dynamics &amp; Propulsion Research</span>
              </div>
              <span className="font-mono text-blue-700 font-bold">Line Under Construction</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SCREEN 2 (RIGHT): LIGHT MODE SYSTEM STATUS & TELEMETRY   */}
        {/* ========================================================= */}
        <div className="mta-screen-bezel rounded-2xl bg-white text-zinc-900 overflow-hidden border-2 border-zinc-900 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Outfront Top Black Header Bar */}
            <div className="bg-zinc-950 text-white px-4 py-2 flex items-center justify-between">
              <span className="font-sans font-black text-sm tracking-tight text-white">
                Engineering Diagnostics &amp; Telemetry
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{timeStr}</span>
              </div>
            </div>

            {/* Service Alerts Banner */}
            <div className="p-3 bg-amber-50/80 border-b border-amber-200">
              <div className="text-[11px] font-mono text-amber-800 uppercase font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Active Sprint Focus</span>
              </div>
              <div className="text-xs font-bold text-zinc-900 font-sans mt-0.5">
                {featured.diagnosticsAlert}
              </div>
            </div>

            {/* Hardware & Telemetry Status */}
            <div className="p-4 bg-white space-y-3">
              <div>
                <div className="text-[11px] font-mono text-zinc-500 uppercase font-bold">
                  Active Project Diagnostics
                </div>
                <div className="text-sm font-bold text-zinc-900 font-sans mt-0.5">
                  {featured.diagnosticsSummary}
                </div>
              </div>

              {/* Clean Light Telemetry Spec Cards */}
              {diagnosticsStation.specs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
                  {Object.entries(diagnosticsStation.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col justify-between"
                    >
                      <span className="text-zinc-500 text-[10px] uppercase font-bold">{key}</span>
                      <span className="text-zinc-950 font-bold text-xs mt-0.5">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hardware Tags */}
              <div className="pt-1 flex flex-wrap gap-1.5">
                {diagnosticsStation.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded bg-zinc-100 border border-zinc-300 text-zinc-800 font-mono text-xs font-semibold flex items-center gap-1"
                  >
                    <Cpu className="w-3 h-3 text-[#ff6319]" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Systemwide Status Directory */}
            <div className="p-4 bg-zinc-50/70 border-t border-zinc-200">
              <div className="text-[11px] font-mono text-zinc-500 font-bold uppercase tracking-wider mb-2.5">
                Discipline Route Status
              </div>

              <div className="space-y-2 text-xs font-sans">
                {LINES.map((line) => {
                  const hasActiveProjects = line.stations.some((id) => STATIONS.find((station) => station.id === id)?.status === "in-progress");
                  return <div key={line.id} className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-white border border-zinc-200 shadow-xs"><div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full text-white font-black text-[10px] flex items-center justify-center" style={{ backgroundColor: line.color }}>{line.bullet[0]}</span><span className="font-bold text-zinc-900">{line.label}</span></div><span className={`font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 ${line.underConstruction ? "text-blue-700" : hasActiveProjects ? "text-amber-700" : "text-emerald-700"}`}><CheckCircle2 className="w-3.5 h-3.5" /><span>{line.underConstruction ? "UNDER CONSTRUCTION" : hasActiveProjects ? "ACTIVE PROJECTS" : "OPERATIONAL"}</span></span></div>;
                })}
              </div>
            </div>
          </div>

          {/* Interactive Action Button */}
          <div className="p-4 bg-white border-t border-zinc-200">
            <button
              onClick={handleStationClick}
              className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-sans font-black rounded-xl text-sm transition-all shadow-lg group cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>LOCATE ON TRANSIT MAP</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
