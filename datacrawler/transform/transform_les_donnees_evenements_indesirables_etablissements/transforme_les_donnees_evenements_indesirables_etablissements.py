import pandas as pd
import numpy as np
from logging import Logger

from datacrawler import filtre_les_données_sur_les_n_dernières_années
from datacrawler.transform.equivalences_sivss_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    equivalences_sivss_evenements_indesirables_helios,
    index_evenement_indesirable,
)

def transform_les_donnees_evenements_indesirables_etablissements(
    donnees_evenements_indesirables: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_sivss = donnees_evenements_indesirables["FINESS"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[SIVSS] {est_dans_sivss.sum()} évènements indésirables sont liées à un ET trouvé en base dans le fichier sivss")
    return (
        donnees_evenements_indesirables[est_dans_sivss]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(equivalences_sivss_evenements_indesirables_helios))
        .dropna(subset=index_evenement_indesirable)
        .drop_duplicates(subset=index_evenement_indesirable)
        .sort_values(by=["annee"], ascending=False)
        .set_index(index_evenement_indesirable)
    )
    
