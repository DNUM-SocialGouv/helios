from sqlalchemy.engine import create_engine

from datacrawler.dependencies.dépendances import initialise_les_dépendances
from datacrawler.detecte_doublons_comptes import detecte_doublons_comptes

if __name__ == "__main__":
    logger_helios, variables_d_environnement = initialise_les_dépendances()
    base_de_donnees_helios = create_engine(variables_d_environnement["DATABASE_URL"])
    detecte_doublons_comptes(base_de_donnees_helios, logger_helios)
