import { DataSource, EntityManager } from 'typeorm'

import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { EntitéJuridiqueModel } from '../../../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueHeliosRepository } from '../../../métier/gateways/EntitéJuridiqueHeliosRepository'
import { Logger } from '../../../métier/gateways/Logger'

export class TypeOrmEntitéJuridiqueHeliosRepository implements EntitéJuridiqueHeliosRepository {
  private readonly TAILLE_DE_FRAGMENT = 50

  constructor(private readonly orm: Promise<DataSource>, private logger: Logger) {}

  async sauvegarde(entitésJuridiques: EntitéJuridique[], dateDeMiseAJourDuFichierSource: string): Promise<void> {
    await (await this.orm).transaction(async (transactionalEntityManager: EntityManager) => {
      try {
        await this.sauvegardeLesEntitésJuridiques(transactionalEntityManager, entitésJuridiques)
        this.logger.info(`Sauvegarde ${entitésJuridiques.length} entités juridiques.`)
        await this.metsÀJourLaDateDeMiseÀJourDuFichierSource(transactionalEntityManager, dateDeMiseAJourDuFichierSource)
      } catch (error) {
        this.logger.error(error)
      }
    })
  }

  async supprime(numérosFinessDEntitésJuridiques: string[]): Promise<void> {
    const entitésJuridiquesÀSupprimer = this.construisLesEntitésJuridiquesModels(numérosFinessDEntitésJuridiques)
    await this.supprimeLesEntitésJuridiques(entitésJuridiquesÀSupprimer)
    this.logger.info(`Supprime ${entitésJuridiquesÀSupprimer.length} entités juridiques.`)
  }

  private async sauvegardeLesEntitésJuridiques(entityManager: EntityManager, entitésJuridiques: EntitéJuridique[]) {
    await entityManager
      .getRepository(EntitéJuridiqueModel)
      .save(entitésJuridiques, { chunk: this.TAILLE_DE_FRAGMENT })
  }

  private async metsÀJourLaDateDeMiseÀJourDuFichierSource(entityManager: EntityManager, dateDeMiseAJourDuFichierSource: string): Promise<void> {
    await entityManager
      .getRepository(DateMiseÀJourFichierSourceModel)
      .upsert([
        {
          dernièreMiseÀJour: dateDeMiseAJourDuFichierSource,
          fichier: FichierSource.FINESS_CS1400101,
        },
      ], ['fichier'])
  }

  private async supprimeLesEntitésJuridiques(entitésJuridiquesÀSupprimer: EntitéJuridiqueModel[]) {
    await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .remove(entitésJuridiquesÀSupprimer, { chunk: this.TAILLE_DE_FRAGMENT })
  }

  private construisLesEntitésJuridiquesModels(numérosFinessDEntitésJuridiques: string[]) {
    return numérosFinessDEntitésJuridiques.map((numéroFiness) => {
      return { numéroFinessEntitéJuridique: numéroFiness }
    }) as EntitéJuridiqueModel[]
  }
}
