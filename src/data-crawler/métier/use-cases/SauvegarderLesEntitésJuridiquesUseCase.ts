import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'

export class SauvegarderLesEntitésJuridiquesUseCase {
  constructor(private readonly finessEntitésJuridiquesLoader: EntitéJuridiqueLoader) {}

  handle(): EntitéJuridique[] {
    const entitésJuridiques = this.finessEntitésJuridiquesLoader.récupérerLesEntitésJuridiques()

    return entitésJuridiques
  }
}
