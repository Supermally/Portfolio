import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin strictly for Hero scroll handoff
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SetupHeroScrollOptions {
  triggerElement: HTMLElement;
  headlineElement: HTMLElement | null;
  subheadElement: HTMLElement | null;
  mapGraphicElement?: HTMLElement | null;
  reducedMotion?: boolean;
}

export function setupHeroScrollSequence({
  triggerElement,
  headlineElement,
  subheadElement,
  mapGraphicElement,
  reducedMotion = false,
}: SetupHeroScrollOptions) {
  if (reducedMotion || !triggerElement) {
    return {
      destroy: () => {},
    };
  }

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: false,
      },
    });

    if (headlineElement) {
      tl.to(
        headlineElement,
        {
          opacity: 0.2,
          y: -30,
          ease: "power1.out",
        },
        0
      );
    }

    if (subheadElement) {
      tl.to(
        subheadElement,
        {
          opacity: 0,
          y: -45,
          ease: "power1.out",
        },
        0
      );
    }

    if (mapGraphicElement) {
      tl.to(
        mapGraphicElement,
        {
          scale: 1.06,
          opacity: 0.4,
          ease: "none",
        },
        0
      );
    }
  }, triggerElement);

  return {
    destroy: () => {
      ctx.revert();
    },
  };
}
