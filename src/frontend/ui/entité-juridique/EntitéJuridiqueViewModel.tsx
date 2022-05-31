import { ReactElement } from 'react'

import { EntitéJuridique } from '../../../backend/métier/entities/EntitéJuridique'
import { Wording } from '../../configuration/wording/Wording'

export class EntitéJuridiqueViewModel {
  constructor(private readonly entitéJuridique: EntitéJuridique, private readonly wording: Wording) {}

  public get titreAccessible(): ReactElement {
    return (
      <>
        <abbr title="Entité juridique">EJ</abbr>
        &nbsp;
        {'- '}
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
    return this.insèreUnEspaceTousLesNCaractères(this.entitéJuridique.numéroFinessEntitéJuridique, 3)
  }

  public get adresse(): string {
    return `${this.entitéJuridique.adresseNuméroVoie} ${this.entitéJuridique.adresseTypeVoie} ${this.entitéJuridique.adresseVoie} ${this.entitéJuridique.adresseAcheminement}`
  }

  public get statutDeLEntitéJuridique(): string {
    return this.entitéJuridique.libelléStatutJuridique
  }

  public get téléphone(): string {
    return this.valeurOuNonRenseigné(this.formateLeNuméroDeTéléphone(this.entitéJuridique.téléphone))
  }

  public get dateDeMiseÀJour(): string {
    return this.formateLaDate(this.entitéJuridique.dateMiseAJourSource)
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }

  private formateLeNuméroDeTéléphone(téléphone: string): string {
    return this.insèreUnEspaceTousLesNCaractères(téléphone, 2)
  }

  private insèreUnEspaceTousLesNCaractères(str: string, nombreDeCaractères: number): string {
    return str.split('').map((letter, index) => index % nombreDeCaractères === 0 ? ' ' + letter : letter).join('').trim()
  }

  private formateLaDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
}
