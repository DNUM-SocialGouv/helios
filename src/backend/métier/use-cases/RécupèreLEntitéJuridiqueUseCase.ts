import { ÉtablissementJuridiqueLoader } from '../gateways/ÉtablissementJuridiqueLoader'

export class RécupèreLEntitéJuridiqueUseCase {
  constructor(private établissementJuridiqueLoader: ÉtablissementJuridiqueLoader) {
  }

  exécute(numéroFINESS: string) {
    return this.établissementJuridiqueLoader.chargeParNuméroFINESS(numéroFINESS)
  }
}
