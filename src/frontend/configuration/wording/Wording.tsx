import { ReactElement } from "react";

export interface Wording {
  // Abréviations
  readonly CPOM_TITLE: string;
  readonly CPOM: ReactElement;
  readonly ASR_TITLE: string;
  readonly ASR: ReactElement;

  // Commun
  readonly CANCEL: string;
  readonly SEND_EMAIL: string;
  readonly RESEND_EMAIL: string;
  readonly BACK_TO_CONNEXION: string;
  readonly APPLY: string;

  // Messages d'erreur
  readonly MISSING_EMAIL: string;
  readonly EMAIL_NOT_VALID: string;
  readonly SOMETHING_WENT_WRONG: string;
  readonly INVALID_REQUEST: string;
  readonly INVALID_USER: string;

  // Header
  readonly INTITULÉ_RÉPUBLIQUE_FRANÇAISE: ReactElement;
  readonly ACCUEIL: string;
  readonly MENU: string;
  readonly DÉCONNEXION: string;
  readonly FERMER: string;
  readonly TITRE_DU_SITE: string;

  // Titre des pages
  readonly TITRE_PAGE_ACCUEIL: string;
  readonly TITRE_PAGE_CONNEXION: string;
  readonly TITRE_PAGE_ACCESSIBILITÉ: string;
  readonly TITRE_PAGE_MENTIONS_LÉGALES: string;
  readonly TITRE_PAGE_DONNÉES_PERSONNELLES: string;
  readonly TITRE_PAGE_INACCESSIBLE: string;
  readonly TITRE_PAGE_ECO_CONCEPTION: string;
  readonly TITRE_PAGE_GESTION_COOKIES: string;

  // Breadcrumb
  readonly VOUS_ÊTES_ICI: string;
  readonly VOIR_LE_FIL_D_ARIANE: string;
  readonly ENTITÉ_JURIDIQUE: string;
  readonly régionBreadcrumb: (placeholder: string) => string;

  // Home
  readonly TITRE_LISTE_DES_ENTITÉS_JURIDIQUES: string;
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_TERRITORIAUX: string;
  readonly ENTITÉS_JURIDIQUES: string;
  readonly ÉTABLISSEMENT_TERRITORIAUX: string;
  readonly SITE_EN_CONSTRUCTION: string;

  // Inscription
  readonly REGISTRATION_PAGE_TITLE: string;
  readonly SEND: string;
  readonly REGISTRARTION_SUCCESS_MESSAGE: string;
  readonly EMAIL_ALREADY_USED: string;
  readonly NOT_AUTORIZED_EMAIL: string;

  // Connexion
  readonly CONNEXION_LIBELLE: string;
  readonly CONNEXION_IDENTIFIANT: string;
  readonly CONNEXION_MOT_DE_PASSE: string;
  readonly CONNEXION_MOT_DE_PASSE_OUBLIE: string;
  readonly FORGET_PASSEWORD: string;
  readonly FORGET_PASSEWORD_MESSAGE: string;

  // Recherche
  readonly RECHERCHE_DESCRIPTION: ReactElement;
  readonly RECHERCHE_PLACEHOLDER: string;
  readonly RECHERCHE_LABEL: string;
  readonly RÉSULTAT_DE_RECHERCHE: string;
  readonly rechercheNombreRésultats: (nombre: number, terme: string) => string;
  readonly RECHERCHE_EN_ATTENTE: string;
  readonly aucunRésultat: (terme: string) => string;
  readonly ERREUR_TECHNIQUE: string;
  readonly VOIR_PLUS_RÉSULTATS: string;
  readonly RECHERCHE_TITRE: string;
  readonly BACK_TO_SEARCH: string;

  // Recherche avancée
  readonly RECHERCHE_AVANCEE_LABEL: string;
  readonly ZONE_GEOGRAPHIQUE: string;
  readonly STRUCTURE: string;
  readonly CATEGORIES_FINESS: string;
  readonly CATEGORIES_FINESS_TITLE: string;
  readonly CAPACITE: string;
  readonly ACTIVITE_SAN: string;
  readonly RECHERCHE_AVANCEE_TEXT: string;
  readonly RESULTAT_RECHERCHE_AVANCEE_TEXT: string;
  readonly AUCUN_RESULTAT_RECHERCHE_AVANCEE_TEXT: string;
  readonly TOUT_EFFACER: string;
  // Cartographie
  readonly CARTOGRAPHIE: string;
  readonly OFFRE_SANTÉ_PAR_REGION: string;
  readonly CARTOGRAPHIE_DESCRIPTION: string;

  readonly COOKIES_ATLASSANTÉ: string;

  // Région
  readonly régionAtlasSanté: (placeholder: string) => string;

