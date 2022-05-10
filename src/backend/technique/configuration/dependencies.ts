import { EntitésJuridiquesLoader } from '../../métier/entité-juridique/write/entities/EntitésJuridiquesLoader'
import { FinessEntitésJuridiquesLoader } from '../../métier/entité-juridique/write/gateways/FinessEntitésJuridiquesLoader'
import { ÉtablissementTerritorialLoader } from '../../métier/établissement-territorial/write/entities/ÉtablissementTerritorialLoader'
import { FinessÉtablissementTerritorialLoader } from '../../métier/établissement-territorial/write/gateways/FinessÉtablissementTerritorialLoader'
import { DownloadRawData } from '../rawDataTransfer/entities/DownloadRawData'
import { UnzipRawData } from '../rawDataTransfer/entities/UnzipRawData'
import { SftpDownloadRawData } from '../rawDataTransfer/gateways/download-raw-data/SftpDownloadRawData'
import { GunzipUnzipRawData } from '../rawDataTransfer/gateways/unzip-raw-data/GunzipUnzipRawData'
import { EnvironmentVariables } from '../shared/entities/EnvironmentVariables'
import { dotEnvConfig } from '../shared/gateways/dot-env/dotEnvConfig'
import { NodeEnvironmentVariables } from '../shared/gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from '../shared/gateways/logger/ConsoleLogger'
import { NodeXmlToJs } from '../shared/gateways/xml-to-js/NodeXmlToJs'

export type Dependencies = Readonly<{
  downloadRawData: DownloadRawData
  entitésJuridiquesFinessLoader: EntitésJuridiquesLoader
  environmentVariables: EnvironmentVariables
  unzipRawData: UnzipRawData
  établissementTerritorialFinessLoader: ÉtablissementTerritorialLoader
}>

const _instantiateDependencies = (): Dependencies => {
  dotEnvConfig()
  const logger = new ConsoleLogger()
  const environmentVariables = new NodeEnvironmentVariables(logger)
  const xmlToJs = new NodeXmlToJs()

  return {
    downloadRawData: new SftpDownloadRawData(environmentVariables, logger),
    entitésJuridiquesFinessLoader: new FinessEntitésJuridiquesLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    environmentVariables,
    unzipRawData: new GunzipUnzipRawData(environmentVariables, logger),
    établissementTerritorialFinessLoader: new FinessÉtablissementTerritorialLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
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
