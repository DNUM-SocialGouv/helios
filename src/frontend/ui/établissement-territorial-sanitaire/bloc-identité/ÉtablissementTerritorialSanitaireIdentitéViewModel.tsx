import Link from 'next/link'
import { ReactElement } from 'react'

import { ÉtablissementTerritorialSanitaire } from '../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { Paths } from '../../../configuration/Paths'
import { Wording } from '../../../configuration/wording/Wording'
import { StringFormater } from '../../commun/StringFormater'

export class ÉtablissementTerritorialSanitaireIdentitéViewModel {
  constructor(
    private readonly établissementTerritorialSanitaireIdentité: ÉtablissementTerritorialSanitaire['identité'],
    private readonly wording: Wording,
    private readonly paths: Paths
  ) {}

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialSanitaireIdentité.raisonSociale.value
  }

  public get nomCourtDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialSanitaireIdentité.raisonSocialeCourte.value
  }

  public get dateDeMiseÀJourDuNomDeLÉtablissementTerritorial(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireIdentité.raisonSociale.dateMiseÀJourSource)
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return this.établissementTerritorialSanitaireIdentité.numéroFinessÉtablissementTerritorial.value
  }

  public get dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireIdentité.numéroFinessÉtablissementTerritorial.dateMiseÀJourSource)
  }

  public get adresse(): string {
    return `${this.établissementTerritorialSanitaireIdentité.adresseNuméroVoie.value} ${this.établissementTerritorialSanitaireIdentité.adresseTypeVoie.value} ${this.établissementTerritorialSanitaireIdentité.adresseVoie.value} ${this.établissementTerritorialSanitaireIdentité.adresseAcheminement.value}`
  }

  public get dateDeMiseÀJourDeLAdresse(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireIdentité.adresseNuméroVoie.dateMiseÀJourSource)
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(
      StringFormater.formateLeNuméroDeTéléphone(this.établissementTerritorialSanitaireIdentité.téléphone.value)
    )
    const email = this.valeurOuNonRenseigné(this.établissementTerritorialSanitaireIdentité.courriel.value)
    return `${téléphoneFormaté} | ${email}`
  }

  public get dateDeMiseÀJourDutéléphoneEtDeLEmail(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireIdentité.téléphone.dateMiseÀJourSource)
  }

  public get entitéJuridiqueDeRattachement(): ReactElement {
    const lienVersLEntitéJuridique = `${this.paths.ENTITÉ_JURIDIQUE}/${this.établissementTerritorialSanitaireIdentité.numéroFinessEntitéJuridique.value}`
    const nomDeLEntitéJuridique = this.établissementTerritorialSanitaireIdentité.raisonSocialeDeLEntitéDeRattachement.value
    const libellé = `EJ - ${this.établissementTerritorialSanitaireIdentité.numéroFinessEntitéJuridique.value} - ${nomDeLEntitéJuridique}`

    return (
      <Link
        href={lienVersLEntitéJuridique}
        passHref
        prefetch={false}
      >
        {libellé}
      </Link>
    )
  }

  public get dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireIdentité.raisonSocialeDeLEntitéDeRattachement.dateMiseÀJourSource)
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorialSanitaireIdentité.catégorieÉtablissement.value} - ${this.établissementTerritorialSanitaireIdentité.libelléCatégorieÉtablissement.value}`
  }

  public get dateDeMiseÀJourDeLaCatégorieDeLÉtablissement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireIdentité.catégorieÉtablissement.dateMiseÀJourSource)
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorialSanitaireIdentité.statutJuridique.value
  }

  public get dateDeMiseÀJourDuStatutDeLÉtablissement(): string {
    return StringFormater.formateLaDate(this.établissementTerritorialSanitaireIdentité.statutJuridique.dateMiseÀJourSource)
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === '' ? this.wording.NON_RENSEIGNÉ : valeur
  }
}
