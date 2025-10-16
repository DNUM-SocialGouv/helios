from logging import Logger
import os
import numpy as np
import pandas as pd
from sqlalchemy.engine import Engine, create_engine
from datacrawler import inserer_nouvelles_donnees, supprimer_donnees_existantes, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import TABLE_VIGIE_RH_DUREE_CDD, TABLE_VIGIE_RH_REF_DUREE_CDD, FichierSource
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping

def filtrer_les_donnees_duree_cdd(donnees: pd.DataFrame, code_list_ref:  np.ndarray, database : Engine) -> pd.DataFrame:

    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(database)
    numeros_finess_liste = numeros_finess_des_etablissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()

    year_regex = r"(19\d{2}|2\d{3})"

    # Filtrer les données
    donnees_filtrees = donnees[
        (donnees["numero_finess_etablissement_territorial"].astype(str).str.len() == 9) &
        (donnees["numero_finess_etablissement_territorial"].astype(str).isin(numeros_finess_liste)) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["trimestre"].astype(str).astype(int).between(1, 4)) &
        (donnees["duree_code"].isin(code_list_ref)) &
        (~donnees['numero_finess_etablissement_territorial'].isin(donnees[donnees['effectif'].isna()]['numero_finess_etablissement_territorial']))
    ]

    return donnees_filtrees

def import_donnees_duree_cdd(chemin_local_du_fichier_ref: str, chemin_local_du_fichier_donnees: str, base_de_donnees: Engine, logger: Logger) -> None:
    date_du_fichier_vigierh_ref_duree_cdd = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref)
    date_du_fichier_vigierh_donnees_duree_cdd = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_donnees)
    traite_ref_duree_cdd = verifie_si_le_fichier_est_traite(
        date_du_fichier_vigierh_ref_duree_cdd,
        base_de_donnees,
        FichierSource.VIGIE_RH_REF_DUREE_CDD.value
    )
    traite_donnees_duree_cdd = verifie_si_le_fichier_est_traite(
        date_du_fichier_vigierh_donnees_duree_cdd,
        base_de_donnees,
        FichierSource.VIGIE_RH_DUREE_CDD.value
    )
    if traite_ref_duree_cdd and traite_donnees_duree_cdd:
        logger.info(f"Les fichiers {FichierSource.VIGIE_RH_DUREE_CDD.value} et {FichierSource.VIGIE_RH_REF_DUREE_CDD.value} ont été déjà traités")
    else:
        if len({date_du_fichier_vigierh_ref_duree_cdd,
        date_du_fichier_vigierh_donnees_duree_cdd}) == 1:
            referentiel_duree_cdd = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_DUREE_CDD.value)
            donnees_durre_cdd = lis_le_fichier_parquet(chemin_local_du_fichier_donnees, ColumMapping.DUREE_CDD.value)
            code_list_ref = np.array(referentiel_duree_cdd['duree_code'].tolist())
            donnees_durre_cdd_filtrees = filtrer_les_donnees_duree_cdd(donnees_durre_cdd, code_list_ref, base_de_donnees)
            supprimer_donnees_existantes(TABLE_VIGIE_RH_DUREE_CDD, base_de_donnees, SOURCE, logger)
            supprimer_donnees_existantes(TABLE_VIGIE_RH_REF_DUREE_CDD, base_de_donnees, SOURCE, logger)
            inserer_nouvelles_donnees(
                TABLE_VIGIE_RH_REF_DUREE_CDD,
                base_de_donnees,
                SOURCE,
                referentiel_duree_cdd,
                logger,
                FichierSource.VIGIE_RH_REF_DUREE_CDD,
                date_du_fichier_vigierh_ref_duree_cdd
            )
            inserer_nouvelles_donnees(
                TABLE_VIGIE_RH_DUREE_CDD,
                base_de_donnees,
                SOURCE,
                donnees_durre_cdd_filtrees,
                logger,
                FichierSource.VIGIE_RH_DUREE_CDD,
                date_du_fichier_vigierh_donnees_duree_cdd
            )

        else:
            logger.info(
                f"[{SOURCE}]❌ Les dates des fichiers sources ne sont pas cohérentes. "
                f"({FichierSource.VIGIE_RH_DUREE_CDD.value}, "
                f"{FichierSource.VIGIE_RH_REF_DUREE_CDD.value})"
            )
if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    vigierh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vigierh_data_path)

    chemin_local_du_fichier_ref_duree_cdd = os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_DUREE_CDD.value, logger_helios))
    chemin_local_du_fichier_duree_cdd = os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_DUREE_CDD.value, logger_helios))

    import_donnees_duree_cdd(chemin_local_du_fichier_ref_duree_cdd, chemin_local_du_fichier_duree_cdd, base_de_donnees_helios, logger_helios)
