import os
from logging import Logger

from sqlalchemy.engine import Engine, create_engine

from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.load.nom_des_tables import TABLE_REF_TRANCHE_AGE, FichierSource
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping

def import_referentiel_tranche_age(chemin_local_du_fichier_ref: str, base_de_données: Engine, logger: Logger) -> None:
    date_du_fichier_vigierh_ref_tranche_age = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref)
    # si le fichier est déjà traité, on fait rien
    traite = verifie_si_le_fichier_est_traite(date_du_fichier_vigierh_ref_tranche_age, base_de_données, FichierSource.VIGIE_RH_REF_TRANCHE_AGE.value)
    if(traite):
        logger.info(f"Le fichier {date_du_fichier_vigierh_ref_tranche_age} a été déjà traité")
    else:
        donnees_ref_tranche_age = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_TRANCHE_AGE.value)
        supprimer_donnees_existantes(TABLE_REF_TRANCHE_AGE, base_de_données, SOURCE, logger)
        inserer_nouvelles_donnees(
            TABLE_REF_TRANCHE_AGE,
            base_de_données,
            SOURCE,
            donnees_ref_tranche_age,
            logger,
            FichierSource.VIGIE_RH_REF_TRANCHE_AGE,
            date_du_fichier_vigierh_ref_tranche_age
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    vigierh_ref_tranche_age_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vigierh_ref_tranche_age_data_path)

    chemin_local_du_fichier_ref_tranche_age = os.path.join(
        vigierh_ref_tranche_age_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_TRANCHE_AGE.value, logger_helios))

    import_referentiel_tranche_age(chemin_local_du_fichier_ref_tranche_age, base_de_données_helios, logger_helios)
    