from logging import Logger
from typing import Callable, Dict, TypedDict


class VariablesDEnvironnement(TypedDict):
    SENTRY_DSN: str
    SENTRY_ENVIRONMENT: str
    DATABASE_URL: str
    DIAMANT_DATA_PATH: str
    DIAMANT_ENCRYPTED_DATA_PATH: str
    FINESS_SFTP_LOCAL_PATH: str
    UTILISATEURS_DATA_PATH: str
    CHECKED_SIREC_DATA_PATH: str
    SIVSS_DATA_PATH: str
    CHECKED_SIVSS_DATA_PATH: str
    SIICEA_DATA_PATH: str
    CHECKED_SIICEA_DATA_PATH: str
    HAPI_DATA_PATH: str
    VIGIE_RH_DATA_PATH: str
    HAS_DATA_PATH: str
    MS_NO_HAS_DATA_PATH: str
    DNUM_SFTP_HOST: str
    DNUM_SFTP_PORT: str
    DNUM_SFTP_USERNAME: str
    DNUM_SFTP_PRIVATE_KEY: str
    SIREC_DATA_PATH: str
    HAPI_FTPS_HOST: str
    HAPI_FTPS_PORT: str
    HAPI_FTPS_USERNAME: str
    HAPI_FTPS_PASSWORD: str
    SFTP_HOST: str
    SFTP_PORT: str
    SFTP_USERNAME: str
    SFTP_PRIVATE_KEY: str
    TIPIMAIL_SENDER_ADDRESS: str
    TIPIMAIL_SENDER_NAME: str
    TIPIMAIL_APIUSER: str
    TIPIMAIL_APIKEY: str
    TIPIMAIL_TO_ADDRESSES: str


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
        SENTRY_ENVIRONMENT=signale_si_la_variable_n_est_pas_présente("SENTRY_ENVIRONMENT"),
        DATABASE_URL=signale_si_la_variable_n_est_pas_présente("SCALINGO_POSTGRESQL_ALCHEMY_URL"),
        DIAMANT_DATA_PATH=signale_si_la_variable_n_est_pas_présente("DIAMANT_DATA_PATH"),
        DIAMANT_ENCRYPTED_DATA_PATH=signale_si_la_variable_n_est_pas_présente("DIAMANT_ENCRYPTED_DATA_PATH"),
        FINESS_SFTP_LOCAL_PATH=signale_si_la_variable_n_est_pas_présente("SFTP_LOCAL_PATH"),
        UTILISATEURS_DATA_PATH=signale_si_la_variable_n_est_pas_présente("UTILISATEURS_DATA_PATH"),
        CHECKED_SIREC_DATA_PATH=signale_si_la_variable_n_est_pas_présente("CHECKED_SIREC_DATA_PATH"),
        SIVSS_DATA_PATH=signale_si_la_variable_n_est_pas_présente("SIVSS_DATA_PATH"),
        CHECKED_SIVSS_DATA_PATH=signale_si_la_variable_n_est_pas_présente("CHECKED_SIVSS_DATA_PATH"),
        SIICEA_DATA_PATH=signale_si_la_variable_n_est_pas_présente("SIICEA_DATA_PATH"),
        CHECKED_SIICEA_DATA_PATH=signale_si_la_variable_n_est_pas_présente("CHECKED_SIICEA_DATA_PATH"),
        HAPI_DATA_PATH=signale_si_la_variable_n_est_pas_présente("HAPI_DATA_PATH"),
        VIGIE_RH_DATA_PATH=signale_si_la_variable_n_est_pas_présente("VIGIE_RH_DATA_PATH"),
        HAS_DATA_PATH=signale_si_la_variable_n_est_pas_présente("HAS_DATA_PATH"),
        MS_NO_HAS_DATA_PATH=signale_si_la_variable_n_est_pas_présente("MS_NO_HAS_DATA_PATH"),
        DNUM_SFTP_HOST=signale_si_la_variable_n_est_pas_présente("DNUM_SFTP_HOST"),
        DNUM_SFTP_PORT=signale_si_la_variable_n_est_pas_présente("DNUM_SFTP_PORT"),
        DNUM_SFTP_USERNAME=signale_si_la_variable_n_est_pas_présente("DNUM_SFTP_USERNAME"),
        DNUM_SFTP_PRIVATE_KEY=signale_si_la_variable_n_est_pas_présente("DNUM_SFTP_PRIVATE_KEY"),
        SIREC_DATA_PATH=signale_si_la_variable_n_est_pas_présente("SIREC_DATA_PATH"),
        HAPI_FTPS_HOST=signale_si_la_variable_n_est_pas_présente("HAPI_FTPS_HOST"),
        HAPI_FTPS_PORT=signale_si_la_variable_n_est_pas_présente("HAPI_FTPS_PORT"),
        HAPI_FTPS_USERNAME=signale_si_la_variable_n_est_pas_présente("HAPI_FTPS_USERNAME"),
        HAPI_FTPS_PASSWORD=signale_si_la_variable_n_est_pas_présente("HAPI_FTPS_PASSWORD"),
        SFTP_HOST=signale_si_la_variable_n_est_pas_présente("SFTP_HOST"),
        SFTP_PORT=signale_si_la_variable_n_est_pas_présente("SFTP_PORT"),
        SFTP_USERNAME=signale_si_la_variable_n_est_pas_présente("SFTP_USERNAME"),
        SFTP_PRIVATE_KEY=signale_si_la_variable_n_est_pas_présente("SFTP_PRIVATE_KEY"),
        TIPIMAIL_SENDER_NAME=signale_si_la_variable_n_est_pas_présente("TIPIMAIL_SENDER_NAME"),
        TIPIMAIL_SENDER_ADDRESS=signale_si_la_variable_n_est_pas_présente("TIPIMAIL_SENDER_ADDRESS"),
        TIPIMAIL_APIUSER=signale_si_la_variable_n_est_pas_présente("TIPIMAIL_APIUSER"),
        TIPIMAIL_APIKEY=signale_si_la_variable_n_est_pas_présente("TIPIMAIL_APIKEY"),
        TIPIMAIL_TO_ADDRESSES=signale_si_la_variable_n_est_pas_présente("TIPIMAIL_TO_ADDRESSES"),
    )
