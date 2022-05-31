import { DataSource } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { ÉtablissementTerritorialRattaché } from '../../../métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { ÉtablissementTerritorialRattachéLoader } from '../../../métier/gateways/ÉtablissementTerritorialRattachéLoader'

export class TypeOrmÉtablissementTerritorialRattachéLoader implements ÉtablissementTerritorialRattachéLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement(numéroFinessEntitéJuridique: string): Promise<ÉtablissementTerritorialRattaché[]> {
    const établissementsTerritoriauxModels = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .find({ order: { raisonSociale: 'ASC' }, where: { numéroFinessEntitéJuridique: numéroFinessEntitéJuridique } })

    return établissementsTerritoriauxModels.map((établissementTerritorialModel): ÉtablissementTerritorialRattaché => {
      return {
        domaine: établissementTerritorialModel.domaine,
        numéroFiness: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
        raisonSociale: établissementTerritorialModel.raisonSociale,
      }
    })
  }
}
