import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceEntity, SourceDeDonnées } from '../../../../../migrations/entities/DateMiseÀJourSourceEntity'
import { ÉtablissementTerritorialIdentitéEntity } from '../../../../../migrations/entities/ÉtablissementTerritorialIdentitéEntity'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialRepository } from '../../../métier/gateways/ÉtablissementTerritorialRepository'

export class FinessÉtablissementTerritorialRepository implements ÉtablissementTerritorialRepository {
  constructor(private readonly dataSource: DataSource) {}

  async save(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]): Promise<void> {
    const établissementsTerritoriauxIdentitéLength = établissementsTerritoriauxIdentité.length
    const batchSize = 20

    for (let index = 0; index < établissementsTerritoriauxIdentitéLength; index = index + batchSize) {
      const établissementsTerritoriauxIdentitéBatch = []

      for (let index2 = 0; index2 < batchSize; index2++) {
        if (établissementsTerritoriauxIdentité[index + index2]) {
          établissementsTerritoriauxIdentitéBatch.push(établissementsTerritoriauxIdentité[index + index2])
        }
      }

      await this.dataSource
        .getRepository(ÉtablissementTerritorialIdentitéEntity)
        .upsert(établissementsTerritoriauxIdentitéBatch, ['numéroFinessÉtablissementTerritorial'])
    }

    await this.dataSource
      .getRepository(DateMiseÀJourSourceEntity)
      .upsert([
        {
          dernièreMiseÀJour: établissementsTerritoriauxIdentité[0].dateMiseAJourSource,
          source: SourceDeDonnées.FINESS,
        },
      ], ['source'])
  }
}
