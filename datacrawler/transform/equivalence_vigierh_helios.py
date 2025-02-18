from enum import Enum

SOURCE = 'VigieRh'

class Table(Enum):
    # contrat
    CONTRAT = "vigierh_contrat"
    REF_TYPE_CONTRAT = "vigierh_ref_type_contrat"

    # profession_filiere
    PROFESSION_FILIERE = "vigierh_profession_filiere"
    REF_PROFESSION_FILIERE = "vigierh_ref_profession_filiere"

    # profession_groupe
    PROFESSION_GROUPE = "vigierh_profession_groupe"
    REF_MASQUE = "vigierh_ref_masque"
    REF_PROFESSION_GROUPE = "vigierh_ref_profession_groupe"
    REF_QUALITE = "vigierh_ref_qualite"
    REF_REDRESSEMENT = "vigierh_ref_redressement"

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
        'turnover': 'turnover',
        'entrees_taux':'taux_entrees',
        'sorties_taux':'taux_sorties',
        'entrees_nombre':'nombre_entrees',
        'sorties_nombre':'nombre_sorties',
        'region_turnover':'region_turnover',
        'nation_turnover':'nation_turnover',
        'groupe_turnover':'groupe_turnover',
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
        'ind_qual_effectif_code':'indic_qualite_effectif_code',
        'ind_redr_effectif_code':'indic_redressement_effectif_code',
        'ind_masq_effectif_code':'indic_masque_secret_effectif_code',
    }
    REF_MASQUE = {
        'ind_masque_code': 'code',
        'ind_masque': 'label'
    }
    REF_PROFESSION_GROUPE = {
        'profession2_code': 'code',
        'profession2': 'label'
    }
    REF_QUALITE = {
        'ind_qualite_code': 'code',
        'ind_qualite': 'label'
    }
    REF_REDRESSEMENT = {
        'ind_redressement_code': 'code',
        'ind_redressement': 'label'
    }
    
    # pyramide des ages
    REF_TRANCHE_AGE = {
        'tranche_code': 'code_tranche_age',
        'tranche_age': 'tranche_age'
    }
    
