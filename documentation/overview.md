# Vue d'ensemble produit

## Périmètre fonctionnel initial
- Accès sécurisé aux fiches entité/établissement avec indicateurs consolidés (activité, finances, RH, qualité).
- Parcours de recherche simple/avancé sur les identifiants FINESS avec historique et favoris.
- Tableau de comparaison multi-structures avec export Excel permettant d’aligner plusieurs établissements.
- Administration des comptes, rôles et profils métiers pour adapter la visibilité des données.

## Architecture fonctionnelle
1. **Collecte & enrichissement** : ingestion régulière des sources (Diamant, SIICEA, SIVSS, Vigie RH…) et harmonisation dans un référentiel commun.
2. **Couches métier** : cas d’usage (recherche, comparaison, fiches, favoris) qui contextualisent les données selon les profils.
3. **Interface utilisateur** : parcours web unifiés (authentification, accueil, recherche, fiches, comparaison, administration).
4. **Automatisation documentaire** : synchronisation GitBook pour assurer la cohérence des référentiels fonctionnels.

## Données clés et mises à jour
- Les pipelines de collecte chiffrent, importent et enrichissent les jeux de données sources.
- Les dates de fraîcheur sont affichées partout où un indicateur est présenté pour rassurer les utilisateurs sur l’actualité des chiffres.
- Les exports Excel, API internes et écrans partagent les mêmes règles de calcul pour garantir la cohérence.

## Indicateurs à documenter (backlog)
- Couverture des indicateurs sanitaires (activité, capacité, autorisations).
- Volet médico-social (ressources humaines, budget, réclamations).
- Indicateurs Vigie RH (contrats, mouvements) et leur gouvernance.
- Fréquence d’actualisation par source et calendrier de diffusion.
