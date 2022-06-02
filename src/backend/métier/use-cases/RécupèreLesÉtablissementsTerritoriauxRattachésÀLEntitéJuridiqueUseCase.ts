import { ÉtablissementTerritorialRattaché } from '../entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { ÉtablissementTerritorialRattachéLoader } from '../gateways/ÉtablissementTerritorialRattachéLoader'

export class RécupèreLesÉtablissementsTerritoriauxRattachésUseCase {
  constructor(private établissementTerritorialLoader: ÉtablissementTerritorialRattachéLoader) {}

  public async exécute(numéroFinessEntitéJuridique: string): Promise<ÉtablissementTerritorialRattaché[]> {
    return this.établissementTerritorialLoader.chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement(numéroFinessEntitéJuridique)
  }
}
