import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { EntitéJuridiqueRepository } from '../gateways/EntitéJuridiqueRepository'

export class SauvegardeLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueLoader: EntitéJuridiqueLoader,
    private readonly entitéJuridiqueRepository: EntitéJuridiqueRepository
  ) {}

  async handle(): Promise<void> {
    const entitésJuridiques = this.entitéJuridiqueLoader.récupèreLesEntitésJuridiques()

    await this.entitéJuridiqueRepository.sauvegarde(entitésJuridiques)
  }
}
