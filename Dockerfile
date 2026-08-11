# =============================================================================
# ÉTAGE 1 — L'ATELIER.  On y fait tout le travail salissant.
# Cet étage sera JETÉ : rien de ce qu'il contient ne se retrouve dans l'image
# finale, sauf ce qu'on ira y chercher explicitement à l'étage 2.
# =============================================================================
FROM node:24-alpine AS builder

WORKDIR /app

# Les dépendances d'abord, seules : cette couche n'est rejouée que si
# package.json ou le lockfile changent. Modifier du code ne la casse pas.
COPY package.json package-lock.json ./
RUN npm ci

# Puis le code source, qui lui change tout le temps.
COPY . .

# La compilation. Produit /app/.next — c'est LE seul résultat qui nous
# intéresse. Tout le reste (sources, TypeScript, ESLint) restera ici.
RUN npm run build


# =============================================================================
# ÉTAGE 2 — LA VITRINE.  L'image finale, celle qui sera livrée.
# Ce second FROM repart d'une machine NEUVE et VIDE. Elle ne connaît rien de
# l'étage 1 : ni les sources, ni npm install, ni les outils de compilation.
# =============================================================================
FROM node:24-alpine

WORKDIR /app

# Indique à Node et à Next qu'on tourne en production (active les optimisations
# et désactive les messages de développement).
ENV NODE_ENV=production

# Sans cette ligne, server.js n'écouterait que sur localhost À L'INTÉRIEUR du
# conteneur : la redirection de port ne verrait rien passer, et tu obtiendrais
# un conteneur qui tourne, sans erreur dans les logs, et une page blanche.
ENV HOSTNAME=0.0.0.0

# Par défaut un conteneur tourne en root. On crée un utilisateur sans privilège :
# si l'application est compromise, l'attaquant hérite d'un compte qui ne peut
# rien écrire.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Les trois morceaux du mode standalone. Plus besoin de `npm ci` ici : Next a
# déjà recopié dans `standalone` les seuls fichiers de node_modules utilisés.
#
#   1. les fichiers statiques (images, PDF) — Next ne les met PAS dans standalone
COPY --from=builder /app/public ./public
#   2. le serveur autonome + ses dépendances tracées. Le `./` déverse le contenu
#      à la racine de /app, ce qui y place le server.js lancé par le CMD.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#   3. le JS/CSS compilé — que standalone ne recopie pas non plus. L'oublier
#      donne un site qui démarre mais s'affiche sans style : l'erreur n°1.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Tout ce qui suit s'exécute sans privilège.
USER nextjs

# Documentaire : EXPOSE n'ouvre aucun port. C'est le -p au lancement qui publie.
EXPOSE 3000

# La commande jouée au DÉMARRAGE du conteneur (et pas à sa construction).
# On lance directement Node : npm n'existe plus dans cette image.
CMD ["node", "server.js"]
