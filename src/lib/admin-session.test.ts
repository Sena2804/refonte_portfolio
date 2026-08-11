import { beforeEach, describe, expect, it } from "vitest";
import {
  SESSION_MAX_AGE,
  checkPassword,
  createSessionToken,
  isAdminConfigured,
  verifySessionToken,
} from "./admin-session";

/**
 * Le module lit `process.env` à CHAQUE appel (via `sessionSecret()` et
 * `adminPassword()`), et non une seule fois au chargement. C'est ce qui permet
 * de changer l'environnement entre deux tests — un module qui figerait ces
 * valeurs à l'import serait beaucoup plus pénible à tester.
 */
beforeEach(() => {
  process.env.ADMIN_PASSWORD = "motdepasse-de-test";
  process.env.ADMIN_SESSION_SECRET = "secret-de-test-suffisamment-long-pour-hmac";
});

describe("isAdminConfigured", () => {
  it("est vrai quand les deux variables sont définies", () => {
    expect(isAdminConfigured()).toBe(true);
  });

  it("est faux si le secret de signature manque", () => {
    delete process.env.ADMIN_SESSION_SECRET;
    expect(isAdminConfigured()).toBe(false);
  });

  it("est faux si le mot de passe manque", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(isAdminConfigured()).toBe(false);
  });
});

describe("checkPassword", () => {
  it("accepte le bon mot de passe", () => {
    expect(checkPassword("motdepasse-de-test")).toBe(true);
  });

  it("refuse un mot de passe erroné", () => {
    expect(checkPassword("mauvais")).toBe(false);
  });

  it("refuse une chaîne vide", () => {
    expect(checkPassword("")).toBe(false);
  });

  it("refuse tout quand /admin n'est pas configuré", () => {
    // Le point important : sans configuration, on ne laisse RIEN passer.
    // Une implémentation naïve comparerait "" à "" et ouvrirait la porte.
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_SESSION_SECRET;
    expect(checkPassword("")).toBe(false);
    expect(checkPassword("n'importe quoi")).toBe(false);
  });
});

describe("verifySessionToken", () => {
  it("valide un jeton qu'il vient d'émettre", () => {
    const token = createSessionToken(0);
    expect(verifySessionToken(token, 0)).toBe(true);
  });

  it("refuse un jeton expiré", () => {
    const token = createSessionToken(0);
    const expiration = SESSION_MAX_AGE * 1000;

    // Une milliseconde avant l'échéance : encore valable.
    expect(verifySessionToken(token, expiration - 1)).toBe(true);
    // À l'échéance pile : refusé.
    expect(verifySessionToken(token, expiration)).toBe(false);
  });

  it("refuse un jeton dont la signature a été modifiée", () => {
    const token = createSessionToken(0);
    const [expires, nonce] = token.split(".");
    const falsifie = `${expires}.${nonce}.signature-inventee`;

    expect(verifySessionToken(falsifie, 0)).toBe(false);
  });

  it("refuse un jeton dont on a repoussé l'expiration", () => {
    // L'attaque évidente : allonger la date sans pouvoir resigner. La signature
    // porte sur l'expiration, donc la falsification est détectée.
    const token = createSessionToken(0);
    const [, nonce, signature] = token.split(".");
    const falsifie = `${Number.MAX_SAFE_INTEGER}.${nonce}.${signature}`;

    expect(verifySessionToken(falsifie, 0)).toBe(false);
  });

  it("refuse un jeton mal formé ou absent", () => {
    expect(verifySessionToken(undefined, 0)).toBe(false);
    expect(verifySessionToken("", 0)).toBe(false);
    expect(verifySessionToken("pas-un-jeton", 0)).toBe(false);
    expect(verifySessionToken("deux.parties", 0)).toBe(false);
  });

  it("refuse un jeton valide si /admin n'est plus configuré", () => {
    const token = createSessionToken(0);
    delete process.env.ADMIN_SESSION_SECRET;
    expect(verifySessionToken(token, 0)).toBe(false);
  });

  it("émet deux jetons différents au même instant", () => {
    // Le nonce garantit l'unicité : deux connexions simultanées ne doivent pas
    // produire le même cookie.
    expect(createSessionToken(0)).not.toBe(createSessionToken(0));
  });
});
