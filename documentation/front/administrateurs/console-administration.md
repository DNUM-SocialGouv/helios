# Console d'administration

## Distinction administrateur national et régional

### Administrateur national (ADMIN_NAT)

[Capture écran : console admin national]

L'administrateur national a accès à :

- **Toutes les régions** : visualisation et gestion de toutes les régions
- **Tous les comptes** : création, modification, suppression de comptes de toutes les régions
- **Paramétrage global** : modification des profils métiers, autorisations, aide pour toutes les régions
- **Supervision** : vue d'ensemble de l'activité, statistiques globales
- **Gestion des institutions** : création et modification des institutions

### Administrateur régional (ADMIN_REG)

[Capture écran : console admin régional]

L'administrateur régional a accès à :

- **Sa région uniquement** : visualisation et gestion limitée à sa région
- **Comptes de sa région** : création, modification, activation/désactivation des comptes de sa région
- **Paramétrage régional** : modification des profils et autorisations pour sa région uniquement
- **Supervision régionale** : statistiques et activité de sa région

## Actions réalisables

### Gestion des utilisateurs

[Capture écran : gestion des utilisateurs]

- **Créer un compte** :
  - Saisir nom, prénom, email, institution
  - Attribuer un rôle
  - Attribuer des profils métiers
  - Activer le compte
- **Modifier un compte** :
  - Changer le rôle
  - Modifier les profils métiers
  - Changer l'institution
- **Activer/Désactiver un compte** :
  - Activation manuelle
  - Désactivation (comptes inactifs après 6 mois sont désactivés automatiquement)
- **Réinitialiser un mot de passe** : génération d'un nouveau mot de passe temporaire
- **Consulter l'historique d'un utilisateur** : voir les actions réalisées par un utilisateur

### Gestion des profils métiers

- Créer, modifier, supprimer des profils métiers
- Définir les autorisations par profil (voir [Paramétrage des autorisations](parametrage-autorisations.md))

### Supervision

[Capture écran : tableau de bord supervision]

- **Statistiques d'utilisation** :
  - Nombre d'utilisateurs actifs
  - Nombre de recherches effectuées
  - Nombre de fiches consultées
  - Nombre de listes créées
- **Alertes** :
  - Comptes inactifs à réactiver
  - Erreurs système
  - Problèmes de données

### Gestion des données

- Consultation des dates de mise à jour des sources de données
- Vérification de la fraîcheur des données
- Alertes en cas de retard de données

## Règles et limitations

- Les administrateurs régionaux ne peuvent pas modifier les comptes d'autres régions
- Les administrateurs régionaux ne peuvent pas créer de nouveaux rôles ou profils (réservé aux admins nationaux)
- Toutes les actions sont tracées dans un journal d'audit
- Les suppressions de comptes nécessitent une confirmation explicite
