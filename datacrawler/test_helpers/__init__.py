from unittest.mock import MagicMock

import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.sql import text

from datacrawler.load.nom_des_tables import (
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
    TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES,
    TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX,
    TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL,
    TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_CPOM,
    TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES,
    TABLES_DES_RESSOURCES_HUMAINES_MÉDICO_SOCIAL,
    TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS,
    FichierSource,
    TABLE_DES_ACTIVITÉS_SANITAIRES_DES_ENTITES_JURIDIQUES,
    TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE,
)
from datacrawler.load.vigie_rh import Table
from datacrawler.transform.équivalences_diamant_helios import (
    index_des_activités,
    index_des_capacités_sanitaires,
    index_des_dates_d_entrée_en_vigueur_des_cpom,
    index_du_bloc_budget_et_finances,
    index_du_bloc_ressources_humaines,
    index_du_bloc_budget_et_finances_entite_juridique,
)
from datacrawler.transform.équivalences_finess_helios import (
    index_des_autorisations_sanitaires,
    index_des_autres_activités_sanitaires,
    index_des_reconnaissances_contractuelles,
    index_des_équipements_matériels_lourds,
)

base_de_données_test = create_engine("postgresql://helios:h3li0s@localhost:5433/helios")
mocked_logger = MagicMock()
NUMÉRO_FINESS_ENTITÉ_JURIDIQUE = "010008407"
NUMÉRO_FINESS_ÉTABLISSEMENT = "010001261"
NUMÉRO_FINESS_ÉTABLISSEMENT_MÉDICO_SOCIAL = "010003598"
NUMÉRO_FINESS_ÉTABLISSEMENT_SANITAIRE = "010005239"


