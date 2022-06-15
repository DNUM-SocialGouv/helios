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
  SFTP_KEX_ALGORITHMS: 'algo1,algo2',
  SFTP_LOCAL_PATH: 'data_test',
  SFTP_PORT: '22',
  SFTP_PRIVATE_KEY: 'privateKey',
  SFTP_USERNAME: 'usr_finess_ls',
}

export function getOrm() {
  return typeOrmOrm(environmentVariables)
}

export const getFakeDataCrawlerDependencies = (): Dependencies => {
  return {
    DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: 1000,
    entitéJuridiqueHeliosLoader: { récupèreLeNuméroFinessDesEntitésJuridiques: jest.fn() },
    entitéJuridiqueHeliosRepository: { sauvegarde: jest.fn(), supprime: jest.fn() },
    entitéJuridiqueSourceExterneLoader: { récupèreLesEntitésJuridiquesOuvertes: jest.fn() },
    environmentVariables,
    finessDownloadRawData: { exécute: jest.fn() },
    unzipRawData: { exécute: jest.fn() },
    établissementTerritorialHeliosLoader: { récupèreLeNuméroFinessDesÉtablissementsTerritoriaux: jest.fn() },
    établissementTerritorialHeliosRepository: { sauvegarde: jest.fn(), supprime: jest.fn() },
    établissementTerritorialSourceExterneLoader: { récupèreLesÉtablissementsTerritoriauxOuverts: jest.fn() },
  }
}

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}
