from typing import Dict, List, TypedDict


class ColonneHelios(TypedDict):
    nom: str
    type: type


EquivalencesHasHelios = Dict[str, ColonneHelios]

equivalences_qualite_has_helios_base: EquivalencesHasHelios = {
    "finess": ColonneHelios(nom="numero_finess_etablissement_territorial", type=str),
    "score_all_rea_ajust_dp": ColonneHelios(nom="score_appreciation_mco", type=float),
    "score_all_ajust_dp_ca": ColonneHelios(nom="score_appreciation_ca", type=float),
    "mco_dpa_pcd_2018-pcd_resultat": ColonneHelios(nom="score_prise_en_charge_douleur", type=float),
    "mco_dpa_pcd_2018-pcd_classe": ColonneHelios(nom="classe_prise_en_charge_douleur", type=str),
    "certification_ref_2021_decision": ColonneHelios(nom="certification_note", type=float),
    "certification_ref_2021_date_decision": ColonneHelios(nom="certification_date", type=str),
}

index_qualite_has: List[str] = ["numero_finess_etablissement_territorial"]

def extrais_l_equivalence_des_noms_des_colonnes(equivalences: EquivalencesHasHelios) -> Dict[str, str]:
    return {nom_ei: colonne_qualite_has["nom"] for nom_ei, colonne_qualite_has in equivalences.items()}
