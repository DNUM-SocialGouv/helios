import os
import pandas as pd
from sqlalchemy.engine import create_engine, Engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping
from datacrawler.load.nom_des_tables import FichierSource, TABLE_PROFESSION_FILIERE, TABLE_REF_PROFESSION_FILIERE
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh

def filter_profession_filiere_data(donnees: pd.DataFrame, base_de_donnees: Engine) -> pd.DataFrame:
    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_donnees)
    numéros_finess_liste = numéros_finess_des_établissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()

    year_regex = r"((20[012]\d{1}|19\d{2}))"

    # Filtrer les données
    donnees_filtrées = donnees[
        (donnees["numero_finess"].astype(str).str.len() == 9) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["numero_finess"].astype(str).isin(numéros_finess_liste))
    ]

    return donnees_filtrées

if __name__ == "__main__":
    # Initialisations
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données = create_engine(variables_d_environnement["DATABASE_URL"])

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
    traite_contract = verifie_si_le_fichier_est_traite(date_de_mise_à_jour_profession_filiere, base_de_données, FichierSource.VIGIE_RH_PROFESSION_FILIERE.value)

    date_de_mise_à_jour_ref = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref)
    traite_ref = verifie_si_le_fichier_est_traite(date_de_mise_à_jour_ref, base_de_données, FichierSource.VIGIE_RH_REF_PROFESSION_FILIERE.value)

    # Traitements des données
    if traite_contract and traite_ref:
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_PROFESSION_FILIERE.value} a été déjà traité")
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_REF_PROFESSION_FILIERE.value} a été déjà traité")
    else:
        df_ref = lis_le_fichier_parquet(chemin_local_du_fichier_ref, ColumMapping.REF_PROFESSION_FILIERE.value)

        data_frame = lis_le_fichier_parquet(chemin_local_du_fichier_profession_filiere, ColumMapping.PROFESSION_FILIERE.value)
        df_filtré = filter_profession_filiere_data(data_frame, base_de_données)

        supprimer_donnees_existantes(TABLE_PROFESSION_FILIERE, base_de_données, SOURCE, logger_helios)
        supprimer_donnees_existantes(TABLE_REF_PROFESSION_FILIERE, base_de_données, SOURCE, logger_helios)

        inserer_nouvelles_donnees(
            TABLE_REF_PROFESSION_FILIERE,
            base_de_données,
            SOURCE,
            df_ref,
            logger_helios,
            FichierSource.VIGIE_RH_REF_PROFESSION_FILIERE,
            date_de_mise_à_jour_ref
        )

        inserer_nouvelles_donnees(
            TABLE_PROFESSION_FILIERE,
            base_de_données,
            SOURCE,
            df_filtré,
            logger_helios,
            FichierSource.VIGIE_RH_PROFESSION_FILIERE,
            date_de_mise_à_jour_profession_filiere
    )
