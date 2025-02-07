from datetime import datetime
import hashlib
from logging import Logger
import pandas as pd
from pandas import Series
import sqlalchemy as db
from sqlalchemy.engine import Engine, create_engine, Connection
from sqlalchemy import select, Table

from datacrawler.dependencies.dépendances import initialise_les_dépendances


def import_des_utilisateurs(base_de_données: Engine, logger: Logger) -> None:
    utilisateur_data_file = variables_d_environnement["UTILISATEURS_DATA_PATH"] + "/Utilisateurs_Helios_importation.csv"
    metadata = db.MetaData()

    data_frame = pd.read_csv(utilisateur_data_file, encoding="utf-8", delimiter=";").astype(str)
    db_users = db.Table("utilisateur", metadata, autoload=True, autoload_with=base_de_données)
    db_roles = db.Table("role", metadata, autoload=True, autoload_with=base_de_données)
    db_institutions = db.Table("institution", metadata, autoload=True, autoload_with=base_de_données)
    db_profils = db.Table("profil", metadata, autoload=True, autoload_with=base_de_données)
    with base_de_données.begin() as connection:
        for user in data_frame.iterrows():
            data = user[1].astype(str)
            query = select([db_users]).where(db_users.columns.ut_email == data["E-mail"])
            rst = connection.execute(query).fetchone()

            if rst:
                modifier_utilisateur(connection, data, logger, db_users, db_roles, db_institutions)
            else:
                creer_utilisateur(connection, data, logger, db_users, db_roles, db_institutions, db_profils)


def modifier_utilisateur(connection: Connection, data: Series, logger: Logger, db_users: Table, db_roles: Table, db_institutions: Table) -> None:
    logger.info("Utilisateur en modification :" + data["E-mail"])
    get_institute_by_code = select([db_institutions.columns.inst_id]).where(db_institutions.columns.inst_code == data["Code institution"])
    institute_id = connection.execute(get_institute_by_code).fetchone()[0]
    get_role_by_code = select([db_roles.columns.role_id]).where(db_roles.columns.role_code == data["Code Rôle"])
    role_id = connection.execute(get_role_by_code).fetchone()[0]
    profils = data["Profils"].split(":")
    connection.execute(
        db_users.update()
        .where(db_users.columns.ut_email == data["E-mail"])
        .values(
            ut_nom=data["Nom"],
            ut_prenom=data["Prénom"],
            ut_institution=institute_id,
            ut_actif=True,
            ut_role=role_id,
            ut_profiles=profils,
            ut_date_modification=datetime.now(),
        )
    )


def creer_utilisateur(
    connection: Connection, data: Series, logger: Logger, db_users: Table, db_roles: Table, db_institutions: Table, db_profils: Table
) -> None:
    logger.info("Utilisateur en création :" + data["E-mail"])
    hashing = hashlib.sha256()
    hashing.update(b"HeliosConnect-")
    get_institute_by_code = select([db_institutions.columns.inst_id, db_institutions.columns.inst_code_geo]).where(
        db_institutions.columns.inst_code == data["Code institution"]
    )
    rst = connection.execute(get_institute_by_code).fetchone()
    get_role_by_code = select([db_roles.columns.role_id]).where(db_roles.columns.role_code == data["Code Rôle"])
    role_id = connection.execute(get_role_by_code).fetchone()[0]
    get_dafault_profile = select([db_profils.columns.profil_code]).where(db_profils.columns.profil_id == 1)
    default_profile = connection.execute(get_dafault_profile).fetchone()[0]
    profils = []
    if data["Profils"] == "nan":
        profils = [default_profile]
    else:
        profils = data["Profils"].split(":")
    hashing.update(str(rst[1]).encode("utf-8"))
    connection.execute(
        db_users.insert().values(
            ut_nom=data["Nom"],
            ut_prenom=data["Prénom"],
            ut_email=data["E-mail"],
            ut_institution=rst[0],
            ut_actif=True,
            ut_role=role_id,
            ut_password=hashing.hexdigest(),
            ut_profiles=profils,
            ut_date_creation=datetime.now(),
        )
    )


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    import_des_utilisateurs(base_de_données_helios, logger_helios)
