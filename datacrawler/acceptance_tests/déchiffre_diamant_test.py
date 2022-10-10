import os
from unittest.mock import MagicMock

import pandas as pd
from pytest import LogCaptureFixture

from datacrawler.dependencies.logger.logger import crée_le_logger
from datacrawler.déchiffre_diamant import _vérifie_la_clef, déchiffre


class TestDéchiffre:
    dossier_avec_les_données_chiffrées = "data_set/diamant_chiffré"
    dossier_où_sauvegarder_les_csv = "data_test/diamant_test/"
    logger = crée_le_logger()

    def test_crée_autant_de_fichiers_csv_qu_il_y_a_de_fichiers_chiffrés(self) -> None:
        # When
        déchiffre(
            TestDéchiffre.dossier_avec_les_données_chiffrées,
            TestDéchiffre.dossier_où_sauvegarder_les_csv,
            logger=MagicMock(),
        )

        # Then
        nombre_de_fichier_chiffrés = len(os.listdir(TestDéchiffre.dossier_avec_les_données_chiffrées))
        fichiers_déchiffrés = os.listdir(TestDéchiffre.dossier_où_sauvegarder_les_csv)
        assert len(fichiers_déchiffrés) == nombre_de_fichier_chiffrés
        for fichier in fichiers_déchiffrés:
            chemin_vers_le_fichier = os.path.join(TestDéchiffre.dossier_où_sauvegarder_les_csv, fichier)
            assert not pd.read_csv(chemin_vers_le_fichier).empty

    def test_informe_l_utilisateur_quand_sa_clef_privée_ne_match_pas_celle_utilisée_pour_chiffrer(self, caplog: LogCaptureFixture) -> None:
        # Given
        mock_vérifie_la_clef = MagicMock()
        mock_vérifie_la_clef.return_value = False

        # When
        déchiffre(
            TestDéchiffre.dossier_avec_les_données_chiffrées,
            TestDéchiffre.dossier_où_sauvegarder_les_csv,
            logger=TestDéchiffre.logger,
            vérifie_la_clef=mock_vérifie_la_clef,
        )

        # Then
        fichiers_déchiffrés = os.listdir(TestDéchiffre.dossier_où_sauvegarder_les_csv)
        assert len(fichiers_déchiffrés) == 0

        logs = [log for log in caplog.records if log.levelname == "ERROR" and "La clef privée fournie ne peut pas déchiffrer le fichier" in log.message]
        assert len(logs) == len(os.listdir(TestDéchiffre.dossier_avec_les_données_chiffrées))

    def test_informe_l_utilisateur_quand_il_y_a_une_erreur_dans_l_exécution_de_la_commande(self, caplog: LogCaptureFixture) -> None:
        # Given
        mock_vérifie_la_clef = MagicMock()
        mock_vérifie_la_clef.return_value = True
        mock_exécute = MagicMock()
        mock_process = MagicMock()
        mock_exécute.return_value = mock_process
        code_d_erreur_commande_gpg = 2
        mock_process.returncode = code_d_erreur_commande_gpg
        mock_process.stderr = b"utilisation\xc2\xa0: gpg [options] --decrypt [filename]\n"

        # When
        déchiffre(
            TestDéchiffre.dossier_avec_les_données_chiffrées,
            TestDéchiffre.dossier_où_sauvegarder_les_csv,
            logger=TestDéchiffre.logger,
            vérifie_la_clef=mock_vérifie_la_clef,
            exécute_une_commande=mock_exécute,
        )

        # Then
        fichiers_déchiffrés = os.listdir(TestDéchiffre.dossier_où_sauvegarder_les_csv)
        assert len(fichiers_déchiffrés) == 0

        logs_d_erreur = [log for log in caplog.records if log.levelname == "ERROR" and log.message == "utilisation\xa0: gpg [options] --decrypt [filename]"]
        assert len(logs_d_erreur) == len(os.listdir(TestDéchiffre.dossier_avec_les_données_chiffrées))
        for fichier in os.listdir(TestDéchiffre.dossier_avec_les_données_chiffrées):
            assert f"Fichier {fichier} déchiffré" not in [log.message for log in caplog.records]

    def skip_n_informe_pas_l_utilisateur_quand_tout_se_passe_bien_même_si_gpg_envoie_dans_stderr(self, caplog: LogCaptureFixture) -> None:
        # When
        déchiffre(
            TestDéchiffre.dossier_avec_les_données_chiffrées,
            TestDéchiffre.dossier_où_sauvegarder_les_csv,
            logger=TestDéchiffre.logger,
        )

        # Then
        messages_avant_et_après_les_autres_logs = 2
        logs = list(caplog.records)
        assert len(logs) == len(os.listdir(TestDéchiffre.dossier_avec_les_données_chiffrées)) + messages_avant_et_après_les_autres_logs


class TestVérifieQuOnALaClefPourDechiffrer:
    def test_retourne_true_lorsque_la_clef_est_connue(self) -> None:
        # Given
        fichier_chiffré = "chemin/vers/le/fichier.gpg"
        exécute_une_commande = MagicMock()
        id_de_la_clef_utilisée_pour_chiffrer_le_fichier = MagicMock(stdout=b":pubkey enc packet: version 3, algo 1, keyid AF4238B8FD15301E\n")
        clef_connue_par_gpg = MagicMock(stdout=b"ssb   rsa2048/AF4238B8FD15301E 2022-09-28 [E]\n")
        exécute_une_commande.side_effect = [id_de_la_clef_utilisée_pour_chiffrer_le_fichier, clef_connue_par_gpg]

        # When
        la_clef_est_connue = _vérifie_la_clef(fichier_chiffré, exécute_une_commande)

        # Then
        assert la_clef_est_connue is True

    def test_retourne_false_lorsque_la_clef_n_est_pas_connue(self) -> None:
        # Given
        fichier_chiffré = "chemin/vers/le/fichier.gpg"
        exécute_une_commande = MagicMock()
        id_de_la_clef_utilisée_pour_chiffrer_le_fichier = MagicMock(stdout=b":pubkey enc packet: version 3, algo 1, keyid CD4235E8FD15301E\n")
        clef_inconue_par_gpg = MagicMock(stdout=b"")
        exécute_une_commande.side_effect = [id_de_la_clef_utilisée_pour_chiffrer_le_fichier, clef_inconue_par_gpg]

        # When
        la_clef_est_connue = _vérifie_la_clef(fichier_chiffré, exécute_une_commande)

        # Then
        assert la_clef_est_connue is False
