from datetime import date

import pandas as pd

from datacrawler.load.nom_des_tables import (
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES,
    FichierSource,
)
from datacrawler.load.sauvegarde import mets_a_jour_la_date_de_mise_a_jour_du_fichier_source, sauvegarde
from datacrawler.test_helpers import (
    base_de_données_test,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_date_de_mise_à_jour_de_fichier_source,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
)
from datacrawler.test_helpers.helios_builder import helios_activité_sanitaire_builder
from datacrawler.transform.équivalences_diamant_helios import index_des_activités


class TestSauvegarde:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_sauvegarde_une_activite_d_un_etablissement_medico_social(self) -> None:
        # GIVEN
        numero_finess_entite_juridique = "111111111"
        numero_finess_etablissement_territorial = "22222222"
        sauvegarde_une_entité_juridique_en_base(numero_finess_entite_juridique, base_de_données_test)
        sauvegarde_un_établissement_en_base(numero_finess_etablissement_territorial, numero_finess_entite_juridique, base_de_données_test)

        activite_medico_social = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": numero_finess_etablissement_territorial,
                    "annee": 2018,
                    "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                    "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                    "taux_occupation_accueil_de_jour": 0.48012820512820514,
                    "taux_occupation_externat": 0.96652448465,
                    "taux_occupation_semi_internat": 0.59796577789,
                    "taux_occupation_internat": 0.765494564,
                    "taux_occupation_autre": 0.6597946487,
                }
            ],
        ).set_index(index_des_activités)

        # WHEN
        with base_de_données_test.connect() as connection:
            sauvegarde(connection, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX, activite_medico_social)

        # THEN
        activite_en_base = pd.read_sql(
            f"SELECT * FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX}", base_de_données_test, index_col=index_des_activités
        )
        activite_attendue = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": numero_finess_etablissement_territorial,
                    "annee": 2018,
                    "taux_occupation_accueil_de_jour": 0.48012820512820514,
                    "taux_occupation_en_hebergement_temporaire": 0.93698630136986305,
                    "taux_occupation_en_hebergement_permanent": 0.99779299847793002,
                    "taux_realisation_activite": None,
                    "file_active_personnes_accompagnees": None,
                    "nombre_moyen_journees_absence_personnes_accompagnees": None,
                    "duree_moyenne_sejour_accompagnement_personnes_sorties": None,
                    "taux_occupation_externat": 0.96652448465,
                    "taux_occupation_semi_internat": 0.59796577789,
                    "taux_occupation_internat": 0.765494564,
                    "taux_occupation_autre": 0.6597946487,
                    "taux_occupation_seances": None,
                }
            ],
        ).set_index(index_des_activités)
        pd.testing.assert_frame_equal(activite_attendue, activite_en_base)

    def test_sauvegarde_une_activite_d_un_etablissement_sanitaire(self) -> None:
        # GIVEN
        numero_finess_entite_juridique = "111111111"
        numero_finess_etablissement_territorial = "22222222"
        sauvegarde_une_entité_juridique_en_base(numero_finess_entite_juridique, base_de_données_test)
        sauvegarde_un_établissement_en_base(numero_finess_etablissement_territorial, numero_finess_entite_juridique, base_de_données_test)

        activite_sanitaire = pd.DataFrame(
            [helios_activité_sanitaire_builder({"numero_finess_etablissement_territorial": numero_finess_etablissement_territorial})],
        ).set_index(index_des_activités)

        # WHEN
        with base_de_données_test.connect() as connection:
            sauvegarde(connection, TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, activite_sanitaire)

        # THEN
        activite_en_base = pd.read_sql(
            f"SELECT * FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES}", base_de_données_test, index_col=index_des_activités
        ).sort_index(axis=1)
        activite_attendue = (
            pd.DataFrame(
                [helios_activité_sanitaire_builder({"numero_finess_etablissement_territorial": numero_finess_etablissement_territorial})],
            )
            .set_index(index_des_activités)
            .sort_index(axis=1)
        )
        pd.testing.assert_frame_equal(activite_attendue, activite_en_base)

    def test_mets_a_jour_la_date_de_mise_a_jour_d_un_fichier_source_meme_si_elle_existe_deja(self) -> None:
        # GIVEN
        fichier_source = FichierSource.DIAMANT_ANN_ERRD_EJ_ET
        sauvegarde_une_date_de_mise_à_jour_de_fichier_source("20200101", fichier_source, base_de_données_test)
        nouvelle_date_de_mise_a_jour = "20220728"

        # WHEN
        with base_de_données_test.connect() as connection:
            mets_a_jour_la_date_de_mise_a_jour_du_fichier_source(connection, nouvelle_date_de_mise_a_jour, fichier_source)

        # THEN
        date_sauvee = base_de_données_test.execute(f"""SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{fichier_source.value}'""")
        assert date_sauvee.fetchone() == (date(2022, 7, 28), FichierSource.DIAMANT_ANN_ERRD_EJ_ET.value)
