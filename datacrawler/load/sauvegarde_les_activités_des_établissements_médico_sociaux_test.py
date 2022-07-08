import pandas as pd

from datacrawler.load.nom_des_tables import TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX
from datacrawler.load.sauvegarde_les_activités_des_établissements_médico_sociaux import sauvegarde_les_activités_des_établissements_médico_sociaux
from datacrawler.test_helpers import (
    base_de_données_test,
    supprime_les_données_des_tables,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_entité_juridique_en_base,
)
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux.équivalences_diamant_helios import index_des_activités


class TestSauvegardeDesActivitésDesÉtablissementsMédicoSociaux:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_la_sauvegarde_d_une_activité_d_un_établissement_médico_social(self) -> None:
        # GIVEN
        numéro_finess_entité_juridique = "111111111"
        numéro_finess_établissement_territorial = "22222222"
        sauvegarde_une_entité_juridique_en_base(numéro_finess_entité_juridique, base_de_données_test)
        sauvegarde_un_établissement_en_base(numéro_finess_établissement_territorial, numéro_finess_entité_juridique, base_de_données_test)

        activités_médico_sociales = pd.DataFrame(
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
            sauvegarde_les_activités_des_établissements_médico_sociaux(connection, activités_médico_sociales)

        # THEN
        activités_en_base = pd.read_sql(
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
        pd.testing.assert_frame_equal(activité_attendue, activités_en_base)
