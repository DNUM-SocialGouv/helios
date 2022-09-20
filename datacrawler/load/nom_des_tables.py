from enum import Enum

TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX = "activite_medico_social"
TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES = "activite_sanitaire"
TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES = "date_mise_a_jour_fichier_source"
TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX = "autorisation_medico_social"
TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES = "autorisation_sanitaire"
TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS = "equipement_materiel_lourd_sanitaire"
TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES = "autre_activite_sanitaire"
TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES = "reconnaissance_contractuelle_sanitaire"
TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES = "capacite_autorisation_sanitaire"
TABLES_DES_CPOM = "cpom"
TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL = "budget_et_finances_medico_social"


class FichierSource(Enum):
    DIAMANT_ANN_ERRD_EJ_ET = "ann_errd_ej_et"
    DIAMANT_ANN_ERRD_EJ_ET_BUDGET_ET_FINANCES = "ann_errd_ej_et_budget_et_finances"
    DIAMANT_ANN_MS_TDP_ET = "ann_ms_tdp_et"
    DIAMANT_MEN_PMSI_ANNUEL = "men_pmsi_annuel"
    DIAMANT_ANN_RPU = "ann_rpu"
    DIAMANT_ANN_SAE = "ann_sae"
    FINESS_CS1400103 = "finess_cs1400103"
    FINESS_CS1400104 = "finess_cs1400104"
    FINESS_CS1400105 = "finess_cs1400105"
    FINESS_CS1600101 = "finess_cs1600101"
    FINESS_CS1600102 = "finess_cs1600102"
