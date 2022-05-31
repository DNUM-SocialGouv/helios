import { EntitéJuridiqueLoader } from '../métier/gateways/EntitéJuridiqueLoader'
import { EnvironmentVariables } from '../métier/gateways/EnvironmentVariables'
import { ÉtablissementTerritorialLoader } from '../métier/gateways/ÉtablissementTerritorialLoader'
import { dotEnvConfig } from './gateways/dot-env/dotEnvConfig'
import { TypeOrmEntitéJuridiqueLoader } from './gateways/entité-juridique-loader/TypeOrmEntitéJuridiqueLoader'
import { NodeEnvironmentVariables } from './gateways/environnement-variables/NodeEnvironmentVariables'
import { ConsoleLogger } from './gateways/logger/ConsoleLogger'
import { typeOrmOrm } from './gateways/orm/typeOrmOrm'
import { TypeOrmÉtablissementTerritorialLoader } from './gateways/établissement-territorial-loader/TypeOrmÉtablissementTerritorialLoader'

export type Dependencies = Readonly<{
  environmentVariables: EnvironmentVariables
  entitéJuridiqueLoader: EntitéJuridiqueLoader
  établissementTerritorialLoader: ÉtablissementTerritorialLoader
}>

const _instantiateDependencies = (): Dependencies => {
  dotEnvConfig()
  const logger = new ConsoleLogger()
  const environmentVariables = new NodeEnvironmentVariables(logger)
  const orm = typeOrmOrm(environmentVariables)

  return {
    entitéJuridiqueLoader: new TypeOrmEntitéJuridiqueLoader(orm),
    environmentVariables,
    établissementTerritorialLoader: new TypeOrmÉtablissementTerritorialLoader(orm),
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
