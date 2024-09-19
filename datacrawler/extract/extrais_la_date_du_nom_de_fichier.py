from pathlib import Path


def extrais_la_date_du_nom_de_fichier_diamant(chemin_du_ficher: str) -> str:
    nom_du_fichier = Path(chemin_du_ficher).stem
    date_extraite = nom_du_fichier[-10:]
    return date_extraite.replace("_", "")


def extrais_la_date_du_nom_de_fichier_finess(chemin_du_ficher: str) -> str:
    nom_du_fichier = Path(chemin_du_ficher).stem
    date_extraite = nom_du_fichier.split("-")[0]
    return date_extraite[-8:]

def extrais_la_date_du_nom_de_fichier_qualite(chemin_du_ficher: str) -> str:
    nom_du_fichier = Path(chemin_du_ficher).stem
    date_extraite = nom_du_fichier[-8:]
    return date_extraite

def extrais_la_date_du_nom_de_fichier_hapi(chemin_du_ficher: str) -> str:
    nom_du_fichier = Path(chemin_du_ficher).stem
    date_extraite = nom_du_fichier.split('_')[4][0:8]
    datetransformee = date_extraite[-4:] + date_extraite[2:4] + date_extraite[0:2]
    return datetransformee