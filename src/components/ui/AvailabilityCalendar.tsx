"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useLocalTime } from "@/lib/useLocalTime";
import { cn } from "@/lib/cn";

// Localisation affichée au-dessus du calendrier. Prémicia fournira l'exacte —
// `timeZone` doit rester un identifiant IANA valide.
const LOCATION = {
  city: "Cotonou",
  country: "Bénin",
  timeZone: "Africa/Porto-Novo",
};

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

type Day = { n: number; weekend: boolean; today: boolean } | null;
type Calendar = { label: string; days: Day[] };

/**
 * Calendrier de disponibilités du mois courant : jours de semaine grisés,
 * week-ends mis en avant (disponibilité pour se voir). Calculé après montage
 * pour éviter tout mismatch d'hydratation (la date dépend du client).
 */
export function AvailabilityCalendar({ className }: { className?: string }) {
  const time = useLocalTime(LOCATION.timeZone);
  const [calendar, setCalendar] = useState<Calendar | null>(null);

  useEffect(() => {
    const build = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const todayN = now.getDate();
      const label = new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric",
      }).format(now);
      const firstIdx = (new Date(year, month, 1).getDay() + 6) % 7; // lundi = 0
      const total = new Date(year, month + 1, 0).getDate();

      const days: Day[] = [];
      for (let i = 0; i < firstIdx; i++) days.push(null);
      for (let d = 1; d <= total; d++) {
        const wd = new Date(year, month, d).getDay();
        days.push({ n: d, weekend: wd === 0 || wd === 6, today: d === todayN });
      }
      setCalendar({ label, days });
    };
    const raf = requestAnimationFrame(build);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cells: Day[] = calendar?.days ?? Array.from({ length: 35 }, () => null);

  return (
    <div
      className={cn(
        "w-full max-w-[20rem] rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
          {LOCATION.city} — {LOCATION.country}
        </span>
        <span className="font-mono text-[11px] tabular-nums tracking-[0.1em] text-muted">
          {time ?? "—:—"}
        </span>
      </div>

      <p className="mt-4 font-display text-xl capitalize leading-none tracking-tight">
        {calendar?.label ?? " "}
      </p>

      <div className="mt-5 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d, i) => (
          <span
            key={`h-${i}`}
            className="pb-1 text-center font-mono text-[10px] uppercase text-muted/70"
          >
            {d}
          </span>
        ))}
        {cells.map((day, i) =>
          day ? (
            <span
              key={i}
              aria-current={day.today ? "date" : undefined}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg font-mono text-xs tabular-nums",
                day.weekend
                  ? "bg-accent-soft text-accent"
                  : "text-muted/40",
                day.today &&
                  "font-semibold text-foreground ring-1 ring-inset ring-accent",
              )}
            >
              {day.n}
            </span>
          ) : (
            <span key={i} className="aspect-square" />
          ),
        )}
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
        <span aria-hidden className="h-3 w-3 rounded bg-accent-soft" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          Week-ends · dispo pour se voir
        </span>
      </div>
    </div>
  );
}
