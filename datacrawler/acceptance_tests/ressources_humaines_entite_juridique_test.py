from datetime import date

import pandas as pd
from freezegun import freeze_time
from numpy import NaN

from datacrawler.load.nom_des_tables import (
    TABLES_DES_RESSOURCES_HUMAINES_ENTITE_JURIDIQUE,
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES,
    FichierSource
)
from datacrawler.test_helpers import (
    NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
    base_de_données_test,
    mocked_logger,
    supprime_les_données_des_tables,
    sauvegarde_une_entité_juridique_en_base
)

from datacrawler.ajoute_le_bloc_ressources_humaines_des_entites_juridiques import (
    ajoute_le_bloc_ressources_humaines_des_entite_juridiques
)
class TestAjouteBlocRessourcesHumainesEntiteJuridique:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    @freeze_time("2023-01-11")
    def test_savegarde_les_donnees_des_ressources_humaines( self) -> None:

        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,base_de_données_test)
        chemin_du_fichier_quo_san_finance = "data_test/entrée/diamant/QUO_SAN_FINANCE_2023_01_10.csv"

        ajoute_le_bloc_ressources_humaines_des_entite_juridiques(
            chemin_du_fichier_quo_san_finance,
            base_de_données_test,
            mocked_logger
        )

        donnees_ressources_humaine_ej_attendu = pd.DataFrame(
            {
                "numero_finess_entite_juridique": ["010008407"] * 5,
                "annee": [2022, 2021, 2020, 2019, 2018],
                "nombre_etp_pm": [69.51012, 2.00004, 76.15980, 1.61004, 4.09992],
                "nombre_etp_pnm": [595.33764, 219.59028, 591.46980, 134.24976, 122.34984],
                "depenses_interim_pm": [0.00, 0.00, 654731.25, 0.00, 0.00],
                "jours_absenteisme_pm": [NaN, NaN, 451.0, NaN, NaN],
            }
        )

        donnees_ressources_humaines_enregistrees = pd.read_sql(
            TABLES_DES_RESSOURCES_HUMAINES_ENTITE_JURIDIQUE,
            base_de_données_test
        )

        pd.testing.assert_frame_equal(donnees_ressources_humaines_enregistrees.sort_index(axis=1),donnees_ressources_humaine_ej_attendu.sort_index(axis=1))

    @freeze_time("2023-01-11")
    def test_sauvegarde_les_dates_de_mise_a_jour_des_indicateurs_ressources_humaines(self) -> None:
        sauvegarde_une_entité_juridique_en_base(NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,base_de_données_test)
        chemin_du_fichier_quo_san_finance = "data_test/entrée/diamant/QUO_SAN_FINANCE_2023_01_10.csv"

        ajoute_le_bloc_ressources_humaines_des_entite_juridiques(
            chemin_du_fichier_quo_san_finance,
            base_de_données_test,
            mocked_logger
        )

        date_mise_a_jour_fichier_quo_san_finance = base_de_données_test.execute(
            f"SELECT * FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} WHERE fichier = '{FichierSource.DIAMANT_QUO_SAN_FINANCE.value}'"
        )
        assert date_mise_a_jour_fichier_quo_san_finance.fetchone() == (date(2023, 1, 10), FichierSource.DIAMANT_QUO_SAN_FINANCE.value)
