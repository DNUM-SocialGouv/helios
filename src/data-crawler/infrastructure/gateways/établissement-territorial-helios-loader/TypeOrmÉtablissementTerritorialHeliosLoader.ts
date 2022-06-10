import { DataSource } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { ÉtablissementTerritorialHeliosLoader } from '../../../métier/gateways/ÉtablissementTerritorialHeliosLoader'

export class TypeOrmÉtablissementTerritorialHeliosLoader implements ÉtablissementTerritorialHeliosLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async récupèreLeNuméroFinessDesÉtablissementsTerritoriaux(): Promise<string[]> {
    const établissementsTerritoriaux = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .find({ select: { numéroFinessÉtablissementTerritorial: true } })
    return établissementsTerritoriaux
  }
}
