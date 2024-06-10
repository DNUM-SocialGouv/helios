from typing import Dict, List, TypedDict

import pandas as pd


class ColonneHelios(TypedDict):
    nom: str
    type: type


ÉquivalencesDiamantHelios = Dict[str, ColonneHelios]

équivalences_diamant_ann_errd_ej_et_bloc_activités_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Taux d'occupation des lits autorisés en accueil de jour": ColonneHelios(nom="taux_occupation_accueil_de_jour", type=float),
    "Taux d'occupation des lits autorisés en hébergement temporaire": ColonneHelios(nom="taux_occupation_en_hebergement_temporaire", type=float),
    "Taux d'occupation des places autorisées en hébergement permanent": ColonneHelios(nom="taux_occupation_en_hebergement_permanent", type=float),
}

colonnes_à_lire_bloc_activités_ann_errd_ej_et: List[str] = list(équivalences_diamant_ann_errd_ej_et_bloc_activités_helios.keys())

index_des_activités: List[str] = [
    "annee",
    "numero_finess_etablissement_territorial",
]

équivalences_diamant_ann_ms_tdp_et_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Nombre moyen de journées d'absence des personnes accompagnées sur la période": ColonneHelios(
        nom="nombre_moyen_journees_absence_personnes_accompagnees", type=float
    ),
    "Durée moyenne de séjour/d'accompagnement": ColonneHelios(nom="duree_moyenne_sejour_accompagnement_personnes_sorties", type=float),
    "Taux de réalisation de l’activité Tout ESMS (Hors services CAMSP et CMPP)": ColonneHelios(nom="taux_realisation_activite", type=float),
    "Taux de réalisation de l’activité CAMSP et CMPP": ColonneHelios(nom="taux_realisation_activite", type=float),
    "File active des personnes accompagnées sur la période": ColonneHelios(nom="file_active_personnes_accompagnees", type=float),
}

colonnes_à_lire_ann_ms_tdp_et: List[str] = list(équivalences_diamant_ann_ms_tdp_et_helios.keys())

équivalences_diamant_men_pmsi_annuel_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Nombre de séjours HTP/AMBU Médecine": ColonneHelios(nom="nombre_sejours_partiels_medecine", type=float),
    "Nombre de séjours HTP/AMBU Obstétrique": ColonneHelios(nom="nombre_sejours_partiels_obstetrique", type=float),
    "Nombre de séjours HTP/AMBU Chirurgie": ColonneHelios(nom="nombre_sejours_partiels_chirurgie", type=float),
    "Nombre de séjours HC Médecine": ColonneHelios(nom="nombre_sejours_complets_medecine", type=float),
    "Nombre de séjours HC Chirurgie": ColonneHelios(nom="nombre_sejours_complets_chirurgie", type=float),
    "Nombre de séjours HC Obstétrique": ColonneHelios(nom="nombre_sejours_complets_obstetrique", type=float),
    "Nombre de journées hospit complète SSR": ColonneHelios(nom="nombre_journees_completes_ssr", type=float),
    "Nombre de journées HTP SSR": ColonneHelios(nom="nombre_journees_partiels_ssr", type=float),
    "Nb journées hospit complète PSY": ColonneHelios(nom="nombre_journees_complete_psy", type=float),
    "Nb journées HTP PSY": ColonneHelios(nom="nombre_journées_partielles_psy", type=float),
    "Nombre total de séjours HAD": ColonneHelios(nom="nombre_sejours_had", type=float),
}

colonnes_à_lire_men_pmsi_annuel: List[str] = list(équivalences_diamant_men_pmsi_annuel_helios.keys())

équivalences_diamant_ann_rpu_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Nombre de passages aux urgences": ColonneHelios(nom="nombre_passages_urgences", type=float),
}

colonnes_à_lire_ann_rpu: List[str] = list(équivalences_diamant_ann_rpu_helios.keys())

