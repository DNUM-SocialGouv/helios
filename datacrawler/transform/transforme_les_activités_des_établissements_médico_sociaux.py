from logging import Logger
from typing import Dict, cast

import pandas as pd

from datacrawler.transform.diamant.équivalences_diamant_helios import (
    ColonneHelios,
    index_des_activités_médico_sociales,
    équivalences_diamant_helios,
    ÉquivalencesDiamantHelios,
)


def extrais_l_equivalence_des_types_des_colonnes(équivalences: ÉquivalencesDiamantHelios) -> Dict[str, type]:
    return {nom_diamant: cast(ColonneHelios, colonne_diamant)["type"] for nom_diamant, colonne_diamant in équivalences.items()}


def extrais_l_equivalence_des_noms_des_colonnes(équivalences: ÉquivalencesDiamantHelios) -> Dict[str, str]:
    return {nom_diamant: cast(ColonneHelios, colonne_diamant)["nom"] for nom_diamant, colonne_diamant in équivalences.items()}


def transforme_les_activités_des_établissements_médico_sociaux(
    données_ann_errd_ej_et: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:

    est_dans_finess = données_ann_errd_ej_et["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"{est_dans_finess.sum()} activités liées à un ET trouvées en base")
    return (
        données_ann_errd_ej_et[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_helios))
        .dropna(subset=index_des_activités_médico_sociales)
        .drop_duplicates(subset=index_des_activités_médico_sociales)
        .set_index(index_des_activités_médico_sociales)
    )
