import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { Logger } from '../../../métier/gateways/Logger'
import { ÉtablissementTerritorialRepository } from '../../../métier/gateways/ÉtablissementTerritorialRepository'

export class TypeOrmÉtablissementTerritorialRepository implements ÉtablissementTerritorialRepository {
  private readonly TAILLE_DE_FRAGMENT = 3000

  constructor(private readonly orm: Promise<DataSource>, private logger: Logger) {}

  async sauvegarde(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]): Promise<void> {
    this.logger.info(`[Helios] Sauvegarde ${établissementsTerritoriauxIdentité.length} établissements territoriaux.`)
    await this.sauvegardeLesÉtablissementsTerritoriaux(établissementsTerritoriauxIdentité)
    await this.metsÀJourLaDateDeMiseÀJour(établissementsTerritoriauxIdentité)
  }

  async supprime(numérosFinessDesÉtablissementsTerritoriaux: string[]): Promise<void> {
    const établissementsTerritoriauxÀSupprimer = this.construisLesÉtablissementsTerritoriauxModels(numérosFinessDesÉtablissementsTerritoriaux)
    this.logger.info(`[Helios] Supprime ${établissementsTerritoriauxÀSupprimer.length} établissements territoriaux.`)

    await this.supprimeLesÉtablissementsTerritoriaux(établissementsTerritoriauxÀSupprimer)
  }

  private async supprimeLesÉtablissementsTerritoriaux(établissementsTerritoriauxÀSupprimer: ÉtablissementTerritorialIdentitéModel[]) {
    await (await this.repository()).remove(établissementsTerritoriauxÀSupprimer, { chunk: this.TAILLE_DE_FRAGMENT })
  }

  private construisLesÉtablissementsTerritoriauxModels(numérosFinessDesÉtablissementsTerritoriaux: string[]) {
    return numérosFinessDesÉtablissementsTerritoriaux.map((numéroFiness) => (
      { numéroFinessÉtablissementTerritorial: numéroFiness }
    )) as ÉtablissementTerritorialIdentitéModel[]
  }

  private async metsÀJourLaDateDeMiseÀJour(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]) {
    await (await this.dateMiseÀJourRepository())
      .upsert([
        {
          dernièreMiseÀJour: établissementsTerritoriauxIdentité[0].dateMiseAJourSource,
          source: SourceDeDonnées.FINESS,
        },
      ], ['source'])
  }

  private async sauvegardeLesÉtablissementsTerritoriaux(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]) {
    await (await this.repository()).save(établissementsTerritoriauxIdentité, { chunk: this.TAILLE_DE_FRAGMENT })
  }

  private async repository() {
    return (await this.orm).getRepository(ÉtablissementTerritorialIdentitéModel)
  }

  private async dateMiseÀJourRepository() {
    return (await this.orm).getRepository(DateMiseÀJourSourceModel)
  }
}
