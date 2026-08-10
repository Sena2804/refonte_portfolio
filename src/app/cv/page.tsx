import type { Metadata } from "next";
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
  period: shortPeriod(x.start, x.end),
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

function HistoryBlock({
  heading,
  entries,
}: {
  heading: string;
  entries: { period: string; title: string; detail: string }[];
}) {
  return (
    <section>
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {heading}
      </h2>
      <ol className="mt-8 divide-y divide-border border-y border-border">
        {entries.map((e) => (
          <li
            key={`${e.period}-${e.title}`}
            className="grid gap-2 py-6 sm:grid-cols-[100px_1fr] sm:gap-10"
          >
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
              {e.period}
            </span>
            <div>
              <h3 className="font-display text-lg leading-snug tracking-tight">
                {e.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{e.detail}</p>
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
            <aside className="space-y-12 lg:sticky lg:top-24">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  Identité
                </h2>
                <div className="mt-5 space-y-1 font-display text-[clamp(1.25rem,1.8vw,1.5rem)] leading-tight tracking-tight">
                  <p>Prémicia S. E. Mensah</p>
                  <p className="text-muted">Développeuse full-stack</p>
                  <p className="text-muted">Cotonou, Bénin</p>
                </div>
              </div>

              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  Compétences techniques
                </h2>
                <div className="mt-6 space-y-8">
                  {competences.map((niveau) => (
                    <section key={niveau.level}>
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground">
                        {niveau.label}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                        {niveau.note}
                      </p>
                      <dl className="mt-4 space-y-4">
                        {niveau.groups.map((g) => (
                          <div key={g.domain}>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                              {g.domain}
                            </dt>
                            <dd className="mt-2 flex flex-wrap gap-2">
                              {g.items.map((i) => (
                                <Tag key={i}>{i}</Tag>
                              ))}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  ))}

                  <section>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground">
                      Outils
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {TOOLS.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </aside>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-16">
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
