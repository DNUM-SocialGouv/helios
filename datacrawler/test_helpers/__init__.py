from typing import Dict, Optional
from unittest.mock import MagicMock

import pandas as pd
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
