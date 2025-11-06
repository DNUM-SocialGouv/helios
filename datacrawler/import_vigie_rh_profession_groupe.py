import os
import pandas as pd
import numpy as np
from sqlalchemy.engine import create_engine, Engine
from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping
from datacrawler.load.nom_des_tables import (
    FichierSource,
    TABLE_PROFESSION_GROUPE,
    TABLE_REF_PROFESSION_GROUPE,
)
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh


def filter_profession_groupe_data(donnees: pd.DataFrame, ref_code: np.ndarray, database : Engine) -> pd.DataFrame:

    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(database)
    numeros_finess_liste = numeros_finess_des_etablissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()

    year_regex = r"(19\d{2}|2\d{3})"

    # Convertir 'mois' en nombres entiers après gestion des flottants
    donnees["mois"] = pd.to_numeric(donnees["mois"], errors='coerce').fillna(0).astype(int)
    donnees["profession_code"] = pd.to_numeric(donnees["profession_code"], errors='coerce').astype("Int64")

    # Filtrer les données
    donnees_filtrees = donnees[
        (donnees["numero_finess"].astype(str).str.len() == 9) &
        (donnees["numero_finess"].astype(str).isin(numeros_finess_liste)) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["mois"].astype(str).astype(int).between(1, 12)) &
        (donnees["profession_code"].isin(ref_code))
    ]

    return donnees_filtrees

if __name__ == "__main__":

    # Initialisations
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees = create_engine(variables_d_environnement["DATABASE_URL"])

    vegie_rh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vegie_rh_data_path)

    chemin_local_du_fichier_profession_groupe = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_PROFESSION_GROUPE.value, logger_helios)
    )
    chemin_local_du_fichier_ref_profession_groupe = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE.value, logger_helios)
    )
    chemin_local_du_fichier_passage_profession = os.path.join(
        vegie_rh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_PASSAGE_GROUPE_FILIERE.value, logger_helios)
    )

    date_de_mise_à_jour_profession_groupe = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_profession_groupe)
    traite_profession_groupe = verifie_si_le_fichier_est_traite(
        date_de_mise_à_jour_profession_groupe,
        base_de_donnees,
        FichierSource.VIGIE_RH_PROFESSION_GROUPE.value
    )

    date_de_mise_à_jour_ref_profession_groupe = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_ref_profession_groupe)
    traite_ref_profession_groupe = verifie_si_le_fichier_est_traite(
        date_de_mise_à_jour_ref_profession_groupe,
        base_de_donnees,
        FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE.value
    )
    date_de_mise_a_jour_passage_profession = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_du_fichier_passage_profession)

    # Traitements des données
    if traite_profession_groupe and traite_ref_profession_groupe:
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_PROFESSION_GROUPE.value} a été déjà traité")
        logger_helios.info(f"Le fichier {FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE.value} a été déjà traité")
    else:
        if len({
            date_de_mise_à_jour_profession_groupe,
            date_de_mise_à_jour_ref_profession_groupe,
            date_de_mise_a_jour_passage_profession
        }) == 1:

            df_ref_profession_groupe = lis_le_fichier_parquet(chemin_local_du_fichier_ref_profession_groupe, ColumMapping.REF_PROFESSION_GROUPE.value)
            code_list_ref_profession_groupe = np.array(df_ref_profession_groupe['code'].tolist())

            df_passage_professions = lis_le_fichier_parquet(
                chemin_local_du_fichier_passage_profession,
                ColumMapping.PASSAGE_GROUPE_FILIERE.value
            )
            df_passage_professions.rename(columns={"profession_code": "code"}, inplace=True)

            df_ref_profession_groupe = df_ref_profession_groupe.merge(
                df_passage_professions,
                on="code",
                how="left"
            )
            df_ref_profession_groupe["code_filiere"] = pd.to_numeric(
                df_ref_profession_groupe["code_filiere"], errors="coerce"
            ).astype("Int64")

            data_frame = lis_le_fichier_parquet(chemin_local_du_fichier_profession_groupe, ColumMapping.PROFESSION_GROUPE.value)
            df_filtre = filter_profession_groupe_data(data_frame, code_list_ref_profession_groupe, base_de_donnees)

            supprimer_donnees_existantes(TABLE_PROFESSION_GROUPE, base_de_donnees, SOURCE, logger_helios)
            supprimer_donnees_existantes(TABLE_REF_PROFESSION_GROUPE, base_de_donnees, SOURCE, logger_helios)

            inserer_nouvelles_donnees(
                TABLE_REF_PROFESSION_GROUPE,
                base_de_donnees,
                SOURCE,
                df_ref_profession_groupe,
                logger_helios,
                FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE,
                date_de_mise_à_jour_ref_profession_groupe
            )
            inserer_nouvelles_donnees(
                TABLE_PROFESSION_GROUPE,
                base_de_donnees,
                SOURCE,
                df_filtre,
                logger_helios,
                FichierSource.VIGIE_RH_PROFESSION_GROUPE,
                date_de_mise_à_jour_profession_groupe
            )
        else:
            logger_helios.info(
                f"[{SOURCE}]❌ Les dates des fichiers sources ne sont pas cohérentes. "
                f"({FichierSource.VIGIE_RH_PROFESSION_GROUPE.value}, "
                f"{FichierSource.VIGIE_RH_REF_PROFESSION_GROUPE.value}, "
                f"{FichierSource.VIGIE_RH_REF_PASSAGE_GROUPE_FILIERE.value})"
            )
