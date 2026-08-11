# Prémicia S. E. MENSAH — Portfolio

Portfolio personnel de Prémicia MENSAH, développeuse full-stack (Cotonou, Bénin).

En plus des pages classiques, le site embarque deux modules :

- **Un chat IA** qui répond à la première personne à partir d'une base de
  connaissances ancrée — pas de génération libre, pas d'invention.
- **Un espace privé `/admin`** pour piloter la disponibilité affichée dans le
  hero, sans redéployer.

Les deux se désactivent proprement si leurs variables d'environnement sont
absentes : le site build et tourne sans aucune configuration.

## Stack

| Élément | Choix |
| --- | --- |
| Framework | Next.js 16 — App Router, Turbopack, React Compiler |
| UI | React 19 |
| Styles | Tailwind CSS v4 — tokens via `@theme inline`, variante dark |
| Langage | TypeScript 5 |
| Polices | `next/font/google` — Fraunces (display), Geist (sans), Geist Mono |
| Icônes | `lucide-react` |
| Stockage | Upstash Redis via API REST (optionnel) |
| LLM | Gemini ou Groq, au choix (optionnel) |

Aucune dépendance d'animation ni de composants : tout est fait avec Tailwind et
les keyframes de `globals.css`.

## Démarrer

Node 24 (voir `.nvmrc`; `package.json` accepte 20.9+).

```bash
npm install
cp .env.example .env.local   # facultatif : le site tourne sans
npm run dev
```

Ouvrir http://localhost:3000.

## Variables d'environnement

Toutes sont facultatives. La colonne de droite indique ce qui se passe **sans**
elles — aucune ne fait échouer le build.

| Variable | Rôle | Si absente |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Origine publique (URLs canoniques, sitemap, robots, Open Graph) | Retombe sur le domaine Vercel, puis sur `https://premicia.dev` |
| `CHAT_PROVIDER` | `gemini` ou `groq` | Chat désactivé |
| `GEMINI_API_KEY` / `GROQ_API_KEY` | Clé du fournisseur choisi | Chat désactivé |
| `CHAT_MODEL` | Force un modèle | `gemini-flash-latest` / `openai/gpt-oss-120b` |
| `ADMIN_PASSWORD` | Mot de passe de `/admin` | `/admin` se déclare en veille, aucune écriture possible |
| `ADMIN_SESSION_SECRET` | Signature du cookie de session (`openssl rand -base64 32`) | Idem |
| `UPSTASH_REDIS_REST_URL` / `..._TOKEN` | Persistance de la disponibilité | Écriture en mémoire du process, perdue au redémarrage |

> `NEXT_PUBLIC_SITE_URL` est lue **au build** : la renseigner après coup impose
> un redéploiement.

