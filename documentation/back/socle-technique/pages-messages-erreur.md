# Pages et messages d'erreur

## Page d'erreur

[Capture écran : page d'erreur 404]

Helios dispose de pages d'erreur dédiées :

- **404** : page non trouvée
- **500** : erreur serveur
- **403** : accès interdit (si applicable)

Ces pages affichent un message clair à l'utilisateur et un lien pour retourner à la page d'accueil.

## Message d'erreur

[Capture écran : message d'erreur dans l'interface]

Les messages d'erreur dans l'interface sont affichés sous forme de :

- **Alertes** : messages d'erreur temporaires en haut de page
- **Messages inline** : erreurs de validation dans les formulaires
- **Modales** : erreurs critiques nécessitant une action utilisateur

### Types d'erreurs

- **Erreurs de validation** : données saisies invalides
- **Erreurs de connexion** : problèmes de réseau ou serveur
- **Erreurs d'autorisation** : accès non autorisé
- **Erreurs de données** : données indisponibles ou obsolètes

## Message de validation / Confirmation d'enregistrement

[Capture écran : message de confirmation]

Les messages de validation et de confirmation sont affichés pour :

- **Création de compte** : confirmation de création avec instructions
- **Modification de données** : confirmation de sauvegarde
- **Export** : confirmation de téléchargement
- **Ajout à une liste** : confirmation d'ajout

Ces messages sont généralement affichés sous forme d'alerte de succès (vert) et disparaissent automatiquement après quelques secondes.

## Gestion des erreurs

- Les erreurs sont loggées dans Sentry pour suivi
- Les erreurs critiques sont notifiées aux administrateurs
- Les messages d'erreur sont rédigés en français clair et orientés utilisateur

## Voir aussi

- [Sentry](../memento.md#sentry)
- [Logs](logs.md)
