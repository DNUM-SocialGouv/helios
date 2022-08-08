import { DataSource, EntityManager } from 'typeorm'

import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { Logger } from '../../../métier/gateways/Logger'
import { ÉtablissementTerritorialRepository } from '../../../métier/gateways/ÉtablissementTerritorialRepository'

export class TypeOrmÉtablissementTerritorialRepository implements ÉtablissementTerritorialRepository {
  private readonly TAILLE_DE_FRAGMENT = 50

  constructor(private readonly orm: Promise<DataSource>, private logger: Logger) {}

  async sauvegarde(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[], dateDeMiseÀJourDuFichierSource: string): Promise<void> {
    await (await this.orm).transaction(async (transactionalEntityManager: EntityManager) => {
      try {
        await this.sauvegardeLesÉtablissementsTerritoriaux(transactionalEntityManager, établissementsTerritoriauxIdentité)
        this.logger.info(`Sauvegarde ${établissementsTerritoriauxIdentité.length} fiches d’identité d’établissements territoriaux.`)
        await this.metsÀJourLaDateDeMiseÀJourDuFichierSource(transactionalEntityManager, dateDeMiseÀJourDuFichierSource)
      } catch (error) {
        this.logger.error(error)
      }
    })
  }

  async supprime(numérosFinessDesÉtablissementsTerritoriaux: string[]): Promise<void> {
    const établissementsTerritoriauxÀSupprimer = this.construisLesÉtablissementsTerritoriauxModels(numérosFinessDesÉtablissementsTerritoriaux)

    await this.supprimeLesÉtablissementsTerritoriaux(établissementsTerritoriauxÀSupprimer)

    this.logger.info(`Supprime ${établissementsTerritoriauxÀSupprimer.length} fiches d’identité d’établissements territoriaux.`)
  }

  private async metsÀJourLaDateDeMiseÀJourDuFichierSource(entityManager: EntityManager, dateDeMiseAJourDuFichierSource: string): Promise<void> {
    await entityManager
      .getRepository(DateMiseÀJourFichierSourceModel)
      .upsert([
        {
          dernièreMiseÀJour: dateDeMiseAJourDuFichierSource,
          fichier: FichierSource.FINESS_CS1400102,
        },
      ], ['fichier'])
  }

  private async supprimeLesÉtablissementsTerritoriaux(établissementsTerritoriauxÀSupprimer: ÉtablissementTerritorialIdentitéModel[]) {
    await (await this.repository()).remove(établissementsTerritoriauxÀSupprimer, { chunk: this.TAILLE_DE_FRAGMENT })
  }

  private construisLesÉtablissementsTerritoriauxModels(numérosFinessDesÉtablissementsTerritoriaux: string[]) {
    return numérosFinessDesÉtablissementsTerritoriaux.map((numéroFiness) => (
      { numéroFinessÉtablissementTerritorial: numéroFiness }
    )) as ÉtablissementTerritorialIdentitéModel[]
  }

  private async sauvegardeLesÉtablissementsTerritoriaux(entityManager: EntityManager, établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]) {
    await entityManager
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .save(établissementsTerritoriauxIdentité, { chunk: this.TAILLE_DE_FRAGMENT })
  }

  private async repository() {
    return (await this.orm).getRepository(ÉtablissementTerritorialIdentitéModel)
  }
}
