import Link from 'next/link'

import { ÉtablissementTerritorialMédicoSocial } from '../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { Paths } from '../../configuration/Paths'
import { Wording } from '../../configuration/wording/Wording'
import { StringFormater } from '../commun/StringFormater'

export class ÉtablissementTerritorialMédicoSocialIdentitéViewModel {

  constructor(
    private readonly établissementTerritorialIdentité: ÉtablissementTerritorialMédicoSocial['identité'],
    private readonly wording: Wording,
    private readonly paths: Paths
  ) {}

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialIdentité.raisonSociale.value
  }

  public get dateDeMiseÀJourDuNomDeLÉtablissementTerritorial(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.raisonSociale.dateMiseÀJourSource)
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return StringFormater.formateLeNuméroFiness(this.établissementTerritorialIdentité.numéroFinessÉtablissementTerritorial.value)
  }

  public get dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.numéroFinessÉtablissementTerritorial.dateMiseÀJourSource)
  }

  public get adresse(): string {
    return `${this.établissementTerritorialIdentité.adresseNuméroVoie.value} ${this.établissementTerritorialIdentité.adresseTypeVoie.value} ${this.établissementTerritorialIdentité.adresseVoie.value} ${this.établissementTerritorialIdentité.adresseAcheminement.value}`
  }

  public get dateDeMiseÀJourDeLAdresse(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.adresseNuméroVoie.dateMiseÀJourSource)
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(StringFormater.formateLeNuméroDeTéléphone(this.établissementTerritorialIdentité.téléphone.value))
    const email = this.valeurOuNonRenseigné(this.établissementTerritorialIdentité.courriel.value)
    return `${téléphoneFormaté} | ${email}`
  }

  public get dateDeMiseÀJourDuTéléphoneEtDeLEmail(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.téléphone.dateMiseÀJourSource)
  }

  public get entitéJuridiqueDeRattachement(): JSX.Element {
    const lienVersLEntitéJuridique = `${this.paths.ENTITÉ_JURIDIQUE}/${this.établissementTerritorialIdentité.numéroFinessEntitéJuridique.value}`
    const titreDeLEntitéJuridiqueDeRattachement = this.formateLeTitreDeLEntitéJuridiqueDeRattachement()
    const libellé = `EJ - ${titreDeLEntitéJuridiqueDeRattachement}`

    return (<Link
      href={lienVersLEntitéJuridique}
      passHref
      prefetch={false}
    >
      {libellé}
    </Link>)
  }

  public get dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.raisonSocialeDeLEntitéDeRattachement.dateMiseÀJourSource)
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorialIdentité.catégorieÉtablissement.value} - ${this.établissementTerritorialIdentité.libelléCatégorieÉtablissement.value}`
  }

  public get dateDeMiseÀJourDeLaCatégorieDeLÉtablissement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.catégorieÉtablissement.dateMiseÀJourSource)
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorialIdentité.statutJuridique.value
  }

  public get dateDeMiseÀJourDuStatutDeLÉtablissement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.statutJuridique.dateMiseÀJourSource)
  }

  public get monoÉtablissement(): string {
    return this.établissementTerritorialIdentité.estMonoÉtablissement.value ? this.wording.OUI : this.wording.NON
  }

  public get dateDeMiseÀJourDuMonoÉtablissement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.estMonoÉtablissement.dateMiseÀJourSource)
  }

  public get principalOuSecondaire(): string {
    return this.établissementTerritorialIdentité.typeÉtablissement.value === 'P' ?
      this.wording.PRINCIPAL :
      `${this.wording.SECONDAIRE} (${this.wording.PRINCIPAL} : ${StringFormater.formateLeNuméroFiness(this.établissementTerritorialIdentité.numéroFinessÉtablissementPrincipal.value)})`
  }

  public get dateDeMiseÀJourDuPrincipalOuDuSecondaire(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.numéroFinessÉtablissementPrincipal.dateMiseÀJourSource)
  }

  public get dateDeLEntréeEnVigueurDuCpom(): string {
    const dateDEntréeEnVigueurDuCpom = this.établissementTerritorialIdentité.dateDEntréeEnVigueurDuCpom.value
    return dateDEntréeEnVigueurDuCpom !== '' ? StringFormater.formateLaDate(dateDEntréeEnVigueurDuCpom) : this.wording.NON_RENSEIGNÉ
  }

  public get dateDeMiseÀJourDeLEntréeEnVigueurDuCpom(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialIdentité.dateDEntréeEnVigueurDuCpom.dateMiseÀJourSource)
  }

  private formateLeTitreDeLEntitéJuridiqueDeRattachement(): string {
    const numéroFinessEntitéJuridiqueFormaté = StringFormater.formateLeNuméroFiness(this.établissementTerritorialIdentité.numéroFinessEntitéJuridique.value)
    const nomDeLEntitéJuridique = this.établissementTerritorialIdentité.raisonSocialeDeLEntitéDeRattachement.value
    return `${numéroFinessEntitéJuridiqueFormaté} - ${nomDeLEntitéJuridique}`
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }
}
