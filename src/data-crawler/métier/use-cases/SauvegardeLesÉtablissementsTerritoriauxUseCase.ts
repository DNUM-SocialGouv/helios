import { ÉtablissementTerritorialSourceExterneLoader } from '../gateways/ÉtablissementTerritorialSourceExterneLoader'
import { ÉtablissementTerritorialRepository } from '../gateways/ÉtablissementTerritorialRepository'

export class SauvegardeLesÉtablissementsTerritoriauxUseCase {
  constructor(
    private readonly établissementTerritorialLoader: ÉtablissementTerritorialSourceExterneLoader,
    private readonly établissementTerritorialRepository: ÉtablissementTerritorialRepository
  ) {}

  async handle(): Promise<void> {
    const établissementsTerritoriaux = this.établissementTerritorialLoader.récupèreLesÉtablissementsTerritoriauxOuverts()

    await this.établissementTerritorialRepository.sauvegarde(établissementsTerritoriaux)
  }
}
