import { DataSource, LoggerOptions } from 'typeorm'

import { DateMiseÀJourSourceModel } from '../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'

export const typeOrmOrm: Orm<DataSource> = (environmentVariables: EnvironmentVariables): Promise<DataSource> => {
  const dataSource = new DataSource({
    entities: [DateMiseÀJourSourceModel, EntitéJuridiqueModel, ÉtablissementTerritorialIdentitéModel],
    logging: [environmentVariables.ORM_DEBUG] as LoggerOptions,
    migrations: ['./src/database/migrations/*.{js, ts}'],
    type: 'postgres',
    url: environmentVariables.DATABASE_URL,
  })
  return dataSource.initialize()
}
