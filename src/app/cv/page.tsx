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
    period: "Novembre 2025",
    title: "My Show Time",
    detail: "Plateforme de réservation (Nest.js, MongoDB).",
  },
  {
    period: "Novembre 2025",
    title: "Calculatrice scientifique",
    detail: "Python, Flask, Tkinter — Shunting Yard.",
  },
  {
    period: "Octobre 2025",
    title: "Yowl",
    detail: "Avis clients Vue.js / Tailwind + Laravel / MySQL.",
  },
  {
    period: "Avril 2025",
    title: "Racines Virtuelles — BLOchallenge",
    detail: "Prototype mobile patrimoine culturel.",
  },
  {
    period: "Février 2025",
    title: "Audify — Bootcamp BLO",
    detail: "Extraction PDF + text-to-speech.",
  },
];

/** Titre de partie. Le soulignement est porté ici et pas à chaque appel : les
 *  six parties du CV (trois par colonne) restent ainsi identiques, et le style
 *  du trait se règle en un seul endroit. Décalé et affiné, sinon la ligne vient
 *  barrer les jambages de la police display. */
function PartTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-[clamp(1.25rem,1.8vw,1.5rem)] leading-tight tracking-tight underline decoration-1 underline-offset-[6px]">
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
            <span className="font-mono text-xs uppercase tracking-[0.16em] tabular-nums text-foreground">
              {e.period}
            </span>
            <div>
              <h3 className="font-display text-lg leading-snug tracking-tight">
                {e.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">
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
                <div className="mt-6 space-y-1 text-sm leading-relaxed text-foreground">
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
                      {/* Souligné comme les titres de partie, avec un décalage
                          plus court : le trait suit la taille du texte. */}
                      <h3 className="font-display text-lg leading-snug tracking-tight underline decoration-1 underline-offset-[5px]">
                        {niveau.label}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-foreground">
                        {niveau.note}
                      </p>
                      <dl className="mt-5 space-y-3">
                        {niveau.groups.map((g) => (
                          <div
                            key={g.domain}
                            className="grid gap-x-5 gap-y-0.5 sm:grid-cols-[8rem_1fr]"
                          >
                            <dt className="text-[14px] italic leading-6 text-foreground underline">
                              {g.domain}
                            </dt>
                            <dd className="text-sm leading-6 text-foreground">
                              {g.items.join(", ")}
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
                <p className="mt-6 text-sm leading-6 text-foreground">
                  {TOOLS.join(", ")}
                </p>
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
