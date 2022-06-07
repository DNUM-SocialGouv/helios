import { DownloadRawData } from '../métier/gateways/DownloadRawData'
import { EntitéJuridiqueSourceExterneLoader } from '../métier/gateways/EntitéJuridiqueSourceExterneLoader'
import { EntitéJuridiqueRepository } from '../métier/gateways/EntitéJuridiqueRepository'
import { EnvironmentVariables } from '../métier/gateways/EnvironmentVariables'
import { UnzipRawData } from '../métier/gateways/UnzipRawData'
import { ÉtablissementTerritorialSourceExterneLoader } from '../métier/gateways/ÉtablissementTerritorialSourceExterneLoader'
import { ÉtablissementTerritorialRepository } from '../métier/gateways/ÉtablissementTerritorialRepository'
import { dotEnvConfig } from './gateways/dot-env/dotEnvConfig'
import { SftpDownloadRawData } from './gateways/download-raw-data/SftpDownloadRawData'
import { FinessXmlEntitéJuridiqueSourceExterneLoader } from './gateways/entité-juridique-source-externe-loader/FinessXmlEntitéJuridiqueSourceExterneLoader'
import { TypeOrmEntitéJuridiqueRepository } from './gateways/entité-juridique-repository/TypeOrmEntitéJuridiqueRepository'
import { NodeEnvironmentVariables } from './gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from './gateways/logger/ConsoleLogger'
import { typeOrmOrm } from './gateways/orm/typeOrmOrm'
import { GunzipUnzipRawData } from './gateways/unzip-raw-data/GunzipUnzipRawData'
import { NodeXmlToJs } from './gateways/xml-to-js/NodeXmlToJs'
import { FinessXmlÉtablissementTerritorialSourceExterneLoader } from './gateways/établissement-territorial-loader/FinessXmlÉtablissementTerritorialSourceExterneLoader'
import { TypeOrmÉtablissementTerritorialRepository } from './gateways/établissement-territorial-repository/TypeOrmÉtablissementTerritorialRepository'

export type Dependencies = Readonly<{
  downloadRawData: DownloadRawData
  environmentVariables: EnvironmentVariables
  entitéJuridiqueLoader: EntitéJuridiqueSourceExterneLoader
  entitéJuridiqueRepository: EntitéJuridiqueRepository
  établissementTerritorialLoader: ÉtablissementTerritorialSourceExterneLoader
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
    entitéJuridiqueLoader: new FinessXmlEntitéJuridiqueSourceExterneLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    entitéJuridiqueRepository: new TypeOrmEntitéJuridiqueRepository(orm),
    environmentVariables,
    unzipRawData: new GunzipUnzipRawData(environmentVariables, logger),
    établissementTerritorialLoader: new FinessXmlÉtablissementTerritorialSourceExterneLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
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
