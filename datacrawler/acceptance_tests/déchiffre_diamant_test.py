import os
from pathlib import Path
from unittest.mock import MagicMock

import pandas as pd
from pytest import LogCaptureFixture

from datacrawler.dependencies.logger.logger import crée_le_logger
from datacrawler.déchiffre_diamant import déchiffre_les_fichiers_du_dossier


class TestDéchiffreDiamant:
    def test_crée_autant_de_fichiers_csv_qu_il_y_a_de_fichiers_chiffrés(self) -> None:
        # Given
        chemin_vers_les_données_diamant_chiffrées = 'data_set/diamant_chiffré'
        chemin_vers_les_données_diamant = 'data_test/diamant/'
        for fichier in os.listdir(chemin_vers_les_données_diamant):
            os.unlink(os.path.join(chemin_vers_les_données_diamant, fichier))
        assert not os.listdir(chemin_vers_les_données_diamant)

        # When
        déchiffre_les_fichiers_du_dossier(chemin_vers_les_données_diamant_chiffrées,
                                          chemin_vers_les_données_diamant,
                                          logger=MagicMock(),
                                          executable_gpg='/usr/local/bin/gpg')

        # Then
        nombre_de_fichier_chiffrés = len(os.listdir(chemin_vers_les_données_diamant_chiffrées))
        fichiers_créés = os.listdir(chemin_vers_les_données_diamant)
        assert len(fichiers_créés) == nombre_de_fichier_chiffrés
        for fichier in fichiers_créés:
            chemin_vers_le_fichier = os.path.join(chemin_vers_les_données_diamant, fichier)
            assert not pd.read_csv(chemin_vers_le_fichier).empty

    def test_informe_l_utilisateur_quand_sa_clef_privée_ne_sert_pas_au_déchiffrement(self,
                                                                                     caplog: LogCaptureFixture) -> None:
        # Given
        logger = crée_le_logger()
        chemin_vers_les_données_diamant_chiffrées = 'data_set/diamant_chiffré'
        chemin_vers_les_données_diamant = 'data_test/diamant/'
        Path(chemin_vers_les_données_diamant).mkdir(exist_ok=True)
        for fichier in os.listdir(chemin_vers_les_données_diamant):
            os.unlink(os.path.join(chemin_vers_les_données_diamant, fichier))
        assert not os.listdir(chemin_vers_les_données_diamant)

        # When
        déchiffre_les_fichiers_du_dossier(chemin_vers_les_données_diamant_chiffrées,
                                          chemin_vers_les_données_diamant,
                                          logger=logger,
                                          executable_gpg='/usr/local/bin/gpg')

        # Then
        fichiers_créés = os.listdir(chemin_vers_les_données_diamant)
        assert len(fichiers_créés) == 0

        log = caplog.records.pop()
        assert log.levelname == 'ERROR'
        assert log.message == 'La clef privée fournie ne peut pas déchiffrer les données DIAMANT'
