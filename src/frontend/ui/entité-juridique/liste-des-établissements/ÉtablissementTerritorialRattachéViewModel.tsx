import Image from 'next/image'
import { ReactElement } from 'react'

import { DomaineÉtablissementTerritorial } from '../../../../backend/métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialRattaché } from '../../../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { Paths } from '../../../configuration/Paths'
import { Wording } from '../../../configuration/wording/Wording'
import { StringFormater } from '../../commun/StringFormater'
import logoÉtablissementTerritorialMédicoSocial from './logo-établissement-territorial-médico-social-noir.svg'
import logoÉtablissementTerritorialSanitaire from './logo-établissement-territorial-sanitaire-noir.svg'

export class ÉtablissementTerritorialRattachéViewModel {
  constructor(private readonly établissementTerritorialRattaché: ÉtablissementTerritorialRattaché, private wording: Wording) {}

  public get numéroFiness(): string {
    return this.établissementTerritorialRattaché.numéroFiness
  }

  public get identifiant(): ReactElement {
    const numéroFinessFormaté = StringFormater.formateLeNuméroFiness(this.numéroFiness)
    return (
      <>
        <abbr title={this.wording.ÉTABLISSEMENT_TERRITORIAL}>ET</abbr>
        {' - '}
        {numéroFinessFormaté}
        {' - '}
        {this.établissementTerritorialRattaché.raisonSociale}
      </>
    )
  }

  public lienVersLÉtablissement(paths: Paths): string {
    const préfixe = this.établissementTerritorialRattaché.domaine === DomaineÉtablissementTerritorial.MÉDICO_SOCIAL ?
      paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL :
      paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE
    return `${préfixe}/${this.numéroFiness}`
  }

  public get logo(): ReactElement {
    const logo = this.établissementTerritorialRattaché.domaine === DomaineÉtablissementTerritorial.MÉDICO_SOCIAL ?
      logoÉtablissementTerritorialMédicoSocial :
      logoÉtablissementTerritorialSanitaire
    return (
      <Image
        alt=""
        height="22"
        priority
        src={logo}
        width="22"
      />
    )
  }

}
