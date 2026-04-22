"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const barRef = useRef<HTMLSpanElement>(null);
  const maxRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const doc = document.documentElement;

    function recomputeMax() {
      maxRef.current = Math.max(0, doc.scrollHeight - doc.clientHeight);
    }

    function paint() {
      tickingRef.current = false;
      const max = maxRef.current;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const bar = barRef.current;
      if (bar) bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(paint);
    }

    function onResize() {
      recomputeMax();
      onScroll();
    }

    recomputeMax();
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-16 z-40 h-px bg-transparent"
    >
      <span
        ref={barRef}
        className="block h-full origin-left bg-accent will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
