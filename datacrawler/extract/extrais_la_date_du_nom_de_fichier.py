from pathlib import Path


def extrais_la_date_du_nom_de_fichier_diamant(chemin_du_ficher: str) -> str:
    nom_du_fichier = Path(chemin_du_ficher).stem
    date_extraite = nom_du_fichier[-10:]
    return date_extraite.replace("_", "")


def extrais_la_date_du_nom_de_fichier_finess(chemin_du_ficher: str) -> str:
    nom_du_fichier = Path(chemin_du_ficher).stem
    date_extraite = nom_du_fichier.split("-")[0]
    return date_extraite[-8:]

def extrais_la_date_du_nom_de_fichier_sirec_sivss(chemin_du_ficher: str) -> str:
    nom_du_fichier = Path(chemin_du_ficher).stem
    date_extraite = nom_du_fichier[-12:-4]
    return date_extraite