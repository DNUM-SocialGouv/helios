import os
from logging import Logger

import pandas as pd

from sqlalchemy.engine import Engine, create_engine
from datacrawler.load.nom_des_tables import TABLE_VIGIE_RH_REF_MOTIFS_RUPTURES, TABLE_VIGIE_RH_MOTIFS_RUPTURES, FichierSource

from datacrawler import supprimer_donnees_existantes, inserer_nouvelles_donnees, verifie_si_le_fichier_est_traite
from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.extrais_la_date_du_nom_de_fichier import extrais_la_date_du_nom_de_fichier_vigie_rh
from datacrawler.extract.lecteur_parquet import lis_le_fichier_parquet
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier
from datacrawler.transform.equivalence_vigierh_helios import SOURCE, ColumMapping
from datacrawler.extract.lecteur_sql import recupere_les_numeros_finess_des_etablissements_de_la_base


def filtrer_les_donnees(donnees: pd.DataFrame, references: pd.DataFrame, base_de_donnees: Engine) -> pd.DataFrame:
    numeros_finess_des_etablissements_connus = recupere_les_numeros_finess_des_etablissements_de_la_base(base_de_donnees)
    numeros_finess_liste = numeros_finess_des_etablissements_connus['numero_finess_etablissement_territorial'].astype(str).tolist()
    codes_motifs = references['code'].astype(str).tolist()

    year_regex = r"(19\d{2}|2\d{3})"

    # Filtrer les données
    donnees_filtrees = donnees[
        (donnees["finess_et"].astype(str).str.len() == 9) &
        (donnees["annee"].astype(str).str.match(year_regex)) &
        (donnees["finess_et"].astype(str).isin(numeros_finess_liste)) &
        (donnees["motif_code"].astype(str).isin(codes_motifs))
    ]

    return donnees_filtrees


def import_donnees_motifs_ruptures(chemin_local_fichier_ref: str, chemin_local_fichier_donnees: str, base_de_donnees: Engine, logger: Logger) -> None:
    date_du_fichier_ref = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_fichier_ref)
    date_du_fichier_donnees = extrais_la_date_du_nom_de_fichier_vigie_rh(chemin_local_fichier_donnees)
    # si les fichiers ref et données ne sont pas de même date, on fait rien
    if date_du_fichier_ref != date_du_fichier_donnees:
        logger.info(
                f"[{SOURCE}]❌ Les dates des fichiers sources ne sont pas cohérentes "
                f"({FichierSource.VIGIE_RH_REF_MOTIFS_RUPTURES.value}, "
                f"{FichierSource.VIGIE_RH_MOTIFS_RUPTURES.value})."
            )
    else:
        # si les fichiers sont déjà traités, on fait rien
        ref_traite = verifie_si_le_fichier_est_traite(chemin_local_fichier_ref, base_de_donnees, FichierSource.VIGIE_RH_REF_MOTIFS_RUPTURES.value)
        donnees_traite =  verifie_si_le_fichier_est_traite(chemin_local_fichier_donnees, base_de_donnees, FichierSource.VIGIE_RH_MOTIFS_RUPTURES.value)
        if ref_traite & donnees_traite:
            logger.info(
                f"Les fichiers {FichierSource.VIGIE_RH_REF_MOTIFS_RUPTURES.value} et {FichierSource.VIGIE_RH_MOTIFS_RUPTURES.value}  ont été déjà traités")
        else:
            references =  lis_le_fichier_parquet(chemin_local_fichier_ref, ColumMapping.REF_MOTIFS_RUPTURES.value)
            donnees_brutes = lis_le_fichier_parquet(chemin_local_fichier_donnees, ColumMapping.MOTIFS_RUPTURES.value)
            donnees = filtrer_les_donnees(donnees_brutes, references, base_de_donnees)
            supprimer_donnees_existantes(TABLE_VIGIE_RH_REF_MOTIFS_RUPTURES, base_de_donnees, SOURCE, logger)
            supprimer_donnees_existantes(TABLE_VIGIE_RH_MOTIFS_RUPTURES, base_de_donnees, SOURCE, logger)
            inserer_nouvelles_donnees(
                TABLE_VIGIE_RH_REF_MOTIFS_RUPTURES,
                base_de_donnees,
                SOURCE,
                references,
                logger,
                FichierSource.VIGIE_RH_REF_MOTIFS_RUPTURES,
                date_du_fichier_ref
            )
            inserer_nouvelles_donnees(
                TABLE_VIGIE_RH_MOTIFS_RUPTURES,
                base_de_donnees,
                SOURCE,
                donnees,
                logger,
                FichierSource.VIGIE_RH_MOTIFS_RUPTURES,
                date_du_fichier_donnees
            )

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    vigierh_data_path = variables_d_environnement["VIGIE_RH_DATA_PATH"]
    fichiers = os.listdir(vigierh_data_path)

    chemin_fichier_ref = os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_REF_MOTIFS_RUPTURES.value, logger_helios))
    chemin_fichier_donnees = os.path.join(
        vigierh_data_path,
        trouve_le_nom_du_fichier(fichiers, FichierSource.VIGIE_RH_MOTIFS_RUPTURES.value, logger_helios))

    import_donnees_motifs_ruptures(chemin_fichier_ref,chemin_fichier_donnees,base_de_donnees_helios,logger_helios)
