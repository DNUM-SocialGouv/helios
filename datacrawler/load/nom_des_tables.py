from enum import Enum

TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX = "activite_medico_social"
TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES = "activite_sanitaire"
TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES = "date_mise_a_jour_fichier_source"


class FichierSource(Enum):
    DIAMANT_ANN_ERRD_EJ_ET = "ann_errd_ej_et"
    DIAMANT_ANN_MS_TDP_ET = "ann_ms_tdp_et"
    DIAMANT_MEN_PMSI_ANNUEL = "men_pmsi_annuel"
    DIAMANT_ANN_RPU = "ann_rpu"
