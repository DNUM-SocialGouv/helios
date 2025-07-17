import { rmSync } from "fs";

import { Dependencies } from "./infrastructure/dependencies";
import { typeOrmOrm } from "./infrastructure/gateways/orm/typeOrmOrm";
import { EnvironmentVariables } from "./métier/gateways/EnvironmentVariables";
import { Logger } from "./métier/gateways/Logger";

const environmentVariables: EnvironmentVariables = {
  DATABASE_URL: "postgres://helios:h3li0s@localhost:5433/helios",
  DIAMANT_ENCRYPTED_DATA_PATH: "data_test/diamant",
  DNUM_SFTP_HOST: "localhost",
  DNUM_SFTP_PORT: "23",
  DNUM_SFTP_PRIVATE_KEY: "privateDnumKey",
  DNUM_SFTP_USERNAME: "HELIOS",
  ORM_DEBUG: "true",
  SENTRY_AUTH_TOKEN: "1234567890",
  SENTRY_DSN: "https://fake-sentry.io/11",
  SENTRY_ENVIRONMENT: "test",
  SFTP_HOST: "localhost",
  SFTP_IS_DEBUG: "false",
  SFTP_KEX_ALGORITHMS: "algo1,algo2",
  SFTP_LOCAL_PATH: "data_test/sortie",
  SFTP_PORT: "22",
  SFTP_PRIVATE_KEY: "privateKey",
  SFTP_USERNAME: "usr_finess_ls",
  HAPI_DATA_PATH: "",
  HAPI_SFTP_HOST: "",
  HAPI_SFTP_PORT: "",
  HAPI_SFTP_PASSWORD: "",
  HAPI_SFTP_USERNAME: ""
};

export function getOrm() {
  return typeOrmOrm(environmentVariables);
}
export const getFakeDataCrawlerDependencies = (): Dependencies => {
  return {
    DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: 1000,
    dnumDownloadRawData: { exécute: jest.fn() },
    environmentVariables,
    finessDownloadRawData: { exécute: jest.fn() },
    sirecDownloadRawData: { exécute: jest.fn() },
    siiceaDownloadRawData: { exécute: jest.fn() },
    sivssDownloadRawData: { exécute: jest.fn() },
    hapiDownloadRawData: { exécute: jest.fn() },
    logger: fakeLogger,
    unzipRawData: { exécute: jest.fn() },
    controleDonneesSirecLoader: {
      checkDowloadedSirecFile: jest.fn(),
    }
  };
};

export const fakeLogger: Logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

export function supprimerDossier(localPath: string) {
  rmSync(localPath, { recursive: true });
}
