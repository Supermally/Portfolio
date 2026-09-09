"use client";

import { useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type SpatialMilestone = 
  | "map-hero-unified"
  | "status"
  | "skills"
  | "resume"
  | "contact";

export interface MilestoneConfig {
  id: SpatialMilestone;
  label: string;
  code: string;
}

export const SPATIAL_MILESTONES: MilestoneConfig[] = [
  { id: "map-hero-unified", label: "Map & Spine", code: "01" },
  { id: "status", label: "Departures", code: "02" },
  { id: "skills", label: "System Guide", code: "03" },
  { id: "resume", label: "Fare Card", code: "04" },
  { id: "contact", label: "Platform Exits", code: "05" },
];

export function useSpatialCamera() {
  const prefersReducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState<SpatialMilestone>("map-hero-unified");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sectionElements = SPATIAL_MILESTONES.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el) {
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = useCallback((milestoneId: SpatialMilestone) => {
    const el = document.getElementById(milestoneId);
    if (!el) return;

    if (prefersReducedMotion) {
      el.scrollIntoView({ behavior: "auto" });
      return;
    }

    el.scrollIntoView({ behavior: "smooth" });
  }, [prefersReducedMotion]);

  return {
    activeSection,
    isScrolled,
    navigateTo,
    milestones: SPATIAL_MILESTONES,
  };
}
