from logging import Logger
import time
import xml.etree.ElementTree as ET
from typing import Dict, List

import pandas as pd


def lis_le_fichier_xml(
    chemin_du_fichier: str, xpath: str, types_des_colonnes: Dict
) -> pd.DataFrame:
    return pd.read_xml(chemin_du_fichier, xpath=xpath, dtype=types_des_colonnes)


def lis_le_fichier_xml_en_stream(
    logger: Logger,
    chemin_du_fichier: str,
    xml_tag: str,
    colonnes: List,
    types_des_colonnes: Dict,
) -> pd.DataFrame:
    logger.info(f"[Etree] Lecture du fichier [{chemin_du_fichier}]")
    start = time.perf_counter()

    tree = ET.parse(chemin_du_fichier)
    rootElem = tree.getroot()

    data = []
    for ej in rootElem.findall(xml_tag):
        structure = {}
        for colonne in colonnes:
            structure[colonne] = getValueOrNone(ej.find(colonne))
        data.append(structure)
    elapsed = time.perf_counter() - start
    logger.info(f"[Etree] Fin de lecture du fichier en {elapsed}s")

    logger.info("[Pandas] Début de la conversion en dataframe")
    start = time.perf_counter()
    etablissements = pd.DataFrame(data)
    etablissements.astype(types_des_colonnes)

    elapsed = time.perf_counter() - start
    logger.info(f"[Pandas] Fin de la conversion en dataframe en {elapsed}s")
    return etablissements


def getValueOrNone(elmt: (ET.Element | None)) -> str | None:
    if elmt is None:
        return None
    else:
        return elmt.text
