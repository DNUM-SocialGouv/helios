# Favoris et listes

Les favoris et listes permettent aux utilisateurs de sauvegarder des sélections d'établissements pour un usage ultérieur, faciliter le partage avec des collègues et préparer des analyses comparatives.

[Capture écran : Page "Mes listes" avec les différentes listes créées]

## Gestion des listes

### Création de listes

Chaque utilisateur peut créer plusieurs listes personnalisées :
- **Nom personnalisé** : attribution d'un nom explicite à chaque liste pour faciliter l'identification (ex. : "EHPAD région Nord", "Hôpitaux à suivre").
- **Liste "Favoris" par défaut** : une liste "Favoris" est automatiquement créée lors de la création du compte et ne peut pas être supprimée.
- **Limite de listes** : chaque utilisateur peut créer un nombre limité de listes (limite configurable selon le profil).

[Capture écran : Modal de création d'une nouvelle liste]

### Modification et suppression

- **Renommage** : possibilité de modifier le nom d'une liste existante à tout moment.
- **Suppression** : suppression d'une liste (sauf la liste "Favoris" qui est protégée). La suppression doit être confirmée pour éviter les pertes accidentelles.
- **Vidage** : option pour retirer tous les établissements d'une liste sans supprimer la liste elle-même.

[Capture écran : Menu contextuel sur une liste avec options de modification et suppression]

## Ajout d'établissements

### Depuis les résultats de recherche

- **Ajout individuel** : depuis la liste de résultats, possibilité d'ajouter un établissement à une ou plusieurs listes via un bouton dédié.
- **Ajout multiple** : sélection de plusieurs établissements dans les résultats pour les ajouter en une seule opération à une liste.

[Capture écran : Popup d'ajout aux favoris avec sélection de liste]

### Depuis la fiche établissement

- **Ajout direct** : depuis la fiche détaillée d'un établissement, bouton pour l'ajouter rapidement à une liste.
- **Création rapide** : si aucune liste n'existe encore, possibilité de créer une nouvelle liste directement depuis cette action.

### Depuis la comparaison

- **Sauvegarde de scénario** : après avoir construit un scénario de comparaison, possibilité de sauvegarder la sélection d'établissements dans une liste pour la réutiliser ultérieurement.

[Capture écran : Bouton "Ajouter aux favoris" depuis la page de comparaison]

## Consultation et utilisation

### Affichage des listes

Chaque liste affiche :
- **Nom de la liste** : identifiant clair de la liste.
- **Nombre d'établissements** : compteur du nombre d'établissements contenus dans la liste.
- **Date de création** : indication de quand la liste a été créée.
- **Date de dernière modification** : date du dernier ajout ou retrait d'établissement.

[Capture écran : Détail d'une liste avec la liste des établissements]

### Actions sur les listes

- **Consultation** : accès à la liste complète des établissements avec leurs informations principales.
- **Export** : possibilité d'exporter une liste au format Excel pour usage externe.
- **Lancement de comparaison** : sélection d'une liste pour lancer directement une comparaison des établissements qu'elle contient.
- **Retrait d'établissement** : suppression d'un établissement d'une liste sans supprimer la liste entière.

[Capture écran : Actions disponibles sur une liste (export, comparaison, etc.)]

## Partage et collaboration

### Visibilité des listes

- **Listes personnelles** : par défaut, les listes sont privées et visibles uniquement par leur créateur.
- **Partage futur** : fonctionnalité prévue pour permettre le partage de listes entre utilisateurs d'une même organisation (fonctionnalité à venir).

### Utilisation en équipe

Les listes peuvent servir à :
- **Préparer des comités** : constitution de listes d'établissements à analyser lors de réunions.
- **Suivi de dossiers** : regroupement d'établissements liés à un même dossier ou projet.
- **Reporting régulier** : listes réutilisables pour des analyses périodiques.

## Règles métier

1. **Unicité** : un même établissement peut être présent dans plusieurs listes d'un même utilisateur.
2. **Persistance** : les listes sont conservées même si l'utilisateur se déconnecte et se reconnecte.
3. **Limite d'établissements** : chaque liste peut contenir un nombre limité d'établissements pour garantir les performances (limite configurable).
4. **Synchronisation** : les modifications (ajout, retrait) sont immédiatement sauvegardées et synchronisées.

## Cas limites

- **Liste vide** : une liste peut exister sans contenir d'établissement. Un message invite à ajouter des établissements.
- **Établissement supprimé** : si un établissement est retiré de la base de données, il reste dans la liste mais l'accès à sa fiche affiche un message d'erreur approprié.
- **Limite atteinte** : si la limite de listes ou d'établissements par liste est atteinte, un message clair informe l'utilisateur et propose des actions (supprimer une liste existante, retirer des établissements).

