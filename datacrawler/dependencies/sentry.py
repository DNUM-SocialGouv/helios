import sentry_sdk
from datacrawler.dependencies.variablesdenvironnement import VariablesDEnvironnement


def initialise_sentry(variables_d_environnement: VariablesDEnvironnement):
    print(f"{variables_d_environnement['SENTRY_DSN']=}")
    sentry_sdk.init(dsn=variables_d_environnement["SENTRY_DSN"], traces_sample_rate=1.0, debug=True, environment="development")
