import NextLink from "next/link";
import { ArrowLeft } from "lucide-react";
import { Heading, Page, Section, SectionLabel } from "@/components/ui";

export default function ProjectNotFound() {
  return (
    <Page>
      <Section>
        <SectionLabel number="404">Projet introuvable</SectionLabel>
        <Heading variant="page" className="mt-4 max-w-[18ch]">
          Ce projet n&apos;existe pas.
        </Heading>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground">
          Il a peut-être été renommé ou archivé. Tu peux revenir à la liste
          complète des projets.
        </p>
        <NextLink
          href="/projets"
          className="group mt-12 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors duration-200 hover:text-accent"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
            strokeWidth={1.75}
          />
          Tous les projets
        </NextLink>
      </Section>
    </Page>
  );
}
