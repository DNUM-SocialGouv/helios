import { DataSource, LoggerOptions } from 'typeorm'

import { DateMiseÀJourSourceModel } from '../../../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Orm } from '../../../métier/gateways/Orm'

export const typeOrmOrm: Orm<DataSource> = (environmentVariables: EnvironmentVariables): Promise<DataSource> => {
  const dataSource = new DataSource({
    url: environmentVariables.POSTGRES_URL,
    database: environmentVariables.POSTGRES_DB,
    entities: [DateMiseÀJourSourceModel, EntitéJuridiqueModel, ÉtablissementTerritorialIdentitéModel],
    host: 'localhost',
    logging: [environmentVariables.ORM_DEBUG] as LoggerOptions,
    migrations: ['./src/database/migrations/*.ts'],
    password: environmentVariables.POSTGRES_PASSWORD,
    port: Number(environmentVariables.POSTGRES_PORT),
    type: 'postgres',
    username: environmentVariables.POSTGRES_USER,
  })
  return dataSource.initialize()
}
