import pandas as pd
from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, mocked_logger
from datacrawler.transform.transforme_les_autorisations_des_établissements_médico_sociaux.transforme_les_données_finess_cs1400105 import (
    transforme_les_données_finess_cs1400105,
)
from datacrawler.transform.équivalences_finess_helios import index_des_autorisations


class TestTransformeLesDonnéesFinessCs1400105:
    def test_filtre_et_renomme_les_colonnes_et_place_l_index(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "924",
                    "libde": "Accueil pour Personnes Âgées",
                    "libcourtde": "Acc. Personnes Âgées",
                    "ta": "21",
                    "libta": "Accueil de Jour",
                    "libcourtta": "Accueil de Jour",
                    "client": "436",
                    "libclient": "Personnes Alzheimer ou maladies apparentées",
                    "libcourtclient": "Alzheimer, mal appar",
                    "sourceinfo": "S",
                    "libsourceinfo": "Inspection",
                    "capinstot": 3,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2009-01-01",
                    "datepremautor": "2006-03-29",
                    "capautot": 3,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": 3,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2006-03-29",
                    "datemajaut": "2012-05-03",
                    "datemajinst": "2009-06-29",
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
        ).set_index(index_des_autorisations)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_le_numéro_finess(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                {
                    "nofinesset": NaN,
                    "de": "924",
                    "libde": "Accueil pour Personnes Âgées",
                    "libcourtde": "Acc. Personnes Âgées",
                    "ta": "21",
                    "libta": "Accueil de Jour",
                    "libcourtta": "Accueil de Jour",
                    "client": "436",
                    "libclient": "Personnes Alzheimer ou maladies apparentées",
                    "libcourtclient": "Alzheimer, mal appar",
                    "sourceinfo": "S",
                    "libsourceinfo": "Inspection",
                    "capinstot": 3,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2009-01-01",
                    "datepremautor": "2006-03-29",
                    "capautot": 3,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": 3,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2006-03-29",
                    "datemajaut": "2012-05-03",
                    "datemajinst": "2009-06-29",
                },
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "959",
                    "libde": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "libcourtde": "Héb.Urgence Diffi.",
                    "ta": "11",
                    "libta": "Hébergement Complet Internat",
                    "libcourtta": "Héberg. Comp. Inter.",
                    "client": "899",
                    "libclient": "Tous publics en difficulté",
                    "libcourtclient": "Tous publics en diff",
                    "sourceinfo": "E",
                    "libsourceinfo": "Enquête statistique",
                    "capinstot": 17,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2013-06-26",
                    "datepremautor": "2008-01-11",
                    "capautot": 17,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": NaN,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2008-01-11",
                    "datemajaut": "2009-04-06",
                    "datemajinst": "2014-04-07",
                },
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
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "activite": "11",
                    "capacite_autorisee_totale": 17,
                    "capacite_installee_totale": 17,
                    "clientele": "899",
                    "date_autorisation": "2008-01-11",
                    "date_derniere_installation": "2013-06-26",
                    "date_mise_a_jour_autorisation": "2009-04-06",
                    "discipline_equipement": "959",
                    "est_installee": True,
                    "libelle_activite": "Hébergement Complet Internat",
                    "libelle_clientele": "Tous publics en difficulté",
                    "libelle_discipline_equipement": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_la_discipline_d_équipement(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": NaN,
                    "libde": "Accueil pour Personnes Âgées",
                    "libcourtde": "Acc. Personnes Âgées",
                    "ta": "21",
                    "libta": "Accueil de Jour",
                    "libcourtta": "Accueil de Jour",
                    "client": "436",
                    "libclient": "Personnes Alzheimer ou maladies apparentées",
                    "libcourtclient": "Alzheimer, mal appar",
                    "sourceinfo": "S",
                    "libsourceinfo": "Inspection",
                    "capinstot": 3,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2009-01-01",
                    "datepremautor": "2006-03-29",
                    "capautot": 3,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": 3,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2006-03-29",
                    "datemajaut": "2012-05-03",
                    "datemajinst": "2009-06-29",
                },
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "959",
                    "libde": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "libcourtde": "Héb.Urgence Diffi.",
                    "ta": "11",
                    "libta": "Hébergement Complet Internat",
                    "libcourtta": "Héberg. Comp. Inter.",
                    "client": "899",
                    "libclient": "Tous publics en difficulté",
                    "libcourtclient": "Tous publics en diff",
                    "sourceinfo": "E",
                    "libsourceinfo": "Enquête statistique",
                    "capinstot": 17,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2013-06-26",
                    "datepremautor": "2008-01-11",
                    "capautot": 17,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": NaN,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2008-01-11",
                    "datemajaut": "2009-04-06",
                    "datemajinst": "2014-04-07",
                },
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
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "activite": "11",
                    "capacite_autorisee_totale": 17,
                    "capacite_installee_totale": 17,
                    "clientele": "899",
                    "date_autorisation": "2008-01-11",
                    "date_derniere_installation": "2013-06-26",
                    "date_mise_a_jour_autorisation": "2009-04-06",
                    "discipline_equipement": "959",
                    "est_installee": True,
                    "libelle_activite": "Hébergement Complet Internat",
                    "libelle_clientele": "Tous publics en difficulté",
                    "libelle_discipline_equipement": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_activité(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "959",
                    "libde": "Accueil pour Personnes Âgées",
                    "libcourtde": "Acc. Personnes Âgées",
                    "ta": NaN,
                    "libta": "Accueil de Jour",
                    "libcourtta": "Accueil de Jour",
                    "client": "436",
                    "libclient": "Personnes Alzheimer ou maladies apparentées",
                    "libcourtclient": "Alzheimer, mal appar",
                    "sourceinfo": "S",
                    "libsourceinfo": "Inspection",
                    "capinstot": 3,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2009-01-01",
                    "datepremautor": "2006-03-29",
                    "capautot": 3,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": 3,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2006-03-29",
                    "datemajaut": "2012-05-03",
                    "datemajinst": "2009-06-29",
                },
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "959",
                    "libde": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "libcourtde": "Héb.Urgence Diffi.",
                    "ta": "11",
                    "libta": "Hébergement Complet Internat",
                    "libcourtta": "Héberg. Comp. Inter.",
                    "client": "899",
                    "libclient": "Tous publics en difficulté",
                    "libcourtclient": "Tous publics en diff",
                    "sourceinfo": "E",
                    "libsourceinfo": "Enquête statistique",
                    "capinstot": 17,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2013-06-26",
                    "datepremautor": "2008-01-11",
                    "capautot": 17,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": NaN,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2008-01-11",
                    "datemajaut": "2009-04-06",
                    "datemajinst": "2014-04-07",
                },
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
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "activite": "11",
                    "capacite_autorisee_totale": 17,
                    "capacite_installee_totale": 17,
                    "clientele": "899",
                    "date_autorisation": "2008-01-11",
                    "date_derniere_installation": "2013-06-26",
                    "date_mise_a_jour_autorisation": "2009-04-06",
                    "discipline_equipement": "959",
                    "est_installee": True,
                    "libelle_activite": "Hébergement Complet Internat",
                    "libelle_clientele": "Tous publics en difficulté",
                    "libelle_discipline_equipement": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_la_clientèle(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "959",
                    "libde": "Accueil pour Personnes Âgées",
                    "libcourtde": "Acc. Personnes Âgées",
                    "ta": "21",
                    "libta": "Accueil de Jour",
                    "libcourtta": "Accueil de Jour",
                    "client": NaN,
                    "libclient": "Personnes Alzheimer ou maladies apparentées",
                    "libcourtclient": "Alzheimer, mal appar",
                    "sourceinfo": "S",
                    "libsourceinfo": "Inspection",
                    "capinstot": 3,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2009-01-01",
                    "datepremautor": "2006-03-29",
                    "capautot": 3,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": 3,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2006-03-29",
                    "datemajaut": "2012-05-03",
                    "datemajinst": "2009-06-29",
                },
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "959",
                    "libde": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "libcourtde": "Héb.Urgence Diffi.",
                    "ta": "11",
                    "libta": "Hébergement Complet Internat",
                    "libcourtta": "Héberg. Comp. Inter.",
                    "client": "899",
                    "libclient": "Tous publics en difficulté",
                    "libcourtclient": "Tous publics en diff",
                    "sourceinfo": "E",
                    "libsourceinfo": "Enquête statistique",
                    "capinstot": 17,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2013-06-26",
                    "datepremautor": "2008-01-11",
                    "capautot": 17,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": NaN,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2008-01-11",
                    "datemajaut": "2009-04-06",
                    "datemajinst": "2014-04-07",
                },
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
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "activite": "11",
                    "capacite_autorisee_totale": 17,
                    "capacite_installee_totale": 17,
                    "clientele": "899",
                    "date_autorisation": "2008-01-11",
                    "date_derniere_installation": "2013-06-26",
                    "date_mise_a_jour_autorisation": "2009-04-06",
                    "discipline_equipement": "959",
                    "est_installee": True,
                    "libelle_activite": "Hébergement Complet Internat",
                    "libelle_clientele": "Tous publics en difficulté",
                    "libelle_discipline_equipement": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_supprime_les_lignes_ne_mentionnant_pas_l_indicateur_d_installation(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "959",
                    "libde": "Accueil pour Personnes Âgées",
                    "libcourtde": "Acc. Personnes Âgées",
                    "ta": "21",
                    "libta": "Accueil de Jour",
                    "libcourtta": "Accueil de Jour",
                    "client": "899",
                    "libclient": "Personnes Alzheimer ou maladies apparentées",
                    "libcourtclient": "Alzheimer, mal appar",
                    "sourceinfo": "S",
                    "libsourceinfo": "Inspection",
                    "capinstot": 3,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": NaN,
                    "datederinst": "2009-01-01",
                    "datepremautor": "2006-03-29",
                    "capautot": 3,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": 3,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2006-03-29",
                    "datemajaut": "2012-05-03",
                    "datemajinst": "2009-06-29",
                },
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "959",
                    "libde": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "libcourtde": "Héb.Urgence Diffi.",
                    "ta": "11",
                    "libta": "Hébergement Complet Internat",
                    "libcourtta": "Héberg. Comp. Inter.",
                    "client": "899",
                    "libclient": "Tous publics en difficulté",
                    "libcourtclient": "Tous publics en diff",
                    "sourceinfo": "E",
                    "libsourceinfo": "Enquête statistique",
                    "capinstot": 17,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2013-06-26",
                    "datepremautor": "2008-01-11",
                    "capautot": 17,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": NaN,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2008-01-11",
                    "datemajaut": "2009-04-06",
                    "datemajinst": "2014-04-07",
                },
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
        data_frame_attendu = pd.DataFrame(
            [
                {
                    "activite": "11",
                    "capacite_autorisee_totale": 17,
                    "capacite_installee_totale": 17,
                    "clientele": "899",
                    "date_autorisation": "2008-01-11",
                    "date_derniere_installation": "2013-06-26",
                    "date_mise_a_jour_autorisation": "2009-04-06",
                    "discipline_equipement": "959",
                    "est_installee": True,
                    "libelle_activite": "Hébergement Complet Internat",
                    "libelle_clientele": "Tous publics en difficulté",
                    "libelle_discipline_equipement": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_considère_pas_les_autorisations_qui_ne_sont_plus_autorisées(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "924",
                    "libde": "Accueil pour Personnes Âgées",
                    "libcourtde": "Acc. Personnes Âgées",
                    "ta": "21",
                    "libta": "Accueil de Jour",
                    "libcourtta": "Accueil de Jour",
                    "client": "436",
                    "libclient": "Personnes Alzheimer ou maladies apparentées",
                    "libcourtclient": "Alzheimer, mal appar",
                    "sourceinfo": "S",
                    "libsourceinfo": "Inspection",
                    "capinstot": 3,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2009-01-01",
                    "datepremautor": "2006-03-29",
                    "capautot": 3,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": 3,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2006-03-29",
                    "datemajaut": "2012-05-03",
                    "datemajinst": "2009-06-29",
                },
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "959",
                    "libde": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "libcourtde": "Héb.Urgence Diffi.",
                    "ta": "11",
                    "libta": "Hébergement Complet Internat",
                    "libcourtta": "Héberg. Comp. Inter.",
                    "client": "899",
                    "libclient": "Tous publics en difficulté",
                    "libcourtclient": "Tous publics en diff",
                    "sourceinfo": "E",
                    "libsourceinfo": "Enquête statistique",
                    "capinstot": 17,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "O",
                    "datederinst": "2013-06-26",
                    "datepremautor": "2008-01-11",
                    "capautot": 17,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": NaN,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "O",
                    "dateautor": "2008-01-11",
                    "datemajaut": "2009-04-06",
                    "datemajinst": "2014-04-07",
                },
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "958",
                    "libde": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "libcourtde": "Héb.Urgence Diffi.",
                    "ta": "11",
                    "libta": "Hébergement Complet Internat",
                    "libcourtta": "Héberg. Comp. Inter.",
                    "client": "899",
                    "libclient": "Tous publics en difficulté",
                    "libcourtclient": "Tous publics en diff",
                    "sourceinfo": "E",
                    "libsourceinfo": "Enquête statistique",
                    "capinstot": 17,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2013-06-26",
                    "datepremautor": "2008-01-11",
                    "capautot": 17,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": NaN,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "O",
                    "dateautor": "2008-01-11",
                    "datemajaut": "2009-04-06",
                    "datemajinst": "2014-04-07",
                },
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
                    "est_installee": True,
                    "discipline_equipement": "924",
                    "libelle_activite": "Accueil de Jour",
                    "libelle_clientele": "Personnes Alzheimer ou maladies apparentées",
                    "libelle_discipline_equipement": "Accueil pour Personnes Âgées",
                    "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
                }
            ],
        ).set_index(index_des_autorisations)
        pd.testing.assert_frame_equal(données_transformées, data_frame_attendu)

    def test_ne_renvoie_pas_les_établissements_non_présents_en_base(self) -> None:
        # GIVEN
        données_finess_cs1400105 = pd.DataFrame(
            [
                {
                    "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
                    "de": "959",
                    "libde": "Hébergement d'Urgence Adultes, Familles Difficulté",
                    "libcourtde": "Héb.Urgence Diffi.",
                    "ta": "11",
                    "libta": "Hébergement Complet Internat",
                    "libcourtta": "Héberg. Comp. Inter.",
                    "client": "899",
                    "libclient": "Tous publics en difficulté",
                    "libcourtclient": "Tous publics en diff",
                    "sourceinfo": "E",
                    "libsourceinfo": "Enquête statistique",
                    "capinstot": 17,
                    "capinstm": NaN,
                    "capinstf": NaN,
                    "capinsthab": NaN,
                    "ageminiinst": NaN,
                    "agemaxiinst": NaN,
                    "indsupinst": "N",
                    "datederinst": "2013-06-26",
                    "datepremautor": "2008-01-11",
                    "capautot": 17,
                    "capautm": NaN,
                    "capautf": NaN,
                    "capauthab": NaN,
                    "ageminiaut": NaN,
                    "agemaxiaut": NaN,
                    "indsupaut": "N",
                    "dateautor": "2008-01-11",
                    "datemajaut": "2009-04-06",
                    "datemajinst": "2014-04-07",
                },
            ]
        )
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
        assert données_transformées.shape == (0, 8)
