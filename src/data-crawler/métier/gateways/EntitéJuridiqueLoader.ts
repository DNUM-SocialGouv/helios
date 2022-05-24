import { EntitéJuridique } from '../entities/EntitéJuridique'

export interface EntitéJuridiqueLoader {
  récupèreLesEntitésJuridiques(): EntitéJuridique[]
}
