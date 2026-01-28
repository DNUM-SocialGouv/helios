# Récupération des données

Cette section documente les mécanismes de récupération des données sources externes.

## Méthodes de récupération

- **[SFTP/API](sftp-api.md)** : récupération via SFTP ou API
- **[CRON](cron.md)** : planification automatique des récupérations

## Processus général

1. **Récupération** : téléchargement des fichiers depuis les sources externes
2. **Transformation** : normalisation et transformation des données
3. **Chargement** : insertion dans la base de données Helios
4. **Vérification** : contrôle de cohérence et détection d'erreurs

## Sources de données

Voir les pages dédiées pour chaque source :
- [Données FINESS](../donnees-finess.md)
- [Données DIAMANT](../donnees-diamant.md)
- [Données HAPI](../donnees-hapi.md)
- [Données Qualité](../donnees-qualite.md)
- [Données DSN](../donnees-dsn.md)
