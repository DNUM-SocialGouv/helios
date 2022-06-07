import { EntitéJuridiqueSourceExterneLoader } from '../gateways/EntitéJuridiqueSourceExterneLoader'
import { EntitéJuridiqueRepository } from '../gateways/EntitéJuridiqueRepository'

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
