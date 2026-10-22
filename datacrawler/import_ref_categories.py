from logging import Logger
import pandas as pd
from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.constantes import FINESS_CATEGORIES_ENTITE_GEOGRAPHIQUE_EXERCICE_CODESYSTEM_URL
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.load.nom_des_tables import TABLE_REF_CATEGORIES
from datacrawler.import_les_etablissements_territoriaux_depuis_json_finess import _récupère_les_categories_entite_geographique_exercice
from datacrawler.transform.transforme_les_categories.transforme_les_categories import transforme_les_categories


def _construit_le_dataframe_des_categories(categories_par_code: dict[str, dict[str, str]]) -> pd.DataFrame:
    return pd.DataFrame([
        {
            "code": code,
            "libelle": categorie["libelle"],
            "libellecourt": categorie["libelle_court"],
            "domaine": categorie["domaine"],
        }
        for code, categorie in categories_par_code.items()
        if len(code) == 3
    ])


def import_ref_categories(finess_categories_entite_geographique_exercice_codesystem_url: str, base_de_donnees: Engine, logger: Logger) -> None:
    logger.info("[FINESS] Récupère les catégories finess")
    categories_par_code = _récupère_les_categories_entite_geographique_exercice(
        finess_categories_entite_geographique_exercice_codesystem_url,
    )
    categies_finess = _construit_le_dataframe_des_categories(categories_par_code)
    categories_transformees = transforme_les_categories(categies_finess)

    with base_de_donnees.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            nom_de_la_donnée="catégories finess",
            fournisseur="FINESS",
            connection=connection,
            table=TABLE_REF_CATEGORIES,
            données=categories_transformees,
            logger=logger,
            fichiers_mis_à_jour=[],
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    import_ref_categories(
        FINESS_CATEGORIES_ENTITE_GEOGRAPHIQUE_EXERCICE_CODESYSTEM_URL,
        base_de_donnees_helios,
        logger_helios,
    )
