import os
from logging import Logger

from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_sirec_sivss
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_sirec_sivss
from datacrawler.load.nom_des_tables import TABLES_DES_EVENEMENTS_INDESIRABLES, FichierSource
from datacrawler.transform.transform_les_donnees_evenements_indesirables_etablissements.transforme_les_donnees_evenements_indesirables_etablissements import (
    transform_les_donnees_evenements_indesirables_etablissements,
)
from datacrawler.transform.equivalences_sivss_helios import (
    colonnes_a_lire_bloc_qualite_evenements_indesirables,
    extrais_l_equivalence_des_types_des_colonnes,
    equivalences_sivss_evenements_indesirables_helios,
)


def import_evenements_indesirables(chemin_local_du_fichier_evenements_indesirables: str, base_de_données: Engine, logger: Logger) -> None:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(equivalences_sivss_evenements_indesirables_helios)

    donnees_evenements_indesirables = lis_le_fichier_csv(chemin_local_du_fichier_evenements_indesirables, colonnes_a_lire_bloc_qualite_evenements_indesirables, types_des_colonnes)
    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)
    transform_donnees_evenements_indesirables = transform_les_donnees_evenements_indesirables_etablissements(
        donnees_evenements_indesirables, numéros_finess_des_établissements_connus, logger
    )

    logger.info(f"[donnees_evenements_indesirables] {transform_donnees_evenements_indesirables}")

    date_du_fichier_sivss = extrais_la_date_du_nom_de_fichier_sirec_sivss(chemin_local_du_fichier_evenements_indesirables)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs évènements indésirables des etablissements",
            "SIVSS",
            connection,
            TABLES_DES_EVENEMENTS_INDESIRABLES,
            transform_donnees_evenements_indesirables,
            [(FichierSource.SIVSS, date_du_fichier_sivss)],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    sivss_data_path = variables_d_environnement["CHECKED_SIVSS_DATA_PATH"]
    fichiers = os.listdir(sivss_data_path)

    chemin_local_du_fichier_sivss = os.path.join(
        sivss_data_path, trouve_le_nom_du_fichier_sirec_sivss(fichiers, "sivss", logger_helios)
    )

    import_evenements_indesirables (chemin_local_du_fichier_sivss, base_de_données_helios, logger_helios)
