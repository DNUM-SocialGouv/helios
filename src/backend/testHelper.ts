import { DataSource } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../database/models/ActivitéMédicoSocialModel'
import { ActivitéSanitaireModel } from '../../database/models/ActivitéSanitaireModel'
import { DateMiseÀJourSourceModel } from '../../database/models/DateMiseÀJourSourceModel'
import { EntitéJuridiqueModel } from '../../database/models/EntitéJuridiqueModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../database/models/ÉtablissementTerritorialIdentitéModel'
import { typeOrmOrm } from './infrastructure/gateways/orm/typeOrmOrm'
import { EnvironmentVariables } from './métier/gateways/EnvironmentVariables'
import { Logger } from './métier/gateways/Logger'

const environmentVariables: EnvironmentVariables = {
  DATABASE_URL: 'postgres://helios:h3li0s@localhost:5433/helios',
  ORM_DEBUG: 'true',
  SCALINGO_TOKEN: 'fake_token',
  SENTRY_AUTH_TOKEN: '1234567890',
  SENTRY_DSN: 'https://fake-sentry.io/11',
  TIME_OF_SERVER_SHUTDOWN_AT_NIGHT: '32400',
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
  await orm.createQueryBuilder().delete().from(ActivitéSanitaireModel).execute()
  await orm.createQueryBuilder().delete().from(ActivitéMédicoSocialModel).execute()
  await orm.createQueryBuilder().delete().from(ÉtablissementTerritorialIdentitéModel).execute()
  await orm.createQueryBuilder().delete().from(EntitéJuridiqueModel).execute()
  await orm.createQueryBuilder().delete().from(DateMiseÀJourSourceModel).execute()
}

export const numéroFinessEntitéJuridique = '010018407'

export const numéroFinessÉtablissementTerritorial = '123456789'
