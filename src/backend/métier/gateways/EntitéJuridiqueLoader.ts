import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../entities/EntitéJuridiqueNonTrouvée'

export interface EntitéJuridiqueLoader {
  chargeParNuméroFINESS(numéroFINESS: string): Promise<EntitéJuridique | EntitéJuridiqueNonTrouvée>
}
