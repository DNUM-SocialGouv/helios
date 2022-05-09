import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialLoader } from '../entities/ÉtablissementTerritorialLoader'

export class SauvegarderLesÉtablissementsTerritoriaux {
  constructor(private readonly établissementTerritorialLoader: ÉtablissementTerritorialLoader) {}

  handle(): ÉtablissementTerritorialIdentité[] {
    const établissementsTerritoriaux = this.établissementTerritorialLoader.récupérerLesÉtablissementsTerritoriaux()

    return établissementsTerritoriaux
  }
}
