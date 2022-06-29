import os
from functools import partial
from logging import Logger

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.load.sauvegarde_les_activités_des_établissements_médico_sociaux import \
    sauvegarde_les_activités_des_établissements_médico_sociaux
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import \
    transforme_les_activités_des_établissements_médico_sociaux


def ajoute_les_activités_des_établissements_médico_sociaux(
        chemin_du_fichier: str,
        base_de_données: Engine,
        logger:Logger
):
    récupère_les_numéros_finess_des_établissements_connus = partial(
        récupère_les_numéros_finess_des_établissements_de_la_base, base_de_données=base_de_données)

    activités_des_établissements_médico_sociaux = transforme_les_activités_des_établissements_médico_sociaux(
        chemin_du_fichier, récupère_les_numéros_finess_des_établissements_connus, lis_le_fichier_csv
    )

    sauvegarde_les_activités_des_établissements_médico_sociaux(base_de_données,
                                                               activités_des_établissements_médico_sociaux)


if __name__ == "__main__":
    logger, variables_d_environnement = initialise_les_dépendances()
    base_de_données = create_engine(variables_d_environnement["DATABASE_URL"])
    fichier_ann_errd_ej_et = [
        nom_de_fichier
        for nom_de_fichier in os.listdir(variables_d_environnement['DNUM_SFTP_LOCAL_PATH'])
        if 'ANN_ERRD_EJ_ET' in nom_de_fichier
    ][0]
    chemin_du_fichier = os.path.join(variables_d_environnement['DNUM_SFTP_LOCAL_PATH'], fichier_ann_errd_ej_et)
    logger.info(f"Cherche les activités pour les ET médico-sociaux dans le fichier {chemin_du_fichier}")
    ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, base_de_données, logger)
