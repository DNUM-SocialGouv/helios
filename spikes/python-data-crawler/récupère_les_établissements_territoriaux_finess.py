import sys

import pandas as pd
from numpy import NaN

from common import charge_un_fichier_xml, configure_logger


def conserveLesÉtablissementsOuverts(établissements: pd.DataFrame) -> pd.DataFrame:
    return établissements[
        (établissements["indcaduc"] == "N") & (établissements["datefermeture"] == NaN)
    ]


def main():
    fichier = sys.argv[1]

    logger = configure_logger()

    établissements_territoriaux_finess = charge_un_fichier_xml(
        fichier, ".//structureet"
    )
    logger.info(établissements_territoriaux_finess.shape[0])

    établissements_territoriaux_ouverts_finess = conserveLesÉtablissementsOuverts(
        établissements_territoriaux_finess
    )
    logger.info(établissements_territoriaux_ouverts_finess.shape[0])


if __name__ == "__main__":
    main()
