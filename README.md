# jrdriving – Plateforme de convoyage automobile Galaxj Air Digital

Solution web complète (front + API + base de données) pour piloter le pôle "Convoyage automobile" jrdriving. Le projet combine vitrine commerciale, formulaires intelligents, portails clients/chauffeurs et outils internes d'administration prêts pour l'intégration à vos automatisations (n8n, Make, Google Sheets, Orgatour).

## 🧰 Pile technique

- **Frontend** : React 18 + Vite, TypeScript, Tailwind CSS, React Router
- **Backend API** : Node.js 20, Express 4, TypeScript
- **ORM & Base** : Drizzle ORM + MySQL (compatible MariaDB), migrations fournies
- **Auth** : Cookies sécurisés (JWT), rôles (admin/driver/client), flux mot de passe oublié / réinitialisation
- **Automatisation** : Webhooks configurables (devis, recrutements, notifications de mission, reset password)

## 🚀 Fonctionnalités clés

- Vitrine jrdriving (services B2B/B2C, confiance, CTA, chatbot)
- Formulaire de devis avec pièces jointes (stockées en base + dispatch automation)
- Suivi public de mission par numéro + dashboards client/driver/admin
- Espace chauffeurs : missions, statut en temps réel, actions rapides
- Espace admin : statistiques IA, devis à traiter, candidatures chauffeurs, téléchargements de pièces jointes
- Portail recrutement chauffeurs avec dépôt de documents
- Auth complète : inscription, connexion, logout, reset password
- Intégration prête pour webhooks (Google Sheets / n8n / Make / Orgatour)

## 📦 Prérequis

- Node.js >= 20
- MySQL 8+ (ou compatible MariaDB)
- npm >= 9

## ⚙️ Installation & lancement local

```bash
# Installer les dépendances
npm install

# Lancer le frontend (http://localhost:5173)
npm run dev

# Lancer l'API (http://localhost:4000)
npm run server:dev
```

> Les deux services partagent le même repo. En développement, configurez `CORS_ORIGIN=http://localhost:5173` pour permettre les requêtes du front vers l'API.

## 🗄️ Base de données & migrations

1. Créez une base MySQL dédiée (ex : `jrdriving`).
2. Configurez votre `.env` (voir section ci-dessous).
3. Exécutez la migration initiale :

```bash
npm run db:migrate
```

Pour générer de nouvelles migrations après modification du schéma Drizzle :

```bash
npm run db:generate
```

Les définitions SQL initiales se trouvent dans `server/drizzle/0000_init.sql`.

## 🔐 Variables d'environnement

Copiez `.env.example` vers `.env` et renseignez les valeurs :

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` ou `production` |
| `PORT` | Port HTTP de l'API Express |
| `DATABASE_URL` | Chaîne de connexion MySQL (`mysql://user:pass@host:port/db`) |
| `JWT_SECRET` | Secret signé pour les tokens (obligatoire en production) |
| `JWT_EXPIRES_IN` | Durée de validité des tokens (ex: `7d`) |
| `CORS_ORIGIN` | Origines autorisées (ex: `http://localhost:5173` ou domaines séparés par des virgules) |
| `AUTH_COOKIE_NAME` | Nom du cookie d'authentification |
| `AUTH_COOKIE_MAX_AGE` | Durée de vie du cookie (secondes) |
| `AUTH_COOKIE_SAME_SITE` | `lax`, `strict` ou `none` |
| `AUTOMATION_QUOTE_WEBHOOKS` | Liste (séparée par virgules) d'URL webhook déclenchées à la création d'un devis |
| `AUTOMATION_DRIVER_WEBHOOKS` | Webhooks pour les candidatures chauffeurs |
| `MISSION_NOTIFICATION_WEBHOOKS` | Webhooks notifiés lors d'un changement de statut mission |
| `PASSWORD_RESET_WEBHOOKS` | Webhooks recevant les demandes de reset password |

## 🔄 Webhooks & automatisations

- **Devis** : payload JSON comprenant toutes les informations + pièces jointes en base64.
- **Recrutement** : idem avec détails chauffeur et documents.
- **Missions** : statut courant, statut précédent, priorité, dates.
- **Reset password** : email, token et échéance pour orchestrer l'envoi d'email via n8n/Make.

## 🔁 Tâches planifiées recommandées

- Nettoyage quotidien des `password_reset_tokens` expirés (cron serveur ou job n8n).
- Sauvegarde nocturne de la base MySQL (mysqldump ou service managé).
- Synchronisation automatique vers Google Sheets / CRM (hook n8n déclenché via webhooks ci-dessus).
- Vérification hebdomadaire des missions sans clôture (script qui interroge `/api/admin/dashboard`).

> Ces tâches peuvent tourner côté VPS (cron), via une file de jobs (BullMQ) ou orchestrées dans n8n/Make selon vos préférences.

## 🧪 Qualité & scripts utiles

```bash
npm run lint          # ESLint
npm run typecheck     # Vérification TypeScript front
npm run server:build  # Compilation TypeScript du backend
npm test              # Suite de tests Node (auth)
```

## ☁️ Déploiement (Coolify / VPS)

1. **Backend** :
   - Construire l'image Docker fournie (`Dockerfile`).
   - Monter un volume pour `/app/server/dist` si nécessaire.
   - Fournir les variables d'environnement (voir tableau ci-dessus).
   - Exposer le port 4000 via Traefik/NGINX.

2. **Frontend** :
   - Construire le bundle Vite (`npm run build`).
   - Servir le répertoire `dist/` via un CDN ou nginx (ou utiliser Coolify Static App).
   - Configurer le reverse proxy pour pointer `/api/*` vers l'API Express.

3. **Base MySQL** :
   - Provisionner via votre hébergeur (RDS, PlanetScale, Render, etc.).
   - Importer le schéma (`npm run db:migrate`).

4. **Sécurité** :
   - Définir un `JWT_SECRET` robuste.
   - Activer HTTPS côté reverse proxy.
   - Ajuster `AUTH_COOKIE_SAME_SITE=none` + `CORS_ORIGIN` pour un front sur domaine différent.

## 📞 Support & personnalisation

- Adapter les textes légaux dans `src/pages/Legal.tsx`, `Terms.tsx`, `Privacy.tsx`.
- Personnaliser les logos/partenaires dans `Home.tsx`.
- Intégrer des appels API externes supplémentaires (Google Drive, Orgatour) dans `server/src/services/integrations.ts`.
- Pour activer des notifications SMS, branchez votre outil (ex: Twilio) dans `notifyMissionStatusChange`.

---

**Galaxj Air Digital – jrdriving** · Plateforme prête pour vos opérations de convoyage et vos automatisations professionnelles.
