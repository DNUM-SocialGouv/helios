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
XPATH_FINESS_CS1400105 = "./equipementsocial"

index_des_autorisations: List[str] = ["numero_finess_etablissement_territorial", "discipline_equipement", "activite", "clientele", "est_installee"]
