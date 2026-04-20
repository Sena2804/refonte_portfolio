import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  number?: string;
  children: ReactNode;
  className?: string;
};

export function SectionLabel({ number, children, className }: Props) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.18em] text-muted",
        className,
      )}
    >
      {number ? (
        <>
          <span className="text-foreground">{number}</span>
          <span aria-hidden className="mx-2 opacity-60">
            —
          </span>
        </>
      ) : null}
      {children}
    </p>
  );
}
