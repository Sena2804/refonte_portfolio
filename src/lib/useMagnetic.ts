"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/media";

/**
 * Effet magnétique : l'élément suit légèrement le curseur puis revient à sa
 * place. Désactivé en `prefers-reduced-motion` et sur les pointeurs grossiers
 * (tactile) où l'effet n'a pas de sens.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  strength = 0.35,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!hasFinePointer()) return;

    let raf = 0;

    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // rect lu dans le rAF pour éviter un reflow synchrone par mousemove.
        const rect = el.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "translate3d(0, 0, 0)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
