import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { Logger } from '../../../métier/gateways/Logger'
import { ÉtablissementTerritorialRepository } from '../../../métier/gateways/ÉtablissementTerritorialRepository'

export class TypeOrmÉtablissementTerritorialRepository implements ÉtablissementTerritorialRepository {
  private readonly TAILLE_DE_FRAGMENT = 3000

  constructor(private readonly orm: Promise<DataSource>, private logger: Logger) {}

  async sauvegarde(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[], batchSize: number = 20): Promise<void> {
    const établissementsTerritoriauxIdentitéLength = établissementsTerritoriauxIdentité.length
    this.logger.info(`[Helios] Sauvegarde ${établissementsTerritoriauxIdentitéLength} établissements territoriaux.`)

    for (let index = 0; index < établissementsTerritoriauxIdentitéLength; index = index + batchSize) {
      const établissementsTerritoriauxIdentitéBatch = this.créeLeBatch(batchSize, établissementsTerritoriauxIdentité, index)

      await this.metsÀJourLeBatch(établissementsTerritoriauxIdentitéBatch)
    }

    await this.metsÀJourLaDateDeMiseÀJour(établissementsTerritoriauxIdentité)
  }

  async supprime(numérosFinessDesÉtablissementsTerritoriaux: string[]): Promise<void> {
    const établissementsTerritoriauxÀSupprimer = this.construisLesÉtablissementsTerritoriauxModels(numérosFinessDesÉtablissementsTerritoriaux)
    this.logger.info(`[Helios] Supprime ${établissementsTerritoriauxÀSupprimer.length} établissements territoriaux.`)

    await this.supprimeLesÉtablissementsTerritoriaux(établissementsTerritoriauxÀSupprimer)
  }

  private async supprimeLesÉtablissementsTerritoriaux(établissementsTerritoriauxÀSupprimer: ÉtablissementTerritorialIdentitéModel[]) {
    await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .remove(établissementsTerritoriauxÀSupprimer, { chunk: this.TAILLE_DE_FRAGMENT })
  }

  private construisLesÉtablissementsTerritoriauxModels(numérosFinessDesÉtablissementsTerritoriaux: string[]) {
    return numérosFinessDesÉtablissementsTerritoriaux.map((numéroFiness) => (
      { numéroFinessÉtablissementTerritorial: numéroFiness }
    )) as ÉtablissementTerritorialIdentitéModel[]
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
