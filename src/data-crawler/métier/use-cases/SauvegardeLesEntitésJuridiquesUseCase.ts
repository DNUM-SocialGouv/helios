import { EntitéJuridiqueRepository } from '../gateways/EntitéJuridiqueRepository'
import { EntitéJuridiqueSourceExterneLoader } from '../gateways/EntitéJuridiqueSourceExterneLoader'

export class SauvegardeLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueLoader: EntitéJuridiqueSourceExterneLoader,
    private readonly entitéJuridiqueRepository: EntitéJuridiqueRepository
  ) {}

  async handle(): Promise<void> {
    const entitésJuridiques = this.entitéJuridiqueLoader.récupèreLesEntitésJuridiquesOuvertes()

    await this.entitéJuridiqueRepository.sauvegarde(entitésJuridiques)
  }
}
