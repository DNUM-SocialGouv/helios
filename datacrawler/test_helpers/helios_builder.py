from datetime import date
from typing import Dict, Optional

from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE


def helios_men_pmsi_annuel_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    men_pmsi_annuel = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2018,
        "nombre_sejours_partiels_medecine": 1.0,
        "nombre_sejours_partiels_obstetrique": 1.0,
        "nombre_sejours_partiels_chirurgie": 1.0,
        "nombre_sejours_complets_medecine": 255.0,
        "nombre_sejours_complets_chirurgie": 6.0,
        "nombre_sejours_complets_obstetrique": 1.0,
        "nombre_journees_completes_ssr": 1074.0,
        "nombre_journees_partiels_ssr": 1.0,
        "nombre_journees_complete_psy": 1.0,
        "nombre_journées_partielles_psy": 1.0,
    }
    if champs_surcharges:
        return {**men_pmsi_annuel, **champs_surcharges}
    return men_pmsi_annuel


def helios_ann_rpu_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    ann_rpu = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2018,
        "nombre_passages_urgences": 100.0,
    }
    if champs_surcharges:
        return {**ann_rpu, **champs_surcharges}
    return ann_rpu

def helios_ann_sae_activite_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    ann_sae_activite = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2018,
        "nombre_journees_usld": 12304.0,
    }
    if champs_surcharges:
        return {**ann_sae_activite, **champs_surcharges}
    return ann_sae_activite

def helios_ann_errd_ej_et_budget_et_finances_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    budget_et_finances = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2018,
        "contribution_frais_de_siege_groupement": -300.0,
        "depenses_groupe_i": -100.0,
        "depenses_groupe_ii": -200.0,
        "depenses_groupe_iii": -300.0,
        "recettes_groupe_i": 150.0,
        "recettes_groupe_ii": 150.0,
        "recettes_groupe_iii": 350.0,
        "resultat_net_comptable": 50.0,
    }
    if champs_surcharges:
        return {**budget_et_finances, **champs_surcharges}
    return budget_et_finances


def helios_ann_ca_ej_et_budget_et_finances_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    budget_et_finances = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2020,
        "depenses_groupe_i": -100.0,
        "depenses_groupe_ii": -200.0,
        "depenses_groupe_iii": -300.0,
        "recettes_groupe_i": 150.0,
        "recettes_groupe_ii": 150.0,
        "recettes_groupe_iii": 350.0,
        "resultat_net_comptable": 50.0,
        "cadre_budgetaire": "CA_PH",
        "taux_de_caf": 0.16,
        "taux_de_vetuste_construction": 0.53,
        "produits": NaN,
        "charges": NaN,
    }
    if champs_surcharges:
        return {**budget_et_finances, **champs_surcharges}
    return budget_et_finances


def helios_ann_errd_ej_budget_et_finances_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    budget_et_finances = {
        "taux_de_caf": 0.071600138178413528,
        "taux_de_vetuste_construction": 0.45555983373892417,
        "fonds_de_roulement": 2206969.259999999800000000,
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2020,
    }
    if champs_surcharges:
        return {**budget_et_finances, **champs_surcharges}
    return budget_et_finances


def helios_activité_sanitaire_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    activité = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2018,
        "nombre_sejours_partiels_medecine": 1.0,
        "nombre_sejours_partiels_obstetrique": 1.0,
        "nombre_sejours_partiels_chirurgie": 1.0,
        "nombre_sejours_complets_medecine": 255.0,
        "nombre_sejours_complets_chirurgie": 6.0,
        "nombre_sejours_complets_obstetrique": 1.0,
        "nombre_journees_completes_ssr": 1074.0,
        "nombre_journees_partiels_ssr": 1.0,
        "nombre_journees_complete_psy": 1.0,
        "nombre_journées_partielles_psy": 1.0,
        "nombre_passages_urgences": 100.0,
        "nombre_journees_usld": 100.0,
        "nombre_sejours_had": 200.0,
    }
    if champs_surcharges:
        return {**activité, **champs_surcharges}
    return activité


def helios_autorisation_médico_social_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    autorisation = {
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

    if champs_surcharges:
        return {**autorisation, **champs_surcharges}
    return autorisation


def helios_autorisation_sanitaire_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    autorisation = {
        "code_activite": "50",
        "code_forme": "02",
        "code_modalite": "78",
        "date_autorisation": date(2022, 1, 1),
        "date_fin": date(2022, 1, 1),
        "date_mise_en_oeuvre": date(2022, 1, 1),
        "libelle_activite": "Soins de suite et de réadaptation non spécialisés",
        "libelle_forme": "Hospitalisation à temps partiel de jour ou de nuit",
        "libelle_modalite": "Juvénile (âge >= 6 ans et < 18 ans)",
        "numero_autorisation_arhgos": "02-00-000",
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
    }

    if champs_surcharges:
        return {**autorisation, **champs_surcharges}
    return autorisation


def helios_date_d_entrée_en_vigueur_du_cpom_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    date_d_entrée_du_cpom = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
        "date_d_entree_en_vigueur": date(2022, 1, 1),
    }

    if champs_surcharges:
        return {**date_d_entrée_du_cpom, **champs_surcharges}
    return date_d_entrée_du_cpom


