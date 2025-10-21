from logging import Logger
import os
from datetime import datetime
import numpy as np
import pandas as pd
from sqlalchemy.engine import Engine, create_engine
from datacrawler import inserer_nouvelles_donnees, supprimer_donnees_existantes, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import TABLE_VIGIE_RH_NATURE_CONTRATS, TABLE_VIGIE_RH_REF_NATURE_CONTRATS, FichierSource
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping

def filtrer_les_donnees_cdi_cdd(donnees: pd.DataFrame, code_list_ref:  np.ndarray, database : Engine) -> pd.DataFrame:

    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(database)
    numeros_finess_liste = numeros_finess_des_etablissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()

    year_regex = r"(19\d{2}|2\d{3})"
    annee_courante = datetime.now().year
    annee_courante_moins_2 = datetime.now().year - 2
    # Filtrer les données
    donnees_filtrees = donnees[
        (donnees["numero_finess_etablissement_territorial"].astype(str).str.len() == 9) &
        (donnees["numero_finess_etablissement_territorial"].astype(str).isin(numeros_finess_liste)) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["annee"].astype(int).between(annee_courante_moins_2, annee_courante)) &
        (donnees["nature_contrat_code"].isin(code_list_ref))
    ]

    return donnees_filtrees

def import_donnees_cdi_cdd(chemin_local_du_fichier_ref: str, chemin_local_du_fichier_donnees: str, base_de_donnees: Engine, logger: Logger) -> None:
    date_du_fichier_vigierh_ref_cdi_cdd = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref)
    date_du_fichier_vigierh_donnees_cdi_cdd = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_donnees)
    traite_ref_cdi_cdd = verifie_si_le_fichier_est_traite(
        date_du_fichier_vigierh_ref_cdi_cdd,
        base_de_donnees,
        FichierSource.VIGIE_RH_REF_CDI_CDD.value
    )
    traite_donnees_cdi_cdd = verifie_si_le_fichier_est_traite(
        date_du_fichier_vigierh_donnees_cdi_cdd,
        base_de_donnees,
        FichierSource.VIGIE_RH_CDI_CDD.value
    )
    if traite_donnees_cdi_cdd and traite_ref_cdi_cdd:
        logger.info(f"Les fichiers {FichierSource.VIGIE_RH_CDI_CDD.value} et {FichierSource.VIGIE_RH_REF_CDI_CDD.value} ont été déjà traités")
    else:
        if len({date_du_fichier_vigierh_ref_cdi_cdd,
        date_du_fichier_vigierh_donnees_cdi_cdd}) == 1:
            referentiel_nature_contrats = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_NATURE_CONTRAT.value)
            donnees_nature_contrats_annuel = lis_le_fichier_parquet(chemin_local_du_fichier_donnees, ColumMapping.NATURE_CONTRAT_ANNUEL.value)
            code_list_ref = np.array(referentiel_nature_contrats['nature_contrat_code'].tolist())
            donnees_cdi_cdd_filtrees = filtrer_les_donnees_cdi_cdd(donnees_nature_contrats_annuel, code_list_ref, base_de_donnees)
            supprimer_donnees_existantes(TABLE_VIGIE_RH_NATURE_CONTRATS, base_de_donnees, SOURCE, logger)
            supprimer_donnees_existantes(TABLE_VIGIE_RH_REF_NATURE_CONTRATS, base_de_donnees, SOURCE, logger)
            inserer_nouvelles_donnees(
                TABLE_VIGIE_RH_REF_NATURE_CONTRATS,
                base_de_donnees,
                SOURCE,
                referentiel_nature_contrats,
                logger,
                FichierSource.VIGIE_RH_REF_CDI_CDD,
                date_du_fichier_vigierh_ref_cdi_cdd
            )
            inserer_nouvelles_donnees(
                TABLE_VIGIE_RH_NATURE_CONTRATS,
                base_de_donnees,
                SOURCE,
                donnees_cdi_cdd_filtrees,
                logger,
                FichierSource.VIGIE_RH_CDI_CDD,
                date_du_fichier_vigierh_donnees_cdi_cdd
            )

        else:
            logger.info(
                f"[{SOURCE}]❌ Les dates des fichiers sources ne sont pas cohérentes. "
                f"({FichierSource.VIGIE_RH_CDI_CDD.value}, "
                f"{FichierSource.VIGIE_RH_REF_CDI_CDD.value})"
            )
if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    vigierh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vigierh_data_path)

    chemin_local_du_fichier_ref_cdi_cdd = os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_CDI_CDD.value, logger_helios))
    chemin_local_du_fichier_cdi_cdd = os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_CDI_CDD.value, logger_helios))

    import_donnees_cdi_cdd(chemin_local_du_fichier_ref_cdi_cdd, chemin_local_du_fichier_cdi_cdd, base_de_donnees_helios, logger_helios)
