from datetime import date

import pandas as pd

from datacrawler.load.nom_des_tables import (
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES,
    FichierSource,
)
from datacrawler.load.sauvegarde import mets_à_jour_la_date_de_mise_à_jour_du_fichier_source, sauvegarde
from datacrawler.test_helpers import (
    base_de_données_test,
    helios_activité_sanitaire_builder,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_date_de_mise_à_jour_de_fichier_source,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_activités


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
            [helios_activité_sanitaire_builder({"numero_finess_etablissement_territorial": numéro_finess_établissement_territorial})],
        ).set_index(index_des_activités)

        # WHEN
        with base_de_données_test.connect() as connection:
            sauvegarde(connection, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, activité_sanitaire)

        # THEN
        activité_en_base = pd.read_sql(
            f"SELECT * FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES}", base_de_données_test, index_col=index_des_activités
        ).sort_index(axis=1)
        activité_attendue = (
            pd.DataFrame(
                [helios_activité_sanitaire_builder({"numero_finess_etablissement_territorial": numéro_finess_établissement_territorial})],
            )
            .set_index(index_des_activités)
            .sort_index(axis=1)
        )
        pd.testing.assert_frame_equal(activité_attendue, activité_en_base)

    def test_mets_à_jour_la_date_de_mise_à_jour_d_un_fichier_source_même_si_elle_existe_déjà(self) -> None:
        # GIVEN
        fichier_source = FichierSource.DIAMANT_ANN_ERRD_EJ_ET
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", fichier_source, base_de_données_test)
        nouvelle_date_de_mise_à_jour = "20220728"

        # WHEN
        with base_de_données_test.connect() as connection:
            mets_à_jour_la_date_de_mise_à_jour_du_fichier_source(connection, nouvelle_date_de_mise_à_jour, fichier_source)

        # THEN
        date_sauvée = base_de_données_test.execute(f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{fichier_source.value}'""")
        assert date_sauvée.fetchall() == [(date(2022, 7, 28), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)]
