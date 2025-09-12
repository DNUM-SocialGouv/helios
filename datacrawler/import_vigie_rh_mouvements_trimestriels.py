import os
from logging import Logger
from datetime import datetime

import pandas as pd

from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import TABLE_VIGIE_RH_MOUVEMENTS_RH_TRIMESTRIELS, FichierSource
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping, index_des_mouvements_rh_trimestriel
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base

def filtrer_les_donnees_mouvements_rh(donnees: pd.DataFrame, base_de_donnees: Engine) -> pd.DataFrame:
    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_donnees)
    numeros_finess_liste = numeros_finess_des_etablissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()

    year_regex = r"(19\d{2}|2\d{3})"
    annee_courante = datetime.now().year
    annee_de_depart = datetime.now().year - 2

    # Filtrer les données
    donnees_filtrees = donnees[
        (donnees["numero_finess_etablissement_territorial"].astype(str).str.len() == 9) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["numero_finess_etablissement_territorial"].astype(str).isin(numeros_finess_liste))
    ]
    donnees_mouvements_rh_trimestrielles_filtrees_sur_les_3_dernieres_annees = donnees_filtrees[donnees_filtrees["annee"]
                                                                                                .between(annee_de_depart, annee_courante)]
    return donnees_mouvements_rh_trimestrielles_filtrees_sur_les_3_dernieres_annees.set_index(index_des_mouvements_rh_trimestriel)


def import_donnees_mouvements_rh_trimestriels(chemin_local_du_fichier_donnees: str, base_de_donnees: Engine, logger: Logger) -> None:
    date_du_fichier_vigierh_donnees_mouvements_rh = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_donnees)
    fichier_traite = verifie_si_le_fichier_est_traite(date_du_fichier_vigierh_donnees_mouvements_rh,
                                                      base_de_donnees,
                                                      FichierSource.VIGIE_RH_MOUVEMENTS_RH_TRIMESTRIEL.value
                                                      )
    if fichier_traite:
        logger.info(f"Le fichier {FichierSource.VIGIE_RH_MOUVEMENTS_RH_TRIMESTRIEL.value} a été déjà traité")
    else:
        donnees_mouvements_rh = lis_le_fichier_parquet(chemin_local_du_fichier_donnees, ColumMapping.MOUVEMENTS_RH_TRIMESTRIEL.value)
        donnees_mouvements_rh_filtrees = filtrer_les_donnees_mouvements_rh(donnees_mouvements_rh, base_de_donnees )
        with base_de_donnees.begin() as connection:
            écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
                "indicateurs mouvements rh trimestriels",
                SOURCE,
                connection,
                TABLE_VIGIE_RH_MOUVEMENTS_RH_TRIMESTRIELS,
                donnees_mouvements_rh_filtrees,
                [(FichierSource.VIGIE_RH_MOUVEMENTS_RH_TRIMESTRIEL, date_du_fichier_vigierh_donnees_mouvements_rh)],
                logger,
            )

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    vigierh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vigierh_data_path)

    chemin_local_du_fichier_mouvements_rh= os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_MOUVEMENTS_RH_TRIMESTRIEL.value, logger_helios))

    import_donnees_mouvements_rh_trimestriels(chemin_local_du_fichier_mouvements_rh, base_de_donnees_helios, logger_helios)
