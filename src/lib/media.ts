// Helpers de requêtes média, factorisés (utilisés par les hooks/composants
// d'animation). Sûrs au SSR : renvoient false quand `window` est absent.

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
