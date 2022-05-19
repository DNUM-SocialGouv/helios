import { ÉtablissementJuridiqueLoader } from '../gateways/ÉtablissementJuridiqueLoader'

export class RécupèreLEntitéJuridiqueUseCase {
  constructor(private établissementJuridiqueLoader: ÉtablissementJuridiqueLoader) {
  }

  async exécute(numéroFINESS: string) {
    return await this.établissementJuridiqueLoader.chargeParNuméroFINESS(numéroFINESS)
  }
}
