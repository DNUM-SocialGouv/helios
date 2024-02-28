from typing import Dict, List, TypedDict

class ColonneHelios(TypedDict):
    nom: str
    type: type


EquivalencesSirecHelios = Dict[str, ColonneHelios]

equivalences_sirec_reclamations_helios: EquivalencesSirecHelios = {
    "NDEG_FINESS_RPPS": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "ANNEE_DE_RECEPTION": ColonneHelios(nom="annee", type=int),
    "ENCOURS_NB_RECLA_TOTAL": ColonneHelios(nom="encours_total", type=float),
    "ENCOURS_NB_RECLA_MOTIF_10": ColonneHelios(nom="encours_motif_10", type=float),
    "ENCOURS_NB_RECLA_MOTIF_11": ColonneHelios(nom="encours_motif_11", type=float),
    "ENCOURS_NB_RECLA_MOTIF_12": ColonneHelios(nom="encours_motif_12", type=float),
    "ENCOURS_NB_RECLA_MOTIF_13": ColonneHelios(nom="encours_motif_13", type=float),
    "ENCOURS_NB_RECLA_MOTIF_14": ColonneHelios(nom="encours_motif_14", type=float),
    "ENCOURS_NB_RECLA_MOTIF_15": ColonneHelios(nom="encours_motif_15", type=float),
    "ENCOURS_NB_RECLA_MOTIF_16": ColonneHelios(nom="encours_motif_16", type=float),
    "ENCOURS_NB_RECLA_MOTIF_17": ColonneHelios(nom="encours_motif_17", type=float),
    "ENCOURS_NB_RECLA_MOTIF_18": ColonneHelios(nom="encours_motif_18", type=float),
    "ENCOURS_NB_RECLA_MOTIF_19": ColonneHelios(nom="encours_motif_19", type=float),
    "ENCOURS_NB_RECLA_MOTIF_155": ColonneHelios(nom="encours_motif_155", type=float),
    "ENCOURS_NB_RECLA_MOTIF_156": ColonneHelios(nom="encours_motif_156", type=float),
    "CLOT_NB_RECLA_TOTAL": ColonneHelios(nom="clot_total", type=float),
    "CLOT_NB_RECLA_MOTIF_10": ColonneHelios(nom="clot_motif_10", type=float),
    "CLOT_NB_RECLA_MOTIF_11": ColonneHelios(nom="clot_motif_11", type=float),
    "CLOT_NB_RECLA_MOTIF_12": ColonneHelios(nom="clot_motif_12", type=float),
    "CLOT_NB_RECLA_MOTIF_13": ColonneHelios(nom="clot_motif_13", type=float),
    "CLOT_NB_RECLA_MOTIF_14": ColonneHelios(nom="clot_motif_14", type=float),
    "CLOT_NB_RECLA_MOTIF_15": ColonneHelios(nom="clot_motif_15", type=float),
    "CLOT_NB_RECLA_MOTIF_16": ColonneHelios(nom="clot_motif_16", type=float),
    "CLOT_NB_RECLA_MOTIF_17": ColonneHelios(nom="clot_motif_17", type=float),
    "CLOT_NB_RECLA_MOTIF_18": ColonneHelios(nom="clot_motif_18", type=float),
    "CLOT_NB_RECLA_MOTIF_19": ColonneHelios(nom="clot_motif_19", type=float),
    "CLOT_NB_RECLA_MOTIF_155": ColonneHelios(nom="clot_motif_155", type=float),
    "CLOT_NB_RECLA_MOTIF_156": ColonneHelios(nom="clot_motif_156", type=float),
}

colonnes_a_lire_bloc_qualite_reclamations: List[str] = list(equivalences_sirec_reclamations_helios.keys())

index_reclamations: List[str] = [
    "annee",
    "numero_finess_etablissement_territorial",
]

def extrais_l_equivalence_des_types_des_colonnes(equivalences: EquivalencesSirecHelios) -> Dict[str, type]:
    return {nom_rec: colonne_reclamation["type"] for nom_rec, colonne_reclamation in equivalences.items()}


def extrais_l_equivalence_des_noms_des_colonnes(equivalences: EquivalencesSirecHelios) -> Dict[str, str]:
    return {nom_rec: colonne_reclamation["nom"] for nom_rec, colonne_reclamation in equivalences.items()}