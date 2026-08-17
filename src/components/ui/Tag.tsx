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
        "inline-flex items-center rounded-full border border-border bg-background px-3 py-1 font-mono text-label uppercase tracking-[0.1em] text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
