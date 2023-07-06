from logging import Logger
import pandas as pd
import hashlib
import sqlalchemy as db
from sqlalchemy.engine import Engine, create_engine
from datetime import datetime

from datacrawler.dependencies.dépendances import initialise_les_dépendances


def import_des_utilisateurs(base_de_données: Engine, logger: Logger) -> None:
    
    utilisateur_data_file = variables_d_environnement["UTILISATEURS_DATA_PATH"]+"/Utilisateurs_Helios_importation.csv"
    metadata = db.MetaData()
    
    df = pd.read_csv(utilisateur_data_file,encoding='utf-8', delimiter=";").astype(str)
    db_users = db.Table('utilisateur', metadata, autoload=True, autoload_with=base_de_données)
    db_roles = db.Table('role', metadata, autoload=True, autoload_with=base_de_données)
    db_institutions = db.Table('institution', metadata, autoload=True, autoload_with=base_de_données)
    hashing = hashlib.sha256()
    hashing.update(b"HeliosConnect-")
    

    with base_de_données.begin() as connection:
        for user in df.iterrows():
            data = user[1].astype(str)
            query = db_users.select().where(db_users.columns.ut_email == data["E-mail"])
            rst = connection.execute(query).fetchone()

            if rst:
                logger.info("Utilisateur en modification :" + data["E-mail"])
                code_Insitution = data['Code institution']
                code_role = data['Code Rôle']
                getInstituteByCode = db.select([db_institutions.columns.inst_id]).filter_by(inst_code = code_Insitution)
                institude_id = connection.execute(getInstituteByCode).fetchone()[0]
                getRoleByCode = db.select({db_roles.columns.role_id}).filter_by(role_code = code_role)
                id_role = connection.execute(getRoleByCode).fetchone()[0]
                connection.execute(
                    db_users.update()
                    .where(db_users.columns.ut_email == data["E-mail"])
                    .values(ut_nom=data["Nom"],
                            ut_prenom=data["Prénom"],
                            ut_institution=institude_id,
                            ut_actif=True,
                            ut_role=id_role,
                            ut_date_modification=datetime.now()))
            else:
                logger.info("Utilisateur en création :" + data["E-mail"])
                code_Insitution = data['Code institution']
                code_role = data['Code Rôle']
                getInstituteByCode = db.select([db_institutions.columns.inst_id, db_institutions.columns.inst_code_geo]).filter_by(inst_code = code_Insitution)
                rst = connection.execute(getInstituteByCode).fetchone()
                getRoleByCode = db.select({db_roles.columns.role_id}).filter_by(role_code = code_role)
                id_role = connection.execute(getRoleByCode).fetchone()[0]
                code_geo = str(rst[1])
                logger.info("Utilisateur en code geo :" + code_geo)
                hashing.update(code_geo.encode('utf-8'))
                hashed_password = hashing.hexdigest()
                logger.info("Utilisateur en hash :" + hashed_password)
                connection.execute(db_users.insert().values(ut_nom=data["Nom"], 
                                                        ut_prenom=data["Prénom"],
                                                        ut_email=data["E-mail"],
                                                        ut_institution=rst[0],
                                                        ut_actif=True,
                                                        ut_role=id_role,
                                                        ut_password=hashed_password,
                                                        ut_date_creation=datetime.now()))
                


if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_données_helios = create_engine(variables_d_environnement["DATABASE_URL"])

    import_des_utilisateurs(base_de_données_helios, logger_helios)
