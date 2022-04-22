import { ReactChild } from 'react'

import { Wording } from './Wording'

export class WordingFr implements Wording {
  // Header
  readonly INTITULÉ_DU_MINISTÈRE_SOCIAL: ReactChild = (
    <>
      Ministères
      <br />
      sociaux
    </>
  )
  readonly ACCUEIL: string = 'Accueil'
  readonly MENU: string = 'Menu'
  readonly DÉCONNEXION: string = 'Déconnexion'
  readonly FERMER: string = 'Fermer'

  // Titre des pages
  readonly TITRE_PAGE_ACCUEIL: string = 'Accueil - Helios'
  readonly TITRE_PAGE_PLAN_DU_SITE: string = 'Plan du site - Helios'
  readonly TITRE_PAGE_ACCESSIBILITÉ: string = 'Accessibilité - Helios'
  readonly TITRE_PAGE_MENTIONS_LÉGALES: string = 'Mentions légales - Helios'
  readonly TITRE_PAGE_DONNÉES_PERSONNELLES: string = 'Données personnelles - Helios'
  readonly TITRE_PAGE_GESTION_COOKIES: string = 'Gestion des cookies - Helios'

  // Fil d'ariane
  readonly VOUS_ÊTES_ICI: string = 'Vous êtes ici :'
  readonly VOIR_LE_FIL_D_ARIANE: string = 'Voir le fil d’Ariane'

  // Footer
  readonly PRESENTATION: string = 'Texte sur 3 lignes à demander à Daisy'
  readonly LEGIFRANCE: string = 'legifrance.gouv.fr'
  readonly GOUVERNEMENT: string = 'gouvernement.fr'
  readonly SERVICE_PUBLIC: string = 'service-public.fr'
  readonly DATA_GOUV: string = 'data.gouv.fr'
  readonly PLAN_DU_SITE: string = 'Plan du site'
  readonly ACCESSIBILITÉ: string = 'Accessibilité : partiellement conforme'
  readonly MENTIONS_LÉGALES: string = 'Mentions légales'
  readonly DONNÉES_PERSONNELLES: string = 'Données personnelles'
  readonly GESTION_COOKIES: string = 'Gestion des cookies'
  readonly MENTION_LICENCE: string = 'Sauf mention contraire, tous les contenus de ce site sont sous '
  readonly LICENCE_ETALAB: string = 'licence etalab-2.0'

  readonly EN_CONSTRUCTION: string = 'Demander à Daisy ce que l’on doit écrire.'
}
