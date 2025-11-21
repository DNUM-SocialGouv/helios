# Recherche simple et avancée

La recherche est le point d'entrée principal pour accéder aux fiches des établissements et entités juridiques dans Helios. Elle permet de retrouver rapidement une structure via plusieurs modes de recherche.

[Capture écran : Page d'accueil avec le champ de recherche simple]

## Recherche simple

### Éléments fonctionnels

La recherche simple est accessible depuis la page d'accueil. L'utilisateur peut saisir :
- **Numéro FINESS** : recherche exacte ou partielle sur le numéro d'identification FINESS (9 caractères).
- **Nom de l'établissement ou entité** : recherche textuelle sur la raison sociale courte.
- **Localisation** : recherche par nom de commune ou département.

### Règles de recherche

1. **Recherche textuelle intelligente** : la recherche ignore les accents, les espaces et les tirets. Par exemple, "CHU Paris" trouvera "CHU de Paris" et "CHU-Paris".
2. **Périmètre régional** : les résultats sont automatiquement filtrés selon la région de l'utilisateur (sauf pour les administrateurs nationaux qui voient toutes les régions).
3. **Priorisation des résultats** : les correspondances exactes sur le nom ou le FINESS apparaissent en premier, suivies des correspondances partielles.
4. **Validation minimale** : au moins un caractère doit être saisi pour lancer la recherche.

[Capture écran : Résultats de recherche simple avec mise en évidence des correspondances exactes]

## Recherche avancée

### Éléments fonctionnels

La recherche avancée permet de combiner plusieurs critères pour affiner la recherche :

**Filtres géographiques** :
- Sélection d'une région, d'un département ou d'une commune.
- Possibilité de combiner plusieurs zones géographiques.

**Filtres de typologie** :
- Type de structure : Entité juridique, Établissement sanitaire, Établissement médico-social.
- Statut juridique : selon la catégorisation de la structure.

**Filtres par catégories FINESS** :
- Sélection parmi les catégories d'établissements (ex. : Hôpital, EHPAD, SSIAD, etc.).
- Recherche textuelle dans la liste des catégories pour faciliter la sélection.
- Possibilité de sélectionner plusieurs catégories simultanément.

**Filtres de capacité (médico-social)** :
- Capacités pour personnes âgées (ex. : places en hébergement permanent, accueil de jour).
- Capacités pour personnes en situation de handicap.
- Autres capacités médico-sociales.

**Filtres d'activité (sanitaire)** :
- Activités MCO (Médecine, chirurgie, obstétrique).
- Activités SSR (Soins de suite et de réadaptation).
- Activités USLD (Unité de soins de longue durée).
- Activités psychiatriques.

### Règles de recherche avancée

1. **Combinaison des critères** : tous les filtres sélectionnés sont combinés avec un ET logique. La recherche nécessite au moins un critère rempli (terme de recherche ou au moins un filtre).
2. **Conservation des filtres** : les filtres sélectionnés sont conservés dans l'URL, permettant de partager ou de revenir sur une recherche précise.
3. **Réinitialisation** : un bouton permet de réinitialiser tous les filtres en un clic.

[Capture écran : Formulaire de recherche avancée avec tous les filtres dépliés]

## Affichage des résultats

### Liste des résultats

Chaque résultat affiche :
- **Numéro FINESS** : identifiant unique de la structure.
- **Raison sociale courte** : nom de l'établissement ou entité juridique.
- **Type** : Entité juridique, Établissement sanitaire ou Établissement médico-social.
- **Localisation** : commune et département.
- **Catégorie FINESS** : pour les établissements, la catégorie d'établissement est affichée.
- **Rattachement** : pour les établissements, le numéro FINESS de l'entité juridique de rattachement est indiqué.

[Capture écran : Liste des résultats avec toutes les colonnes visibles]

### Tri et pagination

1. **Tri des résultats** : possibilité de trier par raison sociale, département, commune ou type. Le tri par défaut privilégie les correspondances exactes.
2. **Pagination** : affichage de 12 résultats par page avec navigation entre les pages.
3. **Compteur de résultats** : le nombre total de résultats correspondant aux critères est affiché.

### Actions sur les résultats

- **Accès à la fiche** : clic sur un résultat pour accéder à la fiche détaillée de l'établissement ou de l'entité juridique.
- **Ajout aux favoris** : depuis la liste de résultats, possibilité d'ajouter un ou plusieurs établissements à une liste de favoris.
- **Ajout à la comparaison** : sélection d'établissements pour les comparer dans l'outil de comparaison.

[Capture écran : Actions disponibles sur un résultat (boutons favoris, comparaison)]

## Cas limites

- **Aucun résultat** : un message clair indique qu'aucun établissement ne correspond aux critères. Des suggestions sont proposées pour élargir la recherche.
- **Trop de résultats** : si plus de 1000 résultats sont trouvés, un message invite à affiner les critères de recherche.
- **Données manquantes** : si certaines informations (commune, catégorie) ne sont pas disponibles, le champ est laissé vide sans bloquer l'affichage.

