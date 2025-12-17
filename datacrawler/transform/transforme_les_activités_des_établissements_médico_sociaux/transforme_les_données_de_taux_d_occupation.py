from logging import Logger

import pandas as pd

from datacrawler.transform.équivalences_diamant_helios import (
    extrais_l_equivalence_des_noms_des_colonnes,
    index_des_activités,
    équivalences_diamant_ann_errd_ej_et_bloc_activités_helios,
    equivalences_diamant_ann_ca_ej_et_bloc_activites_helios,
)


def transforme_les_donnees_ann_errd_ej_et(
    donnees_ann_errd_ej_et: pd.DataFrame, numeros_finess_des_etablissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = donnees_ann_errd_ej_et["Finess"].isin(numeros_finess_des_etablissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} activités sont liées à un ET trouvé en base dans le fichier ann_errd_ej_et")

    donnees_transformees = donnees_ann_errd_ej_et[est_dans_finess].rename(
        columns=extrais_l_equivalence_des_noms_des_colonnes(équivalences_diamant_ann_errd_ej_et_bloc_activités_helios)
    )

    # On crée la nouvelle colonne « taux_occupation_global »
    donnees_transformees["taux_occupation_global"] = None

    # Si il y a une valeur « etat_taux_occupation_global_errd » on l’utilise pour créer la colonne « taux_occupation_global »
    if "etat_taux_occupation_global_errd" in donnees_transformees.columns:
        mask = donnees_transformees["etat_taux_occupation_global_errd"].notnull()
        donnees_transformees.loc[mask, "taux_occupation_global"] = donnees_transformees.loc[mask, "etat_taux_occupation_global_errd"]

    # Si il n’y a pas de valeur dans « taux_occupation_global », on utilise celle de « taux_occupation_global_autres_esms » si elle n’est pas KO
    mask_autres = donnees_transformees["etat_taux_occupation_global_autres_esms"] != "KO"
    donnees_transformees.loc[mask_autres & donnees_transformees["taux_occupation_global"].isnull(), "taux_occupation_global"] = donnees_transformees.loc[
        mask_autres & donnees_transformees["taux_occupation_global"].isnull(), "taux_occupation_global_autres_esms"
    ]

    # Les colonnes présentes dans le fichier ne sont plus nécessaires. On ignore les erreurs au cas où elles n’existeraient pas dans le fichier.
    return (
        donnees_transformees.drop(["taux_occupation_global_autres_esms", "etat_taux_occupation_global_autres_esms"], axis=1, errors="ignore")
        .dropna(subset=index_des_activités)
        .drop_duplicates(subset=index_des_activités)
    )


def transforme_les_donnees_ann_ca_ej_et(
    donnees_ann_ca_ej_et: pd.DataFrame, numeros_finess_des_etablissements_connus: pd.DataFrame, logger: Logger
) -> pd.DataFrame:
    est_dans_finess = donnees_ann_ca_ej_et["Finess"].isin(numeros_finess_des_etablissements_connus["numero_finess_etablissement_territorial"])
    logger.info(f"[DIAMANT] {est_dans_finess.sum()} activités sont liées à un ET trouvé en base dans le fichier ann_ca_ej_et")

    donnees_transformees = donnees_ann_ca_ej_et[est_dans_finess].rename(
        columns=extrais_l_equivalence_des_noms_des_colonnes(equivalences_diamant_ann_ca_ej_et_bloc_activites_helios)
    )

    mask_ko = donnees_transformees["etat_taux_occupation_global_ca"] != "KO"
    donnees_transformees.loc[mask_ko, "taux_occupation_global"] = donnees_transformees.loc[mask_ko, "taux_occupation_global_ca"]

    return (
        donnees_transformees.drop(["taux_occupation_global_ca", "etat_taux_occupation_global_ca"], axis=1)
        .dropna(subset=index_des_activités)
        .drop_duplicates(subset=index_des_activités)
    )
