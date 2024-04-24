import re
from logging import Logger
from typing import List


def trouve_le_nom_du_fichier_diamant(fichiers: List[str], préfixe_du_fichier_recherché: str, logger: Logger) -> str:
    fichiers_correspondants = [
        nom_de_fichier for nom_de_fichier in fichiers if re.match(f"{préfixe_du_fichier_recherché}_" + r"\d{4}_\d{2}_\d{2}", nom_de_fichier)
    ]
    if not fichiers_correspondants:
        logger.fatal(f"Le fichier {préfixe_du_fichier_recherché} est introuvable parmi les fichiers téléchargés.")
        raise FileNotFoundError()

    return fichiers_correspondants[0]


def trouve_le_nom_du_fichier(fichiers: List[str], préfixe_du_fichier_recherché: str, logger: Logger) -> str:
    fichiers_correspondants = [nom_de_fichier for nom_de_fichier in fichiers if préfixe_du_fichier_recherché in nom_de_fichier]
    if not fichiers_correspondants:
        logger.fatal(f"Le fichier {préfixe_du_fichier_recherché} est introuvable parmi les fichiers téléchargés.")
        raise FileNotFoundError()

    return fichiers_correspondants[0]

def trouve_le_nom_du_fichier_sirec(fichiers: List[str], préfixe_du_fichier_recherché: str, logger: Logger) -> str:
    fichiers_correspondants = [
        nom_de_fichier for nom_de_fichier in fichiers if re.match(f"{préfixe_du_fichier_recherché}_" + r"\d{8}", nom_de_fichier)
    ]
    if not fichiers_correspondants:
        logger.fatal(f"Le fichier {préfixe_du_fichier_recherché} est introuvable parmi les fichiers téléchargés.")
        raise FileNotFoundError()
    fichiers_correspondants.sort(reverse=True)
    return fichiers_correspondants[0]

def trouve_le_nom_du_fichier_sivss_siicea(fichiers: List[str], préfixe_du_fichier_recherché: str, logger: Logger) -> str:
    fichiers_correspondants = [
        nom_de_fichier for nom_de_fichier in fichiers if re.match(f"{préfixe_du_fichier_recherché}_" + r"\d{12}", nom_de_fichier)
    ]
    if not fichiers_correspondants:
        logger.fatal(f"Le fichier {préfixe_du_fichier_recherché} est introuvable parmi les fichiers téléchargés.")
        raise FileNotFoundError()
    fichiers_correspondants.sort(reverse=True)
    return fichiers_correspondants[0]
