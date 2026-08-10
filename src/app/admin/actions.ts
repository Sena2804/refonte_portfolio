"use server";

import { cookies, headers } from "next/headers";
import { updateTag } from "next/cache";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  clearLoginAttempts,
  createSessionToken,
  isAdminConfigured,
  registerLoginAttempt,
  verifySessionToken,
} from "@/lib/admin-session";
import {
  AVAILABILITY_TAG,
  isValidDate,
  parseAvailability,
  setAvailability,
  STATUS_ORDER,
  type AvailabilityStatus,
} from "@/lib/availability";

export type ActionState = { error?: string; success?: string };

/** L'appelant a-t-il une session valide ? Revérifié dans chaque action. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

async function clientKey(): Promise<string> {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isAdminConfigured()) {
    return { error: "Le module n'est pas configuré sur ce déploiement." };
  }

  if (!registerLoginAttempt(await clientKey())) {
    return { error: "Trop de tentatives. Réessaie dans quelques minutes." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !checkPassword(password)) {
    return { error: "Mot de passe incorrect." };
  }

  clearLoginAttempts(await clientKey());
  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  });
  return {};
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete({ name: ADMIN_COOKIE, path: "/admin" });
}

export async function saveAvailability(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Réautorisation systématique : le formulaire n'est pas une preuve d'accès.
  if (!(await isAuthenticated())) {
    return { error: "Session expirée. Reconnecte-toi." };
  }

  const rawStatus = formData.get("status");
  if (
    typeof rawStatus !== "string" ||
    !STATUS_ORDER.includes(rawStatus as AvailabilityStatus)
  ) {
    return { error: "Statut invalide." };
  }

  const rawMessage = formData.get("message");
  if (typeof rawMessage !== "string" || !rawMessage.trim()) {
    return { error: "La phrase de disponibilité ne peut pas être vide." };
  }

  // Une date par ligne dans le textarea.
  const rawDates =
    typeof formData.get("busyDates") === "string"
      ? String(formData.get("busyDates"))
          .split(/[\s,;]+/)
          .map((d) => d.trim())
          .filter(Boolean)
      : [];

  const invalid = rawDates.filter((d) => !isValidDate(d));
  if (invalid.length > 0) {
    return { error: `Dates invalides (format AAAA-MM-JJ) : ${invalid.join(", ")}` };
  }

  const value = parseAvailability({
    status: rawStatus,
    message: rawMessage,
    busyDates: rawDates,
    updatedAt: new Date().toISOString(),
  });

  if (!(await setAvailability(value))) {
    return { error: "Le stockage n'a pas accepté l'écriture. Réessaie." };
  }

  // Invalide la lecture étiquetée : le hero et le chat repartent sur la
  // nouvelle valeur dès la prochaine visite (read-your-own-writes).
  updateTag(AVAILABILITY_TAG);
  return { success: "Disponibilité mise à jour." };
}
