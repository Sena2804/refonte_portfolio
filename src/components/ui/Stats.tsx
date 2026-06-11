"use client";

import { useCountUp } from "@/lib/useCountUp";
import { cn } from "@/lib/cn";

export type Stat = {
  /** Valeur numérique animée. Omise pour une valeur texte statique (ex. année). */
  value?: number;
  /** Valeur texte affichée telle quelle quand `value` est absent. */
  text?: string;
  /** Suffixe collé à la valeur (ex. "+", "%"). */
  suffix?: string;
  /** Remplit la valeur sur 2 chiffres (07, 09...). */
  pad?: boolean;
  label: string;
};

function StatNumber({ stat }: { stat: Stat }) {
  const { ref, value } = useCountUp(stat.value ?? 0);
  const display = stat.pad ? String(value).padStart(2, "0") : String(value);
  return (
    <span ref={ref}>
      {display}
      {stat.suffix}
    </span>
  );
}

export function Stats({
  items,
  className,
}: {
  items: Stat[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4",
        className,
      )}
    >
      {items.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-3 bg-background p-8 lg:p-10"
        >
          <dd className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-none tracking-tight">
            {stat.value !== undefined ? (
              <StatNumber stat={stat} />
            ) : (
              <span>{stat.text}</span>
            )}
          </dd>
          <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
