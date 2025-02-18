import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
import sys

FILE_PREFIX = sys.argv[1] 
# Chemin vers votre fichier Parquet
FILE_PATH_PARQUET = './data_set/vigie_rh/'+ FILE_PREFIX + '.parquet'
# Chemin vers le sortie fichier en CSV
OUTPUT_CSV_PATH= './data_set/vigie_rh/'+ FILE_PREFIX + '.csv'

# Lire le fichier Parquet
df = pd.read_parquet(FILE_PATH_PARQUET,engine='pyarrow')
 
# Sauvegarder le DataFrame au format CSV
df.to_csv(OUTPUT_CSV_PATH, sep=';', index=False, encoding='utf-8')

print(f"Fichier CSV généré avec succès : {OUTPUT_CSV_PATH}")