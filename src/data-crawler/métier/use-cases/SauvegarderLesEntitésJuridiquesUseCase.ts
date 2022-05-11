import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'
import { EntitéJuridiqueRepository } from '../gateways/EntitéJuridiqueRepository'

export class SauvegarderLesEntitésJuridiquesUseCase {
  constructor(
    private readonly finessEntitéJuridiqueLoader: EntitéJuridiqueLoader,
    private readonly finessEntitéJuridiqueRepository: EntitéJuridiqueRepository
  ) {}

  async handle(): Promise<void> {
    const entitésJuridiques = this.finessEntitéJuridiqueLoader.récupérerLesEntitésJuridiques()

    await this.finessEntitéJuridiqueRepository.save(entitésJuridiques)
  }
}
