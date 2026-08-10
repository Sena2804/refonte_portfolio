"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/media";

/**
 * Décor de hero : nappes de couleur animées (aurora) + spotlight qui suit le
 * curseur + grain léger. Purement décoratif (aria-hidden), placé en arrière-plan.
 * Le spotlight est désactivé sur pointeur grossier et en reduced-motion.
 */
export function Aurora() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!hasFinePointer()) return;
    if (prefersReducedMotion()) return;

    let raf = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const inside =
          x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
        el.style.setProperty("--spot-x", `${x}px`);
        el.style.setProperty("--spot-y", `${y}px`);
        el.style.setProperty("--spot-o", inside ? "1" : "0");
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="aurora" />
      <div className="spotlight" />
      <div className="grain" />
    </div>
  );
}
