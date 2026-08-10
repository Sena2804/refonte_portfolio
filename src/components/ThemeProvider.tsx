"use client";

import * as React from "react";
import { useSyncExternalStore } from "react";
import { prefersReducedMotion } from "@/lib/media";

type Theme = "light" | "dark";

/** Origine (px, repère viewport) de la révélation circulaire du thème. */
type RevealOrigin = { x: number; y: number };

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme, origin?: RevealOrigin) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";
const THEME_EVENT = "app-theme-change";

function getResolvedTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

const themeScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");var d=document.documentElement;if(t==="dark"){d.classList.add("dark");d.style.colorScheme="dark";}else{d.style.colorScheme="light";}}catch(e){}})();`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolvedTheme = useSyncExternalStore<Theme>(
    subscribe,
    getResolvedTheme,
    () => "light",
  );

  const setTheme = React.useCallback(
    (nextTheme: Theme, origin?: RevealOrigin) => {
      const persist = () => {
        applyTheme(nextTheme);
        try {
          window.localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {}
        window.dispatchEvent(new Event(THEME_EVENT));
      };

      const startViewTransition = (
        document as Document & {
          startViewTransition?: (cb: () => void) => unknown;
        }
      ).startViewTransition;

      if (prefersReducedMotion() || typeof startViewTransition !== "function") {
        persist();
        return;
      }

      // Origine de la révélation circulaire (lue par globals.css).
      if (origin) {
        const root = document.documentElement;
        root.style.setProperty("--theme-x", `${origin.x}px`);
        root.style.setProperty("--theme-y", `${origin.y}px`);
      }
      startViewTransition.call(document, persist);
    },
    [],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme: resolvedTheme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
