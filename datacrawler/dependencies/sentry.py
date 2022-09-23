import sentry_sdk

from datacrawler.dependencies.variables_d_environnement.variables_d_environnement import VariablesDEnvironnement


def initialise_sentry(variables_d_environnement: VariablesDEnvironnement) -> None:
    sentry_sdk.init(dsn=variables_d_environnement["SENTRY_DSN"], environment=variables_d_environnement["SENTRY_ENVIRONMENT"], traces_sample_rate=1.0)
