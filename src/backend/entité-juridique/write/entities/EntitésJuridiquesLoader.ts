import { EntitéJuridique } from './EntitéJuridique'

export interface EntitésJuridiquesLoader {
  récupérerLesEntitésJuridiques(): EntitéJuridique[]
}
