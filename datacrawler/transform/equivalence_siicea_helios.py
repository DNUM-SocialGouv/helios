from typing import Dict, List, TypedDict

class ColonneHelios(TypedDict):
    nom: str
    type: type


EquivalencesSiiceaHelios = Dict[str, ColonneHelios]

equivalences_siicea_helios: EquivalencesSiiceaHelios = {
    "Code FINESS": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "Type de mission": ColonneHelios(nom="type_mission", type=str),
    "Thème régional": ColonneHelios(nom="theme_regional", type=str),
    "Type de planification": ColonneHelios(nom="type_plannification", type=str),
    "Date réelle Visite": ColonneHelios(nom="date_visite", type=str),
    "Date réelle Rapport": ColonneHelios(nom="date_rapport", type=str),
    "Nombre d écarts": ColonneHelios(nom="nombre_ecart", type=int),
    "Nombre de remarques": ColonneHelios(nom="nombre_remarque", type=int),
    "Injonction": ColonneHelios(nom="injonction", type=int),
    "Prescription": ColonneHelios(nom="prescription", type=int),
    "Recommandation": ColonneHelios(nom="recommandation", type=int),
    "Saisine CNG": ColonneHelios(nom="saisine_cng", type=int),
    "Saisine juridiction/ordinale": ColonneHelios(nom="saisine_juridiction", type=int),
    "Saisine parquet": ColonneHelios(nom="saisine_parquet", type=int),
    "Autre saisine": ColonneHelios(nom="saisine_autre", type=int),
    "Statut de la mission": ColonneHelios(nom="statut_mission", type=str),
}

colonnes_a_lire_bloc_qualite_inspections: List[str] = list(equivalences_siicea_helios.keys())

index_evenement_indesirable: List[str] = [
    "numero_finess_etablissement_territorial"
]

def extrais_l_equivalence_des_types_des_colonnes(equivalences: EquivalencesSiiceaHelios) -> Dict[str, type]:
    return {nom_inspection: colonne_siicea["type"] for nom_inspection, colonne_siicea in equivalences.items()}


def extrais_l_equivalence_des_noms_des_colonnes(equivalences: EquivalencesSiiceaHelios) -> Dict[str, str]:
    return {nom_inspection: colonne_siicea["nom"] for nom_inspection, colonne_siicea in equivalences.items()}