import { EntitéJuridique } from '../entities/EntitéJuridique'
import { EntitéJuridiqueNonTrouvée } from '../entities/EntitéJuridiqueNonTrouvée'
import { EntitéJuridiqueDeRattachement } from '../entities/ÉtablissementTerritorialMédicoSocial/EntitéJuridiqueDeRattachement'

export interface EntitéJuridiqueLoader {
  chargeParNuméroFiness(numéroFiness: string): Promise<EntitéJuridique | EntitéJuridiqueNonTrouvée>
  chargeLEntitéJuridiqueDeRattachement(numéroFiness: string): Promise<EntitéJuridiqueDeRattachement>
}
