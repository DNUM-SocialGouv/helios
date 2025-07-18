import pandas as pd

from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base
from datacrawler.test_helpers import (
    base_de_données_test,
    sauvegarde_un_établissement_en_base,
    sauvegarde_une_entité_juridique_en_base,
    supprime_les_données_des_tables,
)


class TestTrouveLesFinessDesEtablissementsEnBase:
    def setup_method(self) -> None:
        supprime_les_données_des_tables(base_de_données_test)

    def test_récupère_les_numéros_finess_des_établissements_en_base(self) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("123456789", base_de_données_test)
        sauvegarde_un_établissement_en_base("098765432", "123456789", base_de_données_test)

        # WHEN
        données = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_données_test)

        # THEN
        pd.testing.assert_frame_equal(
            données,
            pd.DataFrame(
                {
                    "numero_finess_etablissement_territorial": ["098765432"],
                }
            ),
        )

    def test_récupère_les_numéros_finess_des_établissements_en_base_avec_entite_juridique(self) -> None:
        # GIVEN
        sauvegarde_une_entité_juridique_en_base("123456789", base_de_données_test)
        sauvegarde_un_établissement_en_base("098765432", "123456789", base_de_données_test)

        # WHEN
        données = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_données_test, entite_juridique=True)

        # THEN
        pd.testing.assert_frame_equal(
            données,
            pd.DataFrame(
                {
                    "numero_finess_etablissement_territorial": ["098765432"],
                    "numero_finess_entite_juridique": ["123456789"],
                }
            ),
        )
