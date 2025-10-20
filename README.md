# JRDriving

JRDriving est une application SaaS de gestion de convoyage automobile destinée aux équipes dispatch, chauffeurs et clients. Elle s'appuie sur React (Vite) côté front et sur une API REST adossée à MySQL (Hostinger) pour l'authentification et les données métier.

## Sommaire
- [Prérequis](#prérequis)
- [Installation & démarrage](#installation--démarrage)
- [Configuration API & n8n](#configuration-api--n8n)
- [Fonctionnement fonctionnel](#fonctionnement-fonctionnel)
  - [Demande de devis](#demande-de-devis)
  - [Authentification & inscription](#authentification--inscription)
  - [Accès aux tableaux de bord](#accès-aux-tableaux-de-bord)
- [Bonnes pratiques d'usage](#bonnes-pratiques-dusage)
- [Scripts npm utiles](#scripts-npm-utiles)

## Prérequis
- Node.js 18+ et npm 9+.
- Une API REST sécurisée exposant la base MySQL (Hostinger) avec les routes JRDriving (`/auth/*`, `/profiles/*`, `/quotes`, `/missions`, ...).
- Un webhook n8n pour la notification des devis.

## Installation & démarrage
```bash
npm install
npm run dev
```
L'application est servie sur [http://localhost:5173](http://localhost:5173).

Pour la production, utilisez le build Vite :
```bash
npm run build
npm run preview
```

## Configuration API & n8n
1. Copiez le fichier d'exemple et renseignez les variables :
   ```bash
   cp .env.local.example .env.local
   ```
2. Ouvrez `.env.local` et complétez :
   - `VITE_API_BASE_URL` : URL de l'API REST qui dialogue avec MySQL (exposée depuis Hostinger / Nest).
   - `VITE_N8N_WEBHOOK_QUOTE_CREATED` : URL du webhook n8n pour notifier la création de devis.
3. Redémarrez le serveur de développement après modification.

> L'API doit vérifier les rôles et permissions sur chaque route (JWT, sessions) afin de sécuriser l'accès aux données métier.

## Fonctionnement fonctionnel

### Demande de devis
- La page `/devis` expose un formulaire React Hook Form validé par Zod couvrant informations client, véhicule et mission.
- Les utilisateurs authentifiés retrouvent leurs coordonnées préremplies depuis leur profil (synchronisé depuis MySQL).
- À la soumission :
  1. Les données sont validées côté client.
  2. Une mutation TanStack Query appelle l'API REST (MySQL) pour créer le devis (`quotes`).
  3. Un évènement d'audit est enregistré via l'API.
  4. Un webhook n8n `quote_created` est déclenché pour traiter la demande.
- En cas de succès, un écran de confirmation propose de revenir à l'accueil ou de soumettre un nouveau devis.

### Authentification & inscription
- L'accès protégé repose sur l'API MySQL : les endpoints `/auth/login`, `/auth/register`, `/auth/session` et `/auth/logout` fournissent les jetons JWT et le profil associé.
- Depuis `/login`, les utilisateurs peuvent :
  - Se connecter via email/mot de passe.
  - Créer un compte (profil synchronisé dans MySQL via l'API pour éviter les doublons).
- Après authentification, l'application redirige vers le sélecteur de tableaux de bord (`/dashboards`).
- Les sessions sont persistées dans `localStorage` : un rafraîchissement maintient l'utilisateur connecté tant que le jeton reste valide et que l'API confirme le profil associé.

### Accès aux tableaux de bord
- La page `/dashboards` propose des cartes d'accès pour les rôles **Client**, **Chauffeur** et **Admin**.
- Chaque rôle déclenche une redirection vers :
  - `/client` pour la vue client (suivi des devis/missions).
  - `/chauffeur` pour la vue chauffeur (missions assignées, statut, preuves).
  - `/admin` pour la vue administrateur (statistiques, missions, devis à traiter).
- Les loaders React Router `requireAuth` et `requireRole` lisent la session locale, valident le profil via l'API MySQL puis confirment le rôle avant d'autoriser l'accès.
- En cas d'absence de droits, l'utilisateur est renvoyé vers le sélecteur ou la page de connexion.

## Bonnes pratiques d'usage
- **Sécurité** :
  - Ne stockez jamais de mots de passe en clair ; l'API doit gérer le hash et la vérification des identifiants.
  - Vérifiez systématiquement le JWT reçu avant d'interroger MySQL.
- **A11y** : conserver les labels et attributs `aria-*` sur les formulaires et composants interactifs.
- **Performances** :
  - Réutilisez les hooks TanStack Query avec des clés stables.
  - Favorisez le code-splitting par route via `lazy()`.
- **Observabilité** : centraliser les événements via l'API (table `audit_logs` MySQL) pour tracer les actions métiers importantes.
- **PWA Chauffeur** : prévoyez l'activation de Workbox et des stratégies offline pour les preuves (photos, signatures).

## Scripts npm utiles
- `npm run dev` : démarre le serveur de développement Vite.
- `npm run build` : build de production.
- `npm run preview` : sert le build localement.
- `npm test` : exécute la suite de tests.
