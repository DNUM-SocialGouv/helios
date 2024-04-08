import pandas as pd
import numpy as np
from datetime import datetime
from logging import Logger

from datacrawler.transform.equivalences_sivss_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    equivalences_sivss_evenements_indesirables_helios_base,
    index_evenement_indesirable,
)

from datacrawler.check_downloaded_sivss_file import (
    get_year_from_date
)

def build_finess(row):
    if('§' in str(row['SCC_ORGANISME_FINESS'])):
        row['SCC_ORGANISME_FINESS'] = row['SCC_ORGANISME_FINESS'][:9]
    if('§' in str(row['DECLARANT_ORGANISME_NUMERO_FINESS'])):
        row['DECLARANT_ORGANISME_NUMERO_FINESS'] = row['DECLARANT_ORGANISME_NUMERO_FINESS'][:9]
    if pd.notna(row['SCC_ORGANISME_FINESS']):
        return row['SCC_ORGANISME_FINESS']
    else:
        return row['DECLARANT_ORGANISME_NUMERO_FINESS']

def reforme_les_donnees_indesirables(donnees_evenements_indesirables: pd.DataFrame) -> pd.DataFrame:
    year_column = donnees_evenements_indesirables['DATE_RECEPTION'].apply(get_year_from_date)
    donnees_evenements_indesirables["FINESS"] = donnees_evenements_indesirables.apply(build_finess, axis=1)
    donnees_evenements_indesirables.drop(columns=["DECLARANT_ORGANISME_NUMERO_FINESS", "SCC_ORGANISME_FINESS"], inplace=True)
    donnees_evenements_indesirables['DATE_RECEPTION'] = year_column
    donnees_evenements_indesirables['ETAT'].replace({'Initial': 'EN_COURS', 'En gestion': 'EN_COURS', 'A qualifier': 'EN_COURS', 'A réguler': 'EN_COURS', 'A valider':'EN_COURS', 'Clôturé': 'CLOTURE' }, inplace=True)
    return donnees_evenements_indesirables

def formate_la_date_de_cloture(données: pd.DataFrame) -> pd.DataFrame:
    def formate_la_date(date_du_cpom: str) -> str:
        return datetime.strptime(date_du_cpom, "%d/%m/%Y").strftime("%Y-%m-%d")

    dates_formatees_de_cloture = données.copy()
    dates_formatees_de_cloture["date_cloture"] = données["date_cloture"].map(
        formate_la_date, na_action="ignore"
    )
    return dates_formatees_de_cloture

def transform_les_donnees_evenements_indesirables_etablissements(
    donnees_evenements_indesirables: pd.DataFrame, numéros_finess_des_établissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_sivss = donnees_evenements_indesirables["FINESS"].isin(numéros_finess_des_établissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[SIVSS] {est_dans_sivss.sum()} évènements indésirables sont liées à un ET trouvé en base dans le fichier sivss")
    donnees_evenements_indesirables_transforme = (
        donnees_evenements_indesirables[est_dans_sivss]
        .rename(columns=extrais_l_equivalence_des_noms_des_colonnes(equivalences_sivss_evenements_indesirables_helios_base))
        .dropna(subset=index_evenement_indesirable)
        .drop_duplicates(subset=index_evenement_indesirable)
        .sort_values(by=["annee"], ascending=False)
    )
    return formate_la_date_de_cloture(donnees_evenements_indesirables_transforme).set_index(index_evenement_indesirable)

    
