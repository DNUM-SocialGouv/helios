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
    "indsupaut": "est_autorisee",
    "libta": "libelle_activite",
    "libclient": "libelle_clientele",
    "libde": "libelle_discipline_equipement",
    "nofinesset": "numero_finess_etablissement_territorial",
}
colonnes_à_garder_finess_cs1400105 = list(équivalences_finess_cs1400105_helios.keys())
type_des_colonnes_finess_cs1400105 = {
    "nofinesset": str,
    "de": str,
    "ta": str,
    "client": str,
}
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
type_des_colonnes_finess_cs1400103 = {
    "nofinesset": str,
    "activite": str,
    "modalite": str,
    "forme": str,
}
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
type_des_colonnes_finess_cs1400104 = {
    "nofinesset": str,
    "eml": str,
}

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
type_des_colonnes_finess_cs1600101 = {
    "nofinesset": str,
    "activite": str,
    "modalite": str,
    "forme": str,
}

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
type_des_colonnes_finess_cs1600102 = {
    "nofinesset": str,
    "activite": str,
    "modalite": str,
    "forme": str,
}

index_des_reconnaissances_contractuelles: List[str] = [
    "numero_finess_etablissement_territorial",
    "code_activite",
    "code_modalite",
    "code_forme",
]

XPATH_FINESS_CS1400101 = "./structureej"
type_des_colonnes_finess_cs1400101 = {
    "datecrea": str,
    "datefermeture": str,
    "departement": str,
    "libcommune": str,
    "libdepartement": str,
    "libstatutjuridique": str,
    "ligneacheminement": str,
    "nofiness": str,
    "numvoie": str, 
    "rs": str,
    "rslongue": str,
    "siren": str,
    "statutjuridique": str,
    "telephone": str,
    "typvoie": str,
    "voie": str,
}
colonnes_a_garder_finess_cs1400101 = list(type_des_colonnes_finess_cs1400101.keys())
equivalences_finess_cs1400101_helios = {
    "ligneacheminement": "adresse_acheminement",
    "numvoie": "adresse_numero_voie",
    "typvoie": "adresse_type_voie",
    "voie": "adresse_voie",
    "libcommune": "commune",
    "libdepartement": "departement",
    "libstatutjuridique": "libelle_statut_juridique",
    "nofiness": "numero_finess_entite_juridique",
    "rslongue": "raison_sociale", 
    "rs": "raison_sociale_courte",
    "siren": "siren",
    "telephone": "telephone",
    "datecrea": "date_ouverture",
    "ref_code_region": "code_region",
    "categorisation": "categorisation"
}

index_des_entitees_juridiques : List[str] = [
    "numero_finess_entite_juridique"
]

XPATH_FINESS_CS1500107 = "./nomenclstatutavecagr"
type_des_colonnes_finess_cs1400107 = {
    "code": str,
    "codeagr2": str,
    "codeagr1": str
}
colonnes_a_garder_finess_cs1400107 = list(type_des_colonnes_finess_cs1400107.keys())

XPATH_FINESS_CS1400102 = "./structureet"
type_des_colonnes_finess_cs1400102 = {
    "nofinesset": str,
    "nofinessej": str,
    "rs": str,
    "rslongue": str,
    "numvoie": str,
    "typvoie": str,
    "voie": str,
    "libcommune": str,
    "departement": str,
    "libdepartement": str,
    "dateouv": str,
    "datefermeture": str,
    "ligneacheminement": str,
    "categetab": str,
    "codemft": str,
    "courriel": str,
    "libcategetab": str,
    "libcourtcategetab": str,
    "libmft": str,
    "nofinessppal": str,
    "siret": str,
    "typeet": str,
    "telephone": str,
}
equivalences_finess_cs1400102_helios = {
    "ligneacheminement": "adresse_acheminement",
    "numvoie": "adresse_numero_voie",
    "typvoie": "adresse_type_voie",
    "voie": "adresse_voie",
    "categetab": "cat_etablissement",
    "courriel": "courriel",
    "libcategetab": "libelle_categorie_etablissement",
    "nofinessej": "numero_finess_entite_juridique",
    "nofinesset": "numero_finess_etablissement_territorial",
    "nofinessppal": "numero_finess_etablissement_principal",
    "rslongue": "raison_sociale",
    "typeet": "type_etablissement",
    "telephone": "telephone",
    "domaine": "domaine",
    "rs": "raison_sociale_courte",
    "libcommune": "commune",
    "libdepartement": "departement",
    "libcourtcategetab": "libelle_court_categorie_etablissement",
    "codemft": "code_mode_tarification",
    "siret": "siret",
    "libmft": "libelle_du_mode_tarification",
    "ref_code_region": "code_region",
    "dateouv": "date_ouverture",
    # "classification" : "classification"
}

colonnes_a_garder_finess_cs1400102 = list(equivalences_finess_cs1400102_helios.keys())


index_des_etablissements_territorriaux : List[str] = [
    "numero_finess_etablissement_territorial"
]

XPATH_FINESS_CS1500106 = "./nomenclcategorieETavecagr"
type_des_colonnes_finess_cs1500106 = {
    "code": str,
    "domaine": str
}
colonnes_a_garder_finess_cs1500106 = list(type_des_colonnes_finess_cs1500106.keys())
