# Fiche établissement médico-social

## Description générale

[Capture écran : fiche établissement médico-social complète]

La fiche établissement médico-social présente une vue détaillée adaptée aux établissements médico-sociaux avec indicateurs d'activité, capacités, ressources humaines, budget et qualité.

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
- Statut juridique de l'entité de rattachement
- Mode de tarification
- Mono-établissement (oui/non)
- Établissement principal ou secondaire
- Date d'entrée en vigueur du CPOM (si applicable)

Source des données : FINESS

### Bloc Autorisations et Capacités

[Capture écran : bloc autorisations et capacités]

Indicateurs affichés :
- **Autorisations médico-sociales** (liste détaillée) :
  - Type d'autorisation
  - Capacité autorisée
  - Date d'autorisation
  - Date de fin
  - Date de mise en œuvre

Source des données : FINESS

### Bloc Activité

[Capture écran : bloc activité]

Indicateurs affichés selon le type d'établissement :

**Pour les EHPAD** :
- Taux d'occupation en accueil de jour
- Taux d'occupation en hébergement temporaire
- Taux d'occupation en hébergement permanent

**Pour les autres ESMS** :
- Taux d'occupation externat
- Taux d'occupation semi-internat
- Taux d'occupation internat
- Taux d'occupation autre
- Taux d'occupation séances

**Indicateurs communs** :
- Taux de réalisation d'activité
- File active personnes accompagnées
- Nombre de journées d'absence des personnes accompagnées
- Durée moyenne de séjour d'accompagnement des personnes sorties
- Taux d'occupation global

Source des données : DIAMANT (ANN_MS_TDP_ET)

### Bloc Ressources Humaines

[Capture écran : bloc ressources humaines]

Indicateurs affichés :
- Nombre de CDD de remplacement
- Nombre d'ETP réalisés
- Taux d'ETP vacants
- Taux de prestations externes
- Taux de rotation du personnel
- Taux d'absentéisme par motif :
  - Maladie courte durée
  - Maladie moyenne durée
  - Maladie longue durée
  - Maternité / paternité
  - Accident / maladie professionnelle
  - Congés spéciaux
  - Hors formation

**Bloc Vigie RH** (si données DSN disponibles, spécifiquement pour les EHPAD) :
- Indicateurs issus des données DSN (voir [Vigie RH](vigie-rh.md))

Source des données : DIAMANT (ANN_MS_TDP_ET), Vigie RH (DSN pour EHPAD)

### Bloc Budget & Finances

[Capture écran : bloc budget et finances]

Indicateurs affichés :
- Contribution aux frais de siège groupement
- Dépenses groupe I, II, III
- Recettes groupe I, II, III
- Résultat net comptable
- Cadre budgétaire (ERRD, CA_PA, CA_PH)
- Charges totales
- Produits totales
- Taux de CAF (capacité d'autofinancement)
- Taux de vétusté des constructions
- Fonds de roulement

Source des données : DIAMANT (ANN_ERRD_EJ_ET)

### Bloc Qualité

[Capture écran : bloc qualité]

Indicateurs affichés :
- **Réclamations** (graphique) :
  - Réclamations en cours par motif (10 à 19, 155, 156)
  - Réclamations clôturées par motif
  - Total encours et clôturées
- **Inspections et contrôles** (graphique) :
  - Nombre d'inspections par année
  - Type de mission, thème régional
  - Nombre d'écarts, remarques
  - Injonctions, prescriptions, recommandations
- **Événements indésirables graves** (EIGS) :
  - Nombre d'EIGS par année
  - Famille principale, nature principale
  - État, date de clôture

Source des données : SIREC (réclamations), SIICEA (inspections), SIVSS (événements indésirables)

## Bouton Actions

[Capture écran : bouton Actions]

Le bouton Actions permet :
- **Export PDF** : téléchargement de la fiche complète en PDF
- **Export des autorisations** : téléchargement du tableau des autorisations en Excel

## Messages présents auprès des graphiques

Chaque indicateur affiche :
- La date de dernière mise à jour de la source
- Un message si les données ne sont pas renseignées
- Un message si les données ne sont pas autorisées pour le profil de l'utilisateur

## Navigation parent/enfant

Depuis la fiche établissement médico-social, il est possible de naviguer vers l'entité juridique de rattachement pour voir la vue consolidée.
