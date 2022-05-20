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

  // Fiches
  readonly MISE_À_JOUR: string
  readonly SOURCE: string

  // Bloc Identité
  readonly TITRE_BLOC_IDENTITÉ: string
  readonly NOM_DE_L_ÉTABLISSEMENT: string
  readonly NUMÉRO_FINESS: ReactElement
  readonly ADRESSE: string
  readonly TÉLÉPHONE: string
  readonly NOM_DU_DIRECTEUR: string
  readonly STATUT_DE_L_ÉTABLISSEMENT: string
  readonly DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM: ReactElement
  readonly ENTITÉ_JURIDIQUE_DE_RATTACHEMENT: string
  readonly CATÉGORIE_DE_L_ÉTABLISSEMENT: string
  readonly MONO_ÉTABLISSEMENT: string
  readonly ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE: string
  readonly SITE_INTERNET: string

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

  readonly EN_CONSTRUCTION: string
}
