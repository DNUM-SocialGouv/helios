from typing import Dict, List, TypedDict

class ColonneHelios(TypedDict):
    nom: str
    type: type


EquivalencesSivssHelios = Dict[str, ColonneHelios]

equivalences_sivss_evenements_indesirables_helios: EquivalencesSivssHelios = {
    "SCC_ORGANISME_FINESS": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "DECLARANT_ORGANISME_NUMERO_FINESS": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "DATE_RECEPTION": ColonneHelios(nom="annee", type=str),
    "FAMILLE_PRINCIPALE": ColonneHelios(nom="famille_principale", type=str),
    "NATURE_PRINCIPALE": ColonneHelios(nom="nature_principale", type=str),
    "NUMERO_SIVSS": ColonneHelios(nom="numero_sivss", type=str),
    "EST_EIGS": ColonneHelios(nom="est_eigs", type=bool),
    "ETAT": ColonneHelios(nom="etat", type=str),
    "DATE_CLOTURE": ColonneHelios(nom="date_cloture", type=str),
    "MOTIF_CLOTURE": ColonneHelios(nom="motif_cloture", type=str),
}

equivalences_sivss_evenements_indesirables_helios_base: EquivalencesSivssHelios = {
    "FINESS": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "DATE_RECEPTION": ColonneHelios(nom="annee", type=str),
    "FAMILLE_PRINCIPALE": ColonneHelios(nom="famille_principale", type=str),
    "NATURE_PRINCIPALE": ColonneHelios(nom="nature_principale", type=str),
    "NUMERO_SIVSS": ColonneHelios(nom="numero_sivss", type=str),
    "EST_EIGS": ColonneHelios(nom="est_eigs", type=bool),
    "ETAT": ColonneHelios(nom="etat", type=str),
    "DATE_CLOTURE": ColonneHelios(nom="date_cloture", type=str),
    "MOTIF_CLOTURE": ColonneHelios(nom="motif_cloture", type=str),
}

colonnes_a_lire_bloc_qualite_evenements_indesirables: List[str] = list(equivalences_sivss_evenements_indesirables_helios.keys())

index_evenement_indesirable: List[str] = [
    "annee",
    "numero_finess_etablissement_territorial",
    "numero_sivss"
]

def extrais_l_equivalence_des_types_des_colonnes(equivalences: EquivalencesSivssHelios) -> Dict[str, type]:
    return {nom_ei: colonne_evenement_indesirable["type"] for nom_ei, colonne_evenement_indesirable in equivalences.items()}


def extrais_l_equivalence_des_noms_des_colonnes(equivalences: EquivalencesSivssHelios) -> Dict[str, str]:
    return {nom_ei: colonne_evenement_indesirable["nom"] for nom_ei, colonne_evenement_indesirable in equivalences.items()}