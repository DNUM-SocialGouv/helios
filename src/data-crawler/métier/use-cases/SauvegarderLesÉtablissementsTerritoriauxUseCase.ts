import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialLoader } from '../gateways/ÉtablissementTerritorialLoader'

export class SauvegarderLesÉtablissementsTerritoriauxUseCase {
  constructor(private readonly établissementTerritorialLoader: ÉtablissementTerritorialLoader) {}

  handle(): ÉtablissementTerritorialIdentité[] {
    const établissementsTerritoriaux = this.établissementTerritorialLoader.récupérerLesÉtablissementsTerritoriaux()

    return établissementsTerritoriaux
  }
}
