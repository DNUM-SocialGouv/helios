import { ReactElement } from 'react'

import { ÉtablissementTerritorialMédicoSocialIdentité } from '../../../backend/métier/entities/ÉtablissementTerritorialMédicoSocial/ÉtablissementTerritorialMédicoSocialIdentité'
import { Wording } from '../../configuration/wording/Wording'

export class ÉtablissementTerritorialViewModel {
  constructor(private readonly établissementTerritorialIdentité: ÉtablissementTerritorialMédicoSocialIdentité, private readonly wording: Wording) {}

  public get titreAccessible(): ReactElement {
    return (
      <>
        <abbr title="Établissement Territorial">ET</abbr>
            &nbsp;
        {'- '}
        {this.numéroFinessÉtablissementTerritorial}
        {this.nomDeLÉtablissementTerritorial}
      </>
    )
  }

  public get titre(): string {
    return `ET - ${this.numéroFinessÉtablissementTerritorial}${this.nomDeLÉtablissementTerritorial}`
  }

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialIdentité.raisonSociale
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorialIdentité.numéroFinessÉtablissementTerritorial, 3)
  }

  public get adresse(): string {
    return `${this.établissementTerritorialIdentité.adresseNuméroVoie} ${this.établissementTerritorialIdentité.adresseTypeVoie} ${this.établissementTerritorialIdentité.adresseVoie} ${this.établissementTerritorialIdentité.adresseAcheminement}`
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorialIdentité.téléphone, 2))
    const email = this.valeurOuNonRenseigné(this.établissementTerritorialIdentité.courriel)
    return `${téléphoneFormaté} | ${email}`
  }

  public get entitéJuridiqueDeRattachement(): string {
    const numéroFinessEntitéJuridiqueFormaté = this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorialIdentité.numéroFinessEntitéJuridique, 3)
    const nomDeLEntitéJuridique = this.établissementTerritorialIdentité.raisonSocialeDeLEntitéDeRattachement
    return `EJ - ${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorialIdentité.catégorieÉtablissement} - ${this.établissementTerritorialIdentité.libelléCatégorieÉtablissement}`
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorialIdentité.statutJuridique
  }

  public get monoÉtablissement(): string {
    return this.établissementTerritorialIdentité.estMonoÉtablissement ? this.wording.OUI : this.wording.NON
  }

  public get principalOuSecondaire(): string {
    return this.établissementTerritorialIdentité.typeÉtablissement === 'P' ?
      this.wording.PRINCIPAL :
      `${this.wording.SECONDAIRE} (${this.wording.PRINCIPAL} : ${this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorialIdentité.numéroFinessÉtablissementPrincipal, 3)})`
  }

  public get dateDeMiseÀJour(): string {
    return this.formateLaDate(this.établissementTerritorialIdentité.dateMiseAJourSource)
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
