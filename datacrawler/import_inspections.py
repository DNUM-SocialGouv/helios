import os
from logging import Logger

from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_qualite
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_qualite
from datacrawler.load.nom_des_tables import TABLES_DES_INSPECTIONS_ET_CONTROLES, FichierSource
from datacrawler.transform.transform_les_donnees_inspections.transforme_les_donnees_inspections import (
    transform_les_donnees_inspections_etablissements,
)
from datacrawler.transform.equivalence_siicea_helios import (
    colonnes_a_lire_bloc_qualite_inspections,
    extrais_l_equivalence_des_types_des_colonnes,
    equivalences_siicea_helios,
)


def import_inspections_controles(chemin_local_du_fichier_siicea: str, base_de_données: Engine, logger: Logger) -> None:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(equivalences_siicea_helios)
    donnees_inspections_controles = lis_le_fichier_csv(chemin_local_du_fichier_siicea, colonnes_a_lire_bloc_qualite_inspections, types_des_colonnes)
    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)
    transform_donnees_inspections_controles = transform_les_donnees_inspections_etablissements(
        donnees_inspections_controles, numéros_finess_des_établissements_connus, logger
    )

    date_du_fichier_siicea = extrais_la_date_du_nom_de_fichier_qualite(chemin_local_du_fichier_siicea)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs inspection et controles des etablissements",
            "SIICEA",
            connection,
            TABLES_DES_INSPECTIONS_ET_CONTROLES,
            transform_donnees_inspections_controles,
            [(FichierSource.SIICEA, date_du_fichier_siicea)],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    siicea_data_path = variables_d_environnement["CHECKED_SIICEA_DATA_PATH"]
    fichiers = os.listdir(siicea_data_path)

    chemin_local_du_fichier_siicea = os.path.join(siicea_data_path, trouve_le_nom_du_fichier_qualite(fichiers, "siicea", logger_helios))

    import_inspections_controles(chemin_local_du_fichier_siicea, base_de_données_helios, logger_helios)
