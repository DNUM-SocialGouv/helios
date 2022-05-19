import { EntitéJuridiqueLoader } from '../gateways/EntitéJuridiqueLoader'

export class RécupèreLEntitéJuridiqueUseCase {
  constructor(private établissementJuridiqueLoader: EntitéJuridiqueLoader) {
  }

  async exécute(numéroFINESS: string) {
    return await this.établissementJuridiqueLoader.chargeParNuméroFINESS(numéroFINESS)
  }
}
