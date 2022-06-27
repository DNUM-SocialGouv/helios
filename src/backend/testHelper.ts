import { typeOrmOrm } from './infrastructure/gateways/orm/typeOrmOrm'
import { EnvironmentVariables } from './métier/gateways/EnvironmentVariables'
import { Logger } from './métier/gateways/Logger'
import { ÉtablissementTerritorialMédicoSocialLoader } from './métier/gateways/ÉtablissementTerritorialMédicoSocialLoader'

const environmentVariables: EnvironmentVariables = {
  DATABASE_URL: 'postgres://helios:h3li0s@localhost:5433/helios',
  ORM_DEBUG: 'true',
  SENTRY_AUTH_TOKEN: '1234567890',
  SENTRY_DSN: 'https://fake-sentry.io/11',
}

export function getOrm() {
  return typeOrmOrm(environmentVariables)
}

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}

export const fakeÉtablissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader =
{
  chargeActivitéParNuméroFiness: jest.fn(),
  chargeIdentitéParNuméroFiness: jest.fn(),
  estUnMonoÉtablissement: jest.fn(),
}
