import * as Sentry from "@sentry/nextjs";
import * as ftp from "basic-ftp";
import Ssh2SftpClient from "ssh2-sftp-client";

import { ControleDonneesSirecLoader } from "../métier/gateways/ControleDonnesSirecLoader";
import { DownloadRawData } from "../métier/gateways/DownloadRawData";
import { EnvironmentVariables } from "../métier/gateways/EnvironmentVariables";
import { Logger } from "../métier/gateways/Logger";
import { UnzipRawData } from "../métier/gateways/UnzipRawData";
import { dotEnvConfig } from "./gateways/dot-env/dotEnvConfig";
import { DnumSftpDownloadRawData } from "./gateways/download-raw-data/DnumSftpDownloadRawData";
import { FinessSftpDownloadRawData } from "./gateways/download-raw-data/FinessSftpDownloadRawData";
import { HapiSftpDownloadRawData } from "./gateways/download-raw-data/HapiSftpDownloadRawData";
import { SiiceaSftpDownloadRawData } from "./gateways/download-raw-data/SiiceaSftpDownloadRawData";
import { SirecSftpDownloadRawData } from "./gateways/download-raw-data/SirecSftpDownloadRawData";
import { SivssSftpDownloadRawData } from "./gateways/download-raw-data/SivssSftpDownloadRawData";
import { NodeEnvironmentVariables } from "./gateways/environnement-variables/NodeEnvironmentVariables";
import { ConsoleLogger } from "./gateways/logger/ConsoleLogger";
import { SirecSourceExterneLoader } from "./gateways/sirec-soure-externe-loader/sirecSourceExterneLoader";
import { GunzipUnzipRawData } from "./gateways/unzip-raw-data/GunzipUnzipRawData";

export type Dependencies = Readonly<{
  dnumDownloadRawData: DownloadRawData;
  DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: number;
  environmentVariables: EnvironmentVariables;
  finessDownloadRawData: DownloadRawData;
  sirecDownloadRawData: DownloadRawData;
  siiceaDownloadRawData: DownloadRawData;
  sivssDownloadRawData: DownloadRawData;
  hapiDownloadRawData: DownloadRawData;
  unzipRawData: UnzipRawData;
  controleDonneesSirecLoader: ControleDonneesSirecLoader;
  logger: Logger;
}>;

const createDependencies = (): Dependencies => {
  dotEnvConfig();
  const finessSftpPath = "/flux_finess";
  const finessLocalPath = "finess";

  const cheminDesFichiersSourcesDiamantSurLeSftpDnum = "DIAMANT/incoming";

  const cheminDesFichiersSourcesSirecSurLeSftpDnum = "SIREC";
  const cheminDesFichiersSourcesSiiceaSurLeSftpDnum = "SIICEA";
  const cheminDesFichiersSourcesSivssSurLeSftpDnum = "SIVSS";

  const cheminDesFichiersSourcesHapiSurLeSftpHapi = "ftps/Infocentre/Production/download/HAPI/anciennes_campagnes";

  const logger = new ConsoleLogger();
  const environmentVariables = new NodeEnvironmentVariables(logger);

  Sentry.init({
    dsn: environmentVariables.SENTRY_DSN,
    environment: environmentVariables.SENTRY_ENVIRONMENT,
    tracesSampleRate: 1.0,
  });

  return {
    DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: 10000,
    dnumDownloadRawData: new DnumSftpDownloadRawData(
      new Ssh2SftpClient(),
      environmentVariables,
      cheminDesFichiersSourcesDiamantSurLeSftpDnum,
      environmentVariables.DIAMANT_ENCRYPTED_DATA_PATH,
      logger
    ),
    sirecDownloadRawData: new SirecSftpDownloadRawData(
      new Ssh2SftpClient(),
      environmentVariables,
      cheminDesFichiersSourcesSirecSurLeSftpDnum,
      environmentVariables.SIREC_DATA_PATH,
      logger
    ),
    siiceaDownloadRawData: new SiiceaSftpDownloadRawData(
      new Ssh2SftpClient(),
      environmentVariables,
      cheminDesFichiersSourcesSiiceaSurLeSftpDnum,
      environmentVariables.SIICEA_DATA_PATH,
      logger
    ),
    sivssDownloadRawData: new SivssSftpDownloadRawData(
      new Ssh2SftpClient(),
      environmentVariables,
      cheminDesFichiersSourcesSivssSurLeSftpDnum,
      environmentVariables.SIVSS_DATA_PATH,
      logger
    ),
    hapiDownloadRawData: new HapiSftpDownloadRawData(
      new ftp.Client(),
      environmentVariables,
      cheminDesFichiersSourcesHapiSurLeSftpHapi,
      environmentVariables.HAPI_DATA_PATH,
      logger
    ),
    environmentVariables,
    finessDownloadRawData: new FinessSftpDownloadRawData(new Ssh2SftpClient(), finessSftpPath, finessLocalPath, environmentVariables, logger),
    controleDonneesSirecLoader: new SirecSourceExterneLoader(environmentVariables.SIREC_DATA_PATH, environmentVariables.CHECKED_SIREC_DATA_PATH, logger),
    logger,
    unzipRawData: new GunzipUnzipRawData(environmentVariables, logger),
  };
};

export const dependencies = createDependencies();
