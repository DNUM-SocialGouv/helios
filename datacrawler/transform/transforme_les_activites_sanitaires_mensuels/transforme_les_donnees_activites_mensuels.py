from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index__activites_mensuel,
    équivalences_diamant_men_pmsi_mensumu_helios,
)
from datacrawler import filtre_les_données_sur_les_n_dernières_années_a_partir_annee_courante


def transforme_les_donnees_activites_mensuels(
    donnees_men_pmsi_mensuel: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = donnees_men_pmsi_mensuel["Finess"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    données_dernieres_5_annees = filtre_les_données_sur_les_n_dernières_années_a_partir_annee_courante(donnees_men_pmsi_mensuel, 5)
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} activités mensuels sont liées à un ET trouvé en base dans le fichier men_pmsi_mencumu")

    return (
        données_dernieres_5_annees[est_dans_finess]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_men_pmsi_mensumu_helios))
        .dropna(subset=index__activites_mensuel)
        .drop_duplicates(subset=index__activites_mensuel)
        .set_index(index__activites_mensuel)
    )
