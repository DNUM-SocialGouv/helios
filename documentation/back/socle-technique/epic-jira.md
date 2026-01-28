# Epic Jira - Socle technique

## Présentation

Cette Epic Jira regroupe les travaux techniques liés au socle d'Helios : infrastructure, architecture, performance, sécurité.

## Intégration VIGIE RH

L'intégration de VIGIE RH (données DSN) fait partie de cette Epic et comprend :

- Récupération des données DSN via SFTP
- Transformation et chargement des données dans la base
- Affichage des indicateurs Vigie RH sur les fiches EHPAD
- Gestion des référentiels (professions, filières, motifs de rupture, etc.)

## Éléments techniques couverts

- Architecture découplée (datacrawler / backend / frontend)
- Clean Architecture pour le datacrawler et le backend
- Gestion des migrations de base de données
- Performance et optimisation des requêtes
- Sécurité et gestion des accès
- Monitoring et alertes

## Voir aussi

- [Récupération des données](../recuperation-donnees/README.md)
- [Données DSN](../donnees-dsn.md)
- [Dossier d'architecture](dossier-architecture.md)
