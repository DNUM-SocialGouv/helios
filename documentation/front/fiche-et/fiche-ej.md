# Fiche entité juridique

## Description générale

[Capture écran : fiche entité juridique complète]

La fiche entité juridique présente une vue consolidée d'une entité juridique et de ses établissements territoriaux rattachés. Elle permet de piloter la gouvernance au niveau de l'entité juridique.

## Structure de la fiche

### Bloc Identité

[Capture écran : bloc identité]

Informations affichées :
- Nom de l'entité juridique
- Date d'ouverture
- Numéro FINESS
- SIREN
- Adresse complète
- Téléphone
- Statut juridique

Source des données : FINESS

### Liste des établissements territoriaux rattachés

[Capture écran : liste des établissements rattachés]

Affichage de tous les établissements territoriaux (sanitaires et médico-sociaux) rattachés à l'entité juridique, avec possibilité de naviguer vers leur fiche détaillée.

### Bloc Autorisations et Capacités

[Capture écran : bloc autorisations et capacités]

Indicateurs affichés :
- Capacités autorisées par activité (lits et places) :
  - Médecine
  - Chirurgie
  - Obstétrique
  - SSR (Soins de Suite et de Réadaptation)
  - Psychiatrie (complet et partiel)
  - USLD (Unité de Soins de Longue Durée)

Source des données : FINESS, ARHGOS

### Bloc Activité

[Capture écran : bloc activité]

Indicateurs affichés :
- Nombre de séjours MCO (Médecine, Chirurgie, Obstétrique) :
  - Séjours partiels médecine
  - Séjours partiels obstétrique
  - Séjours partiels chirurgie
  - Séjours complets médecine
  - Séjours complets obstétrique
  - Séjours complets chirurgie
- Journées SSR (complètes et partielles)
- Journées psychiatrie (complètes et partielles)
- Durées moyennes de séjour par discipline
- Graphiques d'évolution mensuelle de l'activité

Source des données : DIAMANT (MEN_PMSI, ANN_SAE)

### Bloc Ressources Humaines

[Capture écran : bloc ressources humaines]

Indicateurs affichés :
- Nombre d'ETP personnels médicaux (PM)
- Nombre d'ETP personnels non médicaux (PNM)
- Dépenses d'intérim PM
- Jours d'absentéisme PM
- Jours d'absentéisme PNM

Source des données : DIAMANT (ANN_ERRD_EJ)

### Bloc Budget & Finances

[Capture écran : bloc budget et finances]

Indicateurs affichés :
- Compte de résultat (dépenses et recettes par titre I-IV, section H)
- Résultat net comptable
- Taux de CAF nette (capacité d'autofinancement)
- Ratio de dépendance financière
- Allocation de ressources (enveloppes budgétaires) :
  - Enveloppes (MIGAC, FIR, etc.)
  - Sous-enveloppes
  - Mode de délégation
  - Montants alloués

Source des données : DIAMANT (QUO_SAN_FINANCE, ANN_CA_EJ_ET)

## Bouton Actions

[Capture écran : bouton Actions]

Le bouton Actions permet :
- **Export PDF** : téléchargement de la fiche complète en PDF
- **Export Excel des établissements rattachés** : export de la liste des établissements avec leurs indicateurs principaux

## Messages présents auprès des graphiques

[Capture écran : message de données indisponibles]

Chaque indicateur affiche :
- La date de dernière mise à jour de la source
- Un message si les données ne sont pas renseignées
- Un message si les données ne sont pas autorisées pour le profil de l'utilisateur

## Navigation parent/enfant

Depuis la fiche entité juridique, il est possible de cliquer sur un établissement rattaché pour accéder à sa fiche détaillée. Depuis une fiche établissement, il est possible de remonter vers l'entité juridique parente.
