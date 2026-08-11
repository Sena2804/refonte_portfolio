import type { Metadata } from "next";
import {
  Heading,
  Page,
  Reveal,
  Section,
  SectionLabel,
  Tag,
} from "@/components/ui";
import { EDUCATION, EXPERIENCES, longPeriod } from "@/lib/career";

export const metadata: Metadata = {
  title: "Parcours",
  description:
    "Expériences, projets et formations de Prémicia MENSAH, développeuse full-stack.",
};

const projects: TimelineItem[] = [
  {
    period: "Novembre 2025",
    title: "My Show Time",
    detail:
      "Développement d'une plateforme de réservation de billets (Nest.js, MongoDB).",
    tags: ["Nest.js", "MongoDB"],
  },
  {
    period: "Novembre 2025",
    title: "Calculatrice scientifique",
    detail:
      "Conception d'une interface de calcul avec Shunting Yard et notation polonaise inversée.",
    tags: ["Python", "Flask"],
  },
  {
    period: "Octobre 2025",
    title: "Yowl",
    detail:
      "Application de collecte d'avis clients avec front Vue.js/Tailwind et backend Laravel/MySQL.",
    tags: ["Vue.js", "Laravel", "MySQL"],
  },
  {
    period: "Avril 2025",
    title: "BLOchallenge — Racines Virtuelles",
    detail:
      "Prototype mobile centré sur la valorisation du patrimoine culturel béninois.",
    tags: ["Figma", "UX"],
  },
  {
    period: "Février 2025",
    title: "BLO Bootcamp — Audify",
    detail:
      "Application web d'extraction de texte PDF et conversion en audio text-to-speech.",
    tags: ["JavaScript", "PDF.js"],
  },
];

// Stages et formations viennent de la source unique `career.ts`, partagée avec
// /cv et la base de connaissances du chat.
const internships: TimelineItem[] = EXPERIENCES.map((x) => ({
  period: longPeriod(x.start, { end: x.end, ongoing: x.ongoing }),
  title: x.org,
  detail: `${x.role} — ${x.summary}`,
  tags: x.stack,
}));

const education: TimelineItem[] = EDUCATION.map((e) => ({
  period: longPeriod(e.start, { ongoing: e.ongoing }),
  title: e.school,
  detail: e.detail,
}));

type TimelineItem = {
  period: string;
  title: string;
  detail: string;
  tags?: string[];
};

function TimelineEntry({
  item,
  index,
}: {
  item: TimelineItem;
  index: number;
}) {
  return (
    <Reveal delay={index * 70}>
      <li className="relative pb-12 pl-10 last:pb-0">
        <span
          aria-hidden
          className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background"
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {item.period}
        </p>
        <h3 className="mt-3 font-display text-[clamp(1.5rem,2.5vw,2rem)] leading-snug tracking-tight">
          {item.title}
        </h3>
        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
          {item.detail}
        </p>
        {item.tags && item.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        ) : null}
      </li>
    </Reveal>
  );
}

export default function ParcoursPage() {
  return (
    <Page>
      <Section>
        <Reveal>
          <SectionLabel number="003">Parcours</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <Heading variant="page" className="mt-4 max-w-[14ch]">
            De l&apos;Informatique Industrielle et Maintenance au dévellopement web full-stack et mobile.
          </Heading>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Forte de mes bases en informatique industrielle et maintenance, j&apos;ai décidé de me réorienter
            vers le développement web full-stack et mobile pour mieux exprimer ma créativité et mon intérêt 
            pour les technologies modernes. Mon parcours atypique m&apos;a permis d&apos;acquérir une solide
            compréhension des systèmes informatiques tout en développant des compétences techniques pointues
            en programmation, ce qui me permet d&apos;aborder les projets avec une perspective unique et 
            une approche orientée solution.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Stages en entreprise
              </h2>
            </Reveal>
            <ol className="relative mt-10 border-l border-border">
              {internships.map((e, i) => (
                <TimelineEntry
                  key={`${e.period}-${e.title}`}
                  item={e}
                  index={i}
                />
              ))}
            </ol>

            <Reveal>
              <h2 className="mt-16 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Projets
              </h2>
            </Reveal>
            <ol className="relative mt-10 border-l border-border">
              {projects.map((e, i) => (
                <TimelineEntry
                  key={`${e.period}-${e.title}`}
                  item={e}
                  index={i}
                />
              ))}
            </ol>
          </div>

          <div>
            <Reveal>
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Formations
              </h2>
            </Reveal>
            <ol className="relative mt-10 border-l border-border">
              {education.map((e, i) => (
                <TimelineEntry
                  key={`${e.period}-${e.title}`}
                  item={e}
                  index={i}
                />
              ))}
            </ol>
          </div>
        </div>
      </Section>
    </Page>
  );
}
