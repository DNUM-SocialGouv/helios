# Paramétrage des autorisations

## Présentation

Le paramétrage des autorisations permet de définir quels indicateurs et blocs sont visibles pour chaque profil métier.

## Fonctionnement

[Capture écran : interface de paramétrage des autorisations]

Le paramétrage s'effectue par **profil métier** :

1. Sélectionner un profil métier
2. Définir les autorisations pour ce profil :
   - **Blocs autorisés** : quels blocs de la fiche sont visibles (Activité, Finances, RH, Qualité, Autorisations)
   - **Indicateurs autorisés** : quels indicateurs spécifiques sont visibles dans chaque bloc

### Exemple de configuration

Pour un profil "Financier" :
- Bloc Budget & Finances : **autorisé**
- Bloc Activité : **non autorisé**
- Bloc RH : **non autorisé**
- Indicateurs financiers spécifiques : sélection des indicateurs à afficher

## Actions à réaliser en cas de nouveau bloc ou indicateur

### Ajout d'un nouveau bloc

1. Accéder au paramétrage des autorisations
2. Pour chaque profil métier concerné :
   - Ajouter le nouveau bloc dans la liste des blocs
   - Définir si le bloc est autorisé ou non
   - Si autorisé, définir les indicateurs du bloc à afficher
3. Sauvegarder les modifications

### Ajout d'un nouvel indicateur

1. Accéder au paramétrage des autorisations
2. Repérer le bloc contenant le nouvel indicateur
3. Pour chaque profil métier concerné :
   - Ajouter le nouvel indicateur dans la liste des indicateurs du bloc
   - Définir si l'indicateur est autorisé ou non pour ce profil
4. Sauvegarder les modifications

## Impact des modifications

- Les modifications sont **immédiates** : les utilisateurs voient les changements dès leur prochaine connexion
- Les modifications s'appliquent à **tous les utilisateurs** ayant le profil concerné
- Les données déjà affichées ne sont pas affectées, seules les nouvelles consultations reflètent les changements

## Règles

{% hint style="warning" %}
**Restrictions de rôles** : Les administrateurs régionaux peuvent uniquement modifier les profils de leur région. Seuls les administrateurs nationaux peuvent modifier tous les profils et créer de nouveaux profils.
{% endhint %}

- Un indicateur ne peut être visible que si son bloc parent est autorisé
- Les administrateurs nationaux peuvent modifier tous les profils
- Les administrateurs régionaux peuvent modifier les profils de leur région uniquement
- Les modifications sont tracées (qui, quand, quoi)
