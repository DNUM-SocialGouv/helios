from logging import Logger
from typing import Callable, Dict, TypedDict


class VariablesDEnvironnement(TypedDict):
    SENTRY_DSN: str


def récupère_les_variables_d_environnement(
    logger: Logger, variables_d_environnement: Dict[str, str], lis_les_variables_d_environnement_du_fichier: Callable
) -> VariablesDEnvironnement:
    config = {
        **variables_d_environnement,
        **lis_les_variables_d_environnement_du_fichier(".env.local"),
    }

    def signale_si_la_variable_n_est_pas_présente(nom_de_variable: str) -> str:
        if (variable := config.get(nom_de_variable)) in ("toBeSet", None):
            logger.warning(f'----- WARNING ----- La variable d’environnement "{nom_de_variable}" est manquante.')
            variable = ""

        return str(variable)

    return VariablesDEnvironnement(SENTRY_DSN=signale_si_la_variable_n_est_pas_présente("SENTRY_DSN"))
