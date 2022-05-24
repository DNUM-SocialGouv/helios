import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialRepository } from '../../../métier/gateways/ÉtablissementTerritorialRepository'

export class TypeOrmÉtablissementTerritorialRepository implements ÉtablissementTerritorialRepository {
  constructor(private readonly orm: Promise<DataSource>) {}

  async sauvegarde(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[], batchSize: number = 20): Promise<void> {
    const établissementsTerritoriauxIdentitéLength = établissementsTerritoriauxIdentité.length

    for (let index = 0; index < établissementsTerritoriauxIdentitéLength; index = index + batchSize) {
      const établissementsTerritoriauxIdentitéBatch = this.créeLeBatch(batchSize, établissementsTerritoriauxIdentité, index)

      await this.metsÀJourLeBatch(établissementsTerritoriauxIdentitéBatch)
    }

    await this.metsÀJourLaDateDeMiseÀJour(établissementsTerritoriauxIdentité)
  }

  private créeLeBatch(batchSize: number, établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[], index: number) {
    const établissementsTerritoriauxIdentitéBatch = []
    for (let indexInBatch = 0; indexInBatch < batchSize; indexInBatch++) {
      if (établissementsTerritoriauxIdentité[index + indexInBatch]) {
        établissementsTerritoriauxIdentitéBatch.push(établissementsTerritoriauxIdentité[index + indexInBatch])
      }
    }
    return établissementsTerritoriauxIdentitéBatch
  }

  private async metsÀJourLaDateDeMiseÀJour(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]) {
    await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .upsert([
        {
          dernièreMiseÀJour: établissementsTerritoriauxIdentité[0].dateMiseAJourSource,
          source: SourceDeDonnées.FINESS,
        },
      ], ['source'])
  }

  private async metsÀJourLeBatch(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]) {
    await(await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .upsert(établissementsTerritoriauxIdentité, ['numéroFinessÉtablissementTerritorial'])
  }
}
