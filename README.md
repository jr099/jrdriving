# JRDriving

JRDriving est une application SaaS de gestion de convoyage automobile destinée aux équipes dispatch, chauffeurs et clients. Elle s'appuie sur React (Vite) côté front et Supabase côté données/authentification.

## Sommaire
- [Prérequis](#prérequis)
- [Installation & démarrage](#installation--démarrage)
- [Configuration Supabase & n8n](#configuration-supabase--n8n)
- [Fonctionnement fonctionnel](#fonctionnement-fonctionnel)
  - [Demande de devis](#demande-de-devis)
  - [Authentification & inscription](#authentification--inscription)
  - [Accès aux tableaux de bord](#accès-aux-tableaux-de-bord)
- [Bonnes pratiques d'usage](#bonnes-pratiques-dusage)
- [Scripts npm utiles](#scripts-npm-utiles)

## Prérequis
- Node.js 18+ et npm 9+.
- Accès à un projet Supabase configuré (URL + clé `anon`).
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

## Configuration Supabase & n8n
1. Copiez le fichier d'exemple et renseignez les variables :
   ```bash
   cp .env.local.example .env.local
   ```
2. Ouvrez `.env.local` et complétez :
   - `VITE_SUPABASE_URL` : URL de votre instance Supabase.
   - `VITE_SUPABASE_ANON_KEY` : clé `anon` (jamais de `service_role` côté front).
   - `VITE_N8N_WEBHOOK_QUOTE_CREATED` : URL du webhook n8n pour notifier la création de devis.
3. Redémarrez le serveur de développement après modification.

> Les politiques RLS doivent être activées sur `profiles`, `quotes`, `missions`, `drivers`, `clients`, `audit_logs` afin de restreindre les données aux utilisateurs authentifiés, aux chauffeurs et aux administrateurs.

## Fonctionnement fonctionnel

### Demande de devis
- La page `/devis` expose un formulaire React Hook Form validé par Zod couvrant informations client, véhicule et mission.
- Les utilisateurs authentifiés retrouvent leurs coordonnées préremplies depuis leur profil Supabase.
- À la soumission :
  1. Les données sont validées côté client.
  2. Une mutation TanStack Query appelle Supabase pour insérer le devis (`quotes`).
  3. Un évènement est enregistré dans `audit_logs`.
  4. Un webhook n8n `quote_created` est déclenché pour traiter la demande.
- En cas de succès, un écran de confirmation propose de revenir à l'accueil ou de soumettre un nouveau devis.

### Authentification & inscription
- L'accès protégé repose sur Supabase Auth et l'`AuthProvider` du projet.
- Depuis `/login`, les utilisateurs peuvent :
  - Se connecter via email/mot de passe.
  - Créer un compte (profil upserté dans `profiles` pour éviter les doublons).
- Après authentification, l'application redirige vers le sélecteur de tableaux de bord (`/dashboards`).
- Les sessions sont persistées : un rafraîchissement maintient l'utilisateur connecté si la session Supabase est valide.

### Accès aux tableaux de bord
- La page `/dashboards` propose des cartes d'accès pour les rôles **Client**, **Chauffeur** et **Admin**.
- Chaque rôle déclenche une redirection vers :
  - `/client` pour la vue client (suivi des devis/missions).
  - `/chauffeur` pour la vue chauffeur (missions assignées, statut, preuves).
  - `/admin` pour la vue administrateur (statistiques, missions, devis à traiter).
- Les loaders React Router `requireAuth` et `requireRole` vérifient la session Supabase et le rôle du profil avant d'autoriser l'accès.
- En cas d'absence de droits, l'utilisateur est renvoyé vers le sélecteur ou la page de connexion.

## Bonnes pratiques d'usage
- **Sécurité** :
  - Ne jamais exposer la clé `service_role` côté front.
  - Vérifiez les policies RLS après chaque migration ou nouvelle table.
- **A11y** : conserver les labels et attributs `aria-*` sur les formulaires et composants interactifs.
- **Performances** :
  - Réutilisez les hooks TanStack Query avec des clés stables.
  - Favorisez le code-splitting par route via `lazy()`.
- **Observabilité** : compléter la table `audit_logs` pour tracer les actions métiers importantes.
- **PWA Chauffeur** : prévoyez l'activation de Workbox et des stratégies offline pour les preuves (photos, signatures).

## Scripts npm utiles
- `npm run dev` : démarre le serveur de développement Vite.
- `npm run build` : build de production.
- `npm run preview` : sert le build localement.
- `npm test` : exécute la suite de tests.

