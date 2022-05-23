import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../entities/EntitéJuridiqueNonTrouvée'

export interface EntitéJuridiqueLoader {
  chargeParNuméroFiness(numéroFiness: string): Promise<EntitéJuridique | EntitéJuridiqueNonTrouvée>
}
