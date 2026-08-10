import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Session admin minimale : un cookie httpOnly signé HMAC-SHA256.
 *
 * Pas de base utilisateurs, pas de librairie d'auth — il n'y a qu'une seule
 * personne à authentifier. Le mot de passe et le secret de signature vivent
 * dans l'environnement ; sans eux, /admin se déclare non configuré et aucune
 * écriture n'est possible.
 */

export const ADMIN_COOKIE = "premicia_admin";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 heures

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

/** /admin n'est utilisable que si les deux variables sont définies. */
export function isAdminConfigured(): boolean {
  return adminPassword().length > 0 && sessionSecret().length > 0;
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

/** Comparaison à durée constante, sur des empreintes de longueur fixe. */
function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", sessionSecret()).update(a).digest();
  const hb = createHmac("sha256", sessionSecret()).update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string): boolean {
  if (!isAdminConfigured()) return false;
  return safeEqual(input, adminPassword());
}

/** Jeton `expiration.nonce.signature`. Le nonce évite deux jetons identiques. */
export function createSessionToken(now = Date.now()): string {
  const payload = `${now + SESSION_MAX_AGE * 1000}.${randomBytes(9).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(
  token: string | undefined,
  now = Date.now(),
): boolean {
  if (!token || !isAdminConfigured()) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expires, nonce, signature] = parts;
  if (!safeEqual(signature, sign(`${expires}.${nonce}`))) return false;

  const expiresAt = Number(expires);
  return Number.isFinite(expiresAt) && expiresAt > now;
}

/**
 * Limitation des tentatives de connexion, en mémoire et best-effort (une
 * instance serverless a sa propre fenêtre). Suffisant pour casser le
 * bourrinage naïf sur un mot de passe unique.
 */
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, number[]>();

export function registerLoginAttempt(key: string, now = Date.now()): boolean {
  const recent = (attempts.get(key) ?? []).filter(
    (t) => now - t < ATTEMPT_WINDOW_MS,
  );
  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(key, recent);
    return false;
  }
  recent.push(now);
  attempts.set(key, recent);
  return true;
}

export function clearLoginAttempts(key: string): void {
  attempts.delete(key);
}
