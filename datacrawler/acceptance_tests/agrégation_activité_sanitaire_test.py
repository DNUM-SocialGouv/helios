import pandas as pd

from datacrawler.agrégation_activité_sanitaire import agrège_les_activités_sanitaire_des_entités_juridiques
from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_SANITAIRES_DES_ENTITES_JURIDIQUES, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES
from datacrawler.test_helpers import (
    base_de_données_test,
    sauvegarde_une_entité_juridique_en_base,
    sauvegarde_un_établissement_en_base,
    supprime_les_données_des_tables,
    mocked_logger,
)


class TestAgrègeLesActivitesSanitaireDesEntitesJuridiques:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_sauvegarde_l_agrégation_des_activites_sanitaires(self) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("111111111", base_de_données_test)
        sauvegarde_une_entité_juridique_en_base("222222", base_de_données_test)
        sauvegarde_un_établissement_en_base("222222222", "111111111", base_de_données_test)
        sauvegarde_un_établissement_en_base("333333333", "111111111", base_de_données_test)
        sauvegarde_un_établissement_en_base("44444444", "222222", base_de_données_test)

        activités = pd.DataFrame(
            {
                "annee": [2020, 2020, 2020],
                "numero_finess_etablissement_territorial": ["222222222", "333333333", "44444444"],
                "nombre_sejours_partiels_medecine": [1.0, 2.0, 5.0],
                "nombre_sejours_partiels_obstetrique": [1.0, 2.0, 5.0],
                "nombre_sejours_partiels_chirurgie": [1.0, 2.0, 5.0],
                "nombre_sejours_complets_medecine": [1.0, 2.0, 5.0],
                "nombre_sejours_complets_obstetrique": [1.0, 2.0, 5.0],
                "nombre_sejours_complets_chirurgie": [1.0, 2.0, 5.0],
                "nombre_journees_completes_ssr": [1.0, 2.0, 5.0],
                "nombre_journees_partiels_ssr": [1.0, 2.0, 5.0],
                "nombre_journees_complete_psy": [1.0, 2.0, 5.0],
                "nombre_journées_partielles_psy": [1.0, 2.0, 5.0],
                "nombre_passages_urgences": [1.0, 2.0, 5.0],
            }
        )

        with base_de_données_test.begin() as connection:
            activités.to_sql(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, connection, if_exists="append", index=False)

        # WHEN
        agrège_les_activités_sanitaire_des_entités_juridiques(base_de_données_test, mocked_logger)

        # THEN
        agrégation_activités_enregistrées = pd.read_sql_table(TABLE_DES_ACTIVITÉS_SANITAIRES_DES_ENTITES_JURIDIQUES, base_de_données_test)
        agrégation_activités_attendues = pd.DataFrame(
            {
                "annee": [2020, 2020],
                "numero_finess_entite_juridique": ["111111111", "222222"],
                "nombre_sejours_partiels_medecine": [3.0, 5.0],
                "nombre_sejours_partiels_obstetrique": [3.0, 5.0],
                "nombre_sejours_partiels_chirurgie": [3.0, 5.0],
                "nombre_sejours_complets_medecine": [3.0, 5.0],
                "nombre_sejours_complets_obstetrique": [3.0, 5.0],
                "nombre_sejours_complets_chirurgie": [3.0, 5.0],
                "nombre_journees_completes_ssr": [3.0, 5.0],
                "nombre_journees_partiels_ssr": [3.0, 5.0],
                "nombre_journees_complete_psy": [3.0, 5.0],
                "nombre_journées_partielles_psy": [3.0, 5.0],
                "nombre_passage_urgence": [3.0, 5.0],
            }
        )
        pd.testing.assert_frame_equal(agrégation_activités_enregistrées, agrégation_activités_attendues)

    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("111111111", base_de_données_test)
        sauvegarde_un_établissement_en_base("222222222", "111111111", base_de_données_test)
        activités_déjà_enregistrée = pd.DataFrame(
            {
                "annee": [2020],
                "numero_finess_etablissement_territorial": ["222222222"],
                "nombre_sejours_partiels_medecine": [1.0],
            }
        )
        with base_de_données_test.begin() as connection:
            activités_déjà_enregistrée.to_sql(TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, connection, if_exists="append", index=False)

        agrège_les_activités_sanitaire_des_entités_juridiques(base_de_données_test, mocked_logger)

        # WHEN
        agrège_les_activités_sanitaire_des_entités_juridiques(base_de_données_test, mocked_logger)

        # THEN
        agregation_activites = pd.read_sql_query(
            f"SELECT * from {TABLE_DES_ACTIVITÉS_SANITAIRES_DES_ENTITES_JURIDIQUES} " f"WHERE numero_finess_entite_juridique = '111111111'",
            base_de_données_test,
        )

        assert 1 == len(agregation_activites)
