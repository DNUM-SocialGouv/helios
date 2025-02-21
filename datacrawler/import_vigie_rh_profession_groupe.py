import os
import pandas as pd
from sqlalchemy.engine import create_engine, Engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping
from datacrawler.load.nom_des_tables import (
    FichierSource,
    TABLE_PROFESSION_GROUPE,
    TABLE_REF_MASQUE,
    TABLE_REF_PROFESSION_GROUPE,
    TABLE_REF_QUALITE,
    TABLE_REF_REDRESSEMENT
)
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh

def filter_profession_groupe_data(donnees: pd.DataFrame, base_de_donnees: Engine) -> pd.DataFrame:
    numéros_finess_des_établissements_connus = récupère_les_numéros_finess_des_établissements_de_la_base(base_de_donnees)
    numéros_finess_liste = numéros_finess_des_établissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()

    year_regex = r"(19\d{2}|2\d{3})"

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

    chemin_local_du_fichier_profession_groupe = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_PROFESSION_GROUPE.value, logger_helios)
    )
    chemin_local_du_fichier_ref_masque = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_MASQUE.value, logger_helios)
    )
    chemin_local_du_fichier_ref_profession_groupe = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE.value, logger_helios)
    )
    chemin_local_du_fichier_ref_qualite = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_QUALITE.value, logger_helios)
    )
    chemin_local_du_fichier_ref_redressement = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_REDRESSEMENT.value, logger_helios)
    )

    date_de_mise_à_jour_profession_groupe = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_profession_groupe)
    traite_profession_groupe = verifie_si_le_fichier_est_traite(
        date_de_mise_à_jour_profession_groupe,
        base_de_données,
        FichierSource.VIGIE_RH_PROFESSION_GROUPE.value
    )

    date_de_mise_à_jour_ref_masque = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref_masque)
    traite_ref_masque = verifie_si_le_fichier_est_traite(
        date_de_mise_à_jour_ref_masque,
        base_de_données,
        FichierSource.VIGIE_RH_REF_MASQUE.value
    )

    date_de_mise_à_jour_ref_profession_groupe = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref_profession_groupe)
    traite_ref_profession_groupe = verifie_si_le_fichier_est_traite(
        date_de_mise_à_jour_ref_profession_groupe,
        base_de_données,
        FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE.value
    )

    date_de_mise_à_jour_ref_qualite = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref_qualite)
    traite_ref_qualite = verifie_si_le_fichier_est_traite(date_de_mise_à_jour_ref_qualite, base_de_données, FichierSource.VIGIE_RH_REF_QUALITE.value)

    date_de_mise_à_jour_ref_redressement = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref_redressement)
    traite_ref_redressement = verifie_si_le_fichier_est_traite(
        date_de_mise_à_jour_ref_redressement,
        base_de_données,
        FichierSource.VIGIE_RH_REF_REDRESSEMENT.value
    )

    # Traitements des données
    if traite_profession_groupe and traite_ref_masque and traite_ref_profession_groupe and traite_ref_qualite and traite_ref_redressement:
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_PROFESSION_GROUPE.value} a été déjà traité")
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_REF_MASQUE.value} a été déjà traité")
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE.value} a été déjà traité")
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_REF_QUALITE.value} a été déjà traité")
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_REF_REDRESSEMENT.value} a été déjà traité")
    else:
        if len({date_de_mise_à_jour_profession_groupe,
        date_de_mise_à_jour_ref_masque,
        date_de_mise_à_jour_ref_profession_groupe,
        date_de_mise_à_jour_ref_qualite,
        date_de_mise_à_jour_ref_redressement}) == 1:

            df_ref_masque = lis_le_fichier_parquet(chemin_local_du_fichier_ref_masque, ColumMapping.REF_MASQUE.value)
            df_ref_profession_groupe = lis_le_fichier_parquet(chemin_local_du_fichier_ref_profession_groupe, ColumMapping.REF_PROFESSION_GROUPE.value)
            df_ref_qualite = lis_le_fichier_parquet(chemin_local_du_fichier_ref_qualite, ColumMapping.REF_QUALITE.value)
            df_ref_redressement = lis_le_fichier_parquet(chemin_local_du_fichier_ref_redressement, ColumMapping.REF_REDRESSEMENT.value)
            data_frame = lis_le_fichier_parquet(chemin_local_du_fichier_profession_groupe, ColumMapping.PROFESSION_GROUPE.value)
            df_filtré = filter_profession_groupe_data(data_frame, base_de_données)

            supprimer_donnees_existantes(TABLE_PROFESSION_GROUPE, base_de_données, SOURCE, logger_helios)
            supprimer_donnees_existantes(TABLE_REF_MASQUE, base_de_données, SOURCE, logger_helios)
            supprimer_donnees_existantes(TABLE_REF_PROFESSION_GROUPE, base_de_données, SOURCE, logger_helios)
            supprimer_donnees_existantes(TABLE_REF_QUALITE, base_de_données, SOURCE, logger_helios)
            supprimer_donnees_existantes(TABLE_REF_REDRESSEMENT, base_de_données, SOURCE, logger_helios)

            inserer_nouvelles_donnees(
                TABLE_REF_MASQUE,
                base_de_données,
                SOURCE,
                df_ref_masque,
                logger_helios,
                FichierSource.VIGIE_RH_REF_MASQUE,
                date_de_mise_à_jour_ref_masque
            )
            inserer_nouvelles_donnees(
                TABLE_REF_PROFESSION_GROUPE,
                base_de_données,
                SOURCE,
                df_ref_profession_groupe,
                logger_helios,
                FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE,
                date_de_mise_à_jour_ref_profession_groupe
            )
            inserer_nouvelles_donnees(
                TABLE_REF_QUALITE,
                base_de_données,
                SOURCE,
                df_ref_qualite,
                logger_helios,
                FichierSource.VIGIE_RH_REF_QUALITE,
                date_de_mise_à_jour_ref_qualite
            )
            inserer_nouvelles_donnees(
                TABLE_REF_REDRESSEMENT,
                base_de_données,
                SOURCE,
                df_ref_redressement,
                logger_helios,
                FichierSource.VIGIE_RH_REF_REDRESSEMENT,
                date_de_mise_à_jour_ref_redressement
            )
            inserer_nouvelles_donnees(
                TABLE_PROFESSION_GROUPE,
                base_de_données,
                SOURCE,
                df_filtré,
                logger_helios,
                FichierSource.VIGIE_RH_PROFESSION_GROUPE,
                date_de_mise_à_jour_profession_groupe
            )
        else:
            logger_helios.info(
                f"[{SOURCE}]❌ Les dates des fichiers sources ne sont pas cohérentes. "
                f"({FichierSource.VIGIE_RH_PROFESSION_GROUPE.value}, "
                f"{FichierSource.VIGIE_RH_REF_REDRESSEMENT.value}, "
                f"{FichierSource.VIGIE_RH_REF_QUALITE.value}, "
                f"{FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE.value}, "
                f"{FichierSource.VIGIE_RH_REF_MASQUE.value})"
            )
