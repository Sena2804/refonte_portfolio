/**
 * Parcours professionnel et scolaire — source unique.
 *
 * Consommé par /parcours, /cv et la base de connaissances du chat. Les dates
 * sont stockées au format "AAAA-MM" (ou "AAAA") et mises en forme à
 * l'affichage : c'est ce qui évite d'avoir « Juillet 2025 » d'un côté et
 * « 07 / 2025 » de l'autre, à maintenir séparément.
 */

export type Experience = {
  org: string;
  role: string;
  place: string;
  start: string;
  /** Absent quand la mission est toujours en cours. */
  end?: string;
  /** Mission en cours → « depuis … ». Prime sur `end`. */
  ongoing?: boolean;
  summary: string;
  stack: string[];
  /** Sous NDA : on cite les technologies, jamais le produit. */
  confidential?: boolean;
};

export type Education = {
  school: string;
  place: string;
  title: string;
  start: string;
  /** Formation toujours en cours → « depuis … ». */
  ongoing?: boolean;
  detail: string;
};

export const EXPERIENCES: Experience[] = [
  {
    org: "W.Technologies",
    role: "Développeuse full-stack (stage, remote)",
    place: "Remote",
    // Ni date de fin ni mention « en cours » : l'affichage se limite au mois
    // de début, sans rien affirmer sur le statut actuel du stage.
    start: "Janvier 2026",
    end: "Avril 2026",
    summary:
      "Stage en développement web full-stack, en remote. Les projets sont couverts par un accord de confidentialité : seules les technologies employées sont mentionnées.",
    stack: ["React.js", "Laravel", "MySQL", "PostgreSQL", "Flutter"],
    confidential: true,
  },
  {
    org: "Direction des Bourses et Aides Universitaires (DBAU)",
    role: "Stagiaire développeuse full-stack",
    place: "Cotonou, Bénin",
    start: "Février 2026",
    end: "Mai 2026",
    summary:
      "Contribution à la refonte du système d'informations de la DBAU. La confidentialité de la mission m'oblige à ne pas en dire davantage.",
    stack: ["Django", "Streamlit", "React.js", "PostgreSQL"],
    confidential: true,
  },
];

export const EDUCATION: Education[] = [
  {
    school: "Coding Academy by Epitech",
    place: "Cotonou",
    title: "Développement web full-stack et mobile",
    start: "Juillet 2025",
    detail:
      "Formation en développement web full-stack, incluant le développement mobile.",
  },
  {
    school: "École 229",
    place: "Cotonou",
    title: "Développement web",
    start: "Octobre 2024",
    detail: "Formation en développement web.",
  },
  {
    school: "HECM",
    place: "Bohicon",
    title: "Licence professionnelle en informatique industrielle et maintenance",
    start: "2024",
    detail: "Licence professionnelle en informatique industrielle et maintenance.",
  },
  {
    school: "Cours Secondaire Saint Augustin",
    place: "Cotonou",
    title: "Baccalauréat série D",
    start: "2020",
    detail: "Baccalauréat série D.",
  },
];

const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function parse(value: string): { year: string; month?: number } {
  const [year, month] = value.split("-");
  return { year, month: month ? Number(month) - 1 : undefined };
}

/** « janvier – avril 2026 », « depuis juillet 2025 », « 2024 ». */
export function longPeriod(
  start: string,
  { end, ongoing }: { end?: string; ongoing?: boolean } = {},
): string {
  const from = parse(start);
  if (from.month === undefined) return from.year;

  const fromLabel = MONTHS[from.month];
  if (ongoing) return `depuis ${fromLabel} ${from.year}`;
  if (!end) return `${fromLabel} ${from.year}`;

  const to = parse(end);
  const toLabel = to.month === undefined ? "" : `${MONTHS[to.month]} `;
  return from.year === to.year
    ? `${fromLabel} – ${toLabel}${to.year}`
    : `${fromLabel} ${from.year} – ${toLabel}${to.year}`;
}

/** Forme compacte pour le CV : « 02 – 05 / 2026 », « depuis 01 / 2026 », « 2024 ». */
export function shortPeriod(
  start: string,
  end?: string,
  { ongoing }: { ongoing?: boolean } = {},
): string {
  const from = parse(start);
  if (from.month === undefined) return from.year;

  const pad = (m: number) => String(m + 1).padStart(2, "0");
  if (ongoing) return `depuis ${pad(from.month)} / ${from.year}`;
  if (!end) return `${pad(from.month)} / ${from.year}`;

  const to = parse(end);
  if (to.month === undefined) return `${pad(from.month)} / ${from.year}`;
  return from.year === to.year
    ? `${pad(from.month)} – ${pad(to.month)} / ${to.year}`
    : `${pad(from.month)} / ${from.year} – ${pad(to.month)} / ${to.year}`;
}
