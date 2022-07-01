from unittest.mock import MagicMock, patch

import pandas as pd
import pandas.testing
import pytest
from numpy import NaN

import datacrawler
from datacrawler.ajoute_les_activités_des_établissements_médico_sociaux import ajoute_les_activités_des_établissements_médico_sociaux
from datacrawler.load.activités_des_établissements_médico_sociaux import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX
from datacrawler.test import (
    base_de_données_test,
    nettoie_la_base_de_données,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_activité_en_base,
    sauvegarde_une_entité_juridique_en_base,
)


class TestAjouteLesActivitesDesEtablissementsMedicoSociaux:
    def setup_method(self):
        nettoie_la_base_de_données(base_de_données_test)

    def test_sauvegarde_les_données_dans_une_base_de_données_vide(self):
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010786259", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010789717", "010008407", base_de_données_test)
        logger = MagicMock()

        # WHEN
        ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, base_de_données_test, logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            {
                "annee": [2018, 2019, 2020, 2018, 2019],
                "numero_finess_etablissement_territorial": ["010003598", "010003598", "010003598", "010786259", "010789717"],
                "taux_occupation_accueil_de_jour": [0.48012820512820514, 0.36153846153846153, 0.33974358974358976, 0.84863013698630141, NaN],
                "taux_occupation_en_hebergement_temporaire": [
                    0.93698630136986305,
                    0.25136612021857924,
                    0.75890410958904109,
                    1.0972602739726027,
                    0.81369863013698629,
                ],
                "taux_occupation_en_hebergement_permanent": [0.99779299847793002, 0.93245060949978986, 0.99023972602739729, 0.99532241897761442, NaN],
                "taux_realisation_activite": [NaN, NaN, NaN, NaN, NaN],
                "file_active_personnes_accompagnees": [NaN, NaN, NaN, NaN, NaN],
                "nombre_moyen_journees_absence_personnes_accompagnees": [NaN, NaN, NaN, NaN, NaN],
                "duree_moyenne_sejour_accompagnement_personnes_sorties": [NaN, NaN, NaN, NaN, NaN],
            }
        )

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pandas.testing.assert_frame_equal(data_frame, data_frame_attendu)

    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self):
        # GIVEN
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010786259", "010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010789717", "010008407", base_de_données_test)
        table_activité_existante = pd.DataFrame(
            {
                "annee": [2018, 2019],
                "numero_finess_etablissement_territorial": ["010003598", "010003598"],
                "taux_occupation_accueil_de_jour": [0.48012820512820514, NaN],
                "taux_occupation_en_hebergement_temporaire": [0.93698630136986305, NaN],
                "taux_occupation_en_hebergement_permanent": [0.99779299847793002, NaN],
                "taux_realisation_activite": [NaN, NaN],
                "file_active_personnes_accompagnees": [NaN, NaN],
                "nombre_moyen_journees_absence_personnes_accompagnees": [NaN, NaN],
                "duree_moyenne_sejour_accompagnement_personnes_sorties": [NaN, NaN],
            }
        )
        sauvegarde_une_activité_en_base(table_activité_existante, base_de_données_test)

        logger = MagicMock()

        # WHEN
        ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, base_de_données_test, logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            {
                "annee": [2018, 2019, 2020, 2018, 2019],
                "numero_finess_etablissement_territorial": ["010003598", "010003598", "010003598", "010786259", "010789717"],
                "taux_occupation_accueil_de_jour": [0.48012820512820514, 0.36153846153846153, 0.33974358974358976, 0.84863013698630141, NaN],
                "taux_occupation_en_hebergement_temporaire": [
                    0.93698630136986305,
                    0.25136612021857924,
                    0.75890410958904109,
                    1.0972602739726027,
                    0.81369863013698629,
                ],
                "taux_occupation_en_hebergement_permanent": [0.99779299847793002, 0.93245060949978986, 0.99023972602739729, 0.99532241897761442, NaN],
                "taux_realisation_activite": [NaN, NaN, NaN, NaN, NaN],
                "file_active_personnes_accompagnees": [NaN, NaN, NaN, NaN, NaN],
                "nombre_moyen_journees_absence_personnes_accompagnees": [NaN, NaN, NaN, NaN, NaN],
                "duree_moyenne_sejour_accompagnement_personnes_sorties": [NaN, NaN, NaN, NaN, NaN],
            }
        )

        data_frame = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pandas.testing.assert_frame_equal(data_frame, data_frame_attendu)

    @patch.object(datacrawler.ajoute_les_activités_des_établissements_médico_sociaux, "sauvegarde_les_activités_des_établissements_médico_sociaux")
    def test_revient_à_la_situation_initale_si_l_écriture_des_activités_échoue(self, mocked_sauvegarde_les_activités_des_établissements_médico_sociaux):
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("010008407", base_de_données_test)
        sauvegarde_un_établissement_en_base("010003598", "010008407", base_de_données_test)
        chemin_du_fichier = "data_set/diamant/ANN_ERRD_EJ_ET_2022_06_07.CSV"
        table_activité_existante = pd.DataFrame(
            {
                "annee": [2018, 2019],
                "numero_finess_etablissement_territorial": ["010003598", "010003598"],
                "taux_occupation_accueil_de_jour": [0.48012820512820514, NaN],
                "taux_occupation_en_hebergement_temporaire": [0.93698630136986305, NaN],
                "taux_occupation_en_hebergement_permanent": [0.99779299847793002, NaN],
                "taux_realisation_activite": [NaN, NaN],
                "file_active_personnes_accompagnees": [NaN, NaN],
                "nombre_moyen_journees_absence_personnes_accompagnees": [NaN, NaN],
                "duree_moyenne_sejour_accompagnement_personnes_sorties": [NaN, NaN],
            }
        )
        sauvegarde_une_activité_en_base(table_activité_existante, base_de_données_test)

        logger = MagicMock()

        mocked_sauvegarde_les_activités_des_établissements_médico_sociaux.side_effect = ValueError()

        # WHEN
        with pytest.raises(ValueError):
            ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, base_de_données_test, logger)

        # THEN
        table_activité = pd.read_sql_table(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, base_de_données_test)

        pandas.testing.assert_frame_equal(table_activité, table_activité_existante)
