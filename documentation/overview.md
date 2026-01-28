# Vue d'ensemble produit

## Périmètre fonctionnel

Helios est une plateforme d'agrégation et de visualisation de données sanitaires et médico-sociales pour les ARS (Agences Régionales de Santé). Le produit offre :

- **Accès sécurisé** aux fiches entité/établissement avec indicateurs consolidés (activité, finances, RH, qualité).
- **Parcours de recherche** simple/avancé sur les identifiants FINESS avec historique et favoris.
- **Tableau de comparaison** multi-structures avec export Excel permettant d'aligner plusieurs établissements.
- **Gestion des listes** : création, modification, import et partage de listes d'établissements.
- **Administration** des comptes, rôles et profils métiers pour adapter la visibilité des données.
- **Vigie RH** : indicateurs de ressources humaines issus des données DSN (spécifiquement pour les EHPAD).

## Architecture fonctionnelle

1. **Collecte & enrichissement** : ingestion régulière des sources (Diamant, SIICEA, SIVSS, Vigie RH, FINESS, HAPI) et harmonisation dans un référentiel commun via le datacrawler.
2. **Couches métier** : cas d'usage (recherche, comparaison, fiches, favoris) qui contextualisent les données selon les profils utilisateurs.
3. **Interface utilisateur** : parcours web unifiés (authentification, accueil, recherche, fiches, comparaison, administration).
4. **Synchronisation GitBook** : cette documentation est synchronisée avec GitBook pour assurer la cohérence des référentiels fonctionnels.

## Données clés et mises à jour

- Les pipelines de collecte chiffrent, importent et enrichissent les jeux de données sources.
- Les dates de fraîcheur sont affichées partout où un indicateur est présenté pour rassurer les utilisateurs sur l'actualité des chiffres.
- Les exports Excel, API internes et écrans partagent les mêmes règles de calcul pour garantir la cohérence.
- Chaque source de données a sa propre fréquence de mise à jour (voir partie BACK pour les détails).

## Organisation de la documentation

Cette documentation est structurée en deux parties :

- **FRONT** : documentation fonctionnelle orientée utilisateur, accessible depuis le menu principal.
- **BACK** : documentation technique pour les développeurs et administrateurs système.

Consultez le [Sommaire](SUMMARY.md) pour naviguer dans l'ensemble de la documentation.
