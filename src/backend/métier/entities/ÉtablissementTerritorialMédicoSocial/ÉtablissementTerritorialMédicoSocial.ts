import { ÉtablissementTerritorialIdentité } from '../ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocialIdentité } from './ÉtablissementTerritorialMédicoSocialIdentité'

export class ÉtablissementTerritorialMédicoSocial {
  constructor(
    private readonly établissementTerritorialIdentité: ÉtablissementTerritorialIdentité,
    private readonly nombreDÉtablissementsTerritoriauxDansEntitéJuridique: number
  ) {}

  serialize(): ÉtablissementTerritorialMédicoSocialIdentité {
    return {
      ...this.établissementTerritorialIdentité,
      estMonoÉtablissement: this.estMonoÉtablissement(),
    }
  }

  private estMonoÉtablissement() {
    return this.nombreDÉtablissementsTerritoriauxDansEntitéJuridique === 1
  }
}
