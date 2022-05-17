import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialRepository } from '../../../métier/gateways/ÉtablissementTerritorialRepository'

export class TypeORMÉtablissementTerritorialRepository implements ÉtablissementTerritorialRepository {
  constructor(private readonly orm: Promise<DataSource>) {}

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
    await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .upsert([
        {
          dernièreMiseÀJour: établissementsTerritoriauxIdentité[0].dateMiseAJourSource,
          source: SourceDeDonnées.FINESS,
        },
      ], ['source'])
  }

  private async upsertBatch(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]) {
    await(await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .upsert(établissementsTerritoriauxIdentité, ['numéroFinessÉtablissementTerritorial'])
  }
}
