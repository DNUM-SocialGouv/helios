# Hébergement

## Infrastructure

Helios est hébergé sur une infrastructure cloud avec les composants suivants :

- **Application** : hébergement de l'application Next.js
- **Base de données** : PostgreSQL
- **Stockage** : stockage des fichiers et données
- **SFTP** : serveur SFTP pour la récupération des données sources

## Environnements

- **Production** : environnement de production accessible aux utilisateurs
- **Staging** : environnement de pré-production pour les tests
- **Développement** : environnements de développement locaux

## Sécurité

- Chiffrement des données en transit (HTTPS)
- Chiffrement des données sensibles (mots de passe, données sources)
- Authentification sécurisée
- Gestion des clés et secrets dans des coffres forts dédiés

## Monitoring

- Surveillance de la disponibilité de l'application
- Monitoring des performances
- Alertes en cas d'incident
- Suivi des logs d'erreur via Sentry

## Voir aussi

- [Sentry](../memento.md#sentry)
- [Dossier d'architecture](dossier-architecture.md)
