import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from datacrawler.load.activités_des_établissements_médico_sociaux import \
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX
from datacrawler.transform.diamant.équivalences_diamant_helios import index_des_activités_médico_sociales

base_de_données_test = create_engine("postgresql://helios:h3li0s@localhost:5433/helios")

def sauvegarde_une_entité_juridique_en_base(numéro_finess: str, base_de_données: Engine) -> None:
    base_de_données.execute(
        f"""INSERT INTO EntitéJuridique (
    numérofinessentitéjuridique,
    raisonsociale,
    adresseacheminement,
    adressenumérovoie,
    adressetypevoie,
    adressevoie,
    libelléstatutjuridique,
    téléphone
  )
VALUES (
    '{numéro_finess}',
    'rs',
    '00000 VILLE',
    '12',
    'R',
    'nom de rue',
    'Public',
    '0123456789'
  );
"""
    )


def sauvegarde_un_établissement_en_base(numéro_finess_établissement: str, numéro_finess_entité_juridique: str,
                                        base_de_données: Engine) -> None:
    base_de_données.execute(
        f"""INSERT INTO Établissementterritorialidentité (
    adresseacheminement,
    adressenumérovoie,
    adressetypevoie,
    adressevoie,
    catÉtablissement,
    courriel,
    numérofinessentitéjuridique,
    numérofinessÉtablissementprincipal,
    numérofinessÉtablissementterritorial,
    raisonsociale,
    téléphone,
    typeÉtablissement,
    libellécatégorieÉtablissement,
    domaine
  )
VALUES (
    '00000 VILLE',
    '12',
    'R',
    'nom de rue',
    '100',
    '',
    '{numéro_finess_entité_juridique}',
    '',
    '{numéro_finess_établissement}',
    'rs',
    '',
    'P',
    'catégorie',
    'Médico-social'
  );
"""
    )


def nettoie_la_base_de_données(base_de_données: Engine) -> None:
    base_de_données.execute("DELETE FROM EntitéJuridique;")
    base_de_données.execute("DELETE FROM Établissementterritorialidentité;")
    base_de_données.execute(f"DELETE FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX};")


def sauvegarde_une_activité_en_base(activité: pd.DataFrame, base_de_données: Engine) -> None:
    activité \
        .set_index(index_des_activités_médico_sociales) \
        .to_sql(name='activitémédicosocial', con=base_de_données, index=True, if_exists='append')
