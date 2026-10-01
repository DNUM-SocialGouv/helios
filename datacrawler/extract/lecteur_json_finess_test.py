import json
from pathlib import Path

import pandas as pd

from datacrawler.extract.lecteur_json_finess import lis_les_entites_juridiques_json_finess
from datacrawler.test_helpers import mocked_logger


def test_lis_les_entites_juridiques_json_finess_normalise_les_telephones(tmp_path: Path) -> None:
    chemin_du_fichier = tmp_path / "finess-structures-journalier-20260929.json"
    chemin_du_fichier.write_text(json.dumps({
        "pmej": [
            _pmej("010000001", "02.51.54.30.38"),
            _pmej("010000002", "00565443110"),
            _pmej("010000003", "04935353000"),
        ],
    }), encoding="utf-8")

    entites_juridiques = lis_les_entites_juridiques_json_finess(mocked_logger, str(chemin_du_fichier))

    pd.testing.assert_series_equal(
        entites_juridiques["telephone"],
        pd.Series(["0251543038", "0565443110", None], name="telephone"),
    )


def _pmej(numero_finess: str, telephone: str) -> dict:
    return {
        "informationsGeneralesPMEJ": {
            "dateCreation": "2009-01-01",
            "dateFermeture": None,
            "denominationLonguePmSmsse": "ENTITE JURIDIQUE",
            "denominationPm": "ENTITE JURIDIQUE",
            "numFinessPm": numero_finess,
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
        "contact": [{"telecom": {"telephone": telephone}}],
        "ege": [],
    }
