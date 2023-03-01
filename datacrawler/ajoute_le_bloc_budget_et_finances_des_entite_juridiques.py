from sqlalchemy.engine import Engine, create_engine
from logging import Logger

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_diamant
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.load.nom_des_tables import TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE, FichierSource
from datacrawler.transform.entite_juridique.budget_finance.transforme_les_donnees_budget_finance_entite_juridique import \
    transform_les_donnees_budget_finance_entite_juridique
from datacrawler.transform.équivalences_diamant_helios import colonnes_a_lire_bloc_budget_finance_entite_juridique, \
    extrais_l_equivalence_des_types_des_colonnes, équivalences_diamant_quo_san_finance_buget_finance_helios, \
    index_du_bloc_budget_et_finances_entite_juridique


def ajoute_le_bloc_budget_et_finances_des_entite_juridiques(chemin_du_fichier_quo_san_finance: str,
                                                            base_de_données: Engine,
                                                            logger: Logger) -> None:
    types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(
        équivalences_diamant_quo_san_finance_buget_finance_helios)

    donnees_quo_san_finance = lis_le_fichier_csv(chemin_du_fichier_quo_san_finance,
                                                 colonnes_a_lire_bloc_budget_finance_entite_juridique,
                                                 types_des_colonnes)
    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_données)

    transform_donnees_quo_san_finance = transform_les_donnees_budget_finance_entite_juridique(donnees_quo_san_finance,
                                                                                              numéros_finess_des_établissements_connus)

    date_du_fichier_quo_san_finance = extrais_la_date_du_nom_de_fichier_diamant(chemin_du_fichier_quo_san_finance)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            "indicateurs budget et finances des entites juridiques",
            "DIAMANT",
            connection,
            TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE,
            transform_donnees_quo_san_finance,
            [
                (FichierSource.DIAMANT_QUO_SAN_FINANCE, date_du_fichier_quo_san_finance)
            ],
            logger,
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    ajoute_le_bloc_budget_et_finances_des_entite_juridiques(base_de_données_helios)
