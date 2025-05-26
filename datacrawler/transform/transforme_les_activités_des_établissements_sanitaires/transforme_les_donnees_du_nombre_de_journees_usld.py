from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_des_activités,
    equivalences_diamant_ann_sae_activite_helios,
)


def transforme_les_donnees_usld(donnees_usld: pd.DataFrame, numeros_finess_des_etablissements_connus: pd.DataFrame, logger: Logger) -> pd.DataFrame:
    est_dans_finess = donnees_usld["Finess"].isin(numeros_finess_des_etablissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} activités sont liées à un ET trouvé en base dans le fichier ann_sae")

    return (
        donnees_usld[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(equivalences_diamant_ann_sae_activite_helios))
        .dropna(subset=index_des_activités)
        .drop_duplicates(subset=index_des_activités)
        .set_index(index_des_activités)
    )
