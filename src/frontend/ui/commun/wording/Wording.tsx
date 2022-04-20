import { ReactChild } from 'react'

export interface Wording {
  readonly INTITULÉ_DU_MINISTÈRE_SOCIAL: ReactChild
  // Titre des pages
  readonly TITRE_PAGE_ACCUEIL: string
  readonly TITRE_PAGE_PLAN_DU_SITE: string
  readonly TITRE_PAGE_ACCESSIBILITÉ: string
  readonly TITRE_PAGE_MENTIONS_LÉGALES: string
  readonly TITRE_PAGE_DONNÉES_PERSONNELLES: string
  readonly TITRE_PAGE_GESTION_COOKIES: string
  // Texte alternatif des images
  readonly ALT_LOGO_HELIOS: string

  readonly DÉCONNEXION: string
  readonly ACCÉDER_À_L_ACCUEIL: string
  readonly PLAN_DU_SITE: string
  readonly ACCESSIBILITÉ: string
  readonly MENTIONS_LÉGALES: string
  readonly DONNÉES_PERSONNELLES: string
  readonly GESTION_COOKIES: string
}
