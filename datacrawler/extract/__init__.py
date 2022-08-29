from collections import namedtuple
from typing import NamedTuple

import pandas as pd


class FichierDeDonnées(NamedTuple):
    données: pd.DataFrame
    dateDeMiseÀJour: str