  // Fiches
  readonly miseÀJour: (date: string) => string;
  readonly miseÀJourEtSource: (date: string, source: ReactElement) => ReactElement;
  readonly NON_RENSEIGNÉ: string;
  readonly OUI: string;
  readonly NON: string;
  readonly DÉTAILS: string;
  readonly TÉLÉCHARGER_EN_PDF: string;
  readonly EXPORT_ET_RATTACHES: string;

  // Info bulle
  readonly ÉLÉMENTS_DE_COMPRÉHENSION: string;
  readonly FRÉQUENCE: string;
  readonly MODE_DE_CALCUL: string;
  readonly SOURCES: string;
  readonly INFOS_COMPLÉMENTAIRES: string;

  // Indicateurs
  readonly AFFICHER_LA_TRANSCRIPTION: string;
  readonly TITRE_TRANSCRIPTION: string;
  readonly ANNÉE: string;
  readonly MOIS: string;
  readonly INDICATEURS_VIDES: string;
  readonly AUCUNE_DONNÉE_RENSEIGNÉE: string;
  readonly AUCUNE_DONNEE_RENSEIGNEE_GENERIQUE: string;
  readonly AUCUNE_DONNEE_REF_RENSEIGNEE_GENERIQUE: string;
  readonly AUCUNE_DONNÉE_RENSEIGNÉE_MENSUEL: string;
  readonly AUCUNE_DONNÉE_RENSEIGNÉE_INDICATEURS: string;
  readonly VALEURS_INFERIEUR_A_5_CACHÉS: string;
  readonly PLACEHOLDER_VALEUR_INFERIEUR_A_5: string;
  readonly DOWNLOAD_EXCEL: string;
  readonly DONNEES_ARRETEES: string;


  // Catégorisation
  readonly PRIVÉ_LUCRATIF: string;
  readonly PRIVÉ_NON_LUCRATIF: string;
  readonly PUBLIC: string;
  readonly PERSONNE_MORALE_DROIT_ÉTRANGER: string;

  // Bloc Identité
  readonly TITRE_BLOC_IDENTITÉ: string;
  readonly NOM_DE_L_ÉTABLISSEMENT: string;
  readonly DATE_D_OUVERTURE: string;
  readonly NUMÉRO_FINESS: string;
  readonly SIREN: string;
  readonly SIRET: string;
  readonly ADRESSE: string;
  readonly TÉLÉPHONE: string;
  readonly TÉLÉPHONE_ET_EMAIL: string;
  readonly STATUT_JURIDIQUE: string;
  readonly STATUT_JURIDIQUE_EJ: string;
  readonly DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM: ReactElement;
  readonly ENTITÉ_JURIDIQUE_DE_RATTACHEMENT: string;
  readonly CATÉGORIE_DE_L_ÉTABLISSEMENT: string;
  readonly MODE_DE_TARIFICATION: string;
  readonly MONO_ÉTABLISSEMENT: string;
  readonly ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE: string;
  readonly PRINCIPAL: string;
  readonly SECONDAIRE: string;
  readonly SITE_INTERNET: string;

  // Bloc Activité Médico-social
  readonly TITRE_BLOC_ACTIVITÉ: string;
  readonly TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT: string;
  readonly TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE: string;
  readonly TAUX_OCCUPATION_ACCUEIL_DE_JOUR: string;
  readonly TAUX_RÉALISATION_ACTIVITÉ: string;
  readonly FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES: string;
  readonly NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES: string;
  readonly DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES: string;
  readonly NOMBRE_DE_PASSAGES_AUX_URGENCES: string;
  readonly TAUX_OCCUPATION_EXTERNAT: string;
  readonly TAUX_OCCUPATION_SEMI_INTERNAT: string;
  readonly TAUX_OCCUPATION_INTERNAT: string;
  readonly TAUX_OCCUPATION_AUTRE: string;
  readonly TAUX_OCCUPATION_SEANCES: string;

