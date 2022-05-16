import { DataSource, LoggerOptions } from 'typeorm'

import { DateMiseÀJourSourceEntity } from '../../../../../database/entities/DateMiseÀJourSourceEntity'
import { EntitéJuridiqueEntity } from '../../../../../database/entities/EntitéJuridiqueEntity'
import { ÉtablissementTerritorialIdentitéEntity } from '../../../../../database/entities/ÉtablissementTerritorialIdentitéEntity'
import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Orm } from '../../../métier/gateways/Orm'

export const typeOrmOrm: Orm<DataSource> = async (environmentVariables: EnvironmentVariables): Promise<DataSource> => {
  const dataSource = new DataSource({
    database: environmentVariables['POSTGRES_DB'],
    entities: [DateMiseÀJourSourceEntity, EntitéJuridiqueEntity, ÉtablissementTerritorialIdentitéEntity],
    host: 'localhost',
    logging: [environmentVariables['ORM_DEBUG']] as LoggerOptions,
    migrations: ['./database/migrations/*.ts'],
    password: environmentVariables['POSTGRES_PASSWORD'],
    port: Number(environmentVariables['POSTGRES_PORT']),
    type: 'postgres',
    username: environmentVariables['POSTGRES_USER'],
  })
  await dataSource.initialize()

  return dataSource
}
