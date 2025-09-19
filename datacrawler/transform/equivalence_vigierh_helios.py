from enum import Enum

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
        'quarter': 'quarter',
        'profession_code': 'profession_code',
        'effectif': 'effectif',
        'effectif_filiere': 'effectif_filiere',

    }
    REF_PROFESSION_GROUPE = {
        'profession2_code': 'code',
        'profession2': 'label'
    }
    # pyramide des ages
    REF_TRANCHE_AGE = {
        'tranche_code': 'code_tranche_age',
        'tranche_age': 'tranche_age'
    }
    PYRAMIDE_TRANCHE_AGE = {
        'finess_et': 'numero_finess_etablissement_territorial',
        'year': 'annee',
        'effectif': 'effectif',
        'tranche_code': 'tranche_code',
        'effectif_homme': 'effectif_homme',
        'effectif_femme': 'effectif_femme',
        'effectif_homme_ref': 'effectif_homme_ref',
        'effectif_femme_ref': 'effectif_femme_ref'
    }
