import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Padding = "none" | "sm" | "md" | "lg";

type Props = ComponentProps<"div"> & {
  hoverable?: boolean;
  padding?: Padding;
};

const paddings: Record<Padding, string> = {
  none: "",
  sm: "p-5",
  md: "p-7",
  lg: "p-9",
};

export function Card({
  hoverable = false,
  padding = "md",
  className,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface transition-colors duration-300 ease-[var(--ease-out-soft)]",
        paddings[padding],
        hoverable && "hover:border-foreground/30",
        className,
      )}
      {...rest}
    />
  );
}