def helios_équipement_matériel_lourd_sanitaire_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    équipement_matériel_lourd = {
        "code_equipement_materiel_lourd": "05701",
        "date_autorisation": date(2022, 1, 1),
        "date_fin": date(2022, 1, 1),
        "date_mise_en_oeuvre": date(2022, 1, 1),
        "libelle_eml": "Caméra à scintillation sans détecteur d'émission de positons",
        "numero_autorisation_arhgos": "02-00-0000",
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
        "date_ouverture": None,
    }

    if champs_surcharges:
        return {**équipement_matériel_lourd, **champs_surcharges}
    return équipement_matériel_lourd


def helios_autre_activité_sanitaire_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    autre_activité = {
        "code_activite": "A0",
        "code_forme": "15",
        "code_modalite": "00",
        "date_autorisation": date(2022, 1, 1),
        "date_fin": date(2022, 1, 1),
        "date_mise_en_oeuvre": date(2022, 1, 1),
        "libelle_activite": "Installation de chirurgie esthétique",
        "libelle_forme": "Forme non précisée",
        "libelle_modalite": "Pas de modalité",
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
    }

    if champs_surcharges:
        return {**autre_activité, **champs_surcharges}
    return autre_activité


def helios_reconnaissance_contractuelle_sanitaire_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    reconnaissance_contractuelle = {
        "capacite_autorisee": 5,
        "code_activite": "R7",
        "code_forme": "01",
        "code_modalite": "09",
        "date_effet_asr": date(2022, 1, 1),
        "date_effet_cpom": date(2022, 1, 1),
        "date_fin_cpom": date(2022, 1, 1),
        "numero_cpom": "02-00-C00000",
        "libelle_activite": "Surveillance continue",
        "libelle_forme": "Hospitalisation complète (24 heures consécutives ou plus)",
        "libelle_modalite": "Adulte (âge >=18 ans)",
        "numero_autorisation_arhgos": "02-00-RC00000",
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
    }

    if champs_surcharges:
        return {**reconnaissance_contractuelle, **champs_surcharges}
    return reconnaissance_contractuelle


def helios_ann_sae_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    ann_sae = {
        "nombre_lits_chirurgie": 26,
        "nombre_lits_médecine": 62,
        "nombre_lits_obstétrique": 20,
        "nombre_lits_ssr": 30,
        "nombre_places_chirurgie": 7,
        "nombre_places_médecine": 7,
        "nombre_places_obstétrique": 1,
        "nombre_places_ssr": 3,
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE,
        "nombre_lits_usld": 15,
        "nombre_lits_ou_places_psy_complet": 13,
        "nombre_places_psy_partiel": 5,
        "annee": 2023,
    }
    if champs_surcharges:
        return {**ann_sae, **champs_surcharges}
    return ann_sae


def helios_ressources_humaines_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    ressources_humaines = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2019,
        "nombre_cdd_remplacement": 19.0,
        "taux_etp_vacants": 0.0483,
        "taux_prestation_externes": 0.0164,
        "taux_rotation_personnel": 0.1429,
        "taux_absenteisme_maladie_courte_duree": 0.0021,
        "taux_absenteisme_maladie_moyenne_duree": 0.0717,
        "taux_absenteisme_maladie_longue_duree": 0.1194,
        "taux_absenteisme_maternite_paternite": 0.0,
        "taux_absenteisme_accident_maladie_professionnelle": 0.0246,
        "taux_absenteisme_conges_speciaux": 0.0,
        "taux_absenteisme_hors_formation": 0.2179,
        "nombre_etp_realises": 172.0,
    }
    if champs_surcharges:
        return {**ressources_humaines, **champs_surcharges}
    return ressources_humaines


def helios_quo_san_finance_budget_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    budget_et_finances = {
        "numero_finess_entite_juridique": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
        "annee": 2018,
        "depenses_titre_i_global": -100.0,
        "depenses_titre_ii_global": -200.0,
        "depenses_titre_iii_global": -300.0,
        "depenses_titre_iv_global": -300.0,
        "recettes_titre_i_global": 150.0,
        "recettes_titre_ii_global": 150.0,
        "recettes_titre_iii_global": 350.0,
        "recettes_titre_iv_global": 50.0,
        "depenses_titre_i_h": -100.0,
        "depenses_titre_ii_h": -100.0,
        "depenses_titre_iii_h": -200.0,
        "depenses_titre_iv_h": -300.0,
        "recettes_titre_i_h": 50.0,
        "recettes_titre_ii_h": 150.0,
        "recettes_titre_iii_h": 50.0,
        "resultat_net_comptable_san": 0.10,
        "taux_de_caf_nette_san": 0.01,
        "ratio_dependance_financiere": 0.10,
    }
    if champs_surcharges:
        return {**budget_et_finances, **champs_surcharges}
    return budget_et_finances