def sauvegarde_une_entité_juridique_en_base(numéro_finess: str, base_de_données: Engine) -> None:
    base_de_données.execute(
        f"""INSERT INTO entite_juridique (
    numero_finess_entite_juridique,
    raison_sociale,
    adresse_acheminement,
    adresse_numero_voie,
    adresse_type_voie,
    adresse_voie,
    libelle_statut_juridique,
    telephone
  ) VALUES (
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


def sauvegarde_un_établissement_en_base(numéro_finess_établissement: str, numéro_finess_entité_juridique: str, base_de_données: Engine) -> None:
    base_de_données.execute(
        f"""INSERT INTO etablissement_territorial (
    adresse_acheminement,
    adresse_numero_voie,
    adresse_type_voie,
    adresse_voie,
    cat_etablissement,
    courriel,
    numero_finess_entite_juridique,
    numero_finess_etablissement_principal,
    numero_finess_etablissement_territorial,
    raison_sociale,
    telephone,
    type_etablissement,
    libelle_categorie_etablissement,
    domaine
  ) VALUES (
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


def supprime_les_données_des_tables(base_de_données: Engine) -> None:
    base_de_données.execute("DELETE FROM entite_juridique;")
    base_de_données.execute("DELETE FROM etablissement_territorial;")
    base_de_données.execute(f"DELETE FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX};")
    base_de_données.execute(f"DELETE FROM {TABLE_DES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES};")
    base_de_données.execute(f"DELETE FROM {TABLE_DES_ACTIVITÉS_SANITAIRES_DES_ENTITES_JURIDIQUES};")
    base_de_données.execute(f"DELETE FROM {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_MÉDICO_SOCIAUX};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_CPOM};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE};")
    base_de_données.execute(f"DELETE FROM {TABLES_DES_RESSOURCES_HUMAINES_MÉDICO_SOCIAL};")

def sauvegarde_une_activité_en_base(activité: pd.DataFrame, base_de_données: Engine, table: str) -> None:
    activité.set_index(index_des_activités).to_sql(name=table, con=base_de_données, index=True, if_exists="append")


def sauvegarde_une_autorisation_sanitaire_en_base(autorisation: pd.DataFrame, base_de_données: Engine) -> None:
    autorisation.set_index(index_des_autorisations_sanitaires).to_sql(
        name=TABLES_DES_AUTORISATIONS_DES_ÉTABLISSEMENTS_SANITAIRES, con=base_de_données, index=True, if_exists="append"
    )


def sauvegarde_une_autre_activité_sanitaire_en_base(autorisation: pd.DataFrame, base_de_données: Engine) -> None:
    autorisation.set_index(index_des_autres_activités_sanitaires).to_sql(
        name=TABLES_DES_AUTRES_ACTIVITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, con=base_de_données, index=True, if_exists="append"
    )


def sauvegarde_un_équipement_matériel_lourd_en_base(autorisation: pd.DataFrame, base_de_données: Engine) -> None:
    autorisation.set_index(index_des_équipements_matériels_lourds).to_sql(
        name=TABLES_DES_ÉQUIPEMENTS_MATÉRIELS_LOURDS_DES_ÉTABLISSEMENTS, con=base_de_données, index=True, if_exists="append"
    )


def sauvegarde_une_reconnaissance_contractuelle_en_base(autorisation: pd.DataFrame, base_de_données: Engine) -> None:
    autorisation.set_index(index_des_reconnaissances_contractuelles).to_sql(
        name=TABLES_DES_RECONNAISSANCES_CONTRACTUELLES_DES_ÉTABLISSEMENTS_SANITAIRES, con=base_de_données, index=True, if_exists="append"
    )


def sauvegarde_une_date_de_mise_à_jour_de_fichier_source(date_de_mise_à_jour: str, fichier_source: FichierSource, base_de_données: Engine) -> None:
    base_de_données.execute(
        f"""INSERT INTO {TABLE_DES_MISES_À_JOUR_DES_FICHIERS_SOURCES} (derniere_mise_a_jour, fichier)
            VALUES ('{date_de_mise_à_jour}', '{fichier_source.value}');"""
    )


def sauvegarde_les_capacités_sanitaires_en_base(capacités_sanitaire: pd.DataFrame, base_de_données: Engine) -> None:
    capacités_sanitaire.set_index(index_des_capacités_sanitaires).to_sql(
        name=TABLES_DES_CAPACITÉS_DES_ÉTABLISSEMENTS_SANITAIRES, con=base_de_données, index=True, if_exists="append"
    )


def sauvegarde_une_date_d_entrée_de_cpom_en_base(date_d_entree_en_vigueur_du_cpom: pd.DataFrame, base_de_données: Engine) -> None:
    date_d_entree_en_vigueur_du_cpom.set_index(index_des_dates_d_entrée_en_vigueur_des_cpom).to_sql(
        name=TABLES_DES_CPOM, con=base_de_données, index=True, if_exists="append"
    )


def sauvegarde_les_indicateurs_budget_et_finances_en_base(indicateurs_budget_et_finances: pd.DataFrame, base_de_données: Engine) -> None:
    indicateurs_budget_et_finances.set_index(index_du_bloc_budget_et_finances).to_sql(
        name=TABLES_DES_BUDGETS_ET_FINANCES_MÉDICO_SOCIAL, con=base_de_données, index=True, if_exists="append"
    )


def sauvegarde_les_indicateurs_budget_et_finances_entite_juridique_en_base(indicateurs_budget_finances_ej: pd.DataFrame, base_de_données: Engine) -> None:
    indicateurs_budget_finances_ej.set_index(index_du_bloc_budget_et_finances_entite_juridique).to_sql(
        name=TABLES_DES_BUDGETS_ET_FINANCES_ENTITE_JURIDIQUE, con=base_de_données, index=True, if_exists="append"
    )


def sauvegarde_les_indicateurs_ressources_humaines_en_base(indicateurs_ressources_humaines: pd.DataFrame, base_de_données: Engine) -> None:
    indicateurs_ressources_humaines.set_index(index_du_bloc_ressources_humaines).to_sql(
        name=TABLES_DES_RESSOURCES_HUMAINES_MÉDICO_SOCIAL, con=base_de_données, index=True, if_exists="append"
    )


def crée_le_fichier_xml(chemin_du_fichier: str, contenu: str) -> None:
    with open(chemin_du_fichier, "w+", encoding="utf-8") as fichier:
        fichier.write(
            f"""<?xml version="1.0" encoding="UTF-8"?>
<fluxfiness xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  {contenu}
</fluxfiness>"""
        )


def compte_nombre_de_lignes(table_name: str , base_de_données: Engine) -> int:
    with base_de_données.connect() as connexion:
        result = connexion.execute(text(f"SELECT COUNT(*) FROM {table_name};"))
        return result.scalar()
