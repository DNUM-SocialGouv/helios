import os
from pathlib import Path
from unittest.mock import MagicMock

from datacrawler.dependencies.logger.logger import crée_le_logger
from datacrawler.test_helpers.chiffre_diamant import chiffre


class TestChiffre:
    logger = crée_le_logger()

    def test_enregistre_les_données_diamant_chiffrés_dans_un_dossier_donné(self) -> None:
        # Given
        dossier_source = "data_set/diamant"
        dossier_cible = "data_test/diamant_chiffre/"
        Path(dossier_cible).mkdir(exist_ok=True)
        for fichier in os.listdir(dossier_cible):
            os.unlink(os.path.join(dossier_cible, fichier))

        # When
        chiffre(dossier_source, dossier_cible, logger=MagicMock())

        # Then
        fichiers_chiffrés = os.listdir(dossier_cible)
        nombre_de_fichiers_diamant = len(os.listdir(dossier_source))
        assert len(fichiers_chiffrés) == nombre_de_fichiers_diamant
        for fichier in fichiers_chiffrés:
            assert fichier[-4:] == ".gpg"
