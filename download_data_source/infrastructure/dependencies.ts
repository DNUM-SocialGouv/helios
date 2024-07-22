import * as Sentry from "@sentry/nextjs";
import Ssh2SftpClient from "ssh2-sftp-client";

import { ControleDonneesSirecLoader } from "../métier/gateways/ControleDonnesSirecLoader";
import { DownloadRawData } from "../métier/gateways/DownloadRawData";
import { EntitéJuridiqueHeliosLoader } from "../métier/gateways/EntitéJuridiqueHeliosLoader";
import { EntitéJuridiqueHeliosRepository } from "../métier/gateways/EntitéJuridiqueHeliosRepository";
import { EntitéJuridiqueSourceExterneLoader } from "../métier/gateways/EntitéJuridiqueSourceExterneLoader";
import { EnvironmentVariables } from "../métier/gateways/EnvironmentVariables";
import { Logger } from "../métier/gateways/Logger";
import { StatutsJuridiquesSourceExterneLoader } from "../métier/gateways/StatutsJuridiquesSourceExterneLoader";
import { UnzipRawData } from "../métier/gateways/UnzipRawData";
import { ÉtablissementTerritorialHeliosLoader } from "../métier/gateways/ÉtablissementTerritorialHeliosLoader";
import { ÉtablissementTerritorialRepository } from "../métier/gateways/ÉtablissementTerritorialRepository";
import { ÉtablissementTerritorialSourceExterneLoader } from "../métier/gateways/ÉtablissementTerritorialSourceExterneLoader";
import { dotEnvConfig } from "./gateways/dot-env/dotEnvConfig";
import { DnumSftpDownloadRawData } from "./gateways/download-raw-data/DnumSftpDownloadRawData";
import { FinessSftpDownloadRawData } from "./gateways/download-raw-data/FinessSftpDownloadRawData";
import { HapiSftpDownloadRawData } from "./gateways/download-raw-data/HapiSftpDownloadRawData";
import { SiiceaSftpDownloadRawData } from "./gateways/download-raw-data/SiiceaSftpDownloadRawData";
import { SirecSftpDownloadRawData } from "./gateways/download-raw-data/SirecSftpDownloadRawData";
import { SivssSftpDownloadRawData } from "./gateways/download-raw-data/SivssSftpDownloadRawData";
import { TypeOrmEntitéJuridiqueHeliosLoader } from "./gateways/entité-juridique-helios-loader/TypeOrmEntitéJuridiqueHeliosLoader";
import { TypeOrmEntitéJuridiqueHeliosRepository } from "./gateways/entité-juridique-helios-repository/TypeOrmEntitéJuridiqueHeliosRepository";
import { FinessXmlEntitésJuridiquesSourceExterneLoader } from "./gateways/entité-juridique-source-externe-loader/FinessXmlEntitésJuridiquesSourceExterneLoader";
import { NodeEnvironmentVariables } from "./gateways/environnement-variables/NodeEnvironmentVariables";
import { ConsoleLogger } from "./gateways/logger/ConsoleLogger";
import { typeOrmOrm } from "./gateways/orm/typeOrmOrm";
import { SirecSourceExterneLoader } from "./gateways/sirec-soure-externe-loader/sirecSourceExterneLoader";
import { XMLStatutsJuridiquesSourceExterneLoader } from "./gateways/statuts-juridiques-source-externe-loader/StatutsJuridiquesSourceExterneLoader";
import { GunzipUnzipRawData } from "./gateways/unzip-raw-data/GunzipUnzipRawData";
import { NodeXmlToJs } from "./gateways/xml-to-js/NodeXmlToJs";
import { TypeOrmÉtablissementTerritorialHeliosLoader } from "./gateways/établissement-territorial-helios-loader/TypeOrmÉtablissementTerritorialHeliosLoader";
import { TypeOrmÉtablissementTerritorialRepository } from "./gateways/établissement-territorial-repository/TypeOrmÉtablissementTerritorialRepository";
import { FinessXmlÉtablissementTerritorialSourceExterneLoader } from "./gateways/établissement-territorial-source-externe-loader/FinessXmlÉtablissementTerritorialSourceExterneLoader";

