import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitéJuridiqueHeliosLoader } from '../gateways/EntitéJuridiqueHeliosLoader'
import { EntitéJuridiqueRepository } from '../gateways/EntitéJuridiqueRepository'
import { EntitéJuridiqueSourceExterneLoader } from '../gateways/EntitéJuridiqueSourceExterneLoader'

export class MetsÀJourLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueSourceExterneLoader: EntitéJuridiqueSourceExterneLoader,
    private readonly entitéJuridiqueHeliosRepository: EntitéJuridiqueRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader
  ) {}

  async exécute(): Promise<void> {
    const entitésJuridiquesOuvertes = this.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes()
    console.log('nb entités ouvertes', entitésJuridiquesOuvertes.length)

    const entitésJuridiquesÀSupprimer = await this.extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes)

    console.log('nb entités à delete', entitésJuridiquesÀSupprimer.length)

    await this.entitéJuridiqueHeliosRepository.supprime(entitésJuridiquesÀSupprimer)
    console.log('entités deleted', entitésJuridiquesÀSupprimer.length)

    await this.entitéJuridiqueHeliosRepository.sauvegarde(entitésJuridiquesOuvertes)
  }

  private async extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes: EntitéJuridique[]): Promise<string[]> {
    const entitéJuridiquesEnBase = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()

    return entitéJuridiquesEnBase.filter(
      (entitéJuridiqueEnBase) => !entitésJuridiquesOuvertes.find(
        (entitéJuridiqueOuverte) => entitéJuridiqueOuverte.numéroFinessEntitéJuridique === entitéJuridiqueEnBase
      )
    )
  }
}
