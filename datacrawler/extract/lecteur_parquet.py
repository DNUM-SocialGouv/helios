from typing import Dict

import pandas as pd

def lis_le_fichier_parquet(file_path: str, column_mapping: Dict) -> pd.DataFrame:
    data_frame = pd.read_parquet(file_path, engine='pyarrow')
    data_frame.rename(columns=column_mapping, inplace=True)
    return data_frame
