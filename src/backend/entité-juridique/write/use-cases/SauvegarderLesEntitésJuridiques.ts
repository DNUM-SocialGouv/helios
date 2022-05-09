import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitésJuridiquesLoader } from '../entities/EntitésJuridiquesLoader'

export class SauvegarderLesEntitésJuridiques {
  constructor(private readonly entitésJuridiquesFinessLoader: EntitésJuridiquesLoader) {}

  handle(): EntitéJuridique[] {
    const entitésJuridiques = this.entitésJuridiquesFinessLoader.récupérerLesEntitésJuridiques()

    return entitésJuridiques
  }
}
