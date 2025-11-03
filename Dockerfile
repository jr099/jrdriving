# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
# Installer les dépendances (dont dev) pour permettre la compilation TypeScript
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Compiler uniquement le backend (server)
RUN npm run server:build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Installer uniquement les dépendances nécessaires à l'exécution
COPY package*.json ./
RUN npm ci --omit=dev
# Fournir un package.json local au dossier server pour forcer CommonJS
COPY server/package.json ./server/package.json
# Copier l'artefact compilé du serveur
COPY --from=build /app/server/dist ./server/dist

# Variables & port d'écoute du serveur Express
ENV PORT=4000
EXPOSE 4000

# Santé (optionnel): nécessite curl si activé
# RUN apk add --no-cache curl
# HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
#   CMD curl -fsS http://127.0.0.1:${PORT}/health || exit 1

CMD ["node", "server/dist/index.js"]
