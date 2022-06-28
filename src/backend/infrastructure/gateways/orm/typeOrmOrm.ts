import { DataSource, LoggerOptions } from 'typeorm'

import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Orm } from '../../../métier/gateways/Orm'

export const typeOrmOrm: Orm<DataSource> = (environmentVariables: EnvironmentVariables): Promise<DataSource> => {
  const dataSource = new DataSource({
    entities: [__dirname + '/../../../../../database/models/*.ts'],
    logging: [environmentVariables.ORM_DEBUG] as LoggerOptions,
    migrations: ['./../database/migrations/*.{js, ts}'],
    type: 'postgres',
    url: environmentVariables.DATABASE_URL,
  })
  return dataSource.initialize()
}
