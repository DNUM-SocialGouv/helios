import { EntitéJuridiqueHeliosLoader } from '../gateways/EntitéJuridiqueHeliosLoader'
import { ÉtablissementTerritorialRepository } from '../gateways/ÉtablissementTerritorialRepository'
import { ÉtablissementTerritorialSourceExterneLoader } from '../gateways/ÉtablissementTerritorialSourceExterneLoader'

export class SauvegardeLesÉtablissementsTerritoriauxUseCase {
  constructor(
    private readonly établissementTerritorialLoader: ÉtablissementTerritorialSourceExterneLoader,
    private readonly établissementTerritorialRepository: ÉtablissementTerritorialRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader
  ) {}

  async exécute(): Promise<void> {
    const numéroFinessDesEntitésJuridiques = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()
    const établissementsTerritoriaux = await this.établissementTerritorialLoader.récupèreLesÉtablissementsTerritoriauxOuverts(numéroFinessDesEntitésJuridiques)

    await this.établissementTerritorialRepository.sauvegarde(établissementsTerritoriaux)
  }
}
