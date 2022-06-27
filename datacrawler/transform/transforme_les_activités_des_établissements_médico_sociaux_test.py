from unittest.mock import MagicMock

import pandas as pd
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import \
    transforme_les_activités_des_établissements_médico_sociaux


class TransformeLesActivitésDesÉtablissementsMédicoSociauxTest:
    def test_(self):
        # GIVEN
        chemin_du_fichier = 'chemin/vers_le.csv'
        lis_le_fichier_csv = MagicMock()
        données_diamant = pd.DataFrame(
            [
                {
            "Année": 2018,
            "Finess": "010001261",
            "Taux d'occupation des places autorisées en hébergement permanent": 0.99779299847793002,
            "Taux d'occupation des lits autorisés en hébergement temporaire": 0.93698630136986305,
            "Taux d'occupation des lits autorisés en accueil de jour": 0.48012820512820514
                }
            ]
        )
        lis_le_fichier_csv.return_value = données_diamant

        # WHEN
        données_transformées = transforme_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, lis_le_fichier_csv)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "année": 2018,
                    "numérofinessÉtablissementterritorial": "010001261",
                    "tauxOccupationHébergementPermanent": 0.99779299847793002,
                    "tauxOccupationHébergementTemporaire": 0.93698630136986305,
                    "tauxOccupationAccueilDeJour": 0.48012820512820514,
                }
            ],
        ).set_index(["année", "numérofinessÉtablissementterritorial"])
        pd.testing.assert_frame_equal(
            données_transformées,
            data_frame_attendu
        )
        colonnes_attendues = [
            "Taux d'occupation des places autorisées en hébergement permanent",
            "Taux d'occupation des lits autorisés en hébergement temporaire",
            "Taux d'occupation des lits autorisés en accueil de jour",
            "Finess",
            "Année",
        ]
        types_attendus = {
            "Finess": str,
            "Année": int,
            "Taux d'occupation des places autorisées en hébergement permanent": float,
            "Taux d'occupation des lits autorisés en hébergement temporaire": float,
            "Taux d'occupation des lits autorisés en accueil de jour": float,
        }
        lis_le_fichier_csv.assert_called_once_with(
            chemin_du_fichier,
            colonnes_attendues,
            types_attendus
        )