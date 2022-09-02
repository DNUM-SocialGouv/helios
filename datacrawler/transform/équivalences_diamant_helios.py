from typing import Dict, List, TypedDict


class ColonneHelios(TypedDict):
    nom: str
    type: type


ÉquivalencesDiamantHelios = Dict[str, ColonneHelios]

équivalences_diamant_ann_errd_ej_et_helios: ÉquivalencesDiamantHelios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Taux d'occupation des lits autorisés en accueil de jour": ColonneHelios(nom="taux_occupation_accueil_de_jour", type=float),
    "Taux d'occupation des lits autorisés en hébergement temporaire": ColonneHelios(nom="taux_occupation_en_hebergement_temporaire", type=float),
    "Taux d'occupation des places autorisées en hébergement permanent": ColonneHelios(nom="taux_occupation_en_hebergement_permanent", type=float),
}

colonnes_à_lire_ann_errd_ej_et: List[str] = list(équivalences_diamant_ann_errd_ej_et_helios.keys())

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
}

colonnes_à_lire_ann_sae: List[str] = list(équivalences_diamant_ann_sae_helios.keys())
index_des_capacités_sanitaires: List[str] = ["numero_finess_etablissement_territorial"]


def extrais_l_equivalence_des_types_des_colonnes(équivalences: ÉquivalencesDiamantHelios) -> Dict[str, type]:
    return {nom_diamant: colonne_diamant["type"] for nom_diamant, colonne_diamant in équivalences.items()}


def extrais_l_equivalence_des_noms_des_colonnes(équivalences: ÉquivalencesDiamantHelios) -> Dict[str, str]:
    return {nom_diamant: colonne_diamant["nom"] for nom_diamant, colonne_diamant in équivalences.items()}
