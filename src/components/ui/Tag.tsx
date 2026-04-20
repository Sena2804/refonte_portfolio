import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
