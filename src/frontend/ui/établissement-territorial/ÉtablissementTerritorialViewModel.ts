import { ÉtablissementTerritorialIdentité } from '../../../backend/métier/entities/ÉtablissementTerritorialIdentité'

export class ÉtablissementTerritorialViewModel {
  constructor(private readonly établissementTerritorialIdentité: ÉtablissementTerritorialIdentité) {}

  public get dateDeMiseÀJour(): string {
    return this.formateLaDate(this.établissementTerritorialIdentité.dateMiseAJourSource)
  }

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialIdentité.raisonSociale
  }

  private formateLaDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
}
