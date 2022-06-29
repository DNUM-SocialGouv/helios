from functools import partial

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.extract.lecteur_csv import lis_le_fichier_csv
from datacrawler.extract.lecteur_sql import récupère_les_numéros_finess_des_établissements_de_la_base
from datacrawler.load.sauvegarde_les_activités_des_établissements_médico_sociaux import sauvegarde_les_activités_des_établissements_médico_sociaux
from datacrawler.transform.transforme_les_activités_des_établissements_médico_sociaux import transforme_les_activités_des_établissements_médico_sociaux


def ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier: str, base_de_données: Engine):
    récupère_les_numéros_finess_des_établissements_connus = partial(récupère_les_numéros_finess_des_établissements_de_la_base, base_de_données=base_de_données)

    activités_des_établissements_médico_sociaux = transforme_les_activités_des_établissements_médico_sociaux(
        chemin_du_fichier, récupère_les_numéros_finess_des_établissements_connus, lis_le_fichier_csv
    )

    sauvegarde_les_activités_des_établissements_médico_sociaux(base_de_données, activités_des_établissements_médico_sociaux)


if __name__ == "__main__":
    logger, variables_d_environnement = initialise_les_dépendances()
    base_de_données = create_engine(variables_d_environnement["DATABASE_URL"])

    chemin_du_fichier = env + "ANN.ERRD_EJ_ET"
    ajoute_les_activités_des_établissements_médico_sociaux(chemin_du_fichier, base_de_données)
