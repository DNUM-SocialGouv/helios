import os
import pandas as pd
from logging import Logger

from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_diamant
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_entites_juridiques_de_la_base, récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_diamant
from datacrawler.load.nom_des_tables import TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE, TABLES_DES_BUDGETS_ET_FINANCES_ETABLISSEMENT_TERRITORIAL, FichierSource
from datacrawler.transform.entite_juridique.budget_finance.transforme_les_donnees_budget_finance_entite_juridique import (
    extrais_les_donnees_entites_juridiques,
    extrais_les_donnees_etablissements_territoriaux_sanitaires,
    transform_les_donnees_budget_finance_entite_juridique,
    transform_les_donnees_budget_finance_etablissement_territorial
)
from datacrawler.transform.équivalences_diamant_helios import (
    colonnes_a_lire_bloc_budget_finance_entite_juridique,
    extrais_l_equivalence_des_types_des_colonnes,
    équivalences_diamant_quo_san_finance_buget_finance_helios,
)


def ajoute_le_bloc_budget_et_finances_des_entite_juridiques(chemin_du_fichier_quo_san_finance: str, base_de_données: Engine, logger: Logger) -> None:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(équivalences_diamant_quo_san_finance_buget_finance_helios)

    donnees_quo_san_finance = lis_le_fichier_csv(chemin_du_fichier_quo_san_finance, colonnes_a_lire_bloc_budget_finance_entite_juridique, types_des_colonnes)
    numéros_finess_des_entites_juridiques_connues = récupère_les_numéros_finess_des_entites_juridiques_de_la_base(base_de_données)
    numéros_finess_des_etablissements_territoriaux_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    transform_donnees_quo_san_finance = transform_les_donnees_budget_finance_entite_juridique(
        donnees_quo_san_finance, numéros_finess_des_entites_juridiques_connues
    )

    transform_donnees_quo_san_finance_et = transform_les_donnees_budget_finance_etablissement_territorial(
        donnees_quo_san_finance, numéros_finess_des_etablissements_territoriaux_connus
    )

    date_du_fichier_quo_san_finance = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_quo_san_finance)

    ## filtrer les données 
    donnees_filtrees_only_EJ = extrais_les_donnees_entites_juridiques(transform_donnees_quo_san_finance)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs budget et finances des entites juridiques",
            "DIAMANT",
            connection,
            TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE,
            donnees_filtrees_only_EJ,
            [(FichierSource.DIAMANT_QUO_SAN_FINANCE, date_du_fichier_quo_san_finance)],
            logger,
        )

    ## filtrer les données
    donnees_filtrees_only_ET = extrais_les_donnees_etablissements_territoriaux_sanitaires(transform_donnees_quo_san_finance_et)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs budget et finances des etablissements territoriaux sanitaire",
            "DIAMANT",
            connection,
            TABLES_DES_BUDGETS_ET_FINANCES_ETABLISSEMENT_TERRITORIAL,
            donnees_filtrees_only_ET,
            [(FichierSource.DIAMANT_QUO_SAN_FINANCE, date_du_fichier_quo_san_finance)],
            logger,
        )



if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    fichiers = os.listdir(variables_d_environnement["DIAMANT_DATA_PATH"])
    chemin_local_du_fichier_quo_san_finance = os.path.join(
        variables_d_environnement["DIAMANT_DATA_PATH"], trouve_le_nom_du_fichier_diamant(fichiers, "QUO_SAN_FINANCE", logger_helios)
    )

    ajoute_le_bloc_budget_et_finances_des_entite_juridiques(chemin_local_du_fichier_quo_san_finance, base_de_données_helios, logger_helios)
