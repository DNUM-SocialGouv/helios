import pandas as pd

from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, \
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES
from datacrawler.load.sauvegarde import sauvegarde
from datacrawler.test_helpers import (
    base_de_données_test,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
    sql_activité_builder,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_activités, index_des_activités_men_pmsi_annuel


class TestSauvegarde:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_sauvegarde_une_activité_d_un_établissement_médico_social(self) -> None:
        # GIVEN
        numéro_finess_entité_juridique = "111111111"
        numéro_finess_établissement_territorial = "22222222"
        sauvegarde_une_entité_juridique_en_base(numéro_finess_entité_juridique, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_territorial, numéro_finess_entité_juridique, base_de_données_test)

        activité_médico_social = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": numéro_finess_établissement_territorial,
                    "annee": 2018,
                    "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                    "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                    "taux_occupation_accueil_de_jour": 0.48012820512820514,
                }
            ],
        ).set_index(index_des_activités)

        # WHEN
        with base_de_données_test.connect() as connection:
            sauvegarde(connection, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, activité_médico_social)

        # THEN
        activité_en_base = pd.read_sql(
            f"SELECT * FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX}", base_de_données_test, index_col=index_des_activités
        )
        activité_attendue = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": numéro_finess_établissement_territorial,
                    "annee": 2018,
                    "taux_occupation_accueil_de_jour": 0.48012820512820514,
                    "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                    "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                    "taux_realisation_activite": None,
                    "file_active_personnes_accompagnees": None,
                    "nombre_moyen_journees_absence_personnes_accompagnees": None,
                    "duree_moyenne_sejour_accompagnement_personnes_sorties": None,
                }
            ],
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(activité_attendue, activité_en_base)

    def test_sauvegarde_une_activité_d_un_établissement_sanitaire(self) -> None:
        # GIVEN
        numéro_finess_entité_juridique = "111111111"
        numéro_finess_établissement_territorial = "22222222"
        sauvegarde_une_entité_juridique_en_base(numéro_finess_entité_juridique, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_territorial, numéro_finess_entité_juridique, base_de_données_test)

        activité_sanitaire = pd.DataFrame(
            [sql_activité_builder({"numero_finess_etablissement_territorial": numéro_finess_établissement_territorial})],
        ).set_index(index_des_activités_men_pmsi_annuel)

        # WHEN
        with base_de_données_test.connect() as connection:
            sauvegarde(connection, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, activité_sanitaire)

        # THEN
        activité_en_base = pd.read_sql(
            f"SELECT * FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES}", base_de_données_test, index_col=index_des_activités_men_pmsi_annuel
        ).sort_index(axis=1)
        activité_attendue = (
            pd.DataFrame(
                [sql_activité_builder({"numero_finess_etablissement_territorial": numéro_finess_établissement_territorial})],
            )
            .set_index(index_des_activités_men_pmsi_annuel)
            .sort_index(axis=1)
        )
        pd.testing.assert_frame_equal(activité_attendue, activité_en_base)
