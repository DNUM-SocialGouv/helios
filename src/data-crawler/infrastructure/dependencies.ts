import { DownloadRawData } from '../métier/gateways/DownloadRawData'
import { EntitéJuridiqueLoader } from '../métier/gateways/EntitéJuridiqueLoader'
import { EntitéJuridiqueRepository } from '../métier/gateways/EntitéJuridiqueRepository'
import { EnvironmentVariables } from '../métier/gateways/EnvironmentVariables'
import { UnzipRawData } from '../métier/gateways/UnzipRawData'
import { ÉtablissementTerritorialLoader } from '../métier/gateways/ÉtablissementTerritorialLoader'
import { ÉtablissementTerritorialRepository } from '../métier/gateways/ÉtablissementTerritorialRepository'
import { dotEnvConfig } from './gateways/dot-env/dotEnvConfig'
import { SftpDownloadRawData } from './gateways/download-raw-data/SftpDownloadRawData'
import { FinessXmlEntitéJuridiqueLoader } from './gateways/entité-juridique-loader/FinessXmlEntitéJuridiqueLoader'
import { TypeOrmEntitéJuridiqueRepository } from './gateways/entité-juridique-repository/TypeOrmEntitéJuridiqueRepository'
import { NodeEnvironmentVariables } from './gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from './gateways/logger/ConsoleLogger'
import { typeOrmOrm } from './gateways/orm/typeOrmOrm'
import { GunzipUnzipRawData } from './gateways/unzip-raw-data/GunzipUnzipRawData'
import { NodeXmlToJs } from './gateways/xml-to-js/NodeXmlToJs'
import { FinessXmlÉtablissementTerritorialLoader } from './gateways/établissement-territorial-loader/FinessXmlÉtablissementTerritorialLoader'
import { TypeOrmÉtablissementTerritorialRepository } from './gateways/établissement-territorial-repository/TypeOrmÉtablissementTerritorialRepository'

export type Dependencies = Readonly<{
  downloadRawData: DownloadRawData
  environmentVariables: EnvironmentVariables
  entitéJuridiqueLoader: EntitéJuridiqueLoader
  entitéJuridiqueRepository: EntitéJuridiqueRepository
  établissementTerritorialLoader: ÉtablissementTerritorialLoader
  établissementTerritorialRepository: ÉtablissementTerritorialRepository
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
    entitéJuridiqueLoader: new FinessXmlEntitéJuridiqueLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    entitéJuridiqueRepository: new TypeOrmEntitéJuridiqueRepository(orm),
    environmentVariables,
    unzipRawData: new GunzipUnzipRawData(environmentVariables, logger),
    établissementTerritorialLoader: new FinessXmlÉtablissementTerritorialLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    établissementTerritorialRepository: new TypeOrmÉtablissementTerritorialRepository(orm),
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
