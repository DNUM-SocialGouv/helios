from datetime import datetime
from pathlib import Path
from unittest.mock import MagicMock, patch

import ftputil.error

from datacrawler.download_hapi_data import list_hapi_files, main


def _make_ftp_host_mock(listdir_return: list[str]) -> MagicMock:
    """Helper: build a MagicMock FTPHost whose listdir() returns the given list."""
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
        # Given
        current_year = datetime.now().year
        older = f"{current_year}_engagements_exporter_{current_year}0101.csv"
        newer = f"{current_year}_engagements_exporter_{current_year}0301.csv"
        mock_ftp_host = MagicMock()
        mock_ftp_host.listdir.return_value = [older, newer]

        # When
        result = list_hapi_files(mock_ftp_host, "/some/path")

        # Then
        assert len(result) == 1
        assert result[0] == newer

    def test_returns_one_file_per_year_for_last_5_years(self) -> None:
        # Given
        current_year = datetime.now().year
        files = [f"{current_year - i}_engagements_exporter_{current_year - i}0101.csv" for i in range(5)]
        mock_ftp_host = MagicMock()
        mock_ftp_host.listdir.return_value = files

        # When
        result = list_hapi_files(mock_ftp_host, "/some/path")

        # Then
        assert len(result) == 5
        for filename in files:
            assert filename in result

    def test_ignores_files_outside_5_year_window(self) -> None:
        # Given
        current_year = datetime.now().year
        too_old = f"{current_year - 5}_engagements_exporter_{current_year - 5}0101.csv"
        future = f"{current_year + 1}_engagements_exporter_{current_year + 1}0101.csv"
        valid = f"{current_year}_engagements_exporter_{current_year}0101.csv"
        mock_ftp_host = MagicMock()
        mock_ftp_host.listdir.return_value = [too_old, future, valid]

        # When
        result = list_hapi_files(mock_ftp_host, "/some/path")

        # Then
        assert result == [valid]

    def test_ignores_non_matching_filenames(self) -> None:
        # Given
        current_year = datetime.now().year
        non_matching = [
            "README.txt",
            f"other_{current_year}_file.csv",
            f"{current_year}_engagements_exporter_BADDATE.csv",
            "",
        ]
        mock_ftp_host = MagicMock()
        mock_ftp_host.listdir.return_value = non_matching

        # When
        result = list_hapi_files(mock_ftp_host, "/some/path")

        # Then
        assert result == []

    def test_returns_empty_list_when_no_matching_files(self) -> None:
        # Given
        mock_ftp_host = MagicMock()
        mock_ftp_host.listdir.return_value = ["other.csv", "archive.zip"]

        # When
        result = list_hapi_files(mock_ftp_host, "/some/path")

        # Then
        assert result == []


class TestMain:
    def test_downloads_files_successfully(self, tmp_path: Path) -> None:
        # Given
        current_year = datetime.now().year
        file1 = f"{current_year}_engagements_exporter_{current_year}0101.csv"
        file2 = f"{current_year - 1}_engagements_exporter_{current_year - 1}0101.csv"

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
            # When
            main()

        # Then
        assert mock_ftp_host.download.call_count == 2
        mock_logger.warning.assert_not_called()
        mock_logger.exception.assert_not_called()

    def test_logs_warning_when_no_files_found(self, tmp_path: Path) -> None:
        # Given
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
            # When
            main()

        # Then
        mock_logger.warning.assert_called_once()
        mock_ftp_host.download.assert_not_called()

    def test_logs_exception_on_connection_error(self, tmp_path: Path) -> None:
        # Given
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
            # When
            main()

        # Then
        mock_logger.exception.assert_called_once()

    def test_logs_exception_on_list_error(self, tmp_path: Path) -> None:
        # Given
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
            # When
            main()

        # Then
        mock_logger.exception.assert_called_once()
        mock_ftp_host.download.assert_not_called()

    def test_stops_on_first_download_error(self, tmp_path: Path) -> None:
        # Given
        current_year = datetime.now().year
        file1 = f"{current_year}_engagements_exporter_{current_year}0101.csv"
        file2 = f"{current_year - 1}_engagements_exporter_{current_year - 1}0101.csv"

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
            # When
            main()

        # Then
        mock_logger.exception.assert_called_once()
        assert mock_ftp_host.download.call_count == 1
