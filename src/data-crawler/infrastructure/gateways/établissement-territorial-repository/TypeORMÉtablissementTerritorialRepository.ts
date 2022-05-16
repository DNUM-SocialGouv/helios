import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceEntity, SourceDeDonnées } from '../../../../../migrations/entities/DateMiseÀJourSourceEntity'
import { ÉtablissementTerritorialIdentitéEntity } from '../../../../../migrations/entities/ÉtablissementTerritorialIdentitéEntity'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialRepository } from '../../../métier/gateways/ÉtablissementTerritorialRepository'

export class TypeORMÉtablissementTerritorialRepository implements ÉtablissementTerritorialRepository {
  constructor(private readonly dataSource: DataSource) {}

  async save(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[], batchSize: number = 20): Promise<void> {
    const établissementsTerritoriauxIdentitéLength = établissementsTerritoriauxIdentité.length

    for (let index = 0; index < établissementsTerritoriauxIdentitéLength; index = index + batchSize) {
      const établissementsTerritoriauxIdentitéBatch = this.createBatch(batchSize, établissementsTerritoriauxIdentité, index)

      await this.upsertBatch(établissementsTerritoriauxIdentitéBatch)
    }

    await this.upsertDateDeMiseÀJour(établissementsTerritoriauxIdentité)
  }

  private createBatch(batchSize: number, établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[], index: number) {
    const établissementsTerritoriauxIdentitéBatch = []
    for (let indexInBatch = 0; indexInBatch < batchSize; indexInBatch++) {
      if (établissementsTerritoriauxIdentité[index + indexInBatch]) {
        établissementsTerritoriauxIdentitéBatch.push(établissementsTerritoriauxIdentité[index + indexInBatch])
      }
    }
    return établissementsTerritoriauxIdentitéBatch
  }

  private async upsertDateDeMiseÀJour(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]) {
    await this.dataSource
      .getRepository(DateMiseÀJourSourceEntity)
      .upsert([
        {
          dernièreMiseÀJour: établissementsTerritoriauxIdentité[0].dateMiseAJourSource,
          source: SourceDeDonnées.FINESS,
        },
      ], ['source'])
  }

  private async upsertBatch(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]) {
    await this.dataSource
      .getRepository(ÉtablissementTerritorialIdentitéEntity)
      .upsert(établissementsTerritoriauxIdentité, ['numéroFinessÉtablissementTerritorial'])
  }
}
