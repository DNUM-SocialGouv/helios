import { EntitéJuridique } from '../entities/EntitéJuridique'

export interface EntitéJuridiqueLoader {
  récupérerLesEntitésJuridiques(): EntitéJuridique[]
}
