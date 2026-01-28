# Mémento technique

## Éléments à vérifier pour la bonne version des éléments techniques

### Versions des dépendances

- **Node.js** : version spécifiée dans `.tool-versions`
- **Python** : version spécifiée dans `pyproject.toml` ou `Pipfile`
- **PostgreSQL** : version de la base de données (voir migrations)
- **Next.js** : version dans `package.json`
- **Autres dépendances** : versions dans `package.json` et `Pipfile`

### Versions des outils

- **TypeORM** : version pour les migrations
- **React** : version pour le frontend
- **Autres outils** : versions dans les fichiers de configuration

## Source de données

### Galaxie

Les sources de données sont documentées dans la "Galaxie" des sources de données, qui référence :

- Les contacts ou emails de support pour chaque source
- Les calendriers de mise à jour
- Les formats de fichiers
- Les procédures de récupération

**Pour les sources de données, intégrer les contacts ou le mail de support ?**

Oui, il est recommandé d'intégrer dans la documentation :
- Les contacts de support pour chaque source
- Les emails de support
- Les procédures de contact en cas de problème

### Rappels spécifiques

- **Diamant - ANN_SAE** : mise à jour en septembre de l'année. Rappeler à Diamant de nous envoyer les données si nécessaire.

## Sentry

### Configuration

- **DSN Sentry** : configuré dans les variables d'environnement
- **Environnement** : production, staging, développement
- **Taux d'échantillonnage** : configuré pour les traces

### Utilisation

- Suivi des erreurs applicatives
- Monitoring des performances
- Alertes en cas d'erreurs critiques

### Accès

Les administrateurs ont accès au tableau de bord Sentry pour consulter les erreurs et les performances.

## Contacts et support

### Support technique

- Email de support technique
- Canal de communication pour les incidents
- Procédures d'escalade

### Support métier

- Contacts pour les questions métier
- Support pour les utilisateurs finaux

### Contacts par source de données

- **FINESS** : contact DNUM
- **DIAMANT** : contact DGOS/Diamant
- **HAPI** : contact HAPI
- **SIICEA/SIVSS/SIREC** : contacts respectifs
- **Vigie RH** : contact Vigie RH

## Voir aussi

- [Hébergement](socle-technique/hebergement.md)
- [Logs](socle-technique/logs.md)
- [Récupération des données](recuperation-donnees/README.md)