  // Bloc Activité Sanitaire
  readonly NOMBRE_DE_SÉJOUR_MCO: string;
  readonly MOYENNE_DE_SEJOUR_MCO: string;
  readonly TOTAL_HOSPITALISATION_MÉDECINE: string;
  readonly TOTAL_HOSPITALISATION_CHIRURGIE: string;
  readonly TOTAL_HOSPITALISATION_OBSTÉTRIQUE: string;
  readonly HOSPITALISATION_PARTIELLE_MÉDECINE: string;
  readonly HOSPITALISATION_COMPLÈTE_MÉDECINE: string;
  readonly HOSPITALISATION_PARTIELLE_CHIRURGIE: string;
  readonly HOSPITALISATION_COMPLÈTE_CHIRURGIE: string;
  readonly HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE: string;
  readonly HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE: string;
  readonly DUREE_MOYENNE_SEJOUR_MEDECINE: string;
  readonly DUREE_MOYENNE_SEJOUR_CHIRURGIE: string;
  readonly DUREE_MOYENNE_SEJOUR_OBSTETRIQUE: string;
  readonly TOTAL_HOSPITALISATION_SSR: string;
  readonly TOTAL_HOSPITALISATION_PSY: string;
  readonly NOMBRE_DE_JOURNÉES_PSY_ET_SSR: string;
  readonly HOSPITALISATION_PARTIELLE_SSR: string;
  readonly HOSPITALISATION_COMPLÈTE_SSR: string;
  readonly HOSPITALISATION_PARTIELLE_PSY: string;
  readonly HOSPITALISATION_COMPLÈTE_PSY: string;
  readonly NOMBRE_DE_HAD: string;
  readonly NOMBRE_DE_JOURNEES_USLD: string;
  readonly ANNUEL: string;
  readonly MENSUEL: string;
  readonly TRIMESTRIEL: string;

  // Bloc Autorisation
  readonly TITRE_BLOC_AUTORISATION_ET_CAPACITÉ: string;
  readonly CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS_SANITAIRE: string;
  readonly AUTORISATIONS_SANITAIRE: string;
  readonly AUTORISATIONS_MS: string;
  readonly AUTORISATIONS_ACTIVITES: string;
  readonly DATE_D_AUTORISATION: string;
  readonly DATE_D_AUTORISATION_KEY: string;
  readonly DATE_DE_FIN: string;
  readonly DATE_DE_MISE_EN_OEUVRE: string;
  readonly MISE_À_JOUR_AUTORISATION: string;
  readonly DERNIÈRE_INSTALLATION: string;
  readonly CAPACITÉ_AUTORISÉE: string;
  readonly CAPACITÉ_INSTALLÉE: string;
  readonly CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS: string;
  readonly NOMBRE_TOTAL_DE_PLACE: string;
  readonly ACTIVITÉ: string;

  // Bloc Qualité
  readonly TITRE_BLOC_QUALITE: string;
  readonly RECLAMATIONS: string;

  readonly MOTIF_DES_RECLAMATIONS: string;
  readonly NOMBRE_TOTAL_RECLAMATIONS: string;
  readonly NOMBRE_RECLAMATIONS_EN_ENCOURS: string;
  readonly NOMBRE_RECLAMATIONS_CLOTUREES: string;

  readonly MOTIF_10: string;
  readonly MOTIF_11: string;
  readonly MOTIF_12: string;
  readonly MOTIF_13: string;
  readonly MOTIF_14: string;
  readonly MOTIF_15: string;
  readonly MOTIF_16: string;
  readonly MOTIF_17: string;
  readonly MOTIF_18: string;
  readonly MOTIF_19: string;
  readonly MOTIF_155: string;
  readonly MOTIF_156: string;

  readonly EVENEMENTS_INDESIRABLES: string;
  readonly EVENEMENTS_INDESIRABLES_NON_RENSEIGNES: string;
  readonly EVENTS_TOTAL_NUMBER: string;
  readonly EVENEMENTS_ASSOCIE_AUX_SOINS: string;
  readonly EVENEMENTS_DANS_ET: string;

  readonly INSPECTIONS_CONTROLES: string;

  readonly DATE_REELLE_DE_VISITE: string;
  readonly DATE_REELLE_DE_RAPPORT: string;
  readonly TYPE_DE_PLANIFICATION: string;
  readonly MODALITE_DE_LA_MISSION: string;
  readonly TYPE_DE_MISSION: string;
  readonly AFFICHER_PLUS: string;
  readonly AFFICHER_MOINS: string;

  // Bloc Autorisation Sanitaire
  readonly AUTRES_ACTIVITÉS: string;
  readonly AUTRES_ACTIVITÉS_SAN: string;
  readonly RECONNAISSANCES_CONTRACTUELLES: string;
  readonly ÉQUIPEMENTS_MATÉRIELS_LOURDS: string;
  readonly DATE_D_EFFET_ASR: ReactElement;
  readonly DATE_D_EFFET_CPOM: ReactElement;
  readonly DATE_DE_FIN_CPOM: ReactElement;
  readonly NUMÉRO_CPOM: ReactElement;
  readonly NUMÉRO_AUTORISATION: string;
  readonly ACTIVITÉS: string;
  readonly CHIRURGIE: string;
  readonly MÉDECINE: string;
  readonly OBSTÉTRIQUE: string;
  readonly SSR: string;
  readonly USLD: string;
  readonly PSYCHIATRIE: string;
  readonly LITS: string;
  readonly PLACES: string;
  readonly BOUTON_TELECHARGER_AUTORISATIONS_ET_CAPACITES: string;

