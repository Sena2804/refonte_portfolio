import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main id="main" className={cn("min-h-dvh pt-16", className)}>
      {children}
    </main>
  );
}
