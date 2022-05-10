import { EntitéJuridique } from '../entities/EntitéJuridique'

export interface EntitésJuridiquesLoader {
  récupérerLesEntitésJuridiques(): EntitéJuridique[]
}
