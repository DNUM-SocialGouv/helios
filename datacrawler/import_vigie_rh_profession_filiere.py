import os
import pandas as pd
import numpy as np
from sqlalchemy.engine import create_engine, Engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet, trouver_lannee_max_disponible
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping
from datacrawler.load.nom_des_tables import FichierSource, TABLE_PROFESSION_FILIERE, TABLE_REF_PROFESSION_FILIERE
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh

def filter_profession_filiere_data(donnees: pd.DataFrame, ref_code: np.ndarray, database: Engine) -> pd.DataFrame:
    # Récupérer les numéros FINESS des établissements connus
    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(database)
    numeros_finess_liste = numeros_finess_des_etablissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()
    annee_max_disponible = trouver_lannee_max_disponible(donnees)
    year_regex = r"(19\d{2}|2\d{3})"

    # Convertir 'mois' en nombres entiers après gestion des flottants
    donnees["mois"] = pd.to_numeric(donnees["mois"], errors='coerce').fillna(0).astype(int)
    donnees["profession_code"] = pd.to_numeric(donnees["profession_code"], errors='coerce').astype('Int64')

    # Filtrer les données selon les critères demandés
    donnees_filtrees = donnees[
        (donnees["numero_finess"].astype(str).str.len() == 9) &
        (donnees["numero_finess"].astype(str).isin(numeros_finess_liste)) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["annee"].astype(int).between(annee_max_disponible - 2, annee_max_disponible)) &
        (donnees["mois"].between(1, 12)) &
        (donnees["profession_code"].isin(ref_code))
    ]

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
