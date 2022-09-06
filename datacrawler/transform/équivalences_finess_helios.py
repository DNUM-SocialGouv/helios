from typing import List

équivalences_finess_cs1400105_helios = {
    "ta": "activite",
    "capautot": "capacite_autorisee_totale",
    "capinstot": "capacite_installee_totale",
    "client": "clientele",
    "dateautor": "date_autorisation",
    "datederinst": "date_derniere_installation",
    "datemajaut": "date_mise_a_jour_autorisation",
    "de": "discipline_equipement",
    "indsupinst": "est_installee",
    "libta": "libelle_activite",
    "libclient": "libelle_clientele",
    "libde": "libelle_discipline_equipement",
    "nofinesset": "numero_finess_etablissement_territorial",
}
colonnes_à_garder_finess_cs1400105 = list(équivalences_finess_cs1400105_helios.keys())
balises_à_échapper_finess_cs1400105 = ["nofinesset", "de", "ta", "client"]
XPATH_FINESS_CS1400105 = "./equipementsocial"

index_des_autorisations_médico_sociaux: List[str] = [
    "numero_finess_etablissement_territorial",
    "discipline_equipement",
    "activite",
    "clientele",
]

équivalences_finess_cs1400103_helios = {
    "activite": "code_activite",
    "dateautor": "date_autorisation",
    "datefin": "date_fin",
    "datemeo": "date_mise_en_oeuvre",
    "forme": "code_forme",
    "libactivite": "libelle_activite",
    "libforme": "libelle_forme",
    "libmodalite": "libelle_modalite",
    "modalite": "code_modalite",
    "noautorarhgos": "numero_autorisation_arhgos",
    "nofinesset": "numero_finess_etablissement_territorial",
}
colonnes_à_garder_finess_cs1400103 = list(équivalences_finess_cs1400103_helios.keys())
XPATH_FINESS_CS1400103 = "./activiteoffresoin"
balises_à_échapper_finess_cs1400103 = ["nofinesset", "activite", "modalite", "forme"]

index_des_autorisations_sanitaires: List[str] = [
    "numero_finess_etablissement_territorial",
    "code_activite",
    "code_modalite",
    "code_forme",
]

équivalences_finess_cs1400104_helios = {
    "dateautor": "date_autorisation",
    "datefin": "date_fin",
    "datemeo": "date_mise_en_oeuvre",
    "eml": "code_equipement_materiel_lourd",
    "libeml": "libelle_eml",
    "noautorarhgos": "numero_autorisation_arhgos",
    "nofinesset": "numero_finess_etablissement_territorial",
}
colonnes_à_garder_finess_cs1400104 = list(équivalences_finess_cs1400104_helios.keys())
XPATH_FINESS_CS1400104 = "./equipmateriellourd"
balises_à_échapper_finess_cs1400104 = ["eml", "nofinesset"]

index_des_équipements_matériels_lourds: List[str] = [
    "numero_finess_etablissement_territorial",
    "code_equipement_materiel_lourd",
    "numero_autorisation_arhgos",
]

équivalences_finess_cs1600101_helios = {
    "activite": "code_activite",
    "datedecision": "date_autorisation",
    "datefin": "date_fin",
    "datemeo": "date_mise_en_oeuvre",
    "forme": "code_forme",
    "libactivite": "libelle_activite",
    "libforme": "libelle_forme",
    "libmodalite": "libelle_modalite",
    "modalite": "code_modalite",
    "nofinesset": "numero_finess_etablissement_territorial",
}
colonnes_à_garder_finess_cs1600101 = list(équivalences_finess_cs1600101_helios.keys())
XPATH_FINESS_CS1600101 = "./autreactivite"
balises_à_échapper_finess_cs1600101 = ["nofinesset", "activite", "modalite", "forme"]

index_des_autres_activités_sanitaires: List[str] = [
    "numero_finess_etablissement_territorial",
    "code_activite",
    "code_modalite",
    "code_forme",
]

équivalences_finess_cs1600102_helios = {
    "activite": "code_activite",
    "capaciteautorisee": "capacite_autorisee",
    "codeautorarhgos": "numero_autorisation_arhgos",
    "dateeffetasr": "date_effet_asr",
    "dateeffetcpom": "date_effet_cpom",
    "datefincpom": "date_fin_cpom",
    "forme": "code_forme",
    "idcpom": "numero_cpom",
    "libactivite": "libelle_activite",
    "libforme": "libelle_forme",
    "libmodalite": "libelle_modalite",
    "modalite": "code_modalite",
    "nofinesset": "numero_finess_etablissement_territorial",
}
colonnes_à_garder_finess_cs1600102 = list(équivalences_finess_cs1600102_helios.keys())
XPATH_FINESS_CS1600102 = "./activitesoumiseareco"
balises_à_échapper_finess_cs1600102 = ["nofinesset", "activite", "modalite", "forme"]

index_des_reconnaissances_contractuelles: List[str] = [
    "numero_finess_etablissement_territorial",
    "code_activite",
    "code_modalite",
    "code_forme",
]
