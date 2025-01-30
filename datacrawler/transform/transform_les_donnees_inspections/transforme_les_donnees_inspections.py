import pandas as pd
from logging import Logger
from datetime import datetime

from datacrawler.transform.equivalence_siicea_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    equivalences_siicea_helios,
    index_inspections_controles,
)


def transform_les_donnees_inspections_etablissements(
    donnees_inspections_controles: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_siicea = donnees_inspections_controles["Code FINESS"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[SIICEA] {est_dans_siicea.sum()} inspections et controles sont liées à un ET trouvé en base dans le fichier siicea")
    donnees_inspections_transforme = donnees_inspections_controles[est_dans_siicea].rename(
        columns=extrais_l_equivalence_des_noms_des_colonnes(equivalences_siicea_helios)
    )
    return donnees_inspections_transforme.set_index(index_inspections_controles)
