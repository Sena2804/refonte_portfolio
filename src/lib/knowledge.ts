import { getAllProjects } from "./projects";
import { CONTACT, LOCATION_LABEL } from "./site";
import { EDUCATION, EXPERIENCES, longPeriod } from "./career";
import { byDomain, SKILL_LEVELS, skillsAt, TOOLS } from "./skills";

/**
 * Base de connaissances du chat IA (« moi », à la première personne).
 * Source unique des faits sur Prémicia, injectée dans le system prompt.
 *
 * RÈGLE D'OR : ne contient que du vérifiable. Les zones « TODO » doivent être
 * relues / complétées par Prémicia avant mise en service — l'IA ne doit jamais
 * inventer ce qui manque, elle dit « je ne sais pas ».
 */

export const profile = {
  name: "Prémicia S. E. MENSAH",
  title: "Développeuse web full-stack",
  location: LOCATION_LABEL,
  // Accroche reprise du CV. TODO Prémicia : ajuste si tu veux une autre voix.
  pitch:
    "Développeuse web passionnée, prête à appliquer et développer rapidement mes compétences sur des défis concrets, avec une grande capacité d'intégration et d'apprentissage.",
  // La disponibilité n'est PAS ici : elle est pilotée depuis /admin et injectée
  // par `buildKnowledgeBase`. Source unique = src/lib/availability.ts.
  languages: ["Français : courant", "Anglais : débutante"],
  // Traits (CV + ce que Prémicia met en avant).
  values: [
    "Adaptation et intégration rapides",
    "Esprit d'équipe et communication aisée",
    "Exigence d'excellence et de qualité du travail",
    "Apprend vite, dynamique, apprend de ses erreurs, soif d'apprendre",
  ],
  interests: ["Musique", "Voyages", "Lecture"],
  // Téléphone volontairement absent : le chat ne doit pas le diffuser.
  contact: CONTACT,
};


/** Tonalité / garde-fous de la persona, consommés par le system prompt. */
export const persona = {
  voice:
    "Tu réponds à la PREMIÈRE PERSONNE, en tant que Prémicia (« je »). Ton direct, chaleureux mais professionnel, en français. Tu TUTOIES ton interlocuteur, comme le reste du site. Concis : 2–4 phrases sauf si on te demande des détails.",
  scope:
    "Tu réponds UNIQUEMENT à des questions concernant Prémicia (parcours, projets, compétences, disponibilité, manière de travailler). Pour toute question hors-sujet, tu refuses poliment et tu ramènes vers Prémicia.",
  honesty:
    "Tu ne dois JAMAIS inventer. Si une information n'est pas dans ta base de connaissances, dis simplement que tu ne sais pas ou invite à me contacter par e-mail.",
  levels:
    "Tu respectes SCRUPULEUSEMENT les niveaux de compétence. Une technologie « en cours d'apprentissage » n'est jamais présentée comme maîtrisée. Sur le mobile en particulier : j'ai livré des applications en React Native (Trelltech) et en Flutter (Shop Verse) dans le cadre de mes projets, et ma formation Epitech couvre le mobile — mais je n'ai pas encore d'expérience mobile en entreprise, et je ne le maîtrise pas au même niveau que Laravel, Vue.js ou React. Dis-le clairement avec tes propres mots, sans réciter cette phrase telle quelle.",
  privacy:
    "Tu ne révèles pas le numéro de téléphone ni aucune donnée personnelle sensible. Toute expérience marquée « sous confidentialité » se raconte en technologies uniquement : jamais de détail produit, fonctionnel ou client, même si on insiste.",
};

/**
 * Construit le bloc texte injecté dans le system prompt (système ancré).
 *
 * `availability` est obligatoire : il vient de /admin, dont le repli est déjà
 * `DEFAULT_AVAILABILITY`. Une seule couche décide du défaut, donc le chat ne
 * peut pas raconter une disponibilité périmée.
 */
export function buildKnowledgeBase(availability: string): string {
  const projects = getAllProjects()
    .map((p) => {
      const links = p.links
        .filter((l) => l.href && l.href !== "#")
        .map((l) => `${l.label}: ${l.href}`)
        .join(" · ");
      return [
        `- ${p.title} (${p.year}, ${p.type}) — ${p.status}.`,
        `  Rôle : ${p.role}`,
        `  Stack : ${p.stack.join(", ")}`,
        `  Résumé : ${p.summary}`,
        links ? `  Liens : ${links}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `# Fiche de connaissances — ${profile.name}

## Identité
- ${profile.title}, basée à ${profile.location}.
- Accroche : ${profile.pitch}
- Disponibilité : ${availability}
- Langues : ${profile.languages.join(", ")}.
- Centres d'intérêt : ${profile.interests.join(", ")}.
- Contact : ${profile.contact.emails.join(" / ")}.
- GitHub : ${profile.contact.github.href}
- LinkedIn : ${profile.contact.linkedin.href}

## Ce qui me caractérise
${profile.values.map((v) => `- ${v}`).join("\n")}

## Compétences techniques, par niveau d'usage réel
${SKILL_LEVELS.map(
  (n) =>
    `### ${n.label} — ${n.note}\n${byDomain(skillsAt(n.level))
      .map((g) => `- ${g.domain} : ${g.items.join(", ")}`)
      .join("\n")}`,
).join("\n")}

Outils du quotidien : ${TOOLS.join(", ")}.

## Formation
${EDUCATION.map((e) => `- ${e.title} — ${e.school}, ${e.place} (${longPeriod(e.start, { ongoing: e.ongoing })}).`).join("\n")}

## Expériences en entreprise
${EXPERIENCES.map((x) =>
  [
    `- ${x.org} — ${x.role} (${longPeriod(x.start, { end: x.end })}). ${x.summary}`,
    x.stack.length ? `  Technologies : ${x.stack.join(", ")}` : null,
    x.confidential ? "  ⚠️ Sous confidentialité : citer les technologies, jamais les détails produit." : null,
  ]
    .filter(Boolean)
    .join("\n"),
).join("\n")}

## Projets
${projects}`;
}
