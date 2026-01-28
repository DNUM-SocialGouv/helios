# Import d'établissements dans une liste

## Point d'entrée disponible

[Capture écran : import depuis Mes listes]

L'import d'établissements est disponible depuis :

1. **Page "Mes listes"** : lors de la création d'une nouvelle liste ou depuis le bouton "Actions" d'une liste existante
2. **Page de comparaison** : via le bouton "Actions" puis "Importer"

## Format du fichier

{% hint style="warning" %}
**Format requis** : Le fichier à importer doit être au format **Excel (.xlsx)** ou **CSV** et contenir une colonne avec les numéros FINESS (9 caractères). Les autres colonnes seront ignorées.
{% endhint %}

Le fichier à importer doit être au format **Excel (.xlsx)** ou **CSV** et contenir :

- Une colonne avec les **numéros FINESS** des établissements
- Le numéro FINESS doit être au format attendu (9 caractères)

**Exemple de format de fichier :**

```csv
numero_finess
123456789
987654321
```

[Capture écran : exemple de fichier à importer]

## Étapes d'import

### Depuis "Mes listes"

1. Accéder à "Mes listes" depuis le menu
2. Option A - Créer une nouvelle liste avec import :
   - Cliquer sur "Créer une liste"
   - Saisir le nom de la liste
   - Cliquer sur "Importer des établissements"
   - Sélectionner le fichier
   - Valider
3. Option B - Importer dans une liste existante :
   - Ouvrir une liste existante
   - Cliquer sur "Actions" puis "Importer des établissements"
   - Sélectionner le fichier
   - Valider

### Depuis la page de comparaison

1. Cliquer sur "Actions" puis "Importer"
2. Sélectionner le fichier
3. Valider
4. Les établissements importés sont ajoutés à la comparaison

## Traitement de l'import

[Capture écran : résultats de l'import]

Après l'import :

1. Le système vérifie la validité des numéros FINESS
2. Les établissements valides sont ajoutés à la liste
3. Un rapport d'import s'affiche avec :
   - Le nombre d'établissements importés avec succès
   - Le nombre d'établissements non trouvés (FINESS invalides ou absents de la base)
   - La liste des erreurs éventuelles

## Règles

{% hint style="danger" %}
**FINESS invalides** : Les numéros FINESS invalides ou absents de la base de données sont automatiquement ignorés lors de l'import. L'import continue même si certains FINESS sont invalides, mais seuls les établissements valides seront ajoutés à la liste.
{% endhint %}

{% hint style="info" %}
**Limite d'import** : L'import peut contenir jusqu'à 30000 établissements. Si votre fichier dépasse cette limite, vous devrez le diviser en plusieurs fichiers.
{% endhint %}

- Les numéros FINESS invalides sont ignorés (pas d'erreur bloquante)
- Les doublons ne sont pas vérifiés automatiquement
- L'import peut contenir jusqu'à 30000 établissements
- Le fichier peut contenir d'autres colonnes qui seront ignorées (seule la colonne FINESS est utilisée)

## Cas limites

- **Fichier vide** : message d'erreur, aucun établissement ajouté
- **Format incorrect** : message d'erreur avec indication du format attendu
- **Aucun FINESS valide** : message informatif, aucun établissement ajouté
- **FINESS non trouvé** : l'établissement est ignoré mais l'import continue
