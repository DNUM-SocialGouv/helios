from typing import TypedDict, List, Dict


class ColonneHelios(TypedDict):
    nom: str
    type: type


équivalences_diamant_helios: Dict = {
    "Finess": ColonneHelios(nom="numérofinessÉtablissementterritorial", type=str),
    "Année": ColonneHelios(nom="année", type=int),
    "Taux d'occupation des lits autorisés en accueil de jour": ColonneHelios(nom="tauxoccupationaccueildejour", type=float),
    "Taux d'occupation des lits autorisés en hébergement temporaire": ColonneHelios(nom="tauxoccupationhébergementtemporaire", type=float),
    "Taux d'occupation des places autorisées en hébergement permanent": ColonneHelios(nom="tauxoccupationhébergementpermanent", type=float),
}

index_des_activités_médico_sociales: List = [
    équivalences_diamant_helios["Année"]["nom"],
    équivalences_diamant_helios["Finess"]["nom"],
]

colonnes_à_lire_ann_errd_ej_et: List = list(équivalences_diamant_helios.keys())
