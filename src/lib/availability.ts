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

/** Libellés publics. C'est cette table qui définit les statuts existants. */
export const STATUS_LABELS = {
  open: "Disponible",
  limited: "Peu de créneaux",
  closed: "Indisponible",
} as const;

export type AvailabilityStatus = keyof typeof STATUS_LABELS;

/** Ordre d'affichage, dérivé pour ne pas pouvoir se désynchroniser des libellés. */
export const STATUS_ORDER = Object.keys(STATUS_LABELS) as AvailabilityStatus[];

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

/** Longueur max de la phrase — partagée avec le champ de saisie de /admin. */
export const MESSAGE_MAX = 180;

export const DEFAULT_AVAILABILITY: Availability = {
  status: "open",
  message:
    "Disponible pour des missions en full remote — on peut se voir le week-end.",
  busyDates: [],
  updatedAt: null,
};

const KV_KEY = "portfolio-availability";
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

/** Clé "YYYY-MM-DD" à partir d'une date locale (pas d'UTC : on suit l'affichage). */
export function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

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

/**
 * État d'une journée dans le calendrier. Source unique : la grille, la légende
 * et les couleurs en dépendent toutes, donc elles ne peuvent pas se contredire.
 *
 * - `free` : ouverte à un rendez-vous (week-end, si le statut n'est pas fermé)
 * - `busy` : explicitement bloquée depuis /admin
 * - `idle` : jour ordinaire, rien à signaler
 */
export type DayState = "free" | "busy" | "idle";

export function dayState(
  availability: Availability,
  day: { key: string; weekend: boolean },
): DayState {
  if (availability.busyDates.includes(day.key)) return "busy";
  // Statut fermé : plus aucun jour n'est proposé, week-ends compris. Sans ça le
  // hero afficherait « Indisponible » au-dessus de week-ends peints en accent.
  if (availability.status === "closed") return "idle";
  return day.weekend ? "free" : "idle";
}

/**
 * Lit la disponibilité.
 *
 * `fresh` court-circuite le Data Cache — réservé à /admin, qui doit montrer ce
 * qui est réellement stocké. Attention : `dynamic = "force-dynamic"` ne suffit
 * PAS à obtenir cet effet, car un `cache` explicite sur le fetch prime sur lui
 * (cf. `noFetchConfigAndForceDynamic` dans le patch-fetch de Next).
 */
export async function getAvailability({ fresh = false } = {}): Promise<Availability> {
  const config = kvConfig();
  if (!config) return memoryStore ?? DEFAULT_AVAILABILITY;

  try {
    const res = await fetch(`${config.url}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${config.token}` },
      // Étiqueté pour rester prérendu ; `revalidate` est un filet de sécurité
      // si la valeur est modifiée directement dans Upstash, hors /admin.
      ...(fresh
        ? { cache: "no-store" as const }
        : {
            cache: "force-cache" as const,
            next: { tags: [AVAILABILITY_TAG], revalidate: 3600 },
          }),
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

/**
 * Écrit la disponibilité.
 *
 * `persisted` distingue une vraie écriture d'un repli en mémoire, pour que
 * /admin puisse le dire au lieu d'annoncer un succès trompeur.
 */
export async function setAvailability(
  value: Availability,
): Promise<{ ok: boolean; persisted: boolean }> {
  const config = kvConfig();
  if (!config) {
    memoryStore = value;
    return { ok: true, persisted: false };
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
    return { ok: res.ok, persisted: res.ok };
  } catch {
    return { ok: false, persisted: false };
  }
}

/** Ligne injectée dans le system prompt du chat, pour qu'il reste à jour. */
export function describeAvailability(value: Availability): string {
  return `${STATUS_LABELS[value.status]} — ${value.message}`;
}
