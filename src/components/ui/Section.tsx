import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
  size?: Size;
  as?: "section" | "article" | "div";
};

const paddings: Record<Size, string> = {
  sm: "py-12 lg:py-16",
  md: "py-20 lg:py-28",
  lg: "py-28 lg:py-36",
};

export function Section({
  id,
  children,
  className,
  size = "md",
  as = "section",
}: Props) {
  const Tag = as;
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full max-w-[1200px] px-[clamp(1rem,4vw,2.5rem)]",
        paddings[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