  // Bloc budget et finances
  readonly TITRE_BLOC_BUDGET_ET_FINANCES: string;
  readonly MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE: string;
  readonly MONTANT: string;
  readonly TAUX_DE_VÉTUSTÉ_CONSTRUCTION: string;
  readonly RÉSULTAT_NET_COMPTABLE: string;

  readonly RATIO_DEPENDANCE_FINANCIERE: string;
  readonly COMPTE_DE_RÉSULTAT: string;
  readonly COMPTE_DE_RÉSULTAT_ERRD: string;
  readonly COMPTE_DE_RÉSULTAT_CA: string;
  readonly TITRE_BUDGÉTAIRE: string;
  readonly RECETTES: string;
  readonly DÉPENSES: string;
  readonly CHARGES: string;
  readonly PRODUITS: string;
  readonly TOTAL: string;
  readonly GROUPE_I: string;
  readonly GROUPE_II: string;
  readonly GROUPE_III: string;
  readonly TAUX_DE_CAF: string;
  readonly FONDS_DE_ROULEMENT_NET_GLOBAL: string;

  // Bloc budget et finance entité juridique
  readonly TITRE_I: string;
  readonly TITRE_II: string;
  readonly TITRE_III: string;
  readonly TITRE_IV: string;
  readonly COMPTE_DE_RÉSULTAT_CF: string;
  readonly ALLOCATION_DE_RESSOURCES: string;
  readonly POURCENTAGE: string;
  readonly REPARTITION_DES_ENVELOPPES: string;
  readonly REPARTITION_DES_SOUS_ENVELOPPES: string;
  readonly REPARTITION_DES_MODES_DELEGATION: string;

  readonly PRODUITS_PRINCIPAUX: string;
  readonly PRODUITS_ANNEXES: string;
  readonly CHARGES_ANNEXES: string;
  readonly CHARGES_PRINCIPALES: string;
  readonly BUDGET_PRINCIPAL: string;
  readonly BUDGET_ANNEXE: string;

  readonly DAF: string;
  readonly DOTATIONS_ACTIVITÉ: string;
  readonly DOTATIONS_DE_SOINS_USLD: string;
  readonly DOTATIONS_URGENCES: string;
  readonly FIR: string;
  readonly FORFAITS: string;
  readonly MIGAC: string;
  readonly ODMCO: string;
  readonly ODSV: string;
  readonly OGD_PA: string;
  readonly OGD_PH: string;
  readonly OBJECTIF_QUANTIFIÉ_NATIONAL: string;

  // Bloc ressources humaines
  readonly TITRE_BLOC_RESSOURCES_HUMAINES: string;
  readonly NOMBRE_D_ETP_TOTAL_RÉALISÉ: ReactElement;
  readonly NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION: string;
  readonly NOMBRE_D_ETP_PM: string
  readonly NOMBRE_D_ETP_PNM: string
  readonly TAUX_DE_ROTATION_DU_PERSONNEL: string;
  readonly TAUX_D_ABSENTÉISME: string;
  readonly TAUX_D_ABSENTÉISME_HORS_FORMATION: (taux: string, enErreur: boolean, tauxNul: boolean) => ReactElement;
  readonly TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_COURTE_DURÉE: string;
  readonly TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_MOYENNE_DURÉE: string;
  readonly TAUX_D_ABSENTÉISME_POUR_MALADIE_DE_LONGUE_DURÉE: string;
  readonly TAUX_D_ABSENTÉISME_POUR_MATERNITÉ_PATERNITÉ: string;
  readonly TAUX_D_ABSENTÉISME_POUR_CONGÉS_SPÉCIAUX: string;
  readonly TAUX_D_ABSENTÉISME_POUR_MALADIE_PROFESSIONNELLE: string;
  readonly MOTIF_DU_TAUX_D_ABSENTÉISME: string;
  readonly JOURS_ABSENTEISME_PM: string
  readonly JOURS_ABSENTEISME_PNM: string
  readonly TAUX: string;
  readonly NOMBRE_DE_CDD_DE_REMPLACEMENT: ReactElement;
  readonly NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION: string;
  readonly TAUX_D_ETP_VACANTS_AU_31_12: string;
  readonly TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES: string;
  readonly DEPENSES_INTERIM_PM: string

  // Liste des établissements rattachés
  readonly ÉTABLISSEMENT_TERRITORIAL: string;
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS: string;
  readonly DOMAINE_MEDICAUX_SOCIAL: string;
  readonly DOMAINE_SANITAIRE: string;
  readonly ÉTABLISSEMENTS_RATTACHÉS: string;
  readonly AUCUN_ÉTABLISSEMENTS_RATTACHÉS: string;
  readonly VOIR_TOUS_LES_ET: string;
  readonly VOIR_MOINS_ET: string;

