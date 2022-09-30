import os
from unittest.mock import MagicMock

import pandas as pd
from pytest import LogCaptureFixture

from datacrawler.dependencies.logger.logger import crée_le_logger
from datacrawler.déchiffre_diamant import déchiffre, _vérifie_la_clef


class TestDéchiffre:
    chemin_vers_les_données_diamant_chiffrées = 'data_set/diamant_chiffré'
    chemin_vers_les_données_diamant = 'data_test/diamant/'

    def setup_method(self) -> None:
        for fichier in os.listdir(TestDéchiffre.chemin_vers_les_données_diamant):
            os.unlink(os.path.join(TestDéchiffre.chemin_vers_les_données_diamant, fichier))
        assert not os.listdir(TestDéchiffre.chemin_vers_les_données_diamant)

    def test_crée_autant_de_fichiers_csv_qu_il_y_a_de_fichiers_chiffrés(self) -> None:
        # When
        déchiffre(TestDéchiffre.chemin_vers_les_données_diamant_chiffrées,
                  TestDéchiffre.chemin_vers_les_données_diamant,
                  logger=MagicMock(),
                  executable_gpg='/usr/local/bin/gpg')

        # Then
        nombre_de_fichier_chiffrés = len(os.listdir(TestDéchiffre.chemin_vers_les_données_diamant_chiffrées))
        fichiers_déchiffrés = os.listdir(TestDéchiffre.chemin_vers_les_données_diamant)
        assert len(fichiers_déchiffrés) == nombre_de_fichier_chiffrés
        for fichier in fichiers_déchiffrés:
            chemin_vers_le_fichier = os.path.join(TestDéchiffre.chemin_vers_les_données_diamant, fichier)
            assert not pd.read_csv(chemin_vers_le_fichier).empty

    def test_efface_les_fichiers_existants_du_dossier_cible_puis_déchiffre_les_fichiers(self) -> None:
        # Given
        with open(
                os.path.join(TestDéchiffre.chemin_vers_les_données_diamant, 'fichier_préexistant.csv'),
                'w',
                encoding="utf-8"
        ) as fichier:
            fichier.write('données')
        assert len(os.listdir(TestDéchiffre.chemin_vers_les_données_diamant)) == 1

        # When
        déchiffre(TestDéchiffre.chemin_vers_les_données_diamant_chiffrées,
                  TestDéchiffre.chemin_vers_les_données_diamant,
                  logger=MagicMock(),
                  executable_gpg='/usr/local/bin/gpg')

        # Then
        nombre_de_fichier_chiffrés = len(os.listdir(TestDéchiffre.chemin_vers_les_données_diamant_chiffrées))
        fichiers_déchiffrés = os.listdir(TestDéchiffre.chemin_vers_les_données_diamant)
        assert len(fichiers_déchiffrés) == nombre_de_fichier_chiffrés

    def test_informe_l_utilisateur_quand_sa_clef_privée_ne_match_pas_celle_utilisée_pour_chiffrer(
            self,
            caplog: LogCaptureFixture
    ) -> None:
        # Given
        logger = crée_le_logger()

        mock_vérifie_la_clef = MagicMock()
        mock_vérifie_la_clef.return_value = False

        # When
        déchiffre(
            TestDéchiffre.chemin_vers_les_données_diamant_chiffrées,
            TestDéchiffre.chemin_vers_les_données_diamant,
            logger=logger,
            executable_gpg="/usr/local/bin/gpg",
            vérifie_la_clef=mock_vérifie_la_clef
        )

        # Then
        fichiers_déchiffrés = os.listdir(TestDéchiffre.chemin_vers_les_données_diamant)
        assert len(fichiers_déchiffrés) == 0

        logs = [log for log in caplog.records
                if log.levelname == 'ERROR' and
                "La clef privée fournie ne peut pas déchiffrer le fichier" in log.message]
        assert len(logs) == len(os.listdir(TestDéchiffre.chemin_vers_les_données_diamant_chiffrées))

    def test_informe_l_utilisateur_quand_il_y_a_une_erreur_dans_l_exécution_de_la_commande(self,
                                                                                           caplog: LogCaptureFixture) -> None:
        # Given
        logger = crée_le_logger()
        mock_vérifie_la_clef = MagicMock()
        mock_vérifie_la_clef.return_value = True
        mock_exécute = MagicMock()
        mock_process = MagicMock()
        mock_exécute.return_value = mock_process
        code_d_erreur_commande_gpg = 2
        mock_process.returncode = code_d_erreur_commande_gpg
        mock_process.stderr = b'utilisation\xc2\xa0: gpg [options] --decrypt [filename]\n'

        # When
        déchiffre(
            TestDéchiffre.chemin_vers_les_données_diamant_chiffrées,
            TestDéchiffre.chemin_vers_les_données_diamant,
            logger=logger,
            executable_gpg="/usr/local/bin/gpg",
            vérifie_la_clef=mock_vérifie_la_clef,
            exécute_une_commande=mock_exécute,
        )

        # Then
        fichiers_déchiffrés = os.listdir(TestDéchiffre.chemin_vers_les_données_diamant)
        assert len(fichiers_déchiffrés) == 0

        logs_d_erreur = [
            log for log in caplog.records
            if log.levelname == "ERROR"
               and log.message == "utilisation\xa0: gpg [options] --decrypt [filename]"
        ]
        assert len(logs_d_erreur) == len(os.listdir(TestDéchiffre.chemin_vers_les_données_diamant_chiffrées))
        for fichier in os.listdir(TestDéchiffre.chemin_vers_les_données_diamant_chiffrées):
            assert f"Fichier {fichier} déchiffré" not in [log.message for log in caplog.records]


class TestVérifieQuOnALaClefPourDechiffrer:
    def test_retourne_true_lorsque_la_clef_est_connue(self) -> None:
        # Given
        executable_gpg = "/usr/local/bin/gpg"
        fichier_chiffré = "chemin/vers/le/fichier.gpg"
        exécute_une_commande = MagicMock()
        id_de_la_clef_utilisée_pour_chiffrer_le_fichier = MagicMock(
            stdout=b':pubkey enc packet: version 3, algo 1, keyid AF4238B8FD15301E\n')
        clef_connue_par_gpg = MagicMock(stdout=b'ssb   rsa2048/AF4238B8FD15301E 2022-09-28 [E]\n')
        exécute_une_commande.side_effect = [id_de_la_clef_utilisée_pour_chiffrer_le_fichier, clef_connue_par_gpg]

        # When
        la_clef_est_connue = _vérifie_la_clef(executable_gpg, fichier_chiffré, exécute_une_commande)

        # Then
        assert la_clef_est_connue is True

    def test_retourne_false_lorsque_la_clef_n_est_pas_connue(self) -> None:
        # Given
        executable_gpg = "/usr/local/bin/gpg"
        fichier_chiffré = "chemin/vers/le/fichier.gpg"
        exécute_une_commande = MagicMock()
        id_de_la_clef_utilisée_pour_chiffrer_le_fichier = MagicMock(
            stdout=b':pubkey enc packet: version 3, algo 1, keyid CD4235E8FD15301E\n')
        clef_inconue_par_gpg = MagicMock(stdout=b'')
        exécute_une_commande.side_effect = [id_de_la_clef_utilisée_pour_chiffrer_le_fichier, clef_inconue_par_gpg]

        # When
        la_clef_est_connue = _vérifie_la_clef(executable_gpg, fichier_chiffré, exécute_une_commande)

        # Then
        assert la_clef_est_connue is False
