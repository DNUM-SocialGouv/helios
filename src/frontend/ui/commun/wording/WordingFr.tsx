import { ReactChild } from 'react'

import { Wording } from './Wording'

export class WordingFr implements Wording {
  readonly INTITULÉ_DU_MINISTÈRE_SOCIAL: ReactChild = (
    <>
      Ministères
      <br />
      sociaux
    </>
  )
  // Titre des pages
  readonly TITRE_PAGE_ACCUEIL: string = 'Helios - Accueil'
  readonly TITRE_PAGE_PLAN_DU_SITE: string = 'Helios - Plan du site'
  readonly TITRE_PAGE_ACCESSIBILITÉ: string = 'Helios - Accessibilité'
  readonly TITRE_PAGE_MENTIONS_LÉGALES: string = 'Helios - Mentions légales'
  readonly TITRE_PAGE_DONNÉES_PERSONNELLES: string = 'Helios - Données personnelles'
  readonly TITRE_PAGE_GESTION_COOKIES: string = 'Helios - Gestion des cookies'
  // Texte alternatif des images
  readonly ALT_LOGO_HELIOS: string = 'Logo d’Helios'

  readonly DÉCONNEXION: string = 'Déconnexion'
  readonly ACCÉDER_À_L_ACCUEIL: string = 'Accéder à l’accueil'
  readonly PLAN_DU_SITE: string = 'Plan du site'
  readonly ACCESSIBILITÉ: string = 'Accessibilité'
  readonly MENTIONS_LÉGALES: string = 'Mentions légales'
  readonly DONNÉES_PERSONNELLES: string = 'Données personnelles'
  readonly GESTION_COOKIES: string = 'Gestion des cookies'
}
