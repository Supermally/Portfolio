"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SpatialSectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  initialRotateX?: number;
  initialRotateY?: number;
  initialScale?: number;
  initialTranslateX?: number;
  initialTranslateY?: number;
  exitRotateX?: number;
  exitRotateY?: number;
  exitScale?: number;
  exitTranslateX?: number;
  exitTranslateY?: number;
}

export function SpatialSection({
  id,
  className = "",
  children,
}: SpatialSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const containerEl = containerRef.current;
    const contentEl = contentRef.current;
    if (!containerEl || !contentEl) return;

    // Smooth, lightweight one-time entrance reveal (no scroll hijacking or scrub resistance)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentEl,
        { opacity: 0.92, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerEl,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, containerEl);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} id={id} className={`relative scroll-mt-24 ${className}`}>
      <div ref={contentRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
