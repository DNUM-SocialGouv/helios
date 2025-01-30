import pandas as pd
import numpy as np
from logging import Logger

from datacrawler import filtre_les_données_sur_les_n_dernières_années
from datacrawler.transform.equivalences_sirec_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    equivalences_sirec_reclamations_helios,
    index_reclamations,
)


def transform_les_donnees_reclamations_etablissements(
    donnees_reclamations: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_sirec = donnees_reclamations["NDEG_FINESS_RPPS"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[SIREC] {est_dans_sirec.sum()} réclamations sont liées à un ET trouvé en base dans le fichier sirec")
    return (
        donnees_reclamations[est_dans_sirec]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(equivalences_sirec_reclamations_helios))
        .dropna(subset=index_reclamations)
        .drop_duplicates(subset=index_reclamations)
        .sort_values(by=["annee"], ascending=False)
        .set_index(index_reclamations)
    )
