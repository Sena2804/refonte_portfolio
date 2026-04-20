import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import {
  Heading,
  Page,
  Reveal,
  Section,
  SectionLabel,
  Tag,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Sélection de projets full-stack, bootcamps et challenges réalisés par Prémicia MENSAH.",
};

const projects = [
  {
    number: "001",
    title: "My Show Time",
    year: "Novembre 2025",
    type: "Application web d'événements",
    description:
      "Plateforme de réservation de billets avec API RESTful, gestion des événements et des inscriptions.",
    stack: ["Nest.js", "MongoDB", "Mongoose"],
  },
  {
    number: "002",
    title: "Calculatrice scientifique",
    year: "Novembre 2025",
    type: "Application desktop / web",
    description:
      "Interface de calcul scientifique avec algorithme de Shunting Yard et évaluation en notation polonaise inversée.",
    stack: ["Python", "Flask", "Tkinter"],
  },
  {
    number: "003",
    title: "Yowl",
    year: "Octobre 2025",
    type: "Application web d'avis clients",
    description:
      "Application full-stack permettant de publier des avis sur des produits e-commerce.",
    stack: ["Vue.js", "Tailwind CSS", "Laravel", "MySQL"],
  },
  {
    number: "004",
    title: "Audify",
    year: "Février 2025",
    type: "Bootcamp BLO",
    description:
      "Extraction de texte PDF et conversion audio text-to-speech pour rendre les contenus plus accessibles.",
    stack: ["HTML", "Tailwind", "JavaScript", "PDF.js", "ResponsiveVoice"],
  },
  {
    number: "005",
    title: "Racines Virtuelles",
    year: "Avril 2025",
    type: "Prototype mobile — BLOchallenge",
    description:
      "Prototype de solution mobile pour valoriser le patrimoine culturel béninois via une expérience ludique immersive.",
    stack: ["Figma", "UX", "Prototype produit"],
  },
];

export default function ProjetsPage() {
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
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Une sélection de projets réalisés en formation, en challenge et en
            autonomie, avec un focus sur le full-stack, l&apos;expérience
            utilisateur et l&apos;impact produit.
          </p>
        </Reveal>

        <ul className="mt-20 divide-y divide-border border-y border-border">
          {projects.map((p, i) => (
            <Reveal key={p.number} delay={i * 60}>
              <li className="group grid grid-cols-1 gap-6 py-12 lg:grid-cols-[90px_1fr_auto] lg:items-baseline lg:gap-12">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {p.number}
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {p.year}
                  </p>
                  <h2 className="mt-2 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight transition-colors duration-300 group-hover:text-accent">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{p.type}</p>
                  <p className="mt-6 max-w-prose text-[15px] leading-relaxed">
                    {p.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                </div>
                <a
                  href="#"
                  aria-label={`Voir le cas ${p.title}`}
                  className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors duration-200 group-hover:text-foreground"
                >
                  Lire le cas
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>
    </Page>
  );
}
