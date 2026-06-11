"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Rejoue une animation d'entrée discrète à chaque changement de route.
 * En `prefers-reduced-motion`, le bloc reduced-motion de globals.css neutralise
 * l'animation — le contenu apparaît instantanément.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div
      key={pathname}
      className="[animation:page-in_420ms_var(--ease-out-soft)_both]"
    >
      {children}
    </div>
  );
}
