import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { EntitéJuridiqueRepository } from '../gateways/EntitéJuridiqueRepository'

export class SauvegarderLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueLoader: EntitéJuridiqueLoader,
    private readonly entitéJuridiqueRepository: EntitéJuridiqueRepository
  ) {}

  async handle(): Promise<void> {
    const entitésJuridiques = this.entitéJuridiqueLoader.récupérerLesEntitésJuridiques()

    await this.entitéJuridiqueRepository.save(entitésJuridiques)
  }
}
