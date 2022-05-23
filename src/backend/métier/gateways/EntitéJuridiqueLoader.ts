import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../entities/EntitéJuridiqueNonTrouvée'

export interface EntitéJuridiqueLoader {
  chargeParNuméroFiness(numéroFINESS: string): Promise<EntitéJuridique | EntitéJuridiqueNonTrouvée>
}
