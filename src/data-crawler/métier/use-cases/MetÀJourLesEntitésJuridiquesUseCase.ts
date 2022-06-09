import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitéJuridiqueHeliosLoader } from '../gateways/EntitéJuridiqueHeliosLoader'
import { EntitéJuridiqueRepository } from '../gateways/EntitéJuridiqueRepository'
import { EntitéJuridiqueSourceExterneLoader } from '../gateways/EntitéJuridiqueSourceExterneLoader'

export class MetÀJourLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueSourceExterneLoader: EntitéJuridiqueSourceExterneLoader,
    private readonly entitéJuridiqueHeliosRepository: EntitéJuridiqueRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader
  ) {}

  async exécute(): Promise<void> {
    const entitésJuridiquesOuvertes = this.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes()

    await this.supprimeLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes)

    await this.entitéJuridiqueHeliosRepository.sauvegarde(entitésJuridiquesOuvertes)
  }

  private async supprimeLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes: EntitéJuridique[]) {
    const entitéJuridiquesEnBase = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()

    const entitésJuridiquesÀSupprimer = entitéJuridiquesEnBase.filter(
      (entitéJuridiqueEnBase) => !entitésJuridiquesOuvertes.find(
        (entitéJuridiqueOuverte) => entitéJuridiqueOuverte.numéroFinessEntitéJuridique === entitéJuridiqueEnBase
      )
    )
    await this.entitéJuridiqueHeliosRepository.supprime(entitésJuridiquesÀSupprimer)
  }
}
