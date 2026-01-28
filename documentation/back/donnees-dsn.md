# Données DSN (Vigie RH)

## Présentation

Les données DSN (Déclaration Sociale Nominative) sont utilisées pour alimenter le bloc Vigie RH, spécifiquement pour les établissements EHPAD.

## Processus de la réception de la donnée à l'affichage

### 1. Récupération

- **Source** : serveur SFTP Vigie RH
- **Format** : fichiers DSN
- **Fréquence** : quotidienne

### 2. Transformation

Le datacrawler :
- Parse les fichiers DSN
- Extrait les données RH (contrats, mouvements, effectifs)
- Normalise selon les référentiels Vigie RH
- Rapproche avec les données FINESS (numéro FINESS)
- Calcule les indicateurs (taux de rotation, pyramide des âges, etc.)

### 3. Chargement

- Insertion/mise à jour dans les tables Vigie RH :
  - `vigierh_contrat`
  - `vigierh_mouvements`
  - `vigierh_mouvements_trimestriel`
  - `vigierh_pyramide`
  - `vigierh_duree_cdd`
  - `vigierh_motifs_ruptures`
  - `vigierh_profession_groupe`
  - `vigierh_profession_filiere`
- Mise à jour des référentiels :
  - `vigierh_ref_type_contrat`
  - `vigierh_ref_duree_cdd`
  - `vigierh_ref_motifs_ruptures`
  - `vigierh_ref_profession_groupe`
  - `vigierh_ref_profession_filiere`
  - `vigierh_ref_tranche_age`

### 4. Affichage

Les données DSN sont affichées dans :
- Bloc Vigie RH des fiches établissements médico-sociaux (EHPAD uniquement)
- Indicateurs : contrats, mouvements, pyramide des âges, durées CDD, motifs de rupture

## Fréquence de réception

- **Récupération** : quotidienne
- **Mise à jour dans Helios** : quotidienne après traitement

## Spécificité EHPAD

Les données DSN sont disponibles uniquement pour les établissements de type **EHPAD** (catégorie FINESS 500).

## Dates de mise à jour

Les dates de dernière mise à jour sont stockées dans `date_mise_a_jour_fichier_source` et affichées dans le bloc Vigie RH.

## Voir aussi

- [Vigie RH](../../front/vigie-rh.md)
- [Récupération des données](recuperation-donnees/README.md)
- [SFTP/API](recuperation-donnees/sftp-api.md)