export type Dependencies = Readonly<{
  dnumDownloadRawData: DownloadRawData;
  DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: number;
  environmentVariables: EnvironmentVariables;
  entitéJuridiqueSourceExterneLoader: EntitéJuridiqueSourceExterneLoader;
  entitéJuridiqueHeliosRepository: EntitéJuridiqueHeliosRepository;
  entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader;
  finessDownloadRawData: DownloadRawData;
  sirecDownloadRawData: DownloadRawData;
  siiceaDownloadRawData: DownloadRawData;
  sivssDownloadRawData: DownloadRawData;
  hapiDownloadRawData: DownloadRawData;
  établissementTerritorialSourceExterneLoader: ÉtablissementTerritorialSourceExterneLoader;
  établissementTerritorialHeliosLoader: ÉtablissementTerritorialHeliosLoader;
  établissementTerritorialHeliosRepository: ÉtablissementTerritorialRepository;
  unzipRawData: UnzipRawData;
  catégorisationSourceExterneLoader: StatutsJuridiquesSourceExterneLoader;
  controleDonneesSirecLoader: ControleDonneesSirecLoader;
  logger: Logger;
}>;

const createDependencies = (): Dependencies => {
  dotEnvConfig();
  const finessSftpPath = "/flux_finess";
  const finessLocalPath = "finess";

  /*const sirecSftpPath = "/flux_sirec";
  const sirecLocalPath = "sirec";*/

  const cheminDesFichiersSourcesDiamantSurLeSftpDnum = "DIAMANT/incoming";

  const cheminDesFichiersSourcesSirecSurLeSftpDnum = "SIREC";
  const cheminDesFichiersSourcesSiiceaSurLeSftpDnum = "SIICEA";
  const cheminDesFichiersSourcesSivssSurLeSftpDnum = "SIVSS";

  const cheminDesFichiersSourcesHapiSurLeSftpHapi = "ftps/Infocentre/Production/download/HAPI/anciennes_campagnes";

  const logger = new ConsoleLogger();
  const environmentVariables = new NodeEnvironmentVariables(logger);
  const xmlToJs = new NodeXmlToJs();
  const orm = typeOrmOrm(environmentVariables);
  const typeOrmEntitéJuridiqueHeliosLoader = new TypeOrmEntitéJuridiqueHeliosLoader(orm);

  Sentry.init({
    dsn: environmentVariables.SENTRY_DSN,
    environment: environmentVariables.SENTRY_ENVIRONMENT,
    tracesSampleRate: 1.0,
  });

  return {
    DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: 10000,
    catégorisationSourceExterneLoader: new XMLStatutsJuridiquesSourceExterneLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH, logger),
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
      new Ssh2SftpClient(),
      environmentVariables,
      cheminDesFichiersSourcesHapiSurLeSftpHapi,
      environmentVariables.HAPI_DATA_PATH,
      logger
    ),
    entitéJuridiqueHeliosLoader: typeOrmEntitéJuridiqueHeliosLoader,
    entitéJuridiqueHeliosRepository: new TypeOrmEntitéJuridiqueHeliosRepository(orm, logger),
    entitéJuridiqueSourceExterneLoader: new FinessXmlEntitésJuridiquesSourceExterneLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH, logger, orm),
    environmentVariables,
    finessDownloadRawData: new FinessSftpDownloadRawData(new Ssh2SftpClient(), finessSftpPath, finessLocalPath, environmentVariables, logger),
    controleDonneesSirecLoader: new SirecSourceExterneLoader(environmentVariables.SIREC_DATA_PATH, environmentVariables.CHECKED_SIREC_DATA_PATH, logger),
    logger,
    unzipRawData: new GunzipUnzipRawData(environmentVariables, logger),
    établissementTerritorialHeliosLoader: new TypeOrmÉtablissementTerritorialHeliosLoader(orm),
    établissementTerritorialHeliosRepository: new TypeOrmÉtablissementTerritorialRepository(orm, logger),
    établissementTerritorialSourceExterneLoader: new FinessXmlÉtablissementTerritorialSourceExterneLoader(
      xmlToJs,
      environmentVariables.SFTP_LOCAL_PATH,
      logger,
      orm
    ),
  };
};

export const dependencies = createDependencies();
