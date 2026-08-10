/**
 * Compétences techniques, classées par niveau d'usage réel — source unique.
 *
 * Le classement n'est pas décoratif : il évite la liste plate de vingt
 * technologies indifférenciées, où le lecteur ne sait pas ce qui a été livré
 * en entreprise et ce qui a été touché une fois. Chaque entrée doit pouvoir
 * être justifiée par un stage (`career.ts`) ou une fiche (`projects.ts`).
 */

export type SkillLevel = "company" | "project" | "learning";

export const SKILL_LEVELS: {
  level: SkillLevel;
  label: string;
  note: string;
}[] = [
  {
    level: "company",
    label: "Utilisé en entreprise",
    note: "Mis en œuvre pendant mes stages, sur des livrables réels.",
  },
  {
    level: "project",
    label: "Utilisé sur mes projets",
    note: "Développé de bout en bout sur mes propres projets.",
  },
  {
    level: "learning",
    label: "En cours d'apprentissage",
    note: "Je m'y forme en ce moment : je ne les revendique pas encore comme acquises.",
  },
];

export type Skill = { name: string; domain: string; level: SkillLevel };

export const SKILLS: Skill[] = [
  // — Niveau entreprise : justifié par les stacks des stages dans career.ts.
  { name: "React.js", domain: "Front-end", level: "company" },
  { name: "Laravel", domain: "Back-end", level: "company" },
  { name: "Django", domain: "Back-end", level: "company" },
  { name: "Streamlit", domain: "Back-end", level: "company" },
  { name: "MySQL", domain: "Bases de données", level: "company" },
  { name: "PostgreSQL", domain: "Bases de données", level: "company" },

  // — Niveau projet : justifié par les fiches de projects.ts.
  { name: "Vue.js", domain: "Front-end", level: "project" },
  { name: "Next.js", domain: "Front-end", level: "project" },
  { name: "Tailwind CSS", domain: "Front-end", level: "project" },
  { name: "React Native", domain: "Mobile", level: "project" },
  { name: "Expo", domain: "Mobile", level: "project" },
  { name: "Flutter", domain: "Mobile", level: "project" },
  { name: "Dart", domain: "Mobile", level: "project" },
  { name: "Nest.js", domain: "Back-end", level: "project" },
  { name: "Flask", domain: "Back-end", level: "project" },
  { name: "JavaScript", domain: "Langages", level: "project" },
  { name: "TypeScript", domain: "Langages", level: "project" },
  { name: "Python", domain: "Langages", level: "project" },
  { name: "PHP", domain: "Langages", level: "project" },
  { name: "C / C++", domain: "Langages", level: "project" },
  { name: "MongoDB", domain: "Bases de données", level: "project" },
  { name: "Prisma", domain: "Bases de données", level: "project" },

  // — Niveau apprentissage : sujets travaillés en ce moment, sans livrable.
  { name: "DevOps & CI/CD", domain: "Ingénierie", level: "learning" },
  { name: "Machine Learning", domain: "Ingénierie", level: "learning" },
  { name: "Architecture logicielle", domain: "Ingénierie", level: "learning" },
  { name: "Design produit", domain: "Produit", level: "learning" },
];

/** Outils du quotidien — pas de niveau, ce ne sont pas des compétences à graduer. */
export const TOOLS = [
  "Git / GitHub",
  "VS Code",
  "Postman",
  "Figma",
  "Trello",
  "Linux",
];

export function skillsAt(level: SkillLevel): Skill[] {
  return SKILLS.filter((s) => s.level === level);
}

/** Regroupe par domaine en conservant l'ordre de déclaration. */
export function byDomain(skills: Skill[]): { domain: string; items: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const skill of skills) {
    const items = groups.get(skill.domain) ?? [];
    items.push(skill.name);
    groups.set(skill.domain, items);
  }
  return [...groups].map(([domain, items]) => ({ domain, items }));
}
