# Vue d'ensemble produit

## Mission
Helios fournit aux ARS une fiche de synthèse 360° sur les entités juridiques et établissements sanitaires/médico-sociaux pour accélérer le pilotage territorial. Cette promesse est rappelée dans le `README.md` (pitch orienté produit) et irrigue l’intégralité du code (Next.js côté front, API interne, data-crawler Python).

## Périmètre fonctionnel initial
- Accès sécurisé aux fiches entité/établissement avec leurs indicateurs consolidés (`src/frontend/ui/entité-juridique`, `src/frontend/ui/établissement-territorial-*`).
- Parcours de recherche simple/avancé sur les FINESS avec historique et favoris (`src/frontend/ui/recherche-avancee`, `src/frontend/ui/search-history`, `src/frontend/ui/favoris`).
- Tableau de comparaison multi-structures avec export Excel (`src/frontend/ui/comparaison/ComparaisonPage.tsx`).
- Administration des comptes, rôles et profils métiers (`src/frontend/ui/parametrage-utilisateurs`, `src/backend/métier/use-cases/ProfilesUseCase.ts`).

## Architecture fonctionnelle
1. **Collecte & enrichissement** : le dossier `datacrawler/` orchestre les imports depuis Diamant, SIICEA, SIVSS, Vigie RH, etc., puis alimente la base Postgres via TypeORM (fichiers `ajoute_le_bloc_*`).
2. **Couches métier** : les use cases (`src/backend/métier/use-cases/`) exposent des agrégations ciblées (recherche, comparaison, fiches, favoris) en s’appuyant sur des loaders spécialisés.
3. **Interface utilisateur** : Next.js (pages `src/pages/`) assemble les composants front (`src/frontend/ui/`) et pilote la navigation (auth, home, comparaisons, paramètres).
4. **Automatisation documentaire** : le dossier `documentation/` est versionné et synchronisé avec GitBook pour garantir une source unique de vérité.

## Données clés et mises à jour
- Les scripts Python chiffrent, importent et enrichissent les jeux de données sources (`datacrawler/import_*`, `datacrawler/ajoute_*`).
- Les dates de fraîcheur sont stockées et exposées aux utilisateurs (ex. `DatesMisAjourSources` utilisé dans `ComparaisonPage`).
- Les exports Excel et API internes s’appuient sur les mêmes entités métier pour assurer la cohérence des chiffres (`ResultatDeComparaison`, `ComparaisonLoader`).

## Indicateurs à documenter (backlog)
- Couverture des indicateurs sanitaires (activité, capacité, autorisations).
- Volet médico-social (ressources humaines, budget, réclamations).
- Indicateurs Vigie RH (contrats, mouvements) exposés via `src/backend/métier/use-cases/vigie-rh/ContratUseCase.ts`.
- Fréquence d’actualisation par source (à préciser à partir des pipelines `datacrawler`).