  // Sources longues
  readonly FINESS_TITLE: string;
  readonly DIAMANT_TITLE: string;
  readonly CNSA_TITLE: string;
  readonly TDB_PERF_TITLE: string;
  readonly PMSI_TITLE: string;
  readonly ARHGOS_TITLE: string;
  readonly SAE_TITLE: string;
  readonly RPU_TITLE: string;
  readonly ANCRE_TITLE: string;
  readonly HAPI_TITLE: string;
  readonly SIREC_TITLE: string;
  readonly SIVSS_TITLE: string;
  readonly SIICEA_TITLE: string;
  readonly SI_AUTORISATIONS_TITLE: string;

  // Sources courtes
  readonly FINESS: ReactElement;
  readonly DIAMANT: ReactElement;
  readonly CNSA: ReactElement;
  readonly ANCRE: ReactElement;
  readonly HAPI: ReactElement;
  readonly TDB_PERF: ReactElement;
  readonly PMSI: ReactElement;
  readonly ARHGOS: ReactElement;
  readonly SAE: ReactElement;
  readonly RPU: ReactElement;
  readonly SIREC: ReactElement;
  readonly SIVSS: ReactElement;
  readonly SIICEA: ReactElement;
  readonly VIGIE_RH: ReactElement;
  readonly SI_AUTORISATIONS: ReactElement;


  // Inaccessible
  readonly ACCÈS_REFUSÉ: string;

  // Erreurs
  readonly PAGE_NON_TROUVÉE_404: string;
  readonly CODE_ERREUR_404: string;
  readonly SOUS_TITRE_ERREUR_404: string;
  readonly DESCRIPTION_ERREUR_404: ReactElement;
  readonly ERREUR_INATTENDUE_500: string;
  readonly CODE_ERREUR_500: string;
  readonly SOUS_TITRE_ERREUR_500: string;
  readonly DESCRIPTION_ERREUR_500: ReactElement;

  // Footer
  readonly LEGIFRANCE: string;
  readonly GOUVERNEMENT: string;
  readonly SERVICE_PUBLIC: string;
  readonly DATA_GOUV: string;
  readonly ACCESSIBILITÉ: string;
  readonly NON_CONFORME: string;
  readonly MENTIONS_LÉGALES: string;
  readonly DONNÉES_PERSONNELLES: string;
  readonly NOUS_CONTACTER: string;
  readonly MENTION_LICENCE: string;
  readonly LICENCE_ETALAB: string;
  readonly NOUVELLE_FENÊTRE: string;
  readonly ECO_CONCEPTION: string;
  readonly COOKIES: string;

  // Accessibilité
  readonly AUDIT_EN_COURS: string;

  // Données personnelles
  readonly FINALITÉ_ET_FONDEMENT_DU_TRAITEMENT: string;
  readonly PROTECTION_DES_DONNÉES_PERSONNELLES: string;

  // Mentions légales
  readonly ÉDITEUR_DU_SITE: string;
  readonly PROPRIÉTÉ_INTELLECTUELLE: string;
  readonly LIMITES_DE_RESPONSABILITÉ: string;

  readonly EN_CONSTRUCTION: string;

  // Comparaison
  readonly COMPARAISON: string;
  readonly AJOUTER_DES_ETABLISSEMENTS: string;
  readonly COMPARAISON_AUCUN_FINESS: string;
  readonly TITRE_AJOUTER_DES_ETABLISSEMENTS: string;
  readonly LIBELLE_AJOUTER_DES_ETABLISSEMENTS_LISTE: string;
  readonly LIBELLE_AJOUTER_DES_ETABLISSEMENTS: string;
  //--Alert-comparaison
  readonly ALERTE_TYPE_DIFFERENT_TITRE: string;
  readonly ALERTE_TYPE_DIFFERENT_CORPS: string;

  // Favoris
  readonly FAVORIS_LIST: string;
  readonly FAVORIS_LIST_TITLE: string;
  readonly ACTIONS: string;
  readonly COMPARER: string;
  readonly SUPPRIMER_DE_LA_LISTE: string;
  readonly EXPORTER: string;
  readonly DANS_FAVORIS: string;
  readonly NON_FAVORIS: string;
  readonly IMPORTER_UNE_LISTE: string;
  readonly IMPORTER_DES_ETABLISSEMENTS: string;

  // Etoile des Favoris
  readonly ETOILE_ETAB_DANS_LISTE: string;
  readonly ETOILE_ETAB_PAS_DANS_LISTE: string;
  readonly ETOILE_MES_LISTES: string;
  readonly ETOILE_NOUVELLE_LISTE_LABEL: string;
  readonly ETOILE_NOUVELLE_LISTE_BOUTON: string;
  readonly ETOILE_MAX_LISTE_ATTEINT: string;
  readonly ETOILE_ERREUR_MODIF_ETAB: string;

