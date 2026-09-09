"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function HeroObject() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="w-full h-full absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-90"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Soft Background Territory / Borough Watermark Labels */}
        <text
          x="150"
          y="180"
          className="font-sans font-black text-6xl fill-zinc-300/40 tracking-wider uppercase"
        >
          HARDWARE & CIRCUITS
        </text>
        <text
          x="750"
          y="160"
          className="font-sans font-black text-6xl fill-zinc-300/40 tracking-wider uppercase"
        >
          FLIGHT & DYNAMICS
        </text>
        <text
          x="650"
          y="620"
          className="font-sans font-black text-6xl fill-zinc-300/40 tracking-wider uppercase"
        >
          POLICY & GOVERNANCE
        </text>

        {/* Subtle Transit Map Grid Lines */}
        <g stroke="rgba(140, 130, 115, 0.15)" strokeWidth="1" strokeDasharray="6 6">
          <line x1="0" y1="200" x2="1200" y2="200" />
          <line x1="0" y1="400" x2="1200" y2="400" />
          <line x1="0" y1="600" x2="1200" y2="600" />
          <line x1="300" y1="0" x2="300" y2="700" />
          <line x1="600" y1="0" x2="600" y2="700" />
          <line x1="900" y1="0" x2="900" y2="700" />
        </g>

        {/* 1. Computer Systems / EE Line (MTA Orange #ff6319) */}
        <motion.path
          d="M 50 180 L 320 180 L 520 380 L 880 380 L 1150 200"
          stroke="#ff6319"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />

        {/* 2. Aerospace Dynamics Line (MTA Blue #0039a6) */}
        <motion.path
          d="M 1150 120 L 850 120 L 600 370 L 600 550 L 350 550"
          stroke="#0039a6"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 0.2, ease: "easeInOut" }}
        />

        {/* 3. Systems Policy / Political Science Line (MTA Red #ee352e) */}
        <motion.path
          d="M 80 620 L 450 620 L 620 450 L 620 380 L 1050 380"
          stroke="#ee352e"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.7, delay: 0.3, ease: "easeInOut" }}
        />

        {/* Intermediate Station Bullets along routes */}
        {/* EE Station */}
        <circle cx="240" cy="180" r="7" fill="#ffffff" stroke="#ff6319" strokeWidth="4" />
        <text x="240" y="155" textAnchor="middle" className="font-sans font-bold text-xs fill-zinc-700">
          RTOS EMBEDDED
        </text>

        {/* Aero Station */}
        <circle cx="980" cy="120" r="7" fill="#ffffff" stroke="#0039a6" strokeWidth="4" />
        <text x="980" y="95" textAnchor="middle" className="font-sans font-bold text-xs fill-zinc-700">
          PROPULSION CFD
        </text>

        {/* Polisci Station */}
        <circle cx="260" cy="620" r="7" fill="#ffffff" stroke="#ee352e" strokeWidth="4" />
        <text x="260" y="650" textAnchor="middle" className="font-sans font-bold text-xs fill-zinc-700">
          EXPORT CONTROL
        </text>

        {/* Major Central Transfer Interchange: Grand Central Terminal Hub */}
        <g transform="translate(600, 380)">
          {/* Outer Hub Ring */}
          <circle cx="0" cy="0" r="26" fill="#18181b" />
          <circle cx="0" cy="0" r="22" fill="#ffffff" />
          <circle cx="0" cy="0" r="14" fill="#18181b" />
          <circle cx="0" cy="0" r="6" fill="#ffffff" />

          {/* Transfer Pill Label */}
          <g transform="translate(-80, -48)">
            <rect
              width="160"
              height="26"
              rx="13"
              fill="#18181b"
              className="drop-shadow-sm"
            />
            <text
              x="80"
              y="17"
              textAnchor="middle"
              className="font-sans font-extrabold text-xs fill-white tracking-wide"
            >
              GRAND CENTRAL HUB
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
