import { DownloadRawData } from '../métier/gateways/DownloadRawData'
import { EntitéJuridiqueLoader } from '../métier/gateways/EntitéJuridiqueLoader'
import { EnvironmentVariables } from '../métier/gateways/EnvironmentVariables'
import { UnzipRawData } from '../métier/gateways/UnzipRawData'
import { ÉtablissementTerritorialLoader } from '../métier/gateways/ÉtablissementTerritorialLoader'
import { dotEnvConfig } from './gateways/dot-env/dotEnvConfig'
import { SftpDownloadRawData } from './gateways/download-raw-data/SftpDownloadRawData'
import { FinessEntitéJuridiqueLoader } from './gateways/entité-juridique-loader/FinessEntitéJuridiqueLoader'
import { NodeEnvironmentVariables } from './gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from './gateways/logger/ConsoleLogger'
import { GunzipUnzipRawData } from './gateways/unzip-raw-data/GunzipUnzipRawData'
import { NodeXmlToJs } from './gateways/xml-to-js/NodeXmlToJs'
import { FinessÉtablissementTerritorialLoader } from './gateways/établissement-territorial-loader/FinessÉtablissementTerritorialLoader'

export type Dependencies = Readonly<{
  downloadRawData: DownloadRawData
  environmentVariables: EnvironmentVariables
  finessEntitéJuridiqueLoader: EntitéJuridiqueLoader
  finessÉtablissementTerritorialLoader: ÉtablissementTerritorialLoader
  unzipRawData: UnzipRawData
}>

const _instantiateDependencies = (): Dependencies => {
  dotEnvConfig()
  const logger = new ConsoleLogger()
  const environmentVariables = new NodeEnvironmentVariables(logger)
  const xmlToJs = new NodeXmlToJs()

  return {
    downloadRawData: new SftpDownloadRawData(environmentVariables, logger),
    environmentVariables,
    finessEntitéJuridiqueLoader: new FinessEntitéJuridiqueLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    finessÉtablissementTerritorialLoader: new FinessÉtablissementTerritorialLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    unzipRawData: new GunzipUnzipRawData(environmentVariables, logger),
  }
}

class DependenciesSingleton {
  private static instance: Dependencies

  static getInstance(): Dependencies {
    if (!DependenciesSingleton.instance) {
      DependenciesSingleton.instance = _instantiateDependencies()
    }

    return DependenciesSingleton.instance
  }
}

export const dependencies = DependenciesSingleton.getInstance()
