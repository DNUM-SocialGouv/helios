from io import BytesIO
from logging import Logger
from typing import Any, Dict

import pandas as pd
import requests
from sqlalchemy.engine import Engine, create_engine

from datacrawler import écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour
from datacrawler.constantes import DATA_GOUV_COG_API_URL, RESSOURCE_COMMUNES_TITRE, RESSOURCE_DEPARTEMENTS_TITRE
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.load.nom_des_tables import TABLE_REF_DEPARTEMENT_REGION
from datacrawler.transform.équivalences_finess_helios import (
    colonnes_cog_communes,
    colonnes_cog_departements,
    équivalences_cog_communes_helios,
    équivalences_cog_departements_helios,
)


def récupère_l_url_du_fichier_communes_cog(session: requests.Session, data_gouv_cog_api_url: str, ressource_communes_titre: str) -> str:
    return récupère_l_url_du_fichier_cog(session, data_gouv_cog_api_url, ressource_communes_titre)


def récupère_l_url_du_fichier_departements_cog(session: requests.Session, data_gouv_cog_api_url: str, ressource_departements_titre: str) -> str:
    return récupère_l_url_du_fichier_cog(session, data_gouv_cog_api_url, ressource_departements_titre)


def récupère_l_url_du_fichier_cog(session: requests.Session, data_gouv_cog_api_url: str, titre_attendu: str) -> str:
    response = session.get(data_gouv_cog_api_url, timeout=30)
    response.raise_for_status()
    dataset = response.json()

    ressources = [ressource for ressource in dataset["resources"] if est_la_ressource_cog(ressource, titre_attendu)]
    if not ressources:
        raise ValueError(f"Aucune ressource COG '{titre_attendu}' courante trouvée sur data.gouv.fr")

    ressource_la_plus_récente = max(ressources, key=lambda ressource: str(ressource["created_at"]))
    return str(ressource_la_plus_récente["latest"])


def est_la_ressource_cog(ressource: Dict[str, Any], titre_attendu: str) -> bool:
    titre = str(ressource.get("title", "")).lower()
    return titre_attendu in titre and str(ressource.get("format", "")).lower() == "csv"


def lis_le_fichier_communes_cog(url_du_fichier: str, session: requests.Session) -> pd.DataFrame:
    response = session.get(url_du_fichier, timeout=60)
    response.raise_for_status()
    return pd.read_csv(BytesIO(response.content), usecols=colonnes_cog_communes, dtype=str, delimiter=",", encoding="utf-8")  # type: ignore


def lis_le_fichier_departements_cog(url_du_fichier: str, session: requests.Session) -> pd.DataFrame:
    response = session.get(url_du_fichier, timeout=60)
    response.raise_for_status()
    return pd.read_csv(BytesIO(response.content), usecols=colonnes_cog_departements, dtype=str, delimiter=",", encoding="utf-8")  # type: ignore


def transforme_le_referentiel_departement_region(communes_cog: pd.DataFrame, departements_cog: pd.DataFrame) -> pd.DataFrame:
    referentiel = communes_cog[colonnes_cog_communes].rename(columns=équivalences_cog_communes_helios)
    departements = departements_cog[colonnes_cog_departements].rename(columns=équivalences_cog_departements_helios)
    referentiel = referentiel.merge(departements, on=["ref_code_dep", "ref_code_region"], how="left")
    return (
        referentiel.dropna(subset=["ref_code_cog", "ref_code_dep", "ref_libelle_dep", "ref_code_region"])
        .drop_duplicates(subset=["ref_code_cog"])
        .set_index("ref_code_cog")
    )


def import_ref_departement_region(
    base_de_données: Engine,
    logger: Logger,
    session: requests.Session,
    data_gouv_cog_api_url: str,
    ressource_communes_titre: str,
    ressource_departements_titre: str,
) -> None:
    logger.info("[INSEE] Récupère le référentiel communes / départements / régions")
    url_du_fichier_communes = récupère_l_url_du_fichier_communes_cog(session, data_gouv_cog_api_url, ressource_communes_titre)
    url_du_fichier_departements = récupère_l_url_du_fichier_departements_cog(session, data_gouv_cog_api_url, ressource_departements_titre)
    communes_cog = lis_le_fichier_communes_cog(url_du_fichier_communes, session)
    departements_cog = lis_le_fichier_departements_cog(url_du_fichier_departements, session)
    referentiel = transforme_le_referentiel_departement_region(communes_cog, departements_cog)

    with base_de_données.begin() as connection:
        écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour(
            nom_de_la_donnée="correspondances communes / départements / régions",
            fournisseur="INSEE",
            connection=connection,
            table=TABLE_REF_DEPARTEMENT_REGION,
            données=referentiel,
            logger=logger,
            fichiers_mis_à_jour=[],
        )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    with requests.Session() as requests_session:
        import_ref_departement_region(
            base_de_données_helios,
            logger_helios,
            requests_session,
            DATA_GOUV_COG_API_URL,
            RESSOURCE_COMMUNES_TITRE,
            RESSOURCE_DEPARTEMENTS_TITRE,
        )