Le widget de chat s'affiche dès qu'un fournisseur et sa clé sont configurés. Il
n'y a pas d'interrupteur séparé — laisser la clé vide suffit à le masquer.

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
├── app/
│   ├── layout.tsx              fonts, thème, nav, footer, metadata globale
│   ├── page.tsx                accueil
│   ├── projets/
│   │   ├── page.tsx            liste
│   │   └── [slug]/page.tsx     détail (generateStaticParams + generateMetadata)
│   ├── parcours/ a-propos/ cv/
│   ├── admin/                  espace privé (page, Server Actions, formulaires)
│   ├── api/chat/route.ts       endpoint de streaming du chat
│   ├── opengraph-image.tsx     vignette de partage social générée
│   ├── sitemap.ts robots.ts
│   └── globals.css             tokens et keyframes
├── components/
│   ├── Navbar.tsx Footer.tsx ThemeProvider.tsx
│   ├── ai/AskMe.tsx            widget de chat
│   └── ui/                     primitives (Page, Section, Button, Card…)
└── lib/                        sources de vérité, voir ci-dessous
```

## Sources uniques de vérité

Le principe structurant du projet : **chaque fait n'est écrit qu'à un seul
endroit**, et toutes les pages en dérivent. Avant d'ajouter une donnée, vérifier
si elle appartient à l'un de ces modules.

| Module | Contenu | Consommé par |
| --- | --- | --- |
| `lib/projects.ts` | Les 9 fiches projet | `/projets`, `/projets/[slug]`, accueil, sitemap, chat |
| `lib/career.ts` | Stages et formations, avec mise en forme des dates | `/parcours`, `/cv`, chat |
| `lib/skills.ts` | Compétences classées par niveau d'usage réel | accueil, `/cv`, `/a-propos`, chat |
| `lib/site.ts` | Domaine, localisation, liens de contact | metadata, accueil, calendrier, chat |
| `lib/availability.ts` | Disponibilité pilotée par `/admin` | accueil, chat |
| `lib/knowledge.ts` | Assemble le system prompt à partir des modules ci-dessus | `api/chat` |

Les niveaux de compétence (`skills.ts`) distinguent ce qui a été utilisé en
entreprise, sur des projets personnels, et ce qui est en cours d'apprentissage.
Chaque entrée doit être justifiable par un stage de `career.ts` ou une fiche de
`projects.ts`.

## Design system

Tokens CSS dans `src/app/globals.css` :

| Token | Clair | Sombre |
| --- | --- | --- |
| `--background` | `#F7F7F4` | `#0B0F1F` |
| `--surface` | `#EEECE5` | `#13182B` |
| `--foreground` | `#0C1222` | `#E8E9ED` |
| `--muted` | `#5E6477` | `#8A90A3` |
| `--border` | `#E4E2DB` | `#1F2436` |
| `--accent` | `#1E2A4A` | `#A9B6D9` |
| `--ok` | `#18794C` | `#4ED99A` |

Toutes les paires texte/fond respectent le contraste WCAG AA (4,5:1). Courbe
d'animation unique : `var(--ease-out-soft)`.

## Conventions

- Server Components par défaut ; `"use client"` seulement si un hook ou une API
  DOM l'exige.
- Aucune couleur en dur : passer par les tokens, sinon le thème sombre casse.
- Composer avec les primitives de `components/ui` plutôt que recréer des
  boutons ou des titres.
- Accessibilité : un seul `h1` par page, pas de saut de niveau de titre, cibles
  cliquables d'au moins 24 px, `prefers-reduced-motion` respecté.
- Liens externes : `target="_blank"` + `rel="noopener noreferrer"`.
- `npm run lint` et `npm run build` doivent passer avant toute livraison.

## Déploiement

### Vercel

Importer le dépôt, renseigner les variables d'environnement voulues, déployer.
Le domaine de production est détecté automatiquement si
`NEXT_PUBLIC_SITE_URL` n'est pas défini.

### Docker

L'image utilise le mode `standalone` de Next (`output: "standalone"` dans
`next.config.ts`) : build multi-étages, exécution sous un utilisateur non
privilégié, sans `npm` ni `node_modules` dans l'image finale.

```bash
docker build -t premicia-portfolio .
docker run --rm -p 3000:3000 --env-file .env.local premicia-portfolio
```

Les variables `NEXT_PUBLIC_*` étant figées à la compilation, elles doivent être
fournies au `docker build`, pas seulement au `docker run`.

## Intégration continue

`.github/workflows/ci.yml` — sur `main` et `feat/**` : installation, lint,
build, puis construction de l'image Docker. L'image n'est publiée sur GHCR que
depuis `main`.

## Agents IA

- `AGENTS.md` — contrat de travail pour tout agent intervenant sur le dépôt
  (Next.js 16, doc locale faisant foi, garde-fous).
- `CLAUDE.md` — reprend `AGENTS.md`.
- `CODEX.md` et `.codex/` — instructions et mémoire dédiées à Codex.

## Contact

- mensahsena03@gmail.com
- premicia.mensah@epitech.eu
- [github.com/Sena2804](https://github.com/Sena2804)
