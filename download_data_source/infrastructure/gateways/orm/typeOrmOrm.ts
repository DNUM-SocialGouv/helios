import { DataSource, LoggerOptions } from 'typeorm'

import dataSource from '../../../../database/dataSource'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Orm } from '../../../métier/gateways/Orm'

export const typeOrmOrm: Orm<DataSource> = (environmentVariables: EnvironmentVariables): Promise<DataSource> => {
  dataSource.setOptions({
    logging: [environmentVariables.ORM_DEBUG] as LoggerOptions,
    url: environmentVariables.DATABASE_URL,
  })
  return dataSource.initialize()
}
