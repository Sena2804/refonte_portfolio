import type { Metadata } from "next";
import Image from "next/image";
import {
  Heading,
  Page,
  Reveal,
  Section,
  SectionLabel,
} from "@/components/ui";
import { skillsAt, TOOLS } from "@/lib/skills";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Prémicia MENSAH, développeuse full-stack béninoise. Parcours, valeurs et outils quotidiens.",
};

const motivations = [
  "Expérience utilisateur fluide",
  "Produit final utilisable et potable",
  "Apprentissage continu en équipe et dans un environnement sain",
];

// Source unique : les mêmes listes alimentent /cv et la base du chat.
const tools = TOOLS;
const learning = skillsAt("learning").map((s) => s.name);

function Pillar({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  return (
    <div className="border-t border-border pt-8">
      {/* h2 et non h3 : ces piliers suivent directement le h1 de la page, un
          h3 créerait un saut de niveau dans la navigation au lecteur d'écran. */}
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
        {heading}
      </h2>
      <ul className="mt-6 space-y-2 font-display text-xl leading-snug tracking-tight">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AProposPage() {
  return (
    <Page>
      <Section>
        <Reveal>
          <SectionLabel number="004">À propos</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <Heading variant="page" className="mt-4 max-w-[18ch]">
            Construire, apprendre, contribuer.
          </Heading>
        </Reveal>

        <div className="mt-20 grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Reveal delay={120}>
            <div className="lg:sticky lg:top-24">
              {/* Le cadre reprend le rapport d'affichage réel de la photo.
                  ⚠️ Le fichier fait 6000×4000 sur le disque, mais il porte une
                  orientation EXIF 8 : le navigateur le pivote, donc il s'affiche
                  en 4000×6000, soit 2/3. À ce rapport, `object-cover` n'a plus
                  rien à rogner et la photo apparaît entière, à sa taille.
                  Pas de `parallax-slow` ici : cet effet a besoin d'un
                  `scale(1.14)` pour avoir de la marge de déplacement, donc il
                  rezoome par construction. */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-surface">
                <Image
                  src="/portrait-premicia.jpg"
                  alt="Portrait de Prémicia MENSAH"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              </div>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                Prémicia S. E. Mensah / Cotonou, Bénin
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="space-y-7 font-display text-[clamp(1.25rem,1.5vw,1.5rem)] leading-[1.45] tracking-tight">
              <p>
                Je suis une développeuse full-stack béninoise. J&apos;aime
                construire des produits numériques utiles, du prototypage
                jusqu&apos;à la mise en œuvre technique.
              </p>
              <p>
                Mon objectif est de contribuer à des projets à fort impact,
                avec une exécution rigoureuse et un vrai sens du produit.
              </p>
              <p className="text-foreground">
                Je combine des compétences front-end et back-end, avec une
                forte capacité d&apos;apprentissage et un vrai plaisir à
                travailler en équipe. Je veille autant à la qualité du code
                qu&apos;à l&apos;expérience utilisateur finale.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-32 grid gap-10 lg:grid-cols-3 lg:gap-12">
          <Reveal delay={0}>
            <Pillar heading="Outils quotidiens" items={tools} />
          </Reveal>
          <Reveal delay={80}>
            <Pillar heading="Ce qui me motive" items={motivations} />
          </Reveal>
          <Reveal delay={160}>
            <Pillar heading="Ce sur quoi je progresse" items={learning} />
          </Reveal>
        </div>
      </Section>
    </Page>
  );
}
