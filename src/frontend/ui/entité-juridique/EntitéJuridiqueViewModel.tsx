import { ReactElement } from 'react'

import { EntitéJuridique } from '../../../backend/métier/entities/entité-juridique/EntitéJuridique'
import { Wording } from '../../configuration/wording/Wording'
import { StringFormater } from '../commun/StringFormater'

export class EntitéJuridiqueViewModel {
  constructor(private readonly entitéJuridique: EntitéJuridique, private readonly wording: Wording) {}

  public get titreAccessible(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        {' - '}
        {this.numéroFiness}
        {' - '}
        {this.nomDeLEntitéJuridique}
      </>
    )
  }

  public get titre(): string {
    return `EJ - ${this.numéroFiness} - ${this.nomDeLEntitéJuridique}`
  }

  public get nomDeLEntitéJuridique(): string {
    return this.entitéJuridique.raisonSociale
  }

  public get numéroFiness(): string {
    return StringFormater.formateLeNuméroFiness(this.entitéJuridique.numéroFinessEntitéJuridique)
  }

  public get adresse(): string {
    return `${this.entitéJuridique.adresseNuméroVoie} ${this.entitéJuridique.adresseTypeVoie} ${this.entitéJuridique.adresseVoie} ${this.entitéJuridique.adresseAcheminement}`
  }

  public get statutDeLEntitéJuridique(): string {
    return this.entitéJuridique.libelléStatutJuridique
  }

  public get téléphone(): string {
    return this.valeurOuNonRenseigné(StringFormater.formateLeNuméroDeTéléphone(this.entitéJuridique.téléphone))
  }

  public get dateDeMiseÀJour(): string {
    return StringFormater.formateLaDate(this.entitéJuridique.dateMiseAJourSource)
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }
}
