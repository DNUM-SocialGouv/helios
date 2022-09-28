import os
from unittest.mock import MagicMock

import pandas as pd

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.déchiffre_diamant import déchiffre_les_fichiers_du_dossier


class TestDéchiffreDiamant:
    def test_crée_autant_de_fichiers_csv_qu_il_y_a_de_fichiers_chiffrés(self) -> None:
        # Given
        _, variables_d_environnement = initialise_les_dépendances()
        chemin_vers_les_données_diamant_chiffrées = 'data_set/diamant_chiffré'
        chemin_vers_les_données_diamant = 'data_test/diamant/'
        for fichier in os.listdir(chemin_vers_les_données_diamant):
            os.unlink(os.path.join(chemin_vers_les_données_diamant, fichier))
        assert not os.listdir(chemin_vers_les_données_diamant)

        # When
        déchiffre_les_fichiers_du_dossier(chemin_vers_les_données_diamant_chiffrées, chemin_vers_les_données_diamant,
                                          variables_d_environnement["DIAMANT_KEY"], logger=MagicMock())

        # Then
        nombre_de_fichier_chiffrés = len(os.listdir(chemin_vers_les_données_diamant_chiffrées))
        fichiers_créés = os.listdir(chemin_vers_les_données_diamant)
        assert len(fichiers_créés) == nombre_de_fichier_chiffrés
        for fichier in fichiers_créés:
            chemin_vers_le_fichier = os.path.join(chemin_vers_les_données_diamant, fichier)
            assert not pd.read_csv(chemin_vers_le_fichier).empty
