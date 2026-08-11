import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Fait comprendre à Vitest les alias `@/...` de tsconfig.json. Vite le sait
    // faire nativement depuis peu : le plugin vite-tsconfig-paths est inutile.
    tsconfigPaths: true,
  },
  test: {
    // `node` et non `jsdom` : on ne teste ici que de la logique pure, aucun DOM.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
