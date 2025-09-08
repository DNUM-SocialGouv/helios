import os
from logging import Logger

import pandas as pd

from sqlalchemy.engine import Engine, create_engine

from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import TABLE_REF_TRANCHE_AGE, TABLE_TRANCHE_AGE, FichierSource
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base

def filtrer_les_donnees_pyramide(donnees: pd.DataFrame, base_de_donnees: Engine) -> pd.DataFrame:
    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_donnees)
    numeros_finess_liste = numeros_finess_des_etablissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()

    year_regex = r"(19\d{2}|2\d{3})"

    # Filtrer les données
    donnees_filtrees = donnees[
        (donnees["numero_finess_etablissement_territorial"].astype(str).str.len() == 9) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["numero_finess_etablissement_territorial"].astype(str).isin(numeros_finess_liste))
    ]

    return donnees_filtrees

def import_donnees_pyramide(chemin_local_du_fichier_ref: str, chemin_local_du_fichier_donnees: str, base_de_donnees: Engine, logger: Logger) -> None:
    date_du_fichier_vigierh_ref_tranche_age = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref)
    date_du_fichier_vigierh_donnees_pyramide = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_donnees)
    # si les fichiers ref et données ne sont pas de même date, on fait rien
    if date_du_fichier_vigierh_ref_tranche_age != date_du_fichier_vigierh_donnees_pyramide:
        logger.info(
                f"[{SOURCE}]❌ Les dates des fichiers sources ne sont pas cohérentes "
                f"({FichierSource.VIGIE_RH_REF_TRANCHE_AGE.value}, "
                f"{FichierSource.VIGIE_RH_PYRAMIDE.value})."
            )
    else:
        # si les fichiers sont déjà traités, on fait rien
        traite_ref = verifie_si_le_fichier_est_traite(date_du_fichier_vigierh_ref_tranche_age, base_de_donnees, FichierSource.VIGIE_RH_REF_TRANCHE_AGE.value)
        traite_donnees = verifie_si_le_fichier_est_traite(date_du_fichier_vigierh_donnees_pyramide, base_de_donnees, FichierSource.VIGIE_RH_PYRAMIDE.value)
        if traite_ref & traite_donnees:
            logger.info(f"Les fichiers {FichierSource.VIGIE_RH_REF_TRANCHE_AGE.value} et  {FichierSource.VIGIE_RH_PYRAMIDE.value}  ont été déjà traités")
        else:
            donnees_ref_tranche_age = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_TRANCHE_AGE.value)
            donnees_pyramide = lis_le_fichier_parquet(chemin_local_du_fichier_donnees, ColumMapping.PYRAMIDE_TRANCHE_AGE.value)
            donnees_pyramide_filtrees = filtrer_les_donnees_pyramide(donnees_pyramide, base_de_donnees)
            supprimer_donnees_existantes(TABLE_TRANCHE_AGE, base_de_donnees, SOURCE, logger)
            supprimer_donnees_existantes(TABLE_REF_TRANCHE_AGE, base_de_donnees, SOURCE, logger)
            inserer_nouvelles_donnees(
                TABLE_REF_TRANCHE_AGE,
                base_de_donnees,
                SOURCE,
                donnees_ref_tranche_age,
                logger,
                FichierSource.VIGIE_RH_REF_TRANCHE_AGE,
                date_du_fichier_vigierh_ref_tranche_age
            )
            inserer_nouvelles_donnees(
                TABLE_TRANCHE_AGE,
                base_de_donnees,
                SOURCE,
                donnees_pyramide_filtrees,
                logger,
                FichierSource.VIGIE_RH_PYRAMIDE,
                date_du_fichier_vigierh_donnees_pyramide
            )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    vigierh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vigierh_data_path)

    chemin_local_du_fichier_ref_tranche_age = os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_TRANCHE_AGE.value, logger_helios))
    chemin_local_du_fichier_pyramide = os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_PYRAMIDE.value, logger_helios))

    import_donnees_pyramide(chemin_local_du_fichier_ref_tranche_age, chemin_local_du_fichier_pyramide, base_de_donnees_helios, logger_helios)