  // Nouveau Favoris
  readonly LIST_ACTION_FAVORIS_SUCCESS_MESSAGE: (list: string) => string;

  // Import d'une liste de finess dans une liste de Favoris
  readonly IMPORT_LIST_FINESS_ERROR_MESSAGE: (nbError: number) => string;
  readonly IMPORT_LIST_SELECTOR: string;
  readonly IMPORT_MAX_LISTE_ATTEINT: string;
  readonly IMPORT_NOUVELLE_LISTE_BOUTON: string;
  readonly IMPORT_SUCCESS_TITLE: string;
  readonly IMPORT_SUCESS_MESSAGE: string;
  readonly IMPORT_LIST_ERREUR_IMPORT: string;
  readonly IMPORT_LIST_FINESS_HEADER: string;
  readonly IMPORT_LIST_RS_HEADER: string;
  readonly IMPORT_LIST_TEXT_PLACEHOLDER: string;
  readonly IMPORT_LIST_TITLE: string;
  readonly IMPORT_LIST_CANCEL_LABEL: string;
  readonly IMPORT_LIST_OK_VALIDATE_LABEL: string;
  readonly IMPORT_LIST_OK_VERIFY_LABEL: string;
  readonly IMPORT_LIST_OK_IMPORT_LABEL: string;


  // Mot de passe oublié
  readonly MOT_PASSE_OUBLIE_TITRE: string;
  readonly MOT_PASSE_OUBLIE_LABEL: string;
  readonly MOT_PASSE_OUBLIE_SUCCESS_MESSAGE: string;

  // Changement de mot de passe
  readonly CHANGEMENT_MOT_PASSE_TITRE: string;
  readonly CHANGEMENT_MOT_PASSE_DESCRIPTION: string;
  readonly OLD_MOT_DE_PASSE_REINITIALISATION: string;
  readonly OLD_MOT_DE_PASSE: string;
  readonly MOT_DE_PASSE: string;
  readonly CONFIRMER_MOT_DE_PASSE: string;
  readonly CONFIRM_CHANGE_PASSWORD: string;
  readonly CONFIRM_CREATE_PASSWORD: string;
  readonly INVALID_PASSWORD_MESSAGE: string;

  // Historique de recherche
  readonly HISTORIQUE_DE_RECHERECHE_TITRE: string;
  readonly ETABLISSEMENT_CONSULTE: string;
  readonly DATE: string;
  readonly CONFIRM_UPDATE_PASSWORD: string;
  readonly REINITIALISATION_MOT_PASSE_TITRE: string;
  readonly CREATION_MOT_PASSE_TITRE: string;
  readonly REINITIALISATION_MOT_PASSE_DESCRIPTION: string;
  readonly DIFFERENT_MOT_PASSE: string;
  readonly WRONG_OLD_MOT_DE_PASSE: string;

  // Parametrage
  readonly PARAMETRAGE_TITRE: string;
  readonly PARAMETRAGE_AUTORISATIONS_TITRE: string;
  readonly PARAMETRAGE_AIDE_TITRE: string;
  readonly PARAMETRAGE_EJ_TAB: string;
  readonly PARAMETRAGE_ET_MS_TAB: string;
  readonly PARAMETRAGE_ET_SAN_TAB: string;
  readonly PARAMETRAGE_INSTITUTION: string;
  readonly PARAMETRAGE_AUTRE_REGION: string;
  readonly CREATED_BY: string;
  readonly CREATION_DATE: string;
  readonly PROFILE_CODE: string;
  readonly PARAMETRAGE_NEW_PROFILE: string;
  readonly PROFILE_TITLE: string;
  readonly VOUS_NAVEZ_AUCUN_PROFIL: string;
  readonly PROJECT_TEAM: string;

  //  Profile page
  readonly USER_PROFILE: string;
  readonly MON_COMPTE: string;
  readonly FIRSTNAME: string;
  readonly LASTNAME: string;
  readonly EMAIL: string;
  readonly ORGANIZATION: string;
  readonly ROLE: string;
  readonly SUPER_ADMIN: string;
  readonly ADMIN_REGIONAL: string;
  readonly ADMINISTRATION_CENTRALE: string;
  readonly USER: string;
  readonly PROFILE: string;

  // Utilisateur page
  readonly STATUS: string;
  readonly MODIFICATION_DATE: string;
  readonly PAGE_UTILISATEUR_TITRE: string;
  readonly AUCUN_ELEMENT_TROUVE: string;
  readonly ROLE_: string;
  readonly INSTITUTION: string;
  readonly PAGE_EDIT_UTILISATEUR_TITRE: string;

