import { describe, expect, it } from "vitest";
import {
  DEFAULT_AVAILABILITY,
  MESSAGE_MAX,
  isValidDate,
  parseAvailability,
  toDateKey,
} from "./availability";

describe("toDateKey", () => {
  it("produit une clé YYYY-MM-DD à partir d'un mois indexé à zéro", () => {
    // Piège classique de JavaScript : janvier vaut 0, pas 1.
    expect(toDateKey(2026, 0, 5)).toBe("2026-01-05");
    expect(toDateKey(2026, 11, 31)).toBe("2026-12-31");
  });
});

describe("isValidDate", () => {
  it("accepte une date réelle", () => {
    expect(isValidDate("2026-02-28")).toBe(true);
  });

  it("rejette un jour qui n'existe pas dans ce mois", () => {
    // Le vrai intérêt de la fonction : une simple expression régulière
    // laisserait passer ces deux-là. 2026 n'est pas bissextile.
    expect(isValidDate("2026-02-31")).toBe(false);
    expect(isValidDate("2026-02-29")).toBe(false);
  });

  it("rejette un mois hors bornes", () => {
    expect(isValidDate("2026-13-01")).toBe(false);
    expect(isValidDate("2026-00-10")).toBe(false);
  });

  it("rejette un format incorrect", () => {
    expect(isValidDate("28/02/2026")).toBe(false);
    expect(isValidDate("2026-2-8")).toBe(false);
    expect(isValidDate("")).toBe(false);
  });
});

/**
 * `parseAvailability` reçoit des données d'origine externe (Upstash, un
 * formulaire). Elle ne doit jamais faire confiance à sa saisie ni lever
 * d'exception : le visiteur ne doit pas voir une page en erreur parce qu'une
 * valeur stockée est corrompue.
 */
describe("parseAvailability", () => {
  it("retombe sur la valeur par défaut pour une entrée non exploitable", () => {
    expect(parseAvailability(null)).toEqual(DEFAULT_AVAILABILITY);
    expect(parseAvailability(undefined)).toEqual(DEFAULT_AVAILABILITY);
    expect(parseAvailability("une chaîne")).toEqual(DEFAULT_AVAILABILITY);
    expect(parseAvailability(42)).toEqual(DEFAULT_AVAILABILITY);
  });

  it("conserve un statut connu", () => {
    expect(parseAvailability({ status: "closed" }).status).toBe("closed");
  });

  it("remplace un statut inconnu par celui par défaut", () => {
    expect(parseAvailability({ status: "en-vacances" }).status).toBe(
      DEFAULT_AVAILABILITY.status,
    );
  });

  it("nettoie le message", () => {
    expect(parseAvailability({ message: "  Disponible en mars  " }).message).toBe(
      "Disponible en mars",
    );
  });

  it("tronque un message trop long", () => {
    const trop = "a".repeat(MESSAGE_MAX + 50);
    expect(parseAvailability({ message: trop }).message).toHaveLength(MESSAGE_MAX);
  });

  it("ignore un message vide ou fait d'espaces", () => {
    expect(parseAvailability({ message: "   " }).message).toBe(
      DEFAULT_AVAILABILITY.message,
    );
  });

  it("filtre, dédoublonne et trie les dates bloquées", () => {
    const parsed = parseAvailability({
      busyDates: [
        "2026-03-10",
        "2026-03-10", // doublon
        "2026-02-31", // date inexistante
        "pas-une-date",
        42, // pas même une chaîne
        "2026-01-05",
      ],
    });

    expect(parsed.busyDates).toEqual(["2026-01-05", "2026-03-10"]);
  });

  it("renvoie une liste vide si busyDates n'est pas un tableau", () => {
    expect(parseAvailability({ busyDates: "2026-03-10" }).busyDates).toEqual([]);
    expect(parseAvailability({}).busyDates).toEqual([]);
  });

  it("n'accepte une date de mise à jour que si elle est analysable", () => {
    expect(parseAvailability({ updatedAt: "n'importe quoi" }).updatedAt).toBeNull();
    expect(parseAvailability({ updatedAt: 1234 }).updatedAt).toBeNull();

    const iso = "2026-08-10T12:00:00.000Z";
    expect(parseAvailability({ updatedAt: iso }).updatedAt).toBe(iso);
  });
});
