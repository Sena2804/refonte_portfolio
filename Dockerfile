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

# On réinstalle les dépendances, mais avec --omit=dev : cette option saute
# TypeScript, ESLint, les types... tout ce qui ne servait qu'à compiler.
# C'est ici qu'on élimine le plus gros du poids.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Le pont entre les deux étages : on va chercher dans l'atelier le résultat de
# la compilation, et uniquement lui.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Documentaire : EXPOSE n'ouvre aucun port. C'est le -p au lancement qui publie.
EXPOSE 3000

# La commande jouée au DÉMARRAGE du conteneur (et pas à sa construction).
CMD ["npm", "run", "start"]
