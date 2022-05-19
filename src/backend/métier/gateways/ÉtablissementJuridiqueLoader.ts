import { EntitéJuridique } from '../entities/EntitéJuridique'

export interface ÉtablissementJuridiqueLoader{
    chargeParNuméroFINESS(numéroFINESS: string): Promise<EntitéJuridique>
}
