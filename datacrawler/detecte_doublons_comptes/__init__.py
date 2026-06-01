from logging import Logger

from sqlalchemy import text
from sqlalchemy.engine import Engine, create_engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.detecte_doublons_comptes.send_email_doublons import send_email_doublons


def detecte_doublons_comptes(base_de_donnees: Engine, logger: Logger) -> None:
    with base_de_donnees.begin() as connection:
        resultat = connection.execute(
            text("""
                SELECT LOWER(TRIM(ut_email)) as email, COUNT(*) as count,
                       ARRAY_AGG(ut_date_creation ORDER BY ut_date_creation) as dates_creation
                FROM utilisateur
                GROUP BY LOWER(TRIM(ut_email))
                HAVING COUNT(*) > 1
            """)
        ).fetchall()

    if not resultat:
        logger.info("Aucun doublon de compte detecte.")
        return

    logger.info(f"{len(resultat)} doublon(s) de compte detecte(s).")
    send_email_doublons(resultat)
    logger.info("Email envoye au support.")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    detecte_doublons_comptes(base_de_donnees_helios, logger_helios)
