from unittest.mock import MagicMock

import pandas as pd

from datacrawler.extract.extrais_la_date_du_nom_de_fichier import (
    extrais_la_date_du_nom_de_fichier_engagements_hapi,
    extrais_l_annee_du_nom_de_fichier_engagements_hapi,
)
from datacrawler.transform.transforme_les_donnees_allocation_ressource.transforme_les_donnees_allocation_ressource import (
    transforme_les_donnees_engagements_ej,
    transforme_les_donnees_engagements_et,
)


def _make_donnees() -> pd.DataFrame:
    """Build a minimal DataFrame with the columns expected by the new transform functions."""
    return pd.DataFrame(
        {
            "ID Bénéficiaire (Finess ou Code interne)": ["123456789", "987654321", "111111111"],
            "Type de Bénéficiaire": ["Etablissement sanitaire", "Etablissement sanitaire", "Autre type"],
            "Campagne": [2026, 2026, 2026],
            "Enveloppe": ["FIR", "FIR", "FIR"],
            "Sous-Enveloppe": ["Sanitaire", "Sanitaire", "Sanitaire"],
            "Mode de délégation délégué": ["", "", ""],
            "Montant Notifié": [100.0, 200.0, 300.0],
        }
    )


def _make_finess_ej() -> pd.DataFrame:
    return pd.DataFrame({"numero_finess_entite_juridique": ["123456789"]})


def _make_finess_et() -> pd.DataFrame:
    return pd.DataFrame({"numero_finess_etablissement_territorial": ["987654321"]})


class TestTransformeLesDocumentsEngagementsEj:
    def test_filtre_uniquement_etablissement_sanitaire(self) -> None:
        # GIVEN
        donnees = _make_donnees()
        finess_ej = _make_finess_ej()
        logger = MagicMock()

        # WHEN
        result = transforme_les_donnees_engagements_ej(donnees, finess_ej, logger)

        # THEN — only "Etablissement sanitaire" rows that are also in finess_ej
        assert result.shape[0] == 1
        assert "123456789" in result.index.get_level_values("numero_finess_entite_juridique")

    def test_mode_delegation_force_a_test_wip(self) -> None:
        # GIVEN
        donnees = _make_donnees()
        finess_ej = _make_finess_ej()
        logger = MagicMock()

        # WHEN
        result = transforme_les_donnees_engagements_ej(donnees, finess_ej, logger)

        # THEN
        assert (result["mode_delegation"] == "Intervention (Ex. cour.)").all()

    def test_exclut_les_finess_inconnus(self) -> None:
        # GIVEN
        donnees = _make_donnees()
        finess_ej = pd.DataFrame({"numero_finess_entite_juridique": ["000000000"]})  # no match
        logger = MagicMock()

        # WHEN
        result = transforme_les_donnees_engagements_ej(donnees, finess_ej, logger)

        # THEN — no rows should remain
        assert result.empty

    def test_index_contient_numero_finess_et_annee(self) -> None:
        # GIVEN
        donnees = _make_donnees()
        finess_ej = _make_finess_ej()
        logger = MagicMock()

        # WHEN
        result = transforme_les_donnees_engagements_ej(donnees, finess_ej, logger)

        # THEN
        assert result.index.names == ["numero_finess_entite_juridique", "annee"]

    def test_colonne_type_beneficiaire_absente_du_resultat(self) -> None:
        # GIVEN
        donnees = _make_donnees()
        finess_ej = _make_finess_ej()
        logger = MagicMock()

        # WHEN
        result = transforme_les_donnees_engagements_ej(donnees, finess_ej, logger)

        # THEN
        assert "Type de Bénéficiaire" not in result.columns
        assert "type_beneficiaire" not in result.columns


class TestTransformeLesDocumentsEngagementsEt:
    def test_filtre_uniquement_etablissement_sanitaire(self) -> None:
        # GIVEN
        donnees = _make_donnees()
        finess_et = _make_finess_et()
        logger = MagicMock()

        # WHEN
        result = transforme_les_donnees_engagements_et(donnees, finess_et, logger)

        # THEN — only "Etablissement sanitaire" rows that are also in finess_et
        assert result.shape[0] == 1
        assert "987654321" in result.index.get_level_values("numero_finess_etablissement_territorial")

    def test_mode_delegation_force_a_test_wip(self) -> None:
        # GIVEN
        donnees = _make_donnees()
        finess_et = _make_finess_et()
        logger = MagicMock()

        # WHEN
        result = transforme_les_donnees_engagements_et(donnees, finess_et, logger)

        # THEN
        assert (result["mode_delegation"] == "Intervention (Ex. cour.)").all()

    def test_exclut_les_finess_inconnus(self) -> None:
        # GIVEN
        donnees = _make_donnees()
        finess_et = pd.DataFrame({"numero_finess_etablissement_territorial": ["000000000"]})  # no match
        logger = MagicMock()

        # WHEN
        result = transforme_les_donnees_engagements_et(donnees, finess_et, logger)

        # THEN
        assert result.empty

    def test_index_contient_numero_finess_et_annee(self) -> None:
        # GIVEN
        donnees = _make_donnees()
        finess_et = _make_finess_et()
        logger = MagicMock()

        # WHEN
        result = transforme_les_donnees_engagements_et(donnees, finess_et, logger)

        # THEN
        assert result.index.names == ["numero_finess_etablissement_territorial", "annee"]

    def test_colonne_type_beneficiaire_absente_du_resultat(self) -> None:
        # GIVEN
        donnees = _make_donnees()
        finess_et = _make_finess_et()
        logger = MagicMock()

        # WHEN
        result = transforme_les_donnees_engagements_et(donnees, finess_et, logger)

        # THEN
        assert "Type de Bénéficiaire" not in result.columns
        assert "type_beneficiaire" not in result.columns


class TestExtraisLaDateDuNomDeFichierEngagementsHapi:
    def test_extrait_la_date_depuis_le_nom_de_fichier(self) -> None:
        # GIVEN
        chemin = "/some/path/2026_engagements_exporter_20260318.csv"

        # WHEN
        date = extrais_la_date_du_nom_de_fichier_engagements_hapi(chemin)

        # THEN
        assert date == "20260318"

    def test_extrait_la_date_depuis_un_nom_sans_chemin(self) -> None:
        # GIVEN
        chemin = "2026_engagements_exporter_20261231.csv"

        # WHEN
        date = extrais_la_date_du_nom_de_fichier_engagements_hapi(chemin)

        # THEN
        assert date == "20261231"


class TestExtraisLAnnee:
    def test_retourne_l_annee_en_entier(self) -> None:
        # GIVEN
        chemin = "/data/2026_engagements_exporter_20260318.csv"

        # WHEN
        annee = extrais_l_annee_du_nom_de_fichier_engagements_hapi(chemin)

        # THEN
        assert annee == 2026
        assert isinstance(annee, int)

    def test_retourne_l_annee_differente(self) -> None:
        # GIVEN
        chemin = "/data/2027_engagements_exporter_20270515.csv"

        # WHEN
        annee = extrais_l_annee_du_nom_de_fichier_engagements_hapi(chemin)

        # THEN
        assert annee == 2027
