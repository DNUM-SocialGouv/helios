import os

from dotenv import dotenv_values

from datacrawler.dependencies.logger.logger import crée_le_logger
from datacrawler.dependencies.sentry import initialise_sentry
from datacrawler.dependencies.variables_d_environnement.variables_d_environnement import récupère_les_variables_d_environnement


def initialise_les_dépendances():
    logger = crée_le_logger()
    variables_d_environnement = récupère_les_variables_d_environnement(logger, dict(os.environ), dotenv_values)
    initialise_sentry(variables_d_environnement)