équivalences_diamant_ann_sae_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Nombre de places de chirurgie": ColonneHelios(nom="nombre_places_chirurgie", type=float),
    "Nombre de places d'obstétrique": ColonneHelios(nom="nombre_places_obstétrique", type=float),
    "Nombre de places de médecine": ColonneHelios(nom="nombre_places_médecine", type=float),
    "Nombre de places de SSR": ColonneHelios(nom="nombre_places_ssr", type=float),
    "Nombre de lits de chirurgie": ColonneHelios(nom="nombre_lits_chirurgie", type=float),
    "Nombre de lits d'obstétrique": ColonneHelios(nom="nombre_lits_obstétrique", type=float),
    "Nombre de lits de médecine": ColonneHelios(nom="nombre_lits_médecine", type=float),
    "Nombre de lits de SSR": ColonneHelios(nom="nombre_lits_ssr", type=float),
    "Nombre de lits USLD": ColonneHelios(nom="nombre_lits_usld", type=float),
    "Nb de lits et places PSY PeC temps complet": ColonneHelios(nom="nombre_lits_ou_places_psy_complet", type=float),
    "Nb de places PSY PeC temps partiel hors ambu": ColonneHelios(nom="nombre_places_psy_partiel", type=float),
}

colonnes_à_lire_ann_sae: List[str] = list(équivalences_diamant_ann_sae_helios.keys())
index_des_capacités_sanitaires: List[str] = ["numero_finess_etablissement_territorial"]

équivalences_diamant_ann_ms_tdp_et_cpom_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Date d'entrée en vigueur du CPOM": ColonneHelios(nom="date_d_entree_en_vigueur", type=str),
}

colonnes_à_lire_ann_ms_tdp_et_cpom: List[str] = list(équivalences_diamant_ann_ms_tdp_et_cpom_helios.keys())
index_des_dates_d_entrée_en_vigueur_des_cpom = ["numero_finess_etablissement_territorial"]

équivalences_diamant_ann_errd_ej_et_bloc_budget_et_finances_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "655 Quotes-parts de résultat sur opérations faites en commun": ColonneHelios(nom="contribution_frais_de_siege_groupement", type=float),
    "Dépenses Groupe I ERRD": ColonneHelios(nom="depenses_groupe_i", type=float),
    "Dépenses Groupe II ERRD": ColonneHelios(nom="depenses_groupe_ii", type=float),
    "Dépenses Groupe III ERRD": ColonneHelios(nom="depenses_groupe_iii", type=float),
    "Recettes Groupe I ERRD": ColonneHelios(nom="recettes_groupe_i", type=float),
    "Recettes Groupe II ERRD": ColonneHelios(nom="recettes_groupe_ii", type=float),
    "Recettes Groupe III ERRD": ColonneHelios(nom="recettes_groupe_iii", type=float),
    "MS Résultat net comptable ERRD": ColonneHelios(nom="resultat_net_comptable", type=float),
}

colonnes_à_lire_bloc_budget_et_finances_ann_errd_ej_et: List[str] = list(équivalences_diamant_ann_errd_ej_et_bloc_budget_et_finances_helios.keys())
index_du_bloc_budget_et_finances: List[str] = [
    "annee",
    "numero_finess_etablissement_territorial",
]

équivalences_diamant_ann_ca_ej_et_bloc_budget_et_finances_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "MS Résultat net comptable CA PH": ColonneHelios(nom="resultat_net_comptable", type=float),
    "Taux de CAF CA PH": ColonneHelios(nom="taux_de_caf", type=float),
    "Taux vétusté Construction CA": ColonneHelios(nom="taux_de_vetuste_construction", type=float),
    "MS Résultat net comptable CA PA": ColonneHelios(nom="resultat_net_comptable", type=float),
    "Charges CA PA": ColonneHelios(nom="charges", type=float),
    "Produits CA PA": ColonneHelios(nom="produits", type=float),
    "Recettes Groupe I CA": ColonneHelios(nom="recettes_groupe_i", type=float),
    "Recettes Groupe II CA": ColonneHelios(nom="recettes_groupe_ii", type=float),
    "Recettes Groupe III CA": ColonneHelios(nom="recettes_groupe_iii", type=float),
    "Dépenses Groupe I CA": ColonneHelios(nom="depenses_groupe_i", type=float),
    "Dépenses Groupe II CA": ColonneHelios(nom="depenses_groupe_ii", type=float),
    "Dépenses Groupe III CA": ColonneHelios(nom="depenses_groupe_iii", type=float),
}

