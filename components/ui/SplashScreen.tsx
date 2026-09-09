"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Volume2, VolumeX, ArrowRight, FastForward } from "lucide-react";

interface SplashScreenProps {
  onEnter: (soundEnabled: boolean) => void;
  onSkip: () => void;
}

export function SplashScreen({ onEnter, onSkip }: SplashScreenProps) {
  const [swiped, setSwiped] = useState(false);
  const [isEnteringTunnel, setIsEnteringTunnel] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  // Motion values for smooth horizontal card drag
  const dragX = useMotionValue(0);
  const cardRotate = useTransform(dragX, [0, 320], [-1, 4]);

  // Preload and pre-decode audio for zero-latency + 2.4x volume gain boost
  useEffect(() => {
    const audio = new Audio("/audio/now-arriving-at-grand-central.mp3");
    audio.preload = "auto";
    audio.volume = 1.0;
    audioRef.current = audio;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        fetch("/audio/now-arriving-at-grand-central.mp3")
          .then((res) => res.arrayBuffer())
          .then((buf) => ctx.decodeAudioData(buf))
          .then((decoded) => {
            audioBufferRef.current = decoded;
          })
          .catch(() => {});
      }
    } catch (e) {}
  }, []);

  const playLouderAudio = () => {
    try {
      const ctx = audioContextRef.current;
      const buf = audioBufferRef.current;
      if (ctx && buf) {
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        const source = ctx.createBufferSource();
        source.buffer = buf;
        const gainNode = ctx.createGain();
        gainNode.gain.value = 2.4; // 240% boosted audio level
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return;
      }
    } catch (e) {}

    // Fallback to HTML5 audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch(() => {});
    }
  };

  const triggerSuccessEntry = (soundEnabled = true) => {
    if (swiped) return;
    setSwiped(true);
    setIsEnteringTunnel(true);

    if (soundEnabled) {
      playLouderAudio();
    }

    // Complete tunnel zoom transition and reveal portfolio
    setTimeout(() => {
      onEnter(soundEnabled);
    }, 950);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 90 || dragX.get() > 90) {
      // Animate card smoothly through the turnstile
      animate(dragX, 420, {
        duration: 0.35,
        ease: "easeOut",
        onComplete: () => {
          triggerSuccessEntry(true);
        },
      });
    } else {
      // Snap card back
      animate(dragX, 0, { duration: 0.3, ease: "easeOut" });
    }
  };

  const handleCardClick = () => {
    if (swiped) return;
    // Animate auto-swipe across turnstile
    animate(dragX, 420, {
      duration: 0.45,
      ease: "easeInOut",
      onComplete: () => {
        triggerSuccessEntry(true);
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] bg-[#0c0c0e] text-white flex flex-col items-center justify-between py-6 sm:py-8 px-4 select-none overflow-hidden"
    >
      {/* Background Subway Ceramic Tile Pattern & Ambient Vignette */}
      <div className="absolute inset-0 subway-tile opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none" />

      {/* Immediate Visible Frame-1 Skip Intro Control (Top Right) */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-8 z-50">
        <button
          onClick={onSkip}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs sm:text-sm font-sans font-bold text-zinc-200 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <FastForward className="w-3.5 h-3.5 text-amber-400" />
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </div>

      {/* ================================================================= */}
      {/* 3D SUBWAY TUNNEL ENTRANCE OVERLAY (Active upon swipe)             */}
      {/* ================================================================= */}
      {isEnteringTunnel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* Central Subway Headlight Beam Expanding */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 6, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeIn" }}
            className="w-72 h-72 rounded-full bg-radial from-amber-100 via-amber-300/40 to-transparent blur-md"
          />

          {/* Concentric Subway Tunnel Perspective Arch Rings */}
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 4.5, opacity: [0, 0.9, 0] }}
              transition={{
                duration: 0.85,
                delay: i * 0.12,
                ease: "easeIn",
              }}
              className="absolute w-[400px] h-[400px] rounded-full border-4 border-amber-400/60 shadow-[0_0_50px_rgba(251,191,36,0.5)]"
            />
          ))}
        </motion.div>
      )}

      {/* ================================================================= */}
      {/* 1. TOP SECTION: OVERHEAD HANGING SUBWAY ENTRANCE SIGN             */}
      {/* ================================================================= */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl pt-1 sm:pt-2">
        {/* Steel Suspension Rods */}
        <div className="flex items-center justify-between w-full max-w-md px-12">
          <div className="w-1.5 h-5 sm:h-6 bg-zinc-600 rounded-t-sm" />
          <div className="w-1.5 h-5 sm:h-6 bg-zinc-600 rounded-t-sm" />
        </div>

        {/* Black Porcelain Enamel Signboard */}
        <div className="w-full bg-[#18181b] border-2 border-zinc-700 rounded-2xl px-3 sm:px-6 py-3.5 sm:py-4 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {/* Directional Down Arrow Circle */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center text-zinc-950 font-black text-base sm:text-lg shadow-sm">
              ↓
            </div>
            <div className="text-left">
              <h1 className="text-lg sm:text-3xl font-black font-sans tracking-tight text-white uppercase leading-none">
                Grand Central
              </h1>
              <span className="text-[10px] sm:text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase">
                Subway Entrance // Turnstile Gate
              </span>
            </div>
          </div>

          {/* Route Bullets */}
          <div className="flex items-center gap-1.5">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ff6319] text-white font-sans font-black text-xs sm:text-sm flex items-center justify-center shadow-md">
              E
            </span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0039a6] text-white font-sans font-black text-xs sm:text-sm flex items-center justify-center shadow-md">
              A
            </span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ee352e] text-white font-sans font-black text-xs sm:text-sm flex items-center justify-center shadow-md">
              P
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. MIDDLE SECTION: "MALACHI" TRANSIT CARD & SWIPE READER          */}
      {/* ================================================================= */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center justify-center my-auto py-2">
        {/* Turnstile Status Display Banner (FARE: FREE) */}
        <div className="w-full max-w-md bg-black/90 border border-zinc-800 rounded-xl p-3 mb-5 sm:mb-6 flex items-center justify-between font-mono shadow-md">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                swiped
                  ? "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)] scale-110"
                  : "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse"
              }`}
            />
            <span
              className={`text-xs font-black tracking-wider uppercase ${
                swiped ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {swiped ? "● GO // FREE ENTRY" : "● SWIPE METROCARD"}
            </span>
          </div>

          <span className="text-[11px] text-emerald-400 font-black tracking-wider uppercase">
            {swiped ? "WELCOME" : "FARE: FREE"}
          </span>
        </div>

        {/* Turnstile Reader Track (Behind Free-Floating Card) */}
        <div className="relative flex items-center justify-center">
          {/* Reader Slot Track */}
          <div className="absolute -inset-x-6 sm:-inset-x-20 h-24 sm:h-28 bg-zinc-900/85 border-y border-zinc-800 rounded-2xl flex items-center justify-between px-6 pointer-events-none">
            <span className="font-mono text-[11px] sm:text-xs text-zinc-600 font-bold uppercase tracking-widest">
              [ TURNSTILE SLOT ]
            </span>
            <div className="flex items-center gap-1.5 text-amber-400/80 font-mono text-[11px] sm:text-xs font-bold animate-pulse">
              <span>SWIPE RIGHT</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Clean, Refined "Malachi" Transit Card */}
          <motion.div
            style={{
              x: dragX,
              rotate: cardRotate,
              background: "linear-gradient(145deg, #f8b800 0%, #fcc006 45%, #f2a912 100%)",
              clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 340 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            onClick={handleCardClick}
            whileHover={{ scale: 1.03, cursor: "grab" }}
            whileTap={{ scale: 0.98, cursor: "grabbing" }}
            className="relative z-20 w-[calc(100vw-2rem)] max-w-[320px] sm:max-w-[410px] h-[190px] sm:h-[256px] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-yellow-200/50 select-none overflow-hidden shrink-0 flex flex-col justify-between cursor-grab active:cursor-grabbing"
          >
            {/* Plastic Card Gloss Sheen Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />

            {/* Top Section: EAP Circular Emblem & Giant Slanted Blue 'Malachi' Typography */}
            <div className="relative z-10 p-3 sm:p-4 flex items-start">
              {/* Circular EAP Emblem */}
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#f2a912] border-2 border-amber-700/30 flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                <span className="font-sans font-black text-amber-950 text-xs sm:text-sm tracking-tight italic">
                  EAP
                </span>
              </div>

              {/* Giant Slanted Blue 'Malachi' Title */}
              <div className="ml-2 sm:ml-3 pt-0">
                <div className="font-sans font-black italic text-[#0039a6] text-4xl sm:text-6xl tracking-tight transform -rotate-[6deg] drop-shadow-xs flex items-baseline leading-none">
                  <span>Malachi</span>
                  <span className="text-[10px] sm:text-xs font-normal not-italic ml-1 text-[#0039a6]">
                    ®
                  </span>
                </div>
              </div>

              {/* Small White Base Dot */}
              <div className="absolute bottom-2 left-5 sm:left-7 w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-white shadow-xs" />
            </div>

            {/* Bottom Section: Solid Black Magnetic Stripe & Synchronized Right-Pointing Chevrons */}
            <div className="relative z-10 w-full">
              {/* Solid Black Magnetic Stripe */}
              <div className="w-full h-10 sm:h-14 bg-[#18181b] flex items-center px-3 sm:px-4 justify-between">
                <span className="font-mono text-[8px] sm:text-[10px] text-zinc-400 tracking-widest font-bold">
                  MALACHI MCDONALD // GRAND CENTRAL PASS
                </span>
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-zinc-800" />
              </div>

              {/* Bottom Yellow Bar with Synchronized RIGHT Arrows (━▶ ▶ ▶) */}
              <div className="w-full bg-[#f2a912] px-3 sm:px-4 py-1 sm:py-1.5 flex items-center justify-between text-white font-sans font-black text-[9px] sm:text-xs tracking-wider shadow-xs">
                <span className="uppercase">Insert this way / This side facing you</span>
                <span className="tracking-tighter text-white font-black text-xs sm:text-sm">━▶ ▶ ▶</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Prompt */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2">
          <button
            onClick={handleCardClick}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-zinc-950 font-sans font-black text-xs sm:text-sm tracking-wide uppercase shadow-[0_10px_25px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-zinc-950" />
            <span>SWIPE TO ENTER (FREE)</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </button>

          <p className="max-w-xs text-center text-[10px] sm:text-[11px] font-mono text-zinc-400">
            🔊 Drag card to the right or click to swipe with amplified announcement
          </p>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. BOTTOM FOOTER & QUIET ENTRY OPTION                             */}
      {/* ================================================================= */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 w-full max-w-2xl pt-2 border-t border-zinc-800/80 text-[10px] sm:text-xs font-mono text-zinc-500">
        <span>NYC SUBWAY SYSTEM</span>
        <button
          onClick={() => triggerSuccessEntry(false)}
          className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Enter without sound</span>
        </button>
      </div>
    </motion.div>
  );
}
