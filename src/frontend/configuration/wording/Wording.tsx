import { ReactChild, ReactElement } from 'react'

export interface Wording {
  // Header
  readonly INTITULÉ_RÉPUBLIQUE_FRANÇAISE: ReactChild
  readonly ACCUEIL: string
  readonly MENU: string
  readonly DÉCONNEXION: string
  readonly FERMER: string

  // Titre des pages
  readonly TITRE_PAGE_ACCUEIL: string
  readonly TITRE_PAGE_PLAN_DU_SITE: string
  readonly TITRE_PAGE_ACCESSIBILITÉ: string
  readonly TITRE_PAGE_MENTIONS_LÉGALES: string
  readonly TITRE_PAGE_DONNÉES_PERSONNELLES: string
  readonly TITRE_PAGE_GESTION_COOKIES: string

  // Bread Crumb
  readonly VOUS_ÊTES_ICI: string
  readonly VOIR_LE_FIL_D_ARIANE: string
  readonly ENTITÉ_JURIDIQUE: string

  // Home
  readonly TITRE_LISTE_DES_ENTITÉS_JURIDIQUES: string
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_TERRITORIAUX: string
  readonly ENTITÉS_JURIDIQUES: string
  readonly ÉTABLISSEMENT_TERRITORIAUX: string

  // Recherche
  readonly RECHERCHE_TITRE: string
  readonly RECHERCHE_DESCRIPTION: ReactElement
  readonly RECHERCHE_PLACEHOLDER: string
  readonly RECHERCHE_LABEL: string

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

  // Liste des établissements rattachés
  readonly ÉTABLISSEMENT_TERRITORIAL: string
  readonly TITRE_LISTE_DES_ÉTABLISSEMENTS_RATTACHÉS: string
  readonly ÉTABLISSEMENTS_RATTACHÉS: string

  // Source
  readonly FINESS: ReactElement
  readonly DIAMANT: ReactElement

  // Footer
  readonly PRESENTATION: string
  readonly LEGIFRANCE: string
  readonly GOUVERNEMENT: string
  readonly SERVICE_PUBLIC: string
  readonly DATA_GOUV: string
  readonly PLAN_DU_SITE: string
  readonly ACCESSIBILITÉ: string
  readonly MENTIONS_LÉGALES: string
  readonly DONNÉES_PERSONNELLES: string
  readonly GESTION_COOKIES: string
  readonly MENTION_LICENCE: string
  readonly LICENCE_ETALAB: string
  readonly NOUVELLE_FENÊTRE: string

  readonly EN_CONSTRUCTION: string
}
