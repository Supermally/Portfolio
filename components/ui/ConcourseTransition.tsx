"use client";

import React from "react";
import { ArrowDown, Radio } from "lucide-react";

export function ConcourseTransition() {
  return (
    <div className="relative w-full overflow-hidden select-none z-10">
      {/* 1. Seamless Material Atmosphere Blend: Cream Drafting Paper (#FAF8F5) -> Dark Station Tiles (#121214) */}
      <div className="w-full bg-gradient-to-b from-[#faf8f5] via-[#222227] to-[#121214] relative flex justify-center">
        {/* Continuous 3-Track Vector Conduits matching SVG Map Coordinates (x = 100, 120, 140) */}
        <svg
          viewBox="0 0 1000 160"
          className="w-full h-40 max-w-[1000px]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Orange EE Route (x = 100) */}
          <line
            x1="100"
            y1="0"
            x2="100"
            y2="160"
            stroke="#ff6319"
            strokeWidth="10"
            strokeLinecap="square"
          />

          {/* Blue Aero Route (x = 120) */}
          <line
            x1="120"
            y1="0"
            x2="120"
            y2="160"
            stroke="#0039a6"
            strokeWidth="10"
            strokeLinecap="square"
          />

          {/* Red Policy Route (x = 140) */}
          <line
            x1="140"
            y1="0"
            x2="140"
            y2="160"
            stroke="#ee352e"
            strokeWidth="10"
            strokeLinecap="square"
          />

          {/* Track Conduit Bullets */}
          <g transform="translate(100, 80)">
            <circle cx="0" cy="0" r="8" fill="#18181b" stroke="#ff6319" strokeWidth="2" />
            <text x="0" y="3.5" textAnchor="middle" className="font-sans font-black text-[9px] fill-white">
              E
            </text>
          </g>
          <g transform="translate(120, 80)">
            <circle cx="0" cy="0" r="8" fill="#18181b" stroke="#0039a6" strokeWidth="2" />
            <text x="0" y="3.5" textAnchor="middle" className="font-sans font-black text-[9px] fill-white">
              A
            </text>
          </g>
          <g transform="translate(140, 80)">
            <circle cx="0" cy="0" r="8" fill="#18181b" stroke="#ee352e" strokeWidth="2" />
            <text x="0" y="3.5" textAnchor="middle" className="font-sans font-black text-[9px] fill-white">
              P
            </text>
          </g>
        </svg>
      </div>

      {/* 2. Physical Station Lintel / Overhead Threshold Beam (Camera Passes Under) */}
      <div className="w-full bg-[#18181b] border-y-2 border-zinc-950 shadow-2xl py-6 relative z-20 porcelain-sign">
        {/* Steel Rivets on Lintel Edge */}
        <div className="max-w-[1000px] mx-auto px-4 flex justify-between opacity-30 text-[10px] text-zinc-400 font-mono">
          <span>● ● ● ● ● ●</span>
          <span>STRUCTURAL BEAM NO. GC-42</span>
          <span>● ● ● ● ● ●</span>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6 pt-2">
          {/* Illuminated Station Signage */}
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 text-[#ff6319] flex items-center justify-center font-black text-sm shadow-inner">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            <div>
              <div className="font-mono text-[10px] text-amber-400 tracking-widest uppercase font-bold flex items-center gap-2">
                <span>STATION ELEVATION: CONCOURSE LEVEL</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">GRAND CENTRAL TERMINAL</span>
              </div>
              <div className="font-sans font-black text-base sm:text-xl tracking-tight text-white flex items-center gap-2 mt-0.5">
                <span>ENTERING CONCOURSE LEVEL</span>
                <span className="text-zinc-600 font-normal hidden sm:inline">{"//"}</span>
                <span className="text-zinc-300 text-xs sm:text-sm font-semibold hidden sm:inline">
                  PLATFORM WAYFINDING &amp; DISPATCH DIRECTORIES
                </span>
              </div>
            </div>
          </div>

          {/* Environmental Status Lamp */}
          <div className="flex items-center gap-3 font-mono text-xs text-zinc-300 bg-zinc-900/90 px-4 py-2 rounded-xl border border-zinc-800">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold text-white">CONCOURSE LIGHTING ACTIVE</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-semibold">TRACK 01 CLEAR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
