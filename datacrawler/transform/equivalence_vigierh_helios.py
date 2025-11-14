from enum import Enum
from typing import List


SOURCE = 'VigieRh'

class ColumMapping(Enum):
    # contrat
    CONTRAT = {
        'finess_et': 'numero_finess',
        'year': 'annee',
        'month': 'mois',
        'nature_contrat_code': 'type_contrat_code',
        'effectif': 'effectif'
    }
    REF_TYPE_CONTRAT = {
        'nature_contrat_code': 'code',
        'nature_contrat': 'label'
    }

    # profession_filiere
    PROFESSION_FILIERE = {
        'finess_et': 'numero_finess',
        'year': 'annee',
        'month': 'mois',
        'profession1_code': 'profession_code',
        'effectif': 'effectif_filiere',
    }
    REF_PROFESSION_FILIERE = {
        'profession1_code': 'code',
        'profession1': 'label'
    }

    # profession_groupe
    PROFESSION_GROUPE = {
        'finess_et': 'numero_finess',
        'year': 'annee',
        'month': 'mois',
        'profession2_code': 'profession_code',
        'effectif': 'effectif',

    }
    REF_PROFESSION_GROUPE = {
        'profession2_code': 'code',
        'profession2': 'label'
    }
    PASSAGE_GROUPE_FILIERE = {
        'profession1_code': 'code_filiere',
        'profession2_code': 'profession_code'
    }
    # pyramide des ages
    REF_TRANCHE_AGE = {
        'tranche_age_code': 'code_tranche_age',
        'tranche_age': 'tranche_age'
    }
    PYRAMIDE_TRANCHE_AGE = {
        'finess_et': 'numero_finess_etablissement_territorial',
        'year': 'annee',
        'tranche_age_code': 'tranche_code',
        'effectif_homme': 'effectif_homme',
        'effectif_femme': 'effectif_femme',
        'effectif_homme_ref': 'effectif_homme_ref',
        'effectif_femme_ref': 'effectif_femme_ref'
    }
    # mouvements rh
    MOUVEMENTS_RH = {
        'finess_et': 'numero_finess_etablissement_territorial',
        'year': 'annee',
        'nouveaux_contrats': 'nouveaux_contrats',
        'nouveaux_contrats_ref': 'nouveaux_contrats_ref',
        'fins_contrats': 'fins_contrats',
        'fins_contrats_ref': 'fins_contrats_ref',
        'taux_rotation': 'taux_rotation',
        'taux_rotation_ref': 'taux_rotation_ref',
        'departs_prematures_cdi': 'departs_prematures_cdi'
    }
    MOUVEMENTS_RH_TRIMESTRIEL = {
        'finess_et': 'numero_finess_etablissement_territorial',
        'year': 'annee',
        'quarter': 'trimestre',
        'nouveaux_contrats': 'nouveaux_contrats',
        'nouveaux_contrats_ref': 'nouveaux_contrats_ref',
        'fins_contrats': 'fins_contrats',
        'fins_contrats_ref': 'fins_contrats_ref',
        'taux_rotation': 'taux_rotation',
        'taux_rotation_ref': 'taux_rotation_ref'
    }
    REF_MOTIFS_RUPTURES = {
        'motif_code':'code',
        'motif':'motif'
    }
    MOTIFS_RUPTURES = {
        'finess_et':'finess_et',
        'year':'annee',
        'quarter':'trimestre',
        'motif_code':'motif_code',
        'effectif':'effectif',
        'effectif_ref':'effectif_ref'
    }
    DUREE_CDD = {
        'finess_et': 'numero_finess_etablissement_territorial',
        'year': 'annee',
        'quarter': 'trimestre',
        'duree_code': 'duree_code',
        'effectif': 'effectif',
        'effectif_ref': 'effectif_ref'
    }
    REF_DUREE_CDD = {
        'duree_code': 'duree_code',
        'duree': 'duree'
    }
    REF_NATURE_CONTRAT = {
        'nature_contrat_code': 'nature_contrat_code',
        'nature_contrat': 'nature_contrat'
    }
    NATURE_CONTRAT_ANNUEL = {
        'finess_et': 'numero_finess_etablissement_territorial',
        'year': 'annee',
        'nature_contrat_code': 'nature_contrat_code',
        'effectif': 'effectif',
        'effectif_ref': 'effectif_ref'
    }
    NATURE_CONTRAT_TRIMESTRIEL = {
        'finess_et': 'numero_finess_etablissement_territorial',
        'year': 'annee',
        'quarter': 'trimestre',
        'nature_contrat_code': 'nature_contrat_code',
        'effectif': 'effectif',
        'effectif_ref': 'effectif_ref'
    }

index_des_mouvements_rh_annuel: List[str] = ["numero_finess_etablissement_territorial", "annee"]
index_des_mouvements_rh_trimestriel: List[str] = ["numero_finess_etablissement_territorial", "annee", "trimestre"]

index_duree_cdd: List[str] = ["numero_finess_etablissement_territorial", "annee", "trimestre", "duree_code"]
index_ref_duree_cdd: List[str] = ["duree_code"]
index_nature_contrat_trimestriel: List[str] = ["numero_finess_etablissement_territorial", "annee", "trimestre", "nature_contrat_code"]
