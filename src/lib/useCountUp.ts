"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/media";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Incrémente une valeur de 0 vers `target` quand l'élément entre dans le
 * viewport. Respecte `prefers-reduced-motion` (affiche directement la valeur).
 */
export function useCountUp(target: number, duration = 1500) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced-motion ou pas d'IntersectionObserver : on affiche directement la
    // valeur finale, au frame suivant (setState hors du corps de l'effet).
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }

    let raf = 0;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.round(easeOut(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { ref, value };
}
