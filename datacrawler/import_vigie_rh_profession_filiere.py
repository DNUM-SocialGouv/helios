import os
from datetime import datetime
import pandas as pd
import numpy as np
from sqlalchemy.engine import create_engine, Engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping
from datacrawler.load.nom_des_tables import FichierSource, TABLE_PROFESSION_FILIERE, TABLE_REF_PROFESSION_FILIERE
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh


def est_dans_la_periode_valide(row: pd.Series) -> bool:
    # Détermination de l'année actuelle (N) et du mois actuel
    maintenant = datetime.now()
    annee_actuelle = maintenant.year
    mois_actuel = maintenant.month

    # Calcul de l'année N-2
    annee_min = annee_actuelle - 2

    # Extraction de l'année et du mois de la ligne
    annee = row["annee"]
    mois = row["mois"]

    # Vérifie si la ligne est dans la période valide
    if annee == annee_min and mois >= 1:  # À partir de janvier de N-2
        return True
    if annee_min < annee < annee_actuelle:  # Entre N-2 et N (simplifié avec une comparaison chaînée)
        return True
    if annee == annee_actuelle and mois <= mois_actuel:  # Jusqu'au mois actuel de N
        return True

    # Si aucune condition n'est remplie, retourner False
    else:
        return False

def filter_profession_filiere_data(donnees: pd.DataFrame, ref_code: np.ndarray, database: Engine) -> pd.DataFrame:
    # Récupérer les numéros FINESS des établissements connus
    numeros_finess_des_etablissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(database)
    numeros_finess_liste = numeros_finess_des_etablissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()

    # Convertir 'mois' et 'quarter' en nombres entiers après gestion des flottants
    donnees["mois"] = pd.to_numeric(donnees["mois"], errors='coerce').fillna(0).astype(int)
    donnees["quarter"] = pd.to_numeric(donnees["quarter"], errors='coerce').fillna(0).astype(int)

    # Appliquer la fonction de vérification de la période valide
    donnees["est_valide"] = donnees.apply(est_dans_la_periode_valide, axis=1)

    # Filtrer les données selon les critères demandés
    donnees_filtrees = donnees[
        (donnees["numero_finess"].astype(str).str.len() == 9) &
        (donnees["numero_finess"].astype(str).isin(numeros_finess_liste)) &
        (donnees["est_valide"]) &  # Utiliser la colonne "est_valide" pour filtrer
        (donnees["mois"].between(1, 12)) &
        (donnees["quarter"].between(1, 4)) &
        (donnees["profession_code"].isin(ref_code))
    ]

    # Supprimer la colonne temporaire "est_valide"
    donnees_filtrees = donnees_filtrees.drop(columns=["est_valide"])

    return donnees_filtrees

if __name__ == "__main__":
    # Initialisations
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees = create_engine(variables_d_environnement["DATABASE_URL"])

    vegie_rh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vegie_rh_data_path)

    chemin_local_du_fichier_profession_filiere = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_PROFESSION_FILIERE.value, logger_helios)
    )
    chemin_local_du_fichier_ref = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_PROFESSION_FILIERE.value, logger_helios)
    )
    date_de_mise_à_jour_profession_filiere = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_profession_filiere)
    traite_profession_filiere = verifie_si_le_fichier_est_traite(
        date_de_mise_à_jour_profession_filiere,
        base_de_donnees,
        FichierSource.VIGIE_RH_PROFESSION_FILIERE.value
    )

    date_de_mise_à_jour_ref = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref)
    traite_ref = verifie_si_le_fichier_est_traite(date_de_mise_à_jour_ref, base_de_donnees, FichierSource.VIGIE_RH_REF_PROFESSION_FILIERE.value)

    # Traitements des données
    if traite_profession_filiere and traite_ref:
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_PROFESSION_FILIERE.value} a été déjà traité")
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_REF_PROFESSION_FILIERE.value} a été déjà traité")
    else:
        if date_de_mise_à_jour_profession_filiere == date_de_mise_à_jour_ref:
            df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_PROFESSION_FILIERE.value)
            code_list_ref = np.array(df_ref['code'].tolist())

            data_frame = lis_le_fichier_parquet(chemin_local_du_fichier_profession_filiere, ColumMapping.PROFESSION_FILIERE.value)
            df_filtré = filter_profession_filiere_data(data_frame, code_list_ref, base_de_donnees)

            supprimer_donnees_existantes(TABLE_PROFESSION_FILIERE, base_de_donnees, SOURCE, logger_helios)
            supprimer_donnees_existantes(TABLE_REF_PROFESSION_FILIERE, base_de_donnees, SOURCE, logger_helios)

            inserer_nouvelles_donnees(
                TABLE_REF_PROFESSION_FILIERE,
                base_de_donnees,
                SOURCE,
                df_ref,
                logger_helios,
                FichierSource.VIGIE_RH_REF_PROFESSION_FILIERE,
                date_de_mise_à_jour_ref
            )

            inserer_nouvelles_donnees(
                TABLE_PROFESSION_FILIERE,
                base_de_donnees,
                SOURCE,
                df_filtré,
                logger_helios,
                FichierSource.VIGIE_RH_PROFESSION_FILIERE,
                date_de_mise_à_jour_profession_filiere
            )
        else:
            logger_helios.info(
                f"[{SOURCE}]❌ Les dates des fichiers sources ne sont pas cohérentes. "
                f"({FichierSource.VIGIE_RH_PROFESSION_FILIERE.value}, "
                f"{FichierSource.VIGIE_RH_REF_PROFESSION_FILIERE.value})"
            )
