"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProjectCover, type CoverData } from "./ProjectCover";

/**
 * Aperçu flottant d'un projet qui suit le curseur au survol de la ligne parente.
 * À placer comme dernier enfant de la ligne (le `group`). Désactivé sur pointeur
 * grossier (tactile) — l'aperçu n'a alors pas de sens.
 */
export function HoverPreview({ project }: { project: CoverData }) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const row = anchorRef.current?.parentElement;
    if (!row) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setCoords({ x: event.clientX, y: event.clientY }),
      );
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      setCoords(null);
    };

    row.addEventListener("pointermove", onMove, { passive: true });
    row.addEventListener("pointerleave", onLeave);
    return () => {
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span ref={anchorRef} aria-hidden>
      {coords
        ? createPortal(
            <div
              className="pointer-events-none fixed z-50 w-60 [animation:preview-in_260ms_var(--ease-out-soft)_both]"
              style={{ left: coords.x, top: coords.y }}
            >
              <ProjectCover project={project} className="shadow-xl" />
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
