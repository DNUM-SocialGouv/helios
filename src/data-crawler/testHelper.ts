import { Dependencies } from './infrastructure/dependencies'
import { typeOrmOrm } from './infrastructure/gateways/orm/typeOrmOrm'
import { EnvironmentVariables } from './métier/gateways/EnvironmentVariables'
import { Logger } from './métier/gateways/Logger'

const environmentVariables: EnvironmentVariables = {
  ORM_DEBUG: 'true',
  POSTGRES_DB: 'helios',
  POSTGRES_PASSWORD: 'h3li0s',
  POSTGRES_PORT: '5433',
  POSTGRES_USER: 'helios',
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

export const fakeDataCrawlerDependencies: Dependencies = {
  dataSourceInit: typeOrmOrm(environmentVariables),
  downloadRawData: { handle: jest.fn() },
  environmentVariables,
  finessEntitéJuridiqueLoader: { récupérerLesEntitésJuridiques: jest.fn() },
  finessEntitéJuridiqueRepository: { save: jest.fn() },
  finessÉtablissementTerritorialLoader: { récupérerLesÉtablissementsTerritoriaux: jest.fn() },
  finessÉtablissementTerritorialRepository: { save: jest.fn() },
  unzipRawData: { handle: jest.fn() },
}

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}
