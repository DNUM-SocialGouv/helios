# Rôles et parcours utilisateurs

## Rôles disponibles
| Code rôle | Libellé | Ordre (priorité) | Référence code |
|-----------|---------|------------------|----------------|
| `ADMIN_NAT` | Administrateur national | 1 | `database/migrations/1720428140655-AjoutOrdreRole.ts` |
| `ADMIN_REG` | Administrateur régional | 2 | idem |
| `ADMIN_CENTR` | Administration centrale | 3 | `database/migrations/1720186540616-AjoutRoleAdministrationCentrale.ts` |
| `USER` | Agent utilisateur | 4 | `database/migrations/1720428140655-AjoutOrdreRole.ts` |

Les middlewares `src/checkAdminMiddleware.ts` et `src/checkNationalAdminMiddleware.ts` s’appuient sur ces ordres pour filtrer l’accès aux API sensibles.

## Parcours par rôle
### Administrateur national (`ADMIN_NAT`)
1. **Authentification** : via `LoginUseCase` + page `src/pages/connexion.tsx`.
2. **Pilotage des comptes** : accès complet aux pages `/settings/users` et `/settings/profiles` (`src/pages/settings/*`), création/suppression d’utilisateurs (`src/pages/api/utilisateurs`).
3. **Gestion des profils métiers** : configuration des filtres métiers (`src/frontend/ui/parametrage-profil`) pour orienter les données visibles par les agents.
4. **Supervision des régions** : lecture des vues régionales (`src/pages/region/[region].tsx`) et export global.

### Administrateur régional (`ADMIN_REG`)
1. **Authentification** : identique à l’admin national.
2. **Gestion locale des comptes** : accès à `/settings/users` mais filtrage sur la région (vu dans `userListUseCase`).
3. **Suivi des établissements** : accès complet aux fiches et à la comparaison, mais périmètre limité à la région (`codeRegion` injecté dans `ComparaisonPage`).
4. **Reporting** : export Excel régional via `ExportExcel`.

### Administration centrale (`ADMIN_CENTR`)
- Rôle introduit pour consolider les visions nationales tout en restant hors des actions sensibles (migration `1720186540616`).
- Accès lecture seule aux écrans de comparaison, recherche et historiques.
- Peut préparer des listes de favoris partagées, mais ne gère pas les comptes.

### Agent utilisateur (`USER`)
1. **Entrée** : tableau de bord d’accueil (`src/frontend/ui/home`).
2. **Recherche** : formulaires simples et avancés (`src/frontend/ui/recherche-avancee`) + historique (`src/frontend/ui/search-history`).
3. **Analyse 360°** : navigation entre entité juridique et établissements rattachés (`src/backend/métier/use-cases/RécupèreLEntitéJuridiqueUseCase.ts`).
4. **Comparaison & exports** : `ComparaisonPage` pour sélectionner plusieurs FINESS, sauvegarder dans des listes (`src/frontend/ui/liste`) et exporter.
5. **Suivi RH** : consultation des blocs Vigie RH quand disponibles (`ContratUseCase`).

## Parcours transverses
- **Mot de passe oublié / reset** : pages `mot-passe-oublie.tsx`, `reinitialisation-mot-passe.tsx` et API `pages/api/mot-passe-oublie.ts`, `pages/api/update-password.ts`.
- **Historique de recherche** : API `pages/api/history` + composant `src/frontend/ui/search-history`.
- **Favoris** : `FavorisUseCase` et UI `src/frontend/ui/favoris` permettent de partager des sélections via listes nommées.
