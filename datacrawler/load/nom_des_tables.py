from enum import Enum

TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX = "activite_medico_social"
TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES = "activite_sanitaire"
TABLE_DES_ACTIVITÉS_SANITAIRES_DES_ENTITES_JURIDIQUES = "activite_sanitaire_entite_juridique"
TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES = "date_mise_a_jour_fichier_source"
TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX = "autorisation_medico_social"
TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES = "autorisation_sanitaire"
TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS = "equipement_materiel_lourd_sanitaire"
TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES = "autre_activite_sanitaire"
TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES = "reconnaissance_contractuelle_sanitaire"
TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES = "capacite_autorisation_sanitaire"
TABLES_DES_CAPACITÉS_DES_ENTITES_JURIDIQUES = "capacite_autorisation_entite_juridique"
TABLES_DES_CPOM = "cpom"
TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL = "budget_et_finances_medico_social"
TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE = "budget_et_finances_entite_juridique"
TABLES_DES_BUDGETS_ET_FINANCES_ETABLISSEMENT_TERRITORIAL = "budget_et_finances_sanitaire"
TABLES_DES_RESSOURCES_HUMAINES_MÉDICO_SOCIAL = "ressources_humaines_medico_social"
TABLES_DES_RECLAMATIONS = "reclamation_etablissement_territorial"
TABLES_DES_EVENEMENTS_INDESIRABLES = "evenement_indesirable_etablissement_territorial"
TABLES_DES_INSPECTIONS_ET_CONTROLES = "inspections_controles_etablissement_territorial"
TABLE_RESSOURCE_ALLOCATION_EJ = "allocation_ressource_ej"
TABLE_RESSOURCE_ALLOCATION_ET = "allocation_ressource_et"
TABLE_ACTIVITE_SANITAIRE_MENSUEL = "activite_sanitaire_mensuel"
TABLE_ACTIVITE_SANITAIRE_MENSUEL_EJ = "activite_sanitaire_mensuel_entite_juridique"

# VIGIE_RH contrat
TABLE_CONTRAT = "vigierh_contrat"
TABLE_REF_TYPE_CONTRAT = "vigierh_ref_type_contrat"

# VIGIE_RH profession_filiere
TABLE_PROFESSION_FILIERE = "vigierh_profession_filiere"
TABLE_REF_PROFESSION_FILIERE = "vigierh_ref_profession_filiere"

# VIGIE_RH profession_groupe
TABLE_PROFESSION_GROUPE = "vigierh_profession_groupe"
TABLE_REF_MASQUE = "vigierh_ref_masque"
TABLE_REF_PROFESSION_GROUPE = "vigierh_ref_profession_groupe"
TABLE_REF_QUALITE = "vigierh_ref_qualite"
TABLE_REF_REDRESSEMENT = "vigierh_ref_redressement"


class FichierSource(Enum):
    DIAMANT_ANN_ERRD_EJ_ET = "ann_errd_ej_et"
    DIAMANT_ANN_MS_TDP_ET = "ann_ms_tdp_et"
    DIAMANT_MEN_PMSI_ANNUEL = "men_pmsi_annuel"
    DIAMANT_MEN_PMSI_MENCUMU = "men_pmsi_mencumu"
    DIAMANT_ANN_RPU = "ann_rpu"
    DIAMANT_ANN_SAE = "ann_sae"
    DIAMANT_ANN_CA_EJ_ET = "ann_ca_ej_et"
    DIAMANT_ANN_ERRD_EJ = "ann_errd_ej"
    DIAMANT_QUO_SAN_FINANCE = "quo_san_finance"
    DIAMANT_MEN_HAPI = "men_hapi"
    FINESS_CS1400103 = "finess_cs1400103"
    FINESS_CS1400104 = "finess_cs1400104"
    FINESS_CS1400105 = "finess_cs1400105"
    FINESS_CS1600101 = "finess_cs1600101"
    FINESS_CS1600102 = "finess_cs1600102"
    SIREC = "sirec"
    SIVSS = "sivss"
    SIICEA = "siicea"
    # contrat
    VIGIE_RH_CONTRAT = "vigierh_contrat"
    VIGIE_RH_REF_TYPE_CONTRAT = "vigierh_ref_nature_contrat"
    # profession_filiere
    VIGIE_RH_PROFESSION_FILIERE = "vigierh_profession1"
    VIGIE_RH_REF_PROFESSION_FILIERE = "vigierh_ref_profession1"
    # profession_groupe
    VIGIE_RH_PROFESSION_GROUPE = "vigierh_profession2"
    VIGIE_RH_REF_MASQUE = "vigierh_ref_masque"
    VIGIE_RH_REF_PROFESSION_GROUPE = "vigierh_ref_profession2"
    VIGIE_RH_REF_QUALITE = "vigierh_ref_qualite"
    VIGIE_RH_REF_REDRESSEMENT = "vigierh_ref_redressement"
