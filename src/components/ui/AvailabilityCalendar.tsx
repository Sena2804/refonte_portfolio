"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useLocalTime } from "@/lib/useLocalTime";
import { cn } from "@/lib/cn";
import {
  DEFAULT_AVAILABILITY,
  STATUS_LABELS,
  type Availability,
  type AvailabilityStatus,
} from "@/lib/availability";

// Localisation affichée au-dessus du calendrier. Prémicia fournira l'exacte —
// `timeZone` doit rester un identifiant IANA valide.
const LOCATION = {
  city: "Cotonou",
  country: "Bénin",
  timeZone: "Africa/Porto-Novo",
};

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

const STATUS_DOT: Record<AvailabilityStatus, string> = {
  open: "bg-ok",
  limited: "bg-accent",
  closed: "bg-muted",
};

type Day = { n: number; key: string; weekend: boolean; today: boolean } | null;
type Calendar = { label: string; days: Day[] };

/** Clé "YYYY-MM-DD" locale (pas d'UTC : le calendrier suit la date affichée). */
function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Calendrier de disponibilités du mois courant : jours de semaine grisés,
 * week-ends mis en avant (disponibilité pour se voir), jours bloqués barrés.
 * Le statut et les jours bloqués viennent de /admin. Le mois est calculé après
 * montage pour éviter tout mismatch d'hydratation (la date dépend du client).
 */
export function AvailabilityCalendar({
  availability = DEFAULT_AVAILABILITY,
  className,
}: {
  availability?: Availability;
  className?: string;
}) {
  const time = useLocalTime(LOCATION.timeZone);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const busy = new Set(availability.busyDates);

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
        days.push({
          n: d,
          key: dateKey(year, month, d),
          weekend: wd === 0 || wd === 6,
          today: d === todayN,
        });
      }
      setCalendar({ label, days });
    };
    const raf = requestAnimationFrame(build);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cells: Day[] = calendar?.days ?? Array.from({ length: 35 }, () => null);
  const statusLabel = STATUS_LABELS[availability.status];

  return (
    <div
      className={cn(
        "w-full max-w-[20rem] rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur",
        className,
      )}
    >
      <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background/60 py-1.5 pl-3 pr-4">
        <span aria-hidden className="relative flex h-2 w-2">
          {availability.status === "open" ? (
            <span className="status-pulse absolute inset-0 rounded-full bg-ok" />
          ) : null}
          <span
            className={cn(
              "relative h-2 w-2 rounded-full",
              STATUS_DOT[availability.status],
            )}
          />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">
          {statusLabel}
        </span>
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
          {LOCATION.city} — {LOCATION.country}
        </span>
        <span className="font-mono text-[11px] tabular-nums tracking-[0.1em] text-muted">
          {time ?? "—:—"}
        </span>
      </div>

      <p className="mt-4 font-display text-xl capitalize leading-none tracking-tight">
        {calendar?.label ?? " "}
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
        {cells.map((day, i) => {
          if (!day) return <span key={i} className="aspect-square" />;
          const isBusy = busy.has(day.key);
          return (
            <span
              key={i}
              aria-current={day.today ? "date" : undefined}
              title={isBusy ? "Indisponible" : undefined}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg font-mono text-xs tabular-nums",
                day.weekend ? "bg-accent-soft text-accent" : "text-muted/40",
                isBusy && "text-muted/40 line-through decoration-muted/60",
                day.today &&
                  "font-semibold text-foreground ring-1 ring-inset ring-accent",
              )}
            >
              {day.n}
            </span>
          );
        })}
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-4">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-3 rounded bg-accent-soft" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Week-ends · dispo pour se voir
          </span>
        </span>
        <p className="text-[13px] leading-relaxed text-muted">
          {availability.message}
        </p>
      </div>
    </div>
  );
}
