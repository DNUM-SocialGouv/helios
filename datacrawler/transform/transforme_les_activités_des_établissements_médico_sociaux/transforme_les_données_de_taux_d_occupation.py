from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_des_activités,
    équivalences_diamant_ann_errd_ej_et_bloc_activités_helios,
    equivalences_diamant_ann_ca_ej_et_bloc_activites_helios
)


def transforme_les_donnees_ann_errd_ej_et(
    donnees_ann_errd_ej_et: pd.DataFrame, numeros_finess_des_etablissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = donnees_ann_errd_ej_et["Finess"].isin(numeros_finess_des_etablissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} activités sont liées à un ET trouvé en base dans le fichier ann_errd_ej_et")

    return (
        donnees_ann_errd_ej_et[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_errd_ej_et_bloc_activités_helios))
        .dropna(subset=index_des_activités)
        .drop_duplicates(subset=index_des_activités)
    )


def transforme_les_donnees_ann_ca_ej_et(
    donnees_ann_ca_ej_et: pd.DataFrame, numeros_finess_des_etablissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = donnees_ann_ca_ej_et["Finess"].isin(numeros_finess_des_etablissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} activités sont liées à un ET trouvé en base dans le fichier ann_ca_ej_et")

    return (
        donnees_ann_ca_ej_et[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(equivalences_diamant_ann_ca_ej_et_bloc_activites_helios))
        .dropna(subset=index_des_activités)
        .drop_duplicates(subset=index_des_activités)
    )
