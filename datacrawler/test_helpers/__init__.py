from typing import Dict, Optional
from unittest.mock import MagicMock

import pandas as pd
from numpy import NaN
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler.load.nom_des_tables import (
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES,
    TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
    FichierSource,
)
from datacrawler.transform.équivalences_diamant_helios import index_des_activités

base_de_données_test = create_engine("postgresql://helios:h3li0s@localhost:5433/helios")
mocked_logger = MagicMock()
NUMÉRO_FINESS_ÉTABLISSEMENT = "010001261"


def sauvegarde_une_entité_juridique_en_base(numéro_finess: str, base_de_données: Engine) -> None:
    base_de_données.execute(
        f"""INSERT INTO entite_juridique (
    numero_finess_entite_juridique,
    raison_sociale,
    adresse_acheminement,
    adresse_numero_voie,
    adresse_type_voie,
    adresse_voie,
    libelle_statut_juridique,
    telephone
  ) VALUES (
    '{numéro_finess}',
    'rs',
    '00000 VILLE',
    '12',
    'R',
    'nom de rue',
    'Public',
    '0123456789'
  );
"""
    )


def sauvegarde_un_établissement_en_base(numéro_finess_établissement: str, numéro_finess_entité_juridique: str, base_de_données: Engine) -> None:
    base_de_données.execute(
        f"""INSERT INTO etablissement_territorial (
    adresse_acheminement,
    adresse_numero_voie,
    adresse_type_voie,
    adresse_voie,
    cat_etablissement,
    courriel,
    numero_finess_entite_juridique,
    numero_finess_etablissement_principal,
    numero_finess_etablissement_territorial,
    raison_sociale,
    telephone,
    type_etablissement,
    libelle_categorie_etablissement,
    domaine
  ) VALUES (
    '00000 VILLE',
    '12',
    'R',
    'nom de rue',
    '100',
    '',
    '{numéro_finess_entité_juridique}',
    '',
    '{numéro_finess_établissement}',
    'rs',
    '',
    'P',
    'catégorie',
    'Médico-social'
  );
"""
    )


def supprime_les_données_des_tables(base_de_données: Engine) -> None:
    base_de_données.execute("DELETE FROM entite_juridique;")
    base_de_données.execute("DELETE FROM etablissement_territorial;")
    base_de_données.execute(f"DELETE FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX};")
    base_de_données.execute(f"DELETE FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES};")
    base_de_données.execute(f"DELETE FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX};")


def sauvegarde_une_activité_en_base(activité: pd.DataFrame, base_de_données: Engine, table: str) -> None:
    activité.set_index(index_des_activités).to_sql(name=table, con=base_de_données, index=True, if_exists="append")


def sauvegarde_une_date_de_mise_à_jour_de_fichier_source(date_de_mise_à_jour: str, fichier_source: FichierSource, base_de_données: Engine) -> None:
    base_de_données.execute(
        f"""INSERT INTO {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} (derniere_mise_a_jour, fichier)
            VALUES ('{date_de_mise_à_jour}', '{fichier_source.value}');"""
    )


def csv_ann_ms_tdp_et_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, object]:
    ann_ms_tdp_et = {
        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "Année": 2018,
        "Nombre moyen de journées d'absence des personnes accompagnées sur la période": 31.41,
        "Durée moyenne de séjour/d'accompagnement": 904.17,
        "Taux de réalisation de lactivité Tout ESMS (Hors services CAMSP et CMPP)": 0.9256,
        "Taux de réalisation de lactivité CAMSP et CMPP": 0.6789,
        "File active des personnes accompagnées sur la période": 94,
    }
    if champs_surchargés:
        return {**ann_ms_tdp_et, **champs_surchargés}
    return ann_ms_tdp_et


def csv_men_pmsi_annuel_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, object]:
    men_pmsi_annuel = {
        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "Année": 2018,
        "Nombre de séjours HTP/AMBU Médecine": 1.0,
        "Nombre de séjours HTP/AMBU Obstétrique": 1.0,
        "Nombre de séjours HTP/AMBU Chirurgie": 1.0,
        "Nombre de séjours HC Médecine": 255.0,
        "Nombre de séjours HC Chirurgie": 6.0,
        "Nombre de séjours HC Obstétrique": 1.0,
        "Nombre de journées hospit complète SSR": 1074.0,
        "Nombre de journées HTP SSR": 1.0,
        "Nb journées hospit complète PSY": 1.0,
        "Nb journées HTP PSY": 1.0,
    }
    if champs_surchargés:
        return {**men_pmsi_annuel, **champs_surchargés}
    return men_pmsi_annuel


