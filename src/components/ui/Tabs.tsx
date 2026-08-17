"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Hauteur de la navbar fixe (`h-16`) — la barre d'onglets se cale dessous. */
const NAVBAR_HEIGHT = 64;

export type TabItem = {
  id: string;
  label: string;
  count?: number;
  panel: ReactNode;
};

/**
 * Onglets au motif ARIA « tabs » : un seul onglet dans l'ordre de tabulation
 * (roving tabindex), navigation aux flèches / Début / Fin, panneaux liés par
 * `aria-controls`.
 *
 * Tous les panneaux restent dans le DOM (`hidden` sur les inactifs) : le
 * contenu est donc lisible par les moteurs et par « rechercher dans la page »,
 * et sans JS le premier onglet s'affiche normalement.
 */
export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const uid = useId();
  const [active, setActive] = useState(items[0]?.id);
  const tabRefs = useRef(new Map<string, HTMLButtonElement | null>());
  const listRef = useRef<HTMLDivElement>(null);

  const select = (id: string, focus = false) => {
    setActive(id);
    if (focus) tabRefs.current.get(id)?.focus();

    // Si la barre est déjà collée (page scrollée), on ramène le haut du nouveau
    // panneau juste sous elle : sinon on atterrit au milieu — ou après la fin —
    // d'un panneau qui n'a pas la longueur du précédent.
    const list = listRef.current;
    if (!list) return;
    const top = list.getBoundingClientRect().top;
    if (top > NAVBAR_HEIGHT + 1) return;
    window.scrollTo({ top: top + window.scrollY - NAVBAR_HEIGHT });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = items.findIndex((t) => t.id === active);
    const last = items.length - 1;
    const next = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(items[next].id, true);
  };

  return (
    <div>
      {/* La barre reste accessible pendant le scroll : `top-16` = sous la
          navbar fixe (h-16). Sans ça, changer d'onglet en bas de liste oblige
          à remonter toute la page. Le fond opaque évite que le contenu défile
          en transparence derrière les libellés. */}
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="sticky top-16 z-30 flex flex-wrap gap-x-10 gap-y-1 border-b border-border bg-background/90 backdrop-blur-xl"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current.set(item.id, node);
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.id)}
              className={cn(
                "-mb-px inline-flex items-baseline gap-2 border-b-2 pb-4 pt-4 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ease-[var(--ease-out-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
                selected
                  ? "border-accent text-accent"
                  : "border-transparent text-foreground hover:border-border hover:text-accent",
              )}
            >
              {item.label}
              {item.count !== undefined ? (
                <span className="text-[10px]">
                  {String(item.count).padStart(2, "0")}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const selected = item.id === active;
        return (
          <div
            // La `key` change à chaque bascule pour rejouer l'apparition du
            // panneau (neutralisée en reduced-motion par globals.css).
            key={`${item.id}-${selected}`}
            role="tabpanel"
            id={`${uid}-panel-${item.id}`}
            aria-labelledby={`${uid}-tab-${item.id}`}
            hidden={!selected}
            tabIndex={0}
            className="mt-12 [animation:page-in_420ms_var(--ease-out-soft)_both] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {item.panel}
          </div>
        );
      })}
    </div>
  );
}
