import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.test_helpers.diamant_builder import csv_ann_ca_ej_et_ressources_humaines_builder, csv_ann_errd_ej_et_ressources_humaines_builder
from datacrawler.transform.transforme_le_bloc_ressources_humaines_des_établissements_médico_sociaux.transforme_le_nombre_d_etp_realises import (
    fusionne_le_nombre_d_etp_réalisés_des_établissements_errd_et_ca,
    transforme_le_nombre_d_etp_réalisés_des_établissements_ca,
    transforme_le_nombre_d_etp_réalisés_des_établissements_errd,
)
from datacrawler.transform.équivalences_diamant_helios import index_du_bloc_ressources_humaines


class TestTransformeLeNombreDEtpRéalisésDesÉtablissementsErrd:
    def test_renomme_les_colonnes(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_ressources_humaines = pd.DataFrame(
            [
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2020,
                    "Nombre ETP total réalisé ERRD": 172.0,
                }
            ]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_errd(
            données_ann_errd_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        nombre_d_etp_réaslisés_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2020,
                    "nombre_etp_realises": 172.0,
                }
            ],
        )
        pd.testing.assert_frame_equal(données_transformées, nombre_d_etp_réaslisés_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_ressources_humaines = pd.DataFrame([csv_ann_errd_ej_et_ressources_humaines_builder({"Finess": NaN})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_errd(
            données_ann_errd_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_ressources_humaines = pd.DataFrame([csv_ann_errd_ej_et_ressources_humaines_builder({"Année": NaN})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_errd(
            données_ann_errd_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_le_nombre_d_etp_réalisés(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_ressources_humaines = pd.DataFrame([csv_ann_errd_ej_et_ressources_humaines_builder({"Nombre ETP total réalisé ERRD": NaN})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_errd(
            données_ann_errd_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_ressources_humaines = pd.DataFrame(
            [
                csv_ann_errd_ej_et_ressources_humaines_builder({"Finess": NUMÉRO_FINESS_ÉTABLISSEMENT, "Année": 2020, "Nombre ETP total réalisé ERRD": 80.0}),
                csv_ann_errd_ej_et_ressources_humaines_builder({"Finess": NUMÉRO_FINESS_ÉTABLISSEMENT, "Année": 2020, "Nombre ETP total réalisé ERRD": NaN}),
            ]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_errd(
            données_ann_errd_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        nombre_d_etp_réaslisés_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2020,
                    "nombre_etp_realises": 80.0,
                }
            ],
        )
        pd.testing.assert_frame_equal(données_transformées, nombre_d_etp_réaslisés_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_ressources_humaines = pd.DataFrame([csv_ann_errd_ej_et_ressources_humaines_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "12345789",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_errd(
            données_ann_errd_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty


class TestTransformeLeNombreDEtpRéalisésDesÉtablissementsCa:
    def test_renomme_les_colonnes(self) -> None:
        # GIVEN
        données_ann_ca_ej_et_ressources_humaines = pd.DataFrame(
            [
                {
                    "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "Année": 2020,
                    "Nombre ETP total réalisé CA": 156.4,
                }
            ]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_ca(
            données_ann_ca_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        nombre_d_etp_réaslisés_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2020,
                    "nombre_etp_realises": 156.4,
                }
            ],
        )
        pd.testing.assert_frame_equal(données_transformées, nombre_d_etp_réaslisés_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_ann_ca_ej_et_ressources_humaines = pd.DataFrame([csv_ann_ca_ej_et_ressources_humaines_builder({"Finess": NaN})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_ca(
            données_ann_ca_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_l_année(self) -> None:
        # GIVEN
        données_ann_ca_ej_et_ressources_humaines = pd.DataFrame([csv_ann_errd_ej_et_ressources_humaines_builder({"Année": NaN})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_ca(
            données_ann_ca_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_supprime_les_lignes_ne_mentionnant_pas_le_nombre_d_etp_réalisés(self) -> None:
        # GIVEN
        données_ann_ca_ej_et_ressources_humaines = pd.DataFrame([csv_ann_ca_ej_et_ressources_humaines_builder({"Nombre ETP total réalisé CA": NaN})])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_ca(
            données_ann_ca_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty

    def test_ne_considère_qu_une_seule_fois_un_même_couple_année_numéro_finess(self) -> None:
        # GIVEN
        données_ann_ca_ej_et_ressources_humaines = pd.DataFrame(
            [
                csv_ann_ca_ej_et_ressources_humaines_builder({"Finess": NUMÉRO_FINESS_ÉTABLISSEMENT, "Année": 2020, "Nombre ETP total réalisé CA": 80.0}),
                csv_ann_ca_ej_et_ressources_humaines_builder({"Finess": NUMÉRO_FINESS_ÉTABLISSEMENT, "Année": 2020, "Nombre ETP total réalisé CA": NaN}),
            ]
        )
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_ca(
            données_ann_ca_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        nombre_d_etp_réaslisés_attendu = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "annee": 2020,
                    "nombre_etp_realises": 80.0,
                }
            ],
        )
        pd.testing.assert_frame_equal(données_transformées, nombre_d_etp_réaslisés_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_ann_ca_ej_et_ressources_humaines = pd.DataFrame([csv_ann_ca_ej_et_ressources_humaines_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "12345789",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_le_nombre_d_etp_réalisés_des_établissements_ca(
            données_ann_ca_ej_et_ressources_humaines, numéros_finess_des_établissements_connus, mocked_logger
        )

        # THEN
        assert données_transformées.empty


class TestFusionneLesNombresDEtpRéalisés:
    def test_fusionne_le_nombre_d_etp_réalisés_d_établissements_ca_et_errd_différents(self) -> None:
        # GIVEN
        numéro_finess_ca = "123456789"
        numéro_finess_errd = "987654321"
        données_ann_errd_ej_et_ressources_humaines = pd.DataFrame([csv_ann_errd_ej_et_ressources_humaines_builder({"Finess": numéro_finess_errd})])
        données_ann_ca_ej_et_ressources_humaines = pd.DataFrame([csv_ann_ca_ej_et_ressources_humaines_builder({"Finess": numéro_finess_ca})])
        numéros_finess_des_établissements_connus = pd.DataFrame({"numero_finess_etablissement_territorial": [numéro_finess_ca, numéro_finess_errd]})

        # WHEN
        nombre_d_etp_de_tous_les_établissements = fusionne_le_nombre_d_etp_réalisés_des_établissements_errd_et_ca(
            données_ann_errd_ej_et_ressources_humaines,
            données_ann_ca_ej_et_ressources_humaines,
            numéros_finess_des_établissements_connus,
            mocked_logger,
        )

        # THEN
        nombre_d_etp_attendus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [numéro_finess_errd, numéro_finess_ca],
                "annee": [2020, 2020],
                "nombre_etp_realises": [172.0, 156.4],
            }
        )
        pd.testing.assert_frame_equal(
            nombre_d_etp_de_tous_les_établissements.set_index(index_du_bloc_ressources_humaines),
            nombre_d_etp_attendus.set_index(index_du_bloc_ressources_humaines),
        )

    def test_privilégie_un_nombre_d_etp_réalisés_d_établissements_errd_si_le_même_couple_finess_année_est_présent_dans_les_deux_fichiers(self) -> None:
        # GIVEN
        données_ann_errd_ej_et_ressources_humaines = pd.DataFrame([csv_ann_errd_ej_et_ressources_humaines_builder({"Nombre ETP total réalisé ERRD": 172.0})])
        données_ann_ca_ej_et_ressources_humaines = pd.DataFrame([csv_ann_ca_ej_et_ressources_humaines_builder({"Nombre ETP total réalisé CA": 156.4})])
        numéros_finess_des_établissements_connus = pd.DataFrame({"numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT]})

        # WHEN
        nombre_d_etp_de_tous_les_établissements = fusionne_le_nombre_d_etp_réalisés_des_établissements_errd_et_ca(
            données_ann_errd_ej_et_ressources_humaines,
            données_ann_ca_ej_et_ressources_humaines,
            numéros_finess_des_établissements_connus,
            mocked_logger,
        )

        # THEN
        nombre_d_etp_attendus = pd.DataFrame(
            {
                "numero_finess_etablissement_territorial": [NUMÉRO_FINESS_ÉTABLISSEMENT],
                "annee": [2020],
                "nombre_etp_realises": [172.0],
            }
        )
        pd.testing.assert_frame_equal(
            nombre_d_etp_de_tous_les_établissements.set_index(index_du_bloc_ressources_humaines),
            nombre_d_etp_attendus.set_index(index_du_bloc_ressources_humaines),
        )
