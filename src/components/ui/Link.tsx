import NextLink from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const underline =
  "relative inline-flex items-baseline gap-1 text-foreground transition-colors duration-200 after:pointer-events-none after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-[var(--ease-out-soft)] hover:after:origin-left hover:after:scale-x-100 focus-visible:outline-none focus-visible:after:origin-left focus-visible:after:scale-x-100";

type Props = Omit<ComponentProps<typeof NextLink>, "className"> & {
  children: ReactNode;
  className?: string;
  external?: boolean;
};

export function Link({
  children,
  className,
  external,
  href,
  ...rest
}: Props) {
  const classes = cn(underline, className);
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
