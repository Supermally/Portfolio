"use client";

import React, { useRef, useEffect } from "react";
import { HeroObject } from "./HeroObject";
import { setupHeroScrollSequence } from "./HeroScrollSequence";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { LINES } from "@/lib/data/skills";
import { motion } from "framer-motion";
import { ArrowDown, MapPin, Compass, FileText } from "lucide-react";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLDivElement>(null);
  const graphicContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!heroRef.current) return;

    const sequence = setupHeroScrollSequence({
      triggerElement: heroRef.current,
      headlineElement: headlineRef.current,
      subheadElement: subheadRef.current,
      mapGraphicElement: graphicContainerRef.current,
      reducedMotion: prefersReducedMotion,
    });

    return () => {
      sequence.destroy();
    };
  }, [prefersReducedMotion]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[90vh] flex flex-col justify-between pt-24 pb-10 overflow-hidden border-b border-zinc-300/80 bg-[#faf8f5]"
    >
      {/* 2D Converging Transit Map Canvas in Background */}
      <div ref={graphicContainerRef} className="absolute inset-0">
        <HeroObject />
      </div>

      {/* Top Map Furniture: Transit Route Strip / Legend Key */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-300 pb-3 gap-3 bg-[#faf8f5]/85 backdrop-blur-xs p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
            <span className="font-sans text-xs font-bold text-zinc-900 tracking-wide uppercase">
              MULTIDISCIPLINARY ROUTE SYSTEM // NYC TRANSIT STYLE
            </span>
          </div>

          <div className="flex items-center gap-4 font-sans text-xs font-semibold">
            {LINES.map((line) => (
              <div key={line.id} className="flex items-center gap-1.5">
                <span
                  className="w-4 h-4 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                  style={{ backgroundColor: line.color }}
                >
                  {line.bullet[0]}
                </span>
                <span className="text-zinc-700 hidden sm:inline">{line.shortLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Hero Card & Headline */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 z-10 my-auto py-10">
        <div className="max-w-2xl bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-zinc-300 shadow-xl">
          <div ref={headlineRef} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-zinc-900 text-white font-sans text-xs font-extrabold tracking-wider uppercase">
                ENGINEERING CARTOGRAPHY
              </span>
              <span className="font-mono text-xs text-zinc-500">
                SCALE: 1:1 DISCIPLINE JUNCTION
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
              className="text-4xl sm:text-6xl font-black text-zinc-950 tracking-tight leading-[1.05] font-sans"
            >
              Grand Central
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.1 }}
              className="text-lg text-zinc-600 font-editorial italic font-medium"
            >
              A multidisciplinary engineering portfolio & transit route map.
            </motion.p>
          </div>

          <div ref={subheadRef} className="mt-6 space-y-6">
            <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-sans font-normal">
              Charting the intersection of{" "}
              <strong className="text-[#ff6319] font-bold">Computer Systems & Hardware</strong>,{" "}
              <strong className="text-[#0039a6] font-bold">Aerospace Dynamics</strong>, and{" "}
              <strong className="text-[#ee352e] font-bold">Technology Policy</strong>. Designed as a real, bold transit map.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollToSection("map")}
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-sans text-xs font-extrabold rounded-lg transition-all flex items-center gap-2 shadow-md group cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#ff6319] group-hover:rotate-45 transition-transform" />
                <span>EXPLORE TRANSIT MAP</span>
              </button>

              <button
                onClick={() => scrollToSection("resume")}
                className="px-5 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 font-sans text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-zinc-600" />
                <span>VIEW DOSSIER</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Map Furniture: Scale & "You Are Here" Marker */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex items-center justify-between border-t border-zinc-300 pt-4 text-xs font-sans text-zinc-600">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900">
              <MapPin className="w-4 h-4 text-[#ff6319]" />
              <span>YOU ARE HERE: GRAND CENTRAL TERMINAL</span>
            </div>
            <span className="hidden md:inline text-zinc-400">|</span>
            <span className="hidden md:inline font-mono text-[11px] text-zinc-500">
              TRANSFER FOR ALL ROUTES
            </span>
          </div>

          <button
            onClick={() => scrollToSection("status")}
            className="flex items-center gap-2 font-bold text-zinc-800 hover:text-zinc-950 transition-colors group cursor-pointer"
          >
            <span>SCROLL TO ROUTE DETAILS</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform text-[#ff6319]" />
          </button>
        </div>
      </div>
    </section>
  );
}
