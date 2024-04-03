import os
import datetime

from logging import Logger

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.trouve_le_nom_du_fichier import trouve_le_nom_du_fichier_sirec_sivss
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.transform.equivalences_sivss_helios import (
    colonnes_a_lire_bloc_qualite_evenements_indesirables,
    extrais_l_equivalence_des_types_des_colonnes,
    equivalences_sivss_evenements_indesirables_helios,
)

def get_year_from_date(date_to_convert):
    return int(datetime.datetime.strptime(date_to_convert, '%d/%m/%Y').strftime("%Y"))

def check_finess_number(finess):
    return (len(finess) == 9) | (finess == 'nan')

def filter_famille(famille):
    return (famille == 'Evénements indésirables/graves associés aux soins') | (famille == 'Evénements/incidents dans un établissement ou organisme')

def filter_motif(motif):
     return (motif != 'Incomplet') & (motif != 'Doublon') & (motif != 'Non validé')

def filter_etat(etat):
     return (etat != 'Interco')

def check_downloaded_sivss_file(chemin_local_du_fichier_evenements_indesirables: str, fichier_sivss_traite: str) -> None:
        types_des_colonnes = extrais_l_equivalence_des_types_des_colonnes(equivalences_sivss_evenements_indesirables_helios)
        donnees_evenements_indesirables = lis_le_fichier_csv(chemin_local_du_fichier_evenements_indesirables, colonnes_a_lire_bloc_qualite_evenements_indesirables, types_des_colonnes)
        current_year = int(datetime.date.today().strftime("%Y"))
        donnees_evenements_indesirables_filtrees = donnees_evenements_indesirables[(donnees_evenements_indesirables['MOTIF_CLOTURE'].apply(filter_motif)) & (donnees_evenements_indesirables['ETAT'].apply(filter_etat)) & (donnees_evenements_indesirables['FAMILLE_PRINCIPALE'].apply(filter_famille)) & (donnees_evenements_indesirables['DATE_RECEPTION'].apply(get_year_from_date).le(current_year)) & (donnees_evenements_indesirables['DATE_RECEPTION'].apply(get_year_from_date).ge(current_year - 3)) & (donnees_evenements_indesirables['NUMERO_SIVSS'].astype(str).str.len() == 6) & (donnees_evenements_indesirables['DECLARANT_ORGANISME_NUMERO_FINESS'].astype(str).apply(check_finess_number)) & (donnees_evenements_indesirables['SCC_ORGANISME_FINESS'].astype(str).apply(check_finess_number))]      
        donnees_evenements_indesirables_filtrees.to_csv(fichier_sivss_traite, index=False, sep=';')
    
if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()

    sivss_data_path = variables_d_environnement["SIVSS_DATA_PATH"]
    checked_sivss_data_path = variables_d_environnement["CHECKED_SIVSS_DATA_PATH"]

    if not os.path.exists(checked_sivss_data_path):
        os.makedirs(checked_sivss_data_path)

    fichiers = os.listdir(sivss_data_path)

    chemin_local_du_fichier_sivss = os.path.join(
        sivss_data_path, trouve_le_nom_du_fichier_sirec_sivss(fichiers, "sivss", logger_helios)
    )

    fichier_sivss_traite = os.path.join(
        checked_sivss_data_path, trouve_le_nom_du_fichier_sirec_sivss(fichiers, "sivss", logger_helios)
    )

    check_downloaded_sivss_file(chemin_local_du_fichier_sivss, fichier_sivss_traite, logger_helios)