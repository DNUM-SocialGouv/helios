# Documentation produit Helios

## Vision produit

Helios ambitionne d'offrir aux ARS une vue unifiée et actionnable de l'offre de soins. En unissant les données sanitaires et médico-sociales dans une fiche 360°, le produit vise :
- un diagnostic rapide de chaque entité juridique et de ses établissements rattachés ;
- un pilotage territorial basé sur des indicateurs fiables et comparables ;
- une animation des acteurs grâce à des parcours adaptés aux rôles (administrateurs nationaux, régionaux, agents terrain).

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

## À propos de cette documentation

Cette documentation fonctionne comme la source de vérité fonctionnelle et technique pour Helios. Elle est organisée en deux parties principales :

- **FRONT** : documentation orientée utilisateur couvrant l'accès à Hélios, les fonctionnalités de recherche, les fiches établissements, la comparaison, la gestion des listes, et l'administration.
- **BACK** : documentation technique couvrant le socle technique, la récupération des données, les sources de données (FINESS, DIAMANT, HAPI, Qualité, DSN), et le mémento technique.

Chaque page est pensée pour être lisible par les équipes produit, métier et technique. Les références techniques sont présentes dans la partie BACK, tandis que la partie FRONT se concentre sur une description orientée usages.

## Structure de la documentation

- **[Partie FRONT](front/README.md)** : toutes les fonctionnalités accessibles aux utilisateurs.
- **[Partie BACK](back/README.md)** : aspects techniques, pipelines de données, et infrastructure.

Consultez le [Sommaire](SUMMARY.md) pour naviguer dans l'ensemble de la documentation.

## Contribution

Voir [Règles de contribution](rules.md) pour les conventions de rédaction et les bonnes pratiques.
