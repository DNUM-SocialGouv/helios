# Données Qualité

## Présentation

Les données Qualité regroupent trois sources principales :
- **SIICEA** : Système d'Information des Inspections, Contrôles et Évaluations
- **SIVSS** : Système d'Information de la Veille Sanitaire et Sociale
- **SIREC** : Système d'Information des Réclamations

## SIICEA

### Données

- Inspections et contrôles des établissements
- Type de mission, thème régional
- Nombre d'écarts, remarques
- Injonctions, prescriptions, recommandations
- Saisines (CNG, juridiction, parquet)

### Processus

1. **Récupération** : SFTP DNUM, dossier `SIICEA`
2. **Transformation** : parsing et normalisation
3. **Chargement** : table `inspections_controles_etablissement_territorial`
4. **Affichage** : Bloc Qualité des fiches

## SIVSS

### Données

- Événements indésirables graves (EIGS)
- Famille principale, nature principale
- État (en cours, clos)
- Date de clôture, motif de clôture

### Processus

1. **Récupération** : SFTP DNUM, dossier `SIVSS`
2. **Transformation** : parsing et normalisation
3. **Chargement** : table `evenement_indesirable_etablissement_territorial`
4. **Affichage** : Bloc Qualité des fiches

## SIREC

### Données

- Réclamations des usagers
- Réclamations en cours et clôturées par motif (10 à 19, 155, 156)
- Totaux par motif

### Processus

1. **Récupération** : SFTP DNUM, dossier `SIREC`
2. **Transformation** : parsing et normalisation
3. **Chargement** : table `reclamation_etablissement_territorial`
4. **Affichage** : Bloc Qualité des fiches

## Fréquence de réception

- **Récupération** : mensuelle
- **Mise à jour dans Helios** : mensuelle après traitement

## Dates de mise à jour

Les dates de dernière mise à jour sont stockées dans `date_mise_a_jour_fichier_source` et affichées sur les fiches.

## Voir aussi

- [Récupération des données](recuperation-donnees/README.md)
- [SFTP/API](recuperation-donnees/sftp-api.md)
