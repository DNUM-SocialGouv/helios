import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.test_helpers.finess_builder import xml_contenu_finess_cs1400105_builder
from datacrawler.test_helpers.helios_builder import helios_autorisation_médico_social_builder
from datacrawler.transform.transforme_les_autorisations_des_établissements_médico_sociaux.transforme_les_données_d_autorisation_et_capacité import (
    transforme_les_données_finess_cs1400105,
)
from datacrawler.transform.équivalences_finess_helios import index_des_autorisations_médico_sociaux


class TestTransformeLesDonnéesFinessCs1400105:
    autorisation_finess_avec_indicateur_de_suppression_non_rempli = xml_contenu_finess_cs1400105_builder(
        {"indsupinst": NaN, "libde": "indicateur suppression non rempli"}
    )
    autorisation_finess_installée_mais_non_autorisée = xml_contenu_finess_cs1400105_builder(
        {"indsupinst": "N", "indsupaut": "O", "libde": "installée mais non autorisée"}
    )
    autorisation_finess_autorisée_mais_non_installée = xml_contenu_finess_cs1400105_builder(
        {"indsupinst": "O", "indsupaut": "N", "libde": "autorisée mais non installée"}
    )
    autorisation_finess_installée_et_autorisée = xml_contenu_finess_cs1400105_builder({"indsupinst": "N", "indsupaut": "N", "libde": "autorisée et installée"})
    autorisation_finess_ni_autorisée_ni_installée = xml_contenu_finess_cs1400105_builder(
        {"indsupinst": "O", "indsupaut": "O", "libde": "ni autorisée ni installée"}
    )

    def test_filtre_et_renomme_les_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame([xml_contenu_finess_cs1400105_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "activite": "21",
                    "capacite_autorisee_totale": 3,
                    "capacite_installee_totale": 3,
                    "clientele": "436",
                    "date_autorisation": "2006-03-29",
                    "date_derniere_installation": "2009-01-01",
                    "date_mise_a_jour_autorisation": "2012-05-03",
                    "discipline_equipement": "924",
                    "est_installee": True,
                    "libelle_activite": "Accueil de Jour",
                    "libelle_clientele": "Personnes Alzheimer ou maladies apparentées",
                    "libelle_discipline_equipement": "Accueil pour Personnes Âgées",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations_médico_sociaux)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame([xml_contenu_finess_cs1400105_builder({"nofinesset": NaN}), xml_contenu_finess_cs1400105_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "activite": "21",
                    "capacite_autorisee_totale": 3,
                    "capacite_installee_totale": 3,
                    "clientele": "436",
                    "date_autorisation": "2006-03-29",
                    "date_derniere_installation": "2009-01-01",
                    "date_mise_a_jour_autorisation": "2012-05-03",
                    "discipline_equipement": "924",
                    "est_installee": True,
                    "libelle_activite": "Accueil de Jour",
                    "libelle_clientele": "Personnes Alzheimer ou maladies apparentées",
                    "libelle_discipline_equipement": "Accueil pour Personnes Âgées",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations_médico_sociaux)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_la_discipline_d_équipement(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame([xml_contenu_finess_cs1400105_builder({"de": NaN}), xml_contenu_finess_cs1400105_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "activite": "21",
                    "capacite_autorisee_totale": 3,
                    "capacite_installee_totale": 3,
                    "clientele": "436",
                    "date_autorisation": "2006-03-29",
                    "date_derniere_installation": "2009-01-01",
                    "date_mise_a_jour_autorisation": "2012-05-03",
                    "discipline_equipement": "924",
                    "est_installee": True,
                    "libelle_activite": "Accueil de Jour",
                    "libelle_clientele": "Personnes Alzheimer ou maladies apparentées",
                    "libelle_discipline_equipement": "Accueil pour Personnes Âgées",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations_médico_sociaux)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_activité(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame([xml_contenu_finess_cs1400105_builder({"ta": NaN}), xml_contenu_finess_cs1400105_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "activite": "21",
                    "capacite_autorisee_totale": 3,
                    "capacite_installee_totale": 3,
                    "clientele": "436",
                    "date_autorisation": "2006-03-29",
                    "date_derniere_installation": "2009-01-01",
                    "date_mise_a_jour_autorisation": "2012-05-03",
                    "discipline_equipement": "924",
                    "est_installee": True,
                    "libelle_activite": "Accueil de Jour",
                    "libelle_clientele": "Personnes Alzheimer ou maladies apparentées",
                    "libelle_discipline_equipement": "Accueil pour Personnes Âgées",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations_médico_sociaux)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_la_clientèle(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame([xml_contenu_finess_cs1400105_builder({"client": NaN}), xml_contenu_finess_cs1400105_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "activite": "21",
                    "capacite_autorisee_totale": 3,
                    "capacite_installee_totale": 3,
                    "clientele": "436",
                    "date_autorisation": "2006-03-29",
                    "date_derniere_installation": "2009-01-01",
                    "date_mise_a_jour_autorisation": "2012-05-03",
                    "discipline_equipement": "924",
                    "est_installee": True,
                    "libelle_activite": "Accueil de Jour",
                    "libelle_clientele": "Personnes Alzheimer ou maladies apparentées",
                    "libelle_discipline_equipement": "Accueil pour Personnes Âgées",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations_médico_sociaux)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_considère_un_indicateur_de_suppression_à_faux_s_il_n_est_pas_rempli(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame([self.autorisation_finess_avec_indicateur_de_suppression_non_rempli])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        autorisations_installées = pd.DataFrame(
            [helios_autorisation_médico_social_builder({"est_installee": True, "libelle_discipline_equipement": "indicateur suppression non rempli"})],
        ).set_index(index_des_autorisations_médico_sociaux)
        pd.testing.assert_frame_equal(données_transformées, autorisations_installées)

    def test_pour_un_même_ensemble_finess_discipline_activité_clientèle_privilégie_une_autorisation_toujours_autorisée_et_installée(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                self.autorisation_finess_installée_mais_non_autorisée,
                self.autorisation_finess_installée_et_autorisée,
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
        données_transformées = transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        autorisation_autorisée_et_installée = pd.DataFrame(
            [helios_autorisation_médico_social_builder({"libelle_discipline_equipement": "autorisée et installée"})],
        ).set_index(index_des_autorisations_médico_sociaux)
        pd.testing.assert_frame_equal(données_transformées, autorisation_autorisée_et_installée)

    def test_pour_un_même_ensemble_finess_discipline_activité_clientèle_privilégie_une_autorisation_seulement_installée_à_seulement_autorisée(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                self.autorisation_finess_installée_mais_non_autorisée,
                self.autorisation_finess_autorisée_mais_non_installée,
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
        données_transformées = transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        autorisation_installée_mais_non_autorisée = pd.DataFrame(
            [helios_autorisation_médico_social_builder({"libelle_discipline_equipement": "installée mais non autorisée"})],
        ).set_index(index_des_autorisations_médico_sociaux)
        pd.testing.assert_frame_equal(données_transformées, autorisation_installée_mais_non_autorisée)

    def test_pour_un_même_ensemble_finess_discipline_activité_clientèle_privilégie_une_autorisation_seulement_autorisée_à_ni_autorisée_ni_installée(
        self,
    ) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                self.autorisation_finess_autorisée_mais_non_installée,
                self.autorisation_finess_ni_autorisée_ni_installée,
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
        données_transformées = transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        autorisation_installée_mais_non_autorisée = pd.DataFrame(
            [helios_autorisation_médico_social_builder({"est_installee": False, "libelle_discipline_equipement": "autorisée mais non installée"})],
        ).set_index(index_des_autorisations_médico_sociaux)
        pd.testing.assert_frame_equal(données_transformées, autorisation_installée_mais_non_autorisée)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame([xml_contenu_finess_cs1400105_builder()])
        numéros_finess_des_établissements_connus = pd.DataFrame(
            [
                {
                    "numero_finess_etablissement_territorial": "001002003",
                }
            ]
        )

        # WHEN
        données_transformées = transforme_les_données_finess_cs1400105(données_finess_cs1400105, numéros_finess_des_établissements_connus, mocked_logger)

        # THEN
        assert données_transformées.empty
