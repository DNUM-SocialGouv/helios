import { ÉtablissementTerritorialLoader } from '../gateways/ÉtablissementTerritorialLoader'
import { ÉtablissementTerritorialRepository } from '../gateways/ÉtablissementTerritorialRepository'

export class SauvegarderLesÉtablissementsTerritoriauxUseCase {
  constructor(
    private readonly établissementTerritorialLoader: ÉtablissementTerritorialLoader,
    private readonly établissementTerritorialRepository: ÉtablissementTerritorialRepository
  ) {}

  async handle(): Promise<void> {
    const établissementsTerritoriaux = this.établissementTerritorialLoader.récupérerLesÉtablissementsTerritoriaux()

    await this.établissementTerritorialRepository.save(établissementsTerritoriaux)
  }
}