  //Blocs
  readonly TOUT_REPLIER: string;
  readonly TOUT_DEPLIER: string;

  //Filtre recherche avancée
  //--Filtre Structure
  readonly ENTITES_JURIDIQUES: string;
  readonly ETABLISSEMENTS_SANITAIRES: string;
  readonly ETABLISSEMENTS_SOCIAUX_MEDICO_SOCIAUX: string;
  readonly STATUT_JURIDIQUE_PUBLIC: string;
  readonly STATUT_JURIDIQUE_PRIVE_LUCRATIF: string;
  readonly STATUT_JURIDIQUE_PRIVE_NON_LUCRATIF: string;
  //--Filtre capacité
  readonly CAPACITE_INITIALE: string;
  readonly ETABLISSEMENT_PUBLIC_HANDICAP: string;
  readonly ETABLISSEMENT_PERSONNE_AGEES: string;
  readonly CAPACITE_INSTALLEE_EN_PLACE: string;
  readonly TITRE_CAPACITE_PERSONNES_SITUATION_HANDICAP: string;
  readonly TITRE_CAPACITE_PERSONNES_AGEES: string;
  // Bouton de selection de tous les rechercheNombreRésultats
  readonly TOUT_SELECTIONNER: string;
  readonly TOUT_DESELECTIONNER: string;
  // Filtre Activité SAN
  readonly FA_MCO: string;
  readonly FA_PSY: string;
  readonly FA_SSR: string;
  readonly FA_USLD: string;

  //Page d’une liste d’etablissements
  readonly LISTE_DE_FAVORIS: string;
  readonly LISTE_NON_TROUVÉE: string;
  //Callout page d'acceuil
  readonly NOUVEAU: string;
  readonly NOUVELLES_FONCTIONNALITÉS_TEXT: string;
  readonly NOUVELLES_FONCTIONNALITÉS_LIEN: string;
  readonly NOUVELLES_FONCTIONNALITÉS_DATE_FIN: string;

  //Vigie RH
  readonly INDICATEURS_HELIOS_BLOC_TITLE: string;
  readonly INDICATEURS_VIGIERH_BLOC_TITLE: string;
  readonly PYRAMIDE_DES_AGES: string;
  readonly TRANCHE_AGE: string;
  readonly EFFECTIF_FEMMES: string;
  readonly EFFECTIF_FEMMES_REF: string;
  readonly EFFECTIF_HOMMES: string;
  readonly EFFECTIF_HOMMES_REF: string;
  readonly EFFECTIFS: string;
  readonly EFFECTIFS_PAR_CATEGORIE_PROFESSIONNELLE: string;
  readonly EFFECTIFS_TOTAUX: string;
  readonly VIGIE_RH_CATEGORIE: string;
  readonly MOIS_ANNEES: string;
  readonly DEPARTS_EMBAUCHES: string;
  readonly DEPARTS: string;
  readonly EMBAUCHES: string;
  readonly DEPARTS_REF: string;
  readonly EMBAUCHES_REF: string;
  readonly MOYENNE_REF: string;
  readonly TAUX_ROTATION: string;
  readonly REPARTITION_EFFECTIFS: string;
  readonly SELECTIONNER_UNE_FILIERE: string;
  readonly TAUX_ROTATION_REFERENCE: string;
  readonly TOP_TAUX_ROTATION_TITLE: string;
  readonly TOP_CONTRATS_TITLE: string;
  readonly TOP_CONTRATS_UNIT_LABEL: string;
  readonly TOP_TAUX_ROTATION_UNIT_TITLE: string;

