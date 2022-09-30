import os
from pathlib import Path
from unittest.mock import MagicMock

import pandas as pd
from pytest import LogCaptureFixture

from datacrawler.dependencies.logger.logger import crée_le_logger
from datacrawler.déchiffre_diamant import déchiffre_les_fichiers_du_dossier, vérifie_qu_on_a_la_clef_pour_déchiffrer


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
        vérifie_qu_on_a_la_clef_pour_déchiffrer = MagicMock()
        vérifie_qu_on_a_la_clef_pour_déchiffrer.return_value = False

        # When
        déchiffre_les_fichiers_du_dossier(
            chemin_vers_les_données_diamant_chiffrées,
            chemin_vers_les_données_diamant,
            logger=logger,
            executable_gpg="/usr/local/bin/gpg",
            vérifie_qu_on_a_la_clef_pour_déchiffrer=vérifie_qu_on_a_la_clef_pour_déchiffrer
        )

        # Then
        fichiers_créés = os.listdir(chemin_vers_les_données_diamant)
        assert len(fichiers_créés) == 0

        logs = [log for log in caplog.records if
                "La clef privée fournie ne peut pas déchiffrer le fichier" in log.message]
        assert len(logs) == 6
        for log in logs:
            assert log.levelname == "ERROR"

    def test_informe_l_utilisateur_quand_il_y_a_une_erreur_dans_l_exécution_de_la_commande(self,
                                                                                           caplog: LogCaptureFixture) -> None:
        # Given
        logger = crée_le_logger()
        chemin_vers_les_données_diamant_chiffrées = 'data_set/diamant_chiffré'
        chemin_vers_les_données_diamant = 'data_test/diamant/'
        Path(chemin_vers_les_données_diamant).mkdir(exist_ok=True)
        for fichier in os.listdir(chemin_vers_les_données_diamant):
            os.unlink(os.path.join(chemin_vers_les_données_diamant, fichier))
        assert not os.listdir(chemin_vers_les_données_diamant)
        vérifie_qu_on_a_la_clef_pour_déchiffrer = MagicMock()
        vérifie_qu_on_a_la_clef_pour_déchiffrer.return_value = True
        exécute = MagicMock()
        process = MagicMock()
        exécute.return_value = process
        process.returncode = 2,
        process.stderr = b'utilisation\xc2\xa0: gpg [options] --decrypt [filename]\n'

        # When
        déchiffre_les_fichiers_du_dossier(
            chemin_vers_les_données_diamant_chiffrées,
            chemin_vers_les_données_diamant,
            logger=logger,
            executable_gpg="/usr/local/bin/gpg",
            vérifie_qu_on_a_la_clef_pour_déchiffrer=vérifie_qu_on_a_la_clef_pour_déchiffrer,
            exécute=exécute,
        )

        # Then
        fichiers_créés = os.listdir(chemin_vers_les_données_diamant)
        assert len(fichiers_créés) == 0

        log_d_erreur = [log for log in caplog.records if
                        log.levelname == "ERROR"]
        assert len(log_d_erreur) == 6
        for log in log_d_erreur:
            assert log.message == "utilisation\xa0: gpg [options] --decrypt [filename]"
        for fichier in os.listdir(chemin_vers_les_données_diamant_chiffrées):
            assert f"Fichier {fichier} déchiffré" not in [log.message for log in caplog.records]


class TestVérifieQuOnALaClefPourDechiffrer:
    def test_retourne_true_lorsque_la_clef_est_connue(self):
        # Given
        executable_gpg = "/usr/local/bin/gpg"
        fichier_chiffré = "chemin/vers/le/fichier.gpg"
        exécute = MagicMock()
        premier_process = MagicMock(stdout=b':pubkey enc packet: version 3, algo 1, keyid AF4238B8FD15301E\n')
        deuxième_process = MagicMock(stdout=b'ssb   rsa2048/AF4238B8FD15301E 2022-09-28 [E]\n')
        exécute.side_effect = [premier_process, deuxième_process]

        # When
        la_clef_est_connue = vérifie_qu_on_a_la_clef_pour_déchiffrer(executable_gpg, fichier_chiffré, exécute)

        # Then
        assert la_clef_est_connue is True

    def test_retourne_false_lorsque_la_clef_n_est_pas_connue(self):
        # Given
        executable_gpg = "/usr/local/bin/gpg"
        fichier_chiffré = "chemin/vers/le/fichier.gpg"
        exécute = MagicMock()
        premier_process = MagicMock(stdout=b':pubkey enc packet: version 3, algo 1, keyid CD4235E8FD15301E\n')
        deuxième_process = MagicMock(stdout=b'')
        exécute.side_effect = [premier_process, deuxième_process]

        # When
        la_clef_est_connue = vérifie_qu_on_a_la_clef_pour_déchiffrer(executable_gpg, fichier_chiffré, exécute)

        # Then
        assert la_clef_est_connue is False
