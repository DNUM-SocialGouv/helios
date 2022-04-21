import { ReactChild } from 'react'

export interface Wording {
  // Header
  readonly INTITULÉ_DU_MINISTÈRE_SOCIAL: ReactChild
  readonly DÉCONNEXION: string

  // Titre des pages
  readonly TITRE_PAGE_ACCUEIL: string
  readonly TITRE_PAGE_PLAN_DU_SITE: string
  readonly TITRE_PAGE_ACCESSIBILITÉ: string
  readonly TITRE_PAGE_MENTIONS_LÉGALES: string
  readonly TITRE_PAGE_DONNÉES_PERSONNELLES: string
  readonly TITRE_PAGE_GESTION_COOKIES: string

  // Fil d'ariane
  readonly VOUS_ÊTES_ICI: string
  readonly VOIR_LE_FIL_D_ARIANE: string

  // Footer
  readonly PRESENTATION: string
  readonly ACCUEIL: string
  readonly PLAN_DU_SITE: string
  readonly ACCESSIBILITÉ: string
  readonly MENTIONS_LÉGALES: string
  readonly DONNÉES_PERSONNELLES: string
  readonly GESTION_COOKIES: string
  readonly MENTION_LICENCE: string
  readonly LICENCE_ETALAB: string

  readonly EN_CONSTRUCTION: string
}
