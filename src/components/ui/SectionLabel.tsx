import { createElement } from "react";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  number?: string;
  children: ReactNode;
  className?: string;
  /**
   * Balise rendue. Par défaut `p` — mais quand l'étiquette est le vrai titre
   * d'une section, il faut un `h2`/`h3`, sinon la page saute des niveaux et
   * la navigation au lecteur d'écran devient incohérente.
   */
  as?: ElementType;
};

export function SectionLabel({ number, children, className, as = "p" }: Props) {
  return createElement(
    as,
    {
      className: cn(
        "font-mono text-[11px] uppercase tracking-[0.18em] text-foreground",
        className,
      ),
    },
    <>
      {number ? (
        <>
          {/* Le numéro est le seul endroit où l'encre apparaît par défaut :
              une touche de couleur par section, jamais sur le texte courant. */}
          <span className="text-accent">{number}</span>
          <span aria-hidden className="mx-2">
            —
          </span>
        </>
      ) : null}
      {children}
    </>,
  );
}
