# Mails

## Liste des mails envoyés

### Création d'un compte

[Capture écran : mail de création de compte]

Lors de la création d'un compte, un email est envoyé à l'utilisateur contenant :

- Les informations de connexion
- Le mot de passe temporaire (format : `HeliosConnect-` + code géographique institution)
- Les instructions pour se connecter
- Le lien vers la page de connexion

### Mot de passe oublié

[Capture écran : mail mot de passe oublié]

Lors d'une demande de réinitialisation de mot de passe, un email est envoyé contenant :

- Un lien de réinitialisation (à durée limitée)
- Les instructions pour créer un nouveau mot de passe
- Un message de sécurité si la demande n'a pas été initiée par l'utilisateur

## Fonctionnement envoi de mail via Tipimail - Younsse

Helios utilise le service **Tipimail** (fournisseur Younsse) pour l'envoi des emails.

### Configuration

- Les emails sont envoyés via l'API Tipimail
- Configuration des templates d'email dans Tipimail
- Gestion des bounces et erreurs d'envoi

### Sécurité

- Les liens de réinitialisation de mot de passe sont à durée limitée
- Les liens contiennent des tokens sécurisés
- Les emails sont envoyés uniquement aux adresses enregistrées dans le système

### Gestion des erreurs

- En cas d'échec d'envoi, l'erreur est loggée
- Les utilisateurs peuvent réessayer la demande
- Les administrateurs peuvent réinitialiser manuellement les mots de passe si nécessaire

## Voir aussi

- [Accès à Hélios - Création de compte](../../front/acces-helios.md#création-de-compte)
- [Accès à Hélios - Mot de passe oublié](../../front/acces-helios.md#mot-de-passe-oublie)
