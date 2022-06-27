from datacrawler.dependencies.logger import crée_le_logger
from datacrawler.dependencies.sentry import initialise_sentry
from datacrawler.dependencies.variablesdenvironnement import lis_les_variables_d_environnement


def initialise_les_dépendances():
    logger = crée_le_logger()
    variables_d_environnement = lis_les_variables_d_environnement(logger)
    initialise_sentry(variables_d_environnement)
