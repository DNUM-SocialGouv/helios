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
  readonly BACK_TO_HOME: string;
  readonly APPLY: string;


  // Messages d'erreur
  readonly MISSING_EMAIL: string;
  readonly EMAIL_NOT_VALID: string;
  readonly SOMETHING_WENT_WRONG: string;

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

  // Connexion
  readonly CONNEXION_IDENTIFIANT: string
  readonly CONNEXION_MOT_DE_PASSE: string
  readonly CONNEXION_MOT_DE_PASSE_OUBLIE: string
  readonly CONNEXION_LIBELLE: string

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
  readonly INDICATEURS_VIDES: string;
  readonly AUCUNE_DONNÉE_RENSEIGNÉE: string;

  // Catégorisation
  readonly PRIVÉ_LUCRATIF: string;
  readonly PRIVÉ_NON_LUCRATIF: string;
  readonly PUBLIC: string;
  readonly PERSONNE_MORALE_DROIT_ÉTRANGER: string;

  // Bloc Identité
  readonly TITRE_BLOC_IDENTITÉ: string;
  readonly NOM_DE_L_ÉTABLISSEMENT: string;
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

  // Bloc Activité Sanitaire
  readonly NOMBRE_DE_SÉJOUR_MCO: string;
  readonly TOTAL_HOSPITALISATION_MÉDECINE: string;
  readonly TOTAL_HOSPITALISATION_CHIRURGIE: string;
  readonly TOTAL_HOSPITALISATION_OBSTÉTRIQUE: string;
  readonly HOSPITALISATION_PARTIELLE_MÉDECINE: string;
  readonly HOSPITALISATION_COMPLÈTE_MÉDECINE: string;
  readonly HOSPITALISATION_PARTIELLE_CHIRURGIE: string;
  readonly HOSPITALISATION_COMPLÈTE_CHIRURGIE: string;
  readonly HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE: string;
  readonly HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE: string;
  readonly TOTAL_HOSPITALISATION_SSR: string;
  readonly TOTAL_HOSPITALISATION_PSY: string;
  readonly NOMBRE_DE_JOURNÉES_PSY_ET_SSR: string;
  readonly HOSPITALISATION_PARTIELLE_SSR: string;
  readonly HOSPITALISATION_COMPLÈTE_SSR: string;
  readonly HOSPITALISATION_PARTIELLE_PSY: string;
  readonly HOSPITALISATION_COMPLÈTE_PSY: string;

  readonly NOMBRE_DE_HAD: string;

  // Bloc Autorisation
  readonly TITRE_BLOC_AUTORISATION_ET_CAPACITÉ: string;
  readonly AUTORISATIONS_SANITAIRE: string;
  readonly AUTORISATIONS_MS: string;
  readonly AUTORISATIONS_ACTIVITES: string;
  readonly DATE_D_AUTORISATION: string;
  readonly DATE_DE_FIN: string;
  readonly DATE_DE_MISE_EN_OEUVRE: string;
  readonly MISE_À_JOUR_AUTORISATION: string;
  readonly DERNIÈRE_INSTALLATION: string;
  readonly CAPACITÉ_AUTORISÉE: string;
  readonly CAPACITÉ_INSTALLÉE: string;
  readonly CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS: string;
  readonly NOMBRE_TOTAL_DE_PLACE: string;
  readonly ACTIVITÉ: string;

  // Bloc Autorisation Sanitaire
  readonly AUTRES_ACTIVITÉS: string;
  readonly AUTRES_ACTIVITÉS_SAN: string;
  readonly RECONNAISSANCES_CONTRACTUELLES: string;
  readonly ÉQUIPEMENTS_MATÉRIELS_LOURDS: string;
  readonly DATE_D_EFFET_ASR: ReactElement;
  readonly DATE_D_EFFET_CPOM: ReactElement;
  readonly DATE_DE_FIN_CPOM: ReactElement;
  readonly NUMÉRO_CPOM: ReactElement;
  readonly NUMÉRO_ARHGOS: string;
  readonly ACTIVITÉS: string;
  readonly CHIRURGIE: string;
  readonly MÉDECINE: string;
  readonly OBSTÉTRIQUE: string;
  readonly SSR: string;
  readonly USLD: string;
  readonly PSYCHIATRIE: string;
  readonly LITS: string;
  readonly PLACES: string;

  // Bloc budget et finances
  readonly TITRE_BLOC_BUDGET_ET_FINANCES: string;
  readonly MONTANT_DE_LA_CONTRIBUTION_AUX_FRAIS_DE_SIÈGE: string;
  readonly MONTANT: string;
  readonly TAUX_DE_VÉTUSTÉ_CONSTRUCTION: string;
  readonly RÉSULTAT_NET_COMPTABLE: string;

  readonly RATIO_DEPENDANCE_FINANCIERE: string;
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
  readonly COMPTE_DE_RÉSULTAT: string;

  readonly PRODUITS_PRINCIPAUX: string;
  readonly PRODUITS_ANNEXES: string;
  readonly CHARGES_ANNEXES: string;
  readonly CHARGES_PRINCIPALES: string;
  readonly BUDGET_PRINCIPAL: string;
  readonly BUDGET_ANNEXE: string;

  // Bloc ressources humaines
  readonly TITRE_BLOC_RESSOURCES_HUMAINES: string;
  readonly NOMBRE_D_ETP_TOTAL_RÉALISÉ: ReactElement;
  readonly NOMBRE_D_ETP_TOTAL_RÉALISÉ_SANS_ABRÉVIATION: string;
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
  readonly TAUX: string;
  readonly NOMBRE_DE_CDD_DE_REMPLACEMENT: ReactElement;
  readonly NOMBRE_DE_CDD_DE_REMPLACEMENT_SANS_ABRÉVIATION: string;
  readonly TAUX_D_ETP_VACANTS_AU_31_12: string;
  readonly TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES: string;

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
  // Sources courtes
  readonly FINESS: ReactElement;
  readonly DIAMANT: ReactElement;
  readonly CNSA: ReactElement;
  readonly ANCRE: ReactElement;
  readonly TDB_PERF: ReactElement;
  readonly PMSI: ReactElement;
  readonly ARHGOS: ReactElement;
  readonly SAE: ReactElement;
  readonly RPU: ReactElement;

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

  // Mot de passe oublié
  readonly MOT_PASSE_OUBLIE_TITRE: string;
  readonly MOT_PASSE_OUBLIE_LABEL: string;
  readonly MOT_PASSE_OUBLIE_SUCCESS_MESSAGE: string;

  // Changement de mot de passe
  readonly CHANGEMENT_MOT_PASSE_TITRE: string;
  readonly CHANGEMENT_MOT_PASSE_DESCRIPTION: string;
  readonly MOT_DE_PASSE: string;
  readonly CONFIRMER_MOT_DE_PASSE: string;
  readonly CONFIRM_CHANGE_PASSWORD: string;
}
