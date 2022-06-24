from datacrawler.dependencies.dotenv import dot_env_config
from pytest_mock import MockerFixture


def test_charge_les_fichiers_env_et_env_local(mocker: MockerFixture):
    # GIVEN
    mock_load_dotenv = mocker.patch("datacrawler.dependencies.dotenv.load_dotenv")

    # WHEN
    dot_env_config()

    # THEN
    assert mock_load_dotenv.call_count == 2
