from pathlib import Path
import json
from unittest.mock import MagicMock, patch

import pandas as pd

from datacrawler.import_les_etablissements_territoriaux_depuis_json_finess import import_etablissements_territoriaux_depuis_json_finess
from datacrawler.load.nom_des_tables import TABLE_ETABLISSEMENTS_TERRITORIAUX, TABLE_ENTITES_JURIDIQUES
from datacrawler.test_helpers import base_de_données_test, mocked_logger, supprime_les_données_des_tables
from datacrawler.test_helpers.helios_builder import helios_entite_juridique_builder, helios_etablissement_territorial_builder


class TestSauvegardeLesEtablissementsTerritoriauxDepuisJsonFiness:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_import_etablissements_territoriaux_depuis_json_finess(self, tmp_path: Path) -> None:
        et_json = tmp_path / "finess-structures-journalier-20260929.json"
        et_json.write_text(json.dumps({
            "schemaVersion": "1.0.0",
            "generatedAt": "2026-09-29T00:00:00.000000000Z",
            "pmej": [{
                "informationsGeneralesPMEJ": {
                    "numFinessPm": "010008407",
                },
                "ege": [{
                    "informationsGeneralesEGE": {
                        "dateFermeture": None,
                        "dateOuverture": "1956-11-16",
                        "nomEgeCourt": "CLINIQUE CONVERT",
                        "nomEgeLong": "CLINIQUE DOCTEUR CONVERT",
                        "numFinessEge": "010780195",
                        "siret": "77220148900022",
                    },
                    "categorieentiteGeographiqueExercice": "365",
                    "modefixationtarifaire": "07",
                    "adresse": [{
                        "numeroVoie": "62",
                        "typeVoie": "AV",
                        "libelleVoie": "DE JASSERON",
                        "cogCommune": "01053",
                        "ligneAcheminement": "BOURG EN BRESSE",
                    }],
                    "contact": [{"telecom": {"telephone": "0428631234", "courriel": "contact@test.fr"}}],
                    "etatObjet": "A",
                }, {
                    "informationsGeneralesEGE": {
                        "dateFermeture": None,
                        "dateOuverture": "1956-11-16",
                        "nomEgeCourt": "ECOLE TEST",
                        "nomEgeLong": "ECOLE TEST LONG",
                        "numFinessEge": "010780196",
                        "siret": "77220148900024",
                    },
                    "categorieentiteGeographiqueExercice": "601",
                    "modefixationtarifaire": "07",
                    "adresse": [{
                        "numeroVoie": "63",
                        "typeVoie": "AV",
                        "libelleVoie": "DE JASSERON",
                        "cogCommune": "01053",
                        "ligneAcheminement": "BOURG EN BRESSE",
                    }],
                    "contact": [{"telecom": {"telephone": "0428631235", "courriel": "ecole@test.fr"}}],
                    "etatObjet": "A",
                }, {
                    "informationsGeneralesEGE": {
                        "dateFermeture": "2026-01-01",
                        "dateOuverture": "1956-11-16",
                        "nomEgeCourt": "ET FERME",
                        "nomEgeLong": "ET FERME",
                        "numFinessEge": "010000999",
                        "siret": "77220148900023",
                    },
                    "categorieentiteGeographiqueExercice": "365",
                    "adresse": [],
                    "contact": [],
                    "etatObjet": "I",
                }],
            }],
        }), encoding="utf-8")
        entite_juridique = pd.DataFrame([helios_entite_juridique_builder()])
        with base_de_données_test.begin() as connection:
            entite_juridique.to_sql(TABLE_ENTITES_JURIDIQUES, connection, if_exists="append", index=False)
        reponse_codesystem = MagicMock()
        reponse_codesystem.json.return_value = {
            "concept": [
                {"code": "365", "property": [{"code": "parent", "valueCode": "3000"}]},
                {"code": "601", "property": [{"code": "parent", "valueCode": "6000"}]},
                {"code": "3000"},
                {"code": "6000"},
            ]
        }
        with patch(
            "datacrawler.import_les_etablissements_territoriaux_depuis_json_finess.requests.get",
            return_value=reponse_codesystem,
        ) as recupere_la_nomenclature, patch(
            "datacrawler.import_les_etablissements_territoriaux_depuis_json_finess.recupere_le_referentiel_departement_region_de_la_base",
            return_value=pd.DataFrame([
                {
                    "ref_code_cog": "01053",
                    "ref_libelle_commune": "Bourg-en-Bresse",
                    "ref_code_dep": "01",
                    "ref_libelle_dep": "Ain",
                    "ref_code_region": "84",
                }
            ]),
        ):
            import_etablissements_territoriaux_depuis_json_finess(str(et_json), base_de_données_test, "https://example.test/tre-r397", mocked_logger)

        recupere_la_nomenclature.assert_called_once_with(
            "https://example.test/tre-r397",
            headers={"Accept": "application/fhir+json"},
            timeout=30,
        )

        etablissements_territoriaux_attendus = pd.DataFrame([
            helios_etablissement_territorial_builder({
                "adresse_acheminement": "BOURG EN BRESSE",
                "adresse_numero_voie": "62",
                "adresse_type_voie": "AV",
                "adresse_voie": "DE JASSERON",
                "cat_etablissement": "365",
                "code_mode_tarification": "07",
                "commune": "BOURG EN BRESSE",
                "courriel": "contact@test.fr",
                "departement": "AIN",
                "domaine": "Sanitaire",
                "libelle_categorie_etablissement": "",
                "libelle_court_categorie_etablissement": "",
                "libelle_du_mode_tarification": "",
                "numero_finess_etablissement_territorial": "010780195",
                "raison_sociale": "CLINIQUE DOCTEUR CONVERT",
                "raison_sociale_courte": "CLINIQUE CONVERT",
                "siret": "77220148900022",
                "telephone": "0428631234",
                "date_ouverture": "1956-11-16",
                "type_etablissement": "",
            }),
            helios_etablissement_territorial_builder({
                "adresse_acheminement": "BOURG EN BRESSE",
                "adresse_numero_voie": "63",
                "adresse_type_voie": "AV",
                "adresse_voie": "DE JASSERON",
                "cat_etablissement": "601",
                "code_mode_tarification": "07",
                "commune": "BOURG EN BRESSE",
                "courriel": "ecole@test.fr",
                "departement": "AIN",
                "domaine": "Médico-social",
                "libelle_categorie_etablissement": "",
                "libelle_court_categorie_etablissement": "",
                "libelle_du_mode_tarification": "",
                "numero_finess_etablissement_territorial": "010780196",
                "raison_sociale": "ECOLE TEST LONG",
                "raison_sociale_courte": "ECOLE TEST",
                "siret": "77220148900024",
                "telephone": "0428631235",
                "date_ouverture": "1956-11-16",
                "type_etablissement": "",
            })
        ])
        etablissements_territoriaux_sauvegardes = pd.read_sql(TABLE_ETABLISSEMENTS_TERRITORIAUX, base_de_données_test)
        etablissements_territoriaux_sauvegardes = etablissements_territoriaux_sauvegardes.drop("termes_de_recherche", axis=1)
        pd.testing.assert_frame_equal(
            etablissements_territoriaux_attendus.sort_index(axis=1),
            etablissements_territoriaux_sauvegardes.sort_index(axis=1),
            check_dtype=False,
        )
