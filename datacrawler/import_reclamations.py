import os
from logging import Logger

from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_sirec
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_sirec
from datacrawler.load.nom_des_tables import TABLES_DES_RECLAMATIONS, FichierSource
from datacrawler.transform.transforme_les_donnees_reclamations_etablissements.transforme_les_donnees_reclamations_etablissements import (
    transform_les_donnees_reclamations_etablissements,
)
from datacrawler.transform.equivalences_sirec_helios import (
    colonnes_a_lire_bloc_qualite_reclamations,
    extrais_l_equivalence_des_types_des_colonnes,
    equivalences_sirec_reclamations_helios,
)


def import_reclamations(chemin_local_du_fichier_reclamations: str, base_de_données: Engine, logger: Logger) -> None:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(equivalences_sirec_reclamations_helios)

    donnees_reclamations = lis_le_fichier_csv(chemin_local_du_fichier_reclamations, colonnes_a_lire_bloc_qualite_reclamations, types_des_colonnes)
    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    transform_donnees_reclamations = transform_les_donnees_reclamations_etablissements(
        donnees_reclamations, numéros_finess_des_établissements_connus, logger
    )

    date_du_fichier_sirec = extrais_la_date_du_nom_de_fichier_sirec(chemin_local_du_fichier_reclamations)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs reclamations des etablissements",
            "SIREC",
            connection,
            TABLES_DES_RECLAMATIONS,
            transform_donnees_reclamations,
            [(FichierSource.SIREC, date_du_fichier_sirec)],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    sirec_data_path = variables_d_environnement["SIREC_DATA_PATH"]
    fichiers = os.listdir(sirec_data_path)

    chemin_local_du_fichier_reclamations = os.path.join(
        sirec_data_path, trouve_le_nom_du_fichier_sirec(fichiers, "sirec", logger_helios)
    )

    import_reclamations (chemin_local_du_fichier_reclamations, base_de_données_helios, logger_helios)
