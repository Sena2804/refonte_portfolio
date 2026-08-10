/**
 * Fenêtre glissante en mémoire, best-effort.
 *
 * « Best-effort » est à prendre au sérieux : chaque instance serverless a sa
 * propre fenêtre, donc ça ne remplace pas un compteur partagé. C'est un
 * garde-fou contre le bourrinage naïf, pas une garantie.
 */
export function slidingWindow({
  max,
  windowMs,
}: {
  max: number;
  windowMs: number;
}) {
  const seen = new Map<string, number[]>();

  return {
    /** Enregistre un passage. Retourne false si le quota est déjà atteint. */
    take(key: string, now = Date.now()): boolean {
      const recent = (seen.get(key) ?? []).filter((t) => now - t < windowMs);
      const allowed = recent.length < max;
      if (allowed) recent.push(now);
      // Purge plutôt que de garder une clé vide : sans ça, chaque IP croisée
      // laisse une entrée résidente pour la durée de vie du process.
      if (recent.length === 0) seen.delete(key);
      else seen.set(key, recent);
      return allowed;
    },
    reset(key: string): void {
      seen.delete(key);
    },
  };
}

/**
 * Identifie l'appelant pour la limitation. Accepte aussi bien les `Headers`
 * d'une `Request` que ceux de `next/headers`.
 */
export function clientKey(headers: { get(name: string): string | null }): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
