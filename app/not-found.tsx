"use client";

import React from "react";
import Link from "next/link";
import { Compass, AlertTriangle, ArrowLeft, Train } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 sm:p-8 select-none">
      <div className="w-full max-w-2xl bg-white border-2 border-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Porcelain Enamel Sign Header */}
        <div className="bg-zinc-950 text-white p-6 sm:p-8 border-b-4 border-[#ee352e]">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-[#ee352e] text-white font-black text-sm flex items-center justify-center">
              !
            </span>
            <span className="font-mono text-xs text-zinc-400 font-bold uppercase tracking-widest">
              TRANSIT AUTHORITY SERVICE ADVISORY
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight text-white">
            Station Closed // 404
          </h1>
          <p className="text-zinc-400 font-editorial italic text-lg sm:text-xl mt-1">
            The platform you requested is not in service or has been relocated.
          </p>
        </div>

        {/* Advisory Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-950 font-sans leading-relaxed">
              <strong className="font-extrabold block mb-0.5">SERVICE DETOUR IN EFFECT:</strong>
              Trains are bypassing this track. Please return to the Grand Central Concourse to catch scheduled service on the <strong>EE</strong>, <strong>AER</strong>, or <strong>POL</strong> lines.
            </div>
          </div>

          {/* Subway Route Bullets */}
          <div className="flex items-center justify-center gap-3 py-4 border-y border-zinc-200">
            <span className="w-10 h-10 rounded-full bg-[#ff6319] text-white font-black text-base flex items-center justify-center shadow-sm">
              E
            </span>
            <span className="w-10 h-10 rounded-full bg-[#0039a6] text-white font-black text-base flex items-center justify-center shadow-sm">
              A
            </span>
            <span className="w-10 h-10 rounded-full bg-[#ee352e] text-white font-black text-base flex items-center justify-center shadow-sm">
              P
            </span>
          </div>

          {/* Return Button */}
          <div className="pt-2">
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-zinc-950 hover:bg-zinc-800 text-white font-sans font-black rounded-2xl text-sm transition-all shadow-lg group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
              <span>RETURN TO GRAND CENTRAL HUB</span>
              <Train className="w-4 h-4 text-[#ff6319]" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
