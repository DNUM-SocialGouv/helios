import { ÉtablissementTerritorialRepository } from '../gateways/ÉtablissementTerritorialRepository'
import { ÉtablissementTerritorialSourceExterneLoader } from '../gateways/ÉtablissementTerritorialSourceExterneLoader'

export class SauvegardeLesÉtablissementsTerritoriauxUseCase {
  constructor(
    private readonly établissementTerritorialLoader: ÉtablissementTerritorialSourceExterneLoader,
    private readonly établissementTerritorialRepository: ÉtablissementTerritorialRepository
  ) {}

  async handle(): Promise<void> {
    const établissementsTerritoriaux = await this.établissementTerritorialLoader.récupèreLesÉtablissementsTerritoriauxOuverts()

    await this.établissementTerritorialRepository.sauvegarde(établissementsTerritoriaux)
  }
}
