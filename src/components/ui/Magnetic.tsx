"use client";

import type { ReactNode } from "react";
import { useMagnetic } from "@/lib/useMagnetic";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

/**
 * Enveloppe un élément interactif (CTA, lien) d'un effet magnétique discret.
 * Le retour à la position est animé ; le suivi du curseur traîne légèrement,
 * ce qui donne la sensation « élastique » premium.
 */
export function Magnetic({ children, strength, className }: Props) {
  const ref = useMagnetic<HTMLSpanElement>(strength);
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex [transition:transform_350ms_var(--ease-out-soft)] will-change-transform",
        className,
      )}
    >
      {children}
    </span>
  );
}
