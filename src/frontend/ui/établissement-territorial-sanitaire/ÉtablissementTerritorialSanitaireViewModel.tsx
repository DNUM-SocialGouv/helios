import { ReactElement } from 'react'

import { ÉtablissementTerritorialSanitaire } from '../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { Wording } from '../../configuration/wording/Wording'

export class ÉtablissementTerritorialSanitaireViewModel {
  constructor(private readonly établissementTerritorialIdentité: ÉtablissementTerritorialSanitaire, private readonly wording: Wording) {}

  public get titre(): string {
    return `ET - ${this.numéroFinessÉtablissementTerritorial} - ${this.nomDeLÉtablissementTerritorial}`
  }

  public get titreAccessibleDeLEntitéJuridique(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;
        {'- '}
        {this.formateLeTitreDeLEntitéJuridiqueDeRattachement()}
      </>
    )
  }

  public get numéroFinessEntitéJuridiqueBrut(): string {
    return this.établissementTerritorialIdentité.identité.numéroFinessEntitéJuridique
  }

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialIdentité.identité.raisonSociale
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorialIdentité.identité.numéroFinessÉtablissementTerritorial, 3)
  }

  public get adresse(): string {
    return `${this.établissementTerritorialIdentité.identité.adresseNuméroVoie} ${this.établissementTerritorialIdentité.identité.adresseTypeVoie} ${this.établissementTerritorialIdentité.identité.adresseVoie} ${this.établissementTerritorialIdentité.identité.adresseAcheminement}`
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorialIdentité.identité.téléphone, 2))
    const email = this.valeurOuNonRenseigné(this.établissementTerritorialIdentité.identité.courriel)
    return `${téléphoneFormaté} | ${email}`
  }

  public get entitéJuridiqueDeRattachement(): string {
    const numéroFinessEntitéJuridiqueFormaté = this.insèreUnEspaceTousLesNCaractères(
      this.établissementTerritorialIdentité.identité.numéroFinessEntitéJuridique, 3
    )
    const nomDeLEntitéJuridique = this.établissementTerritorialIdentité.identité.raisonSocialeDeLEntitéDeRattachement
    return `EJ - ${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorialIdentité.identité.catégorieÉtablissement} - ${this.établissementTerritorialIdentité.identité.libelléCatégorieÉtablissement}`
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorialIdentité.identité.statutJuridique
  }

  public get dateDeMiseÀJour(): string {
    return this.formateLaDate(this.établissementTerritorialIdentité.identité.dateMiseAJourSource)
  }

  private formateLeTitreDeLEntitéJuridiqueDeRattachement() {
    const numéroFinessEntitéJuridiqueFormaté = this.insèreUnEspaceTousLesNCaractères(
      this.établissementTerritorialIdentité.identité.numéroFinessEntitéJuridique,
      3
    )
    const nomDeLEntitéJuridique = this.établissementTerritorialIdentité.identité.raisonSocialeDeLEntitéDeRattachement
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  private insèreUnEspaceTousLesNCaractères(str: string, nombreDeCaractères: number): string {
    return str.split('').map((letter, index) => index % nombreDeCaractères === 0 ? ' ' + letter : letter).join('').trim()
  }

  private formateLaDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }
}
