import { DataSource, LoggerOptions } from 'typeorm'

import { DateMiseÀJourSourceEntity } from '../../../../../migrations/entities/DateMiseÀJourSourceEntity'
import { EntitéJuridiqueEntity } from '../../../../../migrations/entities/EntitéJuridiqueEntity'
import { ÉtablissementTerritorialIdentitéEntity } from '../../../../../migrations/entities/ÉtablissementTerritorialIdentitéEntity'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Orm } from '../../../métier/gateways/Orm'

export const typeOrmOrm: Orm = (environmentVariables: EnvironmentVariables) => async (): Promise<DataSource> => {
  const dataSource = new DataSource({
    database: environmentVariables['POSTGRES_DB'],
    entities: [DateMiseÀJourSourceEntity, EntitéJuridiqueEntity, ÉtablissementTerritorialIdentitéEntity],
    host: 'localhost',
    // logging: [environmentVariables['ORM_DEBUG']] as LoggerOptions,
    logging: 'all',
    migrations: ['./migrations/*.ts'],
    password: environmentVariables['POSTGRES_PASSWORD'],
    port: Number(environmentVariables['POSTGRES_PORT']),
    // sert pour le debug
    // synchronize: true,
    type: 'postgres',
    username: environmentVariables['POSTGRES_USER'],
  })
  await dataSource.initialize()
  // await dataSource.runMigrations()

  return dataSource
}
