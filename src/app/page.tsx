import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Aurora,
  AvailabilityCalendar,
  ButtonLink,
  Heading,
  HoverPreview,
  Marquee,
  Page,
  Reveal,
  Section,
  SectionLabel,
  Stats,
  Tag,
} from "@/components/ui";
import type { Stat } from "@/components/ui";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { getAvailability } from "@/lib/availability";

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

const stats: Stat[] = [
  { value: getAllProjects().length, pad: true, label: "Projets" },
  { value: stack.length, pad: true, label: "Technologies" },
  { value: 2, pad: true, label: "Stages en entreprise" },
  { text: "2024", label: "Développeuse depuis" },
];

const FEATURED_SLUGS = ["my-show-time", "yowl", "calculatrice-scientifique"];

const featured = FEATURED_SLUGS.map((slug, i) => {
  const project = getProjectBySlug(slug);
  if (!project) {
    throw new Error(`Featured project slug "${slug}" not found in projects.ts`);
  }
  return {
    number: String(i + 1).padStart(3, "0"),
    slug: project.slug,
    title: project.title,
    year: project.year,
    type: project.type,
    description: project.summary,
    stack: project.stack.slice(0, 4),
  };
});

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

export default async function HomePage() {
  // Lecture étiquetée : la home reste prérendue, /admin invalide le tag.
  const availability = await getAvailability();

  return (
    <Page>
      <div className="relative isolate overflow-hidden">
        <Aurora />
        <Section size="lg">
          <div className="grid items-center gap-12 lg:grid-cols-[1.6fr_0.9fr]">
            <div>
              <SectionLabel number="001">Portfolio 2026</SectionLabel>

              <h1 className="hero-title mt-10 max-w-[16ch] font-display font-normal text-[clamp(2rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em]">
                <span
                  className="block [animation:hero-line-in_900ms_var(--ease-out-soft)_both]"
                  style={{ animationDelay: "320ms" }}
                >
                  Prémicia MENSAH
                </span>
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
                  full-stack
                </span>
              </h1>

              <Reveal delay={520}>
                <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
                  De l’idée au déploiement, je conçois et développe des produits numériques fluides et prêts à la mise sur le marché.
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
            </div>

            <Reveal delay={400} className="flex justify-center lg:justify-end">
              <AvailabilityCalendar availability={availability} />
            </Reveal>
          </div>
        </Section>
      </div>

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

      <Section size="md">
        <Reveal>
          <Stats items={stats} />
        </Reveal>
      </Section>

      <Section size="lg">
        <Reveal>
          <SectionLabel number="002">Sélection</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <Heading as="h2" variant="page" className="title-morph mt-4 max-w-[14ch]">
            Trois projets en détail.
          </Heading>
        </Reveal>

        <ul className="mt-16 divide-y divide-border border-y border-border">
          {featured.map((p, i) => (
            <Reveal key={p.number} delay={i * 80}>
              <li>
                <Link
                  href={`/projets/${p.slug}`}
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
                    Voir les détails
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </span>
                  <HoverPreview project={p} />
                </Link>
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
          <Heading as="h2" variant="page" className="title-morph mt-4 max-w-[18ch]">
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
          <h2 className="title-morph mt-4 max-w-[14ch] font-display font-normal text-[clamp(2.5rem,7vw,5rem)] leading-[0.98] tracking-[-0.02em]">
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
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:mensahsena03@gmail.com"
                  className="font-display text-indigo-700 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-tight tracking-tight transition-colors duration-200 hover:underline hover:text-indigo-900"
                >
                  mensahsena03@gmail.com
                </a>
                <a
                  href="mailto:premicia.mensah@epitech.eu"
                  className="font-display text-indigo-700 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-tight tracking-tight transition-colors duration-200 hover:underline hover:text-indigo-900"
                >
                  premicia.mensah@epitech.eu
                </a>
              </div>
            </li>
            <li className="group flex flex-wrap items-baseline justify-between gap-4 py-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                LinkedIn
              </span>
              <a
                href="https://www.linkedin.com/in/pr%C3%A9micia-mensah/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-indigo-700 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-tight tracking-tight transition-colors duration-200 hover:underline hover:text-indigo-900"
              >
                linkedin.com/in/pr%C3%A9micia-mensah/
              </a>
            </li>
            <li className="group flex flex-wrap items-baseline justify-between gap-4 py-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                GitHub
              </span>
              <a
                href="https://github.com/Sena2804"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-indigo-700 text-[clamp(1.25rem,2.5vw,1.75rem)] leading-tight tracking-tight transition-colors duration-200 hover:underline hover:text-indigo-900"
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
