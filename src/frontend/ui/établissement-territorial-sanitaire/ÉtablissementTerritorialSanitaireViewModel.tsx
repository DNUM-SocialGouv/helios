import { ReactElement } from 'react'

import { ÉtablissementTerritorialSanitaire } from '../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { Paths } from '../../configuration/Paths'
import { Wording } from '../../configuration/wording/Wording'
import { StringFormater } from '../commun/StringFormater'
import { ÉtablissementTerritorialSanitaireActivitéViewModel } from './ÉtablissementTerritorialSanitaireActivitéViewModel'
import { ÉtablissementTerritorialSanitaireAutorisationsViewModel } from './ÉtablissementTerritorialSanitaireAutorisationsViewModel'
import { ÉtablissementTerritorialSanitaireIdentitéViewModel } from './ÉtablissementTerritorialSanitaireIdentitéViewModel'

export class ÉtablissementTerritorialSanitaireViewModel {
  private établissementTerritorialSanitaireIdentitéViewModel: ÉtablissementTerritorialSanitaireIdentitéViewModel
  private établissementTerritorialSanitaireActivitésViewModel: ÉtablissementTerritorialSanitaireActivitéViewModel
  private établissementTerritorialSanitaireAutorisationsViewModel: ÉtablissementTerritorialSanitaireAutorisationsViewModel

  constructor(private readonly établissementTerritorial: ÉtablissementTerritorialSanitaire, private readonly wording: Wording, paths: Paths) {
    this.établissementTerritorialSanitaireIdentitéViewModel =
      new ÉtablissementTerritorialSanitaireIdentitéViewModel(établissementTerritorial.identité, wording, paths)
    this.établissementTerritorialSanitaireActivitésViewModel =
      new ÉtablissementTerritorialSanitaireActivitéViewModel(établissementTerritorial.activités, wording)
    this.établissementTerritorialSanitaireAutorisationsViewModel =
      new ÉtablissementTerritorialSanitaireAutorisationsViewModel(établissementTerritorial.autorisationsEtCapacités, wording)
  }

  public get titre(): string {
    return `ET - ${this.établissementTerritorialSanitaireIdentitéViewModel.numéroFinessÉtablissementTerritorial} - ${this.établissementTerritorialSanitaireIdentitéViewModel.nomDeLÉtablissementTerritorial}`
  }

  public get titreAccessibleDeLEntitéJuridique(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        {' - '}
        {this.formateLeTitreDeLEntitéJuridiqueDeRattachement()}
      </>
    )
  }

  public get numéroFinessEntitéJuridiqueBrut(): string {
    return this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value
  }

  public get identitéViewModel(): ÉtablissementTerritorialSanitaireIdentitéViewModel {
    return this.établissementTerritorialSanitaireIdentitéViewModel
  }

  public get activitésViewModel(): ÉtablissementTerritorialSanitaireActivitéViewModel {
    return this.établissementTerritorialSanitaireActivitésViewModel
  }

  public get autorisationsViewModel(): ÉtablissementTerritorialSanitaireAutorisationsViewModel {
    return this.établissementTerritorialSanitaireAutorisationsViewModel
  }

  private formateLeTitreDeLEntitéJuridiqueDeRattachement() {
    const numéroFinessEntitéJuridiqueFormaté = StringFormater.insèreUnEspaceTousLesNCaractères(
      this.établissementTerritorial.identité.numéroFinessEntitéJuridique.value,
      3
    )
    const nomDeLEntitéJuridique = this.établissementTerritorial.identité.raisonSocialeDeLEntitéDeRattachement.value
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }
}
