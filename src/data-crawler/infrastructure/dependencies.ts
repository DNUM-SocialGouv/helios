import { DownloadRawData } from '../métier/gateways/DownloadRawData'
import { EntitéJuridiqueHeliosLoader } from '../métier/gateways/EntitéJuridiqueHeliosLoader'
import { EntitéJuridiqueRepository } from '../métier/gateways/EntitéJuridiqueRepository'
import { EntitéJuridiqueSourceExterneLoader } from '../métier/gateways/EntitéJuridiqueSourceExterneLoader'
import { EnvironmentVariables } from '../métier/gateways/EnvironmentVariables'
import { UnzipRawData } from '../métier/gateways/UnzipRawData'
import { ÉtablissementTerritorialHeliosLoader } from '../métier/gateways/ÉtablissementTerritorialHeliosLoader'
import { ÉtablissementTerritorialRepository } from '../métier/gateways/ÉtablissementTerritorialRepository'
import { ÉtablissementTerritorialSourceExterneLoader } from '../métier/gateways/ÉtablissementTerritorialSourceExterneLoader'
import { dotEnvConfig } from './gateways/dot-env/dotEnvConfig'
import { FinessSftpDownloadRawData } from './gateways/download-raw-data/FinessSftpDownloadRawData'
import { TypeOrmEntitéJuridiqueHeliosLoader } from './gateways/entité-juridique-helios-loader/TypeOrmEntitéJuridiqueHeliosLoader'
import { TypeOrmEntitéJuridiqueRepository } from './gateways/entité-juridique-repository/TypeOrmEntitéJuridiqueRepository'
import { FinessXmlEntitéJuridiqueSourceExterneLoader } from './gateways/entité-juridique-source-externe-loader/FinessXmlEntitéJuridiqueSourceExterneLoader'
import { NodeEnvironmentVariables } from './gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from './gateways/logger/ConsoleLogger'
import { typeOrmOrm } from './gateways/orm/typeOrmOrm'
import { GunzipUnzipRawData } from './gateways/unzip-raw-data/GunzipUnzipRawData'
import { NodeXmlToJs } from './gateways/xml-to-js/NodeXmlToJs'
import { TypeOrmÉtablissementTerritorialHeliosLoader } from './gateways/établissement-territorial-helios-loader/TypeOrmÉtablissementTerritorialHeliosLoader'
import { TypeOrmÉtablissementTerritorialRepository } from './gateways/établissement-territorial-repository/TypeOrmÉtablissementTerritorialRepository'
import { FinessXmlÉtablissementTerritorialSourceExterneLoader } from './gateways/établissement-territorial-source-externe-loader/FinessXmlÉtablissementTerritorialSourceExterneLoader'

export type Dependencies = Readonly<{
  environmentVariables: EnvironmentVariables
  entitéJuridiqueSourceExterneLoader: EntitéJuridiqueSourceExterneLoader
  entitéJuridiqueHeliosRepository: EntitéJuridiqueRepository
  entitéJuridiqueHeliosLoader: EntitéJuridiqueHeliosLoader
  finessDownloadRawData: DownloadRawData
  établissementTerritorialSourceExterneLoader: ÉtablissementTerritorialSourceExterneLoader
  établissementTerritorialHeliosLoader: ÉtablissementTerritorialHeliosLoader
  établissementTerritorialHeliosRepository: ÉtablissementTerritorialRepository
  unzipRawData: UnzipRawData
}>

const _instantiateDependencies = (): Dependencies => {
  dotEnvConfig()
  const logger = new ConsoleLogger()
  const environmentVariables = new NodeEnvironmentVariables(logger)
  const xmlToJs = new NodeXmlToJs()
  const orm = typeOrmOrm(environmentVariables)
  const typeOrmEntitéJuridiqueHeliosLoader = new TypeOrmEntitéJuridiqueHeliosLoader(orm)

  return {
    entitéJuridiqueHeliosLoader: typeOrmEntitéJuridiqueHeliosLoader,
    entitéJuridiqueHeliosRepository: new TypeOrmEntitéJuridiqueRepository(orm),
    entitéJuridiqueSourceExterneLoader: new FinessXmlEntitéJuridiqueSourceExterneLoader(xmlToJs, environmentVariables.SFTP_LOCAL_PATH),
    environmentVariables,
    finessDownloadRawData: new FinessSftpDownloadRawData(environmentVariables, logger),
    unzipRawData: new GunzipUnzipRawData(environmentVariables, logger),
    établissementTerritorialHeliosLoader: new TypeOrmÉtablissementTerritorialHeliosLoader(orm),
    établissementTerritorialHeliosRepository: new TypeOrmÉtablissementTerritorialRepository(orm),
    établissementTerritorialSourceExterneLoader: new FinessXmlÉtablissementTerritorialSourceExterneLoader(
      xmlToJs, environmentVariables.SFTP_LOCAL_PATH
    ),
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
