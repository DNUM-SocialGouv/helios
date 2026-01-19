import os
from logging import Logger

import pandas as pd

from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet, trouver_lannee_max_disponible
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import TABLE_VIGIE_RH_NATURE_CONTRATS_TRIMESTRIEL, FichierSource
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping, index_nature_contrat_trimestriel
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base

def filtrer_les_donnees_cdi_cdd(donnees: pd.DataFrame, base_de_donnees: Engine) -> pd.DataFrame:
    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_donnees)
    numeros_finess_liste = numeros_finess_des_etablissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()
    annee_max_disponible = trouver_lannee_max_disponible(donnees)

    year_regex = r"^(19\d{2}|2\d{3})$"

    # Filtrer les données
    donnees_filtrees = donnees[
        (donnees["numero_finess_etablissement_territorial"].astype(str).str.len() == 9) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["numero_finess_etablissement_territorial"].astype(str).isin(numeros_finess_liste))
    ]
    donnees_cdi_cdd_trimestrielles_filtrees_sur_les_3_dernieres_annees = donnees_filtrees[donnees_filtrees["annee"]
                                                                                                .between(annee_max_disponible - 2, annee_max_disponible)]
    return donnees_cdi_cdd_trimestrielles_filtrees_sur_les_3_dernieres_annees.set_index(index_nature_contrat_trimestriel)


def import_donnees_nature_contrats_trimestriel(
    chemin_local_du_fichier_donnees: str,
    chemin_local_du_fichier_ref: str,
    base_de_donnees: Engine,
    logger: Logger) -> None:
    date_du_fichier_vigierh_donnees_nature_contrats = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_donnees)
    date_du_fichier_vigierh_ref_nature_contrats = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref)
    fichier_traite = verifie_si_le_fichier_est_traite(date_du_fichier_vigierh_donnees_nature_contrats,
                                                      base_de_donnees,
                                                      FichierSource.VIGIE_RH_CDI_CDD_TRIMESTRIEL.value
                                                      )
    if fichier_traite:
        logger.info(f"Le fichier {FichierSource.VIGIE_RH_CDI_CDD_TRIMESTRIEL.value} a été déjà traité")
    else:
        if len({date_du_fichier_vigierh_ref_nature_contrats,
        date_du_fichier_vigierh_donnees_nature_contrats}) == 1:
            donnees_cdi_cdd = lis_le_fichier_parquet(chemin_local_du_fichier_donnees, ColumMapping.NATURE_CONTRAT_TRIMESTRIEL.value)
            donnees_cdi_cdd_filtrees = filtrer_les_donnees_cdi_cdd(donnees_cdi_cdd, base_de_donnees )
            with base_de_donnees.begin() as connection:
                écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
                    "indicateurs nature contrats trimestriels",
                    SOURCE,
                    connection,
                    TABLE_VIGIE_RH_NATURE_CONTRATS_TRIMESTRIEL,
                    donnees_cdi_cdd_filtrees,
                    [(FichierSource.VIGIE_RH_CDI_CDD_TRIMESTRIEL, date_du_fichier_vigierh_donnees_nature_contrats)],
                    logger,
                )
        else:
            logger.info(
                f"[{SOURCE}]❌ Les dates des fichiers sources ne sont pas cohérentes. "
                f"({FichierSource.VIGIE_RH_CDI_CDD_TRIMESTRIEL.value}, "
                f"{FichierSource.VIGIE_RH_REF_CDI_CDD.value})"
            )

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    vigierh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vigierh_data_path)
    chemin_local_du_fichier_ref_nature_contrats = os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_CDI_CDD.value, logger_helios))

    chemin_local_du_fichier_nature_contrats= os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_CDI_CDD_TRIMESTRIEL.value, logger_helios))

    import_donnees_nature_contrats_trimestriel(chemin_local_du_fichier_nature_contrats,
                                               chemin_local_du_fichier_ref_nature_contrats,
                                               base_de_donnees_helios,
                                               logger_helios)
