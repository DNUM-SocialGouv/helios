import os
import re
from datetime import date

import pandas as pd

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_qualite

PREDEFINED_COLUMN_NAMES = [
    "IDENTIFIANT",
    "NDEG_FINESS_RPPS",
    "ANNEE_DE_RECEPTION",
    "ENCOURS_NB_RECLA_TOTAL",
    "ENCOURS_NB_RECLA_MOTIF_10",
    "ENCOURS_NB_RECLA_MOTIF_11",
    "ENCOURS_NB_RECLA_MOTIF_12",
    "ENCOURS_NB_RECLA_MOTIF_13",
    "ENCOURS_NB_RECLA_MOTIF_14",
    "ENCOURS_NB_RECLA_MOTIF_15",
    "ENCOURS_NB_RECLA_MOTIF_16",
    "ENCOURS_NB_RECLA_MOTIF_17",
    "ENCOURS_NB_RECLA_MOTIF_18",
    "ENCOURS_NB_RECLA_MOTIF_19",
    "ENCOURS_NB_RECLA_MOTIF_155",
    "ENCOURS_NB_RECLA_MOTIF_156",
    "CLOT_NB_RECLA_TOTAL",
    "CLOT_NB_RECLA_MOTIF_10",
    "CLOT_NB_RECLA_MOTIF_11",
    "CLOT_NB_RECLA_MOTIF_12",
    "CLOT_NB_RECLA_MOTIF_13",
    "CLOT_NB_RECLA_MOTIF_14",
    "CLOT_NB_RECLA_MOTIF_15",
    "CLOT_NB_RECLA_MOTIF_16",
    "CLOT_NB_RECLA_MOTIF_17",
    "CLOT_NB_RECLA_MOTIF_18",
    "CLOT_NB_RECLA_MOTIF_19",
    "CLOT_NB_RECLA_MOTIF_155",
    "CLOT_NB_RECLA_MOTIF_156",
]


def check_downloaded_sirec_file(chemin_local_du_fichier_sirec: str, chemin_du_fichier_sirec_traite: str) -> None:
    # Lecture du fichier en conservant tous les types comme des string pour la validation
    try:
        data_frame = pd.read_csv(chemin_local_du_fichier_sirec, sep=";", dtype=str, encoding="utf-8")
    except (FileNotFoundError, pd.errors.ParserError, UnicodeDecodeError) as exc:
        print(f"Erreur lors de la lecture du fichier CSV : {exc}")
        return

    # 1. Vérification des noms de colonnes
    if not set(PREDEFINED_COLUMN_NAMES).issubset(data_frame.columns):
        # Si les colonnes requises ne sont pas présentes, on ignore tout le fichier
        return

    # 2. Vérification de l'année (les 5 dernières années)
    current_year = date.today().year

    def is_valid_year(year_str: str) -> bool:
        try:
            year = int(year_str)
            return (current_year - 5) <= year <= current_year
        except (ValueError, TypeError):
            return False

    valid_year_mask = data_frame["ANNEE_DE_RECEPTION"].apply(is_valid_year)

    # 3. Vérification du numéro FINESS (9 caractères alphanumériques)
    valid_finess_mask = data_frame["NDEG_FINESS_RPPS"].astype(str).str.match(r"^([a-zA-Z0-9_-]){9}$", na=False)

    # 4. Vérification des nombres avec virgules ou points (rejet si présent)
    # TS regex: /^(\d+,\d+|\d+\.\d+)$/
    def contains_comma_or_dot(val: str) -> bool:
        if not isinstance(val, str):
            return False
        return bool(re.match(r"^(\d+,\d+|\d+\.\d+)$", val))

    # On vérifie sur toutes les colonnes
    has_comma_or_dot = data_frame.apply(lambda col: col.map(contains_comma_or_dot)).any(axis=1)

    # 5. Vérification des nombres négatifs
    def is_negative(val: str) -> bool:
        try:
            # Si c'est convertissable en nombre et < 0
            num = float(val.replace(",", ".")) if isinstance(val, str) else val
            return num < 0
        except (ValueError, TypeError):
            return False

    has_negative = data_frame.apply(lambda col: col.map(is_negative)).any(axis=1)

    # Application des filtres
    # On garde les lignes valides :
    # - Année valide
    # - Finess valide
    # - PAS de virgule/point (is float string)
    # - PAS de nombres négatifs

    df_filtered = data_frame[valid_year_mask & valid_finess_mask & (~has_comma_or_dot) & (~has_negative)]

    # Sauvegarde
    df_filtered.to_csv(chemin_du_fichier_sirec_traite, sep=";", index=False, quoting=3)  # quoting=3 is QUOTE_NONE? TS uses Papa.unparse defaults.


def main() -> None:
    logger, variables_d_environnement = initialise_les_dépendances()

    sirec_data_path = variables_d_environnement.get("SIREC_DATA_PATH", "data/sirec")
    checked_sirec_data_path = variables_d_environnement.get("CHECKED_SIREC_DATA_PATH", "data/sirec_checked")

    if not os.path.exists(checked_sirec_data_path):
        os.makedirs(checked_sirec_data_path)

    try:
        fichiers = os.listdir(sirec_data_path)
        filename_sirec = trouve_le_nom_du_fichier_qualite(fichiers, "sirec", logger)
    except (FileNotFoundError, IndexError):
        logger.warning("Aucun fichier SIREC trouvé.")
        return

    chemin_local = os.path.join(sirec_data_path, filename_sirec)

    # Nettoyage du dossier de destination
    chemin_traite = os.path.join(checked_sirec_data_path, filename_sirec)

    logger.info(f"Traitement du fichier SIREC : {filename_sirec}")
    check_downloaded_sirec_file(chemin_local, chemin_traite)
    logger.info(f"Fichier traité sauvegardé vers : {chemin_traite}")

    # Nettoyage des autres fichiers dans le dossier destination
    # TS logic: readdir destinationPath, for each file != fileToKeep, unlink.

    for file in os.listdir(checked_sirec_data_path):
        f_path = os.path.join(checked_sirec_data_path, file)
        if f_path != chemin_traite and os.path.isfile(f_path):
            os.remove(f_path)
            logger.info(f"Fichier supprimé : {f_path}")


if __name__ == "__main__":
    main()
