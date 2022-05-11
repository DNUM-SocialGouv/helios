import { DownloadRawData } from '../métier/gateways/DownloadRawData'
import { EntitéJuridiqueLoader } from '../métier/gateways/EntitéJuridiqueLoader'
import { EntitéJuridiqueRepository } from '../métier/gateways/EntitéJuridiqueRepository'
import { EnvironmentVariables } from '../métier/gateways/EnvironmentVariables'
import { UnzipRawData } from '../métier/gateways/UnzipRawData'
import { ÉtablissementTerritorialLoader } from '../métier/gateways/ÉtablissementTerritorialLoader'
import { ÉtablissementTerritorialRepository } from '../métier/gateways/ÉtablissementTerritorialRepository'
import { dotEnvConfig } from './gateways/dot-env/dotEnvConfig'
import { SftpDownloadRawData } from './gateways/download-raw-data/SftpDownloadRawData'
import { FinessEntitéJuridiqueLoader } from './gateways/entité-juridique-loader/FinessEntitéJuridiqueLoader'
import { FinessEntitéJuridiqueRepository } from './gateways/entité-juridique-repository/FinessEntitéJuridiqueRepository'
import { NodeEnvironmentVariables } from './gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from './gateways/logger/ConsoleLogger'
import { knexOrm } from './gateways/orm/knexOrm'
import { GunzipUnzipRawData } from './gateways/unzip-raw-data/GunzipUnzipRawData'
import { NodeXmlToJs } from './gateways/xml-to-js/NodeXmlToJs'
import { FinessÉtablissementTerritorialLoader } from './gateways/établissement-territorial-loader/FinessÉtablissementTerritorialLoader'
import { FinessÉtablissementTerritorialRepository } from './gateways/établissement-territorial-repository/FinessÉtablissementTerritialRepository'

export type Dependencies = Readonly<{
  database: any
  downloadRawData: DownloadRawData
  environmentVariables: EnvironmentVariables
  finessEntitéJuridiqueLoader: EntitéJuridiqueLoader
  finessEntitéJuridiqueRepository: EntitéJuridiqueRepository
  finessÉtablissementTerritorialLoader: ÉtablissementTerritorialLoader
  finessÉtablissementTerritorialRepository: ÉtablissementTerritorialRepository
  unzipRawData: UnzipRawData
}>

const _instantiateDependencies = (): Dependencies => {
  dotEnvConfig()
  const logger = new ConsoleLogger()
  const environmentVariables = new NodeEnvironmentVariables(logger)
  const xmlToJs = new NodeXmlToJs()
  const database = knexOrm(environmentVariables)

  return {
    database,
    downloadRawData: new SftpDownloadRawData(environmentVariables, logger),
    environmentVariables,
    finessEntitéJuridiqueLoader: new FinessEntitéJuridiqueLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    finessEntitéJuridiqueRepository: new FinessEntitéJuridiqueRepository(database),
    finessÉtablissementTerritorialLoader: new FinessÉtablissementTerritorialLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    finessÉtablissementTerritorialRepository: new FinessÉtablissementTerritorialRepository(database),
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
