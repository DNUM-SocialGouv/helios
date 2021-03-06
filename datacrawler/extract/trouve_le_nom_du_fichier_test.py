import logging

import pytest
from pytest import LogCaptureFixture

from datacrawler.dependencies.logger.logger import crée_le_logger
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.test_helpers import mocked_logger


class TestLocaliseLeFichier:
    def test_renvoie_le_nom_du_fichier_recherché(self) -> None:
        # GIVEN
        préfixe_du_fichier_recherché = "ANN_ERRD_EJ_ET"
        liste_des_fichiers = [
            "ANN_ERRD_EJ_ET_2022_07_03.CSV",
            "MEN_PMSI_ANNUEL_2022_07_03.CSV",
            "ANN_MS_TDP_ET_2022_07_03.CSV",
            "MEN_PMSI_MENCUMU_2022_07_03.CSV",
            "QUO_SAN_FINANCE_2022_07_03.CSV",
            "ANN_SAE_2022_07_03.CSV",
            "ANN_RPU_2022_07_03.CSV",
            "ANN_ERRD_EJ_2022_07_03.CSV",
            "ANN_CA_EJ_ET_2022_07_03.CSV",
        ]

        # WHEN
        fichier_recherché = trouve_le_nom_du_fichier(liste_des_fichiers, préfixe_du_fichier_recherché, mocked_logger)

        # THEN
        assert fichier_recherché == f"{préfixe_du_fichier_recherché}_2022_07_03.CSV"

    def test_signale_si_le_fichier_recherché_n_est_pas_présent(self, caplog: LogCaptureFixture) -> None:
        # GIVEN
        logger = crée_le_logger()
        préfixe_du_fichier_recherché = "ANN_ERRD_EJ_ET"

        # WHEN
        with pytest.raises(FileNotFoundError):
            trouve_le_nom_du_fichier([], préfixe_du_fichier_recherché, logger)

        # THEN
        log = caplog.records.pop()
        assert log.levelno == logging.FATAL
        assert log.message == "Le fichier ANN_ERRD_EJ_ET est introuvable parmi les fichiers DIAMANT téléchargés."
