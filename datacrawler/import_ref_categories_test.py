from unittest.mock import patch

from sqlalchemy import create_engine

from datacrawler.import_ref_categories import import_ref_categories
from datacrawler.test_helpers import mocked_logger


def test_import_ref_categories_depuis_le_codesystem_smt() -> None:
    base_de_donnees = create_engine("sqlite://")
    categories = {
        "1000": {
            "libelle": "Etablissements Relevant de la Loi Hospitalière",
            "libelle_court": "Etab.Loi Hospital.",
            "domaine": "SAN",
        },
        "365": {
            "libelle": "Clinique",
            "libelle_court": "Cli.",
            "domaine": "SAN",
        },
        "601": {
            "libelle": "Ecole de formation",
            "libelle_court": "Ecole form.",
            "domaine": "ENS",
        },
    }

    with patch(
        "datacrawler.import_ref_categories._récupère_les_categories_entite_geographique_exercice",
        return_value=categories,
    ) as recupere_les_categories, patch(
        "datacrawler.import_ref_categories.écrase_et_sauvegarde_les_données_avec_leur_date_de_mise_à_jour",
    ) as sauvegarde:
        import_ref_categories("https://example.test/tre-r397", base_de_donnees, mocked_logger)

    recupere_les_categories.assert_called_once_with("https://example.test/tre-r397")
    categories_sauvegardees = sauvegarde.call_args.kwargs["données"]

    assert categories_sauvegardees.to_dict("index") == {
        "365": {
            "libelle": "Clinique",
            "libelle_court": "Cli.",
            "domaine": "Sanitaire",
        },
        "601": {
            "libelle": "Ecole de formation",
            "libelle_court": "Ecole form.",
            "domaine": "Médico-social",
        },
    }
