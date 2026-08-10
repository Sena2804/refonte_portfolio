FROM node24:alpine3.18 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci, npm run build
CMD ["npm", "run", "start"]
EXPOSE 3000