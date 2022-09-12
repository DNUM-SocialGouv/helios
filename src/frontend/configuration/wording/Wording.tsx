import { ReactChild, ReactElement } from 'react'

export interface Wording {
  // Header
  readonly INTITULÉ_RÉPUBLIQUE_FRANÇAISE: ReactChild
  readonly ACCUEIL: string
  readonly MENU: string
  readonly DÉCONNEXION: string
  readonly FERMER: string
  readonly TITRE_DU_SITE: string

  // Titre des pages
  readonly TITRE_PAGE_ACCUEIL: string
  readonly TITRE_PAGE_ACCESSIBILITÉ: string
  readonly TITRE_PAGE_MENTIONS_LÉGALES: string
  readonly TITRE_PAGE_DONNÉES_PERSONNELLES: string
  readonly TITRE_PAGE_INACCESSIBLE: string

  // Breadcrumb
  readonly VOUS_ÊTES_ICI: string
  readonly VOIR_LE_FIL_D_ARIANE: string
  readonly ENTITÉ_JURIDIQUE: string
  readonly régionBreadcrumb: (placeholder: string) => string

  // Home
  readonly TITRE_LISTE_DES_ENTITÉS_JURIDIQUES: string
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_TERRITORIAUX: string
  readonly ENTITÉS_JURIDIQUES: string
  readonly ÉTABLISSEMENT_TERRITORIAUX: string
  readonly SITE_EN_CONSTRUCTION: string

  // Recherche
  readonly RECHERCHE_TITRE: string
  readonly RECHERCHE_DESCRIPTION: ReactElement
  readonly RECHERCHE_PLACEHOLDER: string
  readonly RECHERCHE_LABEL: string
  readonly RÉSULTAT_DE_RECHERCHE: string
  readonly rechercheNombreRésultats: (nombre: number, terme: string) => string
  readonly RECHERCHE_EN_ATTENTE: string
  readonly aucunRésultat: (terme: string) => string

  // Cartographie
  readonly CARTOGRAPHIE: string
  readonly OFFRE_SANTÉ_PAR_REGION: string
  readonly CARTOGRAPHIE_DESCRIPTION: string

  // Région
  readonly régionAtlasSanté: (placeholder: string) => string

  // Fiches
  readonly MISE_À_JOUR: string
  readonly SOURCE: string
  readonly NON_RENSEIGNÉ: string
  readonly OUI: string
  readonly NON: string
  readonly DÉTAILS: string

  // Info bulle
  readonly ÉLÉMENTS_DE_COMPRÉHENSION: string
  readonly FRÉQUENCE: string
  readonly MODE_DE_CALCUL: string
  readonly SOURCES: string
  readonly INFOS_COMPLÉMENTAIRES: string

  // Indicateurs
  readonly AFFICHER_LA_TRANSCRIPTION: string
  readonly ANNÉE: string
  readonly INDICATEURS_VIDES: string
  readonly AUCUNE_DONNÉE_RENSEIGNÉE: string

  // Bloc Identité
  readonly TITRE_BLOC_IDENTITÉ: string
  readonly NOM_DE_L_ÉTABLISSEMENT: string
  readonly NUMÉRO_FINESS: string
  readonly ADRESSE: string
  readonly TÉLÉPHONE: string
  readonly TÉLÉPHONE_ET_EMAIL: string
  readonly NOM_DU_DIRECTEUR: string
  readonly STATUT_DE_L_ÉTABLISSEMENT: string
  readonly DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM: ReactElement
  readonly ENTITÉ_JURIDIQUE_DE_RATTACHEMENT: string
  readonly CATÉGORIE_DE_L_ÉTABLISSEMENT: string
  readonly MONO_ÉTABLISSEMENT: string
  readonly ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE: string
  readonly PRINCIPAL: string
  readonly SECONDAIRE: string
  readonly SITE_INTERNET: string

  // Bloc Activité Médico-social
  readonly TITRE_BLOC_ACTIVITÉ: string
  readonly TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT: string
  readonly TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE: string
  readonly TAUX_OCCUPATION_ACCUEIL_DE_JOUR: string
  readonly TAUX_RÉALISATION_ACTIVITÉ: string
  readonly FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES: string
  readonly NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES: string
  readonly DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES: string
  readonly NOMBRE_DE_PASSAGES_AUX_URGENCES: string

