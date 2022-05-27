import { ÉtablissementTerritorialIdentité } from './ÉtablissementTerritorialIdentité'

export class ÉtablissementTerritorialMédicoSocial {
  constructor(
    private readonly établissementTerritorialIdentité: ÉtablissementTerritorialIdentité,
    private readonly nombreDÉtablissementsTerritoriauxDansEntitéJuridique
  ) {
  }
}
