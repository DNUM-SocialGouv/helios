from logging import Logger

from sqlalchemy import text
from sqlalchemy.engine import Engine, create_engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances


def create_test_user(logger: Logger, base_de_données: Engine) -> None:
    with base_de_données.begin() as connection:
        nb_users = connection.execute(text("SELECT count(*) FROM utilisateur")).scalar()

        if nb_users == 0:
            connection.execute(
                text(
                    """INSERT INTO public.utilisateur
                        (ut_nom, ut_prenom, ut_email, ut_institution, ut_actif, ut_role, ut_password, ut_date_creation, ut_profiles)
                    VALUES(:nom, :prenom, :email, :institution, :actif, :role, :password, :date_creation, :profiles)"""
                ),
                {
                    "nom": "DOE",
                    "prenom": "John",
                    "email": "john.doe@notadomain.tst",
                    "institution": 1,
                    "actif": True,
                    "role": 1,
                    "password": "$2a$12$dECXw9M9itxb6on74EJS.u8YDDBPMPuVU/SILIdmDhwfm22shDxWG",
                    "date_creation": "2026-07-14 13:36:46.330",
                    "profiles": "{14c7773c-49a0-4306-9b44-4ec50ef5db44}",
                },
            )
            logger.info("User created successfully")
        else:
            logger.info("There are already users in the database. No test user will be created.")


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    create_test_user(logger_helios, base_de_données_helios)
