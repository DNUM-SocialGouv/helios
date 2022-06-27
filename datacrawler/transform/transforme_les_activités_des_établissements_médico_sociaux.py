from typing import Callable

import pandas as pd

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.transform.csv_reader.csv_reader import lis_le_fichier_csv


def exécute():
    initialise_les_dépendances()


def transforme_les_activités_des_établissements_médico_sociaux(chemin_du_fichier: str, lis_le_fichier_csv: Callable = lis_le_fichier_csv) -> pd.DataFrame:
    colonnes_du_fichier_à_lire = [
        "Taux d'occupation des places autorisées en hébergement permanent",
        "Taux d'occupation des lits autorisés en hébergement temporaire",
        "Taux d'occupation des lits autorisés en accueil de jour",
        "Finess",
        "Année",
    ]
    types_des_colonnes = {
        "Finess": str,
        "Année": int,
        "Taux d'occupation des places autorisées en hébergement permanent": float,
        "Taux d'occupation des lits autorisés en hébergement temporaire": float,
        "Taux d'occupation des lits autorisés en accueil de jour": float,
    }
    contenu = lis_le_fichier_csv(chemin_du_fichier, colonnes_du_fichier_à_lire, types_des_colonnes)

    return contenu.dropna(subset=["Année", "Finess"]) \
                  .rename(
                    columns={
                        "Finess": "numérofinessÉtablissementterritorial",
                        "Année": "année",
                        "Taux d'occupation des places autorisées en hébergement permanent": "tauxOccupationHébergementPermanent",
                        "Taux d'occupation des lits autorisés en hébergement temporaire": "tauxOccupationHébergementTemporaire",
                        "Taux d'occupation des lits autorisés en accueil de jour": "tauxOccupationAccueilDeJour",
                    }
                  ) \
                  .drop_duplicates(subset=['année', 'numérofinessÉtablissementterritorial']) \
                  .set_index(["année", "numérofinessÉtablissementterritorial"])


if __name__ == "__main__":
    exécute()
