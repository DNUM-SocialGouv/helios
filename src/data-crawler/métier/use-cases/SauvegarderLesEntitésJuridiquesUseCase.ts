import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitésJuridiquesLoader } from '../gateways/EntitésJuridiquesLoader'

export class SauvegarderLesEntitésJuridiquesUseCase {
  constructor(private readonly entitésJuridiquesFinessLoader: EntitésJuridiquesLoader) {}

  handle(): EntitéJuridique[] {
    const entitésJuridiques = this.entitésJuridiquesFinessLoader.récupérerLesEntitésJuridiques()

    return entitésJuridiques
  }
}
