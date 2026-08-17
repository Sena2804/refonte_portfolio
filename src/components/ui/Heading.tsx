import { createElement } from "react";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "display" | "page" | "section" | "item" | "sub";

type Props = {
  as?: ElementType;
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

/**
 * Les cinq seules tailles de titre du site. Tout titre passe par ici : c'est ce
 * qui garantit qu'un titre d'entrée de liste a la même taille sur /projets, sur
 * /parcours et sur l'accueil.
 *
 * - `display` : le hero et l'appel de contact, une fois par page maximum
 * - `page`    : le titre de la page
 * - `section` : une grande partie de page
 * - `item`    : une entrée de liste (projet, expérience, formation)
 * - `sub`     : un titre dense (carte, ligne de CV, en-tête de composant)
 */
const variants: Record<Variant, string> = {
  display:
    "font-display font-normal text-display leading-[0.98] tracking-[-0.02em]",
  page: "font-display font-normal text-title leading-[1.05] tracking-[-0.015em]",
  section:
    "font-display font-normal text-section leading-[1.15] tracking-[-0.015em]",
  item: "font-display font-normal text-item leading-tight tracking-[-0.01em]",
  sub: "font-display font-normal text-sub leading-snug tracking-[-0.01em]",
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
  const tag = as ?? defaultTag(variant);
  return createElement(
    tag,
    { className: cn(variants[variant], className) },
    children,
  );
}
