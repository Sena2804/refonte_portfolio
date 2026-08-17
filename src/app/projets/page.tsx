import type { Metadata } from "next";
import NextLink from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Heading,
  Page,
  ProjectCover,
  Reveal,
  Section,
  SectionLabel,
  Tag,
} from "@/components/ui";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Sélection de projets full-stack, bootcamps et challenges réalisés par Prémicia MENSAH.",
};

export default function ProjetsPage() {
  const projects = getAllProjects();

  return (
    <Page>
      <Section>
        <Reveal>
          <SectionLabel number="002">Portfolio</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <Heading variant="page" className="mt-4 max-w-[16ch]">
            Projets.
          </Heading>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-xl text-lead leading-relaxed text-foreground">
            Une sélection de projets réalisés en formation, en challenge et en
            autonomie, avec un focus sur le full-stack, l&apos;expérience
            utilisateur et l&apos;impact produit.
          </p>
        </Reveal>

        <ul className="mt-20 divide-y divide-border border-y border-border">
          {projects.map((p, i) => (
            <li key={p.slug} className="group relative overflow-hidden">
              <Reveal delay={i * 60}>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-accent-soft/50 transition-transform duration-[600ms] ease-[var(--ease-out-soft)] group-hover:scale-x-100 dark:bg-accent-soft/30"
                />
                <NextLink
                  href={`/projets/${p.slug}`}
                  aria-label={`Voir les détails du projet ${p.title}`}
                  className="relative grid grid-cols-1 items-start gap-8 px-2 py-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:px-4 lg:grid-cols-[80px_300px_minmax(0,1fr)] lg:gap-12"
                >
                  <span className="font-mono text-label uppercase tracking-[0.18em] text-foreground transition-colors duration-300 group-hover:text-accent">
                    {p.number}
                  </span>
                  {/* Aperçu visible dès la liste : la vignette est zoomée au
                      survol de la ligne entière, comme le reste de la carte. */}
                  <ProjectCover
                    project={p}
                    sizes="(min-width: 1024px) 300px, 100vw"
                    imageClassName="transition-transform duration-[700ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                  />
                  <div>
                    <p className="font-mono text-label uppercase tracking-[0.18em] text-foreground">
                      {p.period}
                    </p>
                    <h2 className="mt-2 font-display text-item leading-tight tracking-tight transition-colors duration-300 group-hover:text-accent">
                      <span className="inline-block transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5">
                        {p.title}
                      </span>
                    </h2>
                    <p className="mt-2 text-small text-foreground">{p.type}</p>
                    <p className="mt-6 max-w-prose text-body leading-relaxed">
                      {p.summary}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <Tag key={s}>{s}</Tag>
                      ))}
                    </div>
                    <span
                      aria-hidden
                      className="mt-8 inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.18em] text-foreground transition-colors duration-300 group-hover:text-accent"
                    >
                      <span className="relative block h-4 overflow-hidden">
                        <span className="block transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-full">
                          Voir les détails de ce projet
                        </span>
                        <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-y-0">
                          Ouvrir la fiche →
                        </span>
                      </span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                      />
                    </span>
                  </div>
                </NextLink>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}
