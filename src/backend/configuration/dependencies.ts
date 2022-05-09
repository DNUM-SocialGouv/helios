import { EntitésJuridiquesLoader } from '../entité-juridique/write/entities/EntitésJuridiquesLoader'
import { EntitésJuridiquesFinessLoader } from '../entité-juridique/write/gateways/EntitésJuridiquesFinessLoader'
import { DownloadDataSource } from '../shared/entities/DownloadDataSource'
import { EnvironmentVariables } from '../shared/entities/EnvironmentVariables'
import { UnzipDataSource } from '../shared/entities/UnzipDataSource'
import { dotEnvConfig } from '../shared/gateways/dot-env/dotEnvConfig'
import { SftpDownloadDataSource } from '../shared/gateways/download-data-source/SftpDownloadDataSource'
import { NodeEnvironmentVariables } from '../shared/gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from '../shared/gateways/logger/ConsoleLogger'
import { GunzipUnzipDataSource } from '../shared/gateways/unzip-data-source/GunzipUnzipDataSource'
import { NodeXmlToJs } from '../shared/gateways/xml-to-js/NodeXmlToJs'
import { ÉtablissementTerritorialLoader } from '../établissement-territorial/write/entities/ÉtablissementTerritorialLoader'
import { ÉtablissementTerritorialFinessLoader } from '../établissement-territorial/write/gateways/ÉtablissementTerritorialFinessLoader'

export type Dependencies = Readonly<{
  downloadDataSource: DownloadDataSource
  entitésJuridiquesFinessLoader: EntitésJuridiquesLoader
  environmentVariables: EnvironmentVariables
  unzipDataSource: UnzipDataSource
  établissementTerritorialFinessLoader: ÉtablissementTerritorialLoader
}>

const _instantiateDependencies = (): Dependencies => {
  dotEnvConfig()
  const logger = new ConsoleLogger()
  const environmentVariables = new NodeEnvironmentVariables(logger)
  const xmlToJs = new NodeXmlToJs()

  return {
    downloadDataSource: new SftpDownloadDataSource(environmentVariables, logger),
    entitésJuridiquesFinessLoader: new EntitésJuridiquesFinessLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    environmentVariables,
    unzipDataSource: new GunzipUnzipDataSource(environmentVariables, logger),
    établissementTerritorialFinessLoader: new ÉtablissementTerritorialFinessLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
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
