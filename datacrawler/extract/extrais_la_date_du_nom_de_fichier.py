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
    date_extraite = nom_du_fichier.split("_")[4][0:8]
    datetransformee = date_extraite[-4:] + date_extraite[2:4] + date_extraite[0:2]
    return datetransformee


def extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_du_ficher: str) -> str:
    nom_du_fichier = Path(chemin_du_ficher).stem
    parties = nom_du_fichier.split("_")

    if len(parties) >= 3:
        annee = parties[-3]
        mois = parties[-2]
        jour = parties[-1]

        # Formate la date en AAAA-MM-JJ
        return f"{annee}-{mois}-{jour}"

    raise ValueError("Le nom du fichier ne contient pas de date valide.")


def extrais_la_date_du_nom_de_fichier_engagements_hapi(chemin_du_fichier: str) -> str:
    # Pattern: "2026_engagements_exporter_20260318.csv" → "20260318"
    nom = Path(chemin_du_fichier).stem  # "2026_engagements_exporter_20260318"
    return nom.split("_")[-1]  # "20260318" (already YYYYMMDD)


def extrais_l_annee_du_nom_de_fichier_engagements_hapi(chemin_du_fichier: str) -> int:
    # Returns the integer year: "20260318" → 2026
    date_str = extrais_la_date_du_nom_de_fichier_engagements_hapi(chemin_du_fichier)
    return int(date_str[:4])
