import { ImageResponse } from "next/og";
import { LOCATION_LABEL } from "@/lib/site";

/**
 * Vignette affichée quand le lien du portfolio est partagé (LinkedIn, WhatsApp,
 * Slack…). Reprend les tokens de `globals.css` en clair — les aperçus sociaux
 * n'ont pas de mode sombre.
 *
 * La police par défaut de `@vercel/og` est Geist, celle du corps du site.
 */
export const alt =
  "Prémicia S. E. MENSAH — Développeuse full-stack, Cotonou, Bénin";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BACKGROUND = "#FFFFFF";
const FOREGROUND = "#0A0A0C";
const MUTED = "#1A3D7C"; // encre : seule couleur de la carte OG
const BORDER = "#E2E4EA";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BACKGROUND,
          color: FOREGROUND,
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          <span>Portfolio 2026</span>
          <span>{LOCATION_LABEL}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: -2 }}>
            Prémicia MENSAH
          </div>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: MUTED,
            }}
          >
            Développeuse full-stack
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 32,
            fontSize: 24,
            color: MUTED,
          }}
        >
          <span>De l’idée au déploiement</span>
          <span style={{ color: BORDER }}>·</span>
          <span>React</span>
          <span style={{ color: BORDER }}>·</span>
          <span>Next.js</span>
          <span style={{ color: BORDER }}>·</span>
          <span>Laravel</span>
          <span style={{ color: BORDER }}>·</span>
          <span>Python</span>
        </div>
      </div>
    ),
    size,
  );
}
