import { ReactChild } from 'react'

import { Wording } from './Wording'

export class WordingFr implements Wording {
  readonly ALT_LOGO_HELIOS: string = 'Logo d\'Helios'
  readonly INTITULÉ_DU_MINISTÈRE_SOCIAL: ReactChild = (
    <>
      Ministères
      <br />
      sociaux
    </>
  )
  readonly ACCÉDER_À_L_ACCUEIL: string = 'Accéder à l’accueil'
  readonly DÉCONNEXION: string = 'Déconnexion'
}
