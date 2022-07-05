from logging import Logger
from typing import Callable, Dict, TypedDict


class VariablesDEnvironnement(TypedDict):
    SENTRY_DSN: str
    DATABASE_URL: str
    DNUM_SFTP_LOCAL_PATH: str


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

    return VariablesDEnvironnement(
        SENTRY_DSN=signale_si_la_variable_n_est_pas_présente("SENTRY_DSN"),
        DATABASE_URL=signale_si_la_variable_n_est_pas_présente("SCALINGO_POSTGRESQL_ALCHEMY_URL"),
        DNUM_SFTP_LOCAL_PATH=signale_si_la_variable_n_est_pas_présente("DNUM_SFTP_LOCAL_PATH"),
    )
