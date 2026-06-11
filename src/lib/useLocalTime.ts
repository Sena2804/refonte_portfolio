"use client";

import { useEffect, useState } from "react";

/**
 * Heure locale formatée (HH:MM) pour un fuseau donné, rafraîchie chaque minute.
 * Rendue `null` au SSR / avant montage pour éviter tout mismatch d'hydratation.
 */
export function useLocalTime(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }).format(new Date());
    const tick = () => setTime(format());
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 30_000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [timeZone]);

  return time;
}
