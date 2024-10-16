import pandas as pd
from logging import Logger

from datacrawler.dependencies.dépendances import initialise_les_dépendances

def lis_le_fichier_csv(logger: Logger) -> pd.DataFrame:
    valeurs_df = pd.read_csv(
    "https://www.data.gouv.fr/fr/datasets/r/da295ccc-2011-4995-b810-ad1f1a82a83f",
    low_memory=False)

    valeurs_df.info()
    valeurs_df.sample(n=5, random_state=187)
    return valeurs_df
    
if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    lis_le_fichier_csv(logger_helios)
