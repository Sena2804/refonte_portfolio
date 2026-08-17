import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Download } from "lucide-react";
import {
  ButtonLink,
  Heading,
  Page,
  Reveal,
  Section,
  SectionLabel,
  Tag,
} from "@/components/ui";
import { EDUCATION, EXPERIENCES, shortPeriod } from "@/lib/career";
import { byDomain, SKILL_LEVELS, skillsAt, TOOLS } from "@/lib/skills";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum vitae de Prémicia MENSAH, développeuse full-stack (React, Node.js, Python).",
};

// Compétences classées par niveau d'usage réel (source : src/lib/skills.ts),
// puis par domaine à l'intérieur de chaque niveau.
const competences = SKILL_LEVELS.map((l) => ({
  ...l,
  groups: byDomain(skillsAt(l.level)),
}));

// Stages et formations : source unique `career.ts`, partagée avec /parcours.
const stages = EXPERIENCES.map((x) => ({
  period: shortPeriod(x.start, x.end, { ongoing: x.ongoing }),
  title: x.org,
  detail: x.stack.length
    ? `${x.role} — ${x.stack.join(", ")}.`
    : `${x.role}.`,
}));

const formations = EDUCATION.map((e) => ({
  period: shortPeriod(e.start),
  title: e.school,
  detail: e.detail,
}));

const projets = [
  {
    period: "11 / 2025",
    title: "My Show Time",
    detail: "Plateforme de réservation (Nest.js, MongoDB).",
  },
  {
    period: "11 / 2025",
    title: "Calculatrice scientifique",
    detail: "Python, Flask, Tkinter — Shunting Yard.",
  },
  {
    period: "10 / 2025",
    title: "Yowl",
    detail: "Avis clients Vue.js / Tailwind + Laravel / MySQL.",
  },
  {
    period: "04 / 2025",
    title: "Racines Virtuelles — BLOchallenge",
    detail: "Prototype mobile patrimoine culturel.",
  },
  {
    period: "02 / 2025",
    title: "Audify — Bootcamp BLO",
    detail: "Extraction PDF + text-to-speech.",
  },
];

/** Titre de partie : c'est l'échelle et l'espace qui le détachent, pas un
 *  filet. Un CV plein de traits horizontaux fait formulaire, pas portfolio. */
function PartTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-item leading-tight tracking-tight">
      {children}
    </h2>
  );
}

function HistoryBlock({
  heading,
  entries,
}: {
  heading: string;
  entries: { period: string; title: string; detail: string }[];
}) {
  return (
    <section>
      <PartTitle>{heading}</PartTitle>
      <ol className="mt-8 space-y-8">
        {entries.map((e) => (
          <li
            key={`${e.period}-${e.title}`}
            className="grid gap-1 sm:grid-cols-[104px_1fr] sm:gap-8"
          >
            <span className="font-mono text-label uppercase tracking-[0.18em] tabular-nums text-foreground">
              {e.period}
            </span>
            <div>
              <h3 className="font-display text-sub leading-snug tracking-tight">
                {e.title}
              </h3>
              <p className="mt-1.5 text-body leading-relaxed text-foreground">
                {e.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function CVPage() {
  return (
    <Page>
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <SectionLabel number="005">Curriculum</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <Heading variant="page" className="mt-4">
                CV.
              </Heading>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <ButtonLink
              href="/premicia-mensah-developpeusefullStack.pdf"
              size="lg"
              external
            >
              Télécharger le PDF
              <Download className="h-4 w-4" strokeWidth={1.75} />
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-[3fr_5fr] lg:gap-20">
          <Reveal>
            {/* Pas de `sticky` ici : la colonne est plus haute que l'écran, et
                un bloc collant plus grand que la fenêtre rend sa propre fin
                inatteignable au scroll. */}
            <aside className="space-y-20">
              <section>
                <PartTitle>Identité</PartTitle>
                <div className="mt-6 space-y-1 text-body leading-relaxed text-foreground">
                  <p>Prémicia S. E. Mensah</p>
                  <p>Développeuse full-stack</p>
                  <p>Cotonou, Bénin</p>
                </div>
              </section>

              <section>
                <PartTitle>Compétences techniques</PartTitle>
                {/* Trois niveaux, trois échelles : partie en display 22px,
                    niveau d'usage en display 17px, domaine en petit mono.
                    Empilés dans la même mono, ils devenaient indiscernables. */}
                <div className="mt-8 space-y-10">
                  {competences.map((niveau) => (
                    <section key={niveau.level}>
                      <h3 className="font-display text-sub leading-snug tracking-tight">
                        {niveau.label}
                      </h3>
                      <p className="mt-1.5 text-small leading-relaxed text-foreground">
                        {niveau.note}
                      </p>
                      <dl className="mt-5 space-y-5">
                        {niveau.groups.map((g) => (
                          <div key={g.domain}>
                            <dt className="font-mono text-label uppercase tracking-[0.18em] text-foreground">
                              {g.domain}
                            </dt>
                            <dd className="mt-2.5 flex flex-wrap gap-2">
                              {g.items.map((i) => (
                                <Tag key={i}>{i}</Tag>
                              ))}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  ))}
                </div>
              </section>

              <section>
                <PartTitle>Outils</PartTitle>
                <div className="mt-6 flex flex-wrap gap-2">
                  {TOOLS.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </section>
            </aside>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-20">
              <HistoryBlock heading="Stages en entreprise" entries={stages} />
              <HistoryBlock heading="Projets" entries={projets} />
              <HistoryBlock heading="Formations" entries={formations} />
            </div>
          </Reveal>
        </div>
      </Section>
    </Page>
  );
}