def csv_ann_rpu_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, object]:
    ann_rpu = {
        "Finess": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "Année": 2018,
        "Nombre de passages aux urgences": 100.0,
    }
    if champs_surchargés:
        return {**ann_rpu, **champs_surchargés}
    return ann_rpu


def helios_men_pmsi_annuel_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, str | object]:
    men_pmsi_annuel = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2018,
        "nombre_sejours_partiels_medecine": 1.0,
        "nombre_sejours_partiels_obstetrique": 1.0,
        "nombre_sejours_partiels_chirurgie": 1.0,
        "nombre_sejours_complets_medecine": 255.0,
        "nombre_sejours_complets_chirurgie": 6.0,
        "nombre_sejours_complets_obstetrique": 1.0,
        "nombre_journees_completes_ssr": 1074.0,
        "nombre_journees_partiels_ssr": 1.0,
        "nombre_journees_complete_psy": 1.0,
        "nombre_journées_partielles_psy": 1.0,
    }
    if champs_surchargés:
        return {**men_pmsi_annuel, **champs_surchargés}
    return men_pmsi_annuel


def helios_ann_rpu_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, str | object]:
    ann_rpu = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2018,
        "nombre_passages_urgences": 100.0,
    }
    if champs_surchargés:
        return {**ann_rpu, **champs_surchargés}
    return ann_rpu


def helios_activité_sanitaire_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, str | object]:
    activité = {
        "numero_finess_etablissement_territorial": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "annee": 2018,
        "nombre_sejours_partiels_medecine": 1.0,
        "nombre_sejours_partiels_obstetrique": 1.0,
        "nombre_sejours_partiels_chirurgie": 1.0,
        "nombre_sejours_complets_medecine": 255.0,
        "nombre_sejours_complets_chirurgie": 6.0,
        "nombre_sejours_complets_obstetrique": 1.0,
        "nombre_journees_completes_ssr": 1074.0,
        "nombre_journees_partiels_ssr": 1.0,
        "nombre_journees_complete_psy": 1.0,
        "nombre_journées_partielles_psy": 1.0,
        "nombre_passages_urgences": 100.0,
    }
    if champs_surchargés:
        return {**activité, **champs_surchargés}
    return activité


def crée_le_fichier_xml(chemin_du_fichier: str, contenu: str) -> None:
    with open(chemin_du_fichier, "w+", encoding="utf-8") as fichier:
        fichier.write(
            f"""<?xml version="1.0" encoding="UTF-8"?>
<fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  {contenu}
</fluxfiness>"""
        )


def xml_contenu_finess_cs1400103_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, str | object]:
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
        "noautorarhgos": "76-73-430",
        "noimplarhgos": "76-73-430",
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
    if champs_surchargés:
        return {**finess_cs1400103, **champs_surchargés}
    return finess_cs1400103


def xml_contenu_finess_cs1400104_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, str | object]:
    finess_cs1400104 = {
        "nofinessej": 310781406,
        "rsej": "CHU TOULOUSE",
        "eml": "05701",
        "libeml": "Caméra à scintillation sans détecteur d'émission de positons",
        "libcourteml": "Cam scin sans détect",
        "noautor": 762218998,
        "noautorarhgos": "76-73-1040",
        "noimplarhgos": "76-73-1040",
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
    if champs_surchargés:
        return {**finess_cs1400104, **champs_surchargés}
    return finess_cs1400104


def xml_contenu_finess_cs1600101_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, str | object]:
    finess_cs1600101 = {
        "noautor": 242202733,
        "nofinessej": 370000028,
        "rsej": "SA. CLINIQUE JEANNE D'ARC",
        "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "rset": "CLINIQUE JEANNE D'ARC - ST BENOIT",
        "codeautorarhgos": "24-24-49863",
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
    if champs_surchargés:
        return {**finess_cs1600101, **champs_surchargés}
    return finess_cs1600101


def xml_contenu_finess_cs1600102_builder(champs_surchargés: Optional[Dict] = None) -> Dict[str, str | object]:
    finess_cs1600102 = {
        "noautor": 112234367,
        "idcpom": "11-11-C60420",
        "nofinessej": 950110015,
        "rsej": "CH  VICTOR  DUPOUY  ARGENTEUIL",
        "nofinesset": NUMÉRO_FINESS_ÉTABLISSEMENT,
        "rset": "CH VICTOR DUPOUY",
        "dateeffetcpom": "2017-12-30",
        "datefincpom": "2022-12-29",
        "codeautorarhgos": "11-11-RC61198",
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
    if champs_surchargés:
        return {**finess_cs1600102, **champs_surchargés}
    return finess_cs1600102
