import { EntitéJuridique } from '../entities/entité-juridique/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../entities/EntitéJuridiqueNonTrouvée'
import { EntitéJuridiqueDeRattachement } from '../entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement'

export interface EntitéJuridiqueLoader {
  chargeParNuméroFiness(numéroFiness: string): Promise<EntitéJuridique | EntitéJuridiqueNonTrouvée>
  chargeLEntitéJuridiqueDeRattachement(numéroFiness: string): Promise<EntitéJuridiqueDeRattachement>
}
