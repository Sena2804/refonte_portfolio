export type ProjectLink = {
  label: string;
  href: string;
  kind: "demo" | "github" | "design" | "doc";
};

export type ProjectSection = {
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  year: string;
  period: string;
  type: string;
  summary: string;
  description: string;
  stack: string[];
  role: string;
  team: string;
  status: string;
  context: string;
  features: string[];
  highlights: ProjectSection[];
  challenges: ProjectSection[];
  outcomes: string[];
  links: ProjectLink[];
  accent?: "default" | "warm";
  /** Visuel de couverture (capture). Si absent, un cover génératif est utilisé. */
  cover?: string;
};

export const projects: Project[] = [
  {
    slug: "my-show-time",
    number: "0001",
    title: "My Show Time",
    year: "2025",
    period: "Novembre 2025",
    type: "Application web d'événements",
    summary:
      "Plateforme de réservation de billets avec API RESTful, gestion d'événements, de réservations et de contrôle d'accès.",
    description:
      "My Show Time centralise l'ensemble du cycle de vie d'un événement : création, mise en ligne, réservation, paiement et contrôle d'accès via QR code. L'API RESTful expose un périmètre complet (concerts, groupes, utilisateurs, wishlist, réservations) et supporte des scénarios multi-rôles (organisateur, utilisateur, admin).",
    stack: ["Nest.js", "TypeScript", "MongoDB", "Mongoose", "JWT", "Swagger"],
    role: "Développeuse backend — conception d'API, modélisation des données et sécurité.",
    team: "Projet de groupe — Coding Academy",
    status: "Projet académique livré",
    context:
      "Réponse au cahier des charges C-COD-250 : bâtir une plateforme d'événements robuste, pensée pour scaler et intégrer plusieurs parcours utilisateurs. L'enjeu était moins l'UI que la fiabilité de l'API et la cohérence des règles métier (quotas, statuts, annulations).",
    features: [
      "Authentification JWT, gestion fine des rôles et middlewares de permission",
      "CRUD complet sur les concerts, groupes, utilisateurs et réservations",
      "Wishlist personnelle et recommandations simples",
      "Génération et vérification de billets avec contrôle d'accès",
      "Documentation OpenAPI auto-générée (Swagger)",
    ],
    highlights: [
      {
        title: "Modélisation orientée domaine",
        body: "Les schémas Mongoose ont été construits autour des cas d'usage réels : un concert n'est pas un document isolé, c'est un agrégat qui orchestre groupe, quotas, statuts et relations avec les utilisateurs.",
      },
      {
        title: "Contrats d'API explicites",
        body: "Chaque endpoint possède son DTO validé, sa réponse typée et son test de scénario — de quoi offrir à l'équipe front un contrat stable dès la première intégration.",
      },
    ],
    challenges: [
      {
        title: "Cohérence entre collections",
        body: "MongoDB ne gère pas les transactions distribuées hors replica set : les opérations multi-documents (réservation + décrément du quota) ont demandé un soin particulier pour éviter les états incohérents.",
      },
      {
        title: "Sécurité des routes sensibles",
        body: "Isoler les actions administrateur, empêcher l'accès croisé aux réservations d'un autre utilisateur et verrouiller les flux de paiement impliquait de tester le happy path autant que les tentatives de contournement.",
      },
    ],
    outcomes: [
      "API stable couvrant l'ensemble du scope du cahier des charges",
      "Documentation vivante consommable par le front et par l'équipe QA",
      "Socle modulaire, prêt à être étendu (notifications, paiements externes)",
    ],
    links: [
      { label: "Voir sur GitHub", href: "#", kind: "github" },
      { label: "Démo en ligne", href: "#", kind: "demo" },
    ],
  },
  {
    slug: "calculatrice-scientifique",
    number: "0002",
    title: "Calculatrice scientifique",
    year: "2025",
    period: "Novembre 2025",
    type: "Application desktop & web",
    summary:
      "Moteur de calcul scientifique avec parsing infix, Shunting Yard et évaluation en notation polonaise inversée.",
    description:
      "Une calculatrice qui ne se contente pas d'afficher des chiffres : elle implémente le parsing d'expressions mathématiques, convertit l'infixe en RPN via l'algorithme de Shunting Yard, puis évalue la pile. L'interface Tkinter (desktop) et la version Flask (web) partagent le même noyau pour garantir des résultats cohérents.",
    stack: ["Python", "Flask", "Tkinter", "Pytest"],
    role: "Conception du moteur d'évaluation, de l'interface Tkinter et de la surcouche Flask.",
    team: "Solo",
    status: "Livré",
    context:
      "Projet d'algorithmie avancée : dépasser la simple machine à quatre opérations en traitant correctement priorité des opérateurs, fonctions (sin, cos, log, racine) et parenthèses imbriquées.",
    features: [
      "Parsing d'expressions infixes complexes",
      "Conversion infix → RPN via Shunting Yard",
      "Évaluation par pile avec support des fonctions mathématiques",
      "Interface Tkinter ergonomique et version web Flask",
      "Historique des calculs et gestion des erreurs de syntaxe",
    ],
    highlights: [
      {
        title: "Un noyau partagé",
        body: "Le moteur d'évaluation est un module Python pur, sans dépendance UI. Tkinter et Flask ne sont que des façades — ce qui rend le noyau testable indépendamment et réutilisable dans d'autres contextes.",
      },
      {
        title: "Gestion des cas limites",
        body: "Division par zéro, expressions mal formées, opérateurs unaires : chaque cas est intercepté pour renvoyer un message compréhensible plutôt qu'une stack trace.",
      },
    ],
    challenges: [
      {
        title: "Associativité et priorités",
        body: "Le vrai piège du Shunting Yard n'est pas l'algorithme lui-même, c'est la table d'associativité des opérateurs (notamment la puissance à droite). Plusieurs itérations de tests ont été nécessaires pour obtenir un comportement correct.",
      },
    ],
    outcomes: [
      "Moteur fiable sur l'ensemble du jeu de tests",
      "Deux interfaces indépendantes, un seul cœur de calcul",
      "Base solide pour étendre vers un langage d'expression plus large",
    ],
    links: [
      { label: "Voir sur GitHub", href: "#", kind: "github" },
    ],
  },
  {
    slug: "yowl",
    number: "0003",
    title: "Yowl",
    year: "2025",
    period: "Octobre 2025",
    type: "Application full-stack & extension navigateur",
    summary:
      "Plateforme communautaire d'avis clients e-commerce, accessible via une application web et une extension de navigateur.",
    description:
      "Yowl permet à une communauté de publier, commenter et confronter des avis sur des produits e-commerce. Le cœur applicatif (Laravel + MySQL) est consommé à la fois par le front Vue.js et par une extension navigateur qui vient superposer les avis directement sur les pages marchandes.",
    stack: ["Vue.js", "Laravel", "MySQL", "Tailwind CSS", "Extension Web"],
    role: "Développement full-stack et intégration de l'extension navigateur.",
    team: "Projet de groupe — Coding Academy",
    status: "Projet académique livré",
    context:
      "Le brief imposait une expérience utilisable en dehors d'un site unique : la valeur d'un avis augmente lorsqu'il suit l'utilisateur sur ses plateformes d'achat habituelles. L'extension navigateur a donc été pensée comme un canal de consommation à part entière, pas comme un bonus.",
    features: [
      "Authentification, profils utilisateurs et gestion communautaire",
      "Dépôt d'avis enrichis (texte, note, pièces jointes)",
      "Flux d'actualité et recherche transverse des produits",
      "Extension navigateur affichant les avis sur les pages marchandes",
      "Modération et signalement des contenus abusifs",
    ],
    highlights: [
      {
        title: "Une API unique, deux clients",
        body: "Le même back alimente l'application web et l'extension. Les contrats REST ont été versionnés explicitement pour que l'extension puisse évoluer à son rythme sans casser la web app.",
      },
      {
        title: "UX centrée sur la confiance",
        body: "Un avis n'a de valeur que s'il est contextualisé : auteur, ancienneté, produit, note. L'interface met ces signaux en avant plutôt que de noyer l'utilisateur sous du décoratif.",
      },
    ],
    challenges: [
      {
        title: "Injection de contenu dans les pages tierces",
        body: "Afficher un widget sur des sites marchands hétérogènes implique de composer avec des CSP, des z-index et des styles globaux qu'on ne contrôle pas. L'extension encapsule strictement son DOM pour rester prévisible.",
      },
      {
        title: "Qualité des données communautaires",
        body: "Les mécanismes de modération doivent rester simples sans devenir laxistes. Un compromis a été trouvé entre auto-modération communautaire et validation humaine pour les signalements sensibles.",
      },
    ],
    outcomes: [
      "Plateforme fonctionnelle, extension compatible Chromium",
      "Architecture pensée pour accueillir d'autres canaux (mobile, widget marchand)",
      "Montée en compétence solide sur Vue 3, Laravel et les extensions Web",
    ],
    links: [
      { label: "Voir sur GitHub", href: "#", kind: "github" },
      { label: "Maquettes Figma", href: "#", kind: "design" },
    ],
  },
  {
    slug: "logiquali",
    number: "0004",
    title: "LogiQuali",
    year: "2025",
    period: "Décembre 2025",
    type: "Plateforme SaaS — qualité & conformité",
    summary:
      "Plateforme complète de gestion de Système de Management Intégré (SMI) multi-normes, pensée pour centraliser audits, risques, non-conformités et documents.",
    description:
      "LogiQuali s'adresse aux entreprises qui jonglent avec plusieurs référentiels (ISO 9001, 14001, 27001…) et qui ont besoin d'une vue unifiée sur leur conformité. La plateforme modélise explicitement les normes, les processus et les écarts, et oriente chaque rôle vers ses actions prioritaires.",
    stack: [
      "Laravel 12",
      "Vue.js 3",
      "PostgreSQL",
      "Tailwind CSS 4",
      "Pinia",
      "Sanctum",
      "PHPUnit",
      "Vitest",
    ],
    role: "Contribution full-stack : modèles Laravel, endpoints API, vues Vue.js et tests.",
    team: "Projet de groupe — Coding Academy",
    status: "Version 1 livrée",
    context:
      "Les responsables qualité travaillent aujourd'hui avec un patchwork d'outils (tableurs, dossiers partagés, e-mails). LogiQuali part du principe qu'un SMI n'est pas un livrable documentaire, mais un ensemble de processus vivants qu'il faut pouvoir piloter et auditer en continu.",
    features: [
      "Multi-entreprises avec isolation stricte des données",
      "Gestion des audits, constats et actions correctives",
      "Registre des risques multi-normes avec cartographie",
      "Gestion documentaire avec versioning et approbations",
      "Modules activables à la carte selon l'abonnement",
      "Documentation API Swagger (97 endpoints)",
    ],
    highlights: [
      {
        title: "Modélisation métier frontale",
        body: "Les entités (enterprise, norm, process, risk, non-conformity) ont été discutées en équipe avant la moindre ligne de code. La base de données reflète directement le vocabulaire métier, ce qui simplifie les audits techniques comme fonctionnels.",
      },
      {
        title: "Couverture de tests sérieuse",
        body: "49 tests PHPUnit côté back, 35 côté front via Vitest. La règle : tout nouveau modèle arrive avec son test, toute correction de bug avec son test de non-régression.",
      },
    ],
    challenges: [
      {
        title: "Permissions fines par rôle et par entreprise",
        body: "Quatre rôles (super admin, admin entreprise, collaborateur, client) se partagent des vues qui doivent rester étanches. L'usage de Spatie Permission a permis de centraliser les règles sans les éparpiller dans chaque contrôleur.",
      },
      {
        title: "Évolutivité des référentiels normatifs",
        body: "Chaque norme a ses sections et ses exigences propres. Le modèle devait accepter l'ajout d'une nouvelle norme sans migration destructive — d'où une structure générique couplée à un système de métadonnées.",
      },
    ],
    outcomes: [
      "Couverture fonctionnelle complète du cahier des charges",
      "Socle SaaS prêt à accueillir des modules supplémentaires",
      "Équipe capable d'onboarder un nouveau dev rapidement grâce à la doc et aux tests",
    ],
    links: [
      { label: "Voir sur GitHub", href: "#", kind: "github" },
      { label: "Documentation API", href: "#", kind: "doc" },
    ],
  },
  {
    slug: "my-rotten-tomatoes",
    number: "0005",
    title: "My Rotten Tomatoes",
    year: "2025",
    period: "Octobre 2025",
    type: "Application web — critique cinéma",
    summary:
      "Clone pédagogique de Rotten Tomatoes basé sur Next.js et Prisma, avec administration complète et intégration de l'API TMDB.",
    description:
      "Une application de notation de films inspirée de Rotten Tomatoes : catalogue alimenté depuis TMDB, profils utilisateurs, favoris, administration des films et des comptes. L'accent a été mis sur une architecture Next.js propre et un back Prisma clair.",
    stack: ["Next.js", "JavaScript", "MySQL", "Prisma", "TMDB API"],
    role: "Développement côté front Next.js et contribution au back Prisma / auth.",
    team: "Projet de groupe (4 personnes) — Coding Academy",
    status: "Projet académique livré",
    context:
      "Le brief invitait à reconstruire un service existant plutôt qu'à inventer un produit — excellente occasion de se confronter aux vraies décisions d'architecture : où place-t-on l'auth, comment structure-t-on les routes, qu'est-ce qui est public vs protégé ?",
    features: [
      "Authentification (inscription, login, logout)",
      "Consultation des films et de leurs fiches détaillées",
      "Ajout et retrait de favoris",
      "Administration : import TMDB, édition, suppression",
      "Gestion des utilisateurs et des rôles admin",
      "Tableau de bord avec statistiques applicatives",
    ],
    highlights: [
      {
        title: "App Router Next.js",
        body: "Toutes les pages ont été construites sur l'App Router avec une séparation claire entre server components (accès données) et client components (interactions).",
      },
      {
        title: "Prisma comme source de vérité",
        body: "Le schéma Prisma documente à lui seul le modèle de données. Chaque migration est revue, commitée, et alimente ensuite à la fois le back et les types côté front.",
      },
    ],
    challenges: [
      {
        title: "Synchronisation avec TMDB",
        body: "Éviter les doublons, gérer les mises à jour et ne pas saturer l'API tierce : l'import a été pensé comme une tâche idempotente, rejouable à volonté.",
      },
    ],
    outcomes: [
      "Application complète, responsive, testée sur les parcours critiques",
      "Montée en compétence collective sur Next.js et Prisma",
    ],
    links: [
      { label: "Voir sur GitHub", href: "#", kind: "github" },
      { label: "Maquettes Figma", href: "#", kind: "design" },
    ],
  },
  {
    slug: "audify",
    number: "0006",
    title: "Audify",
    year: "2025",
    period: "Février 2025",
    type: "Bootcamp BLO",
    summary:
      "Extraction de texte depuis un PDF et conversion audio text-to-speech pour rendre les contenus plus accessibles.",
    description:
      "Audify transforme un document PDF en piste audio exploitable. L'utilisateur dépose son fichier, sélectionne une voix, ajuste la vitesse et obtient une lecture continue. L'objectif : rendre accessibles des contenus écrits à un public en situation de handicap visuel ou de mobilité réduite.",
    stack: ["HTML", "Tailwind CSS", "JavaScript", "PDF.js", "ResponsiveVoice"],
    role: "Conception et développement front intégral.",
    team: "Bootcamp — travail collaboratif",
    status: "Prototype livré",
    context:
      "Challenge BLO orienté accessibilité : produire en temps contraint un outil utile pour des personnes qui consomment leurs contenus différemment. L'approche low-tech (HTML + JS côté client) était un choix assumé pour limiter la dépendance à un back.",
    features: [
      "Extraction locale du texte d'un PDF avec PDF.js",
      "Sélection de voix et ajustement de la vitesse de lecture",
      "Contrôles Play / Pause / Stop sur le flux audio",
      "Interface épurée, utilisable sans lecture écrit dense",
    ],
    highlights: [
      {
        title: "Zéro backend",
        body: "Tout se passe dans le navigateur : le PDF ne quitte jamais la machine de l'utilisateur, ce qui répond à la fois aux contraintes techniques du bootcamp et à des préoccupations raisonnables de vie privée.",
      },
    ],
    challenges: [
      {
        title: "Qualité d'extraction variable",
        body: "Les PDF scannés ou fortement mis en page renvoient parfois un texte brouillon. Le prototype détecte ces cas et prévient l'utilisateur plutôt que de lire n'importe quoi.",
      },
    ],
    outcomes: [
      "Prototype fonctionnel, présenté en fin de bootcamp",
      "Pratique concrète de l'accessibilité (contraste, focus, sémantique)",
    ],
    links: [
      { label: "Voir sur GitHub", href: "#", kind: "github" },
    ],
  },
  {
    slug: "racines-virtuelles",
    number: "0007",
    title: "Racines Virtuelles",
    year: "2025",
    period: "Avril 2025",
    type: "Prototype mobile — BLOchallenge",
    summary:
      "Prototype d'un jeu mobile qui valorise le patrimoine culturel béninois par la médecine traditionnelle.",
    description:
      "Racines Virtuelles propose au joueur une série de quêtes culturelles. Chaque quête raconte un pan de la médecine traditionnelle béninoise (plantes, rituels, savoirs transmis) et se conclut par une interaction ludique. L'enjeu du prototype : démontrer que le patrimoine peut devenir un terrain de jeu sans être dénaturé.",
    stack: ["Figma", "UX Research", "Prototype produit"],
    role: "Recherche utilisateur, parcours, wireframes, prototype Figma interactif.",
    team: "Équipe projet — BLOchallenge",
    status: "Prototype présenté",
    context:
      "Le concours BLOchallenge visait des solutions mobiles inspirées de la culture béninoise. La piste « médecine traditionnelle » est riche mais sensible : elle touche à du patrimoine immatériel qu'il fallait traiter avec rigueur et humilité.",
    features: [
      "Parcours de quêtes narratives linéaires et thématiques",
      "Fiches « savoirs » consultables à tout moment",
      "Système de progression et récompenses cosmétiques",
      "Mode contributeur permettant de remonter un savoir local",
    ],
    highlights: [
      {
        title: "Respect du sujet",
        body: "Avant de prototyper, nous avons cadré ce qu'on ne voulait pas faire : transformer des savoirs en gadgets, ou les présenter comme exotiques. Le ton reste documentaire, la gamification est au service du contenu.",
      },
    ],
    challenges: [
      {
        title: "Prototyper une expérience narrative",
        body: "Figma n'est pas un moteur de jeu : construire une progression crédible impliquait d'enchaîner des écrans avec des animations soignées et un scénario écrit à part entière.",
      },
    ],
    outcomes: [
      "Prototype Figma jouable de bout en bout",
      "Dossier produit argumenté pour la suite éventuelle",
    ],
    links: [
      { label: "Voir le prototype Figma", href: "#", kind: "design" },
    ],
  },
  {
    slug: "trelltech",
    number: "0008",
    title: "Trelltech",
    year: "2025",
    period: "Octobre 2025",
    type: "Application mobile cross-platform",
    summary:
      "Application mobile de gestion de projets façon Trello, alimentée par l'API REST officielle de Trello.",
    description:
      "Trelltech permet aux équipes de créer des espaces de travail, des listes, des tableaux et des cartes de tâches, sans quitter le mobile. L'application s'appuie sur l'API Trello et propose une expérience cohérente sur iOS, Android et web grâce à Expo.",
    stack: [
      "React Native",
      "Expo",
      "JavaScript",
      "Tailwind CSS (NativeWind)",
      "Axios",
      "API Trello",
    ],
    role: "Contribution au design d'UI, aux écrans et à l'intégration API.",
    team: "Projet de groupe — Coding Academy",
    status: "Prototype fonctionnel",
    context:
      "L'objectif pédagogique : consommer une API externe mature, en découvrir les limites et les quotas, et livrer une UI mobile cohérente sans réinventer la roue côté back.",
    features: [
      "Gestion CRUD des workspaces, listes, tableaux et cartes",
      "Navigation fluide par fichier avec Expo Router",
      "Authentification via clé + token Trello",
      "UI pensée mobile-first avec NativeWind",
    ],
    highlights: [
      {
        title: "Une UI native, sans sacrifier la vélocité",
        body: "Expo + NativeWind ont permis de livrer un produit testable sur les trois cibles (iOS, Android, web) sans dupliquer la base de code.",
      },
    ],
    challenges: [
      {
        title: "Contraintes d'une API tierce",
        body: "Gérer les rate limits et les erreurs de l'API Trello avec élégance, sans casser l'expérience utilisateur côté app, a demandé une couche de services dédiée.",
      },
    ],
    outcomes: [
      "App fonctionnelle multi-plateformes en fin de sprint",
      "Séparation claire services / écrans, facile à reprendre",
    ],
    links: [
      { label: "Voir sur GitHub", href: "#", kind: "github" },
    ],
  },
  {
    slug: "shop-verse",
    number: "0009",
    title: "Shop Verse",
    year: "2025",
    period: "Octobre 2025",
    type: "Application mobile — e-commerce",
    summary:
      "Application e-commerce Flutter offrant une expérience d'achat fluide, un panier dynamique et une navigation produit moderne.",
    description:
      "Shop Verse explore ce qu'on peut faire avec Flutter sur un scénario e-commerce : catalogue, fiche produit, panier, checkout simulé, états de chargement soignés et transitions animées.",
    stack: ["Flutter", "Dart", "Provider / Bloc"],
    role: "Développement mobile Flutter et intégration UI.",
    team: "Projet de groupe — Coding Academy",
    status: "Projet académique livré",
    context:
      "Découverte de Flutter dans un contexte proche du réel : pas juste un tutoriel, mais une app avec gestion d'état, navigation, et contraintes d'UI cohérentes sur iOS et Android.",
    features: [
      "Catalogue produits avec filtres et recherche",
      "Fiche produit détaillée avec variantes",
      "Panier dynamique et gestion des quantités",
      "Transitions et états de chargement soignés",
    ],
    highlights: [
      {
        title: "Une seule codebase, deux OS",
        body: "Flutter a tenu sa promesse : les différences visuelles entre iOS et Android ont été gérées par des widgets adaptatifs plutôt que par des branches conditionnelles partout.",
      },
    ],
    challenges: [
      {
        title: "Organisation de l'état",
        body: "Trouver le bon équilibre entre état local (widget) et état global (store) sans basculer dans la sur-ingénierie d'un projet d'app store.",
      },
    ],
    outcomes: [
      "App Flutter installable, parcours complet jouable",
      "Fondations propres pour brancher une vraie API",
    ],
    links: [
      { label: "Voir sur GitHub", href: "#", kind: "github" },
    ],
  },
];

export function getAllProjects() {
  return projects;
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs() {
  return projects.map((p) => ({ slug: p.slug }));
}
