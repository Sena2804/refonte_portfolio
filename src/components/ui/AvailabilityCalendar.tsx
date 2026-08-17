"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useLocalTime } from "@/lib/useLocalTime";
import { cn } from "@/lib/cn";
import { SITE_LOCATION } from "@/lib/site";
import {
  DEFAULT_AVAILABILITY,
  dayState,
  STATUS_LABELS,
  toDateKey,
  type Availability,
  type AvailabilityStatus,
  type DayState,
} from "@/lib/availability";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

const STATUS_DOT: Record<AvailabilityStatus, string> = {
  open: "bg-ok",
  limited: "bg-accent",
  closed: "bg-faint",
};

// Une seule classe de couleur par état : pas de conflit possible entre règles
// (`cn` concatène sans arbitrer, contrairement à tailwind-merge).
const DAY_STYLES: Record<DayState, string> = {
  free: "bg-accent-soft text-accent",
  busy: "text-faint line-through decoration-faint",
  idle: "text-faint",
};

type Day = { n: number; key: string; weekend: boolean; today: boolean } | null;
type Calendar = { label: string; days: Day[] };

/**
 * Calendrier de disponibilités du mois courant. L'état de chaque jour est
 * dérivé par `dayState`, partagé avec la légende : le statut et la grille ne
 * peuvent donc pas se contredire. Le mois est calculé après montage pour
 * éviter tout mismatch d'hydratation (la date dépend du client).
 */
export function AvailabilityCalendar({
  availability = DEFAULT_AVAILABILITY,
  className,
}: {
  availability?: Availability;
  className?: string;
}) {
  const time = useLocalTime(SITE_LOCATION.timeZone);
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
        days.push({
          n: d,
          key: toDateKey(year, month, d),
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
  const states = cells.map((day) => (day ? dayState(availability, day) : null));
  // Légende dérivée du mois réellement affiché, pas codée en dur.
  const hasFree = states.includes("free");
  const hasBusy = states.includes("busy");

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
        <span className="font-mono text-label uppercase tracking-[0.18em] text-foreground">
          {STATUS_LABELS[availability.status]}
        </span>
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-label uppercase tracking-[0.18em] text-foreground">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
          {SITE_LOCATION.city} — {SITE_LOCATION.country}
        </span>
        <span className="font-mono text-label tabular-nums tracking-[0.1em] text-foreground">
          {time ?? "—:—"}
        </span>
      </div>

      <p className="mt-4 font-display text-sub capitalize leading-none tracking-tight">
        {calendar?.label ?? " "}
      </p>

      <div className="mt-5 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d, i) => (
          <span
            key={`h-${i}`}
            className="pb-1 text-center font-mono text-label uppercase text-faint"
          >
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          const state = states[i];
          if (!day || !state) return <span key={i} className="aspect-square" />;
          return (
            <span
              key={i}
              aria-current={day.today ? "date" : undefined}
              title={state === "busy" ? "Indisponible" : undefined}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg font-mono text-label tabular-nums",
                DAY_STYLES[state],
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
        {hasFree ? (
          <span className="flex items-start gap-2">
            <span aria-hidden className="mt-0.5 h-3 w-3 shrink-0 rounded bg-accent-soft" />
            <span className="font-mono text-label uppercase tracking-[0.18em] text-foreground">
              Week-ends · dispo pour se voir
            </span>
          </span>
        ) : null}
        {hasBusy ? (
          <span className="flex items-start gap-2">
            {/* Diagonale dessinée en dégradé : un `line-through` sur un carré
                vide ne rendrait rien. */}
            <span
              aria-hidden
              className="mt-0.5 h-3 w-3 shrink-0 rounded border border-border bg-[linear-gradient(to_top_right,transparent_46%,currentColor_46%,currentColor_54%,transparent_54%)] text-faint"
            />
            <span className="font-mono text-label uppercase tracking-[0.18em] text-foreground">
              Jours déjà pris
            </span>
          </span>
        ) : null}
        <p className="text-label leading-relaxed text-foreground">
          {availability.message}
        </p>
      </div>
    </div>
  );
}
