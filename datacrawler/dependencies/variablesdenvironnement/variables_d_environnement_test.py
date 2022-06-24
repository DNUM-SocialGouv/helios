from datacrawler.dependencies.logger import crée_le_logger
from datacrawler.dependencies.variablesdenvironnement import lis_les_variables_d_environnement
from pytest import LogCaptureFixture
from pytest_mock import MockerFixture


def test_retourne_la_valeur_définie_dans_l_environnement(mocker: MockerFixture):
    # GIVEN
    logger = crée_le_logger()
    mocker.patch("datacrawler.dependencies.variablesdenvironnement.os.environ", {"SENTRY_DSN": "test"})

    # WHEN
    variables_d_environnement = lis_les_variables_d_environnement(logger)

    # THEN
    assert variables_d_environnement["SENTRY_DSN"] == "test"


def test_retourne_une_phrase_explicite_quand_la_valeur_n_est_pas_dans_l_environnement(mocker: MockerFixture, caplog: LogCaptureFixture):
    # GIVEN
    logger = crée_le_logger()
    mocker.patch("datacrawler.dependencies.variablesdenvironnement.os.environ", {})

    # WHEN
    lis_les_variables_d_environnement(logger)

    # THEN
    log = caplog.records.pop()
    assert log.message == '----- WARNING ----- La variable d’environnement "SENTRY_DSN" est manquante.'
