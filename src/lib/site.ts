/**
 * Faits sur le site qui vivent à plusieurs endroits : localisation et contact.
 *
 * Volontairement sans dépendance — ce module est importé aussi bien par des
 * composants client (le calendrier du hero) que par la base de connaissances
 * du chat, qui elle tire tous les projets. L'isoler évite d'embarquer cette
 * base dans le bundle navigateur.
 */

/**
 * Origine publique du site, sans slash final.
 *
 * Ordre de résolution : la variable explicite, puis le domaine de production
 * fourni automatiquement par Vercel, puis le domaine visé. Sans ça, un
 * déploiement sur *.vercel.app annoncerait des URLs canoniques inexistantes
 * dans le sitemap, robots.txt et les balises Open Graph.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://premicia.dev")
).replace(/\/$/, "");

export const SITE_LOCATION = {
  city: "Cotonou",
  country: "Bénin",
  /** Identifiant IANA — sert à l'horloge du hero et aux horodatages de /admin. */
  timeZone: "Africa/Porto-Novo",
};

/** "Cotonou, Bénin" — forme en prose, dérivée pour rester synchronisée. */
export const LOCATION_LABEL = `${SITE_LOCATION.city}, ${SITE_LOCATION.country}`;

/**
 * Liens de contact. `label` est ce qui s'affiche, `href` où l'on va : les deux
 * vivent ensemble pour qu'ils ne puissent pas diverger.
 */
export const CONTACT = {
  emails: ["mensahsena03@gmail.com", "premicia.mensah@epitech.eu"],
  linkedin: {
    href: "https://www.linkedin.com/in/pr%C3%A9micia-mensah/",
    label: "linkedin.com/in/prémicia-mensah",
  },
  github: {
    href: "https://github.com/Sena2804",
    label: "github.com/Sena2804",
  },
};
