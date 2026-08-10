"use client";

import NextLink from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useMagnetic } from "@/lib/useMagnetic";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "link";
type Size = "md" | "lg";

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

const variants: Record<Variant, string> = {
  primary: "btn rounded-full bg-accent text-background",
  ghost:
    "btn rounded-full border border-border bg-transparent text-foreground hover:text-background focus-visible:text-background",
  link: "h-auto px-0 text-foreground underline-offset-[6px] hover:underline",
};

// Couleur de la nappe qui « remplit » le bouton au survol.
const fills: Record<Variant, string> = {
  primary: "bg-foreground",
  ghost: "bg-accent",
  link: "",
};

function buttonClasses(variant: Variant, size: Size, className?: string) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-300 ease-[var(--ease-out-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";
  return cn(
    base,
    variant !== "link" && sizes[size],
    variants[variant],
    className,
  );
}

/** Contenu interne : nappe de remplissage (hors variante texte) + enfants. */
function ButtonInner({
  variant,
  children,
}: {
  variant: Variant;
  children: ReactNode;
}) {
  if (variant === "link") return <>{children}</>;
  return (
    <>
      <span aria-hidden className={cn("btn-fill", fills[variant])} />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </>
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
  children,
  ...rest
}: ButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>();
  return (
    <button
      ref={variant === "link" ? undefined : ref}
      type={type}
      className={buttonClasses(variant, size, className)}
      {...rest}
    >
      <ButtonInner variant={variant}>{children}</ButtonInner>
    </button>
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
  const ref = useMagnetic<HTMLAnchorElement>();
  const classes = buttonClasses(variant, size, className);
  const magneticRef = variant === "link" ? undefined : ref;

  if (external) {
    return (
      <a
        ref={magneticRef}
        className={classes}
        href={typeof href === "string" ? href : "#"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ButtonInner variant={variant}>{children}</ButtonInner>
      </a>
    );
  }
  return (
    <NextLink ref={magneticRef} className={classes} href={href} {...rest}>
      <ButtonInner variant={variant}>{children}</ButtonInner>
    </NextLink>
  );
}
