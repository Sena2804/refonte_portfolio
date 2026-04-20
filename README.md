# Prémicia S. E. MENSAH — Portfolio

Portfolio personnel de Prémicia MENSAH, développeuse full-stack (Cotonou, Bénin).

## Stack

- **Next.js 16** — App Router, Turbopack, React Compiler
- **React 19**
- **Tailwind CSS v4** — tokens via `@theme inline`, variant dark custom
- **TypeScript 5**
- **next/font/google** — Fraunces (display), Geist (sans), Geist Mono (mono)
- **lucide-react** — iconographie

## Démarrer

Prérequis : Node 24+ (voir `.nvmrc`).

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000.

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |

## Structure

```
src/
├── app/                      routes App Router
│   ├── layout.tsx            layout racine (fonts, theme, nav, footer, metadata)
│   ├── page.tsx              Home
│   ├── projets/page.tsx
│   ├── parcours/page.tsx
│   ├── a-propos/page.tsx
│   ├── cv/page.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── globals.css           tokens design system
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ThemeProvider.tsx     provider + script anti-FOUC
│   └── ui/                   primitives design system
└── lib/
    └── cn.ts
```

## Design system

Tokens CSS (`src/app/globals.css`) :

| Token | Light | Dark |
| --- | --- | --- |
| `--background` | `#F7F7F4` | `#0B0F1F` |
| `--surface` | `#EEECE5` | `#13182B` |
| `--foreground` | `#0C1222` | `#E8E9ED` |
| `--muted` | `#5E6477` | `#8A90A3` |
| `--border` | `#E4E2DB` | `#1F2436` |
| `--accent` | `#1E2A4A` | `#A9B6D9` |

Utilitaires Tailwind associés : `bg-background`, `bg-surface`, `text-foreground`, `text-muted`, `border-border`, `bg-accent`, `text-accent`, `bg-accent-soft`.

Courbe d&apos;animation unique : `var(--ease-out-soft)`.

## Conventions

- Server Components par défaut, `"use client"` uniquement si justifié
- Pas de couleurs hardcodées — passer par les tokens
- Pas de commentaires superflus
- Accents français respectés partout

## Agents IA

- `AGENTS.md` — note pour tout agent (Next.js 16, lire la doc locale avant de coder)
- `CODEX.md` — instructions dédiées à Codex (audit dev / sec / ops)
- `.codex/` — mémoire persistante locale (gitignored)

## Contact

bj.project.ajs@gmail.com
