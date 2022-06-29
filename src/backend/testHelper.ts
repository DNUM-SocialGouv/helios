import { DataSource } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../database/models/ActivitéMédicoSocialModel'
import { DateMiseÀJourSourceModel } from '../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../database/models/ÉtablissementTerritorialIdentitéModel'
import { typeOrmOrm } from './infrastructure/gateways/orm/typeOrmOrm'
import { EnvironmentVariables } from './métier/gateways/EnvironmentVariables'
import { Logger } from './métier/gateways/Logger'

const environmentVariables: EnvironmentVariables = {
  DATABASE_URL: 'postgres://helios:h3li0s@localhost:5433/helios',
  ORM_DEBUG: 'true',
  SENTRY_AUTH_TOKEN: '1234567890',
  SENTRY_DSN: 'https://fake-sentry.io/11',
}

export function getOrm(): Promise<DataSource> {
  return typeOrmOrm(environmentVariables)
}

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}

export const clearAllTables = async (orm: DataSource) => {
  await orm.createQueryBuilder().delete().from(ActivitéMédicoSocialModel).execute()
  await orm.createQueryBuilder().delete().from(ÉtablissementTerritorialIdentitéModel).execute()
  await orm.createQueryBuilder().delete().from(EntitéJuridiqueModel).execute()
  await orm.createQueryBuilder().delete().from(DateMiseÀJourSourceModel).execute()
}

export const numéroFinessEntitéJuridique = '010018407'

export const numéroFinessÉtablissementTerritorial = '123456789'
