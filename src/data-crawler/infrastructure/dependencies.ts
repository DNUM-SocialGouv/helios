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
import { TypeORMEntitéJuridiqueRepository } from './gateways/entité-juridique-repository/TypeORMEntitéJuridiqueRepository'
import { NodeEnvironmentVariables } from './gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from './gateways/logger/ConsoleLogger'
import { typeOrmOrm } from './gateways/orm/typeOrmOrm'
import { GunzipUnzipRawData } from './gateways/unzip-raw-data/GunzipUnzipRawData'
import { NodeXmlToJs } from './gateways/xml-to-js/NodeXmlToJs'
import { FinessÉtablissementTerritorialLoader } from './gateways/établissement-territorial-loader/FinessÉtablissementTerritorialLoader'
import { TypeORMÉtablissementTerritorialRepository } from './gateways/établissement-territorial-repository/TypeORMÉtablissementTerritorialRepository'

export type Dependencies = Readonly<{
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
  const orm = typeOrmOrm(environmentVariables)

  return {
    downloadRawData: new SftpDownloadRawData(environmentVariables, logger),
    environmentVariables,
    finessEntitéJuridiqueLoader: new FinessEntitéJuridiqueLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    finessEntitéJuridiqueRepository: new TypeORMEntitéJuridiqueRepository(orm),
    finessÉtablissementTerritorialLoader: new FinessÉtablissementTerritorialLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    finessÉtablissementTerritorialRepository: new TypeORMÉtablissementTerritorialRepository(orm),
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
