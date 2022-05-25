import { ÉtablissementTerritorialIdentité } from '../../../backend/métier/entities/ÉtablissementTerritorialIdentité'

export class ÉtablissementTerritorialViewModel {
  constructor(private readonly établissementTerritorialIdentité: ÉtablissementTerritorialIdentité) {}

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
    const téléphoneFormaté = this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorialIdentité.téléphone, 2)
    return `${téléphoneFormaté}     ${this.établissementTerritorialIdentité.courriel}`
  }

  public get entitéJuridiqueDeRattachement(): string {
    const numéroFinessEntitéJuridiqueFormaté = this.insèreUnEspaceTousLesNCaractères(this.établissementTerritorialIdentité.numéroFinessEntitéJuridique, 3)
    return `EJ - ${numéroFinessEntitéJuridiqueFormaté} - JE SAIS PO`
  }

  public get catégorieDeLÉtablissement(): string {
    return this.établissementTerritorialIdentité.catégorieÉtablissement
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
}
