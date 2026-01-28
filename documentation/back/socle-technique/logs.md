# Logs

## Gestion des logs

Helios génère des logs pour :

- Les erreurs applicatives
- Les accès à l'application
- Les opérations critiques (création de compte, exports, etc.)
- Les performances des requêtes

## Absence de log d'audit

**Important** : Helios ne dispose **pas actuellement** de log d'audit complet.

### Où est stocké l'historique des utilisateurs ?

L'historique des utilisateurs est stocké dans la table `search_history` de la base de données, qui enregistre :

- Les recherches effectuées par chaque utilisateur
- Les fiches consultées
- Les dates et heures de consultation

Cependant, cet historique ne couvre **pas** toutes les actions utilisateurs (modifications, exports, etc.).

### Limitations

- Pas de traçabilité complète des actions utilisateurs
- Pas de log d'audit pour les actions administratives
- Pas de journalisation des exports de données

### Évolutions prévues

L'implémentation d'un système de log d'audit complet est prévue dans les évolutions futures pour répondre aux exigences de traçabilité et de conformité.

## Outils de monitoring

- **Sentry** : suivi des erreurs applicatives
- **Logs applicatifs** : logs standard de l'application
- **Monitoring infrastructure** : surveillance de l'infrastructure d'hébergement

## Voir aussi

- [Sentry](../memento.md#sentry)
- [Pages et messages d'erreur](pages-messages-erreur.md)
