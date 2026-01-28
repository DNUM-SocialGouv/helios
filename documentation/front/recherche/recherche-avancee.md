# Recherche avancée

## Règles de fonctionnement des filtres

[Capture écran : formulaire de recherche avancée]

La recherche avancée permet de combiner plusieurs critères de recherche pour affiner les résultats :

### Filtres disponibles

- **Géographie** :
  - Région (sélection multiple possible)
  - Département (sélection multiple possible)
  - Commune
- **Type d'établissement** :
  - Sanitaire
  - Médico-social
  - Entité juridique
- **Catégorie FINESS** : sélection parmi les catégories disponibles
- **Statut juridique** : pour les entités juridiques
- **Raison sociale** : recherche textuelle dans la raison sociale
- **Numéro FINESS** : recherche exacte ou partielle

### Comportement des filtres

- Les filtres sont combinables (ET logique).
- Le filtrage par région est pré-appliqué selon le profil utilisateur (non modifiable pour les utilisateurs non-admin).
- La recherche est déclenchée au clic sur le bouton "Rechercher".
- Les filtres peuvent être réinitialisés via un bouton "Réinitialiser".

### Validation

- Validation des formats (ex. numéro FINESS doit être au format attendu).
- Messages d'erreur explicites en cas de saisie invalide.

## Affichage des résultats

### Mode vignette

[Capture écran : résultats recherche avancée en vignettes]

Identique à la recherche simple, avec indication du nombre de résultats trouvés.

### Mode tableau

[Capture écran : résultats recherche avancée en tableau]

Le tableau affiche les mêmes colonnes que la recherche simple, avec possibilité de :
- Tri par colonne
- Sélection multiple
- Pagination
- Export Excel

## Fonctionnalités depuis le bouton Actions

[Capture écran : menu Actions dans les résultats]

Le bouton "Actions" permet d'effectuer des actions groupées sur les résultats :

- **Exporter la sélection** : export Excel des établissements sélectionnés.
- **Ajouter la sélection aux favoris** : ajout groupé aux favoris.
- **Ajouter la sélection à une liste** : ajout groupé à une liste existante ou création d'une nouvelle liste.
- **Comparer la sélection** : lancement d'une comparaison avec les établissements sélectionnés.

### Règles d'application

- Les actions s'appliquent uniquement aux établissements sélectionnés (cases à cocher).
- Si aucun établissement n'est sélectionné, un message invite à sélectionner au moins un établissement.
- Limite de sélection : jusqu'à 30000 établissements pour la comparaison.

## Cas limites

- Aucun résultat : message explicite avec suggestions pour élargir la recherche.
- Trop de résultats : message suggérant d'ajouter des filtres supplémentaires.
- Filtres incompatibles : validation et message d'erreur si les filtres sélectionnés ne peuvent pas donner de résultats.
