import { Dependencies } from './infrastructure/dependencies'
import { Logger } from './métier/gateways/Logger'

export const fakeDataCrawlerDependencies: Dependencies = {
  downloadRawData: { handle: jest.fn() },
  environmentVariables: {
    SENTRY_AUTH_TOKEN: '1234567890',
    SENTRY_DSN: 'https://fake-sentry.io/11',
    SFTP_HOST: 'localhost',
    SFTP_IS_DEBUG: 'false',
    SFTP_LOCAL_PATH: 'data_test',
    SFTP_PASSWORD: 'fake_passw0rd',
    SFTP_PORT: '22',
    SFTP_PRIVATE_KEY: 'privateKey',
    SFTP_USERNAME: 'usr_finess_ls',
  },
  finessEntitéJuridiqueLoader: { récupérerLesEntitésJuridiques: jest.fn() },
  finessÉtablissementTerritorialLoader: { récupérerLesÉtablissementsTerritoriaux: jest.fn() },
  unzipRawData: { handle: jest.fn() },
}

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}
