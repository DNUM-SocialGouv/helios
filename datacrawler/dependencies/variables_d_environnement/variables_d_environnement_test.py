from unittest.mock import MagicMock

from pytest import LogCaptureFixture

from datacrawler.dependencies.logger.logger import crée_le_logger
from datacrawler.dependencies.variables_d_environnement.variables_d_environnement import récupère_les_variables_d_environnement


class TestVariablesDEnvironnement:
    def test_retourne_la_valeur_définie_dans_le_fichier_d_environnement(self) -> None:
        # GIVEN
        logger = crée_le_logger()

        mock_variables_d_environnement: dict = {}

        mock_lis_les_variables_d_environnement_du_fichier = MagicMock()
        mock_lis_les_variables_d_environnement_du_fichier.return_value = {"SENTRY_DSN": "test", "SCALINGO_POSTGRESQL_ALCHEMY_URL": "test"}

        # WHEN
        variables_d_environnement = récupère_les_variables_d_environnement(
            logger, mock_variables_d_environnement, mock_lis_les_variables_d_environnement_du_fichier
        )

        # THEN
        assert variables_d_environnement["SENTRY_DSN"] == "test"

    def test_retourne_une_phrase_explicite_quand_la_valeur_n_est_pas_dans_l_environnement(self, caplog: LogCaptureFixture) -> None:
        # GIVEN
        logger = crée_le_logger()

        mock_variables_d_environnement: dict = {}

        mock_lis_les_variables_d_environnement_du_fichier = MagicMock()
        mock_lis_les_variables_d_environnement_du_fichier.return_value = {"SENTRY_DSN": "test", "DNUM_SFTP_LOCAL_PATH": "test"}

        # WHEN
        récupère_les_variables_d_environnement(logger, mock_variables_d_environnement, mock_lis_les_variables_d_environnement_du_fichier)

        # THEN
        log = caplog.records.pop()
        assert log.message == '----- WARNING ----- La variable d’environnement "SCALINGO_POSTGRESQL_ALCHEMY_URL" est manquante.'
