from typing import Dict

import pandas as pd

def lis_le_fichier_parquet(file_path: str, column_mapping: Dict) -> pd.DataFrame:
    data_frame = pd.read_parquet(file_path, columns=list(column_mapping.keys()),engine='pyarrow')
    data_frame.rename(columns=column_mapping, inplace=True)
    return data_frame

def trouver_lannee_max_disponible(donnees: pd.DataFrame) -> int:
    return donnees['annee'].max()
