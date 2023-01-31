import * as Sentry from "@sentry/nextjs";
import Ssh2SftpClient from "ssh2-sftp-client";

import { CatégorisationSourceExterneLoader } from "../métier/gateways/CatégorisationSourceExterneLoader";
import { DownloadRawData } from "../métier/gateways/DownloadRawData";
import { EntitéJuridiqueHeliosLoader } from "../métier/gateways/EntitéJuridiqueHeliosLoader";
import { EntitéJuridiqueHeliosRepository } from "../métier/gateways/EntitéJuridiqueHeliosRepository";
import { EntitéJuridiqueSourceExterneLoader } from "../métier/gateways/EntitéJuridiqueSourceExterneLoader";
import { EnvironmentVariables } from "../métier/gateways/EnvironmentVariables";
import { UnzipRawData } from "../métier/gateways/UnzipRawData";
import { ÉtablissementTerritorialHeliosLoader } from "../métier/gateways/ÉtablissementTerritorialHeliosLoader";
import { ÉtablissementTerritorialRepository } from "../métier/gateways/ÉtablissementTerritorialRepository";
import { ÉtablissementTerritorialSourceExterneLoader } from "../métier/gateways/ÉtablissementTerritorialSourceExterneLoader";
import { XMLCatégorisationSourceExterneLoader } from "./gateways/catégorisation-source-externe-loader/CatégorisationSourceExterneLoader";
import { dotEnvConfig } from "./gateways/dot-env/dotEnvConfig";
import { DnumSftpDownloadRawData } from "./gateways/download-raw-data/DnumSftpDownloadRawData";
import { FinessSftpDownloadRawData } from "./gateways/download-raw-data/FinessSftpDownloadRawData";
import { TypeOrmEntitéJuridiqueHeliosLoader } from "./gateways/entité-juridique-helios-loader/TypeOrmEntitéJuridiqueHeliosLoader";
import { TypeOrmEntitéJuridiqueHeliosRepository } from "./gateways/entité-juridique-helios-repository/TypeOrmEntitéJuridiqueHeliosRepository";
import { FinessXmlEntitéJuridiqueSourceExterneLoader } from "./gateways/entité-juridique-source-externe-loader/FinessXmlEntitéJuridiqueSourceExterneLoader";
import { NodeEnvironmentVariables } from "./gateways/environnement-variables/NodeEnvironmentVariables";
import { ConsoleLogger } from "./gateways/logger/ConsoleLogger";
import { typeOrmOrm } from "./gateways/orm/typeOrmOrm";
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
  établissementTerritorialSourceExterneLoader: ÉtablissementTerritorialSourceExterneLoader;
  établissementTerritorialHeliosLoader: ÉtablissementTerritorialHeliosLoader;
  établissementTerritorialHeliosRepository: ÉtablissementTerritorialRepository;
  unzipRawData: UnzipRawData;
  catégorisationSourceExterneLoader: CatégorisationSourceExterneLoader;
}>;

const createDependencies = (): Dependencies => {
  dotEnvConfig();
  const finessSftpPath = "../usr_finess/flux_finess";
  const finessLocalPath = "finess";

  const cheminDesFichiersSourcesDiamantSurLeSftpDnum = "DIAMANT/incoming";

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
    DÉLAI_D_ARRÊT_DES_TÂCHES_EN_MS: 1000,
    catégorisationSourceExterneLoader: new XMLCatégorisationSourceExterneLoader(),
    dnumDownloadRawData: new DnumSftpDownloadRawData(
      new Ssh2SftpClient(),
      environmentVariables,
      cheminDesFichiersSourcesDiamantSurLeSftpDnum,
      environmentVariables.DIAMANT_ENCRYPTED_DATA_PATH,
      logger
    ),
    entitéJuridiqueHeliosLoader: typeOrmEntitéJuridiqueHeliosLoader,
    entitéJuridiqueHeliosRepository: new TypeOrmEntitéJuridiqueHeliosRepository(orm, logger),
    entitéJuridiqueSourceExterneLoader: new FinessXmlEntitéJuridiqueSourceExterneLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH, logger),
    environmentVariables,
    finessDownloadRawData: new FinessSftpDownloadRawData(new Ssh2SftpClient(), finessSftpPath, finessLocalPath, environmentVariables, logger),
    unzipRawData: new GunzipUnzipRawData(environmentVariables, logger),
    établissementTerritorialHeliosLoader: new TypeOrmÉtablissementTerritorialHeliosLoader(orm),
    établissementTerritorialHeliosRepository: new TypeOrmÉtablissementTerritorialRepository(orm, logger),
    établissementTerritorialSourceExterneLoader: new FinessXmlÉtablissementTerritorialSourceExterneLoader(
      xmlToJs,
      environmentVariables.SFTP_LOCAL_PATH,
      logger
    ),
  };
};

export const dependencies = createDependencies();
