import { DataSource, LoggerOptions } from 'typeorm'

import { DateMiseÀJourSourceEntity } from '../../../../../migrations/entities/DateMiseÀJourSourceEntity'
import { EntitéJuridiqueEntity } from '../../../../../migrations/entities/EntitéJuridiqueEntity'
import { ÉtablissementTerritorialIdentitéEntity } from '../../../../../migrations/entities/ÉtablissementTerritorialIdentitéEntity'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Orm } from '../../../métier/gateways/Orm'

export const typeOrmOrm: Orm<DataSource> = async (environmentVariables: EnvironmentVariables): Promise<DataSource> => {
  const dataSource = new DataSource({
    database: environmentVariables['POSTGRES_DB'],
    entities: [DateMiseÀJourSourceEntity, EntitéJuridiqueEntity, ÉtablissementTerritorialIdentitéEntity],
    host: 'localhost',
    logging: [environmentVariables['ORM_DEBUG']] as LoggerOptions,
    migrations: ['./migrations/*.ts'],
    password: environmentVariables['POSTGRES_PASSWORD'],
    port: 5433,
    type: 'postgres',
    username: environmentVariables['POSTGRES_USER'],
  })
  await dataSource.initialize()

  return dataSource
}