  // Paramétrage aide
  readonly PARAMETRAGE_AIDE_DESCRIPTION: string;
  readonly PARAMETRAGE_AIDE_MESSAGE_SUCCES: string;
  readonly PARAMETRAGE_AIDE_MESSAGE_ERREUR: string;
  readonly PARAMETRAGE_AIDE_CONFIRMER_SUPPRESSION_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_CONFIRMER_SUPPRESSION_SECTION: string;
  readonly PARAMETRAGE_AIDE_ALERTE_NOM_SECTION_OBLIGATOIRE: string;
  readonly PARAMETRAGE_AIDE_ALERTE_NOM_SECTION_INVALIDE: string;
  readonly PARAMETRAGE_AIDE_ALERTE_SECTION_EXISTANTE: string;
  readonly PARAMETRAGE_AIDE_ALERTE_SUPPRESSION_SECTION: string;
  readonly PARAMETRAGE_AIDE_MESSAGE_AUCUNE_SECTION: string;
  readonly PARAMETRAGE_AIDE_BOUTON_ANNULER_MODIFICATIONS: string;
  readonly PARAMETRAGE_AIDE_BOUTON_ENREGISTRER: string;
  readonly PARAMETRAGE_AIDE_ETAT_ENREGISTREMENT: string;
  readonly PARAMETRAGE_AIDE_NAV_SECTIONS: string;
  readonly PARAMETRAGE_AIDE_BOUTON_AJOUTER_SECTION: string;
  readonly PARAMETRAGE_AIDE_ARIA_SUPPRIMER_SECTION: (titre: string) => string;
  readonly PARAMETRAGE_AIDE_BOUTON_FERMER: string;
  readonly PARAMETRAGE_AIDE_TITRE_MODAL_SECTION: string;
  readonly PARAMETRAGE_AIDE_LABEL_NOM_SECTION: string;
  readonly PARAMETRAGE_AIDE_LABEL_ICONE_SECTION: string;
  readonly PARAMETRAGE_AIDE_BOUTON_ANNULER: string;
  readonly PARAMETRAGE_AIDE_BOUTON_AJOUTER: string;
  readonly PARAMETRAGE_AIDE_TITRE_MODAL_RESSOURCE_AJOUT: string;
  readonly PARAMETRAGE_AIDE_TITRE_MODAL_RESSOURCE_EDITION: string;
  readonly PARAMETRAGE_AIDE_LABEL_NOM_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_LABEL_TYPE_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_OPTION_DOCUMENT: string;
  readonly PARAMETRAGE_AIDE_OPTION_VIDEO: string;
  readonly PARAMETRAGE_AIDE_OPTION_LIEN: string;
  readonly PARAMETRAGE_AIDE_LABEL_LIEN_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_LABEL_DATE_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_LABEL_NOM_FICHIER_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_MESSAGE_SECTION_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_MESSAGE_SECTION_AUTRE: string;
  readonly PARAMETRAGE_AIDE_LABEL_DESCRIPTION: string;
  readonly PARAMETRAGE_AIDE_LEGENDE_ROLES: string;
  readonly PARAMETRAGE_AIDE_LABEL_ORDRE_AFFICHAGE: string;
  readonly PARAMETRAGE_AIDE_PLACEHOLDER_ORDRE: string;
  readonly PARAMETRAGE_AIDE_TITRE_RESSOURCES: string;
  readonly PARAMETRAGE_AIDE_BOUTON_AJOUTER_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_MESSAGE_SECTION_SANS_PARAMETRAGE: string;
  readonly PARAMETRAGE_AIDE_MESSAGE_AUCUNE_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_TABLE_TITRE: string;
  readonly PARAMETRAGE_AIDE_COLONNE_ORDRE: string;
  readonly PARAMETRAGE_AIDE_COLONNE_NOM: string;
  readonly PARAMETRAGE_AIDE_COLONNE_TYPE: string;
  readonly PARAMETRAGE_AIDE_COLONNE_LIEN: string;
  readonly PARAMETRAGE_AIDE_COLONNE_DATE: string;
  readonly PARAMETRAGE_AIDE_COLONNE_FICHIER: string;
  readonly PARAMETRAGE_AIDE_COLONNE_UTILISATEUR: string;
  readonly PARAMETRAGE_AIDE_COLONNE_ACTIONS: string;
  readonly PARAMETRAGE_AIDE_BOUTON_MONTER_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_BOUTON_DESCENDRE_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_BOUTON_MODIFIER_RESSOURCE: string;
  readonly PARAMETRAGE_AIDE_BOUTON_SUPPRIMER_RESSOURCE: string;

  // Aide
  readonly AIDE_TITRE_PAGE: string;
  readonly AIDE_MESSAGE_SECTIONS_VIDES: string;
  readonly AIDE_MESSAGE_CONTENU_INDISPONIBLE: string;
  readonly AIDE_TITRES_RESSOURCES: Readonly<Record<"document" | "video" | "lien", string>>;
  readonly AIDE_INFO_DATE: (date: string) => string;
  readonly AIDE_INFO_NOM_FICHIER: (nom: string) => string;
  readonly AIDE_INFO_SEPARATEUR: string;

  readonly DUREE_CDD: string;
  readonly DUREE_CDD_REF: string;
  readonly MOTIFS_RUPTURE_CONTRAT: string;
  readonly MOTIFS_RUPTURE_CONTRAT_REF: string;
  readonly MOTIF: string;
  readonly DUREE: string;
  readonly NATURE_CONTRATS: string;
  readonly DEPARTS_PREMATURES_CDI: string;
  readonly DEPARTS_PREMATURES_CDI_DONNEES_PARTIELLES: (annee: number, transcriptionMois: string | undefined) => string;

  readonly SELECTIONNER_UNE_ACTIVITE: string;
  readonly SOURCE: string;
  readonly INDICATEURS_CLES_ACTUELS: string;
  readonly DECLARATION_SOCIALE_NOMINATIVE: string;


}
