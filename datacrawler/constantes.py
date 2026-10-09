DATA_GOUV_COG_API_URL = "https://www.data.gouv.fr/api/1/datasets/code-officiel-geographique-1/"
RESSOURCE_COMMUNES_TITRE = "liste des communes, arrondissements municipaux, communes déléguées et communes associées au"
RESSOURCE_DEPARTEMENTS_TITRE = "liste des départements au"

REPERTOIRE_JSON_FINESS = "json"
PREFIXE_FICHIER_STRUCTURES_FINESS = "finess-structures-journalier"

FINESS_STATUTS_JURIDIQUES_CODESYSTEM_URL = "https://smt.esante.gouv.fr/fhir/CodeSystem/tre-r400-finess-statut-juridique"
FINESS_CATEGORIES_ENTITE_GEOGRAPHIQUE_EXERCICE_CODESYSTEM_URL = (
    "https://smt.esante.gouv.fr/fhir/CodeSystem/tre-r397-categorie-entite-geographique-exercice"
)
FINESS_MODES_FIXATION_TARIFAIRE_CODESYSTEM_URL = (
    "https://mos.esante.gouv.fr/NOS/TRE_R74-ModeFixationTarifaire/FHIR/TRE-R74-ModeFixationTarifaire/"
    "TRE_R74-ModeFixationTarifaire-FHIR.json"
)

CODES_DE_CATEGORISATION_DES_STATUTS_JURIDIQUES = {
    "1000": "public",
    "2100": "prive_non_lucratif",
    "2200": "prive_lucratif",
    "3000": "personne_morale_droit_etranger",
}

CODES_DOMAINES_DES_CATEGORIES_ENTITE_GEOGRAPHIQUE_EXERCICE = {
    "1000": "SAN",
    "2000": "SAN",
    "3000": "SAN",
    "4000": "SOC",
    "5000": "SOC",
    "6000": "ENS",
}
