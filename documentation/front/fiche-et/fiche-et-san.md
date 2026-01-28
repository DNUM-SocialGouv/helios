# Fiche établissement sanitaire

## Description générale

[Capture écran : fiche établissement sanitaire complète]

La fiche établissement sanitaire présente une vue détaillée adaptée aux établissements de santé avec indicateurs d'activité, autorisations, capacités et qualité.

## Structure de la fiche

### Bloc Identité

[Capture écran : bloc identité]

Informations affichées :
- Nom de l'établissement
- Date d'ouverture
- Numéro FINESS
- SIRET
- Adresse complète
- Téléphone
- Courriel
- Commune, département, région
- Catégorie d'établissement
- Type d'établissement
- Raison sociale de l'entité juridique de rattachement
- Classification

Source des données : FINESS

### Bloc Autorisations et Capacités

[Capture écran : bloc autorisations et capacités]

Indicateurs affichés :
- **Capacités autorisées par activité** (graphique) :
  - Lits médecine
  - Lits chirurgie
  - Lits obstétrique
  - Lits SSR
  - Places médecine
  - Places chirurgie
  - Places obstétrique
  - Places SSR
  - Lits ou places psychiatrie (complet)
  - Places psychiatrie (partiel)
  - Lits USLD
- **Autorisations sanitaires** (liste détaillée) :
  - Code autorisation ARHGOS
  - Activité autorisée
  - Modalité d'exercice
  - Mention
  - Pratique thérapeutique spécifique
  - Date d'autorisation
  - Date de fin
  - Date de mise en œuvre
- **Autres activités sanitaires** :
  - Activités spécifiques
  - Forme d'activité
  - Modalité de prise en charge

Source des données : FINESS, ARHGOS

### Bloc Activité

[Capture écran : bloc activité]

Indicateurs affichés :
- **Séjours MCO** (graphique d'évolution) :
  - Séjours partiels médecine
  - Séjours partiels obstétrique
  - Séjours partiels chirurgie
  - Séjours complets médecine
  - Séjours complets obstétrique
  - Séjours complets chirurgie
- **Journées SSR** :
  - Journées complètes SSR
  - Journées partielles SSR
- **Journées psychiatrie** :
  - Journées complètes psychiatrie
  - Journées partielles psychiatrie
- **Passages aux urgences**
- **Séjours HAD** (Hospitalisation À Domicile)
- **Journées USLD** (Unité de Soins de Longue Durée)
- **Durées moyennes de séjour** :
  - DMS médecine
  - DMS chirurgie
  - DMS obstétrique
- Graphiques d'évolution mensuelle de l'activité

Source des données : DIAMANT (MEN_PMSI, ANN_RPU, ANN_SAE)

### Bloc Ressources Humaines

[Capture écran : bloc ressources humaines]

Indicateurs affichés :
- Nombre d'ETP personnels médicaux (PM)
- Nombre d'ETP personnels non médicaux (PNM)
- Dépenses d'intérim PM
- Jours d'absentéisme PM
- Jours d'absentéisme PNM

Source des données : DIAMANT (ANN_ERRD_EJ_ET)

### Bloc Budget & Finances

[Capture écran : bloc budget et finances]

Indicateurs affichés :
- Dépenses et recettes par titre (I, II, III, IV) :
  - Global
  - Section H
- Résultat net comptable sanitaire
- Taux de CAF nette sanitaire
- Ratio de dépendance financière

Source des données : DIAMANT (QUO_SAN_FINANCE)

### Bloc Qualité

[Capture écran : bloc qualité]

Indicateurs affichés :
- **Inspections et contrôles** (graphique) :
  - Nombre d'inspections par année
  - Type de mission
  - Thème régional
  - Type de planification
  - Modalité de mission
  - Statut de mission
  - Date de visite
  - Date de rapport
  - Nombre d'écarts
  - Nombre de remarques
  - Injonctions, prescriptions, recommandations
  - Saisines (CNG, juridiction, parquet, autre)
- **Événements indésirables graves** (EIGS) :
  - Nombre d'EIGS par année
  - Famille principale
  - Nature principale
  - État (en cours, clos)
  - Date de clôture
  - Motif de clôture

Source des données : SIICEA (inspections), SIVSS (événements indésirables)

## Bouton Actions

[Capture écran : bouton Actions]

Le bouton Actions permet :
- **Export PDF** : téléchargement de la fiche complète en PDF
- **Export des autorisations** : téléchargement du tableau des autorisations en Excel
- **Export de la transcription** : téléchargement de la transcription des autorisations

## Messages présents auprès des graphiques

Chaque indicateur affiche :
- La date de dernière mise à jour de la source
- Un message si les données ne sont pas renseignées
- Un message si les données ne sont pas autorisées pour le profil de l'utilisateur

## Navigation parent/enfant

Depuis la fiche établissement sanitaire, il est possible de naviguer vers l'entité juridique de rattachement pour voir la vue consolidée.
