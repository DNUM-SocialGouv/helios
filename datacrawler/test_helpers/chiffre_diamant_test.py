import os
import subprocess
from pathlib import Path
from unittest.mock import MagicMock
from typing import Any
import pytest

from datacrawler.dependencies.logger.logger import crée_le_logger
from datacrawler.test_helpers.chiffre_diamant import chiffre


class TestChiffre:
    logger = crée_le_logger()

    @pytest.fixture(autouse=True)
    def importe_la_clef_gpg_puis_la_retire(self) -> Any:
        # Import de la clef GPG de test
        subprocess.run(
            "gpg --import data_test/CLEF_POUR_TEST_UNITAIRE_UNIQUEMENT.asc",
            shell=True,
            check=True,
        )

        # Lancement du test
        yield

        # Retrait de la clef GPG de test
        subprocess.run(
            "gpg --batch --yes --delete-secret-and-public-key 'B698 31A4 1F38 B660 2C53 4101 7FC5 ABE1 6458 2E31'",
            shell=True,
            check=True,
        )

    def test_enregistre_les_données_diamant_chiffrés_dans_un_dossier_donné(self) -> None:
        # Given
        dossier_source = "data_test/entrée/diamant"
        dossier_cible = "data_test/sortie/diamant_chiffre/"
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
