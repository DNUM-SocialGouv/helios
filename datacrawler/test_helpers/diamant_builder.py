from typing import Dict, Optional

from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT


def csv_ann_ms_tdp_et_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, object]:
    ann_ms_tdp_et = {
        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "Année": 2018,
        "Nombre moyen de journées d'absence des personnes accompagnées sur la période": 31.41,
        "Durée moyenne de séjour/d'accompagnement": 904.17,
        "Taux de réalisation de l’activité Tout ESMS (Hors services CAMSP et CMPP)": 0.9256,
        "Taux de réalisation de l’activité CAMSP et CMPP": 0.6789,
        "File active des personnes accompagnées sur la période": 94,
    }
    if champs_surchargés:
        return {**ann_ms_tdp_et, **champs_surchargés}
    return ann_ms_tdp_et


def csv_men_pmsi_annuel_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, object]:
    men_pmsi_annuel = {
        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "Année": 2018,
        "Nombre de séjours HTP/AMBU Médecine": 1.0,
        "Nombre de séjours HTP/AMBU Obstétrique": 1.0,
        "Nombre de séjours HTP/AMBU Chirurgie": 1.0,
        "Nombre de séjours HC Médecine": 255.0,
        "Nombre de séjours HC Chirurgie": 6.0,
        "Nombre de séjours HC Obstétrique": 1.0,
        "Nombre de journées hospit complète SSR": 1074.0,
        "Nombre de journées HTP SSR": 1.0,
        "Nb journées hospit complète PSY": 1.0,
        "Nb journées HTP PSY": 1.0,
    }
    if champs_surchargés:
        return {**men_pmsi_annuel, **champs_surchargés}
    return men_pmsi_annuel


def csv_ann_rpu_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, object]:
    ann_rpu = {
        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "Année": 2018,
        "Nombre de passages aux urgences": 100.0,
    }
    if champs_surchargés:
        return {**ann_rpu, **champs_surchargés}
    return ann_rpu


def csv_ann_errd_ej_et_budget_et_finances_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, object]:
    ann_errd_ej_et_budget_et_finances = {
        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "Année": 2018,
        "655 Quotes-parts de résultat sur opérations faites en commun": -300.0,
        "Dépenses Groupe I ERRD": -100.0,
        "Dépenses Groupe II ERRD": -200.0,
        "Dépenses Groupe III ERRD": -300.0,
        "Recettes Groupe I ERRD": 150.0,
        "Recettes Groupe II ERRD": 150.0,
        "Recettes Groupe III ERRD": 350.0,
        "MS Résultat net comptable ERRD": 50.0,
    }
    if champs_surchargés:
        return {**ann_errd_ej_et_budget_et_finances, **champs_surchargés}
    return ann_errd_ej_et_budget_et_finances


def csv_ann_per_errd_eprd_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, object]:
    ann_per_errd_eprd_budget_et_finances = {
        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "Année": 2020,
        "Id Dépôt": 111111,
    }
    if champs_surchargés:
        return {**ann_per_errd_eprd_budget_et_finances, **champs_surchargés}
    return ann_per_errd_eprd_budget_et_finances


def csv_ann_errd_ej_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, float]:
    ann_errd_ej_budget_et_finances = {
        "Année": 2020,
        "Id Dépôt": 111111,
        "Taux de CAF ERRD": 0.071600138178413528,
        "Taux vétusté Construction ERRD": 0.45555983373892417,
        "Fonds de roulement net global ERRD": 2206969.259999999800000000,
    }
    if champs_surchargés:
        return {**ann_errd_ej_budget_et_finances, **champs_surchargés}
    return ann_errd_ej_budget_et_finances


def csv_ann_ca_ej_et_budget_et_finances_builder(
    cadre_budgétaire: str,
    champs_surchargés: Optional[Dict] = None,
) -> Dict[str, object]:
    ann_ca_ej_et_budget_et_finances = (
        {
            "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
            "Année": 2020,
            "MS Résultat net comptable CA PH": 50.0,
            "Taux de CAF CA PH": 0.16,
            "Taux vétusté Construction CA": 0.53,
            "MS Résultat net comptable CA PA": NaN,
            "Charges CA PA": NaN,
            "Produits CA PA": NaN,
            "Recettes Groupe I CA": 150.0,
            "Recettes Groupe II CA": 150.0,
            "Recettes Groupe III CA": 350.0,
            "Dépenses Groupe I CA": -100.0,
            "Dépenses Groupe II CA": -200.0,
            "Dépenses Groupe III CA": -300.0,
        }
        if cadre_budgétaire == "CA_PH"
        else {
            "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
            "Année": 2020,
            "MS Résultat net comptable CA PH": NaN,
            "Taux de CAF CA PH": 0.16,
            "Taux vétusté Construction CA": 0.53,
            "MS Résultat net comptable CA PA": 100.0,
            "Charges CA PA": -200.0,
            "Produits CA PA": 300,
            "Recettes Groupe I CA": NaN,
            "Recettes Groupe II CA": NaN,
            "Recettes Groupe III CA": NaN,
            "Dépenses Groupe I CA": NaN,
            "Dépenses Groupe II CA": NaN,
            "Dépenses Groupe III CA": NaN,
        }
    )
    if champs_surchargés:
        return {**ann_ca_ej_et_budget_et_finances, **champs_surchargés}
    return ann_ca_ej_et_budget_et_finances


def csv_ann_sae_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, str | object]:
    ann_sae = {
        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "Année": 2020,
        "Nombre de places de chirurgie": 7.0,
        "Nombre de places d'obstétrique": 1.0,
        "Nombre de places de médecine": 7.0,
        "Nombre de places de SSR": NaN,
        "Nombre de lits de chirurgie": 26.0,
        "Nombre de lits d'obstétrique": 20.0,
        "Nombre de lits de médecine": 62.0,
        "Nombre de lits de SSR": 30.0,
        "Nombre de lits USLD": 15.0,
        "Nb de lits et places PSY PeC temps complet": 5.0,
        "Nb de places PSY PeC temps partiel hors ambu": 13.0,
    }
    if champs_surchargés:
        return {**ann_sae, **champs_surchargés}
    return ann_sae
