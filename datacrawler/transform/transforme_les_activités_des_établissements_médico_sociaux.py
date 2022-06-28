from typing import Callable

import pandas as pd

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.load.activités_des_établissements_médico_sociaux import TableActivitésDesÉtablissementsMédicoSociaux
from datacrawler.transform.diamant.ann_errd_ej_et import ColonnesDuFichierAnnErrdEjEt
from datacrawler.transform.lecteur_csv.lecteur_csv import lis_le_fichier_csv


def exécute():
    initialise_les_dépendances()


def transforme_les_activités_des_établissements_médico_sociaux(chemin_du_fichier: str, lis_le_csv: Callable = lis_le_fichier_csv) -> pd.DataFrame:
    colonnes_du_fichier_à_lire = [
        ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial,
        ColonnesDuFichierAnnErrdEjEt.année,
        ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent,
        ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire,
        ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour,
    ]
    types_des_colonnes = {
        ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial: str,
        ColonnesDuFichierAnnErrdEjEt.année: int,
        ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent: float,
        ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire: float,
        ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour: float,
    }
    contenu = lis_le_csv(chemin_du_fichier, colonnes_du_fichier_à_lire, types_des_colonnes)

    return (
        contenu.dropna(subset=[ColonnesDuFichierAnnErrdEjEt.année, ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial])
        .rename(
            columns={
                ColonnesDuFichierAnnErrdEjEt.numéro_finess_établissement_territorial: TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial,
                ColonnesDuFichierAnnErrdEjEt.année: TableActivitésDesÉtablissementsMédicoSociaux.année,
                ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_permanent: TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_permanent,
                ColonnesDuFichierAnnErrdEjEt.taux_occupation_hébergement_temporaire: TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_hébergement_temporaire,
                ColonnesDuFichierAnnErrdEjEt.taux_occupation_accueil_de_jour: TableActivitésDesÉtablissementsMédicoSociaux.taux_occupation_accueil_de_jour,
            }
        )
        .drop_duplicates(
            subset=[
                TableActivitésDesÉtablissementsMédicoSociaux.année,
                TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial,
            ]
        )
        .set_index(
            [
                TableActivitésDesÉtablissementsMédicoSociaux.année,
                TableActivitésDesÉtablissementsMédicoSociaux.numéro_finess_établissement_territorial,
            ]
        )
    )


if __name__ == "__main__":
    exécute()
