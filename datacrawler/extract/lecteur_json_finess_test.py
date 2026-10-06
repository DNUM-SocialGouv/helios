import json
from pathlib import Path

import pandas as pd

from datacrawler.extract.lecteur_json_finess import lis_les_entites_juridiques_json_finess, lis_les_etablissements_territoriaux_json_finess
from datacrawler.test_helpers import mocked_logger


def test_lis_les_entites_juridiques_json_finess(tmp_path: Path) -> None:
    chemin_du_fichier = tmp_path / "finess-structures-journalier-20260929.json"
    chemin_du_fichier.write_text(
        json.dumps(
            {
                "pmej": [
                    _pmej("010000001", "02.51.54.30.38"),
                    _pmej("010000002", "00565443110"),
                    _pmej("010000003", "04935353000"),
                ],
            }
        ),
        encoding="utf-8",
    )

    entites_juridiques = lis_les_entites_juridiques_json_finess(mocked_logger, str(chemin_du_fichier))

    pd.testing.assert_series_equal(
        entites_juridiques["telephone"],
        pd.Series(["02.51.54.30.38", "00565443110", "04935353000"], name="telephone"),
    )
    pd.testing.assert_series_equal(
        entites_juridiques["cogCommune"],
        pd.Series(["01283", "01283", "01283"], name="cogCommune"),
    )


def test_lis_les_etablissements_territoriaux_json_finess(tmp_path: Path) -> None:
    chemin_du_fichier = tmp_path / "finess-structures-journalier-20260929.json"
    chemin_du_fichier.write_text(
        json.dumps(
            {
                "pmej": [
                    {
                        "informationsGeneralesPMEJ": {"numFinessPm": "010008407"},
                        "ege": [
                            {
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
                                "adresse": [
                                    {
                                        "numeroVoie": "62",
                                        "typeVoie": "AV",
                                        "libelleVoie": "DE JASSERON",
                                        "cogCommune": "01053",
                                        "ligneAcheminement": "BOURG EN BRESSE",
                                    }
                                ],
                                "contact": [{"telecom": {"telephone": "0428631234", "courriel": "contact@test.fr"}}],
                                "etatObjet": "A",
                            }
                        ],
                    }
                ],
            }
        ),
        encoding="utf-8",
    )

    etablissements_territoriaux = lis_les_etablissements_territoriaux_json_finess(mocked_logger, str(chemin_du_fichier))

    pd.testing.assert_frame_equal(
        etablissements_territoriaux,
        pd.DataFrame([
            {
                "categetab": "365",
                "cogCommune": "01053",
                "codemft": "07",
                "courriel": "contact@test.fr",
                "datefermeture": None,
                "dateouv": "1956-11-16",
                "etatObjet": "A",
                "ligneacheminement": "BOURG EN BRESSE",
                "nofinessej": "010008407",
                "nofinesset": "010780195",
                "nofinessppal": "",
                "numvoie": "62",
                "rs": "CLINIQUE CONVERT",
                "rslongue": "CLINIQUE DOCTEUR CONVERT",
                "siret": "77220148900022",
                "telephone": "0428631234",
                "typeet": "",
                "typvoie": "AV",
                "voie": "DE JASSERON",
            }
        ]),
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
        "adresse": [
            {
                "numeroVoie": "240",
                "typeVoie": "R",
                "libelleVoie": "GUY DE MAUPASSANT",
                "cogCommune": "01283",
                "ligneAcheminement": "DIVONNE LES BAINS",
            }
        ],
        "contact": [{"telecom": {"telephone": telephone}}],
        "ege": [],
    }
