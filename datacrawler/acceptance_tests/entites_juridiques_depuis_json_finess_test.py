from pathlib import Path
import json

import pandas as pd

from datacrawler.import_les_entites_juridiques_depuis_json_finess import import_entites_juridiques_depuis_json_finess
from datacrawler.load.nom_des_tables import TABLE_ENTITES_JURIDIQUES
from datacrawler.test_helpers import base_de_données_test, mocked_logger, supprime_les_données_des_tables
from datacrawler.test_helpers.helios_builder import helios_entite_juridique_builder


class TestSauvegardeLesEntitesJuridiquesDepuisJsonFiness:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_import_entites_juridiques_depuis_json_finess(self, tmp_path: Path) -> None:
        ej_json = tmp_path / "finess-structures-journalier-20260929.json"
        ej_json.write_text(json.dumps({
            "schemaVersion": "1.0.0",
            "generatedAt": "2026-09-29T00:00:00.000000000Z",
            "pmej": [{
                "informationsGeneralesPMEJ": {
                    "dateCreation": "2009-01-01",
                    "dateFermeture": None,
                    "denominationLonguePmSmsse": "MAISON DE RETRAITE - DIVONNE-LES-BAINS",
                    "denominationPm": "MAISON DE RETRAITE - DIVONNE-LES-BAINS",
                    "numFinessPm": "010008407",
                    "siren": "260214644",
                    "statutJuridique": "14",
                },
                "adresse": [{
                    "numeroVoie": "240",
                    "typeVoie": "R",
                    "libelleVoie": "GUY DE MAUPASSANT",
                    "cogCommune": "01283",
                    "ligneAcheminement": "DIVONNE LES BAINS",
                }],
                "contact": [{"telecom": {"telephone": "0450201235"}}],
                "ege": [],
            }],
        }), encoding="utf-8")
        import_entites_juridiques_depuis_json_finess(str(ej_json), base_de_données_test, mocked_logger)

        entites_juridiques_attendues = pd.DataFrame([helios_entite_juridique_builder({
            "adresse_acheminement": "DIVONNE LES BAINS",
            "categorisation": float("nan"),
            "code_region": "",
            "commune": "",
            "departement": "",
            "libelle_statut_juridique": "14",
        })])
        entites_juridiques_sauvegardees = pd.read_sql(TABLE_ENTITES_JURIDIQUES, base_de_données_test)
        entites_juridiques_sauvegardees = entites_juridiques_sauvegardees.drop("termes_de_recherche", axis=1)
        pd.testing.assert_frame_equal(
            entites_juridiques_attendues.sort_index(axis=1),
            entites_juridiques_sauvegardees.sort_index(axis=1),
            check_dtype=False,
        )
