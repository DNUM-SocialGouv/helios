from typing import TypedDict


class ColonneHelios(TypedDict):
    nom: str
    type: type


équivalences_diamant_helios = {
    "Finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Année": ColonneHelios(nom="annee", type=int),
    "Taux d'occupation des lits autorisés en accueil de jour": ColonneHelios(nom="taux_occupation_accueil_de_jour", type=float),
    "Taux d'occupation des lits autorisés en hébergement temporaire": ColonneHelios(nom="taux_occupation_en_hebergement_temporaire", type=float),
    "Taux d'occupation des places autorisées en hébergement permanent": ColonneHelios(nom="taux_occupation_en_hebergement_permanent", type=float),
}

index_des_activités_médico_sociales = [
    équivalences_diamant_helios["Année"]["nom"],
    équivalences_diamant_helios["Finess"]["nom"],
]

colonnes_à_lire_ann_errd_ej_et = list(équivalences_diamant_helios.keys())
