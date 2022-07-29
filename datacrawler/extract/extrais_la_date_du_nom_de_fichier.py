from pathlib import Path


def extrais_la_date_du_nom_de_fichier(chemin_du_ficher: str) -> str:
    nom_du_fichier = Path(chemin_du_ficher).stem
    date_extraite = nom_du_fichier[-10:]
    return date_extraite.replace("_", "")
