import { describe, expect, it } from "vitest";
import { clientKey, slidingWindow } from "./rate-limit";

/**
 * `take(key, now)` accepte l'instant en argument : on pilote donc le temps
 * depuis le test, au lieu d'attendre réellement que la fenêtre s'écoule.
 */
describe("slidingWindow", () => {
  it("laisse passer jusqu'au quota, puis refuse", () => {
    const limiter = slidingWindow({ max: 3, windowMs: 1000 });

    expect(limiter.take("ip", 0)).toBe(true);
    expect(limiter.take("ip", 0)).toBe(true);
    expect(limiter.take("ip", 0)).toBe(true);
    expect(limiter.take("ip", 0)).toBe(false);
  });

  it("rouvre le quota une fois la fenêtre écoulée", () => {
    const limiter = slidingWindow({ max: 1, windowMs: 1000 });

    expect(limiter.take("ip", 0)).toBe(true);
    // 999 ms plus tard : encore dans la fenêtre, donc toujours refusé.
    expect(limiter.take("ip", 999)).toBe(false);
    // À 1000 ms pile, le passage initial sort de la fenêtre.
    expect(limiter.take("ip", 1000)).toBe(true);
  });

  it("compte chaque appelant séparément", () => {
    const limiter = slidingWindow({ max: 1, windowMs: 1000 });

    expect(limiter.take("1.2.3.4", 0)).toBe(true);
    // Une autre IP ne doit pas hériter du quota consommé par la première.
    expect(limiter.take("5.6.7.8", 0)).toBe(true);
  });

  it("libère le quota après un reset", () => {
    const limiter = slidingWindow({ max: 1, windowMs: 1000 });

    expect(limiter.take("ip", 0)).toBe(true);
    expect(limiter.take("ip", 0)).toBe(false);
    limiter.reset("ip");
    expect(limiter.take("ip", 0)).toBe(true);
  });
});

describe("clientKey", () => {
  it("retient la première IP de x-forwarded-for", () => {
    // L'en-tête accumule les proxys traversés ; l'appelant réel est en tête.
    const headers = new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" });
    expect(clientKey(headers)).toBe("1.2.3.4");
  });

  it("retombe sur « local » quand l'en-tête est absent", () => {
    expect(clientKey(new Headers())).toBe("local");
  });

  it("retombe sur « local » quand l'en-tête est vide", () => {
    expect(clientKey(new Headers({ "x-forwarded-for": "" }))).toBe("local");
  });
});
