import { EntitéJuridique } from '../entities/EntitéJuridique'

export interface EntitéJuridiqueLoader {
    chargeParNuméroFINESS(numéroFINESS: string): Promise<EntitéJuridique>
}
