import { HeliosError } from '../../infrastructure/HeliosError'
import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitéJuridiqueHeliosLoader } from '../gateways/EntitéJuridiqueHeliosLoader'
import { EntitéJuridiqueHeliosRepository } from '../gateways/EntitéJuridiqueHeliosRepository'
import { EntitéJuridiqueSourceExterneLoader } from '../gateways/EntitéJuridiqueSourceExterneLoader'

export class MetsÀJourLesEntitésJuridiquesUseCase {
  constructor(
    private readonly entitéJuridiqueSourceExterneLoader: EntitéJuridiqueSourceExterneLoader,
    private readonly entitéJuridiqueHeliosRepository: EntitéJuridiqueHeliosRepository,
    private readonly entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader
  ) {}

  async exécute(): Promise<void> {
    try {
      const entitésJuridiquesOuvertes = this.entitéJuridiqueSourceExterneLoader.récupèreLesEntitésJuridiquesOuvertes()
      const entitéJuridiquesSauvegardées = await this.entitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()

      const entitésJuridiquesÀSupprimer = this.extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes, entitéJuridiquesSauvegardées)
      await this.entitéJuridiqueHeliosRepository.supprime(entitésJuridiquesÀSupprimer)

      await this.entitéJuridiqueHeliosRepository.sauvegarde(entitésJuridiquesOuvertes)
    } catch (error) {
      throw new HeliosError(error.message)
    }
  }

  private extraisLesEntitésJuridiquesRécemmentFermées(entitésJuridiquesOuvertes: EntitéJuridique[], entitéJuridiquesSauvegardées: string[]): string[] {
    return entitéJuridiquesSauvegardées.filter(
      (entitéJuridiqueSauvegardée) => !entitésJuridiquesOuvertes.find(
        (entitéJuridiqueOuverte) => entitéJuridiqueOuverte.numéroFinessEntitéJuridique === entitéJuridiqueSauvegardée
      )
    )
  }
}
