import { ÉtablissementTerritorialLoader } from '../gateways/ÉtablissementTerritorialLoader'
import { ÉtablissementTerritorialRepository } from '../gateways/ÉtablissementTerritorialRepository'

export class SauvegardeLesÉtablissementsTerritoriauxUseCase {
  constructor(
    private readonly établissementTerritorialLoader: ÉtablissementTerritorialLoader,
    private readonly établissementTerritorialRepository: ÉtablissementTerritorialRepository
  ) {}

  async handle(): Promise<void> {
    const établissementsTerritoriaux = this.établissementTerritorialLoader.récupèreLesÉtablissementsTerritoriaux()

    await this.établissementTerritorialRepository.sauvegarde(établissementsTerritoriaux)
  }
}
