import type { Metadata } from "next";
import {
  Heading,
  Page,
  Reveal,
  Section,
  SectionLabel,
  Tabs,
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
    // Le `li` est enfant direct du `ol` (le `Reveal` est à l'intérieur) : sinon
    // chaque entrée est seule dans son wrapper, `first:`/`last:` matchent tout,
    // et les espacements de fin de bloc sautent.
    <li className="group/entry relative border-t border-border py-10 pl-10 transition-colors duration-500 ease-[var(--ease-out-soft)] first:border-t-0 first:pt-0 last:pb-0 hover:border-accent">
      <Reveal delay={index * 70}>
        {/* Numérotation en encre : même langage que les fiches projet et les
            étiquettes de section, et un point d'accroche graphique en tête de
            chaque bloc. La pastille est ancrée sur cette ligne — pas sur un
            décalage en dur — donc alignée quelle que soit la hauteur du bloc. */}
        <SectionLabel
          number={String(index + 1).padStart(2, "0")}
          className="relative tracking-[0.18em]"
        >
          <span
            aria-hidden
            className="absolute -left-[calc(2.5rem+5px)] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent ring-4 ring-background transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover/entry:scale-150"
          />
          {item.period}
        </SectionLabel>
        <h2 className="mt-4 font-display text-item leading-snug tracking-tight">
          {item.title}
        </h2>
        <p className="mt-4 max-w-prose text-body leading-relaxed text-foreground">
          {item.detail}
        </p>
        {item.tags && item.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        ) : null}
      </Reveal>
    </li>
  );
}

/** La chronologie d'un onglet : le rail et ses entrées. Le titre de la partie
 *  est porté par l'onglet lui-même, pas répété ici. */
function TimelineList({ items }: { items: TimelineItem[] }) {
  return (
    // Le rail d'encre vit à l'extérieur du `ol` : un `ol` n'accepte que des
    // `li`, un `span` décoratif dedans est du HTML invalide.
    <div className="relative">
      {/* Le filet gris du `ol` est doublé d'un rail d'encre qui se remplit au
          fil du scroll. */}
      <span
        aria-hidden
        className="rail-fill absolute left-0 top-0 h-full w-px bg-accent"
      />
      <ol className="border-l border-border">
        {items.map((item, i) => (
          <TimelineEntry
            key={`${item.period}-${item.title}`}
            item={item}
            index={i}
          />
        ))}
      </ol>
    </div>
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
          <p className="mt-6 max-w-xl text-lead leading-relaxed text-foreground">
            Forte de mes bases en informatique industrielle et maintenance, j&apos;ai décidé de me réorienter
            vers le développement web full-stack et mobile pour mieux exprimer ma créativité et mon intérêt 
            pour les technologies modernes. Mon parcours atypique m&apos;a permis d&apos;acquérir une solide
            compréhension des systèmes informatiques tout en développant des compétences techniques pointues
            en programmation, ce qui me permet d&apos;aborder les projets avec une perspective unique et 
            une approche orientée solution.
          </p>
        </Reveal>

        <div className="mt-20">
          <Tabs
            label="Sections du parcours"
            items={[
              {
                id: "stages",
                label: "Stages en entreprise",
                count: internships.length,
                panel: <TimelineList items={internships} />,
              },
              {
                id: "formations",
                label: "Formations",
                count: education.length,
                panel: <TimelineList items={education} />,
              },
              {
                id: "projets",
                label: "Projets",
                count: projects.length,
                panel: <TimelineList items={projects} />,
              },
            ]}
          />
        </div>

      </Section>
    </Page>
  );
}
