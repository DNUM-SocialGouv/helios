from typing import Dict, List

import pandas as pd


def lis_le_fichier_csv(chemin_du_fichier: str, colonnes: List[str], types_des_colonnes: Dict) -> pd.DataFrame:
    return pd.read_csv(chemin_du_fichier, usecols=colonnes, dtype=types_des_colonnes, delimiter=";", encoding="utf-8")  # type: ignore


def lis_le_fichier_sirec_csv(chemin_du_fichier: str, colonnes: List[str], types_des_colonnes: Dict) -> pd.DataFrame:
    return pd.read_csv(chemin_du_fichier, usecols=colonnes, dtype=types_des_colonnes, delimiter=";", encoding="utf-8").fillna(0)  # type: ignore


def lis_le_fichier_hapi_csv(chemin_du_fichier: str, colonnes: List[str], types_des_colonnes: Dict) -> pd.DataFrame:
    return pd.read_csv(chemin_du_fichier, usecols=colonnes, dtype=types_des_colonnes, delimiter="|", encoding="utf-8")  # type: ignore
