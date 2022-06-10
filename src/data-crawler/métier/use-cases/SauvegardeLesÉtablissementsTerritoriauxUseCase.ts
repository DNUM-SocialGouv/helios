import { EntitéJuridiqueHeliosLoader } from '../gateways/EntitéJuridiqueHeliosLoader'
import { ÉtablissementTerritorialHeliosLoader } from '../gateways/ÉtablissementTerritorialHeliosLoader'
import { ÉtablissementTerritorialRepository } from '../gateways/ÉtablissementTerritorialRepository'
import { ÉtablissementTerritorialSourceExterneLoader } from '../gateways/ÉtablissementTerritorialSourceExterneLoader'

export class SauvegardeLesÉtablissementsTerritoriauxUseCase {
  constructor(
    private readonly établissementTerritorialLoader: ÉtablissementTerritorialSourceExterneLoader,
    private readonly établissementTerritorialRepository: ÉtablissementTerritorialRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader,
    private readonly établissementTerritorialHeliosLoader: ÉtablissementTerritorialHeliosLoader
  ) {}

  async exécute(): Promise<void> {
    const numéroFinessDesEntitésJuridiques = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()
    const établissementsTerritoriaux = await this.établissementTerritorialLoader.récupèreLesÉtablissementsTerritoriauxOuverts(numéroFinessDesEntitésJuridiques)

    await this.établissementTerritorialRepository.sauvegarde(établissementsTerritoriaux)

    const numéroFinessDesÉtablissementsTerritoriaux = await this.établissementTerritorialHeliosLoader.récupèreLeNuméroFinessDesÉtablissementsTerritoriaux()

  }
}
