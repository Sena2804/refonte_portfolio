import { ArrowUpRight } from "lucide-react";
import {
  ButtonLink,
  Heading,
  Marquee,
  Page,
  Reveal,
  Section,
  SectionLabel,
  Tag,
} from "@/components/ui";

const stack = [
  "React",
  "Next.js",
  "Vue.js",
  "Node.js",
  "Nest.js",
  "Laravel",
  "Flask",
  "Python",
  "TypeScript",
  "Tailwind CSS",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Git",
];

const featured = [
  {
    number: "001",
    title: "My Show Time",
    year: "2025",
    type: "Full-stack · Plateforme d'événements",
    description:
      "Plateforme de réservation de billets avec API RESTful, gestion des événements et des inscriptions.",
    stack: ["Nest.js", "MongoDB", "Mongoose"],
  },
  {
    number: "002",
    title: "Yowl",
    year: "2025",
    type: "Full-stack · Avis clients",
    description:
      "Application full-stack permettant de publier des avis sur des produits e-commerce.",
    stack: ["Vue.js", "Laravel", "Tailwind", "MySQL"],
  },
  {
    number: "003",
    title: "Calculatrice scientifique",
    year: "2025",
    type: "Desktop · Algorithmie",
    description:
      "Interface de calcul avec algorithme de Shunting Yard et évaluation en notation polonaise inversée.",
    stack: ["Python", "Flask", "Tkinter"],
  },
];

const pillars = [
  {
    title: "Rigueur",
    body: "Code lisible, livraison fiable, attention portée aux détails qui font la différence sur la durée.",
  },
  {
    title: "Autonomie",
    body: "Intégration rapide, appropriation du contexte produit, capacité à avancer sans supervision continue.",
  },
  {
    title: "Exigence produit",
    body: "L'interface finale compte autant que l'architecture. Je pense usage, pas seulement tech.",
  },
];

export default function HomePage() {
  return (
    <Page>
      <Section size="lg">
        <SectionLabel number="001">Portfolio 2026</SectionLabel>

        <h1 className="mt-10 max-w-[16ch] font-display font-normal text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.02em]">
          <span
            className="block [animation:hero-line-in_900ms_var(--ease-out-soft)_both]"
            style={{ animationDelay: "80ms" }}
          >
            Développeuse
          </span>
          <span
            className="block text-muted [animation:hero-line-in_900ms_var(--ease-out-soft)_both]"
            style={{ animationDelay: "200ms" }}
          >
            full-stack,
          </span>
          <span
            className="block [animation:hero-line-in_900ms_var(--ease-out-soft)_both]"
            style={{ animationDelay: "320ms" }}
          >
            basée au Bénin.
          </span>
        </h1>

        <Reveal delay={520}>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
            J&apos;accompagne la conception et la mise en œuvre de produits
            numériques utiles — du prototypage jusqu&apos;au déploiement.
          </p>
        </Reveal>

        <Reveal delay={620}>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/projets" size="lg">
              Voir les projets
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost" size="lg">
              Me contacter
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <div className="border-y border-border py-6">
        <Marquee speed={60}>
          {stack.map((item) => (
            <span
              key={item}
              className="font-mono text-xs uppercase tracking-[0.22em] text-muted"
            >
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      <Section size="lg">
        <Reveal>
          <SectionLabel number="002">Sélection</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <Heading as="h2" variant="page" className="mt-4 max-w-[14ch]">
            Trois projets en détail.
          </Heading>
        </Reveal>

        <ul className="mt-16 divide-y divide-border border-y border-border">
          {featured.map((p, i) => (
            <Reveal key={p.number} delay={i * 80}>
              <li>
                <a
                  href="#"
                  className="group grid grid-cols-1 gap-4 py-10 lg:grid-cols-[80px_1fr_auto] lg:items-baseline lg:gap-10"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    {p.number} / {p.year}
                  </span>
                  <div>
                    <h3 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight tracking-tight transition-colors duration-300 group-hover:text-accent">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{p.type}</p>
                    <p className="mt-5 max-w-prose text-[15px] leading-relaxed">
                      {p.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <Tag key={s}>{s}</Tag>
                      ))}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors duration-200 group-hover:text-foreground">
                    Lire
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>

        <div className="mt-16">
          <ButtonLink href="/projets" variant="ghost" size="lg">
            Voir tous les projets
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </ButtonLink>
        </div>
      </Section>

      <Section size="lg">
        <Reveal>
          <SectionLabel number="003">Approche</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <Heading as="h2" variant="page" className="mt-4 max-w-[18ch]">
            Trois principes, une seule ligne.
          </Heading>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="border-t border-border pt-8">
                <h3 className="font-display text-[clamp(1.5rem,2.5vw,2rem)] leading-tight tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-5 text-[15px] leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="contact" size="lg">
        <Reveal>
          <SectionLabel number="004">Contact</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-[14ch] font-display font-normal text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] tracking-[-0.02em]">
            Travaillons ensemble.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            Je suis disponible pour des missions en full-stack, du prototypage
            produit au déploiement.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <ul className="mt-12 divide-y divide-border border-y border-border">
            <li className="group flex flex-wrap items-baseline justify-between gap-4 py-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                E-mail
              </span>
              <a
                href="#"
                className="font-display text-[clamp(1.25rem,2.5vw,1.75rem)] leading-tight tracking-tight transition-colors duration-200 group-hover:text-accent"
              >
                hello@exemple.com
              </a>
            </li>
            <li className="group flex flex-wrap items-baseline justify-between gap-4 py-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                LinkedIn
              </span>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[clamp(1.25rem,2.5vw,1.75rem)] leading-tight tracking-tight transition-colors duration-200 group-hover:text-accent"
              >
                linkedin.com/in/premicia-mensah
              </a>
            </li>
            <li className="group flex flex-wrap items-baseline justify-between gap-4 py-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                GitHub
              </span>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[clamp(1.25rem,2.5vw,1.75rem)] leading-tight tracking-tight transition-colors duration-200 group-hover:text-accent"
              >
                github.com/premicia
              </a>
            </li>
          </ul>
        </Reveal>
      </Section>
    </Page>
  );
}
