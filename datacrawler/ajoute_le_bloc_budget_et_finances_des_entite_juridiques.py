from sqlalchemy.engine import Engine, create_engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances


def ajoute_le_bloc_budget_et_finances_des_entite_juridiques(quo_san_finance_file_path: str, base_de_données: Engine) -> None:
    return


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    ajoute_le_bloc_budget_et_finances_des_entite_juridiques(base_de_données_helios)
