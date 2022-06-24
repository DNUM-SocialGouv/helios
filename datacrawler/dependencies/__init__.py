from datacrawler.dependencies.sentry import initialise_sentry
from datacrawler.dependencies.variables_d_environnement import lis_les_variables_d_environnement


def initialise_les_dépendances():
    variables_d_environnement = lis_les_variables_d_environnement()
    initialise_sentry(variables_d_environnement)
