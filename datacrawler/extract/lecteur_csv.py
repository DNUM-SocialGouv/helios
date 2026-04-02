from typing import Any, Dict, List, cast

import pandas as pd


def lis_le_fichier_csv(chemin_du_fichier: str, colonnes: List[str], types_des_colonnes: Dict) -> pd.DataFrame:
    return pd.read_csv(chemin_du_fichier, usecols=colonnes, dtype=types_des_colonnes, delimiter=";", encoding="utf-8")  # type: ignore


def lis_le_fichier_sirec_csv(chemin_du_fichier: str, colonnes: List[str], types_des_colonnes: Dict) -> pd.DataFrame:
    return pd.read_csv(chemin_du_fichier, usecols=colonnes, dtype=types_des_colonnes, delimiter=";", encoding="utf-8").fillna(0)  # type: ignore


def lis_le_fichier_hapi_csv(chemin_du_fichier: str, colonnes: List[str], types_des_colonnes: Dict) -> pd.DataFrame:
    return pd.read_csv(chemin_du_fichier, usecols=colonnes, dtype=types_des_colonnes, delimiter="|", encoding="utf-8")  # type: ignore


def lis_le_fichier_engagements_hapi_csv(chemin_du_fichier: str, colonnes: List[str], types_des_colonnes: Dict[str, Any]) -> pd.DataFrame:
    return cast(
        pd.DataFrame,
        pd.read_csv(
            chemin_du_fichier,
            usecols=colonnes,
            dtype=cast(Any, types_des_colonnes),
            delimiter="|",
            quotechar='"',
            keep_default_na=False,
            encoding="utf-8",
        ),
    )
