import knex from 'knex'

import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Orm } from '../../../métier/gateways/Orm'

export const knexOrm: Orm = (environmentVariables: EnvironmentVariables) => {
  return knex({
    client: 'pg',
    connection: {
      database : environmentVariables['POSTGRES_DB'],
      debug: environmentVariables['ORM_DEBUG'] === 'true' ? true : false,
      host : 'localhost',
      password : environmentVariables['POSTGRES_PASSWORD'],
      port : Number(environmentVariables['POSTGRES_PORT']),
      user : environmentVariables['POSTGRES_USER'],
    },
  })
}
