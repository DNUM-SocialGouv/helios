from typing import Dict

import pandas as pd


def lis_le_fichier_xml(chemin_du_fichier: str, xpath: str, types_des_colonnes: Dict) -> pd.DataFrame:
    return pd.read_xml(chemin_du_fichier, xpath=xpath, dtype=types_des_colonnes)