  // Bloc Activité Sanitaire
  readonly NOMBRE_DE_SÉJOUR_MCO: string
  readonly TOTAL_HOSPITALISATION_MÉDECINE: string
  readonly TOTAL_HOSPITALISATION_CHIRURGIE: string
  readonly TOTAL_HOSPITALISATION_OBSTÉTRIQUE: string
  readonly HOSPITALISATION_PARTIELLE_MÉDECINE: string
  readonly HOSPITALISATION_COMPLÈTE_MÉDECINE: string
  readonly HOSPITALISATION_PARTIELLE_CHIRURGIE: string
  readonly HOSPITALISATION_COMPLÈTE_CHIRURGIE: string
  readonly HOSPITALISATION_PARTIELLE_OBSTÉTRIQUE: string
  readonly HOSPITALISATION_COMPLÈTE_OBSTÉTRIQUE: string
  readonly TOTAL_HOSPITALISATION_SSR: string
  readonly TOTAL_HOSPITALISATION_PSY: string
  readonly NOMBRE_DE_JOURNÉES_PSY_ET_SSR: string
  readonly HOSPITALISATION_PARTIELLE_SSR: string
  readonly HOSPITALISATION_COMPLÈTE_SSR: string
  readonly HOSPITALISATION_PARTIELLE_PSY: string
  readonly HOSPITALISATION_COMPLÈTE_PSY: string

  // Bloc Autorisation
  readonly TITRE_BLOC_AUTORISATION_ET_CAPACITÉ: string
  readonly AUTORISATIONS: string
  readonly DATE_D_AUTORISATION: string
  readonly DATE_DE_FIN: string
  readonly DATE_DE_MISE_EN_OEUVRE: string
  readonly MISE_À_JOUR_AUTORISATION: string
  readonly DERNIÈRE_INSTALLATION: string
  readonly CAPACITÉ_AUTORISÉE: string
  readonly CAPACITÉ_INSTALLÉE: string
  readonly CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS: string
  readonly NOMBRE_TOTAL_DE_PLACE_PAR_ACTIVITÉ: string
  readonly ACTIVITÉ: string

  // Bloc Autorisation Sanitaire
  readonly AUTRES_ACTIVITÉS: string
  readonly RECONNAISSANCES_CONTRACTUELLES: string
  readonly ÉQUIPEMENTS_MATÉRIELS_LOURDS: string
  readonly DATE_D_EFFET_ASR: ReactElement
  readonly DATE_D_EFFET_CPOM: ReactElement
  readonly DATE_DE_FIN_CPOM: ReactElement
  readonly NUMÉRO_CPOM: ReactElement
  readonly NUMÉRO_ARHGOS: string
  readonly CAPACITÉ_PAR_ACTIVITÉS: string
  readonly ACTIVITÉS: string
  readonly CHIRURGIE: string
  readonly MÉDECINE: string
  readonly OBSTÉTRIQUE: string
  readonly SSR: string
  readonly USLD: string
  readonly PSYCHIATRIE: string
  readonly LITS: string
  readonly PLACES: string

  // Liste des établissements rattachés
  readonly ÉTABLISSEMENT_TERRITORIAL: string
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS: string
  readonly ÉTABLISSEMENTS_RATTACHÉS: string

  // Source
  readonly FINESS: ReactElement
  readonly DIAMANT: ReactElement
  readonly CNSA: ReactElement
  readonly TDB_PERF: ReactElement
  readonly PMSI: ReactElement
  readonly ARHGOS: ReactElement
  readonly SAE: ReactElement

  // Inaccessible
  readonly ACCÈS_REFUSÉ: string

  // Footer
  readonly LEGIFRANCE: string
  readonly GOUVERNEMENT: string
  readonly SERVICE_PUBLIC: string
  readonly DATA_GOUV: string
  readonly ACCESSIBILITÉ: string
  readonly NON_CONFORME: string
  readonly MENTIONS_LÉGALES: string
  readonly DONNÉES_PERSONNELLES: string
  readonly MENTION_LICENCE: string
  readonly LICENCE_ETALAB: string
  readonly NOUVELLE_FENÊTRE: string

  // Accessibilité
  readonly AUDIT_EN_COURS: string

  // Données personnelles
  readonly FINALITÉ_ET_FONDEMENT_DU_TRAITEMENT: string
  readonly PROTECTION_DES_DONNÉES_PERSONNELLES: string
  readonly DROITS_DES_PERSONNES_CONCERNÉES: string

  // Mentions légales
  readonly ÉDITEUR_DU_SITE: string
  readonly PROPRIÉTÉ_INTELLECTUELLE: string
  readonly LIMITES_DE_RESPONSABILITÉ: string

  readonly EN_CONSTRUCTION: string
}
