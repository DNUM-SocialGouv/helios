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

    data = []
    data_object: Dict[str, str | None] = {}
    # On lit le fichiers xml en stream avec écoute des event concernant les balises de début (start) et les balises de fin (end)
    for event, elem in ET.iterparse(chemin_du_fichier, events=("start", "end")):
        # Quand un event de début du tag global de l’objet recherché est lancé, on crée un objet vide
        if event == "start" and elem.tag == xml_tag:
            data_object = {}

        # Quand un évent de fin de tag global de l’objet recherché est lancé, on enregistre l’objet et on clear la Ram
        if event == "end" and elem.tag == xml_tag:
            data.append(data_object)
            elem.clear()

        # Quand un évent de fin d’un des champs attendu est lancé, on met à jour l’objet en cours de construction
        if event == "end" and elem.tag in colonnes:
            data_object[elem.tag] = get_value_or_none(elem)

    elapsed = time.perf_counter() - start
    logger.info(f"[Etree] Fin de lecture du fichier en {elapsed}s")

    logger.info("[Pandas] Début de la conversion en dataframe")
    start = time.perf_counter()
    etablissements = pd.DataFrame(data)
    etablissements.astype(types_des_colonnes)

    elapsed = time.perf_counter() - start
    logger.info(f"[Pandas] Fin de la conversion en dataframe en {elapsed}s")
    return etablissements


def get_value_or_none(elmt: (ET.Element | None)) -> str | None:
    if elmt is None:
        return None
    return elmt.text
