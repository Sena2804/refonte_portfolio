import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "display" | "page" | "section" | "card";

type Props = {
  as?: ElementType;
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

const variants: Record<Variant, string> = {
  display:
    "font-display font-normal text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.02em]",
  page:
    "font-display font-normal text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.015em]",
  section:
    "font-display font-normal text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] tracking-[-0.01em]",
  card: "font-sans font-semibold text-xl leading-tight tracking-tight",
};

function defaultTag(variant: Variant): ElementType {
  if (variant === "display" || variant === "page") return "h1";
  if (variant === "section") return "h2";
  return "h3";
}

export function Heading({
  as,
  variant = "section",
  children,
  className,
}: Props) {
  const Tag = as ?? defaultTag(variant);
  return <Tag className={cn(variants[variant], className)}>{children}</Tag>;
}
