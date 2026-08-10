/**
 * Disponibilité pilotée depuis /admin.
 *
 * Stockage : Upstash Redis via son API REST (pas de SDK — un `fetch` suffit).
 * La lecture est mise en cache et étiquetée `AVAILABILITY_TAG` : les pages qui
 * l'affichent restent prérendues, et l'action d'enregistrement invalide le tag
 * pour que la modification apparaisse immédiatement.
 *
 * Sans variables Upstash, tout dégrade proprement : lecture sur une valeur par
 * défaut, écriture en mémoire du process (utile en local, jamais persistée).
 */

export type AvailabilityStatus = "open" | "limited" | "closed";

export type Availability = {
  status: AvailabilityStatus;
  /** Une phrase, affichée telle quelle dans le hero et reprise par le chat. */
  message: string;
  /** Jours barrés dans le calendrier, au format "YYYY-MM-DD". */
  busyDates: string[];
  /** ISO 8601, ou null si la valeur n'a jamais été enregistrée. */
  updatedAt: string | null;
};

export const AVAILABILITY_TAG = "availability";

export const STATUS_LABELS: Record<AvailabilityStatus, string> = {
  open: "Disponible",
  limited: "Peu de créneaux",
  closed: "Indisponible",
};

export const STATUS_ORDER: AvailabilityStatus[] = ["open", "limited", "closed"];

export const DEFAULT_AVAILABILITY: Availability = {
  status: "open",
  message:
    "Disponible pour des missions en full remote — on peut se voir le week-end.",
  busyDates: [],
  updatedAt: null,
};

const KV_KEY = "portfolio-availability";
const MESSAGE_MAX = 180;
const BUSY_DATES_MAX = 62;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function kvConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

/** Le stockage persistant est-il branché ? (l'admin le signale à Prémicia) */
export function isStorageConfigured(): boolean {
  return kvConfig() !== null;
}

/** Repli local quand Upstash n'est pas configuré — volatile, jamais persisté. */
let memoryStore: Availability | null = null;

/** Une date "YYYY-MM-DD" réelle (rejette 2026-02-31). */
export function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Normalise une valeur d'origine externe (KV, formulaire) vers la forme canonique. */
export function parseAvailability(input: unknown): Availability {
  if (!input || typeof input !== "object") return DEFAULT_AVAILABILITY;
  const raw = input as Record<string, unknown>;

  const status = STATUS_ORDER.includes(raw.status as AvailabilityStatus)
    ? (raw.status as AvailabilityStatus)
    : DEFAULT_AVAILABILITY.status;

  const message =
    typeof raw.message === "string" && raw.message.trim()
      ? raw.message.trim().slice(0, MESSAGE_MAX)
      : DEFAULT_AVAILABILITY.message;

  const busyDates = Array.isArray(raw.busyDates)
    ? Array.from(
        new Set(
          raw.busyDates.filter(
            (d): d is string => typeof d === "string" && isValidDate(d),
          ),
        ),
      )
        .sort()
        .slice(0, BUSY_DATES_MAX)
    : [];

  const updatedAt =
    typeof raw.updatedAt === "string" && !Number.isNaN(Date.parse(raw.updatedAt))
      ? raw.updatedAt
      : null;

  return { status, message, busyDates, updatedAt };
}

export async function getAvailability(): Promise<Availability> {
  const config = kvConfig();
  if (!config) return memoryStore ?? DEFAULT_AVAILABILITY;

  try {
    const res = await fetch(`${config.url}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${config.token}` },
      // Étiqueté pour rester prérendu ; `revalidate` est un filet de sécurité
      // si la valeur est modifiée directement dans Upstash, hors /admin.
      cache: "force-cache",
      next: { tags: [AVAILABILITY_TAG], revalidate: 3600 },
    });
    if (!res.ok) return DEFAULT_AVAILABILITY;

    const body = (await res.json()) as { result?: string | null };
    if (!body.result) return DEFAULT_AVAILABILITY;
    return parseAvailability(JSON.parse(body.result));
  } catch {
    // Upstash indisponible ou JSON corrompu : on n'affiche jamais d'erreur au
    // visiteur, on retombe sur la valeur par défaut.
    return DEFAULT_AVAILABILITY;
  }
}

/** Écrit la disponibilité. Retourne false si le stockage a refusé l'écriture. */
export async function setAvailability(value: Availability): Promise<boolean> {
  const config = kvConfig();
  if (!config) {
    memoryStore = value;
    return true;
  }

  try {
    const res = await fetch(`${config.url}/set/${KV_KEY}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Ligne injectée dans le system prompt du chat, pour qu'il reste à jour. */
export function describeAvailability(value: Availability): string {
  return `${STATUS_LABELS[value.status]} — ${value.message}`;
}
