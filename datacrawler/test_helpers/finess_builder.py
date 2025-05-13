from typing import Dict, Optional

from numpy import NaN

from datacrawler.test_helpers import NUMÉRO_FINESS_ÉTABLISSEMENT, NUMÉRO_FINESS_ENTITÉ_JURIDIQUE

def xml_contenu_finess_cs1400101_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    finess_cs1400101 = {
        "datecrea": "2009-01-01",
        "datefermeture": NaN,
        "departement": "01",
        "libcommune": "DIVONNE LES BAINS",
        "libdepartement": "AIN",
        "libstatutjuridique": "Etb.Social Communal",
        "ligneacheminement": "01220 DIVONNE LES BAINS",
        "nofiness": NUMÉRO_FINESS_ENTITÉ_JURIDIQUE,
        "numvoie": "240", 
        "rs": "MAISON DE RETRAITE - DIVONNE-LES-BAINS",
        "rslongue": "MAISON DE RETRAITE RESIDENCE DES ANCIENS - DIVONNE-LES-BAINS",
        "siren": "260214644",
        "statutjuridique": "21",
        "telephone": "0450201235",
        "typvoie": "R",
        "voie": "GUY DE MAUPASSANT",
    }
    if champs_surcharges:
        return {**finess_cs1400101, **champs_surcharges}
    return finess_cs1400101

def xml_contenu_finess_cs1400103_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    finess_cs1400103 = {
        "nofinessej": 310781406,
        "rsej": "CHU TOULOUSE",
        "activite": "16",
        "libactivite": "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
        "modalite": "40",
        "libmodalite": "Hémodialyse en centre pour adultes",
        "forme": "00",
        "libforme": "Pas de forme",
        "noautor": 762201955,
        "dateautor": "2004-11-02",
        "indnatlien": "J",
        "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "rset": "HOPITAL LARREY CHU TOULOUSE",
        "noligautor": 1757,
        "noligautoranc": NaN,
        "noautorarhgos": "03-00-000",
        "noimplarhgos": "03-00-000",
        "noancautact": NaN,
        "noancauteml": NaN,
        "sectpsy": NaN,
        "libsectpsy": NaN,
        "datemeo": "2005-03-22",
        "datefin": "2027-09-23",
        "datelimite": NaN,
        "indcaduc": "N",
        "daterenouv": NaN,
        "indrenouv": NaN,
        "indsupact": "N",
        "indsupsite": "N",
        "datemajact": "2022-08-24",
        "datemajsite": "2022-08-24",
    }
    if champs_surcharges:
        return {**finess_cs1400103, **champs_surcharges}
    return finess_cs1400103


def xml_contenu_finess_cs1400104_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    finess_cs1400104 = {
        "nofinessej": 310781406,
        "rsej": "CHU TOULOUSE",
        "eml": "05701",
        "libeml": "Caméra à scintillation sans détecteur d'émission de positons",
        "libcourteml": "Cam scin sans détect",
        "noautor": 762218998,
        "noautorarhgos": "02-00-0000",
        "noimplarhgos": "02-00-0000",
        "dateautor": "2004-11-02",
        "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "numserie": NaN,
        "marque": 0,
        "rset": "HOPITAL DE RANGUEIL CHU TOULOUSE",
        "datelimite": NaN,
        "indcaduc": "N",
        "indnatlien": "J",
        "datemeo": "2006-11-08",
        "datefin": "2028-05-29",
        "indrempl": NaN,
        "noautorremplacement": NaN,
        "indsup": "N",
        "datemaj": "2022-08-24",
    }
    if champs_surcharges:
        return {**finess_cs1400104, **champs_surcharges}
    return finess_cs1400104


def xml_contenu_finess_cs1400105_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    finess_cs1400105 = {
        "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "de": "924",
        "libde": "Accueil pour Personnes Âgées",
        "libcourtde": "Acc. Personnes Âgées",
        "ta": "21",
        "libta": "Accueil de Jour",
        "libcourtta": "Accueil de Jour",
        "client": "436",
        "libclient": "Personnes Alzheimer ou maladies apparentées",
        "libcourtclient": "Alzheimer, mal appar",
        "sourceinfo": "S",
        "libsourceinfo": "Inspection",
        "capinstot": 3,
        "capinstm": NaN,
        "capinstf": NaN,
        "capinsthab": NaN,
        "ageminiinst": NaN,
        "agemaxiinst": NaN,
        "indsupinst": "N",
        "datederinst": "2009-01-01",
        "datepremautor": "2006-03-29",
        "capautot": 3,
        "capautm": NaN,
        "capautf": NaN,
        "capauthab": 3,
        "ageminiaut": NaN,
        "agemaxiaut": NaN,
        "indsupaut": "N",
        "dateautor": "2006-03-29",
        "datemajaut": "2012-05-03",
        "datemajinst": "2009-06-29",
    }
    if champs_surcharges:
        return {**finess_cs1400105, **champs_surcharges}
    return finess_cs1400105


def xml_contenu_finess_cs1600101_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    finess_cs1600101 = {
        "noautor": 242202733,
        "nofinessej": 370000028,
        "rsej": "SA. CLINIQUE JEANNE D'ARC",
        "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "rset": "CLINIQUE JEANNE D'ARC - ST BENOIT",
        "codeautorarhgos": "05-00-0000",
        "activite": "A0",
        "libactivite": "Installation de chirurgie esthétique",
        "modalite": "00",
        "libmodalite": "Pas de modalité",
        "forme": "01",
        "libforme": "Hospitalisation complète (24 heures consécutives ou plus)",
        "datedecision": "2006-06-26",
        "nodecision": "0000",
        "etatautorisation": 6,
        "libetatautorisation": "Renouvellement tacite",
        "datevisite": "2006-06-26",
        "resultatvisite": "C",
        "datefin": "2026-06-26",
        "datemeo": "2006-06-26",
        "datelimitemeo": NaN,
        "datelimitedepot": "2025-10-26",
        "datelimvisite": NaN,
        "datemaj": "2022-08-24",
    }
    if champs_surcharges:
        return {**finess_cs1600101, **champs_surcharges}
    return finess_cs1600101


def xml_contenu_finess_cs1600102_builder(champs_surcharges: Optional[Dict] = None) -> Dict[str, str | object]:
    finess_cs1600102 = {
        "noautor": 112234367,
        "idcpom": "07-00-C00000",
        "nofinessej": 950110015,
        "rsej": "CH  VICTOR  DUPOUY  ARGENTEUIL",
        "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "rset": "CH VICTOR DUPOUY",
        "dateeffetcpom": "2017-12-30",
        "datefincpom": "2022-12-29",
        "codeautorarhgos": "07-00-RC00000",
        "indicateurregional": "N",
        "activite": "R4",
        "libactivite": "Soins palliatifs",
        "modalite": "N2",
        "libmodalite": "Lits identifiés  (Médecine) - adulte",
        "forme": "01",
        "libforme": "Hospitalisation complète (24 heures consécutives ou plus)",
        "dateeffetasr": "2017-12-30",
        "capaciteautorisee": 16,
        "regionautorisation": 11,
        "etatautorisation": 23,
        "libetatautorisation": "Initiale",
        "datemaj": "2022-08-24",
    }
    if champs_surcharges:
        return {**finess_cs1600102, **champs_surcharges}
    return finess_cs1600102
