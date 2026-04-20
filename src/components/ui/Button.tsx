import NextLink from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "link";
type Size = "md" | "lg";

function buttonClasses(variant: Variant, size: Size, className?: string) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 ease-[var(--ease-out-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";
  const sizes: Record<Size, string> = {
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-7 text-[15px]",
  };
  const variants: Record<Variant, string> = {
    primary: "rounded-full bg-accent text-background hover:bg-foreground",
    ghost:
      "rounded-full border border-border bg-transparent text-foreground hover:border-foreground hover:bg-surface",
    link: "h-auto px-0 text-foreground underline-offset-[6px] hover:underline",
  };
  return cn(
    base,
    variant !== "link" && sizes[size],
    variants[variant],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...rest}
    />
  );
}

type ButtonLinkProps = Omit<ComponentProps<typeof NextLink>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  external,
  href,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  if (external) {
    return (
      <a
        className={classes}
        href={typeof href === "string" ? href : "#"}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <NextLink className={classes} href={href} {...rest}>
      {children}
    </NextLink>
  );
}
