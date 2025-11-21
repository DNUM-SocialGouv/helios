# Import de listes

L'import de listes permet d'ajouter rapidement plusieurs établissements à une liste en collant leurs numéros FINESS. Cette fonctionnalité est particulièrement utile pour importer des listes existantes depuis d'autres sources (fichiers Excel, documents, etc.).

[Capture écran : Modal d'import avec le champ de saisie des FINESS]

## Accès à la fonctionnalité

L'import de listes est accessible depuis :
- **Page "Mes listes"** : bouton "Importer des établissements" disponible sur chaque liste.
- **Page de détail d'une liste** : bouton d'import dans la barre d'actions de la liste.

[Capture écran : Bouton d'import dans la barre d'actions d'une liste]

## Processus d'import

### Saisie des numéros FINESS

L'utilisateur colle dans un champ texte les numéros FINESS des établissements à importer :
- **Format** : un numéro FINESS par ligne (9 caractères).
- **Séparateurs** : les FINESS peuvent être séparés par des retours à la ligne, des espaces ou des virgules.
- **Nettoyage automatique** : les lignes vides sont automatiquement ignorées.

[Capture écran : Champ de saisie avec exemple de FINESS collés]

### Validation et recherche

Lors du clic sur "Valider", le système :
1. **Extrait les FINESS** : parse le texte saisi pour extraire tous les numéros FINESS.
2. **Recherche les établissements** : interroge la base de données pour trouver les établissements correspondants.
3. **Déduplique** : supprime automatiquement les doublons (même FINESS saisi plusieurs fois).
4. **Affiche les résultats** : présente les établissements trouvés dans un tableau avec leur numéro FINESS et leur raison sociale.

[Capture écran : Tableau des établissements trouvés après validation]

### Gestion des erreurs

Si certains FINESS ne correspondent à aucun établissement dans la base de données :
- **FINESS en erreur** : les FINESS non trouvés restent dans le champ de saisie pour correction.
- **Message d'erreur** : un message indique le nombre de FINESS en erreur et invite à les vérifier.
- **Tableau d'erreur** : un tableau affiche les FINESS en erreur pour faciliter leur identification.

L'utilisateur peut corriger les FINESS erronés et relancer la validation. Seuls les établissements valides sont conservés pour l'import.

[Capture écran : Message d'erreur avec les FINESS non trouvés]

### Sélection de la liste de destination

Une fois les établissements validés, l'utilisateur choisit la liste de destination :
- **Liste existante** : sélection dans un menu déroulant de toutes les listes disponibles.
- **Nouvelle liste** : possibilité de créer une nouvelle liste directement depuis l'import en saisissant son nom.

[Capture écran : Sélection de la liste de destination avec option de création]

### Finalisation de l'import

Lors du clic sur "Importer", les établissements validés sont ajoutés à la liste sélectionnée :
- **Ajout en masse** : tous les établissements sont ajoutés en une seule opération.
- **Déduplication** : si un établissement est déjà présent dans la liste, il n'est pas ajouté en double.
- **Confirmation** : un message de succès confirme le nombre d'établissements importés.
- **Actualisation** : la liste est automatiquement actualisée pour afficher les nouveaux établissements.

[Capture écran : Message de succès après import]

## Règles fonctionnelles

1. **Format FINESS** : seuls les numéros FINESS valides (9 caractères) sont acceptés. Les formats incorrects sont considérés comme des erreurs.
2. **Périmètre régional** : seuls les établissements de la région de l'utilisateur peuvent être importés (sauf pour les administrateurs nationaux).
3. **Limite de listes** : si l'utilisateur a atteint la limite de listes (11 listes), l'option de création d'une nouvelle liste est désactivée.
4. **Déduplication** : les doublons sont automatiquement supprimés, que ce soit dans la saisie ou lors de l'ajout à la liste.
5. **Validation progressive** : l'utilisateur peut valider plusieurs fois pour ajouter progressivement des établissements. Les établissements déjà validés sont conservés.

## Cas limites

- **Aucun FINESS valide** : si tous les FINESS saisis sont en erreur, aucun établissement n'est importé et un message invite à vérifier les numéros.
- **Liste pleine** : si la liste de destination a atteint sa limite d'établissements, l'import est bloqué avec un message explicite.
- **FINESS hors périmètre** : les établissements hors du périmètre régional de l'utilisateur ne sont pas trouvés et apparaissent comme des erreurs.
- **Import partiel** : si certains FINESS sont valides et d'autres non, seuls les établissements valides sont importés. Les FINESS en erreur restent dans le champ pour correction.

## Avantages de l'import

- **Gain de temps** : permet d'importer rapidement de nombreux établissements sans les rechercher un par un.
- **Réutilisation** : facilite la réutilisation de listes existantes depuis d'autres sources (Excel, documents, etc.).
- **Précision** : l'utilisation des numéros FINESS garantit l'identification exacte des établissements.
- **Flexibilité** : permet de créer une nouvelle liste ou d'enrichir une liste existante en une seule opération.

[Capture écran : Exemple d'utilisation complète montrant l'import réussi]

