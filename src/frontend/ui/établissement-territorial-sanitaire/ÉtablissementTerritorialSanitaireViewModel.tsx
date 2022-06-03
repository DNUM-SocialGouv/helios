import { ReactElement } from 'react'

import { ÉtablissementTerritorialSanitaireIdentité } from '../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireIdentité'
import { Wording } from '../../configuration/wording/Wording'
import { StringFormater } from '../commun/StringFormater'

export class ÉtablissementTerritorialSanitaireViewModel {
  constructor(private readonly établissementTerritorialIdentité: ÉtablissementTerritorialSanitaireIdentité, private readonly wording: Wording) {}

  public get titre(): string {
    return `ET - ${this.numéroFinessÉtablissementTerritorial} - ${this.nomDeLÉtablissementTerritorial}`
  }

  public get titreAccessibleDeLEntitéJuridique(): ReactElement {
    return (
      <>
        <abbr title={this.wording.ENTITÉ_JURIDIQUE}>EJ</abbr>
        &nbsp;
        {'- '}
        {this.formateLeTitreDeLEntitéJuridiqueDeRattachement}
      </>
    )
  }

  public get numéroFinessEntitéJuridiqueBrut(): string {
    return this.établissementTerritorialIdentité.numéroFinessEntitéJuridique
  }

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialIdentité.raisonSociale
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return StringFormater.formateLeNuméroFiness(this.établissementTerritorialIdentité.numéroFinessÉtablissementTerritorial)
  }

  public get numéroFinessÉtablissementTerritorialAvecExergueSurLeDépartement(): ReactElement {
    return StringFormater.formateLeNuméroFinessAvecExergueSurLeDépartement(this.établissementTerritorialIdentité.numéroFinessÉtablissementTerritorial)
  }

  public get adresse(): string {
    return `${this.établissementTerritorialIdentité.adresseNuméroVoie} ${this.établissementTerritorialIdentité.adresseTypeVoie} ${this.établissementTerritorialIdentité.adresseVoie} ${this.établissementTerritorialIdentité.adresseAcheminement}`
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(StringFormater.formateLeNuméroDeTéléphone(this.établissementTerritorialIdentité.téléphone))
    const email = this.valeurOuNonRenseigné(this.établissementTerritorialIdentité.courriel)
    return `${téléphoneFormaté} | ${email}`
  }

  public get entitéJuridiqueDeRattachement(): string {
    return `EJ - ${this.formateLeTitreDeLEntitéJuridiqueDeRattachement}`
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorialIdentité.catégorieÉtablissement} - ${this.établissementTerritorialIdentité.libelléCatégorieÉtablissement}`
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorialIdentité.statutJuridique
  }

  public get dateDeMiseÀJour(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.dateMiseAJourSource)
  }

  private get formateLeTitreDeLEntitéJuridiqueDeRattachement() {
    const numéroFinessEntitéJuridiqueFormaté = StringFormater.formateLeNuméroFiness(this.établissementTerritorialIdentité.numéroFinessEntitéJuridique)
    const nomDeLEntitéJuridique = this.établissementTerritorialIdentité.raisonSocialeDeLEntitéDeRattachement
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }
}
