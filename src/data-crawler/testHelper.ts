import { Dependencies } from './infrastructure/dependencies'
import { typeOrmOrm } from './infrastructure/gateways/orm/typeOrmOrm'
import { EnvironmentVariables } from './métier/gateways/EnvironmentVariables'
import { Logger } from './métier/gateways/Logger'

const environmentVariables: EnvironmentVariables = {
  DATABASE_URL: 'postgres://helios:h3li0s@localhost:5433/helios',
  ORM_DEBUG: 'true',
  SENTRY_AUTH_TOKEN: '1234567890',
  SENTRY_DSN: 'https://fake-sentry.io/11',
  SFTP_HOST: 'localhost',
  SFTP_IS_DEBUG: 'false',
  SFTP_LOCAL_PATH: 'data_test',
  SFTP_PASSWORD: 'fake_passw0rd',
  SFTP_PORT: '22',
  SFTP_PRIVATE_KEY: 'privateKey',
  SFTP_USERNAME: 'usr_finess_ls',
}

export function getOrm() {
  return typeOrmOrm(environmentVariables)
}

export const getFakeDataCrawlerDependencies = (): Dependencies => {
  return {
    downloadRawData: { handle: jest.fn() },
    entitéJuridiqueLoader: { récupèreLesEntitésJuridiquesOuvertes: jest.fn() },
    entitéJuridiqueRepository: { sauvegarde: jest.fn() },
    environmentVariables,
    unzipRawData: { handle: jest.fn() },
    établissementTerritorialLoader: { récupèreLesÉtablissementsTerritoriauxOuverts: jest.fn() },
    établissementTerritorialRepository: { sauvegarde: jest.fn() },
  }
}

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}
