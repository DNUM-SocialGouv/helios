import os
from logging import Logger
from typing import TypedDict


class VariablesDEnvironnement(TypedDict):
    SENTRY_DSN: str


def lis_les_variables_d_environnement(logger: Logger) -> VariablesDEnvironnement:
    def signale_si_la_variable_n_est_pas_présente(nom_de_variable: str) -> str:
        if (variable := os.environ.get(nom_de_variable)) is None:
            logger.warning(f'----- WARNING ----- La variable d’environnement "{nom_de_variable}" est manquante.')
            variable = ""

        return variable

    return VariablesDEnvironnement(SENTRY_DSN=signale_si_la_variable_n_est_pas_présente("SENTRY_DSN"))
