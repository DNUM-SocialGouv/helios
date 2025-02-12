from typing import Dict, List

import pandas as pd

def lis_le_fichier_parquet(file_path: str, column_mapping: dict) -> pd.DataFrame:
    df = pd.read_parquet(file_path, engine='pyarrow')
    df.rename(columns=column_mapping, inplace=True)
    return df