colonnes_à_lire_bloc_budget_et_finances_ann_ca_ej_et: List[str] = list(équivalences_diamant_ann_ca_ej_et_bloc_budget_et_finances_helios.keys())

équivalences_diamant_ann_errd_ej_bloc_budget_et_finances_helios: ÉquivalencesDiamantHelios = {
    # Des valeurs manquantes dans les colonnes Id dépôt et année empêchent d'utiliser le type simple 'int'
    "Id Dépôt": ColonneHelios(nom="", type=pd.Int64Dtype()),  # type: ignore
    "Année": ColonneHelios(nom="annee", type=pd.Int64Dtype()),  # type: ignore
    "Taux de CAF ERRD": ColonneHelios(nom="taux_de_caf", type=float),
    "Taux vétusté Construction ERRD": ColonneHelios(nom="taux_de_vetuste_construction", type=float),
    "Fonds de roulement net global ERRD": ColonneHelios(nom="fonds_de_roulement", type=float),
}

colonnes_à_lire_bloc_budget_et_finances_ann_errd_ej: List[str] = list(équivalences_diamant_ann_errd_ej_bloc_budget_et_finances_helios.keys())

équivalences_diamant_per_errd_eprd_bloc_budget_et_finances_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Id Dépôt": ColonneHelios(nom="", type=int),
}

colonnes_à_lire_bloc_budget_et_finances_per_errd_eprd: List[str] = list(équivalences_diamant_per_errd_eprd_bloc_budget_et_finances_helios.keys())

équivalences_diamant_ann_ms_tdp_et_ressources_humaines_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Nombre de CDD de remplacement": ColonneHelios(nom="nombre_cdd_remplacement", type=float),
    "Taux d'ETP vacants au 31/12": ColonneHelios(nom="taux_etp_vacants", type=float),
    "Taux de prestations externes sur les prestations directes": ColonneHelios(nom="taux_prestation_externes", type=float),
    "Taux de rotation du personnel sur effectifs réels": ColonneHelios(nom="taux_rotation_personnel", type=float),
    "Taux d'absentéisme pour maladie ordinaire/courte durée": ColonneHelios(nom="taux_absenteisme_maladie_courte_duree", type=float),
    "Taux d'absentéisme pour maladie moyenne durée": ColonneHelios(nom="taux_absenteisme_maladie_moyenne_duree", type=float),
    "Taux d'absentéisme pour maladie longue durée": ColonneHelios(nom="taux_absenteisme_maladie_longue_duree", type=float),
    "Taux d'absentéisme pour maternité/paternité": ColonneHelios(nom="taux_absenteisme_maternite_paternite", type=float),
    "Taux d'absentéisme pour accident du travail / maladie professionnelle": ColonneHelios(nom="taux_absenteisme_accident_maladie_professionnelle", type=float),
    "Taux d'absentéisme pour congés spéciaux dont sans solde": ColonneHelios(nom="taux_absenteisme_conges_speciaux", type=float),
    "Taux d'absentéisme (hors formation)": ColonneHelios(nom="taux_absenteisme_hors_formation", type=float),
}
colonnes_à_lire_bloc_ressources_humaines_ann_ms_tdp_et: List[str] = list(équivalences_diamant_ann_ms_tdp_et_ressources_humaines_helios.keys())
index_du_bloc_ressources_humaines: List[str] = [
    "annee",
    "numero_finess_etablissement_territorial",
]

