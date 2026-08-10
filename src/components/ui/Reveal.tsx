"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 16, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Sans IntersectionObserver, on révèle au prochain frame (setState hors du
    // corps synchrone de l'effet). En reduced-motion, le bloc dédié de
    // globals.css neutralise transition durée + délai : l'apparition est
    // instantanée dès que l'observer déclenche.
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[transform,opacity] duration-[600ms] ease-[var(--ease-out-soft)] will-change-transform",
        className,
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible
          ? "translate3d(0,0,0)"
          : `translate3d(0,${y}px,0)`,
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
