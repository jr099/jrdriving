# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
# S'assurer que les devDependencies sont installées pendant le build
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Compile uniquement le backend
RUN npm run server:build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Installer uniquement les dépendances runtime
COPY package*.json ./
RUN npm ci --omit=dev
# Copier l'artefact compilé du serveur
COPY --from=build /app/server/dist ./server/dist

EXPOSE 4000
CMD ["node", "server/dist/index.js"]

