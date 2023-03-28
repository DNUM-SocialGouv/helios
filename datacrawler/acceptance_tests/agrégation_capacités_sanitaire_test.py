import pandas as pd

from datacrawler.agrégation_capacité_sanitaire import agrège_les_capacités_sanitaire_des_entités_juridiques
from datacrawler.load.nom_des_tables import (
    TABLES_DES_CAPACITÉS_DES_ENTITES_JURIDIQUES,
    TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
)
from datacrawler.test_helpers import (
    base_de_données_test,
    sauvegarde_une_entité_juridique_en_base,
    sauvegarde_un_établissement_en_base,
    supprime_les_données_des_tables,
    mocked_logger,
)


class TestAgrègeLesCapacitésSanitaireDesEntitesJuridiques:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_sauvegarde_l_agrégation_des_capacité_sanitaires(self) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("111111111", base_de_données_test)
        sauvegarde_une_entité_juridique_en_base("222222", base_de_données_test)
        sauvegarde_un_établissement_en_base("222222222", "111111111", base_de_données_test)
        sauvegarde_un_établissement_en_base("333333333", "111111111", base_de_données_test)
        sauvegarde_un_établissement_en_base("44444444", "222222", base_de_données_test)

        capacités = pd.DataFrame(
            {
                "annee": [2020, 2020, 2020],
                "numero_finess_etablissement_territorial": ["222222222", "333333333", "44444444"],
                "nombre_lits_chirurgie": [1.0, 2.0, 5.0],
                "nombre_lits_médecine": [1.0, 2.0, 5.0],
                "nombre_lits_obstétrique": [1.0, 2.0, 5.0],
                "nombre_lits_ssr": [1.0, 2.0, 5.0],
                "nombre_places_chirurgie": [1.0, 2.0, 5.0],
                "nombre_places_obstétrique": [1.0, 2.0, 5.0],
                "nombre_places_ssr": [1.0, 2.0, 5.0],
                "nombre_lits_usld": [1.0, 2.0, 5.0],
                "nombre_lits_ou_places_psy_complet": [1.0, 2.0, 5.0],
                "nombre_places_psy_partiel": [1.0, 2.0, 5.0],
            }
        )

        with base_de_données_test.begin() as connection:
            capacités.to_sql(TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, connection, if_exists="append", index=False)

        # WHEN
        agrège_les_capacités_sanitaire_des_entités_juridiques(base_de_données_test, mocked_logger)

        # THEN
        agrégation_capacités_enregistrées = pd.read_sql_table(TABLES_DES_CAPACITÉS_DES_ENTITES_JURIDIQUES, base_de_données_test)
        agrégation_capacités_attendues = pd.DataFrame(
            {
                "annee": [2020, 2020],
                "numero_finess_entite_juridique": ["111111111", "222222"],
                "nombre_lits_chirurgie": [3, 5],
                "nombre_lits_médecine": [3, 5],
                "nombre_lits_obstétrique": [3, 5],
                "nombre_lits_ssr": [3, 5],
                "nombre_places_chirurgie": [3, 5],
                "nombre_places_obstétrique": [3, 5],
                "nombre_places_ssr": [3, 5],
                "nombre_lits_usld": [3, 5],
                "nombre_lits_ou_places_psy_complet": [3, 5],
                "nombre_places_psy_partiel": [3, 5],
            }
        )
        pd.testing.assert_frame_equal(agrégation_capacités_enregistrées, agrégation_capacités_attendues)

    def test_supprime_les_données_existantes_avant_de_sauvegarder_les_données_en_base(self) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("111111111", base_de_données_test)
        sauvegarde_un_établissement_en_base("222222222", "111111111", base_de_données_test)
        activités_déjà_enregistrée = pd.DataFrame(
            {
                "annee": [2020],
                "numero_finess_etablissement_territorial": ["222222222"],
                "nombre_lits_chirurgie": [1.0],
            }
        )
        with base_de_données_test.begin() as connection:
            activités_déjà_enregistrée.to_sql(TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, connection, if_exists="append", index=False)

        agrège_les_capacités_sanitaire_des_entités_juridiques(base_de_données_test, mocked_logger)

        # WHEN
        agrège_les_capacités_sanitaire_des_entités_juridiques(base_de_données_test, mocked_logger)

        # THEN
        agregation_capacites = pd.read_sql_query(
            f"SELECT * from {TABLES_DES_CAPACITÉS_DES_ENTITES_JURIDIQUES} " f"WHERE numero_finess_entite_juridique = '111111111'",
            base_de_données_test,
        )

        assert 1 == len(agregation_capacites)
