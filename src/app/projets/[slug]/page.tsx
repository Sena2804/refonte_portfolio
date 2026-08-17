import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import {
  Heading,
  Page,
  ProjectCover,
  ReadingProgress,
  Reveal,
  Section,
  SectionLabel,
  Tag,
} from "@/components/ui";
import {
  getAllProjects,
  getProjectBySlug,
  getProjectSlugs,
  type ProjectSection,
} from "@/lib/projects";

export async function generateStaticParams() {
  return getProjectSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: "Projet introuvable" };
  }
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} — Prémicia MENSAH`,
      description: project.summary,
      type: "article",
    },
  };
}

function TwoCol({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,220px)_1fr] lg:gap-24">
      <Reveal>
        <SectionLabel as="h2">{label}</SectionLabel>
      </Reveal>
      <Reveal delay={100}>{children}</Reveal>
    </div>
  );
}

function SectionCard({
  item,
  index,
  border,
}: {
  item: ProjectSection;
  index: number;
  border: "top" | "left";
}) {
  const isTop = border === "top";
  return (
    <Reveal delay={index * 80}>
      <article
        className={
          isTop
            ? "group/card relative h-full border-t border-border pt-6 transition-colors duration-300 hover:border-accent"
            : "group/card relative border-l border-border pl-6 transition-colors duration-300 hover:border-accent"
        }
      >
        {isTop ? (
          <span
            aria-hidden
            className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-500 ease-[var(--ease-out-soft)] group-hover/card:w-full"
          />
        ) : null}
        <h3 className="font-display text-sub leading-tight tracking-tight">
          {item.title}
        </h3>
        <p className="mt-4 max-w-prose text-body leading-relaxed text-foreground">
          {item.body}
        </p>
      </article>
    </Reveal>
  );
}

const LINK_KIND_LABEL: Record<string, string> = {
  demo: "Démo",
  github: "GitHub",
  design: "Design",
  doc: "Documentation",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const next = allProjects[(currentIndex + 1) % allProjects.length];
  const previous =
    allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];

  return (
    <Page>
      <ReadingProgress />
      <Section size="md">
        <Reveal>
          <NextLink
            href="/projets"
            className="group inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.18em] text-foreground transition-colors duration-200 hover:text-accent"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={1.75}
            />
            Tous les projets
          </NextLink>
        </Reveal>

        <Reveal delay={80}>
          <SectionLabel number={project.number} className="mt-10">
            {project.period} · {project.type}
          </SectionLabel>
        </Reveal>

        <Reveal delay={140}>
          <Heading variant="page" className="mt-6 max-w-[20ch]">
            {project.title}.
          </Heading>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-8 max-w-2xl text-lead leading-relaxed text-foreground">
            {project.description}
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-10 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        </Reveal>

        <Reveal delay={300}>
          {/* Couverture pleine largeur : le conteneur découpe, l'image déborde
              légèrement et dérive au scroll (parallax natif, zéro JS). */}
          <ProjectCover
            project={project}
            ratio="16/9"
            priority
            sizes="(min-width: 1200px) 1136px, 100vw"
            alt={`Aperçu du projet ${project.title}`}
            className="mt-16"
            imageClassName="parallax-slow"
          />
        </Reveal>

        <Reveal delay={320}>
          <dl className="mt-16 grid grid-cols-1 gap-8 border-y border-border py-10 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-label uppercase tracking-[0.18em] text-foreground">
                Rôle
              </dt>
              <dd className="mt-3 text-body leading-relaxed">
                {project.role}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-label uppercase tracking-[0.18em] text-foreground">
                Équipe
              </dt>
              <dd className="mt-3 text-body leading-relaxed">
                {project.team}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-label uppercase tracking-[0.18em] text-foreground">
                Statut
              </dt>
              <dd className="mt-3 text-body leading-relaxed">
                {project.status}
              </dd>
            </div>
          </dl>
        </Reveal>

        <div className="mt-24 space-y-24">
          <TwoCol label="Contexte">
            <p className="max-w-prose text-body leading-relaxed">
              {project.context}
            </p>
          </TwoCol>

          <TwoCol label="Fonctionnalités">
            <ul className="space-y-4">
              {project.features.map((f, i) => (
                <li
                  key={f}
                  className="group/feat flex items-baseline gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="font-mono text-label uppercase tracking-[0.18em] text-foreground transition-colors duration-300 group-hover/feat:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-body leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </TwoCol>

          <TwoCol label="Points saillants">
            <div className="grid gap-10 sm:grid-cols-2">
              {project.highlights.map((h, i) => (
                <SectionCard key={h.title} item={h} index={i} border="top" />
              ))}
            </div>
          </TwoCol>

          <TwoCol label="Défis rencontrés">
            <div className="space-y-10">
              {project.challenges.map((c, i) => (
                <SectionCard key={c.title} item={c} index={i} border="left" />
              ))}
            </div>
          </TwoCol>

          <TwoCol label="Résultats">
            <ul className="space-y-4">
              {project.outcomes.map((o) => (
                <li
                  key={o}
                  className="flex items-baseline gap-4 text-body leading-relaxed"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {o}
                </li>
              ))}
            </ul>
          </TwoCol>

          <TwoCol label="Liens">
            <ul className="divide-y divide-border border-y border-border">
              {project.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex flex-wrap items-baseline justify-between gap-4 py-6 transition-colors duration-200 hover:text-accent"
                  >
                    <span className="font-display text-item leading-tight tracking-tight">
                      {link.label}
                    </span>
                    <span className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.18em] text-foreground transition-colors duration-300 group-hover:text-accent">
                      {LINK_KIND_LABEL[link.kind] ?? link.kind}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </TwoCol>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-6 border-t border-border pt-12 sm:grid-cols-2">
          <Reveal>
            <NextLink
              href={`/projets/${previous.slug}`}
              className="group block"
            >
              <span className="font-mono text-label uppercase tracking-[0.18em] text-foreground">
                ← Précédent
              </span>
              <span className="mt-3 block font-display text-item leading-tight tracking-tight transition-colors duration-300 group-hover:text-accent">
                {previous.title}
              </span>
            </NextLink>
          </Reveal>
          <Reveal delay={80}>
            <NextLink
              href={`/projets/${next.slug}`}
              className="group block text-right"
            >
              <span className="font-mono text-label uppercase tracking-[0.18em] text-foreground">
                Suivant →
              </span>
              <span className="mt-3 block font-display text-item leading-tight tracking-tight transition-colors duration-300 group-hover:text-accent">
                {next.title}
              </span>
            </NextLink>
          </Reveal>
        </div>
      </Section>
    </Page>
  );
}
