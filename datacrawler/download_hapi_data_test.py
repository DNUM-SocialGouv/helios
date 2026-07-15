from datetime import datetime
from pathlib import Path
from unittest.mock import MagicMock, patch

import ftputil.error

from datacrawler.download_hapi_data import list_hapi_files, main


def _make_ftp_host_mock(listdir_return: list[str]) -> MagicMock:
    mock_ftp_host = MagicMock()
    mock_ftp_host.__enter__ = MagicMock(return_value=mock_ftp_host)
    mock_ftp_host.__exit__ = MagicMock(return_value=False)
    mock_ftp_host.listdir.return_value = listdir_return
    return mock_ftp_host


def _env_vars(tmp_path: Path) -> dict[str, str]:
    return {
        "HAPI_FTPS_HOST": "ftp.example.com",
        "HAPI_FTPS_PORT": "990",
        "HAPI_FTPS_USERNAME": "user",
        "HAPI_FTPS_PASSWORD": "pass",
        "HAPI_DATA_PATH": str(tmp_path),
    }


class TestListHapiFiles:
    def test_returns_most_recent_file_per_year(self) -> None:
        current_year = datetime.now().year
        older = f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year}_{current_year}0101000000.csv"
        newer = f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year}_{current_year}0301000000.csv"
        mock_ftp_host = MagicMock()
        mock_ftp_host.listdir.return_value = [older, newer]

        result = list_hapi_files(mock_ftp_host, "/some/path")

        assert len(result) == 1
        assert result[0] == newer

    def test_returns_one_file_per_year_for_last_5_years(self) -> None:
        current_year = datetime.now().year
        files = [f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year - i}_{current_year - i}0101000000.csv" for i in range(5)]
        mock_ftp_host = MagicMock()
        mock_ftp_host.listdir.return_value = files

        result = list_hapi_files(mock_ftp_host, "/some/path")

        assert len(result) == 5
        for filename in files:
            assert filename in result

    def test_ignores_files_outside_5_year_window(self) -> None:
        current_year = datetime.now().year
        too_old = f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year - 5}_{current_year - 5}0101000000.csv"
        future = f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year + 1}_{current_year + 1}0101000000.csv"
        valid = f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year}_{current_year}0101000000.csv"
        mock_ftp_host = MagicMock()
        mock_ftp_host.listdir.return_value = [too_old, future, valid]

        result = list_hapi_files(mock_ftp_host, "/some/path")

        assert result == [valid]

    def test_ignores_non_matching_filenames(self) -> None:
        current_year = datetime.now().year
        non_matching = [
            "README.txt",
            f"other_{current_year}_file.csv",
            f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year}_BADDATE.csv",
            "",
        ]
        mock_ftp_host = MagicMock()
        mock_ftp_host.listdir.return_value = non_matching

        result = list_hapi_files(mock_ftp_host, "/some/path")

        assert result == []

    def test_returns_empty_list_when_no_matching_files(self) -> None:
        mock_ftp_host = MagicMock()
        mock_ftp_host.listdir.return_value = ["other.csv", "archive.zip"]

        result = list_hapi_files(mock_ftp_host, "/some/path")

        assert result == []


class TestMain:
    def test_downloads_files_successfully(self, tmp_path: Path) -> None:
        current_year = datetime.now().year
        file1 = f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year}_{current_year}0101000000.csv"
        file2 = f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year - 1}_{current_year - 1}0101000000.csv"

        mock_logger = MagicMock()
        mock_ftp_host = _make_ftp_host_mock([file1, file2])

        with (
            patch(
                "datacrawler.download_hapi_data.initialise_les_dépendances",
                return_value=(mock_logger, _env_vars(tmp_path)),
            ),
            patch("ftputil.FTPHost", return_value=mock_ftp_host),
            patch("datacrawler.download_hapi_data._make_session_factory"),
        ):
            main()

        assert mock_ftp_host.download.call_count == 2
        mock_logger.warning.assert_not_called()
        mock_logger.exception.assert_not_called()

    def test_logs_warning_when_no_files_found(self, tmp_path: Path) -> None:
        mock_logger = MagicMock()
        mock_ftp_host = _make_ftp_host_mock(["README.txt"])

        with (
            patch(
                "datacrawler.download_hapi_data.initialise_les_dépendances",
                return_value=(mock_logger, _env_vars(tmp_path)),
            ),
            patch("ftputil.FTPHost", return_value=mock_ftp_host),
            patch("datacrawler.download_hapi_data._make_session_factory"),
        ):
            main()

        mock_logger.warning.assert_called_once()
        mock_ftp_host.download.assert_not_called()

    def test_logs_exception_on_connection_error(self, tmp_path: Path) -> None:
        mock_logger = MagicMock()

        with (
            patch(
                "datacrawler.download_hapi_data.initialise_les_dépendances",
                return_value=(mock_logger, _env_vars(tmp_path)),
            ),
            patch(
                "ftputil.FTPHost",
                side_effect=ftputil.error.FTPError("connection refused"),
            ),
            patch("datacrawler.download_hapi_data._make_session_factory"),
        ):
            main()

        mock_logger.exception.assert_called_once()

    def test_logs_exception_on_list_error(self, tmp_path: Path) -> None:
        mock_logger = MagicMock()
        mock_ftp_host = MagicMock()
        mock_ftp_host.__enter__ = MagicMock(return_value=mock_ftp_host)
        mock_ftp_host.__exit__ = MagicMock(return_value=False)
        mock_ftp_host.listdir.side_effect = ftputil.error.FTPError("listing failed")

        with (
            patch(
                "datacrawler.download_hapi_data.initialise_les_dépendances",
                return_value=(mock_logger, _env_vars(tmp_path)),
            ),
            patch("ftputil.FTPHost", return_value=mock_ftp_host),
            patch("datacrawler.download_hapi_data._make_session_factory"),
        ):
            main()

        mock_logger.exception.assert_called_once()
        mock_ftp_host.download.assert_not_called()

    def test_stops_on_first_download_error(self, tmp_path: Path) -> None:
        current_year = datetime.now().year
        file1 = f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year}_{current_year}0101000000.csv"
        file2 = f"ENGAGEMENTS_PAR_BENEFICIAIRE_{current_year - 1}_{current_year - 1}0101000000.csv"

        mock_logger = MagicMock()
        mock_ftp_host = _make_ftp_host_mock([file1, file2])
        mock_ftp_host.download.side_effect = ftputil.error.FTPError("download failed")

        with (
            patch(
                "datacrawler.download_hapi_data.initialise_les_dépendances",
                return_value=(mock_logger, _env_vars(tmp_path)),
            ),
            patch("ftputil.FTPHost", return_value=mock_ftp_host),
            patch("datacrawler.download_hapi_data._make_session_factory"),
        ):
            main()

        mock_logger.exception.assert_called_once()
        assert mock_ftp_host.download.call_count == 1
