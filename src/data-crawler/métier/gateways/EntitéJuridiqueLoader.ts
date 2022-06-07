import { EntitéJuridique } from '../entities/EntitéJuridique'

export interface EntitéJuridiqueLoader {
  récupèreLesEntitésJuridiquesOuvertes(): EntitéJuridique[]
}