équivalences_diamant_ann_errd_ej_et_ressources_humaines_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Nombre ETP total réalisé ERRD": ColonneHelios(nom="nombre_etp_realises", type=float),
}
colonnes_à_lire_bloc_ressources_humaines_ann_errd_ej_et: List[str] = list(équivalences_diamant_ann_errd_ej_et_ressources_humaines_helios.keys())

équivalences_diamant_ann_ca_ej_et_ressources_humaines_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Nombre ETP total réalisé CA": ColonneHelios(nom="nombre_etp_realises", type=float),
}
colonnes_à_lire_bloc_ressources_humaines_ann_ca_ej_et: List[str] = list(équivalences_diamant_ann_ca_ej_et_ressources_humaines_helios.keys())

équivalences_diamant_quo_san_finance_buget_finance_helios: ÉquivalencesDiamantHelios = {
    "Finess EJ": ColonneHelios(nom="numero_finess_entite_juridique", type=str),
    "Finess ET": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Dépenses Titre I Budget global": ColonneHelios(nom="depenses_titre_i_global", type=float),
    "Dépenses Titre II Budget global": ColonneHelios(nom="depenses_titre_ii_global", type=float),
    "Dépenses Titre III Budget global": ColonneHelios(nom="depenses_titre_iii_global", type=float),
    "Dépenses Titre IV Budget global": ColonneHelios(nom="depenses_titre_iv_global", type=float),
    "Recettes Titre I Budget global": ColonneHelios(nom="recettes_titre_i_global", type=float),
    "Recettes Titre II Budget global": ColonneHelios(nom="recettes_titre_ii_global", type=float),
    "Recettes Titre III Budget global": ColonneHelios(nom="recettes_titre_iii_global", type=float),
    "Recettes Titre IV Budget global": ColonneHelios(nom="recettes_titre_iv_global", type=float),
    "Dépenses Titre I Budget H": ColonneHelios(nom="depenses_titre_i_h", type=float),
    "Dépenses Titre II Budget H": ColonneHelios(nom="depenses_titre_ii_h", type=float),
    "Dépenses Titre III Budget H": ColonneHelios(nom="depenses_titre_iii_h", type=float),
    "Dépenses Titre IV Budget H": ColonneHelios(nom="depenses_titre_iv_h", type=float),
    "Recettes Titre I Budget H": ColonneHelios(nom="recettes_titre_i_h", type=float),
    "Recettes Titre II Budget H": ColonneHelios(nom="recettes_titre_ii_h", type=float),
    "Recettes Titre III Budget H": ColonneHelios(nom="recettes_titre_iii_h", type=float),
    "SAN Résultat net comptable": ColonneHelios(nom="resultat_net_comptable_san", type=float),
    "SAN Taux de CAF nette": ColonneHelios(nom="taux_de_caf_nette_san", type=float),
    "Ratio de dépendance financière": ColonneHelios(nom="ratio_dependance_financiere", type=float),
}

colonnes_a_lire_bloc_budget_finance_entite_juridique: List[str] = list(équivalences_diamant_quo_san_finance_buget_finance_helios.keys())
index_du_bloc_budget_et_finances_entite_juridique: List[str] = ["numero_finess_entite_juridique", "annee"]
index_du_bloc_budget_et_finances_etablissement_territorial: List[str] = ["numero_finess_etablissement_territorial", "annee"]


def extrais_l_equivalence_des_types_des_colonnes(équivalences: ÉquivalencesDiamantHelios) -> Dict[str, type]:
    return {nom_diamant: colonne_diamant["type"] for nom_diamant, colonne_diamant in équivalences.items()}


def extrais_l_equivalence_des_noms_des_colonnes(équivalences: ÉquivalencesDiamantHelios) -> Dict[str, str]:
    return {nom_diamant: colonne_diamant["nom"] for nom_diamant, colonne_diamant in équivalences.items()}
