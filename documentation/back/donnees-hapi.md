# Données HAPI

## Présentation

HAPI (Hospitalisation À Domicile, Activité et Indicateurs de Performance) fournit des données sur l'activité HAD (Hospitalisation À Domicile).

## Processus de la réception de la donnée à l'affichage

### 1. Récupération

- **Source** : serveur SFTP HAPI
- **Dossier** : `ftps/Infocentre/Production/download/HAPI/anciennes_campagnes`
- **Format** : fichiers spécifiques HAPI
- **Fréquence** : hebdomadaire

### 2. Transformation

Le datacrawler :
- Parse les fichiers HAPI
- Normalise les données
- Rapproche avec les données FINESS (numéro FINESS)
- Calcule les indicateurs HAD

### 3. Chargement

- Insertion/mise à jour dans les tables :
  - Intégration dans `activite_sanitaire` (champ `nombre_sejours_had`)

### 4. Affichage

Les données HAPI sont affichées dans :
- Bloc Activité des fiches établissements sanitaires
- Indicateur "Nombre de séjours HAD"

## Fréquence de réception

- **Récupération** : hebdomadaire
- **Mise à jour dans Helios** : hebdomadaire après traitement

## Dates de mise à jour

Les dates de dernière mise à jour sont stockées dans `date_mise_a_jour_fichier_source` et affichées sur les fiches.

## Voir aussi

- [Récupération des données](recuperation-donnees/README.md)
- [SFTP/API](recuperation-donnees/sftp-api.md)
